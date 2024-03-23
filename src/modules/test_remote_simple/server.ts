import { createActor } from "xstate";
import { Namespace, Server, Socket } from "socket.io";

import {
  arxivMachine,
  FTPacket,
  TPacket,
  ft2t,
  OnSocketEvent,
} from "./machine";
import { GameSummary, LocalSend, RemoteSend, UpdatePacket } from "./types";

interface Sockets {
  [key: string]: Socket;
}

function register(io: Server) {
  const sockets: Sockets = {};
  const ns = io.of("/test_remote_simple");
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
            socket.broadcast.emit("remote.send", ft2t(event) as RemoteSend);
            serveGame(false, ns);
          }
        },
      },
    },
  });
  machine.start();
  machine.send({ type: "onServerInit" });

  function summarizeGame() {
    const { gameRef, exogenous } = machine.getSnapshot().context;
    if (gameRef === undefined) {
      throw new Error("GameRef is undefined");
    }
    const { playerRef } = gameRef.getSnapshot().context;
    if (playerRef === undefined) {
      throw new Error("PlayerRef is undefined");
    }
    const { context, value: state } = gameRef.getSnapshot();

    const reduced = {
      counter: context.counter,
      players: [
        {
          slot: 0,
          magic: playerRef.getSnapshot().context.magic,
        },
      ],
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
