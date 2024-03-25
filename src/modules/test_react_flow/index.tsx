import { useEffect } from 'react';
import { useAsync } from 'react-use';
import { createContext } from "react";
import { io } from "socket.io-client";
import { createActor } from "xstate";
import localforage from "localforage";
import lodash from "lodash";
import { v4 } from "uuid";
import { createBrowserInspector } from "@statelyai/inspect";

import { is_production } from "../../util";
import { useAppDispatch } from '../../client/store';
import type { MetaEvent, OnSocketEvent } from './machine';
import { arxivMachine } from "./machine";
import type { UpdatePacket, RemoteSend, LocalSend } from './types';
import App from './app';
import {
  gameMachineSummarizer,
  arxivMachineSummarizer,
  type ArxivSnapshot,
  type GameSnapshot,
  reactFlowActions as _A,
  reactFlowSelectors as _S,
  playerMachineSummarizer,
  type PlayerSnapshot,
} from './state';

// Socket.io & Websocket related
// "undefined" means the URL will be computed from the `window.location` object
const URL = `${is_production ? "" : import.meta.env.VITE_WS_PATH}/test_react_flow`;
const socket = io(URL, { autoConnect: false });

// FSM related
// const { inspect } = createBrowserInspector();
const arxivRef = createActor(arxivMachine, {
  input: {
    broadcaster: {
      from_local: (event: LocalSend) => {
        // console.log('[Broadcaster] local -> socket', event);
        socket.emit("local.send", event);
      },
      from_socket: () => {
        // console.log('[Broadcaster] socket -> local', event);
      },
    },
    gameHook: {
      onIdle() {
        console.log("Doing nothing on this hook since running on client...");
      },
    },
    playerHook: {
      onDeciding() {
        console.log("Cannot Decide!");
      },
    },
  },
  systemId: "arxiv",
  // inspect: is_production ? undefined : inspect,
});
arxivRef.start();

// UUID related
const getUUIDFromStorage = async () => {
  const UUID_KEY = "UUID_KEY";
  const saved_uuid = await localforage.getItem(UUID_KEY);
  if (!lodash.isNull(saved_uuid)) {
    return saved_uuid as string;
  }
  const new_uuid = v4();
  await localforage.setItem(UUID_KEY, new_uuid);
  return new_uuid;
};

export interface ArxivDispatch {
  send(event: MetaEvent): void;
}
export const ArxivDispatchContext = createContext<ArxivDispatch>({
  send: () => { },
});

export default function TestReactFlow() {
  const gameRef = arxivRef.getSnapshot().context.gameRef;
  const playerRefs = gameRef?.getSnapshot().context.playerRefs ?? [];
  const sUUID = useAsync(getUUIDFromStorage);
  const dispatch = useAppDispatch();

  useEffect(() => { dispatch(_A.updateMyUUID(sUUID.value)) }, [dispatch, sUUID]);

  useEffect(() => {
    const onConnect = () => dispatch(_A.updateServerConnected(true));
    const onDisconnect = () => dispatch(_A.updateServerConnected(false));
    const onSyncGame = ({ data, error }: UpdatePacket) => {
      if (data === undefined) {
        console.error(error);
        return;
      }
      dispatch(_A.updateServerInfo({ summary: data, lastUpdateTime: Date.now() }));
      const { context: { exogenous } } = data;
      arxivRef.send({ type: 'onInit', exogenous });
    };
    const onServerGame = ({ data, error }: UpdatePacket) => {
      if (data === undefined) {
        console.error(error);
        return;
      }
      dispatch(_A.updateServerInfo({ summary: data, lastUpdateTime: Date.now() }));
    };
    const onRemoteSend = (value: RemoteSend) => {
      const { event, to } = value;
      arxivRef.send({ type: 'onSocket', event, to, from: 'server' } as OnSocketEvent);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('game.sync', onSyncGame);
    socket.on('game.update', onServerGame);
    socket.on('remote.send', onRemoteSend);
    socket.connect();

    // const interval = setInterval(() => {
    //   socket.emit('game.request');
    // }, 3000);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('game.sync', onSyncGame);
      socket.off('game.update', onServerGame);
      socket.off('remote.send', onRemoteSend);
      socket.disconnect();
      // clearInterval(interval);
    };
  }, [dispatch]);

  useEffect(() => {
    const arxivDispatch = (snapShot: ArxivSnapshot) => dispatch(_A.updateArxivSummary(arxivMachineSummarizer(snapShot)));
    arxivDispatch(arxivRef.getSnapshot());
    const arxivSubscription = arxivRef.subscribe(arxivDispatch);
    return () => arxivSubscription.unsubscribe();
  }, [dispatch]);

  useEffect(() => {
    if (gameRef === undefined) return;
    const gameDispatch = (snapShot: GameSnapshot) => dispatch(_A.updateGameSummary(gameMachineSummarizer(snapShot)));
    gameDispatch(gameRef.getSnapshot());
    const gameSubscription = gameRef.subscribe(gameDispatch);
    return () => gameSubscription.unsubscribe();
  }, [dispatch, gameRef]);

  useEffect(() => {
    const playerSubscriptions = playerRefs.map((playerRef, slot) => {
      const playerDispatch = (snapShot: PlayerSnapshot) => dispatch(_A.updatePlayerSummary({ summary: playerMachineSummarizer(snapShot), slot }));
      playerDispatch(playerRef.getSnapshot());
      return playerRef.subscribe(playerDispatch);
    });
    return () => {
      for (const sub of playerSubscriptions) {
        sub.unsubscribe();
      }
    }
  }, [dispatch, playerRefs]);

  return (
    <ArxivDispatchContext.Provider value={{ send: (event) => arxivRef.send(event) }}>
      <App />
    </ArxivDispatchContext.Provider>
  )
};