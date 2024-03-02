import { createServer } from "node:http";
import express from 'express';
import postgraphile from 'postgraphile';
import { grafserv } from "postgraphile/grafserv/express/v4";

import { is_development } from './util';
import preset from "./graphile.config";

const app = express();
app.use(express.static('dist'));  // Vite-compiled static files
if (is_development) {
  console.log('Enabling CORS!');
  const cors = require('cors');
  app.use(cors());
}

const server = createServer(app);
server.on("error", (e) => {
  console.error(e);
});

// Add the Grafserv instance's route handlers to the Express app, and register websockets if desired
const serv = postgraphile(preset).createServ(grafserv);
serv.addTo(app, server).catch((e) => {
  console.error(e);
  process.exit(1);
});

// Start the Express server
server.listen(process.env.EXPRESS_PORT);
const address = server.address();
if (typeof address !== 'string') {
  const href = `http://localhost:${address?.port}/graphql`;
  console.log(`PostGraphiQL available at ${href} 🚀`);
}