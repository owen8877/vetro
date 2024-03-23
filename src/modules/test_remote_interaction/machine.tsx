import { ActorRef, assign, createMachine, enqueueActions, sendParent, sendTo } from "xstate";

type PlayerModel = {
  slot: number,
  uuid: string,
  existing: number[],
  lastTake: 0,
};

type PlayerModelWithRef = {
  slot: number,
  ref: any,
};

export const playerMachine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QAcA2BDAnmATgOgHUBBASQBUSA5AcQGIjiAlAEQFFmBtABgF1EUA9rACWAF2ECAdvxAAPRACYAjAFY8ANi6alAFh1cuKzSoAcAGhCZEAZmsm8u3dfULrOgOwnbAX28W0WLiEpBQ0tGwAMiQAymTs3HxIIMhCYhLSSfIInngAnF4GuZoeJiq6FlYItvaOOs6uJW6+-hjY+MTkVHREAMIUAGpEcQkyKSLiUjJZOQrq+SpuLlzOOhWIue54XEqaJgoqCoc71krNya1BbD0kzF20ZEQA0qwjSWNpk5mIALR6eNZaXK5ZY6YH5HQmVaWRBKIoaUzuBQmSHWdxcREqM4BNqEKiUO6MVjRVhkV6CcbpKY2dxqAEqFSGAEmVS6FRrKonDSHBZKDFlBS5HRYi74CIAeWiBKJJLJyVSEwyoCyHh0DnUnmswPUJi4uVm1nZtiUXP2Jz5SgFwsC+BuEVYtFiREYpN4o3llK+CEO9hMngU7msrkhSiU7NU1i2KJMS3c7h0Kncvj8IEkAggcFGIrdFM+Sp+Si4CjwKh0IYFDWWXFB7NyeD0yItOohwIhVpxttY2Y+irkiB06jU6hO6ILG1hApr6jwkNBFtRAP00bbl1Y11uNC7CqpCG+JeLpYtercler0IQcJneoU+g2diXyexQQIeK6m49ea9Ci4eX0KiB2uvZx3ENIENFUP8GmsP9SnUZdRQlV83ndXNewQPY8ADOo6kMP9S3cdR2XjTZUQZQx61mQU4OCToNyQnMeyydDMLcGl6VyC0B3ZVwi3yZk7C-Ut6RMJNvCAA */
  id: 'player',
  initial: "IDLE",
  context: {
    slot: 0,
    uuid: "",
    existing: [],
    lastTake: 0,
  } as PlayerModel,
  states: {
    IDLE: {
      on: {
        START: "WAITING"
      }
    },

    DECIDING: {
      on: {
        TAKE: {
          target: "WAITING",

          actions: [
            sendParent(({ event }) => ({ type: 'TAKE', value: event.value })),
            assign({
              lastTake: ({ event }) => event.value,
              existing: ({ context, event }) => context.existing.concat([event.value]),
            })
          ],

          reenter: true
        }
      }
    },

    WINNING: {
      on: {
        RESET: {
          target: 'IDLE',
          actions: 'reset',
        }
      }
    },

    LOSING: {
      on: {
        RESET: {
          target: 'IDLE',
          actions: 'reset',
        }
      }
    },

    WAITING: {
      on: {
        ACTIVATE: {
          target: "DECIDING",
          reenter: true
        },

        DELISTED: {
          target: "LOSING",
          reenter: true
        },

        AWARDED: {
          target: "WINNING",
          reenter: true
        }
      }
    }
  }
}, {
  actions: {
    reset: assign({
      lastTake: 0,
      existing: [],
    })
  }
});

