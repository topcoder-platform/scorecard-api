/**
 * Controller for health check endpoint
 */
const config = require('config')
const { ProcessEventType } = require('../models')
const errors = require('../common/errors')

let checksRun = 0

/**
 * Check health of the app
 * @param {Object} req the request
 * @param {Object} res the response
 */
async function checkHealth (req, res) {
  // perform a quick database access operation, if there is no error and is quick, then consider it healthy.
  checksRun += 1
  const timestampMS = new Date().getTime()
  try {
    await ProcessEventType.scan().limit(1)
  } catch (e) {
    throw new errors.ServiceUnavailableError(`There is database operation error, ${e.message}`)
  }
  if (new Date().getTime() - timestampMS > Number(config.HEALTH_CHECK_TIMEOUT)) {
    throw new errors.ServiceUnavailableError('Database operation is slow.')
  }
  // there is no error, and it is quick, then return checks run count
  res.send({ checksRun })
}

module.exports = {
  checkHealth
}
