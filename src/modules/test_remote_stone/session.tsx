import { useEffect, useState } from 'react';
import { useAsync } from 'react-use';
import { createContext } from "react";
import { io } from "socket.io-client";
import { createActor } from "xstate";
import localforage from "localforage";
import lodash from "lodash";
import { v4 } from "uuid";

import { is_production } from "../../util";
import { useAppDispatch } from '../../client/store';
import type { GameRef, MetaEvent, OnSocketEvent, PlayerRef } from './machine';
import { ArxivRef, arxivMachine } from "./machine";
import type { UpdatePacket, RemoteSend, LocalSend } from './types';
import App from './app';
import {
  ArxivSnapshot,
  GameSnapshot,
  PlayerSnapshot,
  remoteStoneSessionActions as _A,
  remoteStoneSessionSelectors as _S,
  arxivMachineSummarizer,
  gameMachineSummarizer,
  playerMachineSummarizer,
} from './session_state';
import { useParams } from 'react-router-dom';

// Socket.io & Websocket related
// "undefined" means the URL will be computed from the `window.location` object
const URL = `${is_production ? "" : import.meta.env.VITE_WS_PATH}/test_remote_stone_session`;
const socket = io(URL, { autoConnect: false });

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

const buildArxivRef = (sessionId: string) => {
  // const { inspect } = createBrowserInspector();
  const arxivRef = createActor(arxivMachine, {
    input: {
      broadcaster: {
        from_local: (event: LocalSend) => socket.emit("session.local.send", sessionId, event),
        from_socket: () => { },
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

  return arxivRef;
}

// TODO: type check all network interfaces
// auto check sessionId

export default function TestRemoteStoneSession() {
  const { sessionId } = useParams();
  const [arxivRef, setArxivRef] = useState<ArxivRef | undefined>(undefined);
  const [context, setContext] = useState<ArxivDispatch>({ send: () => { } });
  const [gameRef, setGameRef] = useState<GameRef | undefined>(undefined);
  const [playerRefs, setPlayerRefs] = useState<PlayerRef[]>([]);
  const sUUID = useAsync(getUUIDFromStorage);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (sessionId === undefined || arxivRef !== undefined) return;
    const ref = buildArxivRef(sessionId);
    setArxivRef(ref);
    ref.start();
  }, [sessionId, arxivRef])

  useEffect(() => {
    if (arxivRef === undefined) return;

    setGameRef(arxivRef?.getSnapshot().context.gameRef);
    setContext({ send: (event) => arxivRef?.send(event) })

    const arxivDispatch = (snapShot: ArxivSnapshot) => dispatch(_A.updateArxivSummary(arxivMachineSummarizer(snapShot)));
    arxivDispatch(arxivRef.getSnapshot());
    const arxivSubscription = arxivRef.subscribe(arxivDispatch);
    return () => arxivSubscription.unsubscribe();
  }, [arxivRef, dispatch]);

  useEffect(() => {
    if (gameRef === undefined) return;

    setPlayerRefs(gameRef?.getSnapshot().context.playerRefs ?? []);

    const gameDispatch = (snapShot: GameSnapshot) => dispatch(_A.updateGameSummary(gameMachineSummarizer(snapShot)));
    gameDispatch(gameRef.getSnapshot());
    const gameSubscription = gameRef.subscribe(gameDispatch);
    return () => gameSubscription.unsubscribe();
  }, [gameRef, dispatch]);

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

  useEffect(() => { dispatch(_A.updateMyUUID(sUUID.value)) }, [dispatch, sUUID]);

  useEffect(() => {
    if (arxivRef === undefined) return;

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
    const onRemoteSend = ({ event, to }: RemoteSend) => arxivRef.send({ type: 'onSocket', event, to, from: 'server' } as OnSocketEvent);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('session.game.sync', onSyncGame);
    socket.on('session.game.update', onServerGame);
    socket.on('session.remote.send', onRemoteSend);
    socket.connect();
    socket.emit("session.connect", sessionId);

    const interval = setInterval(() => {
      socket.emit('session.game.request', sessionId);
    }, 3000);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('session.game.sync', onSyncGame);
      socket.off('session.game.update', onServerGame);
      socket.off('session.remote.send', onRemoteSend);
      socket.emit("session.disconnect", sessionId);
      socket.disconnect();
      clearInterval(interval);
    };
  }, [dispatch, arxivRef, sessionId]);

  return (
    <ArxivDispatchContext.Provider value={context}>
      <h3>Session ID: {sessionId}</h3>
      <App />
    </ArxivDispatchContext.Provider>
  )
};