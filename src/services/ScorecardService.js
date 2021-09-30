/**
 * This service provides operations of scorecards.
 */

const _ = require('lodash')
const Joi = require('joi')
const uuid = require('uuid/v4')
const helper = require('../common/helper')
const errors = require('../common/errors')
const { ScorecardFields, ScorecardInternalFields, ScorecardStatus, MAX_WEIGHT, SUM_OF_WEIGHTS } = require('../../app-constants')
const { Scorecard } = require('../models')

/**
 * Validate scorecard weights. Sum of weights should be equal to constants.SUM_OF_WEIGHTS.
 * @param {Object} scorecad the scorecard
 * @returns undefined
 */
function validateScorecardWeights (scorecad) {
  const foundErrors = []
  let totalGroupWeight = 0
  _.forEach(scorecad.groups, (group, groupIndex) => {
    totalGroupWeight += group.weight
    let totalSectionWeight = 0
    _.forEach(group.sections, (section, sectionIndex) => {
      totalSectionWeight += section.weight
      let totalQuestionWeight = 0
      _.forEach(section.questions, (question) => {
        totalQuestionWeight += question.weight
      })
      if (totalQuestionWeight !== SUM_OF_WEIGHTS) {
        foundErrors.push(`groups[${groupIndex}].sections[${sectionIndex}].questions`)
      }
    })
    if (totalSectionWeight !== SUM_OF_WEIGHTS) {
      foundErrors.push(`groups[${groupIndex}].sections`)
    }
  })
  if (totalGroupWeight !== SUM_OF_WEIGHTS) {
    foundErrors.push('groups')
  }
  if (foundErrors.length) {
    throw new errors.BadRequestError(`Following objects total weight must be ${SUM_OF_WEIGHTS}\n${_.join(foundErrors, '\n')}`)
  }
}

/**
 * Validate if scorecard with the same track and title not exists.
 * @param {Object} scorecad the scorecard
 * @returns undefined
 */
async function ensureScorecardNotDuplicated (scorecard) {
  let options = {
    titleToLower: { eq: _.toLower(scorecard.title) },
    track: { eq: scorecard.track }
  }
  const found = await helper.scanAll(Scorecard, options)
  if (found.count) {
    throw new errors.BadRequestError(`There is already a scorecard with title: "${scorecard.title}" and track: "${scorecard.track}"`)
  }
}

/**
 * Search scorecards.
 * @param {Object} criteria the search criteria
 * @returns {Array<Object>} the search result
 */
async function searchScorecards (criteria) {
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
  let records = await helper.scanAll(Scorecard, options)
  const total = records.length
  if (!criteria.sortBy) {
    criteria.sortBy = 'id'
  }
  // sort records
  records = _.orderBy(records, [criteria.sortBy], [criteria.sortOrder])
  let result = _.slice(records, (page - 1) * perPage, page * perPage)
  // pick desired fields from the result
  result = helper.cleanResult(result, ScorecardFields)
  return { total, page, perPage, result }
}

