import {
  ActorRefFrom,
  assertEvent,
  assign,
  createMachine,
  sendParent,
  setup,
} from "xstate";

export type PlayerEvent = { type: "TAKE"; value: number };

export const playerMachine = setup({
  types: {} as {
    context: {
      magic: number;
    };
    events: PlayerEvent;
  },
  actions: {
    magic_decrement: assign({
      magic: ({ context }) => {
        if (context.magic <= 0) {
          return 100;
        }
        return context.magic - 1;
      },
    }),
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QAcA2BDAnmATgOgHUBBASQBUSA5AcQGIyiBpAUQG0AGAXURQHtYAlgBcBvAHY8QAD0QAWAIx4AnCtVrVADgBsAGhCZEGxQGYA7PNkBWJZfnz2WmwF8XesbwhxJaLLm-9hUQkkaUQAWi08dmiY2JiLPQMECNcQH2x8YnIqan9BEXFJGQRHZVlZY2MAJlt5LVMlLQ1ExCr2U2UjJVkldiNjS0sNSxcXIA */
  id: "player",
  context: {
    magic: 42,
  },
  states: {
    WAITING: {
      on: {
        TAKE: {
          target: "WAITING",
          actions: [
            sendParent(({ event }) => ({
              type: "MOVE",
              value: event.value,
            })),
            "magic_decrement",
          ],
        },
      },
    },
  },
  initial: "WAITING",
});

export type GameEvent = { type: "MOVE"; value: number };

export const gameMachine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5RQIYFswDoBCBiAsgPIBqAogNoAMAuoqAA4D2sAlgC4uMB2dIAHogCMANgAcmAOwAWCYMoBWYZQBMwgMzzBUgDQgAnkOXjlg02dHTRwqQF8bu1BkwBBAiQo1eTVh268BCCLi0rIKSqoaWroGCMrKaphSylKUEgCcIcIS8ml29iBcjBBwvI5gXszsnDxI-IgAtMLRDcJ2DuhY2BU+1f6IGhKYWtlpgrKimsppTfpCOUOaYyLC1jJibSBlLt1VfrUBSc2BipjCi7IrqxLreUA */
  id: "game",
  types: {} as {
    context: {
      counter: number;
      playerRef: undefined | PlayerRef;
    };
    events: GameEvent;
  },
  context: {
    counter: 0,
    playerRef: undefined,
  },

  entry: [
    // () => console.log("Init game FSM: spawn player"),
    assign({
      playerRef: ({ spawn }) => spawn(playerMachine),
    }),
  ],
  initial: "A",
  states: {
    B: {
      entry: [sendParent({ type: "onDone" })],
      on: {
        MOVE: {
          target: "A",
          actions: assign({
            counter: ({ context: { counter }, event: { value } }) =>
              counter + value,
          }),
          reenter: true,
        },
      },
    },
    A: {
      entry: [sendParent({ type: "onDone" })],
      on: {
        MOVE: {
          target: "B",
          actions: assign({
            counter: ({ context: { counter }, event: { value } }) =>
              counter + value,
          }),
          reenter: true,
        },
      },
    },
  },
});

export type TPacket =
  | { event: PlayerEvent; to: "player" }
  | { event: GameEvent; to: "game" };
export type FTPacket = TPacket & { from: string };

export type GameRef = ActorRefFrom<typeof gameMachine>;
export type PlayerRef = ActorRefFrom<typeof playerMachine>;

export type OnSocketEvent = { type: "onSocket" } & FTPacket;
export type OnLocalEvent = { type: "onLocal" } & TPacket;
type OnReplayEvent = { type: "onReplay" } & FTPacket;
export type MetaEvent =
  | OnSocketEvent
  | OnLocalEvent
  | {
      type: "onInit";
      game: { counter: number; state: string };
      player: { magic: number };
      exogenous: TPacket[];
    }
  | OnReplayEvent
  | { type: "onDone" }
  | { type: "onServerInit" };

// These boilerplates are necessary evil
export function m2t({ event, to }: OnLocalEvent | OnSocketEvent): TPacket {
  if (to === "player") {
    return { event, to: "player" };
  }
  return { event, to };
}
export function m2ft({ event, from, to }: OnSocketEvent): FTPacket {
  if (to === "player") {
    return { event, from, to: "player" };
  }
  return { event, from, to };
}
export function ft2t({ event, to }: FTPacket): TPacket {
  if (to === "player") {
    return { event, to: "player" };
  }
  return { event, to };
}

export interface Broadcaster {
  from_local(event: TPacket): void;
  from_socket(event: FTPacket): void;
}

function getPlayerRef(gameRef: GameRef | undefined) {
  if (gameRef === undefined) {
    console.error("GameRef is undefined");
    return undefined;
  }
  return gameRef.getSnapshot().context.playerRef;
}

