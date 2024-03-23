import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useSelector } from '@xstate/react';
import { createActor } from 'xstate';
import { format } from 'date-fns';
import { createBrowserInspector } from '@statelyai/inspect';

import { is_production } from '../../util';
import { PlayerRef, PEvent, ArxivRef, arxivMachine, OnSocketEvent, GameRef } from './machine';
import { UpdatePacket, LocalSend, RemoteSend } from './types';
import localforage from 'localforage';
import lodash from 'lodash';
import { v4 } from 'uuid';
import { useAsync } from 'react-use';

// "undefined" means the URL will be computed from the `window.location` object
const URL = `${is_production ? "" : import.meta.env.VITE_WS_PATH}/test_remote_stone`;
const socket = io(URL, {
  autoConnect: false
});
const { inspect } = createBrowserInspector();

const arxivRef = createActor(arxivMachine, {
  input: {
    broadcaster: {
      from_local: (event: LocalSend) => {
        console.log('[Broadcaster] local -> socket', event);
        socket.emit('local.send', event);
      },
      from_socket: (event) => {
        console.log('[Broadcaster] socket -> local', event);
      },
    },
    gameHook: {
      onIdle() {
        console.log('Doing nothing on this hook since running on client...');
      }
    },
    playerHook: {
      onDeciding() {
        console.log('Cannot Decide!');
      }
    },
  },
  systemId: 'arxiv',
  inspect,
});
arxivRef.start();

const getUUIDFromStorage = async () => {
  const UUID_KEY = 'UUID_KEY';
  const saved_uuid = await localforage.getItem(UUID_KEY);
  if (!lodash.isNull(saved_uuid)) {
    return saved_uuid as string;
  }
  const new_uuid = v4();
  await localforage.setItem(UUID_KEY, new_uuid);
  return new_uuid;
};

function Player({ playerRef, gameRef, arxivRef, myUUID }: { playerRef: PlayerRef, gameRef: GameRef, arxivRef: ArxivRef, myUUID: undefined | string }) {
  const { uuid, winning, systemId, isPlaying, isIdle, isPrePlay, isEnding, isWaiting, isDeciding } = useSelector(playerRef, (snapshot) => ({
    ...snapshot.context,
    isPlaying: snapshot.matches('PLAYING'),
    isIdle: snapshot.matches('IDLE'),
    isPrePlay: snapshot.matches('PRE_PLAY'),
    isEnding: snapshot.matches('ENDING'),
    isWaiting: snapshot.matches({ PLAYING: 'WAITING' }),
    isDeciding: snapshot.matches({ PLAYING: 'DECIDING' }),
  }));
  const { remaining, allNonNilUUIDs, isRegistration } = useSelector(gameRef, (snapshot) => ({
    remaining: snapshot.context.remaining,
    isRegistration: snapshot.matches('REGISTRATION'),
    allNonNilUUIDs: snapshot.context.playerRefs.map((playerRef) => playerRef.getSnapshot().context.uuid).filter(playerRef => playerRef !== undefined),
  }));
  const block = useSelector(arxivRef, (snapshot) => snapshot.context.block);

  const isMe = myUUID && (uuid === myUUID);
  const maxCanTake = Math.min(remaining, 2);

  // The player with the smallest uuid can have the button to start the game
  const isSmallest = (allNonNilUUIDs.length === 0) ? false : (uuid === allNonNilUUIDs.sort()[0]);

  return (
    <div>
      <h3>Player, uuid={uuid}</h3>
      {isMe && <p>This is me!</p>}
      {/* IDLE state */}
      {isIdle && myUUID && isRegistration && <>
        <p>idle, click to</p>
        <button type='button' onClick={() =>
          arxivRef.send({ type: 'onLocal', event: { type: 'register', uuid: myUUID }, to: systemId })
        }>Play</button>
      </>}
      {/* PRE_PLAY state */}
      {isPrePlay && isRegistration && <>
        <p>pre-play</p>
        {isMe && <button type='button' onClick={() =>
          arxivRef.send({ type: 'onLocal', event: { type: 'unregister' }, to: systemId })
        }>Quit!!</button>}
        {isMe && isSmallest && <button type='button' onClick={() => {
          arxivRef.send({ type: 'onLocal', event: { type: 'startPre' }, to: 'game' });
        }}>Start game (since you have the smallest uuid)</button>}
      </>}
      {/* WAITING state */}
      {isWaiting && <>
        <p>Waiting for other players...</p>

      </>}
      {/* DECIDING state: buttons that users can interact to issue the take amount */}
      {!block && isDeciding && isMe && Array.from({ length: maxCanTake }, (_, i) => i).map((i) => {
        const takeAmount = i + 1;
        return <button type='button' onClick={() => {
          const event = { type: "take", value: takeAmount } as PEvent;
          arxivRef.send({ type: 'onLocal', event, to: systemId });
        }}>Take {takeAmount}</button>;
      })
      }
      {/* ENDING state */}
      {isEnding && (
        <>
          {winning ? <p>You win!</p> : <p>Losing, is just another opportunity to shine even brighter!</p>}
          {isSmallest && isMe && <button type='button' onClick={() => {
            arxivRef.send({ type: 'onLocal', event: { type: 'reset' }, to: 'game' });
          }}>Reset game (since you have the smallest uuid)</button>}
        </>
      )}
    </div >
  )
}

