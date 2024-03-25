import { createSelector, createSlice } from "@reduxjs/toolkit";
import type {
  TPacket,
  arxivMachine,
  gameMachine,
  playerMachine,
} from "./machine";
import type { SnapshotFrom, StateValue } from "xstate";
import type { GameSummary } from "./types";

// TODO: keep updated with context
type PlayerContextSummary = {
  winning: undefined | boolean;
  uuid: undefined | string;
  systemId: string;
  slot: number;
  location?: string;
};
export type PlayerMachineSummary = {
  status: string;
  value: StateValue;
  context: PlayerContextSummary;
  derived: {
    isPlaying: boolean;
    isIdle: boolean;
    isPrePlay: boolean;
    isEnding: boolean;
    isWaiting: boolean;
    isDeciding: boolean;
  };
};
export type PlayerSnapshot = SnapshotFrom<typeof playerMachine>;
export function playerMachineSummarizer(
  payload: PlayerSnapshot,
): PlayerMachineSummary {
  const {
    status,
    value,
    context: { winning, uuid, systemId, slot, location },
  } = payload;
  return {
    status,
    value,
    context: { winning, uuid, systemId, slot, location },
    derived: {
      isPlaying: payload.matches("PLAYING"),
      isIdle: payload.matches("IDLE"),
      isPrePlay: payload.matches("PRE_PLAY"),
      isEnding: payload.matches("ENDING"),
      isWaiting: payload.matches({ PLAYING: "WAITING" }),
      isDeciding: payload.matches({ PLAYING: "DECIDING" }),
    },
  };
}

type GameContextSummary = {
  remaining: number;
  playerOrder: number[];
  playerLocation: string[];
  currentPlayerIndex: number;
};
export type GameMachineSummary = {
  status: string;
  value: StateValue;
  context: GameContextSummary;
  derived: {
    isRegistration: boolean;
  };
};
export type GameSnapshot = SnapshotFrom<typeof gameMachine>;
export function gameMachineSummarizer(
  payload: GameSnapshot,
): GameMachineSummary {
  const {
    status,
    value,
    context: { remaining, playerOrder, currentPlayerIndex, playerLocation },
  } = payload;
  return {
    status,
    value,
    context: {
      remaining,
      playerOrder,
      currentPlayerIndex,
      playerLocation,
    },
    derived: {
      isRegistration: payload.matches("REGISTRATION"),
    },
  };
}

type ArxivContextSummary = {
  replayPointer: number;
  exogenous: TPacket[];
  block: boolean;
};
type ArxivMachineSummary = {
  status: string;
  value: StateValue;
  context: ArxivContextSummary;
  derived: {
    isReplaying: boolean;
  };
};
export type ArxivSnapshot = SnapshotFrom<typeof arxivMachine>;
export function arxivMachineSummarizer(
  payload: ArxivSnapshot,
): ArxivMachineSummary {
  const {
    status,
    value,
    context: { replayPointer, exogenous, block },
  } = payload;
  return {
    status,
    value,
    context: {
      replayPointer,
      exogenous,
      block,
    },
    derived: {
      isReplaying: ["REPLAYING", "WAITING"].some((_) => payload.matches(_)),
    },
  };
}

export type reactFlowState = {
  arxivSummary: undefined | ArxivMachineSummary;
  gameSummary: undefined | GameMachineSummary;
  playerSummaries: PlayerMachineSummary[];
  myUUID: undefined | string;
  serverConnected: boolean;
  serverInfo:
    | undefined
    | {
        summary: GameSummary;
        lastUpdateTime: number;
      };
};
const initialState = {
  arxivSummary: undefined,
  gameSummary: undefined,
  playerSummaries: [],
  myUUID: undefined,
  serverConnected: false,
  serverInfo: undefined,
} as reactFlowState;

export const reactFlowSlice = createSlice({
  name: "reactFlow",
  initialState,
  reducers: {
    updateArxivSummary: (state, action) => {
      // TODO: investigate the update logic if we have more time
      // if (!lodash.isEqual(state.arxivSummary, action.payload)) {
      //   state.arxivSummary = action.payload;
      // }
      state.arxivSummary = action.payload;
    },
    updateGameSummary: (state, action) => {
      // if (!lodash.isEqual(state.gameSummary, action.payload)) {
      //   state.gameSummary = action.payload;
      // }
      state.gameSummary = action.payload;
    },
    updatePlayerSummary: (state, action) => {
      const { summary, slot } = action.payload;
      // if (!lodash.isEqual(state.playerSummaries[slot], action.payload)) {
      //   state.playerSummaries[slot] = summary;
      // }
      state.playerSummaries[slot] = summary;
    },
    updateMyUUID: (state, action) => {
      state.myUUID = action.payload;
    },
    updateServerConnected: (state, action) => {
      state.serverConnected = action.payload;
    },
    updateServerInfo: (state, action) => {
      state.serverInfo = action.payload;
    },
  },
  selectors: {
    selectMyUUID: (state) => state.myUUID,
    selectServerInfo: (state) => state.serverInfo,
    selectServerConnected: (state) => state.serverConnected,

    selectArxivState: (state) => state.arxivSummary?.value,
    selectArxivBlock: (state) => state.arxivSummary?.context.block,
    selectArxivExogenous: (state) => state.arxivSummary?.context.exogenous,
    selectArxivReplaying: (state) => state.arxivSummary?.derived.isReplaying,

    selectGameState: (state) => state.gameSummary?.value,
    selectGameContext: (state) => state.gameSummary?.context,
    selectGameRemaining: (state) => state.gameSummary?.context.remaining,
    selectGamePlayerOrder: (state) => state.gameSummary?.context.playerOrder,
    selectGameCurrentPlayerIndex: (state) =>
      state.gameSummary?.context.currentPlayerIndex,
    selectGameRegistration: (state) =>
      state.gameSummary?.derived.isRegistration,

    selectGameSmallestUUID: (state) => {
      const players = state.playerSummaries.filter(
        (summary) => summary.context.uuid,
      );
      if (players.length === 0) {
        return undefined;
      }
      return players.reduce((acc, cur) =>
        // @ts-ignore
        acc.context.uuid < cur.context.uuid ? acc : cur,
      ).context.uuid;
    },
    selectPlayers: (state) => state.playerSummaries,
    selectPlayerSlots: createSelector(
      (state) => state.playerSummaries,
      (summaries: PlayerMachineSummary[]) =>
        summaries.map((summary) => summary.context.slot),
    ),

    selectPlayerContextBySlot: (state, slot) =>
      state.playerSummaries[slot]?.context,
    selectPlayerDerivedBySlot: (state, slot) =>
      state.playerSummaries[slot]?.derived,
    selectMeHasRegistered: createSelector(
      [(state) => state.playerSummaries, (state) => state.myUUID],
      (playerSummaries: PlayerMachineSummary[], myUUID) => {
        if (playerSummaries.length === 0 || myUUID === undefined) {
          return false;
        }
        return playerSummaries.some(
          (summary) => summary.context.uuid === myUUID,
        );
      },
    ),
  },
});

export const reactFlowActions = reactFlowSlice.actions;
export const reactFlowSelectors = reactFlowSlice.selectors;
export const reactFlowReducer = reactFlowSlice.reducer;
