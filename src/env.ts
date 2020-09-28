interface EnvironmentVariables {
  expiration: number;
  secret: string;
  port: number;
  resetDb: boolean;
  origin: string;
  apollo: {
    introspectionEnabled: boolean;
    playgroundEnabled: boolean;
    reportSchema: boolean;
  };
}

const environment: EnvironmentVariables = {
  expiration: process.env.JWT_EXPIRATION_MS
    ? parseInt(process.env.JWT_EXPIRATION_MS)
    : 24 * 60 * 60 * 1000,
  secret: process.env.JWT_SECRET || '70p53cr37',
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  port: process.env.PORT ? parseInt(process.env.PORT) : 4000,
  resetDb: process.env.RESET_DB ? process.env.RESET_DB === 'true' : false,
  apollo: {
    introspectionEnabled: process.env.APOLLO_INTROSPECTION_ENABLED
      ? process.env.APOLLO_INTROSPECTION_ENABLED === 'true'
      : false,
    playgroundEnabled: process.env.APOLLO_PLAYGROUND_ENABLED
      ? process.env.APOLLO_PLAYGROUND_ENABLED === 'true'
      : false,
    reportSchema: process.env.APOLLO_REPORT_SCHEMA
      ? process.env.APOLLO_REPORT_SCHEMA === 'true'
      : false,
  },
};

export default environment;

// TODO Need to be refactored
// export const fakedDb = process.env.FAKED_DB
//   ? parseInt(process.env.FAKED_DB, 10)
//   : 0;