export default function TestRemoteStone() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [serverGame, setServerGame] = useState({});
  const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());
  const [myUUID, setMyUUID] = useState<string | undefined>(undefined);
  const sUUID = useAsync(getUUIDFromStorage);

  useEffect(() => {
    setMyUUID(sUUID.value);

    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onSyncGame({ data, error }: UpdatePacket) {
      setLastUpdateTime(Date.now());
      if (data === undefined) {
        console.error(error);
        return;
      }
      setServerGame(data);

      const { context: { exogenous } } = data;
      arxivRef.send({ type: 'onInit', exogenous });
    }

    function onServerGame({ data, error }: UpdatePacket) {
      setLastUpdateTime(Date.now());
      if (data === undefined) {
        console.error(error);
        return;
      }
      setServerGame(data);
    }

    function onRemoteSend(value: RemoteSend) {
      const { event, to } = value;
      arxivRef.send({ type: 'onSocket', event, to, from: 'server' } as OnSocketEvent);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('game.sync', onSyncGame);
    socket.on('game.update', onServerGame);
    socket.on('remote.send', onRemoteSend);
    socket.connect();

    const interval = setInterval(() => {
      socket.emit('game.request');
    }, 3000);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('game.sync', onSyncGame);
      socket.off('game.update', onServerGame);
      socket.off('remote.send', onRemoteSend);
      socket.disconnect();
      clearInterval(interval);
    };
  }, [sUUID]);


  const { gameRef, exogenous, arxivState } = useSelector(arxivRef, (snapshot) => ({
    gameRef: snapshot.context.gameRef,
    exogenous: snapshot.context.exogenous,
    arxivState: JSON.stringify(snapshot.value),
  }));

  const { gameCounter, playerRefs, gameState } = useSelector(gameRef, (snapshot) => ({
    gameCounter: snapshot?.context.remaining,
    playerRefs: snapshot?.context.playerRefs,
    gameState: JSON.stringify(snapshot?.value),
  }));

  return (
    <>
      <p>debug: gameCounter={gameCounter}, gameState={gameState}, arxivState={arxivState}, myUUID={myUUID}</p>
      {arxivRef && gameRef && playerRefs && <ul>
        {playerRefs.map((playerRef, i) => (
          <li key={`player-${i}`}>
            <Player playerRef={playerRef} gameRef={gameRef} arxivRef={arxivRef} myUUID={myUUID} />
          </li>
        ))}
      </ul>}
      <h3>Server side:</h3>
      <p>Last update: {format(new Date(lastUpdateTime), 'dd/MM/yyyy HH:mm:ss')}</p>
      <p>{JSON.stringify(serverGame)}</p>
      <p>Local exogenous={JSON.stringify(exogenous)}, </p>
    </>
  )
}