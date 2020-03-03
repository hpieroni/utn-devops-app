require('dotenv').config();

const requiredVariables = ['DB_CONNECTION_URI'];
const missingVariables = requiredVariables.filter(variable => !process.env[variable]);

if (missingVariables.length) {
  missingVariables.forEach(variable =>
    console.error(`[Config]: ${variable} environment variable is required but was not specified`)
  );
  process.exit(1);
}

const { PORT = 3000, DB_CONNECTION_URI } = process.env;

module.exports = {
  port: PORT,
  dbConnectionUri: DB_CONNECTION_URI
};
