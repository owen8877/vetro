import { graphql } from '../../gql';

export const PlayerFragment = graphql(/* GraphQL */ `
  fragment PlayerItem on Player {
    id
    nodeId
    uuid
    username
    lastseen
  }
`);

export const allPlayersQueryDocument = graphql(/* GraphQL */ `
  query allPlayers {
    allPlayers {
      nodes {
        ...PlayerItem
      }
    }
  }
`);

export const myPlayerQueryDocument = graphql(/* GraphQL */ `
  query myPlayer($uuid: String = "") {
    allPlayers(condition: { uuid: $uuid }, first: 1) {
      nodes {
        ...PlayerItem
      }
    }
  }
`);

export const addPlayerDocument = graphql(/* GraphQL */ `
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

export const updatePlayerUsernameDocument = graphql(/* GraphQL */ `
  mutation updatePlayerUsername($nodeId: ID = "", $username: String = "") {
    updatePlayer(input: { playerPatch: {username: $username}, nodeId: $nodeId }) {
      clientMutationId
    }
  }
`);

export const updatePlayerLastseenDocument = graphql(/* GraphQL */ `
  mutation updatePlayerLastseen($nodeId: ID = "", $lastseen: Datetime = "") {
    updatePlayer(input: { playerPatch: {lastseen: $lastseen, }, nodeId: $nodeId }) {
      clientMutationId
    }
  }
`);

export const removePlayerDocument = graphql(/* GraphQL */ `
  mutation removePlayer($nodeId: ID = "") {
    deletePlayer(input: { nodeId: $nodeId }) {
      clientMutationId
    }
  }
`);