export function dispatch({
  context: { gameRef },
  event: metaEvent,
}: {
  context: { gameRef: undefined | GameRef };
  event: MetaEvent;
}) {
  assertEvent(metaEvent, ["onSocket", "onLocal", "onReplay"]);
  // console.log("Arxiv FSM dispatches exogenous event:", metaEvent);

  setTimeout(() => {
    if (metaEvent.to === "game") {
      gameRef?.send(metaEvent.event as GameEvent);
    } else if (metaEvent.to === "player") {
      getPlayerRef(gameRef)?.send(metaEvent.event as PlayerEvent);
    }
    console.log("Update has been queued.");
  }, 100);
}

// TODO: hugely rely on robustness of existing network
export const arxivMachine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QEMBOAPAlgNwHQGUBNAOQGEBiAewDt9KBjAazABcBtABgF1FQAHSrEwtMNXiHSIAbAFYAHLgCcAFgDsiqWpkypAZlUAaEAE9EumaqVyZAJkUddumzeX6Avm6NoseImSrUADIMyAA2nDxIIAJCImJRkghSmrhSivYcirqKqlIcylJGpgg2ulK4+spymRyqysoyAIyNch5eGDi4AFoAosQBAJLUwhHiMcKi1OKJNhwyuHJpihZptg3aRWbKHLiNNnINjVI26pkybSDenb39NPhgqNgPQyPcY4IT8aAzcwtLK8sXNoZJsEAVGrhVLo5BprDJ0giLlc8AAlHoABUCAEFCANiABxcijKLjOJTBKIWzlDQcOS5Uo2I4nUEuRSpTR7GTmdJM1qeS4dVEY7G4glExqRfgfMnTRCzeaLdIAtbA0GNGTKXbpORHRR2WqzRRIwW4ADqWIGABU8YSaAARGhgYlS2KTWUlX6K5a5QHrEEmOX1JTqmRzRQw2q6dUefnUSgQODiZHvV1fCSIAC0hQDCCzuA4BcLRcLjWUxp8BBIpBTn3J32kUghHCkqk5Bt0amUoKqmvh8gNmkcyiO5eufRrMopCHUu2c1hO2xU8Js3dUCka6hsx20WWbNlHQsxOJtE7dU7KChq9mSDR72eKLnK86a8OOw63qgPZot1oJp7TiTKCuOaMhCjQXqouRrqoXJlDGbhAA */
  id: "arxiv",
  types: {} as {
    context: {
      gameRef: undefined | GameRef;
      replayPointer: number;
      exogenous: TPacket[];
      broadcaster: Broadcaster;
      block: boolean;
    };
    events: MetaEvent;
    input: {
      broadcaster: Broadcaster;
    };
  },
  context: ({ input: { broadcaster } }) => ({
    gameRef: undefined,
    replayPointer: 0,
    exogenous: [],
    broadcaster,
    block: true,
  }),
  initial: "ZEN",
  entry: [
    // () => console.log("Zen arxiv FSM: spawning game"),
    assign({
      gameRef: ({ spawn }) => spawn(gameMachine),
    }),
  ],
  states: {
    SYNC: {
      on: {
        onSocket: {
          target: "SYNC",
          actions: [
            ({ context: { broadcaster, exogenous }, event: metaEvent }) => {
              exogenous.push(m2t(metaEvent));
              broadcaster.from_socket(m2ft(metaEvent));
            },
            dispatch,
          ],
          reenter: false,
        },
        onLocal: {
          target: "SYNC",
          actions: [
            ({ context: { broadcaster, exogenous }, event: metaEvent }) => {
              const event = m2t(metaEvent);
              exogenous.push(event);
              broadcaster.from_local(event);
            },
            dispatch,
          ],
          reenter: false,
        },
      },
    },

    ZEN: {
      on: {
        onInit: {
          target: "REPLAYING",
          actions: [
            // () => console.log("Zen get initialized on client!"),
            assign({ exogenous: ({ event }) => event.exogenous }),
          ],
        },
        onServerInit: {
          target: "SYNC",
          actions: [
            // () => console.log("Zen gets initialized on server!"),
            assign({ block: false }),
          ],
        },
      },
    },

    REPLAYING: {
      always: [
        {
          target: "SYNC",
          actions: [
            () => console.log("All server events has been replayed!"),
            assign({ block: false }),
          ],
          guard: ({ context }) =>
            context.replayPointer >= context.exogenous.length,
        },
        {
          target: "WAITING",
          actions: [
            ({ context }) => {
              dispatch({
                context,
                event: {
                  type: "onReplay",
                  ...context.exogenous[context.replayPointer],
                } as OnReplayEvent,
              });
            },
          ],
        },
      ],
    },

    WAITING: {
      on: {
        onDone: {
          target: "REPLAYING",
          actions: assign({
            replayPointer: ({ context }) => context.replayPointer + 1,
          }),
        },
      },
    },
  },
});

export type ArxivRef = ActorRefFrom<typeof arxivMachine>;
