/**
 * Controller for scorecard endpoints
 */
const HttpStatus = require('http-status-codes')
const service = require('../services/ScorecardService')
const helper = require('../common/helper')

/**
 * Search scorecards
 * @param {Object} req the request
 * @param {Object} res the response
 */
async function searchScorecards (req, res) {
  const result = await service.searchScorecards(req.query)
  helper.setResHeaders(req, res, result)
  res.send(result)
}

/**
 * Create scorecard
 * @param {Object} req the request
 * @param {Object} res the response
 */
async function createScorecard (req, res) {
  const result = await service.createScorecard(req.authUser, req.body)
  res.status(HttpStatus.CREATED).send(result)
}

/**
 * Get scorecard
 * @param {Object} req the request
 * @param {Object} res the response
 */
async function getScorecard (req, res) {
  const result = await service.getScorecard(req.params.scorecardId)
  res.send(result)
}

/**
 * Fully Update scorecard
 * @param {Object} req the request
 * @param {Object} res the response
 */
async function fullyUpdateScorecard (req, res) {
  const result = await service.fullyUpdateScorecard(req.authUser, req.params.scorecardId, req.body)
  res.send(result)
}

/**
 * Partially update scorecard
 * @param {Object} req the request
 * @param {Object} res the response
 */
async function partiallyUpdateScorecard (req, res) {
  const result = await service.partiallyUpdateScorecard(req.authUser, req.params.scorecardId, req.body)
  res.send(result)
}

/**
 * Delete scorecard
 * @param {Object} req the request
 * @param {Object} res the response
 */
async function deleteScorecard (req, res) {
  const result = await service.deleteScorecard(req.params.scorecardId)
  res.send(result)
}

module.exports = {
  searchScorecards,
  getScorecard,
  createScorecard,
  fullyUpdateScorecard,
  partiallyUpdateScorecard,
  deleteScorecard
}
