import { createActor } from "xstate";
import type { Namespace, Server, Socket } from "socket.io";

import {
  arxivMachine,
  type FTPacket,
  type TPacket,
  _2t,
  type OnSocketEvent,
  type GameContext,
  type PlayerContext,
} from "./machine";
import type { GameSummary, LocalSend, RemoteSend } from "./types";

interface Sockets {
  [key: string]: Socket;
}

function randomPermutation(l: number) {
  return Array.from({ length: l }, (_, i) => i).sort(() => Math.random() - 0.5);
}

function register(io: Server) {
  const sockets: Sockets = {};
  const ns = io.of("/test_react_flow");

  const machine = createActor(arxivMachine, {
    input: {
      broadcaster: {
        from_local(event: TPacket) {
          console.log(
            "broadcast from local to remote; invoked from server",
            event,
          );
          ns.emit("remote.send", event as RemoteSend);
          serveGame(false, ns);
        },
        from_socket(event: FTPacket) {
          const socket = sockets[event.from];
          if (socket === undefined) {
            console.error(`Socket ${event.from} not found!`);
          } else {
            socket.broadcast.emit("remote.send", _2t(event) as RemoteSend);
            serveGame(false, ns);
          }
        },
      },
      gameHook: {
        onIdle(context: GameContext, enqueue) {
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
          const playerLocation = playerOrder.map((i) => {
            const randomLoc = Math.floor(Math.random() * 5);
            return `${randomLoc + 1}`;
          });
          enqueue.sendTo(({ system }) => system.get("arxiv"), {
            type: "onLocal",
            to: "game",
            event: { type: "start", playerOrder, playerLocation },
          });
        },
      },
      playerHook: {
        onDeciding(context: PlayerContext, enqueue) {
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
        },
      },
    },
    systemId: "arxiv",
  });
  machine.start();
  machine.send({ type: "onServerInit" });

  function summarizeGame() {
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
        const { winning, uuid, location } = context;
        return {
          winning,
          uuid,
          location,
        };
      }),
      exogenous,
    };

    return { context: reduced, state } as GameSummary;
  }

  function serveGame(force: boolean, socket: Socket | Namespace) {
    try {
      const gameSummary = summarizeGame();
      const method = force ? "game.sync" : "game.update";
      socket.emit(method, { data: gameSummary });
    } catch (e) {
      console.error(e);
      socket.emit("game.update", { error: e });
    }
  }

  ns.on("connection", (socket) => {
    console.log("connect");

    sockets[socket.id] = socket;

    // Socket serve game status
    serveGame(true, socket);

    socket.on("game.request", () => {
      serveGame(false, socket);
    });

    socket.on("disconnect", () => {
      delete sockets[socket.id];
      console.log("user disconnected");
    });

    socket.on("local.send", ({ event, to }: LocalSend) => {
      console.log(event, to);

      machine.send({
        type: "onSocket",
        event,
        to,
        from: socket.id,
      } as OnSocketEvent);
    });
  });
}

export default { register };
