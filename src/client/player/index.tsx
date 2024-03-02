import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { v4 as uuidv4 } from "uuid";
import { useAsync, useInterval } from "react-use";
import lodash from 'lodash';
import localforage from "localforage";
import { FormEvent, useEffect, useState } from "react";

import { graphql } from "../../gql";
import Player from "./model";

const allPlayersQueryDocument = graphql(/* GraphQL */ `
  query allPlayers {
    allPlayers {
      nodes {
        ...PlayerItem
      }
    }
  }
`);

const myPlayerQueryDocument = graphql(/* GraphQL */ `
  query myPlayer($uuid: String = "") {
    allPlayers(condition: { uuid: $uuid }, first: 1) {
      nodes {
        ...PlayerItem
      }
    }
  }
`);


const addPlayerDocument = graphql(/* GraphQL */ `
  mutation addPlayer($new_player: CreatePlayerInput = { player: { uuid: "" } }) {
    createPlayer(input: $new_player) {
      player {
        uuid
        nodeId
        username
      }
    }
  }
`);

const updatePlayerUsernameDocument = graphql(/* GraphQL */ `
  mutation updatePlayerUsername($nodeId: ID = "", $username: String = "") {
    updatePlayer(input: { playerPatch: {username: $username}, nodeId: $nodeId }) {
      clientMutationId
    }
  }
`);

const updatePlayerLastseenDocument = graphql(/* GraphQL */ `
  mutation updatePlayerLastseen($nodeId: ID = "", $lastseen: Datetime = "") {
    updatePlayer(input: { playerPatch: {lastseen: $lastseen, }, nodeId: $nodeId }) {
      clientMutationId
    }
  }
`);

const removePlayerDocument = graphql(/* GraphQL */ `
  mutation removePlayer($nodeId: ID = "") {
    deletePlayer(input: { nodeId: $nodeId }) {
      clientMutationId
    }
  }
`);

const getUUIDFromStorage = async () => {
  const UUID_KEY = 'UUID_KEY';
  const saved_uuid = await localforage.getItem(UUID_KEY);
  if (!lodash.isNull(saved_uuid)) {
    return saved_uuid as string;
  }
  const new_uuid = uuidv4();
  await localforage.setItem(UUID_KEY, new_uuid);
  return new_uuid;
};

function getPlayers({ sAllPlayers }) {
  return sAllPlayers?.data?.allPlayers?.nodes;
}

function getMyPlayer({ sMyPlayer }) {
  const players = sMyPlayer?.data?.allPlayers?.nodes;
  if (lodash.isUndefined(players) || players.length <= 0) {
    return undefined;
  }
  return players[0];
}

function getPlayersOtherThanMe({ sAllPlayers, sUUID }) {
  const players = getPlayers(sAllPlayers);
  const myUUID = sUUID?.value;
  if (lodash.isUndefined(myUUID)) {
    return players;
  }
  return players?.filter(player => player.uuid !== myUUID);
}

function getUUID({ sUUID }) {
  return sUUID.value;
}

function getCurrentTimeString() {
  return (new Date()).toISOString();
}

