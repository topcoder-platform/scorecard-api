/**
 * This service provides operations of scorecards.
 */

const _ = require('lodash');
const Joi = require('joi');
const config = require('config');
const uuid = require('uuid/v4');
const helper = require('../common/helper');
const logger = require('../common/logger');
const errors = require('../common/errors');
const constants = require('../../app-constants');

/**
 * Popuate scorecard details' score system names.
 * @param {Object} scorecard the scorecard to populate score system names
 */
async function populateScoreSystemNames(scorecard) {
  if (!scorecard.scorecardDetails) {
    return;
  }
  for (let i = 0; i < scorecard.scorecardDetails.length; i += 1) {
    // populate each detail
    const detail = scorecard.scorecardDetails[i];
    try {
      const scoreSystem = await helper.getById(config.AMAZON.DYNAMODB_SCORE_SYSTEM_TABLE, detail.scoreSystemId);
      detail.scoreSystemName = scoreSystem.name;
    } catch (e) {
      // if score system is not found, then ignore the error, otherwise rethrow error
      if (!(e instanceof errors.NotFoundError)) {
        throw e;
      }
    }
  }
  return scorecard;
}

/**
 * List scorecards.
 * @param {Object} criteria the search criteria
 * @returns {Array} the search result
 */
async function list(criteria) {
  let options = {};
  if (criteria.name) {
    options.name = { contains: criteria.name }
  }
  if (criteria.legacyScorecardId) {
    options.legacyScorecardId = { eq: criteria.legacyScorecardId }
  }

  logger.debug(`list the scorecard with ${JSON.stringify(criteria)}`);

  const records = await helper.scan(config.AMAZON.DYNAMODB_SCORECARD_TABLE, options);
  logger.debug(`received records = ${JSON.stringify(records)}`);
  // populate score system names
  for (let i = 0; i < records.length; i += 1) {
    await populateScoreSystemNames(records[i]);
  }
  return records;
}

list.schema = {
  criteria: Joi.object().keys({
    page: Joi.any(), // ignored
    perPage: Joi.any(), // ignored
    name: Joi.string(),
    legacyScorecardId: Joi.number().integer()
  })
};

/**
 * Get scorecard entity by id.
 * @param {String} id the scorecard id
 * @returns {Object} the scorecard of given id
 */
async function getEntity(id) {
  const scorecard = await helper.getById(config.AMAZON.DYNAMODB_SCORECARD_TABLE, id);
  return populateScoreSystemNames(scorecard);
}

getEntity.schema = {
  id: Joi.id()
};

/**
 * Validate scorecard details. There should be no duplicate scoreSystemId, each scoreSystemId should exist,
 * and sum of weight should not be larger than constants.MAX_SUM_OF_WEIGHTS(100).
 * @param {Object} details the scorecard details
 */
async function validateScorecardDetails(details) {
  const ids = [];
  let sum = 0;
  for (let i = 0; i < details.length; i += 1) {
    // check duplicate id
    const scoreSystemId = details[i].scoreSystemId;
    if (_.includes(ids, scoreSystemId)) {
      throw new errors.BadRequestError(`There are duplicate score system id: ${scoreSystemId}`);
    }
    ids.push(scoreSystemId);

    // try to get score system to ensure it exists
    await helper.getById(config.AMAZON.DYNAMODB_SCORE_SYSTEM_TABLE, scoreSystemId, errors.BadRequestError);

    sum += details[i].weight;
  }
  if (sum > constants.MAX_SUM_OF_WEIGHTS) {
    throw new errors.BadRequestError(
      `Sum of weights is ${sum}, it should not be larger than ${constants.MAX_SUM_OF_WEIGHTS}.`
    );
  }
}

/**
 * Create scorecard.
 * @param {Object} authUser the current authenticated user
 * @param {Object} data the data to create scorecard
 * @returns {Object} the created scorecard
 */
async function create(authUser, data) {
  logger.debug(`create scorecard with ${JSON.stringify(data)} by ${authUser}`);

  await validateScorecardDetails(data.scorecardDetails);

  data.id = uuid();
  data.createdBy = authUser.handle || authUser.sub;
  // createdAt is managed by dynamoose
  const scorecard = await helper.create(config.AMAZON.DYNAMODB_SCORECARD_TABLE, data);
  // populate score system names
  return populateScoreSystemNames(scorecard);
}

create.schema = {
  authUser: Joi.object().required(),
  data: Joi.object()
    .keys({
      name: Joi.string().required(),
      scorecardDetails: Joi.array()
        .items(
          Joi.object().keys({
            scoreSystemId: Joi.id(),
            weight: Joi.number()
              .min(0)
              .max(constants.MAX_WEIGHT)
              .required()
          })
        )
        .default([]),
      legacyScorecardId: Joi.number().integer()
    })
    .required()
};

/**
 * Partially update scorecard.
 * @param {Object} authUser the current authenticated user
 * @param {String} id the scorecard id
 * @param {Object} data the data to update scorecard
 * @returns {Object} the updated scorecard
 */
async function partiallyUpdate(authUser, id, data) {
  if (data.scorecardDetails) {
    await validateScorecardDetails(data.scorecardDetails);
  }

  const scorecard = await helper.getById(config.AMAZON.DYNAMODB_SCORECARD_TABLE, id);
  data.updatedBy = authUser.handle || authUser.sub;
  // updatedAt is managed by dynamoose
  const updatedScorecard = await helper.update(scorecard, data);
  // populate score system names
  return populateScoreSystemNames(updatedScorecard);
}

partiallyUpdate.schema = {
  authUser: Joi.object().required(),
  id: Joi.id(),
  data: Joi.object()
    .keys({
      name: Joi.string(),
      scorecardDetails: Joi.array().items(
        Joi.object().keys({
          scoreSystemId: Joi.id(),
          weight: Joi.number()
            .min(0)
            .max(constants.MAX_WEIGHT)
            .required()
        })
      ),
      legacyScorecardId: Joi.number().integer()
    })
    .required()
};

/**
 * Update scorecard.
 * @param {Object} authUser the current authenticated user
 * @param {String} id the scorecard id
 * @param {Object} data the data to update scorecard
 * @returns {Object} the updated scorecard
 */
async function update(authUser, id, data) {
  return partiallyUpdate(authUser, id, data);
}

update.schema = {
  authUser: Joi.object().required(),
  id: Joi.id(),
  data: create.schema.data
};

/**
 * Remove scorecard.
 * @param {String} id the scorecard id to remove
 */
async function remove(id) {
  const scorecard = await helper.getById(config.AMAZON.DYNAMODB_SCORECARD_TABLE, id);
  await helper.remove(scorecard);
}

remove.schema = {
  id: Joi.id()
};

module.exports = {
  list,
  getEntity,
  create,
  partiallyUpdate,
  update,
  remove
};

logger.buildService(module.exports);
