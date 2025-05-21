// ./config/config.ts
const environment =
  (process.env.NODE_ENV as "development" | "test" | "production") ||
  "development";

const config = {
  development: {
    db: "mongodb://localhost/glasscube",
    logLevel: "debug",
    morgan:'dev',
    origin:'http://localhost:5173'
  },
  test: {
    db: "mongodb://localhost/test_db",
    logLevel: "warn",
    morgan:'combined',
    origin:'http://localhost:5173'
  },
  production: {
    db: process.env.DB,
    logLevel: "error",
    morgan:'tiny',
    origin:'https://glasscube.io'
  },
};

export default config[environment];
