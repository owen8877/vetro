import { PostGraphileOptions } from 'postgraphile';

import is_production from './util';

const options: PostGraphileOptions = {
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
};

if (!is_production()) {
  options.exportGqlSchemaPath = `${__dirname}/../schema.graphql`;
  options.sortExport = true;
}

export default options;