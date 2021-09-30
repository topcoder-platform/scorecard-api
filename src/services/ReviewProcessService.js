/**
 * This service provides operations of review processes.
 */

const _ = require('lodash')
const Joi = require('joi')
const uuid = require('uuid/v4')
const helper = require('../common/helper')
const errors = require('../common/errors')
const { ReviewProcessFields, ReviewProcessInternalFields, ReviewProcessStatus, MAX_WEIGHT, SUM_OF_WEIGHTS } = require('../../app-constants')
const { ReviewProcess, ProcessEventType, ReviewStep } = require('../models')

/**
 * Validate review process weights. Sum of weights should be equal to constants.SUM_OF_WEIGHTS.
 * @param {Object} reviewProcess the reviewProcess
 * @returns undefined
 */
function validateReviewProcessWeights (reviewProcess) {
  const foundErrors = []
  _.forEach(reviewProcess.events, (event, eventIndex) => {
    let totalEventWeight = 0
    _.forEach(event.steps, (step) => {
      totalEventWeight += step.weight
    })
    if (totalEventWeight !== SUM_OF_WEIGHTS) {
      foundErrors.push(`events[${eventIndex}].steps`)
    }
  })
  if (foundErrors.length) {
    throw new errors.BadRequestError(`Following objects total weight must be ${SUM_OF_WEIGHTS}\n${_.join(foundErrors, '\n')}`)
  }
}

/**
 * Validate if review process with the same track and title not exists.
 * @param {Object} reviewProcess the reviewProcess
 * @returns undefined
 */
async function ensureReviewProcessNotDuplicated (reviewProcess) {
  let options = {
    titleToLower: { eq: _.toLower(reviewProcess.title) },
    track: { eq: reviewProcess.track }
  }
  const found = await helper.scanAll(ReviewProcess, options)
  if (found.count) {
    throw new errors.BadRequestError(`There is already a review process with title: "${reviewProcess.title}" and track: "${reviewProcess.track}"`)
  }
}

/**
 * Validate review process events and steps does exist
 * @param {Object} reviewProcess the reviewProcess
 * @returns undefined
 */
async function validateReviewProcessEvents (reviewProcess) {
  for (const event of reviewProcess.events) {
    await helper.getById(ProcessEventType, 'ProcessEventType', event.eventType)
    for (const step of event.steps) {
      await helper.getById(ReviewStep, 'ReviewStep', step.stepType)
    }
  }
}

/**
 * Search review processes.
 * @param {Object} criteria the search criteria
 * @returns {Array<Object>} the search result
 */
async function searchReviewProcesses (criteria) {
  const page = criteria.page
  const perPage = criteria.perPage
  let options = {}
  // apply title filter
  if (criteria.title) {
    options.titleToLower = { contains: _.toLower(criteria.title) }
  }

  // `criteria.track` could be array of track names, or comma separated string of track names
  // in case it's comma separated string of track names we have to convert it to an array of track names
  if ((typeof criteria.track) === 'string') {
    criteria.track = criteria.track.trim().split(',').map(trackRaw => _.trim(trackRaw))
    criteria.track = _.compact(criteria.track)
  }
  // apply track filter
  if (criteria.track) {
    options.track = { in: criteria.track }
  }
  let records = await helper.scanAll(ReviewProcess, options)
  const total = records.length
  if (!criteria.sortBy) {
    criteria.sortBy = 'id'
  }
  // sort records
  records = _.orderBy(records, [criteria.sortBy], [criteria.sortOrder])
  let result = _.slice(records, (page - 1) * perPage, page * perPage)
  // pick desired fields from the result
  result = helper.cleanResult(result, ReviewProcessFields)
  return { total, page, perPage, result }
}

searchReviewProcesses.schema = {
  criteria: Joi.object().keys({
    page: Joi.page(),
    perPage: Joi.perPage(),
    title: Joi.string(),
    track: Joi.alternatives(
      Joi.string(),
      Joi.array().items(Joi.string())
    ),
    sortBy: Joi.string().valid(['title', 'createdAt', 'createdBy', 'track', 'type', 'status']),
    sortOrder: Joi.string().valid(['asc', 'desc']).default('asc')
  })
}

/**
 * Get review process entity by id.
 * @param {String} id the review process id
 * @returns {Object} the review process of given id
 */
async function getReviewProcess (id) {
  // get and validate if review process with the given id exists
  const reviewProcess = await helper.getById(ReviewProcess, 'ReviewProcess', id)
  // remove internal fields from the result
  return helper.cleanResult(reviewProcess, [], ReviewProcessInternalFields)
}

getReviewProcess.schema = {
  id: Joi.id()
}

/**
 * Create review process.
 * @param {Object} authUser the current authenticated user
 * @param {Object} reviewProcess the data to create review process
 * @returns {Object} the created review process
 */
