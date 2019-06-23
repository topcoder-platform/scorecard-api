/**
 * Controller for scorecard endpoints
 */
const HttpStatus = require('http-status-codes')
const service = require('../services/ScorecardService')

/**
 * List scorecards
 * @param {Object} req the request
 * @param {Object} res the response
 */
async function list (req, res) {
  const result = await service.list(req.query)
  res.send(result)
}

/**
 * List scorecards head
 * @param {Object} req the request
 * @param {Object} res the response
 */
async function listHead (req, res) {
  await service.list(req.query)
  res.end()
}

/**
 * Create scorecard
 * @param {Object} req the request
 * @param {Object} res the response
 */
async function create (req, res) {
  const result = await service.create(req.authUser, req.body)
  res.status(HttpStatus.CREATED).send(result)
}

/**
 * Get scorecard
 * @param {Object} req the request
 * @param {Object} res the response
 */
async function getEntity (req, res) {
  const result = await service.getEntity(req.params.id)
  res.send(result)
}

/**
 * Get scorecard head
 * @param {Object} req the request
 * @param {Object} res the response
 */
async function getEntityHead (req, res) {
  await service.getEntity(req.params.id)
  res.end()
}

/**
 * Update scorecard
 * @param {Object} req the request
 * @param {Object} res the response
 */
async function update (req, res) {
  const result = await service.update(req.authUser, req.params.id, req.body)
  res.send(result)
}

/**
 * Partially update scorecard
 * @param {Object} req the request
 * @param {Object} res the response
 */
async function partiallyUpdate (req, res) {
  const result = await service.partiallyUpdate(req.authUser, req.params.id, req.body)
  res.send(result)
}

/**
 * Remove scorecard
 * @param {Object} req the request
 * @param {Object} res the response
 */
async function remove (req, res) {
  await service.remove(req.params.id)
  res.status(HttpStatus.NO_CONTENT).end()
}

module.exports = {
  list,
  listHead,
  getEntity,
  getEntityHead,
  create,
  update,
  partiallyUpdate,
  remove
}
