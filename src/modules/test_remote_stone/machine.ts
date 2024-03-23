import {
 ActorRefFrom,
 ActorSystem,
 ActorSystemInfo,
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
type PTakeEvent = { type: "take"; value: number };
type PEndEvent = { type: "end"; winning: boolean };
export type PEvent =
 | PRegisterEvent
 | PUnregisterEvent
 | { type: "start" }
 | PTakeEvent
 | { type: "yield" }
 | { type: "activate" }
 | PEndEvent
 | { type: "reset" };

export type PlayerContext = {
 winning: undefined | boolean;
 uuid: undefined | string;
 systemId: string;
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
 /** @xstate-layout N4IgpgJg5mDOIC5QAcA2BDAnmATgOgEkARAGQFEBiHMKAS1gBdcBtABgF1EUB7WWh2twB2XEAA9EARgBMAVjwBOBZIDMAdmmSAHHMlqVsgDQhMiLZLwAWbWsuyF6tawdqAvq+NosuPGQByRAR+AOJUcGAMbJxIIMi8-IIiMRII0gryrJIKmdJadrqslsamCAp4KlkAbJWWamqVCvqVKgrunhjY+AAKJACCAJpBoWBCEFGicXwCwqIpaWWVagrmmZKylhVFJojSBlYqNXnalgp2lpZtsR0+PQNDeERkAMLEQxQM6ADWYOMxkwkzZJSLSVPCSSSVVg6TRqLSyViVYqIWqg+HmVT2LSsWTNWSXLydPC3QYhB7PV4hCiYWhgVBjDgTeLTJKgFLaUHgyHQvRwhFIhDNNR4EH2BxZaRQ6T467dPok4J4ADqvQIABU3ugAMYCABu6CYvx4U0Ssyk9XKFVUCmk+ixcn5sjUFg0kgRuUqcK0KhU0u83QASmQAPrEigAVyE1DojBYDL+TJNQIQAFpLHhKutMpj7JITs1+eYrDY7C4nC5fYSuoGQ3KKIx0DhInGjQCWeJEDUi+YtMtrKxWBVEdsEBVWPtBfkJY11u4PCAhNwIHAJjLGcbAazEMnZNJ05m1sscyc1Pzk+CyrzTippGlZPDrRWfMRyGvW6aEBthZoM7JvbIQQ00inteVhLLUEogrC0iVJIj74P4gQhK+zLvrkFg7hoFRYtkmFDiUqgWP2hSWAiuYaFKc4EjccpDMhiabgg6F5IUv7aEoub8ioPZggcNTSHYO5aFiFyUTKRI0aSjwvIhwR0Ru7apI0YLNIsEGDrCRjDvCQrnOYlQ2pYOgaKwbiiX64l3KSypqrR8brm2KQnHg-4kXYWHsVsJTwmmpx6QZRkSqZ7TmVWwbEnJDnImOv6FPUeTqKcDj8hK8gQioljQS0kIqM4s6uEAA */
 id: "player",
 context: ({ input }) => ({
  winning: undefined,
  uuid: undefined,
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
      take: {
       target: "WAITING",
       actions: sendParent(({ event }) => ({
        type: "playerTake",
        value: event.value,
       })),
      },
      yield: {
       target: "WAITING",
       actions: sendParent({
        type: "playerYield",
       }),
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
     reenter: true,
    },
   },
  },
 },
 initial: "IDLE",
});

