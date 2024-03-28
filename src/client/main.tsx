import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet, Link, useRoutes, Router } from "react-router-dom";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

import './index.css';
import { store } from './store';
import TestPlayers from '../modules/test_player';
import TestLocalInteraction from '../modules/test_local_interaction';
import TestRemoteInteraction from '../modules/test_remote_interaction';
import TestRemoteSimple from '../modules/test_remote_simple';
import TestRemoteStoneSummary from '../modules/test_remote_stone/summary';
import TestReactFlow from '../modules/test_react_flow';
import Graph from '../modules/digraph';
import Player from '../modules/player';
import { is_production } from '../util';
import TestRemoteStoneSession from '../modules/test_remote_stone/session';

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
            <li>
              <Link to={"/test_remote_stone_summary"}>[Test] remote stone</Link>
            </li>
            <li>
              <Link to={"/test_react_flow"}>[Test] react flow</Link>
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
        path: "test_remote_stone_summary",
        element: <TestRemoteStoneSummary />,
      },
      {
        path: "test_remote_stone_session/:sessionId",
        element: <TestRemoteStoneSession />,
      },
      {
        path: "test_react_flow",
        element: <TestReactFlow />,
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
    <ApolloProvider client={client}>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </ApolloProvider>
  </React.StrictMode>
)
