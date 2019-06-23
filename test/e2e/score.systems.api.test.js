/*
 * E2E tests of score systems APIs
 */

// During the test the env variable is set to test
process.env.NODE_ENV = 'test'

require('../../app-bootstrap')
const _ = require('lodash')
const config = require('config')
const chai = require('chai')
const chaiHttp = require('chai-http')
const testHelper = require('../testHelper')
const app = require('../../app')

const should = chai.should()
chai.use(chaiHttp)
chai.use(require('chai-as-promised'))

const basePath = `${config.API_VERSION}/scoreSystems`

describe('E2E tests for score systems APIs', () => {
  // created entity id
  let id

  before(async () => {
    await testHelper.clearData()
    await testHelper.insertTestData()
  })

  after(async () => {
    await testHelper.clearData()
  })

  describe('list score systems API tests', () => {
    it('list score systems API - success 1', async () => {
      const response = await chai.request(app)
        .get(basePath)
        .set('Authorization', `Bearer ${config.COPILOT_TOKEN}`)
      should.equal(response.status, 200)
      should.equal(response.body.length, 3)
      for (let i = 1; i <= 3; i += 1) {
        const name = `system${i}`
        const record = _.find(response.body, (item) => item.name === name)
        should.exist(record)
        should.exist(record.id)
        should.equal(record.phase, `phase${i}`)
        should.equal(record.topic, `topic${i}`)
        should.equal(record.isActive, i <= 2)
        should.equal(record.createdBy, 'test')
        should.exist(record.createdAt)
      }
    })

    it('list score systems API - success 2', async () => {
      const response = await chai.request(app)
        .get(basePath)
        .set('Authorization', `Bearer ${config.USER_TOKEN}`)
        .query({
          page: 1, // ignored
          perPage: 10, // ignored
          name: 'STEM1',
          phase: 'phase',
          topic: 'TOPic1',
          isActive: true
        })
      should.equal(response.status, 200)
      const result = response.body
      should.equal(result.length, 1)
      should.exist(result[0].id)
      should.equal(result[0].name, 'system1')
      should.equal(result[0].phase, 'phase1')
      should.equal(result[0].topic, 'topic1')
      should.equal(result[0].isActive, true)
      should.equal(result[0].createdBy, 'test')
      should.exist(result[0].createdAt)
    })

    it('list score systems API - success 3', async () => {
      const response = await chai.request(app)
        .get(basePath)
        .set('Authorization', `Bearer ${config.ADMIN_TOKEN}`)
        .query({
          page: null, // ignored
          topic: 'TOPIC',
          isActive: false
        })
      should.equal(response.status, 200)
      const result = response.body
      should.equal(result.length, 1)
      should.exist(result[0].id)
      should.equal(result[0].name, 'system3')
      should.equal(result[0].phase, 'phase3')
      should.equal(result[0].topic, 'topic3')
      should.equal(result[0].isActive, false)
      should.equal(result[0].createdBy, 'test')
      should.exist(result[0].createdAt)
    })

    it('list score systems API - success 4', async () => {
      const response = await chai.request(app)
        .get(basePath)
        .set('Authorization', `Bearer ${config.M2M_READ_ACCESS_TOKEN}`)
        .query({
          topic: 'not-found',
          isActive: false
        })
      should.equal(response.status, 200)
      const result = response.body
      should.equal(result.length, 0)
    })

    it('list score systems API - missing token', async () => {
      const response = await chai.request(app)
        .get(basePath)
      should.equal(response.status, 401)
      should.equal(response.body.message, 'No token provided.')
    })

    it('list score systems API - invalid bearer format', async () => {
      const response = await chai.request(app)
        .get(basePath)
        .set('Authorization', 'invalid format')
      should.equal(response.status, 401)
      should.equal(response.body.message, 'No token provided.')
    })

    it('list score systems API - invalid token', async () => {
      const response = await chai.request(app)
        .get(basePath)
        .set('Authorization', `Bearer ${config.INVALID_TOKEN}`)
      should.equal(response.status, 401)
      should.equal(response.body.message, 'Failed to authenticate token.')
    })

    it('list score systems API - expired token', async () => {
      const response = await chai.request(app)
        .get(basePath)
        .set('Authorization', `Bearer ${config.EXPIRED_TOKEN}`)
      should.equal(response.status, 401)
      should.equal(response.body.message, 'Failed to authenticate token.')
    })

    it('list score systems API - not allowed token', async () => {
      const response = await chai.request(app)
        .get(basePath)
        .set('Authorization', `Bearer ${config.M2M_UPDATE_ACCESS_TOKEN}`)
      should.equal(response.status, 403)
      should.equal(response.body.message, 'You are not allowed to perform this action!')
    })

    it('list score systems API - empty name', async () => {
      const response = await chai.request(app)
        .get(basePath)
        .set('Authorization', `Bearer ${config.ADMIN_TOKEN}`)
        .query({ name: '' })
      should.equal(response.status, 400)
      should.equal(response.body.message, '"name" is not allowed to be empty')
    })

    it('list score systems API - empty topic', async () => {
      const response = await chai.request(app)
        .get(basePath)
        .set('Authorization', `Bearer ${config.ADMIN_TOKEN}`)
        .query({ topic: '' })
      should.equal(response.status, 400)
      should.equal(response.body.message, '"topic" is not allowed to be empty')
    })

    it('list score systems API - invalid isActive', async () => {
      const response = await chai.request(app)
        .get(basePath)
        .set('Authorization', `Bearer ${config.ADMIN_TOKEN}`)
        .query({ isActive: 'abc' })
      should.equal(response.status, 400)
      should.equal(response.body.message, '"isActive" must be a boolean')
    })

    it('list score systems API - unexpected field', async () => {
      const response = await chai.request(app)
        .get(basePath)
        .set('Authorization', `Bearer ${config.ADMIN_TOKEN}`)
        .query({ other: 123 })
      should.equal(response.status, 400)
      should.equal(response.body.message, '"other" is not allowed')
    })
  })

  describe('list score systems head API tests', () => {
    it('list score systems head API - success 1', async () => {
      const response = await chai.request(app)
        .head(basePath)
        .set('Authorization', `Bearer ${config.COPILOT_TOKEN}`)
      should.equal(response.status, 200)
      should.equal(_.isEmpty(response.body), true)
    })

    it('list score systems head API - success 2', async () => {
      const response = await chai.request(app)
        .head(basePath)
        .set('Authorization', `Bearer ${config.USER_TOKEN}`)
        .query({
          page: 1, // ignored
          perPage: 10, // ignored
          name: 'STEM1',
          phase: 'phase',
          topic: 'TOPic1',
          isActive: true
        })
      should.equal(response.status, 200)
      should.equal(_.isEmpty(response.body), true)
    })

    it('list score systems head API - success 3', async () => {
      const response = await chai.request(app)
        .head(basePath)
        .set('Authorization', `Bearer ${config.ADMIN_TOKEN}`)
        .query({
          page: null, // ignored
          topic: 'TOPIC',
          isActive: false
        })
      should.equal(response.status, 200)
      should.equal(_.isEmpty(response.body), true)
    })

    it('list score systems head API - success 4', async () => {
      const response = await chai.request(app)
        .head(basePath)
        .set('Authorization', `Bearer ${config.M2M_READ_ACCESS_TOKEN}`)
        .query({
          topic: 'not-found',
          isActive: false
        })
      should.equal(response.status, 200)
      should.equal(_.isEmpty(response.body), true)
    })

    it('list score systems head API - invalid isActive', async () => {
      const response = await chai.request(app)
        .head(basePath)
        .set('Authorization', `Bearer ${config.ADMIN_TOKEN}`)
        .query({ isActive: 'abc' })
      should.equal(response.status, 400)
      should.equal(_.isEmpty(response.body), true)
    })

    it('list score systems head API - missing token', async () => {
      const response = await chai.request(app)
        .head(basePath)
      should.equal(response.status, 401)
      should.equal(_.isEmpty(response.body), true)
    })

    it('list score systems head API - invalid bearer format', async () => {
      const response = await chai.request(app)
        .head(basePath)
        .set('Authorization', 'invalid format')
      should.equal(response.status, 401)
      should.equal(_.isEmpty(response.body), true)
    })

    it('list score systems head API - invalid token', async () => {
      const response = await chai.request(app)
        .head(basePath)
        .set('Authorization', `Bearer ${config.INVALID_TOKEN}`)
      should.equal(response.status, 401)
      should.equal(_.isEmpty(response.body), true)
    })

    it('list score systems head API - expired token', async () => {
      const response = await chai.request(app)
        .head(basePath)
        .set('Authorization', `Bearer ${config.EXPIRED_TOKEN}`)
      should.equal(response.status, 401)
      should.equal(_.isEmpty(response.body), true)
    })

    it('list score systems head API - not allowed token', async () => {
      const response = await chai.request(app)
        .head(basePath)
        .set('Authorization', `Bearer ${config.M2M_UPDATE_ACCESS_TOKEN}`)
      should.equal(response.status, 403)
      should.equal(_.isEmpty(response.body), true)
    })

    it('list score systems head API - empty name', async () => {
      const response = await chai.request(app)
        .head(basePath)
        .set('Authorization', `Bearer ${config.ADMIN_TOKEN}`)
        .query({ name: '' })
      should.equal(response.status, 400)
      should.equal(_.isEmpty(response.body), true)
    })

    it('list score systems head API - empty topic', async () => {
      const response = await chai.request(app)
        .head(basePath)
        .set('Authorization', `Bearer ${config.ADMIN_TOKEN}`)
        .query({ topic: '' })
      should.equal(response.status, 400)
      should.equal(_.isEmpty(response.body), true)
    })

    it('list score systems head API - unexpected field', async () => {
      const response = await chai.request(app)
        .head(basePath)
        .set('Authorization', `Bearer ${config.ADMIN_TOKEN}`)
        .query({ other: 123 })
      should.equal(response.status, 400)
      should.equal(_.isEmpty(response.body), true)
    })
  })

  describe('create score system API tests', () => {
    it('create score system API - success 1', async () => {
      const response = await chai.request(app)
        .post(basePath)
        .set('Authorization', `Bearer ${config.M2M_FULL_ACCESS_TOKEN}`)
        .send({
          name: 'test-name',
          phase: 'test-phase',
          topic: 'test-topic',
          isActive: true
        })
      should.equal(response.status, 201)
      const result = response.body
      should.exist(result.id)
      should.equal(result.name, 'test-name')
      should.equal(result.phase, 'test-phase')
      should.equal(result.topic, 'test-topic')
      should.equal(result.isActive, true)
      should.equal(result.createdBy, 'test')
      should.exist(result.createdAt)

      id = result.id
    })

    it('create score system API - success 2', async () => {
      const response = await chai.request(app)
        .post(basePath)
        .set('Authorization', `Bearer ${config.ADMIN_TOKEN}`)
        .send({
          name: 'test-name',
          phase: 'test-phase',
          topic: 'test-topic'
        })
      should.equal(response.status, 201)
      const result = response.body
      should.exist(result.id)
      should.equal(result.name, 'test-name')
      should.equal(result.phase, 'test-phase')
      should.equal(result.topic, 'test-topic')
      should.equal(result.isActive, false) // default value is false
      should.equal(result.createdBy, 'TonyJ')
      should.exist(result.createdAt)
    })

    it('create score system API - forbidden', async () => {
      const response = await chai.request(app)
        .post(basePath)
        .set('Authorization', `Bearer ${config.M2M_READ_ACCESS_TOKEN}`)
        .send({
          name: 'test-name',
          phase: 'test-phase',
          topic: 'test-topic'
        })
      should.equal(response.status, 403)
      should.equal(response.body.message, 'You are not allowed to perform this action!')
    })

    it('create score system API - missing name', async () => {
      const response = await chai.request(app)
        .post(basePath)
        .set('Authorization', `Bearer ${config.M2M_UPDATE_ACCESS_TOKEN}`)
        .send({
          phase: 'test-phase',
          topic: 'test-topic'
        })
      should.equal(response.status, 400)
      should.equal(response.body.message, '"name" is required')
    })

    it('create score system API - empty name', async () => {
      const response = await chai.request(app)
        .post(basePath)
        .set('Authorization', `Bearer ${config.M2M_UPDATE_ACCESS_TOKEN}`)
        .send({
          name: '',
          phase: 'test-phase',
          topic: 'test-topic'
        })
      should.equal(response.status, 400)
      should.equal(response.body.message, '"name" is not allowed to be empty')
    })

    it('create score system API - invalid name', async () => {
      const response = await chai.request(app)
        .post(basePath)
        .set('Authorization', `Bearer ${config.M2M_UPDATE_ACCESS_TOKEN}`)
        .send({
          name: ['test-name'],
          phase: 'test-phase',
          topic: 'test-topic'
        })
      should.equal(response.status, 400)
      should.equal(response.body.message, '"name" must be a string')
    })

    it('create score system API - missing phase', async () => {
      const response = await chai.request(app)
        .post(basePath)
        .set('Authorization', `Bearer ${config.M2M_UPDATE_ACCESS_TOKEN}`)
        .send({
          name: 'test',
          topic: 'test-topic'
        })
      should.equal(response.status, 400)
      should.equal(response.body.message, '"phase" is required')
    })

    it('create score system API - null topic', async () => {
      const response = await chai.request(app)
        .post(basePath)
        .set('Authorization', `Bearer ${config.M2M_UPDATE_ACCESS_TOKEN}`)
        .send({
          name: 'test',
          phase: 'test',
          topic: null
        })
      should.equal(response.status, 400)
      should.equal(response.body.message, '"topic" must be a string')
    })

    it('create score system API - unexpected field', async () => {
      const response = await chai.request(app)
        .post(basePath)
        .set('Authorization', `Bearer ${config.M2M_UPDATE_ACCESS_TOKEN}`)
        .send({
          name: 'test-name',
          phase: 'test-phase',
          topic: 'test-topic',
          other: 123
        })
      should.equal(response.status, 400)
      should.equal(response.body.message, '"other" is not allowed')
    })
  })

  describe('get score system API tests', () => {
    it('get score system API - success', async () => {
      const response = await chai.request(app)
        .get(`${basePath}/${id}`)
        .set('Authorization', `Bearer ${config.USER_TOKEN}`)
      should.equal(response.status, 200)
      const result = response.body
      should.equal(result.id, id)
      should.equal(result.name, 'test-name')
      should.equal(result.phase, 'test-phase')
      should.equal(result.topic, 'test-topic')
      should.equal(result.isActive, true)
      should.equal(result.createdBy, 'test')
      should.exist(result.createdAt)
    })

    it('get score system API - forbidden', async () => {
      const response = await chai.request(app)
        .get(`${basePath}/${id}`)
        .set('Authorization', `Bearer ${config.M2M_UPDATE_ACCESS_TOKEN}`)
      should.equal(response.status, 403)
      should.equal(response.body.message, 'You are not allowed to perform this action!')
    })

    it('get score system API - not found', async () => {
      const response = await chai.request(app)
        .get(`${basePath}/${testHelper.notFoundId}`)
        .set('Authorization', `Bearer ${config.ADMIN_TOKEN}`)
      should.equal(response.status, 404)
      should.equal(response.body.message,
        `${config.AMAZON.DYNAMODB_SCORE_SYSTEM_TABLE} with id: ${testHelper.notFoundId} doesn't exist`)
    })

    it('get score system API - invalid id', async () => {
      const response = await chai.request(app)
        .get(`${basePath}/invalid`)
        .set('Authorization', `Bearer ${config.ADMIN_TOKEN}`)
      should.equal(response.status, 400)
      should.equal(response.body.message, '"id" must be a valid GUID')
    })
  })

  describe('get score system head API tests', () => {
    it('get score system head API - success', async () => {
      const response = await chai.request(app)
        .head(`${basePath}/${id}`)
        .set('Authorization', `Bearer ${config.USER_TOKEN}`)
      should.equal(response.status, 200)
      should.equal(_.isEmpty(response.body), true)
    })

    it('get score system head API - forbidden', async () => {
      const response = await chai.request(app)
        .head(`${basePath}/${id}`)
        .set('Authorization', `Bearer ${config.M2M_UPDATE_ACCESS_TOKEN}`)
      should.equal(response.status, 403)
      should.equal(_.isEmpty(response.body), true)
    })

    it('get score system head API - not found', async () => {
      const response = await chai.request(app)
        .head(`${basePath}/${testHelper.notFoundId}`)
        .set('Authorization', `Bearer ${config.ADMIN_TOKEN}`)
      should.equal(response.status, 404)
      should.equal(_.isEmpty(response.body), true)
    })

    it('get score system head API - invalid id', async () => {
      const response = await chai.request(app)
        .head(`${basePath}/invalid`)
        .set('Authorization', `Bearer ${config.ADMIN_TOKEN}`)
      should.equal(response.status, 400)
      should.equal(_.isEmpty(response.body), true)
    })
  })

  describe('update score system API tests', () => {
    it('update score system API - success 1', async () => {
      const response = await chai.request(app)
        .put(`${basePath}/${id}`)
        .set('Authorization', `Bearer ${config.ADMIN_TOKEN}`)
        .send({
          name: 'test-name2',
          phase: 'test-phase2',
          topic: 'test-topic2'
        })
      should.equal(response.status, 200)
      const result = response.body
      should.equal(result.id, id)
      should.equal(result.name, 'test-name2')
      should.equal(result.phase, 'test-phase2')
      should.equal(result.topic, 'test-topic2')
      should.equal(result.isActive, false) // default value is false
      should.equal(result.createdBy, 'test')
      should.exist(result.createdAt)
      should.equal(result.updatedBy, 'TonyJ')
      should.exist(result.updatedAt)
    })

    it('update score system API - success 2', async () => {
      const response = await chai.request(app)
        .put(`${basePath}/${id}`)
        .set('Authorization', `Bearer ${config.M2M_UPDATE_ACCESS_TOKEN}`)
        .send({
          name: 'test-name3',
          phase: 'test-phase3',
          topic: 'test-topic3',
          isActive: true
        })
      should.equal(response.status, 200)
      const result = response.body
      should.equal(result.id, id)
      should.equal(result.name, 'test-name3')
      should.equal(result.phase, 'test-phase3')
      should.equal(result.topic, 'test-topic3')
      should.equal(result.isActive, true)
      should.equal(result.createdBy, 'test')
      should.exist(result.createdAt)
      should.equal(result.updatedBy, 'test')
      should.exist(result.updatedAt)
    })

    it('update score system API - forbidden', async () => {
      const response = await chai.request(app)
        .put(`${basePath}/${id}`)
        .set('Authorization', `Bearer ${config.COPILOT_TOKEN}`)
        .send({
          name: 'test-name3',
          phase: 'test-phase3',
          topic: 'test-topic3'
        })
      should.equal(response.status, 403)
      should.equal(response.body.message, 'You are not allowed to perform this action!')
    })

    it('update score system API - not found', async () => {
      const response = await chai.request(app)
        .put(`${basePath}/${testHelper.notFoundId}`)
        .set('Authorization', `Bearer ${config.ADMIN_TOKEN}`)
        .send({
          name: 'test-name3',
          phase: 'test-phase3',
          topic: 'test-topic3'
        })
      should.equal(response.status, 404)
      should.equal(response.body.message,
        `${config.AMAZON.DYNAMODB_SCORE_SYSTEM_TABLE} with id: ${testHelper.notFoundId} doesn't exist`)
    })

    it('update score system API - invalid id', async () => {
      const response = await chai.request(app)
        .put(`${basePath}/invalid`)
        .set('Authorization', `Bearer ${config.ADMIN_TOKEN}`)
        .send({
          name: 'test-name3',
          phase: 'test-phase3',
          topic: 'test-topic3'
        })
      should.equal(response.status, 400)
      should.equal(response.body.message, '"id" must be a valid GUID')
    })

    it('update score system API - null name', async () => {
      const response = await chai.request(app)
        .put(`${basePath}/${id}`)
        .set('Authorization', `Bearer ${config.ADMIN_TOKEN}`)
        .send({
          name: null,
          phase: 'test-phase3',
          topic: 'test-topic3'
        })
      should.equal(response.status, 400)
      should.equal(response.body.message, '"name" must be a string')
    })

    it('update score system API - invalid name', async () => {
      const response = await chai.request(app)
        .put(`${basePath}/${id}`)
        .set('Authorization', `Bearer ${config.ADMIN_TOKEN}`)
        .send({
          name: { name: 'test-name3' },
          phase: 'test-phase3',
          topic: 'test-topic3'
        })
      should.equal(response.status, 400)
      should.equal(response.body.message, '"name" must be a string')
    })

    it('update score system API - empty name', async () => {
      const response = await chai.request(app)
        .put(`${basePath}/${id}`)
        .set('Authorization', `Bearer ${config.ADMIN_TOKEN}`)
        .send({
          name: '',
          phase: 'test-phase3',
          topic: 'test-topic3'
        })
      should.equal(response.status, 400)
      should.equal(response.body.message, '"name" is not allowed to be empty')
    })

    it('update score system API - missing phase', async () => {
      const response = await chai.request(app)
        .put(`${basePath}/${id}`)
        .set('Authorization', `Bearer ${config.ADMIN_TOKEN}`)
        .send({
          name: 'test',
          topic: 'test-topic3'
        })
      should.equal(response.status, 400)
      should.equal(response.body.message, '"phase" is required')
    })

    it('update score system API - missing topic', async () => {
      const response = await chai.request(app)
        .put(`${basePath}/${id}`)
        .set('Authorization', `Bearer ${config.ADMIN_TOKEN}`)
        .send({
          name: 'test',
          phase: 'test'
        })
      should.equal(response.status, 400)
      should.equal(response.body.message, '"topic" is required')
    })

    it('update score system API - invalid isActive', async () => {
      const response = await chai.request(app)
        .put(`${basePath}/${id}`)
        .set('Authorization', `Bearer ${config.ADMIN_TOKEN}`)
        .send({
          name: 'test',
          phase: 'test',
          topic: 'test',
          isActive: 'abc'
        })
      should.equal(response.status, 400)
      should.equal(response.body.message, '"isActive" must be a boolean')
    })

    it('update score system API - unexpected field', async () => {
      const response = await chai.request(app)
        .put(`${basePath}/${id}`)
        .set('Authorization', `Bearer ${config.ADMIN_TOKEN}`)
        .send({
          name: 'test',
          phase: 'test',
          topic: 'test',
          other: 'test'
        })
      should.equal(response.status, 400)
      should.equal(response.body.message, '"other" is not allowed')
    })
  })

  describe('partially update score system API tests', () => {
    it('partially update score system API - success 1', async () => {
      const response = await chai.request(app)
        .patch(`${basePath}/${id}`)
        .set('Authorization', `Bearer ${config.M2M_FULL_ACCESS_TOKEN}`)
        .send({
          name: 'test-name4',
          phase: 'test-phase4',
          topic: 'test-topic4'
        })
      should.equal(response.status, 200)
      const result = response.body
      should.equal(result.id, id)
      should.equal(result.name, 'test-name4')
      should.equal(result.phase, 'test-phase4')
      should.equal(result.topic, 'test-topic4')
      should.equal(result.isActive, true) // not changed
      should.equal(result.createdBy, 'test')
      should.exist(result.createdAt)
      should.equal(result.updatedBy, 'test')
      should.exist(result.updatedAt)
    })

    it('partially update score system API - success 2', async () => {
      const response = await chai.request(app)
        .patch(`${basePath}/${id}`)
        .set('Authorization', `Bearer ${config.ADMIN_TOKEN}`)
        .send({
          topic: 'test-topic5',
          isActive: false
        })
      should.equal(response.status, 200)
      const result = response.body
      should.equal(result.id, id)
      should.equal(result.name, 'test-name4')
      should.equal(result.phase, 'test-phase4')
      should.equal(result.topic, 'test-topic5')
      should.equal(result.isActive, false)
      should.equal(result.createdBy, 'test')
      should.exist(result.createdAt)
      should.equal(result.updatedBy, 'TonyJ')
      should.exist(result.updatedAt)
    })

    it('partially update score system API - forbidden', async () => {
      const response = await chai.request(app)
        .patch(`${basePath}/${id}`)
        .set('Authorization', `Bearer ${config.M2M_READ_ACCESS_TOKEN}`)
        .send({ name: 'testing2' })
      should.equal(response.status, 403)
      should.equal(response.body.message, 'You are not allowed to perform this action!')
    })

    it('partially update score system API - not found', async () => {
      const response = await chai.request(app)
        .patch(`${basePath}/${testHelper.notFoundId}`)
        .set('Authorization', `Bearer ${config.ADMIN_TOKEN}`)
        .send({ name: 'testing2' })
      should.equal(response.status, 404)
      should.equal(response.body.message,
        `${config.AMAZON.DYNAMODB_SCORE_SYSTEM_TABLE} with id: ${testHelper.notFoundId} doesn't exist`)
    })

    it('partially update score system API - invalid id', async () => {
      const response = await chai.request(app)
        .patch(`${basePath}/invalid`)
        .set('Authorization', `Bearer ${config.ADMIN_TOKEN}`)
        .send({
          name: 'test-name3',
          phase: 'test-phase3',
          topic: 'test-topic3'
        })
      should.equal(response.status, 400)
      should.equal(response.body.message, '"id" must be a valid GUID')
    })

    it('partially update score system API - null name', async () => {
      const response = await chai.request(app)
        .patch(`${basePath}/${id}`)
        .set('Authorization', `Bearer ${config.ADMIN_TOKEN}`)
        .send({
          name: null
        })
      should.equal(response.status, 400)
      should.equal(response.body.message, '"name" must be a string')
    })

    it('partially update score system API - invalid name', async () => {
      const response = await chai.request(app)
        .patch(`${basePath}/${id}`)
        .set('Authorization', `Bearer ${config.ADMIN_TOKEN}`)
        .send({
          name: { name: 'test-name3' },
          topic: 'test-topic3'
        })
      should.equal(response.status, 400)
      should.equal(response.body.message, '"name" must be a string')
    })

    it('partially update score system API - empty name', async () => {
      const response = await chai.request(app)
        .patch(`${basePath}/${id}`)
        .set('Authorization', `Bearer ${config.ADMIN_TOKEN}`)
        .send({
          name: '',
          topic: 'test-topic3'
        })
      should.equal(response.status, 400)
      should.equal(response.body.message, '"name" is not allowed to be empty')
    })

    it('partially update score system API - invalid isActive', async () => {
      const response = await chai.request(app)
        .patch(`${basePath}/${id}`)
        .set('Authorization', `Bearer ${config.ADMIN_TOKEN}`)
        .send({
          name: 'test',
          phase: 'test',
          topic: 'test',
          isActive: 'abc'
        })
      should.equal(response.status, 400)
      should.equal(response.body.message, '"isActive" must be a boolean')
    })

    it('partially update score system API - unexpected field', async () => {
      const response = await chai.request(app)
        .patch(`${basePath}/${id}`)
        .set('Authorization', `Bearer ${config.ADMIN_TOKEN}`)
        .send({
          name: 'test',
          phase: 'test',
          topic: 'test',
          other: 'test'
        })
      should.equal(response.status, 400)
      should.equal(response.body.message, '"other" is not allowed')
    })
  })

  describe('remove score system API tests', () => {
    it('remove score system API - forbidden', async () => {
      const response = await chai.request(app)
        .delete(`${basePath}/${id}`)
        .set('Authorization', `Bearer ${config.USER_TOKEN}`)
      should.equal(response.status, 403)
      should.equal(response.body.message, 'You are not allowed to perform this action!')
    })

    it('remove score system API - success', async () => {
      const response = await chai.request(app)
        .delete(`${basePath}/${id}`)
        .set('Authorization', `Bearer ${config.ADMIN_TOKEN}`)
      should.equal(response.status, 204)
      should.equal(_.isEmpty(response.body), true)
    })

    it('remove score system API - not found', async () => {
      const response = await chai.request(app)
        .delete(`${basePath}/${id}`)
        .set('Authorization', `Bearer ${config.M2M_UPDATE_ACCESS_TOKEN}`)
      should.equal(response.status, 404)
      should.equal(response.body.message, `${config.AMAZON.DYNAMODB_SCORE_SYSTEM_TABLE} with id: ${id} doesn't exist`)
    })

    it('remove score system API - invalid id', async () => {
      const response = await chai.request(app)
        .delete(`${basePath}/invalid`)
        .set('Authorization', `Bearer ${config.M2M_UPDATE_ACCESS_TOKEN}`)
      should.equal(response.status, 400)
      should.equal(response.body.message, '"id" must be a valid GUID')
    })
  })
})
