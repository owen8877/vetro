import "postgraphile";
import { PostGraphileAmberPreset } from "postgraphile/presets/amber";
import { makeV4Preset } from "postgraphile/presets/v4";
import { makePgService } from "postgraphile/adaptors/pg";

import { is_development } from "./util";

const preset: GraphileConfig.Preset = {
  extends: [
    PostGraphileAmberPreset,
    makeV4Preset({
      simpleCollections: "both",
      jwtPgTypeIdentifier: '"b"."jwt_token"',
      graphiql: false,
      watchPg: true,
      enhanceGraphiql: is_development,
      subscriptions: true,
      dynamicJson: true,
      setofFunctionsContainNulls: false,
      ignoreRBAC: false,
      allowExplain: is_development,
    }),
  ],
  gather: {
    pgStrictFunctions: true,
    installWatchFixtures: true,
  },
  schema: {
    retryOnInitFail: true,
    exportSchemaSDLPath: is_development ? `${process.cwd()}/src/schema.graphql` : undefined,
    // exportSchemaIntrospectionResultPath: is_development ? `${process.cwd()}/src/schema.json` : undefined,
    sortExport: is_development,
  },
  grafast: {
    explain: is_development,
  },
  grafserv: {
    graphqlPath: "/graphql",
    websockets: true,
  },
  pgServices: [
    makePgService({
      connectionString: process.env.DATABASE_URL,
      schemas: ["public"],
      pubsub: true,
    }),
  ],
};

export default preset;