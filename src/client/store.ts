import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

import { remoteStoneReducer } from "../modules/test_remote_stone/state";

export const store = configureStore({
  reducer: {
    remoteStone: remoteStoneReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // ignoredActions: [
        //   "remoteStone/updateArxivSnapshot",
        //   "remoteStone/updateGameSnapshot",
        //   "remoteStone/updatePlayerSnapshot",
        // ],
        // ignoreState: true,
      },
    }),
});

type RootState = ReturnType<typeof store.getState>;
export const useAppSelector = useSelector.withTypes<RootState>();

type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
