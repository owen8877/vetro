import { useForm } from 'react-hook-form';
import { useActor, useSelector } from '@xstate/react';

import { gameMachine } from './machine';
import { useState } from 'react';

const selector = (state) => ({
  id: state.context.id,
  existing: state.context.existing,
  lastTake: state.context.lastTake,
  is_deciding: state.matches('DECIDING'),
  is_winning: state.matches('WINNING'),
  is_losing: state.matches('LOSING'),
});

function Player({ playerRef }) {
  const { id, existing, lastTake, is_deciding, is_winning, is_losing } = useSelector(playerRef, selector);

  return (
    <div>
      <h3>Player: {id}</h3>
      <p>existing: [{existing.join(',')}]</p>
      {is_winning && <p>Yay!</p>}
      {is_losing && <p>Losing, is just another opportunity to get better!</p>}
      {is_deciding
        ? <div>
          <button type='button' onClick={() => playerRef.send({ type: 'TAKE', value: 1 })}>Take 1</button>
          <button type='button' onClick={() => playerRef.send({ type: 'TAKE', value: 2 })}>Take 2</button>
        </div>
        : <p>Last take: {lastTake}</p>}
    </div>
  )
}

export default function TestRemoteInteraction() {
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
  const { players, remaining } = state.context;

  const { register, handleSubmit } = useForm({ defaultValues: { slots: [] } });
  const [slotsSelected, setSlotsSelected] = useState([false, false, false]);

  function onSubmit({ slots }) {
    const compared = [false, false, false];
    for (let i = 0; i < 3; i++) {
      compared[i] = slots.includes(`${i}`);
    }
    console.log(compared);
    setSlotsSelected(compared);
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Player 0 </label>
          <input
            type='checkbox'
            placeholder='0'
            value='0'
            {...register('slots')}
          />
        </div>
        <div>
          <label>Player 1 </label>
          <input
            type='checkbox'
            placeholder='1'
            value='1'
            {...register('slots')}
          />
        </div>
        <div>
          <label>Player 2 </label>
          <input
            type='checkbox'
            placeholder='2'
            value='2'
            {...register('slots')}
          />
        </div>
        <input type='submit' />
      </form>
      <p>debug: compared={JSON.stringify(slotsSelected)}, error={state.error}, context={JSON.stringify(state.context)}, value={JSON.stringify(state.value)}</p>
      <p>Remaining: {remaining}</p>
      {state.matches('IDLE')
        && <button type='button' onClick={() => send({ type: 'START_PRE' })} >Start pre game!</button>}
      {state.matches('PRE_GAME')
        && <button type='button' onClick={() => send({ type: 'START' })} >Start game!</button>}
      {state.matches('END')
        && <button type='button' onClick={() => send({ type: 'RESET' })} >Reset game!</button>}
      {<ul>
        {players.map((player, i) => (
          <li key={`${player.slot},${i}`}>
            <Player playerRef={player.ref} />
          </li>
        ))}
      </ul>}
    </>
  )
}