export type GStartPreEvent = { type: "startPre" };
export type GStartEvent = { type: "start"; playerOrder: number[] };
export type GEvent =
 | GStartPreEvent
 | GStartEvent
 | { type: "playerYield" }
 | { type: "playerTake"; value: number }
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
 currentPlayerIndex: number;
 hook: GameHook;
};
export const gameMachine = createMachine({
 /** @xstate-layout N4IgpgJg5mDOIC5RQIYFswDoCSARAMgKIDEA2gAwC6ioADgPawCWALk-QHY0gAeiATAHZBmAGwBmAKwBOaQEZRcweTkAOUQBoQATwHjxmBcoAsy8WqXlVAX2tbUGTAAV8AQQCa2AHIBxHARJaABsUbTAAJwAVFABrMApqJBAGZjZObj4EUUVDc3FRZXJxY2zNHURxdUxjVWNiuSVKwUl+W3t0LBcPbz88ImJg0Ij3JjAgiATuFNZ2LiTMyTVMSvJ+FsFi4zljLV0EOoNyIv5pUX4VK0q2kAdOt09fTFxCAGE8QlwyKinGGfT5xAtAxrfj8VSCLayaRrXYCUTGaryOSScQbSQSaQ2Ow3DrOe49J6vd6fUhyRJ0X5pOagTIQgySVT1fRrOSXWEIcRWTBCaEM8jScTSSRFa63PHdR4AZUirgASpEvuTkpTZhlEKJTmINqo5Gt9DriuzRPzuYIdcadRChdJRbjZYQfNhpbLXJFsAB5LzEWAsFDhFhOcLxb5JaZUtUIfjw7nkSQo-INQTSUySdkHTBHcQnM4XRkQ22OQheXA9YhB2BgFiTUMq-40iqyTDo-h1GqghnZdmsw6qfmqXvkY3GYU27Fipz2gD6PlcAFkSD6-VWQxTUqqAZGNcthJVzHHpEnkUas9zhVYzQzkUpbNiOPQIHBuLcfmu67xEHJodVFqo1ozVHy4hdpImDKEKaixtI-LGAekgFlgfSEC+fzUu+kbGPwmCnIosjGjIogyEB5QIA0IH8EYzTyC25GCK0Y64l0Dw+Mh4YbqY5DLL2IIbMYWyCjsxGghxUHCP22yFKs8Hikx-hECx671lk8hiC25AbMiZoYfwaZChmzSxgoSjZqiUmMQSzxvM8uDyW+CxRlh5jqJy5CmM07L5CBGoCkOmJ8cOpn4lKMryjZqELCioEHp+kjCFBaipsREggRhxixoon5QlJ9qOs6roel4oURqp35qH+lSAe5LlYQUSUwUc0GiFJRYlr4hUbsKqjbi5fG9iUMhdsi3IUTIuoYUZplTjO85tYp1HVThpyQQRArssKmHCIIiiiOCOq-qOthAA */
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
    input: { systemId: "player-0", hook: input.playerHook },
    systemId: "player-0",
   }),
   spawn(playerMachine, {
    input: { systemId: "player-1", hook: input.playerHook },
    systemId: "player-1",
   }),
  ],
  playerOrder: [],
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
      playerTake: {
       target: "DECIDED",
       actions: assign({
        remaining: ({ context, event }) => context.remaining - event.value,
       }),
      },
      playerYield: {
       target: "DECIDED",
       actions: [],
      },
     },
    },

    DECIDED: {
     always: [
      {
       target: "#game.ENDING",
       guard: ({ context }) => context.remaining <= 0,
       actions: enqueueActions(({ context, enqueue }) => {
        const { playerRefs, currentPlayerIndex, playerOrder } = context;
        const lastTakingSlot = playerOrder[currentPlayerIndex];
        for (let i = 0; i < playerRefs.length; i++) {
         const playerRef = playerRefs[i];
         enqueue.sendTo(playerRef, {
          type: "end",
          winning: lastTakingSlot === i,
         });
        }
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
       const { playerRefs } = context;
       for (let i = 0; i < playerRefs.length; i++) {
        const playerRef = playerRefs[i];
        enqueue.sendTo(playerRef, { type: "start" });
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
      currentPlayerIndex: 0,
      remaining: 20,
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

// TODO: hugely rely on robustness of existing network
export const arxivMachine = createMachine({
 /** @xstate-layout N4IgpgJg5mDOIC5QEMBOAPAlgNwHQGUBNAOQGEBiAewDt9KBjAazABcBtABgF1FQAHSrEwtMNXiHSIAbBwAcuWbIDsAViUBODgEZlq2QBoQAT2kAmKbnVbTAFlMBmDko5SbU2QF8PhtFjxEyKmoAGQZkABtOHiQQASERMRjJBCktG1wpe1lU9w5TWTyVQxMEGzsMh1cpdXsVVw57Lx8MHFwALQBRYiCASWphKPE44VFqcWSHLVwbOtdlK3sZpRtixBstFVwteyV7WxVtLOqmkF9Wzu6afDBUbBu+ge4hwRHE0AmtKa0rJW-1FXMUjUplWCBUNiU0wcZQhEJUOy0JzOeAASh0AArBACChB6xAA4uRBjFhgkxklEPZ1JClFJ3KYODVsqoNqCbBx0jpfkpfvD4RwVEiWqiMdjcQSiVpovwXmTxmtTJsVOD7PYtFJaezlFJQeqpjsqYplr9lLYhX5cAB1LE9AAqeMJNAAIjQwMSZfFRvKELZIblTdtUoqtKDbOpcGpaopTJo7AdBSdqJQIHBxMjnp63hJKV9TPkActGTMrDrjIhlrgOIUtLsdrJauZza0AqQM69ye81hXFP9FJ8ZgzdqC6uGlAUY7J-ry8k28Bc23KKQgNFs87IC+z1MWQWXSmOthpzIqVDUXKZZ7g0ZicQ6F16l-ZUgoIa4amkBTXQXtNgKtzZxxsKiKFIF7Wnat4krK96dj6Nj2BkMgnrIeplNsBi7joUz-qY3x7MyOSNF4HhAA */
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
      ({ context: { broadcaster, exogenous }, event: metaEvent }) => {
       exogenous.push(_2t(metaEvent));
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
      ({ context: { broadcaster, exogenous }, event: metaEvent }) => {
       const event = _2t(metaEvent);
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
