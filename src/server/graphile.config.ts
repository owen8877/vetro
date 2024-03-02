// Only needed for TypeScript types support
import "postgraphile";

// The standard base preset to use, includes the main PostGraphile features
import { PostGraphileAmberPreset } from "postgraphile/presets/amber";

// More presets you might want to mix in
import { makeV4Preset } from "postgraphile/presets/v4";
// import { PgRelayPreset } from "postgraphile/presets/relay";

// Use the 'pg' module to connect to the database
import { makePgService } from "postgraphile/adaptors/pg";

// In case we want to customize the Ruru we render:
import { defaultHTMLParts } from "postgraphile/grafserv/ruru/server";

// A plugin for the system to use for persisted operations support
// import PersistedPlugin from "@grafserv/persisted";

import { is_production, is_development } from "./util";

const preset: GraphileConfig.Preset = {
  extends: [
    PostGraphileAmberPreset,
    /* Add more presets here, e.g.: */
    makeV4Preset({
      simpleCollections: "both",
      jwtPgTypeIdentifier: '"b"."jwt_token"',
      // dynamicJson: true,
      // graphiql: true,
      graphiqlRoute: "/",

      watchPg: true,
      graphiql: is_development,
      enhanceGraphiql: is_development,
      subscriptions: true,
      dynamicJson: true,
      setofFunctionsContainNulls: false,
      ignoreRBAC: false,
      // showErrorStack: 'json',
      // extendedErrors: ['hint', 'detail', 'errcode'],
      allowExplain: true,
      // legacyRelations: 'omit',
    }),
    // PgRelayPreset,
  ],

  plugins: [
    /* Add plugins here, e.g.: */
    // PersistedPlugin,
  ],

  inflection: {
    /* options for the inflection system */
  },
  gather: {
    /* options for the gather phase, e.g.: */
    pgStrictFunctions: true,
    installWatchFixtures: true,
  },
  schema: {
    /* options for the schema build phase, e.g.: */
    retryOnInitFail: true,
    exportSchemaSDLPath: is_development ? `${process.cwd()}/src/schema.graphql` : undefined,
    exportSchemaIntrospectionResultPath: is_development ? `${process.cwd()}/src/schema.json` : undefined,
    sortExport: is_development,
  },
  grafast: {
    /* options for Grafast, including setting GraphQL context, e.g.: */
    // context: {
    //   meaningOfLife: 42,
    // },
    explain: is_development, // DO NOT ENABLE IN PRODUCTION!
  },
  grafserv: {
    /* options for Grafserv, e.g.: */
    port: 5678,
    graphqlPath: "/graphql",
    websockets: true,
    graphqlOverGET: true,
    // persistedOperationsDirectory: `${process.cwd()}/.persisted_operations`,
    // allowUnpersistedOperation: true,
  },
  ruru: {
    /* options for customizing Ruru, e.g.: */
    htmlParts: {
      // metaTags: defaultHTMLParts.metaTags + "<!-- HELLO WORLD! -->",
    },
  },
  pgServices: [
    /* list of PG database configurations, e.g.: */
    makePgService({
      // Database connection string, read from an environmental variable:
      connectionString: process.env.DATABASE_URL,

      // List of database schemas to expose:
      schemas: ["public"],

      // Enable LISTEN/NOTIFY:
      pubsub: true,
    }),
  ],
};

export default preset;