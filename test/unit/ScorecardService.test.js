/*
 * Unit tests of scorecard service
 */

// During the test the env variable is set to test
process.env.NODE_ENV = 'test'

require('../../app-bootstrap')
const _ = require('lodash')
const config = require('config')
const chai = require('chai')
const service = require('../../src/services/ScorecardService')
const testHelper = require('../testHelper')
const constants = require('../../app-constants')

const should = chai.should()
chai.use(require('chai-as-promised'))

describe('Unit tests for scorecard service', () => {
  // created entity id
  let id

  before(async () => {
    await testHelper.clearData()
    await testHelper.insertTestData()
  })

  after(async () => {
    await testHelper.clearData()
  })

  describe('list scorecards tests', () => {
    it('list scorecards successfully 1', async () => {
      const result = await service.list({})
      should.equal(result.length, 3)
      for (let i = 1; i <= 3; i += 1) {
        const name = `scorecard${i}`
        const record = _.find(result, (item) => item.name === name)
        should.exist(record)
        should.exist(record.id)
        should.equal(record.createdBy, 'test')
        should.exist(record.createdAt)
        if (i === 1) {
          should.equal(record.scorecardDetails.length, 1)
          should.equal(record.scorecardDetails[0].scoreSystemId, testHelper.scoreSystemId1)
          should.equal(record.scorecardDetails[0].weight, 80)
          should.equal(record.scorecardDetails[0].scoreSystemName, 'system1')
        } else if (i === 2) {
          should.equal(record.scorecardDetails.length, 1)
          should.exist(record.scorecardDetails[0].scoreSystemId)
          should.equal(record.scorecardDetails[0].weight, 20)
          should.not.exist(record.scorecardDetails[0].scoreSystemName)
        } else {
          const details = record.scorecardDetails || []
          should.equal(details.length, 0)
        }
      }
    })

    it('list scorecards successfully 2', async () => {
      const result = await service.list({
        page: 1, // ignored
        perPage: 10, // ignored
        name: 'recard3'
      })
      should.equal(result.length, 1)
      should.exist(result[0].id)
      should.equal(result[0].name, 'scorecard3')
      should.equal(result[0].createdBy, 'test')
      should.exist(result[0].createdAt)
      const details = result[0].scorecardDetails || []
      should.equal(details.length, 0)
    })

    it('list scorecards successfully 3', async () => {
      const result = await service.list({
        page: null, // ignored
        name: 'Scorecard'
      })
      should.equal(result.length, 0)
    })

    it('list scorecards successfully 4', async () => {
      const result = await service.list({
        page: 1, // ignored
        perPage: 10, // ignored
        legacyScorecardId: 30004192
      })
      should.equal(result.length, 1)
      should.exist(result[0].id)
      should.equal(result[0].name, 'scorecard3')
      should.equal(result[0].legacyScorecardId, 30004192)
      should.equal(result[0].createdBy, 'test')
      should.exist(result[0].createdAt)
      const details = result[0].scorecardDetails || []
      should.equal(details.length, 0)
    })

    it('list scorecards successfully 5', async () => {
      const result = await service.list({
        page: null, // ignored
        legacyScorecardId: 30004172
      })
      should.equal(result.length, 0)
    })

    it('list scorecards - invalid name', async () => {
      try {
        await service.list({ name: ['invalid'] })
      } catch (e) {
        should.equal(e.message.indexOf('"name" must be a string') >= 0, true)
        return
      }
      throw new Error('should not reach here')
    })

    it('list scorecards - empty name', async () => {
      try {
        await service.list({ name: '' })
      } catch (e) {
        should.equal(e.message.indexOf('"name" is not allowed to be empty') >= 0, true)
        return
      }
      throw new Error('should not reach here')
    })

    it('list scorecards - unexpected field', async () => {
      try {
        await service.list({ other: 123 })
      } catch (e) {
        should.equal(e.message.indexOf('"other" is not allowed') >= 0, true)
        return
      }
      throw new Error('should not reach here')
    })
  })

  describe('create scorecard tests', () => {
    it('create scorecard successfully 1', async () => {
      const result = await service.create(testHelper.mockUser1, {
        name: 'test-name',
        scorecardDetails: [{
          scoreSystemId: testHelper.scoreSystemId1,
          weight: 80
        }]
      })
      should.exist(result.id)
      should.equal(result.name, 'test-name')
      should.equal(result.scorecardDetails.length, 1)
      should.equal(result.scorecardDetails[0].scoreSystemId, testHelper.scoreSystemId1)
      should.equal(result.scorecardDetails[0].weight, 80)
      should.equal(result.scorecardDetails[0].scoreSystemName, 'system1')
      should.equal(result.createdBy, 'handle')
      should.exist(result.createdAt)

      id = result.id
    })

    it('create scorecard successfully 2', async () => {
      const result = await service.create(testHelper.mockUser2, {
        name: 'test-name'
      })
      should.exist(result.id)
      should.equal(result.name, 'test-name')
      should.equal((result.scorecardDetails || []).length, 0)
      should.equal(result.createdBy, 'sub')
      should.exist(result.createdAt)
    })

    it('create scorecard - null authUser', async () => {
      try {
        await service.create(null, {
          name: 'test-name'
        })
      } catch (e) {
        should.equal(e.message.indexOf('"authUser" must be an object') >= 0, true)
        return
      }
      throw new Error('should not reach here')
    })

    it('create scorecard - missing name', async () => {
      try {
        await service.create(testHelper.mockUser1, {})
      } catch (e) {
        should.equal(e.message.indexOf('"name" is required') >= 0, true)
        return
      }
      throw new Error('should not reach here')
    })

    it('create scorecard - empty name', async () => {
      try {
        await service.create(testHelper.mockUser1, { name: '' })
      } catch (e) {
        should.equal(e.message.indexOf('"name" is not allowed to be empty') >= 0, true)
        return
      }
      throw new Error('should not reach here')
    })

    it('create scorecard - invalid scoreSystemId', async () => {
      try {
        await service.create(testHelper.mockUser1, {
          name: 'test-name',
          scorecardDetails: [{
            scoreSystemId: 'invalid',
            weight: 80
          }]
        })
      } catch (e) {
        should.equal(e.message.indexOf('"scoreSystemId" must be a valid GUID') >= 0, true)
        return
      }
      throw new Error('should not reach here')
    })

    it('create scorecard - missing scoreSystemId', async () => {
      try {
        await service.create(testHelper.mockUser1, {
          name: 'test-name',
          scorecardDetails: [{
            weight: 80
          }]
        })
      } catch (e) {
        should.equal(e.message.indexOf('"scoreSystemId" is required') >= 0, true)
        return
      }
      throw new Error('should not reach here')
    })

    it('create scorecard - invalid weight', async () => {
      try {
        await service.create(testHelper.mockUser1, {
          name: 'test-name',
          scorecardDetails: [{
            scoreSystemId: testHelper.scoreSystemId1,
            weight: 'abc'
          }]
        })
      } catch (e) {
        should.equal(e.message.indexOf('"weight" must be a number') >= 0, true)
        return
      }
      throw new Error('should not reach here')
    })

    it('create scorecard - missing weight', async () => {
      try {
        await service.create(testHelper.mockUser1, {
          name: 'test-name',
          scorecardDetails: [{
            scoreSystemId: testHelper.scoreSystemId1
          }]
        })
      } catch (e) {
        should.equal(e.message.indexOf('"weight" is required') >= 0, true)
        return
      }
      throw new Error('should not reach here')
    })

    it('create scorecard - scoreSystemId is not found', async () => {
      await service.create(testHelper.mockUser1, {
        name: 'test-name',
        scorecardDetails: [{
          scoreSystemId: testHelper.notFoundId,
          weight: 80
        }]
      }).should.be.rejectedWith(
        `${config.AMAZON.DYNAMODB_SCORE_SYSTEM_TABLE} with id: ${testHelper.notFoundId} doesn't exist`)
    })

    it('create scorecard - unexpected field', async () => {
      try {
        await service.create(testHelper.mockUser1, {
          name: 'test-name',
          other: 123
        })
      } catch (e) {
        should.equal(e.message.indexOf('"other" is not allowed') >= 0, true)
        return
      }
      throw new Error('should not reach here')
    })

    it('create scorecard - weight too large', async () => {
      try {
        await service.create(testHelper.mockUser1, {
          name: 'test-name',
          scorecardDetails: [{
            scoreSystemId: testHelper.scoreSystemId1,
            weight: 101
          }]
        })
      } catch (e) {
        should.equal(e.message.indexOf(`"weight" must be less than or equal to ${constants.MAX_WEIGHT}`) >= 0, true)
        return
      }
      throw new Error('should not reach here')
    })

    it('create scorecard - weight less than lower bound', async () => {
      try {
        await service.create(testHelper.mockUser1, {
          name: 'test-name',
          scorecardDetails: [{
            scoreSystemId: testHelper.scoreSystemId1,
            weight: -1
          }]
        })
      } catch (e) {
        should.equal(e.message.indexOf('"weight" must be larger than or equal to 0') >= 0, true)
        return
      }
      throw new Error('should not reach here')
    })

    it('create scorecard - sum of weights too large', async () => {
      await service.create(testHelper.mockUser1, {
        name: 'test-name',
        scorecardDetails: [{
          scoreSystemId: testHelper.scoreSystemId1,
          weight: 21
        }, {
          scoreSystemId: testHelper.scoreSystemId2,
          weight: 80
        }]
      }).should.be.rejectedWith(
        `Sum of weights is 101, it should not be larger than ${constants.MAX_SUM_OF_WEIGHTS}.`)
    })
  })

  describe('get scorecard tests', () => {
    it('get scorecard successfully', async () => {
      const result = await service.getEntity(id)
      should.equal(result.id, id)
      should.equal(result.name, 'test-name')
      should.equal(result.scorecardDetails.length, 1)
      should.equal(result.scorecardDetails[0].scoreSystemId, testHelper.scoreSystemId1)
      should.equal(result.scorecardDetails[0].weight, 80)
      should.equal(result.scorecardDetails[0].scoreSystemName, 'system1')
      should.equal(result.createdBy, 'handle')
      should.exist(result.createdAt)
    })

    it('get scorecard - not found', async () => {
      await service.getEntity(testHelper.notFoundId).should.be.rejectedWith(
        `${config.AMAZON.DYNAMODB_SCORECARD_TABLE} with id: ${testHelper.notFoundId} doesn't exist`)
    })

    it('get scorecard - null id', async () => {
      try {
        await service.getEntity(null)
      } catch (e) {
        should.equal(e.message.indexOf('"id" must be a string') >= 0, true)
        return
      }
      throw new Error('should not reach here')
    })

    it('get scorecard - undefined id', async () => {
      try {
        await service.getEntity()
      } catch (e) {
        should.equal(e.message.indexOf('"id" is required') >= 0, true)
        return
      }
      throw new Error('should not reach here')
    })

    it('get scorecard - empty id', async () => {
      try {
        await service.getEntity('')
      } catch (e) {
        should.equal(e.message.indexOf('"id" is not allowed to be empty') >= 0, true)
        return
      }
      throw new Error('should not reach here')
    })

    it('get scorecard - invalid id', async () => {
      try {
        await service.getEntity('invalid')
      } catch (e) {
        should.equal(e.message.indexOf('"id" must be a valid GUID') >= 0, true)
        return
      }
      throw new Error('should not reach here')
    })
  })

  describe('update scorecard tests', () => {
    it('update scorecard successfully 1', async () => {
      const result = await service.update(testHelper.mockUser1, id, {
        name: 'test-name2',
        scorecardDetails: [{
          scoreSystemId: testHelper.scoreSystemId1,
          weight: 99
        }]
      })
      should.equal(result.id, id)
      should.equal(result.name, 'test-name2')
      should.equal(result.scorecardDetails.length, 1)
      should.equal(result.scorecardDetails[0].scoreSystemId, testHelper.scoreSystemId1)
      should.equal(result.scorecardDetails[0].weight, 99)
      should.equal(result.scorecardDetails[0].scoreSystemName, 'system1')
      should.equal(result.createdBy, 'handle')
      should.exist(result.createdAt)
      should.equal(result.updatedBy, 'handle')
      should.exist(result.updatedAt)
    })

    it('update scorecard successfully 2', async () => {
      const result = await service.update(testHelper.mockUser2, id, {
        name: 'test-name3'
      })
      should.equal(result.id, id)
      should.equal(result.name, 'test-name3')
      should.equal((result.scorecardDetails || []).length, 0)
      should.equal(result.createdBy, 'handle')
      should.exist(result.createdAt)
      should.equal(result.updatedBy, 'sub')
      should.exist(result.updatedAt)
    })

    it('update scorecard - not found', async () => {
      await service.update(testHelper.mockUser1, testHelper.notFoundId, {
        name: 'test-name3'
      }).should.be.rejectedWith(
        `${config.AMAZON.DYNAMODB_SCORECARD_TABLE} with id: ${testHelper.notFoundId} doesn't exist`)
    })

    it('update scorecard - invalid id', async () => {
      try {
        await service.update(testHelper.mockUser2, 'invalid', {
          name: 'test-name3'
        })
      } catch (e) {
        should.equal(e.message.indexOf('"id" must be a valid GUID') >= 0, true)
        return
      }
      throw new Error('should not reach here')
    })

    it('update scorecard - empty id', async () => {
      try {
        await service.update(testHelper.mockUser2, '', {
          name: 'test-name3'
        })
      } catch (e) {
        should.equal(e.message.indexOf('"id" is not allowed to be empty') >= 0, true)
        return
      }
      throw new Error('should not reach here')
    })

    it('update scorecard - undefined authUser', async () => {
      try {
        await service.update(undefined, id, {
          name: 'test-name'
        })
      } catch (e) {
        should.equal(e.message.indexOf('"authUser" is required') >= 0, true)
        return
      }
      throw new Error('should not reach here')
    })

    it('update scorecard - missing name', async () => {
      try {
        await service.update(testHelper.mockUser1, id, {})
      } catch (e) {
        should.equal(e.message.indexOf('"name" is required') >= 0, true)
        return
      }
      throw new Error('should not reach here')
    })

    it('update scorecard - invalid name', async () => {
      try {
        await service.update(testHelper.mockUser1, id, {
          name: ['test-name']
        })
      } catch (e) {
        should.equal(e.message.indexOf('"name" must be a string') >= 0, true)
        return
      }
      throw new Error('should not reach here')
    })

    it('update scorecard - empty name', async () => {
      try {
        await service.update(testHelper.mockUser1, id, {
          name: ''
        })
      } catch (e) {
        should.equal(e.message.indexOf('"name" is not allowed to be empty') >= 0, true)
        return
      }
      throw new Error('should not reach here')
    })

    it('update scorecard - invalid scoreSystemId', async () => {
      try {
        await service.update(testHelper.mockUser1, id, {
          name: 'test-name',
          scorecardDetails: [{
            scoreSystemId: 'invalid',
            weight: 80
          }]
        })
      } catch (e) {
        should.equal(e.message.indexOf('"scoreSystemId" must be a valid GUID') >= 0, true)
        return
      }
      throw new Error('should not reach here')
    })

    it('update scorecard - missing scoreSystemId', async () => {
      try {
        await service.update(testHelper.mockUser1, id, {
          name: 'test-name',
          scorecardDetails: [{
            weight: 80
          }]
        })
      } catch (e) {
        should.equal(e.message.indexOf('"scoreSystemId" is required') >= 0, true)
        return
      }
      throw new Error('should not reach here')
    })

    it('update scorecard - invalid weight', async () => {
      try {
        await service.update(testHelper.mockUser1, id, {
          name: 'test-name',
          scorecardDetails: [{
            scoreSystemId: testHelper.scoreSystemId1,
            weight: 'abc'
          }]
        })
      } catch (e) {
        should.equal(e.message.indexOf('"weight" must be a number') >= 0, true)
        return
      }
      throw new Error('should not reach here')
    })

    it('update scorecard - missing weight', async () => {
      try {
        await service.update(testHelper.mockUser1, id, {
          name: 'test-name',
          scorecardDetails: [{
            scoreSystemId: testHelper.scoreSystemId1
          }]
        })
      } catch (e) {
        should.equal(e.message.indexOf('"weight" is required') >= 0, true)
        return
      }
      throw new Error('should not reach here')
    })

    it('update scorecard - scoreSystemId is not found', async () => {
      await service.update(testHelper.mockUser1, id, {
        name: 'test-name',
        scorecardDetails: [{
          scoreSystemId: testHelper.notFoundId,
          weight: 80
        }]
      }).should.be.rejectedWith(
        `${config.AMAZON.DYNAMODB_SCORE_SYSTEM_TABLE} with id: ${testHelper.notFoundId} doesn't exist`)
    })

    it('update scorecard - unexpected field', async () => {
      try {
        await service.update(testHelper.mockUser1, id, {
          name: 'test-name',
          scorecardDetails: [{
            scoreSystemId: testHelper.scoreSystemId1,
            weight: 80,
            other: 'invalid'
          }]
        })
      } catch (e) {
        should.equal(e.message.indexOf('"other" is not allowed') >= 0, true)
        return
      }
      throw new Error('should not reach here')
    })

    it('update scorecard - weight too large', async () => {
      try {
        await service.update(testHelper.mockUser1, id, {
          name: 'test-name',
          scorecardDetails: [{
            scoreSystemId: testHelper.scoreSystemId1,
            weight: 101
          }]
        })
      } catch (e) {
        should.equal(e.message.indexOf(`"weight" must be less than or equal to ${constants.MAX_WEIGHT}`) >= 0, true)
        return
      }
      throw new Error('should not reach here')
    })

    it('update scorecard - weight less than lower bound', async () => {
      try {
        await service.update(testHelper.mockUser1, id, {
          name: 'test-name',
          scorecardDetails: [{
            scoreSystemId: testHelper.scoreSystemId1,
            weight: -1
          }]
        })
      } catch (e) {
        should.equal(e.message.indexOf(`"weight" must be larger than or equal to 0`) >= 0, true)
        return
      }
      throw new Error('should not reach here')
    })

    it('update scorecard - sum of weights too large', async () => {
      await service.update(testHelper.mockUser1, id, {
        name: 'test-name',
        scorecardDetails: [{
          scoreSystemId: testHelper.scoreSystemId1,
          weight: 21
        }, {
          scoreSystemId: testHelper.scoreSystemId2,
          weight: 80
        }]
      }).should.be.rejectedWith(
        `Sum of weights is 101, it should not be larger than ${constants.MAX_SUM_OF_WEIGHTS}.`)
    })
  })

  describe('partially update scorecard tests', () => {
    it('partially update scorecard successfully 1', async () => {
      const result = await service.partiallyUpdate(testHelper.mockUser1, id, {
        name: 'test-name3',
        scorecardDetails: [{
          scoreSystemId: testHelper.scoreSystemId2,
          weight: 100
        }]
      })
      should.equal(result.id, id)
      should.equal(result.name, 'test-name3')
      should.equal(result.scorecardDetails.length, 1)
      should.equal(result.scorecardDetails[0].scoreSystemId, testHelper.scoreSystemId2)
      should.equal(result.scorecardDetails[0].weight, 100)
      should.equal(result.scorecardDetails[0].scoreSystemName, 'system2')
      should.equal(result.createdBy, 'handle')
      should.exist(result.createdAt)
      should.equal(result.updatedBy, 'handle')
      should.exist(result.updatedAt)
    })

    it('partially update scorecard successfully 2', async () => {
      const result = await service.partiallyUpdate(testHelper.mockUser2, id, {
        name: 'test-name4'
      })
      should.equal(result.id, id)
      should.equal(result.name, 'test-name4')
      should.equal(result.scorecardDetails.length, 1)
      should.equal(result.scorecardDetails[0].scoreSystemId, testHelper.scoreSystemId2)
      should.equal(result.scorecardDetails[0].weight, 100)
      should.equal(result.scorecardDetails[0].scoreSystemName, 'system2')
      should.equal(result.createdBy, 'handle')
      should.exist(result.createdAt)
      should.equal(result.updatedBy, 'sub')
      should.exist(result.updatedAt)
    })

    it('partially update scorecard - not found', async () => {
      await service.partiallyUpdate(testHelper.mockUser1, testHelper.notFoundId, {
        name: 'test-name3'
      }).should.be.rejectedWith(
        `${config.AMAZON.DYNAMODB_SCORECARD_TABLE} with id: ${testHelper.notFoundId} doesn't exist`)
    })

    it('partially update scorecard - invalid id', async () => {
      try {
        await service.partiallyUpdate(testHelper.mockUser2, 'invalid', {
          name: 'test-name3'
        })
      } catch (e) {
        should.equal(e.message.indexOf('"id" must be a valid GUID') >= 0, true)
        return
      }
      throw new Error('should not reach here')
    })

    it('partially update scorecard - empty id', async () => {
      try {
        await service.partiallyUpdate(testHelper.mockUser2, '', {
          name: 'test-name3'
        })
      } catch (e) {
        should.equal(e.message.indexOf('"id" is not allowed to be empty') >= 0, true)
        return
      }
      throw new Error('should not reach here')
    })

    it('partially update scorecard - undefined authUser', async () => {
      try {
        await service.partiallyUpdate(undefined, id, {
          name: 'test-name'
        })
      } catch (e) {
        should.equal(e.message.indexOf('"authUser" is required') >= 0, true)
        return
      }
      throw new Error('should not reach here')
    })

    it('partially update scorecard - invalid name', async () => {
      try {
        await service.partiallyUpdate(testHelper.mockUser1, id, {
          name: ['test-name']
        })
      } catch (e) {
        should.equal(e.message.indexOf('"name" must be a string') >= 0, true)
        return
      }
      throw new Error('should not reach here')
    })

    it('partially update scorecard - empty name', async () => {
      try {
        await service.partiallyUpdate(testHelper.mockUser1, id, {
          name: ''
        })
      } catch (e) {
        should.equal(e.message.indexOf('"name" is not allowed to be empty') >= 0, true)
        return
      }
      throw new Error('should not reach here')
    })

    it('partially update scorecard - invalid scoreSystemId', async () => {
      try {
        await service.partiallyUpdate(testHelper.mockUser1, id, {
          name: 'test-name',
          scorecardDetails: [{
            scoreSystemId: 'invalid',
            weight: 80
          }]
        })
      } catch (e) {
        should.equal(e.message.indexOf('"scoreSystemId" must be a valid GUID') >= 0, true)
        return
      }
      throw new Error('should not reach here')
    })

    it('partially update scorecard - missing scoreSystemId', async () => {
      try {
        await service.partiallyUpdate(testHelper.mockUser1, id, {
          name: 'test-name',
          scorecardDetails: [{
            weight: 80
          }]
        })
      } catch (e) {
        should.equal(e.message.indexOf('"scoreSystemId" is required') >= 0, true)
        return
      }
      throw new Error('should not reach here')
    })

    it('partially update scorecard - invalid weight', async () => {
      try {
        await service.partiallyUpdate(testHelper.mockUser1, id, {
          name: 'test-name',
          scorecardDetails: [{
            scoreSystemId: testHelper.scoreSystemId1,
            weight: 'abc'
          }]
        })
      } catch (e) {
        should.equal(e.message.indexOf('"weight" must be a number') >= 0, true)
        return
      }
      throw new Error('should not reach here')
    })

    it('partially update scorecard - missing weight', async () => {
      try {
        await service.partiallyUpdate(testHelper.mockUser1, id, {
          name: 'test-name',
          scorecardDetails: [{
            scoreSystemId: testHelper.scoreSystemId1
          }]
        })
      } catch (e) {
        should.equal(e.message.indexOf('"weight" is required') >= 0, true)
        return
      }
      throw new Error('should not reach here')
    })

    it('partially update scorecard - scoreSystemId is not found', async () => {
      await service.partiallyUpdate(testHelper.mockUser1, id, {
        name: 'test-name',
        scorecardDetails: [{
          scoreSystemId: testHelper.notFoundId,
          weight: 80
        }]
      }).should.be.rejectedWith(
        `${config.AMAZON.DYNAMODB_SCORE_SYSTEM_TABLE} with id: ${testHelper.notFoundId} doesn't exist`)
    })

    it('partially update scorecard - unexpected field', async () => {
      try {
        await service.partiallyUpdate(testHelper.mockUser1, id, {
          name: 'test-name',
          scorecardDetails: [{
            scoreSystemId: testHelper.scoreSystemId1,
            weight: 80,
            other: 'invalid'
          }]
        })
      } catch (e) {
        should.equal(e.message.indexOf('"other" is not allowed') >= 0, true)
        return
      }
      throw new Error('should not reach here')
    })

    it('partially update scorecard - weight too large', async () => {
      try {
        await service.partiallyUpdate(testHelper.mockUser1, id, {
          name: 'test-name',
          scorecardDetails: [{
            scoreSystemId: testHelper.scoreSystemId1,
            weight: 101
          }]
        })
      } catch (e) {
        should.equal(e.message.indexOf(`"weight" must be less than or equal to ${constants.MAX_WEIGHT}`) >= 0, true)
        return
      }
      throw new Error('should not reach here')
    })

    it('partially update scorecard - weight less than lower bound', async () => {
      try {
        await service.partiallyUpdate(testHelper.mockUser1, id, {
          scorecardDetails: [{
            scoreSystemId: testHelper.scoreSystemId1,
            weight: -1
          }]
        })
      } catch (e) {
        should.equal(e.message.indexOf(`"weight" must be larger than or equal to 0`) >= 0, true)
        return
      }
      throw new Error('should not reach here')
    })

    it('partially update scorecard - sum of weights too large', async () => {
      await service.partiallyUpdate(testHelper.mockUser1, id, {
        name: 'test-name',
        scorecardDetails: [{
          scoreSystemId: testHelper.scoreSystemId1,
          weight: 21
        }, {
          scoreSystemId: testHelper.scoreSystemId2,
          weight: 80
        }]
      }).should.be.rejectedWith(
        `Sum of weights is 101, it should not be larger than ${constants.MAX_SUM_OF_WEIGHTS}.`)
    })
  })

  describe('remove scorecard tests', () => {
    it('remove scorecard successfully', async () => {
      await service.remove(id)
    })

    it('remove scorecard - not found', async () => {
      await service.remove(id).should.be.rejectedWith(
        `${config.AMAZON.DYNAMODB_SCORECARD_TABLE} with id: ${id} doesn't exist`)
    })

    it('remove scorecard - invalid id', async () => {
      try {
        await service.remove('invalid')
      } catch (e) {
        should.equal(e.message.indexOf('"id" must be a valid GUID') >= 0, true)
        return
      }
      throw new Error('should not reach here')
    })

    it('remove scorecard - empty id', async () => {
      try {
        await service.remove('')
      } catch (e) {
        should.equal(e.message.indexOf('"id" is not allowed to be empty') >= 0, true)
        return
      }
      throw new Error('should not reach here')
    })
  })
})
