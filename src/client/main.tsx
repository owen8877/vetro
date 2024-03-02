import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Outlet, Link } from "react-router-dom";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

import './index.css'
import TestPlayers from './test_player';
import Graph from './digraph';
import { is_production } from '../server/util';

function Root() {
  return (
    <>
      <div id="sidebar">
        <h1>Page</h1>
        <nav>
          <ul>
            <li>
              <Link to={`/test_player`}>[Test] Player & Database</Link>
            </li>
            <li>
              <Link to={`/graph`}>Graph</Link>
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

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "test_player",
        element: <TestPlayers />,
      },
      {
        path: "graph",
        element: <Graph />,
      },
    ],
  },
]);

const client = new ApolloClient({
  uri: is_production ? '/graphql' : import.meta.env.VITE_GRAPHQL_PATH,
  cache: new InMemoryCache()
});

// biome-ignore lint/style/noNonNullAssertion: <explanation>
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <RouterProvider router={router} />
    </ApolloProvider>
  </React.StrictMode>
)
