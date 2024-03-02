import { createServer } from "node:http";
import express from 'express';
import postgraphile from 'postgraphile';
import { grafserv } from "postgraphile/grafserv/express/v4";
import path from 'path';

import { is_development } from './util';
import preset from "./graphile.config";

const app = express();

if (is_development) {
  console.log('Enabling CORS!');
  const cors = require('cors');
  app.use(cors());
}

// Handle React.js compiled files
const buildPath = path.normalize(path.join(__dirname, '../../dist'));
app.use(express.static(buildPath));
app.use((req, res, next) => {
  if (req.path.startsWith('/graphql')) {
    next()
  } else {
    res.sendFile(path.join(buildPath, 'index.html'));
  }
});

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