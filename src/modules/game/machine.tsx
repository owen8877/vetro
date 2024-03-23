import { createMachine } from 'xstate';

const gameMachine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5RQIYFswDoCSEA2YAxAMoAuKATqQAQAOFY1qGA2gAwC6iotA9rAEtSA3gDtuIAB6IAjABYZmAEwBOOQFYVStmwDMutgA4VAGhABPRIcW6VANiOGA7HMPr1L3QF8vZ5lgAFBiZ0IjJKGn92LiQQPkFhMQlpBDlXTF11AydtO3cNOTNLBGsM+zYnXVcVJztrQx8-UMwAJV4AV1EITCDGCg6uknIqan7OiGiJeKERcViUuydMd3scgyqZQyVDIsRdQztMSsMDwwqc+yVGkH9Wge6AFXaKUR7g0mfRIYjqD5fJ2LTRJzUApGQyJQZSpZFTqNjqVTuHYWRB5Q5OdQaFRuM66OpOa63NrjTBPF5vXjxRhoXgANzCwxoYEk6GoNPpAJ4-BmSXmiBUKkw2LSTmcbDsArY9l2JW0mDsmQRcilUpkuiuvhuzWJXVJn0wADUwKReD1+DR6SbCABRLrUZms9lgTlxbnA5KomRLOQ5L0uZyGPEywOKTbYpQeVRKTYNTVE+568lGk1vRiW3jfEbpl1A2YehAyBHKbFaKVbBHqCEymRsOS6ZR2PLixYqKqYwnahNk17WyRgADG7VI1LpRFtEF+nxzbrzfIQdnSmW25yyGncMrRR0xmlFsJrrg7GDuJO7ZtgND+X3H1B1E04UxnvNBqMymB92y9lfBEcKKIQ+3RfZTnOVQ7A1Joj1vRNXgCc1JxeQgADlmQvKd70BR8QSkPYnEFbQpTkBwFFcM4nBlSMjgxBUWwUNUCTjTsSVg89RnuJCUNY8ZpwSWdnwQJQnCWQttAMQw5CUOxNnUGUJMURtYQMBclDxOxDywKDmJoMZBjISkQlYdCuR4p9sPnCMt0xPRVxOCpgxsco6jYATXGjVSGMgrt9WTU0ABEBwECAiAAQSgBgwAwURSG4nksJSfQ8I8NhPxqZU3Gkv9wVsN9dFqJwZEbCpNnoiD1M8pNjVNTTqHTdjJBobzovdOcqnrYxnPyn0tEbX9ihqQ4JIcaMTiVOQVDU49dVPbzMD8-sAqIAB5AAjAArAdgUa3jTPkQwhX0XLsRVBRkWKCEkqOUackbA5VXGqCpoqw1eGHUZ2gIVNquehkflpL7NpMsEVDYZZjH2ZUtHUNEetkBRBU2HRbARNwcmKrUPJPLzHoNL7Xve2b5sIfHBDEf7YsQbQbCcIwY3kMCJWhgtMSWcVdELeG8TkO6yteabsZeig3sCODfuHWqLT+wzXWMsn-1UDI4XsMCsgqaUMp9dQ3zSJQIx0FQISUTn3NKjHypTPm+kFs9xdF83qH7Xg0FoAhhzvGIjJi-N8rh3CckI3CtgFMiMsqJY8lFPIVmVfQuZNnnHvxwLqoq+0ADMU-WgR6VEOBYEIbzqFEZ7qAEURU-T-sosl3MAcQUbDj1mpWdqGQ1D19LTthzB4aMGpKzrcUY8mzGUwTtNk7ANOM6znO8+Tkuy-W0n8wAWkbeUIyBtRRu1luTphluu7OIw0nUYa8R8TVC8C+BYn8B9pZX6NgaVze0i0aNsRlVeu7yr0BVbcSVlvBGxwPgMA98PZznkMsEOklWw5VbIWOyygDZ602HiKUmJgElQ+nfDCD9mrgkwE5QSNYj4HAUMg7Wo1wSBgcLCOsg8IAQKanxZe+VIQvwItvD+e8CwuC7k5bYrgdAQnsIbHBGlgjaWYfgyBfEwLEJUjUCozk6xKBkpJN82I8TGBOBKdUEi0bGyHi8FhW0UjsOgVwre79d4ylcBrbQgY9YKjygoZSTDoIfUvOYmuBYpQXVcDkY+eQTgaL-BRIi6tyxU1Gl408QRKT8BHPSPxMtwQ2AKMqDEootj5RlC4YG8gNBXUWKzZwCTh68HSfmNwQp4TWDrME8UgZgwnHlNiQSAlCzZDGiA+61SPrplqVA9wmBnD4VER4YwGIZR9WIWoNwEo9DOELFU02vl-KBVGXxeQGt-YuHyAuQiC5qxqjwo2OEjZcJtiMfGWOmBewDiHKk8BcjWGmSVm+EhZDAx10KT6H+WxJLwnyjldQGyYJwV8R8ixqJxLENqAcFG6ozgROKKfRQjc3B6CjgcSFAyExVRkbsr5Aku6EXBEDNI8IBKaMUKNOheiDjwPGgAcVCNQccZKUi4iFG4eQyl1hLKoag2sLc+7qlRg80xccUxVRGXC-xo1BTwkhguMSSVGzzNqIsxxKz9h5UJZI7mhosY4wFgQXlMNISn1bFqiGUNqw9OLE5RuClahQvNWbS1lteifWHDagsagu5gS1nWTErh9jVkyEsQSmQpSqFaTlb1vM-V422e892nzAZyDDQbcSka0h0OrK4RQp8cq+0bANGVjE5U+tNLbK1QsWIi2zVLeRpl8IZAOAqQMOh7UnGrHAt82se6Q1wsqE1xiJqPCGaPJOJoF4V0zmAbOsAb45vhQWfQDSsXNLFHUXQ1ZAwazCR4xYmwrkXy8EAA */
  id: 'game',
  initial: 'Idle',
  states: {
    Idle: {
      on: {
        "Start pre game": "Pre game"
      }
    },

    "Pre game": {
      on: {
        "Start game": "Round"
      }
    },

    Round: {
      states: {
        "Pre round": {
          on: {
            "Start round": "Turn"
          }
        },

        Turn: {
          states: {
            "Pre turn": {
              on: {
                "Start turn": "Propose move"
              }
            },

            "Propose move": {
              on: {
                "Start exam move": "Veto"
              }
            },

            Veto: {
              states: {
                "Pre veto": {
                  on: {
                    "Start veto": "Decide"
                  }
                },

                Decide: {
                  on: {
                    Agreement: "Post veto",
                    Objection: "Vote rule"
                  }
                },

                "Post veto": {
                  on: {
                    "Next Veto": "Pre veto",

                    "End exam move": {
                      target: "#game.Round.Turn.Execute move",
                      reenter: true
                    }
                  }
                },

                "Vote rule": {
                  states: {
                    "Pre vote": {
                      on: {
                        "Start vote": "Decide"
                      }
                    },

                    Decide: {
                      on: {
                        Decision: "new state 1"
                      }
                    },

                    "new state 1": {}
                  },

                  initial: "Pre vote"
                }
              },

              initial: "Pre veto"
            },

            "Execute move": {
              on: {
                "End turn": "Post turn"
              }
            },

            "Post turn": {
              on: {
                "End Round": "#game.Round.Post round",
                "Next turn": "Pre turn"
              }
            }
          },

          initial: "Pre turn"
        },

        "Post round": {
          on: {
            "Next round": {
              target: "Pre round",
              reenter: true
            },

            "Stop game": {
              target: "#game.Game End",
              reenter: true
            }
          }
        }
      },

      initial: "Pre round",
    },

    "Game End": {
      type: "final"
    }
  }
});

export default gameMachine;