async function createReviewProcess (authUser, reviewProcess) {
  // make sure weights of each item in a grouping will add up to a total of SUM_OF_WEIGHTS.
  validateReviewProcessWeights(reviewProcess)
  // prevent duplicated record by title and track
  await ensureReviewProcessNotDuplicated(reviewProcess)
  // make sure given event types and step types exist
  await validateReviewProcessEvents(reviewProcess)

  reviewProcess.id = uuid()
  // set lower title to use in search api.
  reviewProcess.titleToLower = _.toLower(reviewProcess.title)
  reviewProcess.createdBy = authUser.handle || authUser.sub
  // createdAt is managed by dynamoose
  const created = await helper.create(ReviewProcess, reviewProcess)
  // exclude internal fields from result
  return helper.cleanResult(created, [], ReviewProcessInternalFields)
}

createReviewProcess.schema = {
  authUser: Joi.object().required(),
  reviewProcess: Joi.object().keys({
    description: Joi.stringAllowEmpty().trim(),
    title: Joi.string().trim().required(),
    track: Joi.string().trim().required(),
    type: Joi.stringAllowEmpty().trim(),
    status: Joi.string().trim().valid(_.values(ReviewProcessStatus)).required(),
    events: Joi.array().items(
      Joi.object().keys({
        eventType: Joi.id(),
        steps: Joi.array().items(
          Joi.object().keys({
            stepType: Joi.id(),
            weight: Joi.number().integer().positive().max(MAX_WEIGHT).required()
          })
        ).required()
      })
    ).required()
  }).required()
}

/**
 * Partially update review process.
 * @param {Object} authUser the current authenticated user
 * @param {String} id the review process id
 * @param {Object} data the data to update review process
 * @returns {Object} the updated review process
 */
async function partiallyUpdateReviewProcess (authUser, id, data) {
  // get and validate if review process with the given id exists
  const reviewProcess = await helper.getById(ReviewProcess, 'ReviewProcess', id)
  // if events field is provided, make sure weights of each item in a grouping will add up to a total of SUM_OF_WEIGHTS.
  // Make sure given event types and step types exist.
  if (data.events) {
    validateReviewProcessWeights(data)
    await validateReviewProcessEvents(data)
  }

  // if title or track is changed, prevent duplicated record by title and track
  if ((data.title && _.toLower(reviewProcess.title) !== _.toLower(data.title)) ||
    (data.track && reviewProcess.track !== data.track)) {
    await ensureReviewProcessNotDuplicated({
      title: _.defaultTo(data.title, reviewProcess.title),
      track: _.defaultTo(data.track, reviewProcess.track)
    })
  }
  // set lower title to use in search api.
  if (data.title) {
    data.titleToLower = _.toLower(data.title)
  }
  data.updatedBy = authUser.handle || authUser.sub
  // updatedAt is managed by dynamoose
  const updated = await helper.update(reviewProcess, data)
  // exclude internal fields from result
  return helper.cleanResult(updated, [], ReviewProcessInternalFields)
}

partiallyUpdateReviewProcess.schema = {
  authUser: Joi.object().required(),
  id: Joi.id(),
  data: Joi.object().keys({
    description: Joi.stringAllowEmpty().trim().allow(null),
    title: Joi.string().trim(),
    track: Joi.string().trim(),
    type: Joi.stringAllowEmpty().trim().allow(null),
    status: Joi.string().trim().valid(_.values(ReviewProcessStatus)),
    events: Joi.array().items(
      Joi.object().keys({
        eventType: Joi.id(),
        steps: Joi.array().items(
          Joi.object().keys({
            stepType: Joi.id(),
            weight: Joi.number().integer().positive().max(MAX_WEIGHT).required()
          })
        ).required()
      })
    )
  }).required()
}

/**
 * Fully Update review process.
 * @param {Object} authUser the current authenticated user
 * @param {String} id the review process id
 * @param {Object} data the data to update review process
 * @returns {Object} the updated review process
 */
async function fullyUpdateReviewProcess (authUser, id, data) {
  return partiallyUpdateReviewProcess(authUser, id, data)
}

fullyUpdateReviewProcess.schema = {
  authUser: Joi.object().required(),
  id: Joi.id(),
  data: Joi.object().keys({
    description: Joi.stringAllowEmpty().trim().allow(null).default(null),
    title: Joi.string().trim().required(),
    track: Joi.string().trim().required(),
    type: Joi.stringAllowEmpty().trim().allow(null).default(null),
    status: Joi.string().trim().valid(_.values(ReviewProcessStatus)).required(),
    events: Joi.array().items(
      Joi.object().keys({
        eventType: Joi.id(),
        steps: Joi.array().items(
          Joi.object().keys({
            stepType: Joi.id(),
            weight: Joi.number().integer().positive().max(MAX_WEIGHT).required()
          })
        ).required()
      })
    ).required()
  }).required()
}

/**
 * Delete review process.
 * @param {String} id the review process id to delete
 * @returns {Object} the deleted review process
 */
async function deleteReviewProcess (id) {
  // get and validate if review process with the given id exists
  const reviewProcess = await helper.getById(ReviewProcess, 'ReviewProcess', id)
  await helper.remove(reviewProcess)
  // exclude internal fields from result
  return helper.cleanResult(reviewProcess, [], ReviewProcessInternalFields)
}

deleteReviewProcess.schema = {
  id: Joi.id()
}

module.exports = {
  searchReviewProcesses,
  getReviewProcess,
  createReviewProcess,
  partiallyUpdateReviewProcess,
  fullyUpdateReviewProcess,
  deleteReviewProcess
}