export const gameMachine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5RQIYFswDoBKBBA6gMQDaADALqKgAOA9rAJYAuDtAdlSAB6IDMArJn4AOXqV4B2AGwAWUv1JzeAGhABPRAEYpmzDMkzNAJgCcvKUZlSAvtdWoMmAArYAogH0A4rgCyrwgDKACq42EFklEggdIws7Jw8COaYJsLCpBnppBKp-FKqGgj6ukbSFvxGRlK8lTK29uhY2ADyAKoAcgAizm4kFJwxzKwcUYkmpJhGNcISMvyaJjJWwvwFiBKSmBKklcKLJjn8Jpr1IA5NbV2YQa3Y7T3+EQP0Q-GjWpoTxrwyK-w5pG0MjWCE+EiMmAslXkUnEc3Ep3OOEu3Rud0wnVcAGEAJKYwghADSrieUUGcRGoESpgh0ks6X0SzkUlW6g+x0wvF4n1E1WO4mEiMayI6qNu9yczWCfUiNBeFISiBk0hS2nSsn4AmERhBPN0-1IfxMxp+vyFjhaouu4ucUqCJE0sui8uGioQRjyk2yHqmmmZLN1gOEekkvGEmm0Ugk2nNFytaIldpIRid5Nd7yKRmDsys4lhEZm+TZCDSE0MElE5iksh+-FjIqukulpLlsXTVL4ikmEh7K00Ih7gJBLJMmE0Ag9MJZyrqdjOwtcXUIbgCrnC-TJLreHaKaRSvzy2T2Rh20l16U5fsPPwyJh09bxABl-MFQkF3C4SRvW69KdwtKOLLyMIyoVKInysoUpi8HoyppL8xjRrwJi2HObC0BAcCcOczxttu-4IAAtIYKQCHMeSmHeVQqMWhH8IIBz8HMFgHCYTH1ng+C4b+bqmJg8jiDsFRGAsFbAsWnwyJy2TVjIUzzEhvD1p+Xi+K43EKhmfFyGxMhmIakmyOJhTmMGBxWGY47RiyRgcSiGntgRUj8RqSySBkoZSMIIL0RCiySCJpRcrkdlWp+Dn4YknwQqQrn6Ns4gbBIw5yJyyHpEc8wWP2oVXAmEV-okTEuXMbkJaGyXFsco6LBRPa+XkKFzkilp5Ta4WbnhhVaDsJVMfFHlJYG2ScuWxj6D8ORNQ0Foota6KYrimIFW6YJjl52yaBIA61ZBWhiM5SzRgcJ4JTGzXCq1Yrok2QQrRmekTKG2TKrFFkBhJUwwVIbEsdsAjjoKF2zWFdr3TupjOSJaQ1MqJilH8IIgRMTGaCsIHbTo8P1ounTgwRVgQrCoZZsagIiCCYYSKRexmBsTGiNN86OE+6mdTxWmjgJYg+iJBwrDRUFiOtIjVtGsw+hIqHWEAA */
  id: 'game',
  // preserveActionOrder: true,
  context: {
    remaining: 42,
    round: 0,
    turn: 0,
    players: [] as PlayerModelWithRef[],
    playersRemaining: [] as PlayerModelWithRef[],
    activePlayer: undefined as (undefined | ActorRef),
  },
  initial: "RAW",
  entry: [
    () => console.log('Entry of game machine: spawning players'),
    assign({
      players: ({ spawn }) => [0, 1, 2].map(slot => ({
        slot,
        ref: spawn(playerMachine, { input: { slot } }),
      })),
    }),
  ],
  states: {
    // Is this working or redundant?
    RAW: {
      always: {
        target: "IDLE",
        actions: [],
        reenter: true,
        guard: ({ context }) => context.players.length > 0,
      }
    },

    PRE_GAME: {
      on: {
        START: {
          target: "ROUND",
          actions: [
            () => console.log('Start game'),
          ],
        }
      }
    },

    ROUND: {
      states: {
        PRE: {
          always: {
            target: "TURN",
            actions: [
              ({ context }) => console.log(`Start round ${context.round}`),
              assign({ playersRemaining: ({ context }) => context.players }),
              ({ context }) => console.log(context),
            ],
            reenter: true
          }
        },

        TURN: {
          states: {
            PRE: {
              always: {
                target: "DECIDE",
                actions: [
                  ({ context }) => console.log(`Start turn ${context.turn}`),
                  assign({
                    activePlayer: ({ context }) => context.playersRemaining[0],
                  }),
                  assign({
                    playersRemaining: ({ context }) => context.playersRemaining.slice(1),
                  }),
                  sendTo(({ context }) => context.activePlayer.ref, { type: 'ACTIVATE' }),
                  ({ context }) => console.log(context),
                ]
              }
            },

            DECIDE: {
              on: {
                TAKE: {
                  actions: [
                    ({ context, event }) => { console.log(context); console.log(event); },
                    assign({
                      remaining: ({ context, event }) => context.remaining - event.value,
                    })
                  ],
                  target: "POST",
                }
              }
            },

            POST: {
              always: [
                {
                  target: "#game.END",
                  guard: ({ context }) => context.remaining <= 0,
                  actions: [
                  ],
                },
                {
                  target: "#game.ROUND.TURN",
                  guard: ({ context }) => context.playersRemaining.length > 0,
                  reenter: true,
                  actions: [
                    ({ context }) => console.log(`Ending turn ${context.turn}`),
                    assign({ turn: ({ context }) => context.turn + 1 }),
                    ({ context }) => console.log(context),
                  ],
                },
                {
                  target: "#game.ROUND.POST",
                  reenter: true,
                  actions: [
                    ({ context }) => console.log(`Ending turn ${context.turn}`),
                    assign({
                      turn: ({ context }) => context.turn + 1,
                      activePlayer: undefined,
                    }),
                    ({ context }) => console.log(context),
                  ],
                }],
            }
          },

          initial: "PRE"
        },

        POST: {
          always: {
            target: "#game.ROUND",
            reenter: true,
            actions: [
              ({ context }) => console.log(`Ending round ${context.round}`),
              assign({
                round: ({ context }) => context.round + 1,
                turn: 0,
              }),
              ({ context }) => console.log(context),
            ],
          }
        }
      },

      initial: "PRE"
    },

    END: {
      entry: [
        () => console.log('Game has ended!'),
        enqueueActions(({ context, enqueue }) => {
          for (const player of context.players) {
            if (player.id === context.activePlayer.id) {
              enqueue.sendTo(player.ref, { type: 'AWARDED' });
            } else {
              enqueue.sendTo(player.ref, { type: 'DELISTED' });
            }
          }
        })
      ],
      on: {
        RESET: {
          target: "IDLE",

          actions: [
            () => console.log('Reseting...'),
            enqueueActions(({ context, enqueue }) => {
              for (const player of context.players) {
                enqueue.sendTo(player.ref, { type: 'RESET' });
              }
            }),
            assign({ players: [], round: 0, turn: 0, remaining: 42, activePlayer: undefined, playersRemaining: [] })
          ],

          reenter: true
        }
      }
    },

    IDLE: {
      on: {
        START_PRE: "PRE_GAME"
      }
    }
  }
});