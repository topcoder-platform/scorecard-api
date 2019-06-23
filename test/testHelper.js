/**
 * This file defines common helper methods and test data used for tests
 */
const config = require('config')
const uuid = require('uuid/v4')
const helper = require('../src/common/helper')

const notFoundId = uuid()

const mockUser1 = { handle: 'handle' }

const mockUser2 = { sub: 'sub' }

// score system id of 'system1'
const scoreSystemId1 = uuid()

// score system id of 'system2'
const scoreSystemId2 = uuid()

/**
 * Clear data in database
 */
async function clearData () {
  const tables = [config.AMAZON.DYNAMODB_SCORE_SYSTEM_TABLE, config.AMAZON.DYNAMODB_SCORECARD_TABLE]
  for (const table of tables) {
    const records = await helper.scan(table)
    for (const record of records) {
      await record.delete()
    }
  }
}

/**
 * Insert test data in database
 */
async function insertTestData () {
  await helper.create(config.AMAZON.DYNAMODB_SCORE_SYSTEM_TABLE, {
    id: scoreSystemId1,
    name: 'system1',
    phase: 'phase1',
    topic: 'topic1',
    isActive: true,
    createdBy: 'test'
  })
  await helper.create(config.AMAZON.DYNAMODB_SCORE_SYSTEM_TABLE, {
    id: scoreSystemId2,
    name: 'system2',
    phase: 'phase2',
    topic: 'topic2',
    isActive: true,
    createdBy: 'test'
  })
  await helper.create(config.AMAZON.DYNAMODB_SCORE_SYSTEM_TABLE, {
    id: uuid(),
    name: 'system3',
    phase: 'phase3',
    topic: 'topic3',
    isActive: false,
    createdBy: 'test'
  })

  await helper.create(config.AMAZON.DYNAMODB_SCORECARD_TABLE, {
    id: uuid(),
    name: 'scorecard1',
    scorecardDetails: [{
      scoreSystemId: scoreSystemId1,
      weight: 80
    }],
    createdBy: 'test'
  })
  await helper.create(config.AMAZON.DYNAMODB_SCORECARD_TABLE, {
    id: uuid(),
    name: 'scorecard2',
    scorecardDetails: [{
      scoreSystemId: uuid(), // it has no corresponding score system in db
      weight: 20
    }],
    createdBy: 'test'
  })
  await helper.create(config.AMAZON.DYNAMODB_SCORECARD_TABLE, {
    id: uuid(),
    name: 'scorecard3',
    createdBy: 'test'
  })
}

module.exports = {
  notFoundId,
  mockUser1,
  mockUser2,
  scoreSystemId1,
  scoreSystemId2,
  clearData,
  insertTestData
}
