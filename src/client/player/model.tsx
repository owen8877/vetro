import { formatDistanceToNow, formatDuration, intervalToDuration, parseISO } from 'date-fns';

import { graphql, FragmentType, useFragment } from '../../gql';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';

export const PlayerFragment = graphql(/* GraphQL */ `
  fragment PlayerItem on Player {
    id
    nodeId
    uuid
    username
    lastseen
  }
`);

function findDifference(datetime: string) {
  return intervalToDuration({ start: zonedTimeToUtc(datetime, 'UTC'), end: Date.now() });
}

export const Player = (props: { player: FragmentType<typeof PlayerFragment>, me: boolean }) => {
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