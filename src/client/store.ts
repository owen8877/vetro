import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

import { remoteStoneReducer } from "../modules/test_remote_stone/state";
import { reactFlowReducer } from "../modules/test_react_flow/state";

export const store = configureStore({
  reducer: {
    remoteStone: remoteStoneReducer,
    reactFlow: reactFlowReducer,
  },
});

type RootState = ReturnType<typeof store.getState>;
export const useAppSelector = useSelector.withTypes<RootState>();

type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
