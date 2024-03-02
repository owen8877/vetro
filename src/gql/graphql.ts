/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A location in a connection that can be used for resuming pagination. */
  Cursor: { input: any; output: any; }
  /**
   * A point in time as described by the [ISO
   * 8601](https://en.wikipedia.org/wiki/ISO_8601) and, if it has a timezone, [RFC
   * 3339](https://datatracker.ietf.org/doc/html/rfc3339) standards. Input values
   * that do not conform to both ISO 8601 and RFC 3339 may be coerced, which may lead
   * to unexpected results.
   */
  Datetime: { input: any; output: any; }
};

/** All input for the create `Player` mutation. */
export type CreatePlayerInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `Player` to be created by this mutation. */
  player: PlayerInput;
};

/** The output of our create `Player` mutation. */
export type CreatePlayerPayload = {
  __typename?: 'CreatePlayerPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `Player` that was created by this mutation. */
  player?: Maybe<Player>;
  /** An edge for our `Player`. May be used by Relay 1. */
  playerEdge?: Maybe<PlayersEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our create `Player` mutation. */
export type CreatePlayerPayloadPlayerEdgeArgs = {
  orderBy?: Array<PlayersOrderBy>;
};

/** All input for the create `_PrismaMigration` mutation. */
export type CreatePrismaMigrationInput = {
  /** The `_PrismaMigration` to be created by this mutation. */
  _prismaMigration: _PrismaMigrationInput;
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

/** The output of our create `_PrismaMigration` mutation. */
export type CreatePrismaMigrationPayload = {
  __typename?: 'CreatePrismaMigrationPayload';
  /** The `_PrismaMigration` that was created by this mutation. */
  _prismaMigration?: Maybe<_PrismaMigration>;
  /** An edge for our `_PrismaMigration`. May be used by Relay 1. */
  _prismaMigrationEdge?: Maybe<_PrismaMigrationsEdge>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our create `_PrismaMigration` mutation. */
export type CreatePrismaMigrationPayload_PrismaMigrationEdgeArgs = {
  orderBy?: Array<_PrismaMigrationsOrderBy>;
};

/** All input for the create `TestPlayer` mutation. */
export type CreateTestPlayerInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `TestPlayer` to be created by this mutation. */
  testPlayer: TestPlayerInput;
};

/** The output of our create `TestPlayer` mutation. */
export type CreateTestPlayerPayload = {
  __typename?: 'CreateTestPlayerPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `TestPlayer` that was created by this mutation. */
  testPlayer?: Maybe<TestPlayer>;
  /** An edge for our `TestPlayer`. May be used by Relay 1. */
  testPlayerEdge?: Maybe<TestPlayersEdge>;
};


/** The output of our create `TestPlayer` mutation. */
export type CreateTestPlayerPayloadTestPlayerEdgeArgs = {
  orderBy?: Array<TestPlayersOrderBy>;
};

/** All input for the `deletePlayerById` mutation. */
export type DeletePlayerByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
};

/** All input for the `deletePlayer` mutation. */
export type DeletePlayerInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Player` to be deleted. */
  nodeId: Scalars['ID']['input'];
};

/** The output of our delete `Player` mutation. */
export type DeletePlayerPayload = {
  __typename?: 'DeletePlayerPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  deletedPlayerId?: Maybe<Scalars['ID']['output']>;
  /** The `Player` that was deleted by this mutation. */
  player?: Maybe<Player>;
  /** An edge for our `Player`. May be used by Relay 1. */
  playerEdge?: Maybe<PlayersEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our delete `Player` mutation. */
export type DeletePlayerPayloadPlayerEdgeArgs = {
  orderBy?: Array<PlayersOrderBy>;
};

/** All input for the `deletePrismaMigrationById` mutation. */
export type DeletePrismaMigrationByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
};

/** All input for the `deletePrismaMigration` mutation. */
export type DeletePrismaMigrationInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `_PrismaMigration` to be deleted. */
  nodeId: Scalars['ID']['input'];
};

/** The output of our delete `_PrismaMigration` mutation. */
export type DeletePrismaMigrationPayload = {
  __typename?: 'DeletePrismaMigrationPayload';
  /** The `_PrismaMigration` that was deleted by this mutation. */
  _prismaMigration?: Maybe<_PrismaMigration>;
  /** An edge for our `_PrismaMigration`. May be used by Relay 1. */
  _prismaMigrationEdge?: Maybe<_PrismaMigrationsEdge>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  deletedPrismaMigrationId?: Maybe<Scalars['ID']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our delete `_PrismaMigration` mutation. */
export type DeletePrismaMigrationPayload_PrismaMigrationEdgeArgs = {
  orderBy?: Array<_PrismaMigrationsOrderBy>;
};

/** All input for the `deleteTestPlayerById` mutation. */
export type DeleteTestPlayerByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
};

/** All input for the `deleteTestPlayer` mutation. */
export type DeleteTestPlayerInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `TestPlayer` to be deleted. */
  nodeId: Scalars['ID']['input'];
};

/** The output of our delete `TestPlayer` mutation. */
export type DeleteTestPlayerPayload = {
  __typename?: 'DeleteTestPlayerPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  deletedTestPlayerId?: Maybe<Scalars['ID']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `TestPlayer` that was deleted by this mutation. */
  testPlayer?: Maybe<TestPlayer>;
  /** An edge for our `TestPlayer`. May be used by Relay 1. */
  testPlayerEdge?: Maybe<TestPlayersEdge>;
};


/** The output of our delete `TestPlayer` mutation. */
export type DeleteTestPlayerPayloadTestPlayerEdgeArgs = {
  orderBy?: Array<TestPlayersOrderBy>;
};

/** The root mutation type which contains root level fields which mutate data. */
export type Mutation = {
  __typename?: 'Mutation';
  /** Creates a single `Player`. */
  createPlayer?: Maybe<CreatePlayerPayload>;
  /** Creates a single `_PrismaMigration`. */
  createPrismaMigration?: Maybe<CreatePrismaMigrationPayload>;
  /** Creates a single `TestPlayer`. */
  createTestPlayer?: Maybe<CreateTestPlayerPayload>;
  /** Deletes a single `Player` using its globally unique id. */
  deletePlayer?: Maybe<DeletePlayerPayload>;
  /** Deletes a single `Player` using a unique key. */
  deletePlayerById?: Maybe<DeletePlayerPayload>;
  /** Deletes a single `_PrismaMigration` using its globally unique id. */
  deletePrismaMigration?: Maybe<DeletePrismaMigrationPayload>;
  /** Deletes a single `_PrismaMigration` using a unique key. */
  deletePrismaMigrationById?: Maybe<DeletePrismaMigrationPayload>;
  /** Deletes a single `TestPlayer` using its globally unique id. */
  deleteTestPlayer?: Maybe<DeleteTestPlayerPayload>;
  /** Deletes a single `TestPlayer` using a unique key. */
  deleteTestPlayerById?: Maybe<DeleteTestPlayerPayload>;
  /** Updates a single `Player` using its globally unique id and a patch. */
  updatePlayer?: Maybe<UpdatePlayerPayload>;
  /** Updates a single `Player` using a unique key and a patch. */
  updatePlayerById?: Maybe<UpdatePlayerPayload>;
  /** Updates a single `_PrismaMigration` using its globally unique id and a patch. */
  updatePrismaMigration?: Maybe<UpdatePrismaMigrationPayload>;
  /** Updates a single `_PrismaMigration` using a unique key and a patch. */
  updatePrismaMigrationById?: Maybe<UpdatePrismaMigrationPayload>;
  /** Updates a single `TestPlayer` using its globally unique id and a patch. */
  updateTestPlayer?: Maybe<UpdateTestPlayerPayload>;
  /** Updates a single `TestPlayer` using a unique key and a patch. */
  updateTestPlayerById?: Maybe<UpdateTestPlayerPayload>;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreatePlayerArgs = {
  input: CreatePlayerInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreatePrismaMigrationArgs = {
  input: CreatePrismaMigrationInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateTestPlayerArgs = {
  input: CreateTestPlayerInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePlayerArgs = {
  input: DeletePlayerInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePlayerByIdArgs = {
  input: DeletePlayerByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePrismaMigrationArgs = {
  input: DeletePrismaMigrationInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePrismaMigrationByIdArgs = {
  input: DeletePrismaMigrationByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteTestPlayerArgs = {
  input: DeleteTestPlayerInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteTestPlayerByIdArgs = {
  input: DeleteTestPlayerByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePlayerArgs = {
  input: UpdatePlayerInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePlayerByIdArgs = {
  input: UpdatePlayerByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePrismaMigrationArgs = {
  input: UpdatePrismaMigrationInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePrismaMigrationByIdArgs = {
  input: UpdatePrismaMigrationByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateTestPlayerArgs = {
  input: UpdateTestPlayerInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateTestPlayerByIdArgs = {
  input: UpdateTestPlayerByIdInput;
};

/** An object with a globally unique `ID`. */
export type Node = {
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output'];
};

/** Information about pagination in a connection. */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['Cursor']['output']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean']['output'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean']['output'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['Cursor']['output']>;
};

export type Player = Node & {
  __typename?: 'Player';
  id: Scalars['Int']['output'];
  lastseen: Scalars['Datetime']['output'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output'];
  username: Scalars['String']['output'];
  uuid: Scalars['String']['output'];
};

/** A condition to be used against `Player` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type PlayerCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `lastseen` field. */
  lastseen?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `username` field. */
  username?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `uuid` field. */
  uuid?: InputMaybe<Scalars['String']['input']>;
};

/** An input for mutations affecting `Player` */
export type PlayerInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  lastseen?: InputMaybe<Scalars['Datetime']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
  uuid: Scalars['String']['input'];
};

/** Represents an update to a `Player`. Fields that are set will be updated. */
export type PlayerPatch = {
  id?: InputMaybe<Scalars['Int']['input']>;
  lastseen?: InputMaybe<Scalars['Datetime']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
  uuid?: InputMaybe<Scalars['String']['input']>;
};

/** A connection to a list of `Player` values. */
export type PlayersConnection = {
  __typename?: 'PlayersConnection';
  /** A list of edges which contains the `Player` and cursor to aid in pagination. */
  edges: Array<PlayersEdge>;
  /** A list of `Player` objects. */
  nodes: Array<Player>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Player` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `Player` edge in the connection. */
export type PlayersEdge = {
  __typename?: 'PlayersEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Player` at the end of the edge. */
  node: Player;
};

/** Methods to use when ordering `Player`. */
export enum PlayersOrderBy {
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  LastseenAsc = 'LASTSEEN_ASC',
  LastseenDesc = 'LASTSEEN_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  UsernameAsc = 'USERNAME_ASC',
  UsernameDesc = 'USERNAME_DESC',
  UuidAsc = 'UUID_ASC',
  UuidDesc = 'UUID_DESC'
}

/** The root query type which gives access points into the data universe. */
export type Query = Node & {
  __typename?: 'Query';
  /** Reads a single `_PrismaMigration` using its globally unique `ID`. */
  _prismaMigration?: Maybe<_PrismaMigration>;
  /** Get a single `_PrismaMigration`. */
  _prismaMigrationById?: Maybe<_PrismaMigration>;
  /** Reads and enables pagination through a set of `Player`. */
  allPlayers?: Maybe<PlayersConnection>;
  /** Reads a set of `Player`. */
  allPlayersList?: Maybe<Array<Player>>;
  /** Reads and enables pagination through a set of `_PrismaMigration`. */
  allPrismaMigrations?: Maybe<_PrismaMigrationsConnection>;
  /** Reads a set of `_PrismaMigration`. */
  allPrismaMigrationsList?: Maybe<Array<_PrismaMigration>>;
  /** Reads and enables pagination through a set of `TestPlayer`. */
  allTestPlayers?: Maybe<TestPlayersConnection>;
  /** Reads a set of `TestPlayer`. */
  allTestPlayersList?: Maybe<Array<TestPlayer>>;
  /** Fetches an object given its globally unique `ID`. */
  node?: Maybe<Node>;
  /** The root query type must be a `Node` to work well with Relay 1 mutations. This just resolves to `query`. */
  nodeId: Scalars['ID']['output'];
  /** Reads a single `Player` using its globally unique `ID`. */
  player?: Maybe<Player>;
  /** Get a single `Player`. */
  playerById?: Maybe<Player>;
  /**
   * Exposes the root query type nested one level down. This is helpful for Relay 1
   * which can only query top level fields if they are in a particular form.
   */
  query: Query;
  /** Reads a single `TestPlayer` using its globally unique `ID`. */
  testPlayer?: Maybe<TestPlayer>;
  /** Get a single `TestPlayer`. */
  testPlayerById?: Maybe<TestPlayer>;
};


/** The root query type which gives access points into the data universe. */
export type Query_PrismaMigrationArgs = {
  nodeId: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type Query_PrismaMigrationByIdArgs = {
  id: Scalars['String']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryAllPlayersArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<PlayerCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PlayersOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAllPlayersListArgs = {
  condition?: InputMaybe<PlayerCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PlayersOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAllPrismaMigrationsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<_PrismaMigrationCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<_PrismaMigrationsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAllPrismaMigrationsListArgs = {
  condition?: InputMaybe<_PrismaMigrationCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<_PrismaMigrationsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAllTestPlayersArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<TestPlayerCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<TestPlayersOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAllTestPlayersListArgs = {
  condition?: InputMaybe<TestPlayerCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<TestPlayersOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryNodeArgs = {
  nodeId: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPlayerArgs = {
  nodeId: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPlayerByIdArgs = {
  id: Scalars['Int']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryTestPlayerArgs = {
  nodeId: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryTestPlayerByIdArgs = {
  id: Scalars['Int']['input'];
};

export type TestPlayer = Node & {
  __typename?: 'TestPlayer';
  id: Scalars['Int']['output'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output'];
  username: Scalars['String']['output'];
  uuid: Scalars['String']['output'];
};

/**
 * A condition to be used against `TestPlayer` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type TestPlayerCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `username` field. */
  username?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `uuid` field. */
  uuid?: InputMaybe<Scalars['String']['input']>;
};

/** An input for mutations affecting `TestPlayer` */
export type TestPlayerInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
  uuid?: InputMaybe<Scalars['String']['input']>;
};

/** Represents an update to a `TestPlayer`. Fields that are set will be updated. */
export type TestPlayerPatch = {
  id?: InputMaybe<Scalars['Int']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
  uuid?: InputMaybe<Scalars['String']['input']>;
};

/** A connection to a list of `TestPlayer` values. */
export type TestPlayersConnection = {
  __typename?: 'TestPlayersConnection';
  /** A list of edges which contains the `TestPlayer` and cursor to aid in pagination. */
  edges: Array<TestPlayersEdge>;
  /** A list of `TestPlayer` objects. */
  nodes: Array<TestPlayer>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `TestPlayer` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `TestPlayer` edge in the connection. */
export type TestPlayersEdge = {
  __typename?: 'TestPlayersEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `TestPlayer` at the end of the edge. */
  node: TestPlayer;
};

/** Methods to use when ordering `TestPlayer`. */
export enum TestPlayersOrderBy {
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  UsernameAsc = 'USERNAME_ASC',
  UsernameDesc = 'USERNAME_DESC',
  UuidAsc = 'UUID_ASC',
  UuidDesc = 'UUID_DESC'
}

/** All input for the `updatePlayerById` mutation. */
export type UpdatePlayerByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  /** An object where the defined keys will be set on the `Player` being updated. */
  playerPatch: PlayerPatch;
};

/** All input for the `updatePlayer` mutation. */
export type UpdatePlayerInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Player` to be updated. */
  nodeId: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `Player` being updated. */
  playerPatch: PlayerPatch;
};

/** The output of our update `Player` mutation. */
export type UpdatePlayerPayload = {
  __typename?: 'UpdatePlayerPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `Player` that was updated by this mutation. */
  player?: Maybe<Player>;
  /** An edge for our `Player`. May be used by Relay 1. */
  playerEdge?: Maybe<PlayersEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our update `Player` mutation. */
export type UpdatePlayerPayloadPlayerEdgeArgs = {
  orderBy?: Array<PlayersOrderBy>;
};

/** All input for the `updatePrismaMigrationById` mutation. */
export type UpdatePrismaMigrationByIdInput = {
  /** An object where the defined keys will be set on the `_PrismaMigration` being updated. */
  _prismaMigrationPatch: _PrismaMigrationPatch;
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
};

/** All input for the `updatePrismaMigration` mutation. */
export type UpdatePrismaMigrationInput = {
  /** An object where the defined keys will be set on the `_PrismaMigration` being updated. */
  _prismaMigrationPatch: _PrismaMigrationPatch;
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `_PrismaMigration` to be updated. */
  nodeId: Scalars['ID']['input'];
};

/** The output of our update `_PrismaMigration` mutation. */
export type UpdatePrismaMigrationPayload = {
  __typename?: 'UpdatePrismaMigrationPayload';
  /** The `_PrismaMigration` that was updated by this mutation. */
  _prismaMigration?: Maybe<_PrismaMigration>;
  /** An edge for our `_PrismaMigration`. May be used by Relay 1. */
  _prismaMigrationEdge?: Maybe<_PrismaMigrationsEdge>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our update `_PrismaMigration` mutation. */
export type UpdatePrismaMigrationPayload_PrismaMigrationEdgeArgs = {
  orderBy?: Array<_PrismaMigrationsOrderBy>;
};

/** All input for the `updateTestPlayerById` mutation. */
export type UpdateTestPlayerByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  /** An object where the defined keys will be set on the `TestPlayer` being updated. */
  testPlayerPatch: TestPlayerPatch;
};

/** All input for the `updateTestPlayer` mutation. */
export type UpdateTestPlayerInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `TestPlayer` to be updated. */
  nodeId: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `TestPlayer` being updated. */
  testPlayerPatch: TestPlayerPatch;
};

/** The output of our update `TestPlayer` mutation. */
export type UpdateTestPlayerPayload = {
  __typename?: 'UpdateTestPlayerPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `TestPlayer` that was updated by this mutation. */
  testPlayer?: Maybe<TestPlayer>;
  /** An edge for our `TestPlayer`. May be used by Relay 1. */
  testPlayerEdge?: Maybe<TestPlayersEdge>;
};


/** The output of our update `TestPlayer` mutation. */
export type UpdateTestPlayerPayloadTestPlayerEdgeArgs = {
  orderBy?: Array<TestPlayersOrderBy>;
};

export type _PrismaMigration = Node & {
  __typename?: '_PrismaMigration';
  appliedStepsCount: Scalars['Int']['output'];
  checksum: Scalars['String']['output'];
  finishedAt?: Maybe<Scalars['Datetime']['output']>;
  id: Scalars['String']['output'];
  logs?: Maybe<Scalars['String']['output']>;
  migrationName: Scalars['String']['output'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output'];
  rolledBackAt?: Maybe<Scalars['Datetime']['output']>;
  startedAt: Scalars['Datetime']['output'];
};

/**
 * A condition to be used against `_PrismaMigration` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type _PrismaMigrationCondition = {
  /** Checks for equality with the object’s `appliedStepsCount` field. */
  appliedStepsCount?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `checksum` field. */
  checksum?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `finishedAt` field. */
  finishedAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `logs` field. */
  logs?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `migrationName` field. */
  migrationName?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `rolledBackAt` field. */
  rolledBackAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `startedAt` field. */
  startedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

/** An input for mutations affecting `_PrismaMigration` */
export type _PrismaMigrationInput = {
  appliedStepsCount?: InputMaybe<Scalars['Int']['input']>;
  checksum: Scalars['String']['input'];
  finishedAt?: InputMaybe<Scalars['Datetime']['input']>;
  id: Scalars['String']['input'];
  logs?: InputMaybe<Scalars['String']['input']>;
  migrationName: Scalars['String']['input'];
  rolledBackAt?: InputMaybe<Scalars['Datetime']['input']>;
  startedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

/** Represents an update to a `_PrismaMigration`. Fields that are set will be updated. */
export type _PrismaMigrationPatch = {
  appliedStepsCount?: InputMaybe<Scalars['Int']['input']>;
  checksum?: InputMaybe<Scalars['String']['input']>;
  finishedAt?: InputMaybe<Scalars['Datetime']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  logs?: InputMaybe<Scalars['String']['input']>;
  migrationName?: InputMaybe<Scalars['String']['input']>;
  rolledBackAt?: InputMaybe<Scalars['Datetime']['input']>;
  startedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

/** A connection to a list of `_PrismaMigration` values. */
export type _PrismaMigrationsConnection = {
  __typename?: '_PrismaMigrationsConnection';
  /** A list of edges which contains the `_PrismaMigration` and cursor to aid in pagination. */
  edges: Array<_PrismaMigrationsEdge>;
  /** A list of `_PrismaMigration` objects. */
  nodes: Array<_PrismaMigration>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `_PrismaMigration` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `_PrismaMigration` edge in the connection. */
export type _PrismaMigrationsEdge = {
  __typename?: '_PrismaMigrationsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `_PrismaMigration` at the end of the edge. */
  node: _PrismaMigration;
};

/** Methods to use when ordering `_PrismaMigration`. */
export enum _PrismaMigrationsOrderBy {
  AppliedStepsCountAsc = 'APPLIED_STEPS_COUNT_ASC',
  AppliedStepsCountDesc = 'APPLIED_STEPS_COUNT_DESC',
  ChecksumAsc = 'CHECKSUM_ASC',
  ChecksumDesc = 'CHECKSUM_DESC',
  FinishedAtAsc = 'FINISHED_AT_ASC',
  FinishedAtDesc = 'FINISHED_AT_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  LogsAsc = 'LOGS_ASC',
  LogsDesc = 'LOGS_DESC',
  MigrationNameAsc = 'MIGRATION_NAME_ASC',
  MigrationNameDesc = 'MIGRATION_NAME_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  RolledBackAtAsc = 'ROLLED_BACK_AT_ASC',
  RolledBackAtDesc = 'ROLLED_BACK_AT_DESC',
  StartedAtAsc = 'STARTED_AT_ASC',
  StartedAtDesc = 'STARTED_AT_DESC'
}

export type PlayerItemFragment = { __typename?: 'Player', id: number, nodeId: string, uuid: string, username: string, lastseen: any } & { ' $fragmentName'?: 'PlayerItemFragment' };

export type AllPlayersQueryVariables = Exact<{ [key: string]: never; }>;


export type AllPlayersQuery = { __typename?: 'Query', allPlayers?: { __typename?: 'PlayersConnection', nodes: Array<(
      { __typename?: 'Player' }
      & { ' $fragmentRefs'?: { 'PlayerItemFragment': PlayerItemFragment } }
    )> } | null };

export type MyPlayerQueryVariables = Exact<{
  uuid?: InputMaybe<Scalars['String']['input']>;
}>;


export type MyPlayerQuery = { __typename?: 'Query', allPlayers?: { __typename?: 'PlayersConnection', nodes: Array<(
      { __typename?: 'Player' }
      & { ' $fragmentRefs'?: { 'PlayerItemFragment': PlayerItemFragment } }
    )> } | null };

export type AddPlayerMutationVariables = Exact<{
  new_player?: InputMaybe<CreatePlayerInput>;
}>;


export type AddPlayerMutation = { __typename?: 'Mutation', createPlayer?: { __typename?: 'CreatePlayerPayload', player?: { __typename?: 'Player', uuid: string, nodeId: string, username: string } | null } | null };

export type UpdatePlayerUsernameMutationVariables = Exact<{
  nodeId?: InputMaybe<Scalars['ID']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpdatePlayerUsernameMutation = { __typename?: 'Mutation', updatePlayer?: { __typename?: 'UpdatePlayerPayload', clientMutationId?: string | null } | null };

export type UpdatePlayerLastseenMutationVariables = Exact<{
  nodeId?: InputMaybe<Scalars['ID']['input']>;
  lastseen?: InputMaybe<Scalars['Datetime']['input']>;
}>;


export type UpdatePlayerLastseenMutation = { __typename?: 'Mutation', updatePlayer?: { __typename?: 'UpdatePlayerPayload', clientMutationId?: string | null } | null };

export type RemovePlayerMutationVariables = Exact<{
  nodeId?: InputMaybe<Scalars['ID']['input']>;
}>;


export type RemovePlayerMutation = { __typename?: 'Mutation', deletePlayer?: { __typename?: 'DeletePlayerPayload', clientMutationId?: string | null } | null };

export type AllTestPlayersQueryVariables = Exact<{ [key: string]: never; }>;


export type AllTestPlayersQuery = { __typename?: 'Query', allTestPlayers?: { __typename?: 'TestPlayersConnection', nodes: Array<(
      { __typename?: 'TestPlayer' }
      & { ' $fragmentRefs'?: { 'TestPlayerItemFragment': TestPlayerItemFragment } }
    )> } | null };

export type AddTestPlayerMutationVariables = Exact<{
  new_testPlayer?: InputMaybe<CreateTestPlayerInput>;
}>;


export type AddTestPlayerMutation = { __typename?: 'Mutation', createTestPlayer?: { __typename?: 'CreateTestPlayerPayload', testPlayer?: { __typename?: 'TestPlayer', username: string } | null } | null };

export type RemoveTestPlayerMutationVariables = Exact<{
  nodeId?: InputMaybe<Scalars['ID']['input']>;
}>;


export type RemoveTestPlayerMutation = { __typename?: 'Mutation', deleteTestPlayer?: { __typename?: 'DeleteTestPlayerPayload', testPlayer?: { __typename?: 'TestPlayer', username: string } | null } | null };

export type TestPlayerItemFragment = { __typename?: 'TestPlayer', id: number, nodeId: string, username: string, uuid: string } & { ' $fragmentName'?: 'TestPlayerItemFragment' };

export const PlayerItemFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PlayerItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Player"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"nodeId"}},{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"lastseen"}}]}}]} as unknown as DocumentNode<PlayerItemFragment, unknown>;
export const TestPlayerItemFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TestPlayerItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TestPlayer"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"nodeId"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"uuid"}}]}}]} as unknown as DocumentNode<TestPlayerItemFragment, unknown>;
export const AllPlayersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"allPlayers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allPlayers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PlayerItem"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PlayerItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Player"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"nodeId"}},{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"lastseen"}}]}}]} as unknown as DocumentNode<AllPlayersQuery, AllPlayersQueryVariables>;
export const MyPlayerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"myPlayer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"defaultValue":{"kind":"StringValue","value":"","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allPlayers"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"condition"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"uuid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"uuid"}}}]}},{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"PlayerItem"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PlayerItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Player"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"nodeId"}},{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"lastseen"}}]}}]} as unknown as DocumentNode<MyPlayerQuery, MyPlayerQueryVariables>;
export const AddPlayerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"addPlayer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"new_player"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"CreatePlayerInput"}},"defaultValue":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"player"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"uuid"},"value":{"kind":"StringValue","value":"","block":false}}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createPlayer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"new_player"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"player"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uuid"}},{"kind":"Field","name":{"kind":"Name","value":"nodeId"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]}}]} as unknown as DocumentNode<AddPlayerMutation, AddPlayerMutationVariables>;
export const UpdatePlayerUsernameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updatePlayerUsername"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"nodeId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"defaultValue":{"kind":"StringValue","value":"","block":false}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"defaultValue":{"kind":"StringValue","value":"","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updatePlayer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"playerPatch"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"nodeId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"nodeId"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"clientMutationId"}}]}}]}}]} as unknown as DocumentNode<UpdatePlayerUsernameMutation, UpdatePlayerUsernameMutationVariables>;
export const UpdatePlayerLastseenDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updatePlayerLastseen"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"nodeId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"defaultValue":{"kind":"StringValue","value":"","block":false}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lastseen"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Datetime"}},"defaultValue":{"kind":"StringValue","value":"","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updatePlayer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"playerPatch"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"lastseen"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lastseen"}}}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"nodeId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"nodeId"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"clientMutationId"}}]}}]}}]} as unknown as DocumentNode<UpdatePlayerLastseenMutation, UpdatePlayerLastseenMutationVariables>;
export const RemovePlayerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"removePlayer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"nodeId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"defaultValue":{"kind":"StringValue","value":"","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deletePlayer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"nodeId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"nodeId"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"clientMutationId"}}]}}]}}]} as unknown as DocumentNode<RemovePlayerMutation, RemovePlayerMutationVariables>;
export const AllTestPlayersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"allTestPlayers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allTestPlayers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"TestPlayerItem"}}]}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TestPlayerItem"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"TestPlayer"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"nodeId"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"uuid"}}]}}]} as unknown as DocumentNode<AllTestPlayersQuery, AllTestPlayersQueryVariables>;
export const AddTestPlayerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"addTestPlayer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"new_testPlayer"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateTestPlayerInput"}},"defaultValue":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"testPlayer"},"value":{"kind":"ObjectValue","fields":[]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createTestPlayer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"new_testPlayer"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"testPlayer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]}}]} as unknown as DocumentNode<AddTestPlayerMutation, AddTestPlayerMutationVariables>;
export const RemoveTestPlayerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"removeTestPlayer"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"nodeId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}},"defaultValue":{"kind":"StringValue","value":"","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteTestPlayer"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"nodeId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"nodeId"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"testPlayer"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]}}]} as unknown as DocumentNode<RemoveTestPlayerMutation, RemoveTestPlayerMutationVariables>;