import { formatDuration, intervalToDuration } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';

import { FragmentType, useFragment } from '../../gql';
import { PlayerFragment } from './model';

function findDifference(datetime: string) {
  return intervalToDuration({ start: zonedTimeToUtc(datetime, 'UTC'), end: Date.now() });
}

export type _t_player = FragmentType<typeof PlayerFragment>;

export const Player = (props: { player: _t_player, me: boolean }) => {
  const player = useFragment(PlayerFragment, props.player);

  return (
    <div>
      <h3>{props.me ? "You! " : null}name: {player.username}</h3>
      <p>uuid: {player.uuid}; last seen: {formatDuration(findDifference(player.lastseen), { zero: true })}</p>
      {/* <p>uuid: {player.uuid}; last seen: {formatDistanceToNow(new Date(player.lastseen), { includeSeconds: true })}</p> */}
    </div>
  );
};

export default Player;