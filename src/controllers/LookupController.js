/**
 * Controller for lookup endpoints
 */
const service = require('../services/LookupService')
const helper = require('../common/helper')

/**
 * Get process event types
 * @param {Object} req the request
 * @param {Object} res the response
 */
async function getProcessEventTypes (req, res) {
  const result = await service.getProcessEventTypes()
  res.send(result)
}

/**
 * Get review steps
 * @param {Object} req the request
 * @param {Object} res the response
 */
async function getReviewSteps (req, res) {
  const result = await service.getReviewSteps(req.query)
  helper.setResHeaders(req, res, result)
  res.send(result)
}

module.exports = {
  getProcessEventTypes,
  getReviewSteps
}
