/**
 * Create index in Elasticsearch
 */
const config = require('config')
const _ = require('lodash')
const logger = require('../src/common/logger')
const helper = require('../src/common/helper')

const indices = [
  config.get('ES.ES_INDEX_REVIEW_PROCESS'),
  config.get('ES.ES_INDEX_SCORECARD')
]
const type = config.get('ES.ES_INDEX_TYPE')
const userPrompt = `WARNING: Are you sure want to create the following elasticsearch indices: ${indices}?`

async function job () {
  for await (const index of indices) {
    try {
      await helper.createIndex(index, type, logger)
    } catch (err) {
      if (_.get(err, 'meta.body.error.type') === 'resource_already_exists_exception') {
        logger.warn({ component: 'createIndex', message: `index: ${index} already exist` })
      } else { logger.logFullError(err, { component: 'createIndex' }) }
    }
  }
}

async function createIndex () {
  await helper.promptUser(userPrompt, async () => {
    try {
      await job()
      logger.info({ component: 'createIndex', message: 'Done!' })
      process.exit(0)
    } catch (e) {
      logger.logFullError(e, { component: 'createIndex' })
      process.exit(1)
    }
  })
}

createIndex()
