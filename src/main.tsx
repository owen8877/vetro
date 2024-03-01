import React from 'react'
import ReactDOM from 'react-dom/client'
import { ApolloProvider } from "@apollo/client";

import App from './client/App.tsx'
import './client/index.css'
import client from './client/apollo'

// biome-ignore lint/style/noNonNullAssertion: <explanation>
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>,
  </React.StrictMode>,
)
