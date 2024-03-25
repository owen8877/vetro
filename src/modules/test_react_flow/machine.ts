import {
 type ActorRefFrom,
 type ActorSystem,
 type ActorSystemInfo,
 assertEvent,
 assign,
 createMachine,
 enqueueActions,
 log,
 sendParent,
 sendTo,
 setup,
} from "xstate";

type PRegisterEvent = { type: "register"; uuid: string };
type PUnregisterEvent = { type: "unregister" };
type PPickEvent = { type: "take"; destination: string };
type PEndEvent = { type: "end"; winning: boolean };
export type PEvent =
 | PRegisterEvent
 | PUnregisterEvent
 | { type: "start"; location: string }
 | PPickEvent
 | { type: "yield" }
 | { type: "activate" }
 | PEndEvent
 | { type: "reset" };

export type PlayerContext = {
 winning?: boolean;
 uuid?: string;
 location?: string;
 systemId: string;
 slot: number;
 hook: PlayerHook;
};
export interface PlayerHook {
 onDeciding(
  context: PlayerContext,
  enqueue: {
   // @ts-ignore
   sendTo(
    // @ts-ignore
    to: ({ system }: { system: ActorSystem<ActorSystemInfo> }) => Any,
    event: MetaEvent,
   );
  },
 ): void;
}

export const playerMachine = setup({
 types: {} as {
  context: PlayerContext;
  events: PEvent;
 },
 actions: {},
}).createMachine({
 /** @xstate-layout N4IgpgJg5mDOIC5QAcA2BDAnmATgOgEkARAGQFEBiHMKAS1gBdcBtABgF1EUB7WWh2twB2XEAA9EARgBMAVjwBOBZIDMAdmmSAHHMlqVsgDQhMiLZLwAWbWsuyF6tawdqAvq+NosuPGQByRAR+AOJUcGAMbJxIIMi8-IIiMRII0gryrJIKmdJadrqslsamCAp4KlkAbJWWamqVCvqVKgrunhjY+AAKJACCAJpBoWBCEFGicXwCwqIpaWWVagrmmZKylhVFJojSBlYqNXnalgp2lpZtsR0+PQNDeERkAMLEQxSYtGCoYxwT8dNJUApbQLGqVNZaeqsNSSLYlRaWPA6azNNa7FQYy5eTp4W6DEIPZ6vEIUZC0ADGAGtxjFJgkZskpFpQZZwbJIZVobDiohZKorNVcgZ2SpoW4PFdvN0+vjgngAOq9AgAFTe6HJAgAbugmDSeFNErMpEskUtFmkVNJWOieQhOVo8IsFLtcrktCpLFosddugAlMgAfTxFAArkJqHRGCxfrT-obGQgALSIyrrTL2LT2WEKZq28xWGx2FxOFzeqW4-1BmUURjoHCRGP6+mA8SIGoF8zMo6sVgVSq2iqsfbNWyyaRWxrrdwSoTcCBwCY+v4GhlAxCJseOtNrZZZk5qW2JyRZJGyZxnxrd3JlnHEcjL5tGhAbJGaVOyDHs6rOw+WqxLWorS0RYdHBG8fH8QIQgfAEn1yCwxw0CotGcaFdn7bYEFUCwe0KSxWHBQDpHA6U7mg2MVxbFJ5FUOQ1GZOpNHHVgjEwyxpEqPBnE9WRKitfc8hI3EZXuR4Xig4IYPjNcEFFIcYWY2RbFULRgJUW11kRfDmktJxM12WQhLxe5FRVIYpNXVsEA-PBaKUhiNBkK1WJKdYLGyHTpD0scDCMys8QsqjEHwvAP0Keo8nUU4HFtZzbOadjmhzXtnGnVwgA */
 id: "player",
 context: ({ input }) => ({
  winning: undefined,
  uuid: undefined,
  location: undefined,
  // @ts-ignore
  slot: input.slot,
  // @ts-ignore
  systemId: input.systemId,
  // @ts-ignore
  hook: input.hook,
 }),
 states: {
  IDLE: {
   entry: [sendTo(({ system }) => system.get("arxiv"), { type: "onDone" })],
   on: {
    register: {
     target: "PRE_PLAY",
     actions: [assign({ uuid: ({ event }) => event.uuid })],
    },
   },
  },

  ENDING: {
   on: {
    reset: {
     target: "IDLE",
     actions: assign({
      winning: undefined,
      uuid: undefined,
     }),
    },
   },
  },

  PLAYING: {
   states: {
    DECIDING: {
     entry: [
      sendTo(({ system }) => system.get("arxiv"), { type: "onDone" }),
      log(({ context }) => context, "player"),
      enqueueActions(({ context, enqueue }) => {
       context.hook.onDeciding(context, enqueue);
      }),
     ],
     on: {
      yield: {
       target: "WAITING",
       actions: sendParent(({ context: { systemId, location } }) => ({
        type: "playerYield",
        destination: location,
        systemId,
       })),
      },
      pick: {
       target: "WAITING",
       actions: [
        sendParent(({ event, context: { systemId } }) => {
         assertEvent(event, "pick");
         return {
          type: "playerPick",
          destination: event.destination,
          systemId,
         };
        }),
        assign({
         location: ({ event }) => event.destination,
        }),
       ],
      },
     },
    },
    WAITING: {
     on: {
      activate: "DECIDING",
     },
    },
   },

   on: {
    end: {
     target: "ENDING",
     actions: assign({
      winning: ({ event }) => event.winning,
     }),
    },
   },

   initial: "WAITING",
  },

  PRE_PLAY: {
   entry: [sendTo(({ system }) => system.get("arxiv"), { type: "onDone" })],
   on: {
    unregister: {
     target: "IDLE",
     actions: [
      assign({
       uuid: undefined,
      }),
     ],
    },

    start: {
     target: "PLAYING",
     actions: [
      log(({ event }) => event, "player, start"),
      assign({
       location: ({ event }) => event.location,
      }),
     ],
     reenter: true,
    },
   },
  },
 },
 initial: "IDLE",
});

