import { useActor, useSelector } from '@xstate/react';
import useSWR from 'swr';

import { gameMachine } from './machine';
import { is_development } from '../../server/util';
import useSWRMutation from 'swr/mutation';
import useSWRSubscription from 'swr/subscription';

import { socket } from './socket';
import { useEffect, useState } from 'react';


//OLd
const fetcher = (...args) => fetch(...args).then(res => res.json());
const BASE = is_development ? import.meta.env.VITE_SERVER_PATH : "";
const API = `${BASE}/test_remote_simple/api`;

async function updateUser(url, { arg }: { arg: { type: string, value: number } }) {
  console.log(arg);

  await fetch(url, {
    method: 'POST',
    body: JSON.stringify(arg),
    headers: {
      'Content-Type': 'application/json'
    },
  })
}



function Player({ playerRef }) {

  // const { data, error } = useSWRSubscription("wss://localhost:3000/aa", (key, { next }) => {
  //   const socket = new WebSocket(key)
  //   socket.addEventListener('message', (event) => next(null, event.data))
  //   socket.addEventListener('error', (event) => next(event.error))
  //   return () => socket.close()
  // })

  // if (error) return <div>failed to load</div>
  // if (!data) return <div>loading...</div>
  // return <div>hello {data}!</div>

  // return (
  //   <div>
  //     <h3>Player</h3>
  //     <button type='button' onClick={() => {
  //       const event = { type: 'TAKE', value: 1 };
  //       playerRef.send(event);
  //       trigger(event);
  //     }}>Take 1</button>
  //     <button type='button' onClick={() => {
  //       const event = { type: 'TAKE', value: 2 };
  //       playerRef.send(event);
  //       trigger(event);
  //     }}>Take 2</button>
  //   </div>
  // )
}

export default function TestRemoteSimple() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [fooEvents, setFooEvents] = useState([]);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onFooEvent(value) {
      setFooEvents(previous => [...previous, value]);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('foo', onFooEvent);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('foo', onFooEvent);
    };
  }, []);

  const [state, send] = useActor(gameMachine, {
    // inspect: (inspectionEvent) => {
    //   if (inspectionEvent.type === '@xstate.snapshot') {
    //     const { status, context, value } = inspectionEvent.snapshot;
    //     // if (status === 'active') {
    //     console.log(status);
    //     console.log(context);
    //     console.log(value);
    //     // }
    //   }
    // }
  });
  const { players, counter } = state.context;
  // const serverState = useSWR(`${API}/state`, fetcher, { refreshInterval: 0 });
  // const serverGame = useSWR(`${API}/game`, fetcher, { refreshInterval: 0 });

  return (
    <>
      <p>debug: context={JSON.stringify(state.context)}, value={JSON.stringify(state.value)}</p>
      <p>Counter: {counter}</p>
      {<ul>
        {players.map((player, i) => (
          <li key={`${player},${i}`}>
            <Player playerRef={player.ref} />
          </li>
        ))}
      </ul>}

      <button type='button' onClick={e => {
        socket.emit('aaaa', 1)
      }}>a</button>
      <p>FOO: {JSON.stringify(fooEvents)}</p>
      <h3>Server side:</h3>

      {/* <p>state: {serverState.data?.state}</p>
      <p>game: {JSON.stringify(serverGame.data)}</p>
      {serverState.error && <p>Server error: {JSON.stringify(serverState.error)}</p>} */}
    </>
  )
}