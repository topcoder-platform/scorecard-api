/**
 * This service provides operations of lookups.
 */

const _ = require('lodash')
const Joi = require('joi')
const helper = require('../common/helper')
const { ProcessEventType, ReviewStep } = require('../models')

/**
 * List process event types.
 * @returns {Array} the search result
 */
async function getProcessEventTypes () {
  const records = await helper.scanAll(ProcessEventType)
  return records
}

/**
 * List process event types.
 * @param {Object} criteria the search criteria
 * @returns {Array} the search result
 */
async function getReviewSteps (criteria) {
  const page = criteria.page
  const perPage = criteria.perPage
  let options = {}
  // apply name filter
  if (criteria.name) {
    options.name = { contains: criteria.name }
  }
  let records = await helper.scanAll(ReviewStep, options)
  const total = records.length

  let result = _.slice(records, (page - 1) * perPage, page * perPage)
  return { total, page, perPage, result }
}

getReviewSteps.schema = {
  criteria: Joi.object().keys({
    page: Joi.page(),
    perPage: Joi.perPage(),
    name: Joi.string()
  })
}

module.exports = {
  getProcessEventTypes,
  getReviewSteps
}
