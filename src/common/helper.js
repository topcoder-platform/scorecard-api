/**
 * This file defines helper methods
 */
const _ = require('lodash')
const config = require('config')
const AWS = require('aws-sdk')
const models = require('../models')
const errors = require('./errors')
const logger = require('./logger')

// AWS DynamoDB instance
let dbInstance

AWS.config.update({
  region: config.AMAZON.AWS_REGION
})

/**
 * Wrap async function to standard express function
 * @param {Function} fn the async function
 * @returns {Function} the wrapped function
 */
function wrapExpress (fn) {
  return function (req, res, next) {
    fn(req, res, next).catch(next)
  }
}

/**
 * Wrap all functions from object
 * @param obj the object (controller exports)
 * @returns {Object|Array} the wrapped object
 */
function autoWrapExpress (obj) {
  if (_.isArray(obj)) {
    return obj.map(autoWrapExpress)
  }
  if (_.isFunction(obj)) {
    if (obj.constructor.name === 'AsyncFunction') {
      return wrapExpress(obj)
    }
    return obj
  }
  _.each(obj, (value, key) => {
    obj[key] = autoWrapExpress(value)
  })
  return obj
}

/**
 * Get DynamoDB Connection Instance
 * @return {Object} DynamoDB Connection Instance
 */
function getDb () {
  // cache it for better performance
  if (!dbInstance) {
    dbInstance = new AWS.DynamoDB({ apiVersion: '2012-08-10' })
  }
  return dbInstance
}

/**
 * Creates table in DynamoDB
 * @param     {object} model Table structure in JSON format
 * @return    {promise} the result
 */
async function createTable (model) {
  const db = getDb()
  return new Promise((resolve, reject) => {
    db.createTable(model, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

/**
 * Deletes table in DynamoDB
 * @param     {String} tableName Name of the table to be deleted
 * @return    {promise} the result
 */
async function deleteTable (tableName) {
  const db = getDb()
  const item = {
    TableName: tableName
  }
  return new Promise((resolve, reject) => {
    db.deleteTable(item, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

/**
 * Get Data by model id
 * @param {String} modelName The dynamoose model name
 * @param {String} id The id value
 * @param {Class} ErrorClass the error class
 * @returns {Object} found record
 */
async function getById (modelName, id, ErrorClass) {
  const ErrCls = ErrorClass || errors.NotFoundError
  return new Promise((resolve, reject) => {
    models[modelName]
      .query('id')
      .eq(id)
      .exec((err, result) => {
        if (err) {
          reject(err)
        } else if (result.length > 0) {
          resolve(result[0])
        } else {
          reject(new ErrCls(`${modelName} with id: ${id} doesn't exist`))
        }
      })
  })
}

/**
 * Create item in database
 * @param {Object} modelName The dynamoose model name
 * @param {Object} data The create data object
 * @returns {Object} created entity
 */
async function create (modelName, data) {
  return new Promise((resolve, reject) => {
    const dbItem = new models[modelName](data)
    dbItem.save(err => {
      if (err) {
        reject(err)
      } else {
        resolve(dbItem)
      }
    })
  })
}

/**
 * Update item in database
 * @param {Object} dbItem The Dynamo database item
 * @param {Object} data The updated data object
 * @returns {Object} updated entity
 */
async function update (dbItem, data) {
  _.assignIn(dbItem, data)
  return new Promise((resolve, reject) => {
    dbItem.save(err => {
      if (err) {
        reject(err)
      } else {
        resolve(dbItem)
      }
    })
  })
}

/**
 * Remove item in database
 * @param {Object} dbItem The Dynamo database item to remove
 */
async function remove (dbItem) {
  return new Promise((resolve, reject) => {
    dbItem.delete(err => {
      if (err) {
        reject(err)
      } else {
        resolve(dbItem)
      }
    })
  })
}

/**
 * Get data collection by scan parameters
 * @param {Object} modelName The dynamoose model name
 * @param {Object} scanParams The scan parameters object
 * @returns {Array} found records
 */
async function scan (modelName, scanParams) {
  logger.debug(`scan for ${JSON.stringify(scanParams)} in table ${modelName}`)

  return new Promise((resolve, reject) => {
    models[modelName].scan(scanParams).exec((err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result.count === 0 ? [] : result)
      }
    })
  })
}

/**
 * Perform partial string match.
 * @param {String} value the value string to find match
 * @param {String} s the matching string to find
 * @returns {Boolean} whether s is part of value, case-insensitive
 */
function matchString (value, s) {
  if (!value) {
    return false
  }
  return value.toLowerCase().indexOf(s.toLowerCase()) >= 0
}

module.exports = {
  wrapExpress,
  autoWrapExpress,
  createTable,
  deleteTable,
  getById,
  create,
  update,
  remove,
  scan,
  matchString
}
