/**
 * Delete tables in Amazon DynamoDB
 */

const models = require('../src/models')
const logger = require('../src/common/logger')

logger.info({ component: 'deleteTables', message: 'Delete DynamoDB tables.' })

const deleteTables = async () => {
  const names = Object.keys(models)
  for await (const name of names) {
    logger.info({ component: 'deleteTables', message: `Delete table: ${name}` })
    try {
      await models[name].$__.table.delete()
    } catch (e) {
      if (e.code === 'ResourceNotFoundException') {
        logger.warn({ component: 'deleteTables', message: `table: ${name} does not exist` })
      } else {
        logger.error({ component: 'deleteTables', message: `table: ${name} cannot be deleted` })
      }
    }
  }
}

deleteTables().then(() => {
  logger.info({ component: 'deleteTables', message: 'Done!' })
  process.exit(0)
}).catch((e) => {
  logger.logFullError(e, { component: 'deleteTables' })
  process.exit(1)
})