export default function Players() {
  const refetches = { refetchQueries: [allPlayersQueryDocument, myPlayerQueryDocument] };
  const [showAdd, setShowAdd] = useState(false);
  const [addPlayer, sAddPlayer] = useMutation(addPlayerDocument, refetches);
  const [showUpdate, setShowUpdate] = useState(false);
  const [updatePlayerL, sUpdatePlayerL] = useMutation(updatePlayerLastseenDocument, refetches);
  const [updatePlayerU, sUpdatePlayerU] = useMutation(updatePlayerUsernameDocument, refetches);
  const [removePlayer, sRemovePlayer] = useMutation(removePlayerDocument, refetches);

  const sAllPlayers = useQuery(allPlayersQueryDocument);
  const sUUID = useAsync(getUUIDFromStorage);
  const [queryMyPlayer, sMyPlayer] = useLazyQuery(myPlayerQueryDocument);

  const [refreshCount, setRefreshCount] = useState(0);

  // Load my player once UUID is ready
  useEffect(() => {
    if (lodash.isNil(sUUID.value)) {
      return;
    }
    queryMyPlayer({ variables: { uuid: sUUID.value } }).then().catch(console.log);
  }, [sUUID.value]);

  useEffect(() => {
    const findsMyPlayer = !lodash.isUndefined(getMyPlayer({ sMyPlayer }));

    setShowAdd(!findsMyPlayer);
    setShowUpdate(findsMyPlayer);
  }, [sMyPlayer.data]);

  useInterval(
    () => {
      if (getUUID({ sUUID })) {
        const job = async () => {
          const myPlayer = getMyPlayer({ sMyPlayer });
          const update = { nodeId: myPlayer?.nodeId, lastseen: getCurrentTimeString() };
          await updatePlayerL({ variables: update, });
        };
        job().then().catch(console.error);
      }
      setRefreshCount(refreshCount + 1);
    },
    5000
  );

  function AddPlayerArea(props: { show: boolean, sUUID }) {
    if (!props.show) {
      return null;
    }

    async function handleAddPlayer(e: FormEvent) {
      e.preventDefault();

      const myUUID = getUUID({ sUUID: props.sUUID }) as string;
      const form = e.target;
      const formData = new FormData(form);
      const formJson = Object.fromEntries(formData.entries());
      const username = formJson.username_input as string;

      const { data } = await addPlayer({
        variables: { new_player: { player: { username, uuid: myUUID, lastseen: getCurrentTimeString() } } },
      });
      console.log(`Player ${data?.createPlayer?.player?.username} is created!`);
    }

    return (<div>
      <form method="post" onSubmit={handleAddPlayer}>
        <label>
          Your username: <input name="username_input" />
        </label>
        <button type="submit">Add me to the party!</button>
      </form>
    </div>)
  }

  function UpdatePlayerArea(props: { show: boolean, sMyPlayer }) {
    if (!props.show) {
      return null;
    }

    async function handleUpdatePlayer(e: FormEvent) {
      e.preventDefault();

      const myPlayer = getMyPlayer({ sMyPlayer: props.sMyPlayer });
      const form = e.target;
      const formData = new FormData(form);
      const formJson = Object.fromEntries(formData.entries());
      const username = formJson.username_input as string;

      await updatePlayerU({ variables: { nodeId: myPlayer?.nodeId, username } });
      console.log(`Player is updated!`);
    }

    async function handleDeletePlayer() {
      const myPlayer = getMyPlayer({ sMyPlayer: props.sMyPlayer });
      await removePlayer({ variables: { nodeId: myPlayer?.nodeId } });
      console.log(`Player deleted!`);
    }

    return (<div>
      <form method="post" onSubmit={handleUpdatePlayer}>
        <label>
          Your username: <input name="username_input" />
        </label>
        <button type="submit">Change my name!</button>
      </form>
      <button type="button" onClick={handleDeletePlayer}>Remove me from server!</button>
    </div>)
  }

  function PlayerList(props: { sAllPlayers, sMyPlayer }) {
    if (sAllPlayers.loading) {
      return <p>Loading player list...</p>;
    }
    const myPlayer = getMyPlayer({ sMyPlayer: props.sMyPlayer });
    return (<ul>{getPlayers({ sAllPlayers: props.sAllPlayers })?.map(
      e => (<li key={`player-${e.nodeId}`}>
        <Player player={e} me={myPlayer?.uuid === e.uuid} />
      </li>)
    )}</ul>);
  }

  return (
    <>
      <AddPlayerArea show={showAdd} sUUID={sUUID} />
      <UpdatePlayerArea show={showUpdate} sMyPlayer={sMyPlayer} />
      <p>My uuid: {sUUID.loading ? '[Loading...]' : sUUID.value}</p>
      <PlayerList sAllPlayers={sAllPlayers} sMyPlayer={sMyPlayer} />
    </>
  );
}