export type GStartPreEvent = { type: "startPre" };
export type GStartEvent = {
 type: "start";
 playerOrder: number[];
 playerLocation: string[];
};
export type GEvent =
 | GStartPreEvent
 | GStartEvent
 | { type: "playerYield"; destination: string; systemId: string }
 | { type: "playerPick"; destination: string; systemId: string }
 | { type: "reset" };

type PlayerRefs = PlayerRef[];

export interface GameHook {
 onIdle(
  context: GameContext,
  enqueue: {
   // @ts-ignore
   sendTo(
    // @ts-ignore
    to: ({ system }: { system: ActorSystem<ActorSystemInfo> }) => Any,
    event: MetaEvent,
   );
  },
 ): void;
}

export type GameContext = {
 remaining: number;
 playerRefs: PlayerRefs;
 playerOrder: number[];
 playerLocation: string[];
 currentPlayerIndex: number;
 hook: GameHook;
};
export const gameMachine = createMachine({
 /** @xstate-layout N4IgpgJg5mDOIC5RQIYFswDoCSARAMgKIDEA2gAwC6ioADgPawCWALk-QHY0gAeiATAHZBmAGwBmAKwBOaQEZRcweTkAOUQBoQATwHjxmBcoAsy8WqXlVAX2tbUGTAAV8AQQCa2AHIBxHARJaABsUbTAAJwAVFABrMApqJBAGZjZObj4EUUVDc3FRZXJxY2zNHURxdUxjVWNiuSVKwUl+W3t0LBcPbz88ImJg0Ij3JjAgiATuFNZ2LiTMyTVMSvJ+FsFi4zljLV0EOoNyIv5pUX4VK0q2kAdOt09fTFxCAGE8QlwyKinGGfT5xAtAxrfj8VSCLayaRrXYCUTGaryOSScQbSQSaQ2Ow3DrOe49J6vd6fUhyRJ0X5pOagTIQgySVT1fRrOSXWEIcRWTBCaEM8jScTSSRFa63PHdR4AZUirgASpEvuTkpTZhlEKJTmINqo5Gt9DriuzRPzuYIdcadRChdJRbjZYQfNhpbLXJFsAB5LzEWAsFDhFhOcLxb5JaZUtUIfjw7nkSQo-INQTSUySdkHTBHcQnM4XRkQ22OQheXA9YhB2BgFiTUMq-40iqyTDo-h1GqghnZdmsw6qfmqXvkY3GYU27Fipz2gD6PlcAFkSD6-VWQxTUqqAZGNcthJVzHHpEnkUas9zhVYzQzkUpbNiOPQIHBuLcfmu67xEHJodVFqo1ozVHy4hdpImDKEKCgyNkAq6gWWB9IQL5-NS76RsY-CYKciiyMakEyEB5QIA0IH8EYzTyC2JGCK0Y64l0Dw+Ih4YbqY5DLL2IIbMYWyCjsBGgqx0jkMI6iiLUMiMqIsHivR-hEIx671lk8hiC2Ql7maaH8GmQoZs0sYKEo2aolJdEEs8bzPLg8lvgsUYYeY6icuQpjNOy+QgRqApDpi3HDiZ+JSjK8rWchCwoqBB6fpIwiCWoqYERIIFocYsaKJ+UJSfajrOq6HpeCFEaqd+ah-pUgFuc5GEFIlxiCUcyaSTRhbFj0BUbsKqjbs5KUaqyUZFF2yLcqRMi6mhhkmVOM7zm1ikUVVWGnLGpx4eywrocIgiKKJZolaOthAA */
 id: "game",
 types: {} as {
  context: GameContext;
  input: { hook: GameHook; playerHook: PlayerHook };
  events: GEvent;
 },
 context: ({ input, spawn }) => ({
  remaining: 0,
  playerRefs: [
   spawn(playerMachine, {
    input: { systemId: "player-0", hook: input.playerHook, slot: 0 },
    systemId: "player-0",
   }),
   spawn(playerMachine, {
    input: { systemId: "player-1", hook: input.playerHook, slot: 1 },
    systemId: "player-1",
   }),
  ],
  playerOrder: [],
  playerLocation: [],
  currentPlayerIndex: 0,
  hook: input.hook,
 }),
 initial: "IDLE",
 states: {
  IDLE: {
   entry: [sendParent({ type: "onDone" })],

   always: {
    target: "REGISTRATION",
   },
  },

  PLAYING: {
   states: {
    IDLE: {
     entry: [
      enqueueActions(({ context, enqueue }) => {
       const { playerRefs, currentPlayerIndex, playerOrder } = context;
       enqueue.sendTo(playerRefs[playerOrder[currentPlayerIndex]], {
        type: "activate",
       });
      }),
     ],
     on: {
      playerPick: {
       target: "DECIDED",
       actions: [
        log(({ context, event }) => ({ context, event }), "game, playerPicked"),
        assign({
         remaining: ({ context }) => context.remaining - 1,
        }),
       ],
      },
      playerYield: {
       target: "DECIDED",
       actions: [
        assign({
         remaining: ({ context }) => context.remaining - 1,
        }),
       ],
      },
     },
    },

    DECIDED: {
     always: [
      {
       target: "#game.ENDING",
       guard: ({ context, event }) => {
        const noMoreMoves = context.remaining <= 0;
        assertEvent(event, ["playerPick", "playerYield"]);
        const [otherPlayer] = context.playerRefs.filter(
         (playerRef) =>
          playerRef.getSnapshot().context.systemId !== event.systemId,
        );
        const locationCollide =
         otherPlayer.getSnapshot().context.location === event.destination;
        return noMoreMoves || locationCollide;
       },
       actions: enqueueActions(({ context, enqueue }) => {
        const { playerRefs, playerOrder } = context;

        let didThiefWin = true;

        const noMoreMoves = context.remaining <= 0;
        if (noMoreMoves) {
         // thief wins
         didThiefWin = true;
        } else {
         // location collide
         didThiefWin = false;
        }

        enqueue.sendTo(playerRefs[playerOrder[0]], {
         type: "end",
         winning: didThiefWin,
        });
        enqueue.sendTo(playerRefs[playerOrder[1]], {
         type: "end",
         winning: !didThiefWin,
        });
       }),
      },
      {
       target: "IDLE",
       actions: assign({
        currentPlayerIndex: ({ context }) =>
         (context.currentPlayerIndex + 1) % context.playerRefs.length,
       }),
       reenter: true,
      },
     ],
    },

    START: {
     always: {
      target: "IDLE",
      actions: enqueueActions(({ context, enqueue }) => {
       const { playerRefs, playerLocation } = context;
       for (let i = 0; i < playerRefs.length; i++) {
        const playerRef = playerRefs[i];
        enqueue.sendTo(playerRef, {
         type: "start",
         location: playerLocation[i],
        });
       }
      }),
      reenter: true,
     },
    },
   },

   initial: "START",
  },

  // Player with the smallest uuid can start the game
  REGISTRATION: {
   entry: [sendParent({ type: "onDone" })],
   on: {
    startPre: {
     target: "PRE_GAME",
     reenter: true,
    },
   },
  },

  ENDING: {
   entry: [sendParent({ type: "onDone" })],
   on: {
    reset: {
     target: "IDLE",
     actions: [
      assign({
       remaining: 0,
       playerOrder: [],
       currentPlayerIndex: 0,
      }),
      enqueueActions(({ context, enqueue }) => {
       const { playerRefs } = context;
       for (let i = 0; i < playerRefs.length; i++) {
        const playerRef = playerRefs[i];
        enqueue.sendTo(playerRef, { type: "reset" });
       }
      }),
     ],
    },
   },
  },

  PRE_GAME: {
   entry: [
    sendParent({ type: "onDone" }),
    enqueueActions(({ context, enqueue }) => {
     const { hook } = context;
     hook.onIdle(context, enqueue);
    }),
   ],
   on: {
    start: {
     target: "PLAYING",
     actions: assign({
      playerOrder: ({ event }) => event.playerOrder,
      playerLocation: ({ event }) => event.playerLocation,
      currentPlayerIndex: 0,
      remaining: 5,
     }),
     reenter: true,
    },
   },
  },
 },
});

