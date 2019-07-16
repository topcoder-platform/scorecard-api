/**
 * The configuration file.
 */

module.exports = {
  LOG_LEVEL: process.env.LOG_LEVEL || 'debug',
  PORT: process.env.PORT || 3000,
  API_VERSION: process.env.API_VERSION || '/v5',
  AUTH_SECRET: process.env.AUTH_SECRET || 'mysecret',
  VALID_ISSUERS: process.env.VALID_ISSUERS
    ? process.env.VALID_ISSUERS.replace(/\\"/g, '')
    : '["https://api.topcoder-dev.com", "https://api.topcoder.com","https://topcoder-dev.auth0.com/"]',

  AMAZON: {
    AWS_REGION: process.env.AWS_REGION || 'us-east-1',
    DYNAMODB_READ_CAPACITY_UNITS: process.env.DYNAMODB_READ_CAPACITY_UNITS
      ? Number(process.env.DYNAMODB_READ_CAPACITY_UNITS)
      : 10,
    DYNAMODB_WRITE_CAPACITY_UNITS: process.env.DYNAMODB_WRITE_CAPACITY_UNITS
      ? Number(process.env.DYNAMODB_WRITE_CAPACITY_UNITS)
      : 5,

    // table name is model name
    DYNAMODB_SCORE_SYSTEM_TABLE: process.env.DYNAMODB_SCORE_SYSTEM_TABLE || 'score_systems',
    DYNAMODB_SCORECARD_TABLE: process.env.DYNAMODB_SCORECARD_TABLE || 'scorecards'
  }
};
