/*
 * Unit tests of score system service
 */

// During the test the env variable is set to test
process.env.NODE_ENV = 'test'

require('../../app-bootstrap')
const _ = require('lodash')
const config = require('config')
const chai = require('chai')
const service = require('../../src/services/ScoreSystemService')
const testHelper = require('../testHelper')

const should = chai.should()
chai.use(require('chai-as-promised'))

describe('Unit tests for score system service', () => {
  // created entity id
  let id

  before(async () => {
    await testHelper.clearData()
    await testHelper.insertTestData()
  })

  after(async () => {
    await testHelper.clearData()
  })

  describe('list score systems tests', () => {
    it('list score systems successfully 1', async () => {
      const result = await service.list({})
      should.equal(result.length, 3)
      for (let i = 1; i <= 3; i += 1) {
        const name = `system${i}`
        const record = _.find(result, (item) => item.name === name)
        should.exist(record)
        should.exist(record.id)
        should.equal(record.phase, `phase${i}`)
        should.equal(record.topic, `topic${i}`)
        should.equal(record.isActive, i <= 2)
        should.equal(record.createdBy, 'test')
        should.exist(record.createdAt)
      }
    })

    it('list score systems successfully 2', async () => {
      const result = await service.list({
        page: 1, // ignored
        perPage: 10, // ignored
        name: 'STEM1',
        phase: 'phase',
        topic: 'TOPic1',
        isActive: true
      })
      should.equal(result.length, 1)
      should.exist(result[0].id)
      should.equal(result[0].name, 'system1')
      should.equal(result[0].phase, 'phase1')
      should.equal(result[0].topic, 'topic1')
      should.equal(result[0].isActive, true)
      should.equal(result[0].createdBy, 'test')
      should.exist(result[0].createdAt)
    })

    it('list score systems successfully 3', async () => {
      const result = await service.list({
        page: null, // ignored
        topic: 'TOPIC',
        isActive: false
      })
      should.equal(result.length, 1)
      should.exist(result[0].id)
      should.equal(result[0].name, 'system3')
      should.equal(result[0].phase, 'phase3')
      should.equal(result[0].topic, 'topic3')
      should.equal(result[0].isActive, false)
      should.equal(result[0].createdBy, 'test')
      should.exist(result[0].createdAt)
    })

    it('list score systems successfully 4', async () => {
      const result = await service.list({
        topic: 'not-found',
        isActive: false
      })
      should.equal(result.length, 0)
    })

    it('list score systems - invalid name', async () => {
      try {
        await service.list({ name: ['invalid'] })
      } catch (e) {
        should.equal(e.message.indexOf('"name" must be a string') >= 0, true)
        return
      }
      throw new Error('should not reach here')
    })

    it('list score systems - invalid phase', async () => {
      try {
        await service.list({ phase: {} })
      } catch (e) {
        should.equal(e.message.indexOf('"phase" must be a string') >= 0, true)
        return
      }
      throw new Error('should not reach here')
    })

    it('list score systems - invalid topic', async () => {
      try {
        await service.list({ topic: [1, 2, 3] })
      } catch (e) {
        should.equal(e.message.indexOf('"topic" must be a string') >= 0, true)
        return
      }
      throw new Error('should not reach here')
    })

    it('list score systems - invalid isActive', async () => {
      try {
        await service.list({ isActive: 'abc' })
      } catch (e) {
        should.equal(e.message.indexOf('"isActive" must be a boolean') >= 0, true)
        return
      }
      throw new Error('should not reach here')
    })

    it('list score systems - unexpected field', async () => {
      try {
        await service.list({ other: 123 })
      } catch (e) {
        should.equal(e.message.indexOf('"other" is not allowed') >= 0, true)
        return
      }
      throw new Error('should not reach here')
    })
  })

  describe('create score system tests', () => {
    it('create score system successfully 1', async () => {
      const result = await service.create(testHelper.mockUser1, {
        name: 'test-name',
        phase: 'test-phase',
        topic: 'test-topic',
        isActive: true
      })
      should.exist(result.id)
      should.equal(result.name, 'test-name')
      should.equal(result.phase, 'test-phase')
      should.equal(result.topic, 'test-topic')
      should.equal(result.isActive, true)
      should.equal(result.createdBy, 'handle')
      should.exist(result.createdAt)

      id = result.id
    })

    it('create score system successfully 2', async () => {
      const result = await service.create(testHelper.mockUser2, {
        name: 'test-name',
        phase: 'test-phase',
        topic: 'test-topic'
      })
      should.exist(result.id)
      should.equal(result.name, 'test-name')
      should.equal(result.phase, 'test-phase')
      should.equal(result.topic, 'test-topic')
      should.equal(result.isActive, false) // default value is false
      should.equal(result.createdBy, 'sub')
      should.exist(result.createdAt)
    })

    it('create score system - null authUser', async () => {
      try {
        await service.create(null, {
          name: 'test-name',
          phase: 'test-phase',
          topic: 'test-topic',
          isActive: false
        })
      } catch (e) {
        should.equal(e.message.indexOf('"authUser" must be an object') >= 0, true)
        return
      }
      throw new Error('should not reach here')
    })

    it('create score system - missing name', async () => {
      try {
        await service.create(testHelper.mockUser1, {
          phase: 'test-phase',
          topic: 'test-topic',
          isActive: false
        })
      } catch (e) {
        should.equal(e.message.indexOf('"name" is required') >= 0, true)
        return
      }
      throw new Error('should not reach here')
    })

    it('create score system - empty name', async () => {
      try {
        await service.create(testHelper.mockUser1, {
          name: '',
          phase: 'test-phase',
          topic: 'test-topic',
          isActive: false
        })
      } catch (e) {
        should.equal(e.message.indexOf('"name" is not allowed to be empty') >= 0, true)
        return
      }
      throw new Error('should not reach here')
    })

    it('create score system - invalid name', async () => {
      try {
        await service.create(testHelper.mockUser1, {
          name: ['test-name'],
          phase: 'test-phase',
          topic: 'test-topic',
          isActive: false
        })
      } catch (e) {
        should.equal(e.message.indexOf('"name" must be a string') >= 0, true)
        return
      }
      throw new Error('should not reach here')
    })

    it('create score system - missing phase', async () => {
      try {
        await service.create(testHelper.mockUser1, {
          name: 'test',
          topic: 'test-topic',
          isActive: false
        })
      } catch (e) {
        should.equal(e.message.indexOf('"phase" is required') >= 0, true)
        return
      }
      throw new Error('should not reach here')
    })

    it('create score system - null topic', async () => {
      try {
        await service.create(testHelper.mockUser1, {
          name: 'test',
          phase: 'test',
          topic: null,
          isActive: true
        })
      } catch (e) {
        should.equal(e.message.indexOf('"topic" must be a string') >= 0, true)
        return
      }
      throw new Error('should not reach here')
    })

    it('create score system - invalid isActive', async () => {
      try {
        await service.create(testHelper.mockUser1, {
          name: 'test',
          phase: 'test',
          topic: 'test',
          isActive: 'abc'
        })
      } catch (e) {
        should.equal(e.message.indexOf('"isActive" must be a boolean') >= 0, true)
        return
      }
      throw new Error('should not reach here')
    })

    it('create score system - unexpected field', async () => {
      try {
        await service.create(testHelper.mockUser1, {
          name: 'test-name',
          phase: 'test-phase',
          topic: 'test-topic',
          isActive: false,
          other: 123
        })
      } catch (e) {
        should.equal(e.message.indexOf('"other" is not allowed') >= 0, true)
        return
      }
      throw new Error('should not reach here')
    })
  })

  describe('get score system tests', () => {
    it('get score system successfully', async () => {
      const result = await service.getEntity(id)
      should.equal(result.id, id)
      should.equal(result.name, 'test-name')
      should.equal(result.phase, 'test-phase')
      should.equal(result.topic, 'test-topic')
      should.equal(result.isActive, true)
      should.equal(result.createdBy, 'handle')
      should.exist(result.createdAt)
    })

    it('get score system - not found', async () => {
      await service.getEntity(testHelper.notFoundId).should.be.rejectedWith(
        `${config.AMAZON.DYNAMODB_SCORE_SYSTEM_TABLE} with id: ${testHelper.notFoundId} doesn't exist`)
    })

    it('get score system - null id', async () => {
      try {
        await service.getEntity(null)
      } catch (e) {
        should.equal(e.message.indexOf('"id" must be a string') >= 0, true)
        return
      }
      throw new Error('should not reach here')
    })

    it('get score system - undefined id', async () => {
      try {
        await service.getEntity()
      } catch (e) {
        should.equal(e.message.indexOf('"id" is required') >= 0, true)
        return
      }
      throw new Error('should not reach here')
    })

    it('get score system - empty id', async () => {
      try {
        await service.getEntity('')
      } catch (e) {
        should.equal(e.message.indexOf('"id" is not allowed to be empty') >= 0, true)
        return
      }
      throw new Error('should not reach here')
    })

    it('get score system - invalid id', async () => {
      try {
        await service.getEntity('invalid')
      } catch (e) {
        should.equal(e.message.indexOf('"id" must be a valid GUID') >= 0, true)
        return
      }
      throw new Error('should not reach here')
    })
  })

  describe('update score system tests', () => {
    it('update score system successfully 1', async () => {
      const result = await service.update(testHelper.mockUser1, id, {
        name: 'test-name2',
        phase: 'test-phase2',
        topic: 'test-topic2'
      })
      should.equal(result.id, id)
      should.equal(result.name, 'test-name2')
      should.equal(result.phase, 'test-phase2')
      should.equal(result.topic, 'test-topic2')
      should.equal(result.isActive, false) // default value is false
      should.equal(result.createdBy, 'handle')
      should.exist(result.createdAt)
      should.equal(result.updatedBy, 'handle')
      should.exist(result.updatedAt)
    })

    it('update score system successfully 2', async () => {
      const result = await service.update(testHelper.mockUser2, id, {
        name: 'test-name3',
        phase: 'test-phase3',
        topic: 'test-topic3',
        isActive: true
      })
      should.equal(result.id, id)
      should.equal(result.name, 'test-name3')
      should.equal(result.phase, 'test-phase3')
      should.equal(result.topic, 'test-topic3')
      should.equal(result.isActive, true)
      should.equal(result.createdBy, 'handle')
      should.exist(result.createdAt)
      should.equal(result.updatedBy, 'sub')
      should.exist(result.updatedAt)
    })

    it('update score system - not found', async () => {
      await service.update(testHelper.mockUser1, testHelper.notFoundId, {
        name: 'test-name3',
        phase: 'test-phase3',
        topic: 'test-topic3'
      }).should.be.rejectedWith(
        `${config.AMAZON.DYNAMODB_SCORE_SYSTEM_TABLE} with id: ${testHelper.notFoundId} doesn't exist`)
    })

    it('update score system - invalid id', async () => {
      try {
        await service.update(testHelper.mockUser2, 'invalid', {
          name: 'test-name3',
          phase: 'test-phase3',
          topic: 'test-topic3'
        })
      } catch (e) {
        should.equal(e.message.indexOf('"id" must be a valid GUID') >= 0, true)
        return
      }
      throw new Error('should not reach here')
    })

    it('update score system - empty id', async () => {
      try {
        await service.update(testHelper.mockUser2, '', {
          name: 'test-name3',
          phase: 'test-phase3',
          topic: 'test-topic3'
        })
      } catch (e) {
        should.equal(e.message.indexOf('"id" is not allowed to be empty') >= 0, true)
        return
      }
      throw new Error('should not reach here')
    })

    it('update score system - undefined authUser', async () => {
      try {
        await service.update(undefined, id, {
          name: 'test-name',
          phase: 'test-phase',
          topic: 'test-topic',
          isActive: false
        })
      } catch (e) {
        should.equal(e.message.indexOf('"authUser" is required') >= 0, true)
        return
      }
      throw new Error('should not reach here')
    })

    it('update score system - missing name', async () => {
      try {
        await service.update(testHelper.mockUser1, id, {
          phase: 'test-phase',
          topic: 'test-topic',
          isActive: false
        })
      } catch (e) {
        should.equal(e.message.indexOf('"name" is required') >= 0, true)
        return
      }
      throw new Error('should not reach here')
    })

    it('update score system - invalid name', async () => {
      try {
        await service.update(testHelper.mockUser1, id, {
          name: ['test-name'],
          phase: 'test-phase',
          topic: 'test-topic',
          isActive: false
        })
      } catch (e) {
        should.equal(e.message.indexOf('"name" must be a string') >= 0, true)
        return
      }
      throw new Error('should not reach here')
    })

    it('update score system - missing phase', async () => {
      try {
        await service.update(testHelper.mockUser1, id, {
          name: 'test',
          topic: 'test-topic',
          isActive: false
        })
      } catch (e) {
        should.equal(e.message.indexOf('"phase" is required') >= 0, true)
        return
      }
      throw new Error('should not reach here')
    })

    it('update score system - empty phase', async () => {
      try {
        await service.update(testHelper.mockUser1, id, {
          name: 'test',
          phase: '',
          topic: 'test-topic',
          isActive: false
        })
      } catch (e) {
        should.equal(e.message.indexOf('"phase" is not allowed to be empty') >= 0, true)
        return
      }
      throw new Error('should not reach here')
    })

    it('update score system - null topic', async () => {
      try {
        await service.update(testHelper.mockUser1, id, {
          name: 'test',
          phase: 'test',
          topic: null,
          isActive: true
        })
      } catch (e) {
        should.equal(e.message.indexOf('"topic" must be a string') >= 0, true)
        return
      }
      throw new Error('should not reach here')
    })

    it('update score system - missing topic', async () => {
      try {
        await service.update(testHelper.mockUser1, id, {
          name: 'test',
          phase: 'test',
          isActive: false
        })
      } catch (e) {
        should.equal(e.message.indexOf('"topic" is required') >= 0, true)
        return
      }
      throw new Error('should not reach here')
    })

    it('update score system - invalid isActive', async () => {
      try {
        await service.update(testHelper.mockUser1, id, {
          name: 'test',
          phase: 'test',
          topic: 'test',
          isActive: 'abc'
        })
      } catch (e) {
        should.equal(e.message.indexOf('"isActive" must be a boolean') >= 0, true)
        return
      }
      throw new Error('should not reach here')
    })

    it('update score system - unexpected field', async () => {
      try {
        await service.update(testHelper.mockUser1, id, {
          name: 'test-name',
          phase: 'test-phase',
          topic: 'test-topic',
          isActive: false,
          other: 123
        })
      } catch (e) {
        should.equal(e.message.indexOf('"other" is not allowed') >= 0, true)
        return
      }
      throw new Error('should not reach here')
    })
  })

  describe('partially update score system tests', () => {
    it('partially update score system successfully 1', async () => {
      const result = await service.partiallyUpdate(testHelper.mockUser1, id, {
        name: 'test-name4',
        phase: 'test-phase4',
        topic: 'test-topic4'
      })
      should.equal(result.id, id)
      should.equal(result.name, 'test-name4')
      should.equal(result.phase, 'test-phase4')
      should.equal(result.topic, 'test-topic4')
      should.equal(result.isActive, true) // not changed
      should.equal(result.createdBy, 'handle')
      should.exist(result.createdAt)
      should.equal(result.updatedBy, 'handle')
      should.exist(result.updatedAt)
    })

    it('partially update score system successfully 2', async () => {
      const result = await service.partiallyUpdate(testHelper.mockUser2, id, {
        topic: 'test-topic5',
        isActive: false
      })
      should.equal(result.id, id)
      should.equal(result.name, 'test-name4')
      should.equal(result.phase, 'test-phase4')
      should.equal(result.topic, 'test-topic5')
      should.equal(result.isActive, false)
      should.equal(result.createdBy, 'handle')
      should.exist(result.createdAt)
      should.equal(result.updatedBy, 'sub')
      should.exist(result.updatedAt)
    })

    it('partially update score system - not found', async () => {
      await service.partiallyUpdate(testHelper.mockUser1, testHelper.notFoundId, {
        name: 'test-name3'
      }).should.be.rejectedWith(
        `${config.AMAZON.DYNAMODB_SCORE_SYSTEM_TABLE} with id: ${testHelper.notFoundId} doesn't exist`)
    })

    it('partially update score system - invalid id', async () => {
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

    it('partially update score system - empty id', async () => {
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

    it('partially update score system - undefined authUser', async () => {
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

    it('partially update score system - invalid name', async () => {
      try {
        await service.partiallyUpdate(testHelper.mockUser1, id, {
          name: ['test-name'],
          phase: 'test-phase',
          topic: 'test-topic',
          isActive: false
        })
      } catch (e) {
        should.equal(e.message.indexOf('"name" must be a string') >= 0, true)
        return
      }
      throw new Error('should not reach here')
    })

    it('partially update score system - empty phase', async () => {
      try {
        await service.partiallyUpdate(testHelper.mockUser1, id, {
          name: 'test',
          phase: ''
        })
      } catch (e) {
        should.equal(e.message.indexOf('"phase" is not allowed to be empty') >= 0, true)
        return
      }
      throw new Error('should not reach here')
    })

    it('partially update score system - null topic', async () => {
      try {
        await service.partiallyUpdate(testHelper.mockUser1, id, {
          topic: null
        })
      } catch (e) {
        should.equal(e.message.indexOf('"topic" must be a string') >= 0, true)
        return
      }
      throw new Error('should not reach here')
    })

    it('partially update score system - invalid isActive', async () => {
      try {
        await service.partiallyUpdate(testHelper.mockUser1, id, {
          isActive: 'abc'
        })
      } catch (e) {
        should.equal(e.message.indexOf('"isActive" must be a boolean') >= 0, true)
        return
      }
      throw new Error('should not reach here')
    })

    it('partially update score system - unexpected field', async () => {
      try {
        await service.partiallyUpdate(testHelper.mockUser1, id, {
          name: 'test-name',
          phase: 'test-phase',
          topic: 'test-topic',
          isActive: false,
          other: 123
        })
      } catch (e) {
        should.equal(e.message.indexOf('"other" is not allowed') >= 0, true)
        return
      }
      throw new Error('should not reach here')
    })
  })

  describe('remove score system tests', () => {
    it('remove score system successfully', async () => {
      await service.remove(id)
    })

    it('remove score system - not found', async () => {
      await service.remove(id).should.be.rejectedWith(
        `${config.AMAZON.DYNAMODB_SCORE_SYSTEM_TABLE} with id: ${id} doesn't exist`)
    })

    it('remove score system - invalid id', async () => {
      try {
        await service.remove('invalid')
      } catch (e) {
        should.equal(e.message.indexOf('"id" must be a valid GUID') >= 0, true)
        return
      }
      throw new Error('should not reach here')
    })

    it('remove score system - empty id', async () => {
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
