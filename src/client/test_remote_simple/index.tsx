import { useActor, useSelector } from '@xstate/react';

import { gameMachine } from './machine';

function Player({ playerRef }) {
  return (
    <div>
      <h3>Player</h3>
      <button type='button' onClick={() => playerRef.send({ type: 'TAKE', value: 1 })}>Take 1</button>
      <button type='button' onClick={() => playerRef.send({ type: 'TAKE', value: 2 })}>Take 2</button>
    </div>
  )
}

export default function TestRemoteSimple() {
  const [state, send] = useActor(gameMachine, {
    inspect: (inspectionEvent) => {
      if (inspectionEvent.type === '@xstate.snapshot') {
        const { status, context, value } = inspectionEvent.snapshot;
        // if (status === 'active') {
        console.log(status);
        console.log(context);
        console.log(value);
        // }
      }
    }
  });
  const { players, counter } = state.context;

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
    </>
  )
}