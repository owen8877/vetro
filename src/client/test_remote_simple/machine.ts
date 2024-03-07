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
  /** @xstate-layout N4IgpgJg5mDOIC5RQIYFswDoBKBBA6gMQDaADALqKgAOA9rAJYAuDtAdlSAB6IDMArJn4AOXqV4B2AGwAWUv1JzeAGhABPRAEYpmzDMkzNAJgCcvKUZlSAvtdWoMmAEKEAsgHkAagFEylJCB0jCzsnDwImiKYEpESMibyvEaymsKqGgimvHoyEsLCMsLGMbwmtvboWLhuXr4UnEHMrBwB4aWYpCap+akJUjFp6ohZOXkFRUYlZeUgbLQQcJwOYA30TaGtiAC0qZgm8VImcRJ5pEba6dv8gkf8MvxSvKkSJmY2diDLOASrwc1hwxMHQUYiM-CM5yOBUuEUUmDE0lkRgEmhKvBmXycv3WLVA4VMwPEZ3BkLyMhhhhk0RM+R0D1kJgeGMqmFw2JCuO4gMJoJJmih5KGmUm8M0TxkEty5lk-FstiAA */
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