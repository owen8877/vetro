import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useSelector } from '@xstate/react';
import { createActor } from 'xstate';
import { format } from 'date-fns';

import { is_production } from '../../util';
import { PlayerRef, PlayerEvent, ArxivRef, arxivMachine, OnSocketEvent } from './machine';
import { UpdatePacket, LocalSend, RemoteSend } from './types';

// "undefined" means the URL will be computed from the `window.location` object
const URL = `${is_production ? "" : import.meta.env.VITE_WS_PATH}/test_remote_simple`;
const socket = io(URL, {
  autoConnect: false
});

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
    }
  }
});
arxivRef.start();

function Player({ playerRef, arxivRef }: { playerRef: PlayerRef, arxivRef: ArxivRef }) {
  const magic = useSelector(playerRef, (snapshot) => snapshot.context.magic);
  const block = useSelector(arxivRef, (snapshot) => snapshot.context.block);
  return (
    <div>
      <h3>Player, magic={magic}</h3>
      <button type='button' disabled={block} onClick={() => {
        const event = { type: "TAKE", value: 1 } as PlayerEvent;
        arxivRef.send({ type: 'onLocal', event, to: 'player' });
      }}>Take 1</button>
      <button type='button' disabled={block} onClick={() => {
        const event = { type: "TAKE", value: 2 } as PlayerEvent;
        arxivRef.send({ type: 'onLocal', event, to: 'player' });
      }}>Take 2</button>
    </div>
  )
}

export default function TestRemoteSimple() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [serverGame, setServerGame] = useState({});
  const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());

  useEffect(() => {
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

      const { context: { counter, players, exogenous }, state } = data;
      const { magic } = players[0];
      arxivRef.send({ type: 'onInit', game: { counter, state }, player: { magic }, exogenous });
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
  }, []);


  const { gameRef, exogenous } = useSelector(arxivRef, (snapshot) => ({
    gameRef: snapshot.context.gameRef,
    exogenous: snapshot.context.exogenous,
  }));

  const { gameCounter, playerRef } = useSelector(gameRef, (snapshot) => ({
    gameCounter: snapshot?.context.counter,
    playerRef: snapshot?.context.playerRef,
  }));
  const { playerMagic } = useSelector(playerRef, (snapshot) => ({
    playerMagic: snapshot?.context.magic,
  }));

  return (
    <>
      <p>debug: exogenous={JSON.stringify(exogenous)}, gameCounter={gameCounter}, playerMagic={playerMagic}</p>
      {/* {<ul>
        {players.map((player, i) => (
          <li key={`${player},${i}`}>
            <Player playerRef={player.ref} socket={socket} />
          </li>
        ))}
      </ul>} */}
      {(arxivRef && playerRef) && <Player playerRef={playerRef} arxivRef={arxivRef} />}
      <h3>Server side:</h3>
      <p>Last update: {format(new Date(lastUpdateTime), 'dd/MM/yyyy HH:mm:ss')}</p>
      <p>{JSON.stringify(serverGame)}</p>
    </>
  )
}