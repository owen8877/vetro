import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useActor } from '@xstate/react';

import { is_production } from '../../server/util';
import { gameMachine } from './machine';

// "undefined" means the URL will be computed from the `window.location` object
const URL = is_production ? "/test_remote_simple" : `${import.meta.env.VITE_WS_PATH}/test_remote_simple`;
const socket = io(URL);

function Player({ playerRef, socket }) {
  return (
    <div>
      <h3>Player</h3>
      <button type='button' onClick={() => {
        const event = { type: 'TAKE', value: 1 };
        playerRef.send(event);
        socket.emit('player.action', event);
      }}>Take 1</button>
      <button type='button' onClick={() => {
        const event = { type: 'TAKE', value: 2 };
        playerRef.send(event);
        socket.emit('player.action', event);
      }}>Take 2</button>
    </div>
  )
}

// TODO: action pool maintained to make sure all actions are synced!

export default function TestRemoteSimple() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [serverGame, setServerGame] = useState({});

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onPlayerResponse(value) {
      console.log((value));
    }

    function onServerGame(value) {
      setServerGame(value);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('player.action.response', onPlayerResponse);
    socket.on('game', onServerGame);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('player.action.response', onPlayerResponse);
      socket.off('game', onServerGame);
    };
  }, []);

  const [state, send] = useActor(gameMachine);
  const { players, counter } = state.context;

  return (
    <>
      <p>debug: context={JSON.stringify(state.context)}, value={JSON.stringify(state.value)}</p>
      <p>Counter: {counter}</p>
      {<ul>
        {players.map((player, i) => (
          <li key={`${player},${i}`}>
            <Player playerRef={player.ref} socket={socket} />
          </li>
        ))}
      </ul>}
      <h3>Server side:</h3>
      <p>{JSON.stringify(serverGame)}</p>
    </>
  )
}