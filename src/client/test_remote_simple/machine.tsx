import { assign, createMachine, sendParent } from "xstate";

export const playerMachine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QAcA2BDAnmATgOgHUBBASQBUSA5AcQGIyiBpAUQG0AGAXURQHtYAlgBcBvAHY8QAD0QBaACzy8AZnYA2AJwb2y+do0AOeUYA0ITIgCMGtXjUBWAwHYATAaPKn7V-YC+-szFeCDhJNCxcMP5hUQkkaTkNFxV1LR09dkNjMwsENQM8PRdjdmsDJPt2FwCQcOx8YnIqaijBEXFJGQQDdkLLeUtlNU0nSyM1ZRyre3s8dwN7YdcDIbGnf38gA */
  id: 'player',
  context: {},
  states: {
    WAITING: {
      on: {
        TAKE: {
          target: "WAITING",
          actions: [
            sendParent(({ event }) => ({ type: 'MOVE', value: event.value })),
          ]
        }
      }
    }
  },
  initial: "WAITING"
});

export const gameMachine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5RQIYFswDoBKBBA6gMQDaADALqKgAOA9rAJYAuDtAdlSAB6IDMArJn4AOXqV4B2AGwAWUv1JzeAGhABPRAEYpmzDMkzNAJgCcvKUZlSAvtdWoMmXIQCyAeQBqAUTKUkIOkYWdk4eBF4TTFITTWE42JNSKQlY1Q0EU149GQk4mWFjFIjbe3QsACFXTx8KTkDmVg5-MM0RTBT+CRlE-l4jWVT1REzs3OF8ws1ikpA2Wgg4TgcwOvoGkObEAFpYzBNuqRMuiVzSI2007f5BI-4rVqMxuWEZ5ZwCVaDG0OHI+XEzvwjOcjuNLghNIpMGJpLIjAJNEVeK8yphyp91k1QGFTFEFDCLCZ+JpuopweZhEJ+BZpLlITJqSjHLgMcEsdxfniAUYgSDcjJwcCJNCpiSZOKJOZZPxbLYgA */
  id: 'game',
  context: {
    counter: 0,
    players: [],
  },
  initial: "RAW",
  entry: [
    () => console.log('Entry of game machine: spawning players'),
    assign({
      players: ({ spawn }) => [0,].map(slot => ({
        slot,
        ref: spawn(playerMachine, { input: { slot } }),
      })),
    }),
  ],
  states: {
    // Is this working or redundant?
    RAW: {
      always: {
        target: "A",
        actions: [],
        reenter: true,
        guard: ({ context }) => context.players.length > 0,
      }
    },
    B: {
      on: {
        MOVE: {
          target: "A",
          actions: assign({
            counter: ({ context, event }) => context.counter + event.value
          }),
        }
      }
    },
    A: {
      on: {
        MOVE: {
          target: "B",
          actions: assign({
            counter: ({ context, event }) => context.counter + event.value
          }),
        }
      }
    },
  }
});