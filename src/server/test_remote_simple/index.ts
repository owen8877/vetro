import { createActor, createMachine, assign, ActorRef } from "xstate";
import { Server } from "socket.io";

import { gameMachine } from "../../client/test_remote_simple/machine";

const Machine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QBc7IPoCcwFsD2q6sAljgA4A2Y6OAhgMYAWxAdmAHQDKAKgIIBK3AMQBtAAwBdRKDJ4SyYnhbSQAD0QBWMewBsOjQEYAzAA4jAJgDsOg+ZsAaEAE9EAWgAsO9gE4xZ42LelhrmBmLmAL4RjqiwGNj4hCTkVDQMzGzs-ACqAHK5AJK5AOJC-LwFnACi4lJIILLyisr16ggaRuwGGu7GOpaWYv09RjqOLgje3uwh7lYGBt7u3gYmgVExaFi4BNTJlNR0TKwcVfz8APL8ZVXV3LUqjcQKSiptq9om7kbf5u5igzERg0JnGiCs7Es3hMf2hyxMZh0YncUWiIBYeAgcBUsXiOySpAOaWObEecmezTebi8YlptNMowB7mZBjBCFcq3cMwGKwGJh07jM7g0GxAuO2iT2hNSRwyHB4Am4ZKar1aiDmuiG5jECw0PIR5jZriCXRMqyMPzWoW8hlF4oSuyI0sO6ROWTyhRKyopqtAbV6PimUxsOiM3nMGg0Y2cmgM7FGBkspnN4TsNrtWwdBJSLpJp3OV29LxafvV5k1Om1uv1ZrZ3UsXWB-MTtj8RgMKNRQA */
  id: 'test_remote_simple_machine',
  context: {
    game: undefined as (undefined | ActorRef),
  },
  entry: assign({ game: ({ spawn }) => spawn(gameMachine) }),
  states: {
    START: {
      always: {
        target: "RUNNING",
        reenter: true,
        guard: ({ context }) => context.game !== undefined,
      }
    },
    RUNNING: {
      on: {
        RAISE: "ERROR"
      }
    },
    ERROR: {
      on: {
        RESET: "START"
      }
    },
  },

  initial: "START"
});

function register(io: Server) {
  const machine = createActor(Machine);
  machine.start();

  io.of('/test_remote_simple').on('connection', (socket) => {
    function serveGame() {
      const { game } = machine.getSnapshot().context;
      const { context, value: state } = game.getSnapshot();

      const reduced = {
        couter: context.counter,
        players: context.players.map((player) => ({
          slot: player.slot,
        })),
      };
      console.log(game.value);

      socket.emit('game', { context: reduced, state });
    }

    // Socket serve game status
    serveGame();

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });

    socket.on('game', () => {
      serveGame();
    })

    socket.on('player.action', (event) => {
      function handler(event: { type: string, value: any }) {
        const gameActor = machine.getSnapshot().context.game;
        if (!gameActor) {
          throw new Error('Game Actor is undefined!');
        }
        const player = gameActor.getSnapshot().context.players[0].ref;
        if (!player) {
          throw new Error('Cannot find player!');
        }
        player.send(event);
        return 'Player action queued!';
      }

      try {
        const data = handler(event);
        socket.emit('player.action.response', { data });
      } catch (error) {
        socket.emit('player.action.response', { error });
      }
      serveGame();
    })
  });
}

export default { register };