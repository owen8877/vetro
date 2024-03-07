import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Outlet, Link } from "react-router-dom";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

import './index.css'
import TestPlayers from './test_player';
import TestLocalInteraction from './test_local_interaction';
import TestRemoteInteraction from './test_remote_interaction';
import TestRemoteSimple from './test_remote_simple';
import Graph from './digraph';
import Player from './player';
import { is_production } from '../server/util';

function Root() {
  return (
    <>
      <div id="sidebar">
        <h1>Page</h1>
        <nav>
          <ul>
            <li>
              <Link to={"/player"}>Active Player</Link>
            </li>
            <li>
              <Link to={"/graph"}>Graph</Link>
            </li>
            <li>
              <Link to={"/test_player"}>[Test] Player & Database</Link>
            </li>
            <li>
              <Link to={"/test_local_interaction"}>[Test] local interaction</Link>
            </li>
            <li>
              <Link to={"/test_remote_interaction"}>[Test] remote interaction</Link>
            </li>
            <li>
              <Link to={"/test_remote_simple"}>[Test] remote simple</Link>
            </li>
          </ul>
        </nav>
      </div>
      <div id="detail">
        <Outlet />
      </div>
    </>
  );
}

function Index() {
  return (
    <p id="zero-state">
      This is a demo for React Router.
    </p>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "player",
        element: <Player />,
      },
      {
        path: "test_player",
        element: <TestPlayers />,
      },
      {
        path: "graph",
        element: <Graph />,
      },
      {
        path: "test_local_interaction",
        element: <TestLocalInteraction />,
      },
      {
        path: "test_remote_interaction",
        element: <TestRemoteInteraction />,
      },
      {
        path: "test_remote_simple",
        element: <TestRemoteSimple />,
      },
      {
        index: true,
        element: <Index />,
      }
    ],
  },
]);

const client = new ApolloClient({
  uri: `${is_production ? '' : import.meta.env.VITE_SERVER_PATH}/graphql`,
  cache: new InMemoryCache()
});

// biome-ignore lint/style/noNonNullAssertion: <explanation>
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* <> */}
    <ApolloProvider client={client}>
      <RouterProvider router={router} />
    </ApolloProvider>
    {/* </> */}
  </React.StrictMode>
)
