import { useActor, useSelector } from '@xstate/react';

import { gameMachine } from './machine';

const selector = (state) => ({
  id: state.context.id,
  existing: state.context.existing,
  last_take: state.context.last_take,
  is_deciding: state.matches('DECIDING'),
  is_winning: state.matches('WINNING'),
  is_losing: state.matches('LOSING'),
});

function Player({ playerRef }) {
  const { id, existing, last_take, is_deciding, is_winning, is_losing } = useSelector(playerRef, selector);

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
        : <p>Last take: {last_take}</p>}
    </div>
  )
}

export default function TestLocalInteraction() {
  const [state, send] = useActor(gameMachine);
  const { players, remaining } = state.context;

  // useEffect(() => {
  //   console.log('State change => ');
  //   console.log(state);
  //   console.log(state.matches('PRE'));
  // }, [state])

  return (
    <>
      <p>debug: error={state.error}, context={JSON.stringify(state.context)}, value={JSON.stringify(state.value)}</p>
      <p>Remaining: {remaining}</p>
      {state.matches('IDLE')
        && <button type='button' onClick={() => send({ type: 'START_PRE' })} >Start pre game!</button>}
      {state.matches('PRE_GAME')
        && <button type='button' onClick={() => send({ type: 'START' })} >Start game!</button>}
      {state.matches('END')
        && <button type='button' onClick={() => send({ type: 'RESET' })} >Reset game!</button>}
      {(state.matches('ROUND') || state.matches('END')) && <ul>
        {players.map(player => (
          <li key={player.id}>
            <Player playerRef={player.ref} />
          </li>
        ))}
      </ul>}
    </>
  )
}