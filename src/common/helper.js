/**
 * This file defines helper methods
 */
const _ = require('lodash')
const config = require('config')
const querystring = require('querystring')
const Confirm = require('prompt-confirm')
const errors = require('./errors')

/**
 * Checks if the source matches the term.
 *
 * @param {Array} source the array in which to search for the term
 * @param {Array | String} term the term to search
 */
function checkIfExists (source, term) {
  let terms

  if (!_.isArray(source)) {
    throw new Error('Source argument should be an array')
  }

  source = source.map(s => s.toLowerCase())

  if (_.isString(term)) {
    terms = term.split(' ')
  } else if (_.isArray(term)) {
    terms = term.map(t => t.toLowerCase())
  } else {
    throw new Error('Term argument should be either a string or an array')
  }

  for (let i = 0; i < terms.length; i++) {
    if (source.includes(terms[i])) {
      return true
    }
  }

  return false
}

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
 * Get link for a given page.
 * @param {Object} req the HTTP request
 * @param {Number} page the page number
 * @returns {String} link for the page
 */
function getPageLink (req, page) {
  const q = _.assignIn({}, req.query, { page })
  return `${config.API_BASE_URL}${req.path}?${querystring.stringify(q)}`
}

/**
 * Set HTTP response headers from result.
 * @param {Object} req the HTTP request
 * @param {Object} res the HTTP response
 * @param {Object} result the operation result
 */
function setResHeaders (req, res, result) {
  const totalPages = Math.ceil(result.total / result.perPage)
  if (parseInt(result.page, 10) > 1) {
    res.set('X-Prev-Page', parseInt(result.page, 10) - 1)
  }
  if (parseInt(result.page, 10) < totalPages) {
    res.set('X-Next-Page', parseInt(result.page, 10) + 1)
  }
  res.set('X-Page', parseInt(result.page, 10))
  res.set('X-Per-Page', result.perPage)
  res.set('X-Total', result.total)
  res.set('X-Total-Pages', totalPages)
  // set Link header
  if (totalPages > 0) {
    let link = `<${getPageLink(req, 1)}>; rel="first", <${getPageLink(req, totalPages)}>; rel="last"`
    if (parseInt(result.page, 10) > 1) {
      link += `, <${getPageLink(req, parseInt(result.page, 10) - 1)}>; rel="prev"`
    }
    if (parseInt(result.page, 10) < totalPages) {
      link += `, <${getPageLink(req, parseInt(result.page, 10) + 1)}>; rel="next"`
    }
    res.set('Link', link)
  }
}

/**
 * Get Data by model id. The Id should be hash key
 * @param {Object} model The dynamoose model
 * @param {String} modelName The dynamoose model name
 * @param {String} id The id value
 * @param {Class} ErrorClass the error class
 * @returns {Object} found record
 */
async function getById (model, modelName, id, ErrorClass) {
  const ErrCls = ErrorClass || errors.NotFoundError
  return new Promise((resolve, reject) => {
    model.get(id, (err, result) => {
      if (err) {
        reject(err)
      } else if (!_.isUndefined(result)) {
        resolve(result)
      } else {
        reject(new ErrCls(`${modelName} with id: ${id} doesn't exist`))
      }
    })
  })
}

/**
 * Create item in database
 * @param {Object} model The dynamoose model
 * @param {Object} data The create data object
 * @returns {Object} created entity
 */
async function create (model, data) {
  return new Promise((resolve, reject) => {
    model.create(data, (error, result) => {
      if (error) {
        reject(error)
      } else {
        resolve(result)
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
 * Get all data collection (avoid default page limit of DynamoDB) by scan parameters
 * @param {Object} model The dynamoose model
 * @param {Object} scanParams The scan parameters object
 * @returns {Array}
 */
async function scanAll (model, scanParams) {
  let results = await model.scan(scanParams).exec()
  let lastKey = results.lastKey
  while (!_.isUndefined(results.lastKey)) {
    const newResult = await model.scan(scanParams).startAt(lastKey).exec()
    results = [...results, ...newResult]
    lastKey = newResult.lastKey
  }
  return results
}

/**
 * Includes or excludes the given properties from the Dynamo database item
 * @param {Object|Array<Object>} result the query result
 * @param {Array<string>} include fields to be included
 * @param {Array<string>} exclude fields to be excluded
 * @returns {Object|Array<Object>} the cleaned result
 */
function cleanResult (result, include, exclude) {
  if (_.isUndefined(result)) {
    return {}
  } else if (_.isEmpty(result)) {
    return result
  } else if (_.isArray(result)) {
    if (!_.isEmpty(include)) {
      return _.map(result, r => _.pick(r.originalItem(), include))
    }
    return _.map(result, r => _.omit(r.originalItem(), exclude))
  } else if (_.isObject(result)) {
    if (!_.isEmpty(include)) {
      return _.pick(result.originalItem(), include)
    }
    return _.omit(result.originalItem(), exclude)
  } else return result
}

/**
 * Prompt the user with a y/n query and call a callback function based on the answer
 * @param {string} promptQuery the query to ask the user
 * @param {function} cb the callback function
 */
async function promptUser (promptQuery, cb) {
  if (process.argv.includes('--force')) {
    await cb()
    return
  }

  const prompt = new Confirm(promptQuery)
  prompt.ask(async (answer) => {
    if (answer) {
      await cb()
    }
  })
}

module.exports = {
  checkIfExists,
  wrapExpress,
  autoWrapExpress,
  setResHeaders,
  getById,
  create,
  update,
  remove,
  scanAll,
  cleanResult,
  promptUser
}
