import { ActorRef, assign, createMachine, enqueueActions, sendParent, sendTo } from "xstate";

type PlayerModel = {
  id: string,
  existing: number[],
  last_take: 0,
};

type PlayerModelWithRef = {
  id: string,
  ref: any,
};

export const playerMachine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QAcA2BDAnmATgOgEkARAGQFEBiAQQHUqAlIsogbQAYBdRFAe1gEsALvx4A7biAAeiACwA2NngBMATjkyAHAFYNARi0BmXXIDsJgDQhMiA2y14dGmSqN6NLlQF9PltFlyEpJRMJAQAygAqzOxcSCDIfEIi4nHSCK54ZiZsBnK6us5yKiZaltbpTnhOGkq6JroqNSa53r4Y2PjE5NQAwhEEAGpUUTESCQLCYhJpSrN4Kvp2WmxySjIyJRpliLWKyw0mGiZFcgrqrfHtAUw9xAQAcgDiFBFUANJko3HjSVOpiPoNA5dBo2DklkoNE5tgglCYVPNlgYDGotHIUSotDJvD4QKIeBA4GMrjgxolJilQGljA50bZ5DI2Iyiko5DDdHMXBtavpjmitLoLn4OoFyGSJslpjYClUGlpVKotCZIWiYUZFOj0TIUUo2EcWrjhdcyLciA9HuLfpSpIh1LTkUz1EyVi4Ybs8A74dpjrVbHIhSS8DQHvdzZaKVKEPJ7OjdGx6siDLMVEy1SmHMmdHVqvoDAH-PgSAB5MJh77kyX-dJzeUaXLFJNxlylKyyPR4PUJlF1XNKHGeIA */
  id: 'player',
  initial: "IDLE",
  context: ({ input }) => ({
    id: input.id,
    existing: [],
    last_take: 0,
  } as PlayerModel),
  states: {
    IDLE: {
      on: {
        AWARDED: {
          target: "WINNING",
        },
        DELISTED: {
          target: "LOSING",
        },
        ACTIVATE: {
          target: 'DECIDING',
        }
      }
    },
    DECIDING: {
      on: {
        TAKE: {
          target: 'IDLE',
          actions: [
            sendParent(({ event }) => ({ type: 'TAKE', value: event.value })),
            assign({
              last_take: ({ event }) => event.value,
              existing: ({ context, event }) => context.existing.concat([event.value]),
            })
          ],
        }
      }
    },
    WINNING: {},
    LOSING: {},
  }
});

export const gameMachine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5RQIYFswDoCSARAMgKIDEAygCoCCASuQPoAK1hA2gAwC6ioADgPawAlgBdBfAHbcQAD0QAmAKyYFATgAsbAMyKAjGoAcANk36dcgDQgAnoh2G5mOQHY1ctmpV63mhQF9flqgYmEyEdADilACyJBQ05OxcSCD8QqISUrIImmyYanZqBmwKcvoKCppOFtaIlUpOxYb2Kk4KWmzG-oHoWNQA8gCqAHK4IczEiVKpImKSyVkquXLa+i4KOupqhmWWNghOlZgNcqXqLSqqOl0gQb2DI5jkA9RDYySTydPpc6BZOjq5MyaAzlJyLAq7WxsKqYewnRpaNRtTTXW6YfrDUZPF6YXCEADCeBIVAA0qxOFMBDMMvN5CoHE57EU1MDCh0FJCEP9PJhNJoAfpNMZPFp9Kieuj7ljnq8GH0KBMKZ8qd9Mog1IzMJ5th0kT59NU9gKdMoGmVVCoVKyxQEbhKMQ9sbL5eQJjokrwVbM1QhFIZHNDFMs9B1DByaly2Dp9HlKiZ-k0nHZxcEHdKcXKFSw5B6Ul6ab91aUjoVDFoy-9VoZOfp9Ll8k5BUKmiykSm7piQi7Fbmvt7adl3I4nCOyjoFKsGjpOWGVJgdD5FI0wxq1O3MIQRsRmKRCAklZ60v3CwgPLlinZSmCXCyhZzL8PXO5PE+fP5beI+BA4FJbpSjwWMiIAAtPkWo+EiCjNCo9jGJywHnosYYLlGbRWvo9JOOueBEP+1I-EBp6Gogqy8sUrhNJajIGn4tpoqEETRIQeGqgOriYFG+pQVaHT6AYnI5HObC8WwyxGLqWzrmmLHHoR-q6gohSVMJcbbJy5QOOolTOBciKaCoUlSm8MmAX8okcYYSJKQ0WgHE4M4aLy+l1qo6z2OOhmdk6JkEVkikWVZLI2XG9kRp4c7qOUL46CO16eY6MrGcqAG+VCDgKdZKl2fewlOLyDZmLeGqWvF6avHihJ4j5PoAnldirFGrSrJF4ZGjk-qFEmLRuDZyZ0faRlOl2FDVWxiy8gc0Iarqhgwa1tjLJosIXM0DQ+AuNrdKmRmZuQo0nnIMGONGgpyMVzjmjWjmKdGE4alBGxyOum64PthEeDGbAYTFWjRnYqgCbWvIKGs0Ig41T3vkAA */
  id: 'game',
  // preserveActionOrder: true,
  context: {
    remaining: 42,
    round: 0,
    turn: 0,
    players: [] as PlayerModelWithRef[],
    playersRemaining: [] as PlayerModelWithRef[],
    activePlayer: undefined as (undefined | ActorRef),
    winningPlayer: undefined as (undefined | ActorRef),
  },
  initial: 'IDLE',
  states: {
    IDLE: {
      on: {
        START_PRE: {
          target: "PRE_GAME",
          actions: [
            () => console.log('Start pre game: spawning players'),
            assign({
              players: ({ spawn }) => ['0', '1', '2'].map(id => ({
                id,
                ref: spawn(playerMachine, { input: { id } }),
              })),
            }),
          ]
        }
      }
    },

    PRE_GAME: {
      on: {
        START: {
          target: "ROUND",
          actions: [
            () => console.log('Start game'),
            'startGame',
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
                    assign({ winningPlayer: ({ context }) => context.activePlayer }),
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
            if (player.id === context.winningPlayer.id) {
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
            () => console.log('Releasing memory...'),
            enqueueActions(({ context, enqueue }) => {
              for (const player of context.players) {
                enqueue.stopChild(player.ref);
              }
            }),
            assign({ players: [], round: 0, turn: 0, remaining: 42, activePlayer: undefined, playersRemaining: [] })
          ],
        }
      }
    }
  }
});