export type TPacket =
 | { event: PEvent; to: string }
 | { event: GEvent; to: "game" };
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
    exogenous: TPacket[];
   }
 | OnReplayEvent
 | { type: "onDone" }
 | { type: "onServerInit" };

// These boilerplates are necessary evil
// @ts-ignore
export const _2t = ({ event, to }) => ({ event, to });
// @ts-ignore
export const _2ft = ({ event, from, to }) => ({ event, from, to });

export interface Broadcaster {
 from_local(event: TPacket): void;
 from_socket(event: FTPacket): void;
}

export function dispatch({
 event: metaEvent,
 system,
}: {
 event: MetaEvent;
 system: ActorSystem<ActorSystemInfo>;
}) {
 assertEvent(metaEvent, ["onSocket", "onLocal", "onReplay"]);
 // console.log("Arxiv FSM dispatches exogenous event:", metaEvent);

 const { event, to } = metaEvent;
 setTimeout(() => {
  system.get(to)?.send(event as PEvent);
  console.log("Update has been queued.");
 }, 100);
}

export type arxivContext = {
 gameRef: undefined | GameRef;
 replayPointer: number;
 exogenous: TPacket[];
 broadcaster: Broadcaster;
 block: boolean;
};

// TODO: hugely rely on robustness of existing network
export const arxivMachine = createMachine({
 /** @xstate-layout N4IgpgJg5mDOIC5QEMBOAPAlgNwHQGUBNAOQGEBiAewDt9KBjAazABcBtABgF1FQAHSrEwtMNXiHSIAbBwAcuWbIDsAViUBODgEZlq2QBoQAT2kAmKbnVbTAFlMBmDko5SbU2QF8PhtFjxEyKmoAGQZkABtOHiQQASERMRjJBCktG1wpe1lU9w5TWTyVQxMEGzsMh1cpdXsVVw57Lx8MHFwALQBRYiCASWphKPE44VFqcWSHLVwbOtdlK3sZpRtixBstFVwteyV7WxVtLOqmkF9Wzu6afDBUbBu+ge4hwRHE0AmtKa0rJW-1FXMUjUplWCBUNiU0wcZQhEJUOy0JzOeAASh0AArBACChB6xAA4uRBjFhgkxklEPZ1JClFJ3KYODVsqoNqCbBx0jpfkpfvD4RwVEiWqiMdjcQSiVpovwXmTxmtTJsVOD7PYtFJaezlFJQeqpjsqYplr9lLYhX5cAB1LE9AAqeMJNAAIjQwMSZfFRvKELZIblTdtUoqtKDbOpcGpaopTJo7AdBSdqJQIHBxMjnp63hJKV9TPkActGTMrDrjIhlrgOIUtLsdrJauZza0AqQM69ye81hXFP9FJ8ZgzdqC6uGlAUY7J-ry8k28Bc23KKQgNFs87IC+z1MWQWXSmOthpzIqVDUXKZZ7g0ZicQ6F16l-ZUgoIa4amkBTXQXtNgKtzZxxsKiKFIF7Wnat4krK96dj6Nj2BkMgnrIeplNsBi7joUz-qY3x7MyOSNF4HhAA */
 id: "arxiv",
 types: {} as {
  context: arxivContext;
  events: MetaEvent;
  input: {
   broadcaster: Broadcaster;
   gameHook: GameHook;
   playerHook: PlayerHook;
  };
 },
 context: ({ input: { broadcaster, gameHook, playerHook }, spawn }) => ({
  gameRef: spawn(gameMachine, {
   input: { hook: gameHook, playerHook },
   systemId: "game",
  }),
  replayPointer: 0,
  exogenous: [],
  broadcaster,
  block: true,
 }),
 initial: "ZEN",
 states: {
  SYNC: {
   on: {
    onSocket: {
     target: "SYNC",
     actions: [
      log(({ event }) => event, "socket"),
      assign({
       exogenous: ({ context: { exogenous }, event: metaEvent }) => [
        ...exogenous,
        _2t(metaEvent),
       ],
      }),
      ({ context: { broadcaster }, event: metaEvent }) => {
       broadcaster.from_socket(_2ft(metaEvent));
      },
      dispatch,
     ],
     reenter: false,
    },
    onLocal: {
     target: "SYNC",
     actions: [
      log(({ event }) => event, "local"),
      assign({
       exogenous: ({ context: { exogenous }, event: metaEvent }) => [
        ...exogenous,
        _2t(metaEvent),
       ],
      }),
      ({ context: { broadcaster }, event: metaEvent }) => {
       broadcaster.from_local(_2t(metaEvent));
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
     guard: ({ context }) => context.replayPointer >= context.exogenous.length,
    },
    {
     target: "WAITING",
     actions: [
      ({ context, system }) => {
       dispatch({
        event: {
         type: "onReplay",
         ...context.exogenous[context.replayPointer],
        } as OnReplayEvent,
        system,
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
