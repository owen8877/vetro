import * as React from "react";
import "./App.css";

import MyGraph from "./my-graph";
import { Player } from "@prisma/client";
import { useQuery, gql } from "@apollo/client";
import client from "./apollo";

const PlayerQuery = gql`
query PlayerQuery {
  player(nodeId: "") {
    id
    username
  }
}
`;

const PlayerMutation = gql`
mutation PlayerMutation {
  createPlayer(input: {player: {}}) {
    clientMutationId
  }
  deletePlayer(input: {nodeId: ""}) {
    clientMutationId
    deletedPlayerId
  }
}
`;

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      players: [],
    }
  }

  async get_data() {
    const res = await client.query({ query: gql`{ allPlayers { nodes { id nodeId username } } }` })
    console.log(res);

    this.setState({ players: res.data.allPlayers.nodes ?? [] });
  }

  async componentDidMount() {
    await this.get_data()
  }

  async add_user() {
    const res = await client.mutate({
      mutation: gql`
      mutation ($username: String!){
        createPlayer(input: {player: {username: $username}}) {
          query {
            allPlayers {
              nodes {
                id
                nodeId
                username
              }
            }
          }
        }
      }`, variables: {
        username: 'bb',
      }
    })
    console.log(res);

    this.setState({ players: res.data.createPlayer.query.allPlayers.nodes ?? [] });
  }

  async delete_user() {
    if (this.state.players.length <= 0) {
      return
    }
    const res = await client.mutate({
      mutation: gql`
      mutation ($nodeId: ID!){
        deletePlayer(input: {nodeId: $nodeId}) {
          query {
            allPlayers {
              nodes {
                id
                nodeId
                username
              }
            }
          }
        }
      }`, variables: {
        nodeId: this.state.players[0]?.nodeId,
      }
    })
    console.log(res);

    this.setState({ players: res.data.deletePlayer.query.allPlayers.nodes ?? [] });
  }

  renderPlayers() {
    console.log(this.state.players);

    return this.state.players.map(player => `{${player.id} ${player.username}},`)
  }

  render() {
    return (
      <>
        <button onClick={() => this.add_user()}>add user</button>
        <button onClick={() => this.delete_user()}>remove user</button>
        <div>{this.renderPlayers()}</div>
        <MyGraph />
      </>
    );
  }
}

export default App;
