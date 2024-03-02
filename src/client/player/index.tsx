import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { v4 as uuidv4 } from "uuid";
import { useAsync, useInterval } from "react-use";
import lodash from 'lodash';
import localforage from "localforage";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Player, _t_player } from "./render";
import { addPlayerDocument, allPlayersQueryDocument, myPlayerQueryDocument, removePlayerDocument, updatePlayerLastseenDocument, updatePlayerUsernameDocument } from "./model";

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

function getCurrentTimeString() {
  return (new Date()).toISOString();
}

function AddPlayerArea(props: { addPlayer, myUUID: string | undefined }) {
  const { addPlayer, myUUID } = props;

  type AddPlayerInput = {
    username: string,
  };
  const fAddPlayer = useForm<AddPlayerInput>({ defaultValues: { username: '' } });

  async function onAddPlayer(data: AddPlayerInput) {
    const username = data.username as string;

    const { data: payload } = await addPlayer({
      variables: { new_player: { player: { username, uuid: myUUID, lastseen: getCurrentTimeString() } } },
    });
    console.log(`Player ${payload?.createPlayer?.player?.username} is created!`);
  }

  if (lodash.isNil(myUUID)) {
    return <p>UUID is still null, cannot add!</p>
  }
  return (<div>
    <form method="post" onSubmit={fAddPlayer.handleSubmit((e) => onAddPlayer(e).then())}>
      <label>
        Your username: <input key='input-create' {...fAddPlayer.register("username")} />
      </label>
      <button type="submit">Add me to the party!</button>
    </form>
  </div>)
}

function UpdatePlayerArea(props: { updatePlayerU, removePlayer, nodeId: string | undefined }) {
  type UpdatePlayerUsernameInput = {
    username: string,
  };
  const fUpdatePlayerUsername = useForm<UpdatePlayerUsernameInput>({ defaultValues: { username: '' } });

  const { updatePlayerU, removePlayer, nodeId } = props;

  async function onUpdatePlayer({ username }: UpdatePlayerUsernameInput) {
    await updatePlayerU({ variables: { nodeId, username } });
    console.log("Player is updated!");
  }

  async function onDeletePlayer() {
    await removePlayer({ variables: { nodeId } });
    console.log("Player deleted!");
  }

  if (lodash.isNil(nodeId)) {
    return <p>nodeId is null, cannot update/remove!</p>
  }
  return (<div>
    <form method="post" onSubmit={fUpdatePlayerUsername.handleSubmit(username => onUpdatePlayer(username).then())}>
      <label>
        Your username: <input key='input-update' {...fUpdatePlayerUsername.register("username")} />
      </label>
      <button type="submit">Change my name!</button>
    </form>
    <button type="button" onClick={onDeletePlayer}>Remove me from server!</button>
  </div>)
}

function PlayerList(props: { allPlayers: _t_player[] | undefined, myPlayer: _t_player | undefined }) {
  const { allPlayers, myPlayer } = props;
  if (lodash.isNil(allPlayers)) {
    return <p>No players found!</p>
  }
  return (<ul>{allPlayers.map(
    e => (<li key={`player-${e.nodeId}`}>
      <Player player={e} me={myPlayer?.uuid === e.uuid} />
    </li>)
  )}</ul>);
}

export default function Players() {
  // Define all static states
  const [myUUID, setMyUUID] = useState<string | undefined>(undefined);
  const [myPlayer, setMyPlayer] = useState<_t_player | undefined>(undefined);
  const [allPlayers, setAllPlayers] = useState<_t_player[] | undefined>(undefined);
  const [refreshCount, setRefreshCount] = useState(0);

  // Define query/mutation documents
  const refetches = { refetchQueries: [allPlayersQueryDocument, myPlayerQueryDocument] };
  const [addPlayer, sAddPlayer] = useMutation(addPlayerDocument, refetches);

  const [updatePlayerL, sUpdatePlayerL] = useMutation(updatePlayerLastseenDocument, refetches);
  const [updatePlayerU, sUpdatePlayerU] = useMutation(updatePlayerUsernameDocument, refetches);
  const [removePlayer, sRemovePlayer] = useMutation(removePlayerDocument, refetches);

  const sAllPlayers = useQuery(allPlayersQueryDocument);
  const sUUID = useAsync(getUUIDFromStorage);
  const [queryMyPlayer, sMyPlayer] = useLazyQuery(myPlayerQueryDocument);
  type _t_sMyPlayer = typeof sMyPlayer;

  // Load my player once UUID is ready
  useEffect(() => {
    const _myUUID = sUUID.value;
    if (lodash.isNil(_myUUID)) {
      return;
    }
    setMyUUID(_myUUID);
    queryMyPlayer({ variables: { uuid: _myUUID } }).then().catch(console.error);
  }, [sUUID, queryMyPlayer]);

  // Make sure that myPlayerAdded reflects sMyPlayer valid
  useEffect(() => {
    if (lodash.isNil(sMyPlayer.data)) {
      return;
    }
    function _get(sMyPlayer: _t_sMyPlayer): _t_player | undefined {
      const players = sMyPlayer?.data?.allPlayers?.nodes;
      if (lodash.isUndefined(players) || players.length <= 0) {
        return undefined;
      }
      return players[0];
    }
    setMyPlayer(_get(sMyPlayer));
  }, [sMyPlayer]);

  useEffect(() => {
    if (sAllPlayers.error) {
      console.error(sAllPlayers.error);
      return;
    }
    setAllPlayers(sAllPlayers?.data?.allPlayers?.nodes);
  }, [sAllPlayers]);

  // Global refresh timer
  useInterval(
    () => {
      setRefreshCount(refreshCount + 1);
      if (lodash.isNil(myUUID)) {
        return;
      }
      const job = async () => {
        const nodeId = myPlayer?.nodeId;
        if (lodash.isNil(nodeId)) {
          return;
        }
        await updatePlayerL({ variables: { nodeId, lastseen: getCurrentTimeString() } });
      };
      job().then().catch(console.error);
    },
    5000
  );

  return (
    <>
      {
        lodash.isNil(myUUID)
          ? <p>Loading uuid...</p>
          : (<>
            {!myPlayer && <AddPlayerArea {...{ addPlayer, myUUID }} />}
            {myPlayer && <UpdatePlayerArea {...{ updatePlayerU, removePlayer, nodeId: myPlayer?.nodeId }} />}
            <p>My uuid: {myUUID}</p>
            {
              sAllPlayers.loading
                ? <p>Loading all players</p>
                : <PlayerList {...{ allPlayers, myPlayer }} />
            }
          </>)
      }
    </>
  );
}