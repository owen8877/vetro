/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  query allPlayers {\n    allPlayers {\n      nodes {\n        ...PlayerItem\n      }\n    }\n  }\n": types.AllPlayersDocument,
    "\n  query myPlayer($uuid: String = \"\") {\n    allPlayers(condition: { uuid: $uuid }, first: 1) {\n      nodes {\n        ...PlayerItem\n      }\n    }\n  }\n": types.MyPlayerDocument,
    "\n  mutation addPlayer($new_player: CreatePlayerInput = { player: { uuid: \"\" } }) {\n    createPlayer(input: $new_player) {\n      player {\n        uuid\n        nodeId\n        username\n      }\n    }\n  }\n": types.AddPlayerDocument,
    "\n  mutation updatePlayerUsername($nodeId: ID = \"\", $username: String = \"\") {\n    updatePlayer(input: { playerPatch: {username: $username}, nodeId: $nodeId }) {\n      clientMutationId\n    }\n  }\n": types.UpdatePlayerUsernameDocument,
    "\n  mutation updatePlayerLastseen($nodeId: ID = \"\", $lastseen: Datetime = \"\") {\n    updatePlayer(input: { playerPatch: {lastseen: $lastseen, }, nodeId: $nodeId }) {\n      clientMutationId\n    }\n  }\n": types.UpdatePlayerLastseenDocument,
    "\n  mutation removePlayer($nodeId: ID = \"\") {\n    deletePlayer(input: { nodeId: $nodeId }) {\n      clientMutationId\n    }\n  }\n": types.RemovePlayerDocument,
    "\n  fragment PlayerItem on Player {\n    id\n    nodeId\n    uuid\n    username\n    lastseen\n  }\n": types.PlayerItemFragmentDoc,
    "\n  query allTestPlayers {\n    allTestPlayers {\n      nodes {\n        ...TestPlayerItem\n      }\n    }\n  }\n": types.AllTestPlayersDocument,
    "\n  mutation addTestPlayer($new_testPlayer: CreateTestPlayerInput = { testPlayer: {} }) {\n    createTestPlayer(input: $new_testPlayer) {\n      testPlayer {\n        username\n      }\n    }\n  }\n": types.AddTestPlayerDocument,
    "\n  mutation removeTestPlayer($nodeId: ID = \"\") {\n    deleteTestPlayer(input: { nodeId: $nodeId }) {\n      testPlayer {\n        username\n      }\n    }\n  }\n": types.RemoveTestPlayerDocument,
    "\n  fragment TestPlayerItem on TestPlayer {\n    id\n    nodeId\n    username\n    uuid\n  }\n": types.TestPlayerItemFragmentDoc,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query allPlayers {\n    allPlayers {\n      nodes {\n        ...PlayerItem\n      }\n    }\n  }\n"): (typeof documents)["\n  query allPlayers {\n    allPlayers {\n      nodes {\n        ...PlayerItem\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query myPlayer($uuid: String = \"\") {\n    allPlayers(condition: { uuid: $uuid }, first: 1) {\n      nodes {\n        ...PlayerItem\n      }\n    }\n  }\n"): (typeof documents)["\n  query myPlayer($uuid: String = \"\") {\n    allPlayers(condition: { uuid: $uuid }, first: 1) {\n      nodes {\n        ...PlayerItem\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation addPlayer($new_player: CreatePlayerInput = { player: { uuid: \"\" } }) {\n    createPlayer(input: $new_player) {\n      player {\n        uuid\n        nodeId\n        username\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation addPlayer($new_player: CreatePlayerInput = { player: { uuid: \"\" } }) {\n    createPlayer(input: $new_player) {\n      player {\n        uuid\n        nodeId\n        username\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation updatePlayerUsername($nodeId: ID = \"\", $username: String = \"\") {\n    updatePlayer(input: { playerPatch: {username: $username}, nodeId: $nodeId }) {\n      clientMutationId\n    }\n  }\n"): (typeof documents)["\n  mutation updatePlayerUsername($nodeId: ID = \"\", $username: String = \"\") {\n    updatePlayer(input: { playerPatch: {username: $username}, nodeId: $nodeId }) {\n      clientMutationId\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation updatePlayerLastseen($nodeId: ID = \"\", $lastseen: Datetime = \"\") {\n    updatePlayer(input: { playerPatch: {lastseen: $lastseen, }, nodeId: $nodeId }) {\n      clientMutationId\n    }\n  }\n"): (typeof documents)["\n  mutation updatePlayerLastseen($nodeId: ID = \"\", $lastseen: Datetime = \"\") {\n    updatePlayer(input: { playerPatch: {lastseen: $lastseen, }, nodeId: $nodeId }) {\n      clientMutationId\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation removePlayer($nodeId: ID = \"\") {\n    deletePlayer(input: { nodeId: $nodeId }) {\n      clientMutationId\n    }\n  }\n"): (typeof documents)["\n  mutation removePlayer($nodeId: ID = \"\") {\n    deletePlayer(input: { nodeId: $nodeId }) {\n      clientMutationId\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment PlayerItem on Player {\n    id\n    nodeId\n    uuid\n    username\n    lastseen\n  }\n"): (typeof documents)["\n  fragment PlayerItem on Player {\n    id\n    nodeId\n    uuid\n    username\n    lastseen\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query allTestPlayers {\n    allTestPlayers {\n      nodes {\n        ...TestPlayerItem\n      }\n    }\n  }\n"): (typeof documents)["\n  query allTestPlayers {\n    allTestPlayers {\n      nodes {\n        ...TestPlayerItem\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation addTestPlayer($new_testPlayer: CreateTestPlayerInput = { testPlayer: {} }) {\n    createTestPlayer(input: $new_testPlayer) {\n      testPlayer {\n        username\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation addTestPlayer($new_testPlayer: CreateTestPlayerInput = { testPlayer: {} }) {\n    createTestPlayer(input: $new_testPlayer) {\n      testPlayer {\n        username\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation removeTestPlayer($nodeId: ID = \"\") {\n    deleteTestPlayer(input: { nodeId: $nodeId }) {\n      testPlayer {\n        username\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation removeTestPlayer($nodeId: ID = \"\") {\n    deleteTestPlayer(input: { nodeId: $nodeId }) {\n      testPlayer {\n        username\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment TestPlayerItem on TestPlayer {\n    id\n    nodeId\n    username\n    uuid\n  }\n"): (typeof documents)["\n  fragment TestPlayerItem on TestPlayer {\n    id\n    nodeId\n    username\n    uuid\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;