import express from 'express';
import { PostGraphileOptions, postgraphile } from 'postgraphile';

import is_production from './util';

const app = express();
app.use(express.static('dist'));
if (!is_production()) {
  console.log('Enabling CORS!');
  const cors = require('cors');
  app.use(cors());
}


export const options: PostGraphileOptions = {
  // pluginHook,
  pgSettings(req) {
    // Adding this to ensure that all servers pass through the request in a
    // good enough way that we can extract headers.
    // CREATE FUNCTION current_user_id() RETURNS text AS $$ SELECT current_setting('graphile.test.x-user-id', TRUE); $$ LANGUAGE sql STABLE;
    return {
      'graphile.test.x-user-id':
        req.headers['x-user-id'] ||
        // `normalizedConnectionParams` comes from websocket connections, where
        // the headers often cannot be customized by the client.
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        (req as any).normalizedConnectionParams?.['x-user-id'],
    };
  },
  watchPg: true,
  graphiql: !is_production(),
  enhanceGraphiql: !is_production(),
  subscriptions: true,
  dynamicJson: true,
  setofFunctionsContainNulls: false,
  ignoreRBAC: false,
  showErrorStack: 'json',
  extendedErrors: ['hint', 'detail', 'errcode'],
  allowExplain: true,
  legacyRelations: 'omit',
  // exportGqlSchemaPath: `${__dirname}/../schema.graphql`,
  // sortExport: true,
};

const pg_middleware = postgraphile(process.env.DATABASE_URL, options);
app.use(pg_middleware);


const server = app.listen(process.env.EXPRESS_PORT, () => {
  const address = server.address();
  if (typeof address !== 'string') {
    const href = `http://localhost:${address?.port}${options.graphiqlRoute || '/graphiql'}`;
    console.log(`PostGraphiQL available at ${href} 🚀`);
  } else {
    console.log(`PostGraphile listening on ${address} 🚀`);
  }
});