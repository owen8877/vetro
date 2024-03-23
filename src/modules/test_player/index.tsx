import { useMutation, useQuery } from "@apollo/client";

import { graphql } from "../../gql";
import TestPlayer from "./model";

const allTestPlayersQueryDocument = graphql(/* GraphQL */ `
  query allTestPlayers {
    allTestPlayers {
      nodes {
        ...TestPlayerItem
      }
    }
  }
`);

const addTestPlayerDocument = graphql(/* GraphQL */ `
  mutation addTestPlayer($new_testPlayer: CreateTestPlayerInput = { testPlayer: {} }) {
    createTestPlayer(input: $new_testPlayer) {
      testPlayer {
        username
      }
    }
  }
`);

const removeTestPlayerDocument = graphql(/* GraphQL */ `
  mutation removeTestPlayer($nodeId: ID = "") {
    deleteTestPlayer(input: { nodeId: $nodeId }) {
      testPlayer {
        username
      }
    }
  }
`);

export default function TestPlayers() {
  const [addTestPlayerMutation, { loading: addTestPlayerLoading }] = useMutation(addTestPlayerDocument);
  const [removeTestPlayerMutation, { loading: removeTestPlayerLoading }] = useMutation(removeTestPlayerDocument);
  const { data, loading, error, refetch } = useQuery(allTestPlayersQueryDocument, {
    // pollInterval: 2000,
  });
  if (error) {
    console.error(error);
    return <p>Critical error, see console!</p>;
  }

  function getTestPlayers() {
    return data?.allTestPlayers?.nodes;
  }

  async function addTestPlayer() {
    const { data } = await addTestPlayerMutation({
      variables: { new_testPlayer: { testPlayer: { username: 'cc', uuid: '12345' } } },
    });
    await refetch();
    console.log(`TestPlayer ${data?.createTestPlayer?.testPlayer?.username} is created!`);
  }

  async function removeTestPlayer() {
    const testPlayers = getTestPlayers();
    if ((testPlayers?.length ?? 0) <= 0) {
      console.log('No testPlayer to delete!');
      return;
    }
    const firstNodeId = testPlayers[0].nodeId;
    const { data } = await removeTestPlayerMutation({ variables: { nodeId: firstNodeId } });
    await refetch();
    console.log(`TestPlayer ${data?.deleteTestPlayer?.testPlayer?.username} is deleted!`);
  }

  function renderTestPlayerList() {
    if (loading) {
      return <p>Loading testPlayer list...</p>;
    }
    return (<ul>{
      getTestPlayers()?.map(e => (<TestPlayer testPlayer={e} key={`testPlayer-${e.nodeId}`} />))
    }</ul>);
  }

  return (
    <>
      <button onClick={addTestPlayer} disabled={addTestPlayerLoading}>add testPlayer</button>
      <button onClick={removeTestPlayer} disabled={removeTestPlayerLoading}>remove testPlayer</button>
      {renderTestPlayerList()}
    </>
  );
}
