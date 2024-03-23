import { graphql, FragmentType, useFragment } from '../../gql';

export const TestPlayerFragment = graphql(/* GraphQL */ `
  fragment TestPlayerItem on TestPlayer {
    id
    nodeId
    username
    uuid
  }
`);

export const TestPlayer = (props: { testPlayer: FragmentType<typeof TestPlayerFragment> }) => {
  const testPlayer = useFragment(TestPlayerFragment, props.testPlayer);
  return (
    <div>
      <h3>name: {testPlayer.username}</h3>
      <p>uuid: {testPlayer.uuid}; id: {testPlayer.id}</p>
    </div>
  );
};

export default TestPlayer;