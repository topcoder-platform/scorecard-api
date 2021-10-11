/**
 * View all ES data.
 */

const helper = require('../src/common/helper')
const config = require('config')
const logger = require('../src/common/logger')

if (process.argv.length <= 2) {
  logger.warn(`Please provide index name: ${config.get('ES.ES_INDEX_REVIEW_PROCESS')} or ${config.get('ES.ES_INDEX_SCORECARD')}`)
  process.exit(1)
}
const index = process.argv[2]

const esClient = helper.getESClient()

async function showESData () {
  const result = await esClient.search({
    index
  })
  return result.body.hits.hits || []
}

showESData()
  .then(result => {
    if (result.length === 0) {
      logger.info('It is empty.')
    } else {
      logger.info('All data in ES are shown below:')
      logger.info(JSON.stringify(result, null, 2))
    }
    logger.info('Done!')
    process.exit(0)
  })
  .catch(err => {
    logger.logFullError(err)
    process.exit(1)
  })
