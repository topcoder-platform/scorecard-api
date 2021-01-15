/**
 * This service provides operations of score systems.
 */

const _ = require('lodash')
const Joi = require('joi')
const config = require('config')
const uuid = require('uuid/v4')
const helper = require('../common/helper')
const logger = require('../common/logger')

/**
 * List score systems.
 * @param {Object} criteria the search criteria
 * @returns {Array} the search result
 */
async function list (criteria) {
  const records = await helper.scan(config.AMAZON.DYNAMODB_SCORE_SYSTEM_TABLE)
  return _.filter(records, (record) => {
    if (criteria.name && !helper.matchString(record.name, criteria.name)) {
      return false
    }
    if (criteria.phase && !helper.matchString(record.phase, criteria.phase)) {
      return false
    }
    if (criteria.topic && !helper.matchString(record.topic, criteria.topic)) {
      return false
    }
    if (!_.isNil(criteria.isActive) && record.isActive !== criteria.isActive) {
      return false
    }
    return true
  })
}

list.schema = {
  criteria: Joi.object().keys({
    page: Joi.any(), // ignored
    perPage: Joi.any(), // ignored
    name: Joi.string(),
    phase: Joi.string(),
    topic: Joi.string(),
    isActive: Joi.boolean()
  })
}

/**
 * Get score system entity by id.
 * @param {String} id the score system id
 * @returns {Object} the score system of given id
 */
async function getEntity (id) {
  return helper.getById(config.AMAZON.DYNAMODB_SCORE_SYSTEM_TABLE, id)
}

getEntity.schema = {
  id: Joi.id()
}

/**
 * Create score system.
 * @param {Object} authUser the current authenticated user
 * @param {Object} data the data to create score system
 * @returns {Object} the created score system
 */
async function create (authUser, data) {
  data.id = uuid()
  data.createdBy = authUser.handle || authUser.sub
  // createdAt is managed by dynamoose
  return helper.create(config.AMAZON.DYNAMODB_SCORE_SYSTEM_TABLE, data)
}

create.schema = {
  authUser: Joi.object().required(),
  data: Joi.object().keys({
    name: Joi.string().required(),
    phase: Joi.string().required(),
    topic: Joi.string().required(),
    isActive: Joi.boolean().default(false)
  }).required()
}

/**
 * Partially update score system.
 * @param {Object} authUser the current authenticated user
 * @param {String} id the score system id
 * @param {Object} data the data to update score system
 * @returns {Object} the updated score system
 */
async function partiallyUpdate (authUser, id, data) {
  const scoreSystem = await helper.getById(config.AMAZON.DYNAMODB_SCORE_SYSTEM_TABLE, id)
  data.updatedBy = authUser.handle || authUser.sub
  // updatedAt is managed by dynamoose
  return helper.update(scoreSystem, data)
}

partiallyUpdate.schema = {
  authUser: Joi.object().required(),
  id: Joi.id(),
  data: Joi.object().keys({
    name: Joi.string(),
    phase: Joi.string(),
    topic: Joi.string(),
    isActive: Joi.boolean()
  }).required()
}

/**
 * Update score system.
 * @param {Object} authUser the current authenticated user
 * @param {String} id the score system id
 * @param {Object} data the data to update score system
 * @returns {Object} the updated score system
 */
async function update (authUser, id, data) {
  return partiallyUpdate(authUser, id, data)
}

update.schema = {
  authUser: Joi.object().required(),
  id: Joi.id(),
  data: create.schema.data
}

/**
 * Remove score system.
 * @param {String} id the score system id to remove
 */
async function remove (id) {
  const scoreSystem = await helper.getById(config.AMAZON.DYNAMODB_SCORE_SYSTEM_TABLE, id)
  await helper.remove(scoreSystem)
}

remove.schema = {
  id: Joi.id()
}

module.exports = {
  list,
  getEntity,
  create,
  partiallyUpdate,
  update,
  remove
}

logger.buildService(module.exports)
