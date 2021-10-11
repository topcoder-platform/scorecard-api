/**
 * Delete index in Elasticsearch
 */
const config = require('config')
const _ = require('lodash')
const logger = require('../src/common/logger')
const helper = require('../src/common/helper')

const indices = [
  config.get('ES.ES_INDEX_REVIEW_PROCESS'),
  config.get('ES.ES_INDEX_SCORECARD')
]
const userPrompt = `WARNING: this would remove existent data! Are you sure want to delete the following eleasticsearch indices: ${indices}?`

async function job () {
  for await (const index of indices) {
    try {
      await helper.deleteIndex(index, logger)
    } catch (err) {
      if (_.get(err, 'meta.body.error.type') === 'index_not_found_exception') {
        logger.warn({ component: 'deleteIndex', message: `index: ${index} was not found` })
      } else { logger.logFullError(err, { component: 'deleteIndex' }) }
    }
  }
}

async function deleteIndex () {
  await helper.promptUser(userPrompt, async () => {
    try {
      await job()
      logger.info({ component: 'deleteIndex', message: 'Done!' })
      process.exit(0)
    } catch (e) {
      logger.logFullError(e, { component: 'deleteIndex' })
      process.exit(1)
    }
  })
}

deleteIndex()
