/**
 * Controller for review process endpoints
 */
const HttpStatus = require('http-status-codes')
const service = require('../services/ReviewProcessService')
const helper = require('../common/helper')

/**
  * Search review processes
  * @param {Object} req the request
  * @param {Object} res the response
  */
async function searchReviewProcesses (req, res) {
  const result = await service.searchReviewProcesses(req.query)
  helper.setResHeaders(req, res, result)
  res.send(result)
}

/**
  * Create review process
  * @param {Object} req the request
  * @param {Object} res the response
  */
async function createReviewProcess (req, res) {
  const result = await service.createReviewProcess(req.authUser, req.body)
  res.status(HttpStatus.CREATED).send(result)
}

/**
  * Get review process
  * @param {Object} req the request
  * @param {Object} res the response
  */
async function getReviewProcess (req, res) {
  const result = await service.getReviewProcess(req.params.processId)
  res.send(result)
}

/**
  * Fully Update review process
  * @param {Object} req the request
  * @param {Object} res the response
  */
async function fullyUpdateReviewProcess (req, res) {
  const result = await service.fullyUpdateReviewProcess(req.authUser, req.params.processId, req.body)
  res.send(result)
}

/**
  * Partially update review process
  * @param {Object} req the request
  * @param {Object} res the response
  */
async function partiallyUpdateReviewProcess (req, res) {
  const result = await service.partiallyUpdateReviewProcess(req.authUser, req.params.processId, req.body)
  res.send(result)
}

/**
  * Delete review process
  * @param {Object} req the request
  * @param {Object} res the response
  */
async function deleteReviewProcess (req, res) {
  const result = await service.deleteReviewProcess(req.params.processId)
  res.send(result)
}

module.exports = {
  searchReviewProcesses,
  getReviewProcess,
  createReviewProcess,
  fullyUpdateReviewProcess,
  partiallyUpdateReviewProcess,
  deleteReviewProcess
}
