import { Actor, createActor } from "xstate";
import { Namespace, Server, Socket } from "socket.io";

import {
  arxivMachine,
  FTPacket,
  TPacket,
  _2t,
  OnSocketEvent,
  GameContext,
  PlayerContext,
  Enqueue,
} from "./machine";
import { GameSummary, LocalSend, RemoteSend } from "./types";
import { v4 } from "uuid";

type Machine = Actor<typeof arxivMachine>;

function randomPermutation(l: number) {
  return Array.from({ length: l }, (_, i) => i).sort(() => Math.random() - 0.5);
}

function summarizeGame(machine: Machine) {
  const { gameRef, exogenous } = machine.getSnapshot().context;
  if (gameRef === undefined) {
    throw new Error("GameRef is undefined");
  }
  const { context, value: state } = gameRef.getSnapshot();
  const { playerRefs } = context;

  const reduced = {
    counter: context.remaining,
    players: playerRefs.map((playerRef) => {
      const { context } = playerRef.getSnapshot();
      const { winning, uuid } = context;
      return {
        winning,
        uuid,
      };
    }),
    exogenous,
  };

  return { context: reduced, state } as GameSummary;
}

type SessionServeGameOptions = {
  force: boolean;
  socket?: Socket | ReturnType<Namespace["to"]>;
};

class Session {
  uuid: string;
  started: Date;
  sockets: Map<string, Socket>;
  ns: ReturnType<Namespace["to"]>;
  machine: Machine;

  constructor(ns: Namespace) {
    this.uuid = v4();
    this.ns = ns.to(this.uuid);
    this.started = new Date();
    this.sockets = new Map();

    const broadcasterFromLocal = (event: TPacket) => {
      console.log("broadcast from local to remote; invoked from server", event);
      ns.emit("session.remote.send", event as RemoteSend);
      this.serveGame({ force: false });
    };
    const broadcasterFromSocket = (event: FTPacket) => {
      const socket = this.sockets.get(event.from);
      if (socket === undefined) {
        console.error(`Socket ${event.from} not found!`);
      } else {
        socket.broadcast
          .to(this.uuid)
          .emit("session.remote.send", _2t(event) as RemoteSend);
        this.serveGame({ force: false });
      }
    };
    const gameHookOnIdle = (context: GameContext, enqueue: Enqueue) => {
      const { playerRefs } = context;
      const playerOrder = randomPermutation(playerRefs.length);
      for (const playerRef of playerRefs) {
        const { uuid, systemId } = playerRef.getSnapshot().context;
        if (uuid === undefined) {
          enqueue.sendTo(({ system }) => system.get("arxiv"), {
            type: "onLocal",
            to: systemId,
            event: { type: "register", uuid: undefined },
          });
        }
      }
      enqueue.sendTo(({ system }) => system.get("arxiv"), {
        type: "onLocal",
        to: "game",
        event: { type: "start", playerOrder },
      });
    };
    const playerHookOnDeciding = (context: PlayerContext, enqueue: Enqueue) => {
      console.log("???");

      const { uuid, systemId } = context;
      if (uuid === undefined) {
        console.log("We kindly skip the player without UUID");
        enqueue.sendTo(({ system }) => system.get("arxiv"), {
          type: "onLocal",
          to: systemId,
          event: { type: "yield" },
        });
      }
    };

    this.machine = createActor(arxivMachine, {
      input: {
        broadcaster: {
          from_local: broadcasterFromLocal,
          from_socket: broadcasterFromSocket,
        },
        gameHook: { onIdle: gameHookOnIdle },
        playerHook: { onDeciding: playerHookOnDeciding },
      },
      systemId: "arxiv",
    });
    this.machine.start();
    this.machine.send({ type: "onServerInit" });
  }

  serveGame({ force, socket }: SessionServeGameOptions) {
    const resolvedSocket = socket || this.ns.to(this.uuid); // Broadcast to the room if socket is not provided
    try {
      const gameSummary = summarizeGame(this.machine);
      const method = force ? "session.game.sync" : "session.game.update";
      resolvedSocket.emit(method, { data: gameSummary });
    } catch (e) {
      console.error(e);
      resolvedSocket.emit("session.game.update", { error: e });
    }
  }

  addSocket(socket: Socket) {
    this.sockets.set(socket.id, socket);
  }

  removeSocket(socket: Socket) {
    this.sockets.delete(socket.id);
  }
}

function register(io: Server) {
  const sessions = new Map<string, Session>();
  const ns_summary = io.of("/test_remote_stone_summary");
  const ns_session = io.of("/test_remote_stone_session");

  ns_summary.on("connection", (socket) => {
    console.log("connect summary");

    function getSessionSummary() {
      return Array.from(sessions.entries()).map(([uuid, session]) => {
        return { uuid, started: session.started };
      });
    }

    socket.on("summary.list", () => {
      socket.emit("summary.update", { data: getSessionSummary() });
    });

    socket.on("summary.create", () => {
      const session = new Session(ns_session);
      sessions.set(session.uuid, session);
      socket.emit("summary.return", {
        data: {
          newId: session.uuid,
          existing: getSessionSummary(),
        },
      });
    });
  });

  ns_session.on("connection", (socket) => {
    type NextFn<T> = (sessionId: string, session: Session, args: T) => void;

    const SessionLookupMiddleware =
      <T>(next: NextFn<T>) =>
      (sessionId: string, args: T) => {
        const session = sessions.get(sessionId);
        if (session === undefined) {
          return { error: "Session not found!" };
        }
        next(sessionId, session, args);
      };

    socket.on(
      "session.connect",
      SessionLookupMiddleware((sessionId, session) => {
        socket.join(sessionId);
        session.addSocket(socket);
        session.serveGame({ force: true, socket });
      }),
    );

    socket.on(
      "session.disconnect",
      SessionLookupMiddleware((sessionId, session) => {
        socket.leave(sessionId);
        session.removeSocket(socket);
      }),
    );

    socket.on(
      "session.game.request",
      SessionLookupMiddleware((_, session) => {
        session.serveGame({ force: false, socket });
      }),
    );

    socket.on(
      "session.local.send",
      SessionLookupMiddleware((_, session, { event, to }: LocalSend) => {
        console.log(event, to);

        session.machine.send({
          type: "onSocket",
          event,
          to,
          from: socket.id,
        } as OnSocketEvent);
      }),
    );
  });
}

export default { register };
