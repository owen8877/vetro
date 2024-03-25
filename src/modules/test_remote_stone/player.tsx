import { memo, useContext } from 'react';

import { useAppSelector } from '../../client/store';
import type { PEvent } from './machine';
import { ArxivDispatchContext, type ArxivDispatch } from '.';
import { remoteStoneSelectors as _S } from './state';

// Why this function keeps running even if the state is not changing?
// Using React.memo to prevent re-rendering
export const Player = memo(function Player({ slot }: { slot: number }) {
	const { send } = useContext<ArxivDispatch>(ArxivDispatchContext);

	const myUUID = useAppSelector(_S.selectMyUUID);
	const { isIdle, isPrePlay, isEnding, isWaiting, isDeciding } = useAppSelector((state) => _S.selectPlayerDerivedBySlot(state, slot));
	const { uuid, winning, systemId } = useAppSelector((state) => _S.selectPlayerContextBySlot(state, slot));

	// Game
	const remaining = useAppSelector(_S.selectGameRemaining);
	const isRegistration = useAppSelector(_S.selectGameRegistration);
	const smallestUUID = useAppSelector(_S.selectGameSmallestUUID);
	const block = useAppSelector(_S.selectArxivBlock);

	// App logic
	const isMe = myUUID && (uuid === myUUID);
	const maxCanTake = Math.min(remaining ?? 0, 2);
	// The player with the smallest uuid can have the button to start the game
	const isSmallest = uuid === smallestUUID;
	const isMeRegistered = useAppSelector(_S.selectMeHasRegistered);

	return (
		<div>
			<h3>Player, uuid={uuid}</h3>
			{isMe && <p>This is me!</p>}
			{/* IDLE state */}
			{isIdle && myUUID && isRegistration && !isMeRegistered && <>
				<p>idle, click to</p>
				<button type='button' onClick={() =>
					send({ type: 'onLocal', event: { type: 'register', uuid: myUUID }, to: systemId })
				}>Play</button>
			</>}
			{/* PRE_PLAY state */}
			{isPrePlay && isRegistration && <>
				<p>pre-play</p>
				{isMe && <button type='button' onClick={() =>
					send({ type: 'onLocal', event: { type: 'unregister' }, to: systemId })
				}>Quit!!</button>}
				{isMe && isSmallest && <button type='button' onClick={() => {
					send({ type: 'onLocal', event: { type: 'startPre' }, to: 'game' });
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
					send({ type: 'onLocal', event, to: systemId });
				}}>Take {takeAmount}</button>;
			})
			}
			{/* ENDING state */}
			{isEnding && (
				<>
					{winning ? <p>You win!</p> : <p>Losing, is just another opportunity to shine even brighter!</p>}
					{isSmallest && isMe && <button type='button' onClick={() => {
						send({ type: 'onLocal', event: { type: 'reset' }, to: 'game' });
					}}>Reset game (since you have the smallest uuid)</button>}
				</>
			)}
		</div >
	)
});