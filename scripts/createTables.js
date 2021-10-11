/**
 * Create tables in Amazon DynamoDB
 */

const models = require('../src/models')
const logger = require('../src/common/logger')

logger.info({ component: 'createTables', message: 'Create DynamoDB tables.' })

const createTables = async () => {
  const names = Object.keys(models)
  for await (const name of names) {
    logger.info({ component: 'createTables', message: `Create table: ${name}` })
    try {
      await models[name].$__.table.create()
    } catch (e) {
      if (e.code === 'ResourceInUseException') {
        logger.warn({ component: 'createTables', message: `table: ${name} already exist` })
      } else {
        logger.error({ component: 'createTables', message: `table: ${name} cannot be created` })
      }
    }
  }
}

createTables().then(() => {
  logger.info({ component: 'createTables', message: 'Done!' })
  process.exit(0)
}).catch((e) => {
  logger.logFullError(e, { component: 'createTables' })
  process.exit(1)
})
