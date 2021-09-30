/**
 * Insert seed data to tables in database
 */

const models = require('../src/models')
const seeds = require('./seed')
const helper = require('../src/common/helper')
const logger = require('../src/common/logger')
const { get } = require('lodash')

const userPrompt = 'WARNING: this would remove existing data. Are you sure you want to import data from a json file with the path ./scripts/seed ?'

const seedTables = async () => {
  logger.info({ component: 'seedTables', message: 'Requesting to insert seed data to the tables...' })
  const names = Object.keys(seeds)
  for await (const name of names) {
    try {
      logger.info({ component: 'seedTables', message: `Delete table: ${name}` })
      await models[name].$__.table.delete()
    } catch (e) {
      if (e.code === 'ResourceNotFoundException') {
        logger.info({ component: 'seedTables', message: `table: ${name} does not exist` })
      } else {
        throw e
      }
    }
    try {
      logger.info({ component: 'seedTables', message: `Create table: ${name}` })
      await models[name].$__.table.create()
      logger.info({ component: 'seedTables', message: `Inserting ${get(seeds[name], 'length')} records in table ${name}` })
      await models[name].batchPut(seeds[name])
    } catch (e) {
      logger.warn({ component: 'seedTables', message: `No records will be inserted in table ${name}` })
    }
  }
}

async function importData () {
  await helper.promptUser(userPrompt, async () => {
    try {
      await seedTables()
      logger.info({ component: 'seedTables', message: 'Done!' })
      process.exit(0)
    } catch (e) {
      logger.logFullError(e, { component: 'seedTables' })
      process.exit(1)
    }
  })
}

importData()
