/**
 * The configuration file.
 */

module.exports = {
  LOG_LEVEL: process.env.LOG_LEVEL || 'debug',
  DISABLE_LOGGING: process.env.DISABLE_LOGGING ? process.env.DISABLE_LOGGING === 'true' : false,
  PORT: process.env.PORT || 3000,
  // used to properly set the header response to api calls for services behind a load balancer
  API_BASE_URL: process.env.API_BASE_URL || `http://localhost:3000`,
  API_VERSION: process.env.API_VERSION || '/v5',
  AUTH_SECRET: process.env.AUTH_SECRET || 'secret',
  VALID_ISSUERS: process.env.VALID_ISSUERS
    ? process.env.VALID_ISSUERS.replace(/\\"/g, '')
    : '["https://api.topcoder.com","https://api.topcoder-dev.com","https://topcoder-dev.auth0.com/"]',

  AMAZON: {
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_REGION: process.env.AWS_REGION || 'us-east-1',
    IS_LOCAL_DB: process.env.IS_LOCAL_DB ? process.env.IS_LOCAL_DB === 'true' : false,
    DYNAMODB_URL: process.env.DYNAMODB_URL || 'http://localhost:8000',
    DYNAMODB_READ_CAPACITY_UNITS: process.env.DYNAMODB_READ_CAPACITY_UNITS
      ? Number(process.env.DYNAMODB_READ_CAPACITY_UNITS)
      : 10,
    DYNAMODB_WRITE_CAPACITY_UNITS: process.env.DYNAMODB_WRITE_CAPACITY_UNITS
      ? Number(process.env.DYNAMODB_WRITE_CAPACITY_UNITS)
      : 5
  },

  HEALTH_CHECK_TIMEOUT: process.env.HEALTH_CHECK_TIMEOUT || 3000,

  M2M_AUDIT_HANDLE: process.env.M2M_AUDIT_HANDLE || 'tcwebservice'
}
