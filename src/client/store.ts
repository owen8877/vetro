import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

import { remoteStoneSummaryReducer } from "../modules/test_remote_stone/summary_state";
import { remoteStoneSessionReducer } from "../modules/test_remote_stone/session_state";
import { reactFlowReducer } from "../modules/test_react_flow/state";

export const store = configureStore({
  reducer: {
    remoteStoneSummary: remoteStoneSummaryReducer,
    remoteStoneSession: remoteStoneSessionReducer,
    reactFlow: reactFlowReducer,
  },
});

type RootState = ReturnType<typeof store.getState>;
export const useAppSelector = useSelector.withTypes<RootState>();

type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