searchScorecards.schema = {
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
 * Get scorecard entity by id.
 * @param {String} id the scorecard id
 * @returns {Object} the scorecard of given id
 */
async function getScorecard (id) {
  // get and validate if scorecard with the given id exists
  const scorecard = await helper.getById(Scorecard, 'Scorecard', id)
  // remove internal fields from the result
  return helper.cleanResult(scorecard, [], ScorecardInternalFields)
}

getScorecard.schema = {
  id: Joi.id()
}

/**
 * Create scorecard.
 * @param {Object} authUser the current authenticated user
 * @param {Object} scorecard the data to create scorecard
 * @returns {Object} the created scorecard
 */
async function createScorecard (authUser, scorecard) {
  // make sure weights of each item in a grouping will add up to a total of SUM_OF_WEIGHTS.
  validateScorecardWeights(scorecard)
  // prevent duplicated record by title and track
  await ensureScorecardNotDuplicated(scorecard)

  scorecard.id = uuid()
  // set lower title to use in search api.
  scorecard.titleToLower = _.toLower(scorecard.title)
  scorecard.createdBy = authUser.handle || authUser.sub
  // createdAt is managed by dynamoose
  const created = await helper.create(Scorecard, scorecard)
  // exclude internal fields from result
  return helper.cleanResult(created, [], ScorecardInternalFields)
}

createScorecard.schema = {
  authUser: Joi.object().required(),
  scorecard: Joi.object().keys({
    description: Joi.stringAllowEmpty().trim(),
    title: Joi.string().trim().required(),
    track: Joi.string().trim().required(),
    type: Joi.stringAllowEmpty().trim(),
    status: Joi.string().trim().valid(_.values(ScorecardStatus)).required(),
    groups: Joi.array().items(
      Joi.object().keys({
        name: Joi.string().trim().required(),
        weight: Joi.number().integer().positive().max(MAX_WEIGHT).required(),
        sections: Joi.array().items(
          Joi.object().keys({
            name: Joi.string().trim().required(),
            weight: Joi.number().integer().positive().max(MAX_WEIGHT).required(),
            questions: Joi.array().items(
              Joi.object().keys({
                questionText: Joi.string().trim().required(),
                questionGuidelines: Joi.string().trim().required(),
                questionType: Joi.string().trim().required(),
                weight: Joi.number().integer().positive().max(MAX_WEIGHT).required(),
                isUpload: Joi.boolean().required()
              })
            ).required()
          })
        ).required()
      })
    ).required()
  }).required()
}

/**
 * Partially update scorecard.
 * @param {Object} authUser the current authenticated user
 * @param {String} id the scorecard id
 * @param {Object} data the data to update scorecard
 * @returns {Object} the updated scorecard
 */
async function partiallyUpdateScorecard (authUser, id, data) {
  // get and validate if scorecard with the given id exists
  const scorecard = await helper.getById(Scorecard, 'Scorecard', id)
  // if groups field is provided, make sure weights of each item in a grouping will add up to a total of SUM_OF_WEIGHTS.
  if (data.groups) {
    validateScorecardWeights(data)
  }
  // if title or track is changed, prevent duplicated record by title and track
  if ((data.title && _.toLower(scorecard.title) !== _.toLower(data.title)) ||
    (data.track && scorecard.track !== data.track)) {
    await ensureScorecardNotDuplicated({
      title: _.defaultTo(data.title, scorecard.title),
      track: _.defaultTo(data.track, scorecard.track)
    })
  }
  // set lower title to use in search api.
  if (data.title) {
    data.titleToLower = _.toLower(data.title)
  }
  data.updatedBy = authUser.handle || authUser.sub
  // updatedAt is managed by dynamoose
  const updated = await helper.update(scorecard, data)
  // exclude internal fields from result
  return helper.cleanResult(updated, [], ScorecardInternalFields)
}

partiallyUpdateScorecard.schema = {
  authUser: Joi.object().required(),
  id: Joi.id(),
  data: Joi.object().keys({
    description: Joi.stringAllowEmpty().trim().allow(null),
    title: Joi.string().trim(),
    track: Joi.string().trim(),
    type: Joi.stringAllowEmpty().trim().allow(null),
    status: Joi.string().trim().valid(_.values(ScorecardStatus)),
    groups: Joi.array().items(
      Joi.object().keys({
        name: Joi.string().trim().required(),
        weight: Joi.number().integer().positive().max(MAX_WEIGHT).required(),
        sections: Joi.array().items(
          Joi.object().keys({
            name: Joi.string().trim().required(),
            weight: Joi.number().integer().positive().max(MAX_WEIGHT).required(),
            questions: Joi.array().items(
              Joi.object().keys({
                questionText: Joi.string().trim().required(),
                questionGuidelines: Joi.string().trim().required(),
                questionType: Joi.string().trim().required(),
                weight: Joi.number().integer().positive().max(MAX_WEIGHT).required(),
                isUpload: Joi.boolean().required()
              })
            ).required()
          })
        ).required()
      })
    )
  }).required()
}

/**
 * Fully Update scorecard.
 * @param {Object} authUser the current authenticated user
 * @param {String} id the scorecard id
 * @param {Object} data the data to update scorecard
 * @returns {Object} the updated scorecard
 */
async function fullyUpdateScorecard (authUser, id, data) {
  return partiallyUpdateScorecard(authUser, id, data)
}

fullyUpdateScorecard.schema = {
  authUser: Joi.object().required(),
  id: Joi.id(),
  data: Joi.object().keys({
    description: Joi.stringAllowEmpty().trim().allow(null).default(null),
    title: Joi.string().trim().required(),
    track: Joi.string().trim().required(),
    type: Joi.stringAllowEmpty().trim().allow(null).default(null),
    status: Joi.string().trim().valid(_.values(ScorecardStatus)).required(),
    groups: Joi.array().items(
      Joi.object().keys({
        name: Joi.string().trim().required(),
        weight: Joi.number().integer().positive().max(MAX_WEIGHT).required(),
        sections: Joi.array().items(
          Joi.object().keys({
            name: Joi.string().trim().required(),
            weight: Joi.number().integer().positive().max(MAX_WEIGHT).required(),
            questions: Joi.array().items(
              Joi.object().keys({
                questionText: Joi.string().trim().required(),
                questionGuidelines: Joi.string().trim().required(),
                questionType: Joi.string().trim().required(),
                weight: Joi.number().integer().positive().max(MAX_WEIGHT).required(),
                isUpload: Joi.boolean().required()
              })
            ).required()
          })
        ).required()
      })
    ).required()
  }).required()
}

/**
 * Delete scorecard.
 * @param {String} id the scorecard id to delete
 * @returns {Object} the deleted scorecard
 */
async function deleteScorecard (id) {
  // get and validate if scorecard with the given id exists
  const scorecard = await helper.getById(Scorecard, 'Scorecard', id)
  await helper.remove(scorecard)
  // exclude internal fields from result
  return helper.cleanResult(scorecard, [], ScorecardInternalFields)
}

deleteScorecard.schema = {
  id: Joi.id()
}

module.exports = {
  searchScorecards,
  getScorecard,
  createScorecard,
  partiallyUpdateScorecard,
  fullyUpdateScorecard,
  deleteScorecard
}
