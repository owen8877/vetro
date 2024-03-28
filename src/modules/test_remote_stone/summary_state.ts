import { createSlice } from "@reduxjs/toolkit";
import { SessionSummary } from "./types";

export type remoteStoneSummaryState = {
  sessionSummaries: SessionSummary[];
  serverConnected?: boolean;
  lastUpdated?: Date;
};
const initialState = {
  sessionSummaries: [],
  serverConnected: false,
  lastUpdated: undefined,
} as remoteStoneSummaryState;

export const remoteStoneSummarySlice = createSlice({
  name: "remoteStoneSummary",
  initialState,
  reducers: {
    updateSessionSummaries: (state, action) => {
      const { lastUpdated, sessionSummaries } = action.payload;
      if (sessionSummaries.length > 0 || state.sessionSummaries.length > 0) {
        state.sessionSummaries = sessionSummaries;
      }
      state.lastUpdated = lastUpdated;
    },
    updateServerConnected: (state, action) => {
      state.serverConnected = action.payload;
    },
  },
  selectors: {
    selectSessionSummaries: (state) => state.sessionSummaries,
    selectServerConnected: (state) => state.serverConnected,
  },
});

export const remoteStoneSummaryActions = remoteStoneSummarySlice.actions;
export const remoteStoneSummarySelectors = remoteStoneSummarySlice.selectors;
export const remoteStoneSummaryReducer = remoteStoneSummarySlice.reducer;
