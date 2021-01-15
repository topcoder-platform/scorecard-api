/*
 * E2E tests of scorecards APIs
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
const constants = require('../../app-constants')

const should = chai.should()
chai.use(chaiHttp)
chai.use(require('chai-as-promised'))

const basePath = `${config.API_VERSION}/scorecards`

describe('E2E tests for scorecards APIs', () => {
  // created entity id
  let id

  before(async () => {
    await testHelper.clearData()
    await testHelper.insertTestData()
  })

  after(async () => {
    await testHelper.clearData()
  })

  describe('list scorecards API tests', () => {
    it('list scorecards API - success 1', async () => {
      const response = await chai.request(app)
        .get(basePath)
        .set('Authorization', `Bearer ${config.COPILOT_TOKEN}`)
      should.equal(response.status, 200)
      const result = response.body
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

    it('list scorecards API - success 2', async () => {
      const response = await chai.request(app)
        .get(basePath)
        .set('Authorization', `Bearer ${config.USER_TOKEN}`)
        .query({
          page: 1, // ignored
          perPage: 10, // ignored
          name: 'recard3'
        })
      should.equal(response.status, 200)
      const result = response.body
      should.equal(result.length, 1)
      should.exist(result[0].id)
      should.equal(result[0].name, 'scorecard3')
      should.equal(result[0].createdBy, 'test')
      should.exist(result[0].createdAt)
      const details = result[0].scorecardDetails || []
      should.equal(details.length, 0)
    })

    it('list scorecards API - success 3', async () => {
      const response = await chai.request(app)
        .get(basePath)
        .set('Authorization', `Bearer ${config.ADMIN_TOKEN}`)
        .query({
          page: null, // ignored
          name: 'Scorecard'
        })
      should.equal(response.status, 200)
      const result = response.body
      should.equal(result.length, 0)
    })

    it('list scorecards API - missing token', async () => {
      const response = await chai.request(app)
        .get(basePath)
      should.equal(response.status, 401)
      should.equal(response.body.message, 'No token provided.')
    })

    it('list scorecards API - invalid bearer format', async () => {
      const response = await chai.request(app)
        .get(basePath)
        .set('Authorization', 'invalid format')
      should.equal(response.status, 401)
      should.equal(response.body.message, 'No token provided.')
    })

    it('list scorecards API - invalid token', async () => {
      const response = await chai.request(app)
        .get(basePath)
        .set('Authorization', `Bearer ${config.INVALID_TOKEN}`)
      should.equal(response.status, 401)
      should.equal(response.body.message, 'Failed to authenticate token.')
    })

    it('list scorecards API - expired token', async () => {
      const response = await chai.request(app)
        .get(basePath)
        .set('Authorization', `Bearer ${config.EXPIRED_TOKEN}`)
      should.equal(response.status, 401)
      should.equal(response.body.message, 'Failed to authenticate token.')
    })

    it('list scorecards API - not allowed token', async () => {
      const response = await chai.request(app)
        .get(basePath)
        .set('Authorization', `Bearer ${config.M2M_UPDATE_ACCESS_TOKEN}`)
      should.equal(response.status, 403)
      should.equal(response.body.message, 'You are not allowed to perform this action!')
    })

    it('list scorecards API - empty name', async () => {
      const response = await chai.request(app)
        .get(basePath)
        .set('Authorization', `Bearer ${config.ADMIN_TOKEN}`)
        .query({ name: '' })
      should.equal(response.status, 400)
      should.equal(response.body.message, '"name" is not allowed to be empty')
    })

    it('list scorecards API - unexpected field', async () => {
      const response = await chai.request(app)
        .get(basePath)
        .set('Authorization', `Bearer ${config.ADMIN_TOKEN}`)
        .query({ other: 123 })
      should.equal(response.status, 400)
      should.equal(response.body.message, '"other" is not allowed')
    })
  })

  describe('list scorecards head API tests', () => {
    it('list scorecards head API - success 1', async () => {
      const response = await chai.request(app)
        .head(basePath)
        .set('Authorization', `Bearer ${config.COPILOT_TOKEN}`)
      should.equal(response.status, 200)
      should.equal(_.isEmpty(response.body), true)
    })

    it('list scorecards head API - success 2', async () => {
      const response = await chai.request(app)
        .head(basePath)
        .set('Authorization', `Bearer ${config.USER_TOKEN}`)
        .query({
          page: 1, // ignored
          perPage: 10, // ignored
          name: 'recard3'
        })
      should.equal(response.status, 200)
      should.equal(_.isEmpty(response.body), true)
    })

    it('list scorecards head API - success 3', async () => {
      const response = await chai.request(app)
        .head(basePath)
        .set('Authorization', `Bearer ${config.ADMIN_TOKEN}`)
        .query({
          page: null, // ignored
          name: 'Scorecard'
        })
      should.equal(response.status, 200)
      should.equal(_.isEmpty(response.body), true)
    })

    it('list scorecards head API - missing token', async () => {
      const response = await chai.request(app)
        .head(basePath)
      should.equal(response.status, 401)
      should.equal(_.isEmpty(response.body), true)
    })

    it('list scorecards head API - invalid bearer format', async () => {
      const response = await chai.request(app)
        .head(basePath)
        .set('Authorization', 'invalid format')
      should.equal(response.status, 401)
      should.equal(_.isEmpty(response.body), true)
    })

    it('list scorecards head API - invalid token', async () => {
      const response = await chai.request(app)
        .head(basePath)
        .set('Authorization', `Bearer ${config.INVALID_TOKEN}`)
      should.equal(response.status, 401)
      should.equal(_.isEmpty(response.body), true)
    })

    it('list scorecards head API - expired token', async () => {
      const response = await chai.request(app)
        .head(basePath)
        .set('Authorization', `Bearer ${config.EXPIRED_TOKEN}`)
      should.equal(response.status, 401)
      should.equal(_.isEmpty(response.body), true)
    })

    it('list scorecards head API - not allowed token', async () => {
      const response = await chai.request(app)
        .head(basePath)
        .set('Authorization', `Bearer ${config.M2M_UPDATE_ACCESS_TOKEN}`)
      should.equal(response.status, 403)
      should.equal(_.isEmpty(response.body), true)
    })

    it('list scorecards head API - empty name', async () => {
      const response = await chai.request(app)
        .head(basePath)
        .set('Authorization', `Bearer ${config.ADMIN_TOKEN}`)
        .query({ name: '' })
      should.equal(response.status, 400)
      should.equal(_.isEmpty(response.body), true)
    })

    it('list scorecards head API - unexpected field', async () => {
      const response = await chai.request(app)
        .head(basePath)
        .set('Authorization', `Bearer ${config.ADMIN_TOKEN}`)
        .query({ other: 123 })
      should.equal(response.status, 400)
      should.equal(_.isEmpty(response.body), true)
    })
  })

  describe('create scorecard API tests', () => {
    it('create scorecard API - success 1', async () => {
      const response = await chai.request(app)
        .post(basePath)
        .set('Authorization', `Bearer ${config.M2M_FULL_ACCESS_TOKEN}`)
        .send({
          name: 'test-name',
          scorecardDetails: [{
            scoreSystemId: testHelper.scoreSystemId1,
            weight: 80
          }]
        })
      should.equal(response.status, 201)
      const result = response.body
      should.exist(result.id)
      should.equal(result.name, 'test-name')
      should.equal(result.scorecardDetails.length, 1)
      should.equal(result.scorecardDetails[0].scoreSystemId, testHelper.scoreSystemId1)
      should.equal(result.scorecardDetails[0].weight, 80)
      should.equal(result.scorecardDetails[0].scoreSystemName, 'system1')
      should.equal(result.createdBy, 'test')
      should.exist(result.createdAt)

      id = result.id
    })

    it('create scorecard API - success 2', async () => {
      const response = await chai.request(app)
        .post(basePath)
        .set('Authorization', `Bearer ${config.ADMIN_TOKEN}`)
        .send({
          name: 'test-name'
        })
      should.equal(response.status, 201)
      const result = response.body
      should.exist(result.id)
      should.equal(result.name, 'test-name')
      should.equal((result.scorecardDetails || []).length, 0)
      should.equal(result.createdBy, 'TonyJ')
      should.exist(result.createdAt)
    })

    it('create scorecard API - forbidden', async () => {
      const response = await chai.request(app)
        .post(basePath)
        .set('Authorization', `Bearer ${config.M2M_READ_ACCESS_TOKEN}`)
        .send({
          name: 'test-name'
        })
      should.equal(response.status, 403)
      should.equal(response.body.message, 'You are not allowed to perform this action!')
    })

    it('create scorecard API - missing name', async () => {
      const response = await chai.request(app)
        .post(basePath)
        .set('Authorization', `Bearer ${config.M2M_UPDATE_ACCESS_TOKEN}`)
        .send({})
      should.equal(response.status, 400)
      should.equal(response.body.message, '"name" is required')
    })

    it('create scorecard API - empty name', async () => {
      const response = await chai.request(app)
        .post(basePath)
        .set('Authorization', `Bearer ${config.M2M_UPDATE_ACCESS_TOKEN}`)
        .send({
          name: ''
        })
      should.equal(response.status, 400)
      should.equal(response.body.message, '"name" is not allowed to be empty')
    })

    it('create scorecard API - invalid name', async () => {
      const response = await chai.request(app)
        .post(basePath)
        .set('Authorization', `Bearer ${config.M2M_UPDATE_ACCESS_TOKEN}`)
        .send({
          name: ['test-name']
        })
      should.equal(response.status, 400)
      should.equal(response.body.message, '"name" must be a string')
    })

    it('create scorecard API - null name', async () => {
      const response = await chai.request(app)
        .post(basePath)
        .set('Authorization', `Bearer ${config.M2M_UPDATE_ACCESS_TOKEN}`)
        .send({
          name: null
        })
      should.equal(response.status, 400)
      should.equal(response.body.message, '"name" must be a string')
    })

    it('create scorecard API - invalid scoreSystemId', async () => {
      const response = await chai.request(app)
        .post(basePath)
        .set('Authorization', `Bearer ${config.M2M_UPDATE_ACCESS_TOKEN}`)
        .send({
          name: 'test-name',
          scorecardDetails: [{
            scoreSystemId: 'invalid',
            weight: 80
          }]
        })
      should.equal(response.status, 400)
      should.equal(response.body.message, '"scoreSystemId" must be a valid GUID')
    })

    it('create scorecard API - missing scoreSystemId', async () => {
      const response = await chai.request(app)
        .post(basePath)
        .set('Authorization', `Bearer ${config.M2M_UPDATE_ACCESS_TOKEN}`)
        .send({
          name: 'test-name',
          scorecardDetails: [{
            weight: 80
          }]
        })
      should.equal(response.status, 400)
      should.equal(response.body.message, '"scoreSystemId" is required')
    })

    it('create scorecard API - invalid weight', async () => {
      const response = await chai.request(app)
        .post(basePath)
        .set('Authorization', `Bearer ${config.M2M_UPDATE_ACCESS_TOKEN}`)
        .send({
          name: 'test-name',
          scorecardDetails: [{
            scoreSystemId: testHelper.scoreSystemId1,
            weight: 'abc'
          }]
        })
      should.equal(response.status, 400)
      should.equal(response.body.message, '"weight" must be a number')
    })

    it('create scorecard API - missing weight', async () => {
      const response = await chai.request(app)
        .post(basePath)
        .set('Authorization', `Bearer ${config.M2M_UPDATE_ACCESS_TOKEN}`)
        .send({
          name: 'test-name',
          scorecardDetails: [{
            scoreSystemId: testHelper.scoreSystemId1
          }]
        })
      should.equal(response.status, 400)
      should.equal(response.body.message, '"weight" is required')
    })

    it('create scorecard API - scoreSystemId is not found', async () => {
      const response = await chai.request(app)
        .post(basePath)
        .set('Authorization', `Bearer ${config.M2M_UPDATE_ACCESS_TOKEN}`)
        .send({
          name: 'test-name',
          scorecardDetails: [{
            scoreSystemId: testHelper.notFoundId,
            weight: 80
          }]
        })
      should.equal(response.status, 400)
      should.equal(response.body.message,
        `${config.AMAZON.DYNAMODB_SCORE_SYSTEM_TABLE} with id: ${testHelper.notFoundId} doesn't exist`)
    })

    it('create scorecard API - weight too large', async () => {
      const response = await chai.request(app)
        .post(basePath)
        .set('Authorization', `Bearer ${config.M2M_UPDATE_ACCESS_TOKEN}`)
        .send({
          name: 'test-name',
          scorecardDetails: [{
            scoreSystemId: testHelper.scoreSystemId1,
            weight: 101
          }]
        })
      should.equal(response.status, 400)
      should.equal(response.body.message,
        `"weight" must be less than or equal to ${constants.MAX_WEIGHT}`)
    })

    it('create scorecard API - weight less than lower bound', async () => {
      const response = await chai.request(app)
        .post(basePath)
        .set('Authorization', `Bearer ${config.M2M_UPDATE_ACCESS_TOKEN}`)
        .send({
          name: 'test-name',
          scorecardDetails: [{
            scoreSystemId: testHelper.scoreSystemId1,
            weight: -1
          }]
        })
      should.equal(response.status, 400)
      should.equal(response.body.message, '"weight" must be larger than or equal to 0')
    })

    it('create scorecard API - sum of weights too large', async () => {
      const response = await chai.request(app)
        .post(basePath)
        .set('Authorization', `Bearer ${config.M2M_UPDATE_ACCESS_TOKEN}`)
        .send({
          name: 'test-name',
          scorecardDetails: [{
            scoreSystemId: testHelper.scoreSystemId1,
            weight: 21
          }, {
            scoreSystemId: testHelper.scoreSystemId2,
            weight: 80
          }]
        })
      should.equal(response.status, 400)
      should.equal(response.body.message,
        `Sum of weights is 101, it should not be larger than ${constants.MAX_SUM_OF_WEIGHTS}.`)
    })

    it('create scorecard API - unexpected field', async () => {
      const response = await chai.request(app)
        .post(basePath)
        .set('Authorization', `Bearer ${config.M2M_UPDATE_ACCESS_TOKEN}`)
        .send({
          name: 'test-name',
          other: 123
        })
      should.equal(response.status, 400)
      should.equal(response.body.message, '"other" is not allowed')
    })
  })

  describe('get scorecard API tests', () => {
    it('get scorecard API - success', async () => {
      const response = await chai.request(app)
        .get(`${basePath}/${id}`)
        .set('Authorization', `Bearer ${config.USER_TOKEN}`)
      should.equal(response.status, 200)
      const result = response.body
      should.equal(result.id, id)
      should.equal(result.name, 'test-name')
      should.equal(result.scorecardDetails.length, 1)
      should.equal(result.scorecardDetails[0].scoreSystemId, testHelper.scoreSystemId1)
      should.equal(result.scorecardDetails[0].weight, 80)
      should.equal(result.scorecardDetails[0].scoreSystemName, 'system1')
      should.equal(result.createdBy, 'test')
      should.exist(result.createdAt)
    })

    it('get scorecard API - forbidden', async () => {
      const response = await chai.request(app)
        .get(`${basePath}/${id}`)
        .set('Authorization', `Bearer ${config.M2M_UPDATE_ACCESS_TOKEN}`)
      should.equal(response.status, 403)
      should.equal(response.body.message, 'You are not allowed to perform this action!')
    })

    it('get scorecard API - not found', async () => {
      const response = await chai.request(app)
        .get(`${basePath}/${testHelper.notFoundId}`)
        .set('Authorization', `Bearer ${config.ADMIN_TOKEN}`)
      should.equal(response.status, 404)
      should.equal(response.body.message,
        `${config.AMAZON.DYNAMODB_SCORECARD_TABLE} with id: ${testHelper.notFoundId} doesn't exist`)
    })

    it('get scorecard API - invalid id', async () => {
      const response = await chai.request(app)
        .get(`${basePath}/invalid`)
        .set('Authorization', `Bearer ${config.ADMIN_TOKEN}`)
      should.equal(response.status, 400)
      should.equal(response.body.message, '"id" must be a valid GUID')
    })
  })

  describe('get scorecard head API tests', () => {
    it('get scorecard head API - success', async () => {
      const response = await chai.request(app)
        .head(`${basePath}/${id}`)
        .set('Authorization', `Bearer ${config.COPILOT_TOKEN}`)
      should.equal(response.status, 200)
      should.equal(_.isEmpty(response.body), true)
    })

    it('get scorecard head API - forbidden', async () => {
      const response = await chai.request(app)
        .head(`${basePath}/${id}`)
        .set('Authorization', `Bearer ${config.M2M_UPDATE_ACCESS_TOKEN}`)
      should.equal(response.status, 403)
      should.equal(_.isEmpty(response.body), true)
    })

    it('get scorecard head API - not found', async () => {
      const response = await chai.request(app)
        .head(`${basePath}/${testHelper.notFoundId}`)
        .set('Authorization', `Bearer ${config.ADMIN_TOKEN}`)
      should.equal(response.status, 404)
      should.equal(_.isEmpty(response.body), true)
    })

    it('get scorecard head API - invalid id', async () => {
      const response = await chai.request(app)
        .head(`${basePath}/invalid`)
        .set('Authorization', `Bearer ${config.ADMIN_TOKEN}`)
      should.equal(response.status, 400)
      should.equal(_.isEmpty(response.body), true)
    })
  })

  describe('update scorecard API tests', () => {
    it('update scorecard API - success 1', async () => {
      const response = await chai.request(app)
        .put(`${basePath}/${id}`)
        .set('Authorization', `Bearer ${config.ADMIN_TOKEN}`)
        .send({
          name: 'test-name2',
          scorecardDetails: [{
            scoreSystemId: testHelper.scoreSystemId1,
            weight: 99
          }]
        })
      should.equal(response.status, 200)
      const result = response.body
      should.equal(result.id, id)
      should.equal(result.name, 'test-name2')
      should.equal(result.scorecardDetails.length, 1)
      should.equal(result.scorecardDetails[0].scoreSystemId, testHelper.scoreSystemId1)
      should.equal(result.scorecardDetails[0].weight, 99)
      should.equal(result.scorecardDetails[0].scoreSystemName, 'system1')
      should.equal(result.createdBy, 'test')
      should.exist(result.createdAt)
      should.equal(result.updatedBy, 'TonyJ')
      should.exist(result.updatedAt)
    })

    it('update scorecard API - success 2', async () => {
      const response = await chai.request(app)
        .put(`${basePath}/${id}`)
        .set('Authorization', `Bearer ${config.M2M_UPDATE_ACCESS_TOKEN}`)
        .send({
          name: 'test-name3'
        })
      should.equal(response.status, 200)
      const result = response.body
      should.equal(result.id, id)
      should.equal(result.name, 'test-name3')
      should.equal((result.scorecardDetails || []).length, 0)
      should.equal(result.createdBy, 'test')
      should.exist(result.createdAt)
      should.equal(result.updatedBy, 'test')
      should.exist(result.updatedAt)
    })

    it('update scorecard API - forbidden', async () => {
      const response = await chai.request(app)
        .put(`${basePath}/${id}`)
        .set('Authorization', `Bearer ${config.COPILOT_TOKEN}`)
        .send({
          name: 'test-name3'
        })
      should.equal(response.status, 403)
      should.equal(response.body.message, 'You are not allowed to perform this action!')
    })

    it('update scorecard API - not found', async () => {
      const response = await chai.request(app)
        .put(`${basePath}/${testHelper.notFoundId}`)
        .set('Authorization', `Bearer ${config.ADMIN_TOKEN}`)
        .send({
          name: 'test-name3'
        })
      should.equal(response.status, 404)
      should.equal(response.body.message,
        `${config.AMAZON.DYNAMODB_SCORECARD_TABLE} with id: ${testHelper.notFoundId} doesn't exist`)
    })

    it('update scorecard API - invalid id', async () => {
      const response = await chai.request(app)
        .put(`${basePath}/invalid`)
        .set('Authorization', `Bearer ${config.ADMIN_TOKEN}`)
        .send({
          name: 'test-name3'
        })
      should.equal(response.status, 400)
      should.equal(response.body.message, '"id" must be a valid GUID')
    })

    it('update scorecard API - missing name', async () => {
      const response = await chai.request(app)
        .put(`${basePath}/${id}`)
        .set('Authorization', `Bearer ${config.M2M_UPDATE_ACCESS_TOKEN}`)
        .send({})
      should.equal(response.status, 400)
      should.equal(response.body.message, '"name" is required')
    })

    it('update scorecard API - empty name', async () => {
      const response = await chai.request(app)
        .put(`${basePath}/${id}`)
        .set('Authorization', `Bearer ${config.M2M_UPDATE_ACCESS_TOKEN}`)
        .send({
          name: ''
        })
      should.equal(response.status, 400)
      should.equal(response.body.message, '"name" is not allowed to be empty')
    })

    it('update scorecard API - invalid name', async () => {
      const response = await chai.request(app)
        .put(`${basePath}/${id}`)
        .set('Authorization', `Bearer ${config.M2M_UPDATE_ACCESS_TOKEN}`)
        .send({
          name: ['test-name']
        })
      should.equal(response.status, 400)
      should.equal(response.body.message, '"name" must be a string')
    })

    it('update scorecard API - null name', async () => {
      const response = await chai.request(app)
        .put(`${basePath}/${id}`)
        .set('Authorization', `Bearer ${config.M2M_UPDATE_ACCESS_TOKEN}`)
        .send({
          name: null
        })
      should.equal(response.status, 400)
      should.equal(response.body.message, '"name" must be a string')
    })

    it('update scorecard API - invalid scoreSystemId', async () => {
      const response = await chai.request(app)
        .put(`${basePath}/${id}`)
        .set('Authorization', `Bearer ${config.M2M_UPDATE_ACCESS_TOKEN}`)
        .send({
          name: 'test-name',
          scorecardDetails: [{
            scoreSystemId: 'invalid',
            weight: 80
          }]
        })
      should.equal(response.status, 400)
      should.equal(response.body.message, '"scoreSystemId" must be a valid GUID')
    })

    it('update scorecard API - missing scoreSystemId', async () => {
      const response = await chai.request(app)
        .put(`${basePath}/${id}`)
        .set('Authorization', `Bearer ${config.M2M_UPDATE_ACCESS_TOKEN}`)
        .send({
          name: 'test-name',
          scorecardDetails: [{
            weight: 80
          }]
        })
      should.equal(response.status, 400)
      should.equal(response.body.message, '"scoreSystemId" is required')
    })

    it('update scorecard API - invalid weight', async () => {
      const response = await chai.request(app)
        .put(`${basePath}/${id}`)
        .set('Authorization', `Bearer ${config.M2M_UPDATE_ACCESS_TOKEN}`)
        .send({
          name: 'test-name',
          scorecardDetails: [{
            scoreSystemId: testHelper.scoreSystemId1,
            weight: 'abc'
          }]
        })
      should.equal(response.status, 400)
      should.equal(response.body.message, '"weight" must be a number')
    })

    it('update scorecard API - missing weight', async () => {
      const response = await chai.request(app)
        .put(`${basePath}/${id}`)
        .set('Authorization', `Bearer ${config.M2M_UPDATE_ACCESS_TOKEN}`)
        .send({
          name: 'test-name',
          scorecardDetails: [{
            scoreSystemId: testHelper.scoreSystemId1
          }]
        })
      should.equal(response.status, 400)
      should.equal(response.body.message, '"weight" is required')
    })

    it('update scorecard API - scoreSystemId is not found', async () => {
      const response = await chai.request(app)
        .put(`${basePath}/${id}`)
        .set('Authorization', `Bearer ${config.M2M_UPDATE_ACCESS_TOKEN}`)
        .send({
          name: 'test-name',
          scorecardDetails: [{
            scoreSystemId: testHelper.notFoundId,
            weight: 80
          }]
        })
      should.equal(response.status, 400)
      should.equal(response.body.message,
        `${config.AMAZON.DYNAMODB_SCORE_SYSTEM_TABLE} with id: ${testHelper.notFoundId} doesn't exist`)
    })

    it('update scorecard API - weight too large', async () => {
      const response = await chai.request(app)
        .put(`${basePath}/${id}`)
        .set('Authorization', `Bearer ${config.M2M_UPDATE_ACCESS_TOKEN}`)
        .send({
          name: 'test-name',
          scorecardDetails: [{
            scoreSystemId: testHelper.scoreSystemId1,
            weight: 101
          }]
        })
      should.equal(response.status, 400)
      should.equal(response.body.message,
        `"weight" must be less than or equal to ${constants.MAX_WEIGHT}`)
    })

    it('update scorecard API - weight less than lower bound', async () => {
      const response = await chai.request(app)
        .put(`${basePath}/${id}`)
        .set('Authorization', `Bearer ${config.M2M_UPDATE_ACCESS_TOKEN}`)
        .send({
          name: 'test-name',
          scorecardDetails: [{
            scoreSystemId: testHelper.scoreSystemId1,
            weight: -1
          }]
        })
      should.equal(response.status, 400)
      should.equal(response.body.message, '"weight" must be larger than or equal to 0')
    })

    it('update scorecard API - sum of weights too large', async () => {
      const response = await chai.request(app)
        .put(`${basePath}/${id}`)
        .set('Authorization', `Bearer ${config.M2M_UPDATE_ACCESS_TOKEN}`)
        .send({
          name: 'test-name',
          scorecardDetails: [{
            scoreSystemId: testHelper.scoreSystemId1,
            weight: 21
          }, {
            scoreSystemId: testHelper.scoreSystemId2,
            weight: 80
          }]
        })
      should.equal(response.status, 400)
      should.equal(response.body.message,
        `Sum of weights is 101, it should not be larger than ${constants.MAX_SUM_OF_WEIGHTS}.`)
    })

    it('update scorecard API - unexpected field', async () => {
      const response = await chai.request(app)
        .put(`${basePath}/${id}`)
        .set('Authorization', `Bearer ${config.M2M_UPDATE_ACCESS_TOKEN}`)
        .send({
          name: 'test-name',
          other: 123
        })
      should.equal(response.status, 400)
      should.equal(response.body.message, '"other" is not allowed')
    })
  })

  describe('partially update scorecard API tests', () => {
    it('partially update scorecard API - success 1', async () => {
      const response = await chai.request(app)
        .patch(`${basePath}/${id}`)
        .set('Authorization', `Bearer ${config.M2M_FULL_ACCESS_TOKEN}`)
        .send({
          name: 'test-name3',
          scorecardDetails: [{
            scoreSystemId: testHelper.scoreSystemId2,
            weight: 100
          }]
        })
      should.equal(response.status, 200)
      const result = response.body
      should.equal(result.id, id)
      should.equal(result.name, 'test-name3')
      should.equal(result.scorecardDetails.length, 1)
      should.equal(result.scorecardDetails[0].scoreSystemId, testHelper.scoreSystemId2)
      should.equal(result.scorecardDetails[0].weight, 100)
      should.equal(result.scorecardDetails[0].scoreSystemName, 'system2')
      should.equal(result.createdBy, 'test')
      should.exist(result.createdAt)
      should.equal(result.updatedBy, 'test')
      should.exist(result.updatedAt)
    })

    it('partially update scorecard API - success 2', async () => {
      const response = await chai.request(app)
        .patch(`${basePath}/${id}`)
        .set('Authorization', `Bearer ${config.ADMIN_TOKEN}`)
        .send({
          name: 'test-name4'
        })
      should.equal(response.status, 200)
      const result = response.body
      should.equal(result.id, id)
      should.equal(result.name, 'test-name4')
      should.equal(result.scorecardDetails.length, 1)
      should.equal(result.scorecardDetails[0].scoreSystemId, testHelper.scoreSystemId2)
      should.equal(result.scorecardDetails[0].weight, 100)
      should.equal(result.scorecardDetails[0].scoreSystemName, 'system2')
      should.equal(result.createdBy, 'test')
      should.exist(result.createdAt)
      should.equal(result.updatedBy, 'TonyJ')
      should.exist(result.updatedAt)
    })

    it('partially update scorecard API - forbidden', async () => {
      const response = await chai.request(app)
        .patch(`${basePath}/${id}`)
        .set('Authorization', `Bearer ${config.M2M_READ_ACCESS_TOKEN}`)
        .send({ name: 'testing2' })
      should.equal(response.status, 403)
      should.equal(response.body.message, 'You are not allowed to perform this action!')
    })

    it('partially update scorecard API - not found', async () => {
      const response = await chai.request(app)
        .patch(`${basePath}/${testHelper.notFoundId}`)
        .set('Authorization', `Bearer ${config.ADMIN_TOKEN}`)
        .send({ name: 'testing2' })
      should.equal(response.status, 404)
      should.equal(response.body.message,
        `${config.AMAZON.DYNAMODB_SCORECARD_TABLE} with id: ${testHelper.notFoundId} doesn't exist`)
    })

    it('partially update scorecard API - invalid id', async () => {
      const response = await chai.request(app)
        .patch(`${basePath}/invalid`)
        .set('Authorization', `Bearer ${config.ADMIN_TOKEN}`)
        .send({
          name: 'test-name3'
        })
      should.equal(response.status, 400)
      should.equal(response.body.message, '"id" must be a valid GUID')
    })

    it('partially update scorecard API - empty name', async () => {
      const response = await chai.request(app)
        .patch(`${basePath}/${id}`)
        .set('Authorization', `Bearer ${config.M2M_UPDATE_ACCESS_TOKEN}`)
        .send({
          name: ''
        })
      should.equal(response.status, 400)
      should.equal(response.body.message, '"name" is not allowed to be empty')
    })

    it('partially update scorecard API - invalid name', async () => {
      const response = await chai.request(app)
        .patch(`${basePath}/${id}`)
        .set('Authorization', `Bearer ${config.M2M_UPDATE_ACCESS_TOKEN}`)
        .send({
          name: ['test-name']
        })
      should.equal(response.status, 400)
      should.equal(response.body.message, '"name" must be a string')
    })

    it('partially update scorecard API - null name', async () => {
      const response = await chai.request(app)
        .patch(`${basePath}/${id}`)
        .set('Authorization', `Bearer ${config.M2M_UPDATE_ACCESS_TOKEN}`)
        .send({
          name: null
        })
      should.equal(response.status, 400)
      should.equal(response.body.message, '"name" must be a string')
    })

    it('partially update scorecard API - invalid scoreSystemId', async () => {
      const response = await chai.request(app)
        .patch(`${basePath}/${id}`)
        .set('Authorization', `Bearer ${config.M2M_UPDATE_ACCESS_TOKEN}`)
        .send({
          name: 'test-name',
          scorecardDetails: [{
            scoreSystemId: 'invalid',
            weight: 80
          }]
        })
      should.equal(response.status, 400)
      should.equal(response.body.message, '"scoreSystemId" must be a valid GUID')
    })

    it('partially update scorecard API - missing scoreSystemId', async () => {
      const response = await chai.request(app)
        .patch(`${basePath}/${id}`)
        .set('Authorization', `Bearer ${config.M2M_UPDATE_ACCESS_TOKEN}`)
        .send({
          name: 'test-name',
          scorecardDetails: [{
            weight: 80
          }]
        })
      should.equal(response.status, 400)
      should.equal(response.body.message, '"scoreSystemId" is required')
    })

    it('partially update scorecard API - invalid weight', async () => {
      const response = await chai.request(app)
        .patch(`${basePath}/${id}`)
        .set('Authorization', `Bearer ${config.M2M_UPDATE_ACCESS_TOKEN}`)
        .send({
          name: 'test-name',
          scorecardDetails: [{
            scoreSystemId: testHelper.scoreSystemId1,
            weight: 'abc'
          }]
        })
      should.equal(response.status, 400)
      should.equal(response.body.message, '"weight" must be a number')
    })

    it('partially update scorecard API - missing weight', async () => {
      const response = await chai.request(app)
        .patch(`${basePath}/${id}`)
        .set('Authorization', `Bearer ${config.M2M_UPDATE_ACCESS_TOKEN}`)
        .send({
          name: 'test-name',
          scorecardDetails: [{
            scoreSystemId: testHelper.scoreSystemId1
          }]
        })
      should.equal(response.status, 400)
      should.equal(response.body.message, '"weight" is required')
    })

    it('partially update scorecard API - scoreSystemId is not found', async () => {
      const response = await chai.request(app)
        .patch(`${basePath}/${id}`)
        .set('Authorization', `Bearer ${config.M2M_UPDATE_ACCESS_TOKEN}`)
        .send({
          name: 'test-name',
          scorecardDetails: [{
            scoreSystemId: testHelper.notFoundId,
            weight: 80
          }]
        })
      should.equal(response.status, 400)
      should.equal(response.body.message,
        `${config.AMAZON.DYNAMODB_SCORE_SYSTEM_TABLE} with id: ${testHelper.notFoundId} doesn't exist`)
    })

    it('partially update scorecard API - weight too large', async () => {
      const response = await chai.request(app)
        .patch(`${basePath}/${id}`)
        .set('Authorization', `Bearer ${config.M2M_UPDATE_ACCESS_TOKEN}`)
        .send({
          name: 'test-name',
          scorecardDetails: [{
            scoreSystemId: testHelper.scoreSystemId1,
            weight: 101
          }]
        })
      should.equal(response.status, 400)
      should.equal(response.body.message,
        `"weight" must be less than or equal to ${constants.MAX_WEIGHT}`)
    })

    it('partially update scorecard API - weight less than lower bound', async () => {
      const response = await chai.request(app)
        .patch(`${basePath}/${id}`)
        .set('Authorization', `Bearer ${config.M2M_UPDATE_ACCESS_TOKEN}`)
        .send({
          name: 'test-name',
          scorecardDetails: [{
            scoreSystemId: testHelper.scoreSystemId1,
            weight: -1
          }]
        })
      should.equal(response.status, 400)
      should.equal(response.body.message, '"weight" must be larger than or equal to 0')
    })

    it('partially update scorecard API - sum of weights too large', async () => {
      const response = await chai.request(app)
        .patch(`${basePath}/${id}`)
        .set('Authorization', `Bearer ${config.M2M_UPDATE_ACCESS_TOKEN}`)
        .send({
          name: 'test-name',
          scorecardDetails: [{
            scoreSystemId: testHelper.scoreSystemId1,
            weight: 21
          }, {
            scoreSystemId: testHelper.scoreSystemId2,
            weight: 80
          }]
        })
      should.equal(response.status, 400)
      should.equal(response.body.message,
        `Sum of weights is 101, it should not be larger than ${constants.MAX_SUM_OF_WEIGHTS}.`)
    })

    it('partially update scorecard API - unexpected field', async () => {
      const response = await chai.request(app)
        .patch(`${basePath}/${id}`)
        .set('Authorization', `Bearer ${config.M2M_UPDATE_ACCESS_TOKEN}`)
        .send({
          name: 'test-name',
          other: 123
        })
      should.equal(response.status, 400)
      should.equal(response.body.message, '"other" is not allowed')
    })
  })

  describe('remove scorecard API tests', () => {
    it('remove scorecard API - forbidden', async () => {
      const response = await chai.request(app)
        .delete(`${basePath}/${id}`)
        .set('Authorization', `Bearer ${config.COPILOT_TOKEN}`)
      should.equal(response.status, 403)
      should.equal(response.body.message, 'You are not allowed to perform this action!')
    })

    it('remove scorecard API - success', async () => {
      const response = await chai.request(app)
        .delete(`${basePath}/${id}`)
        .set('Authorization', `Bearer ${config.M2M_FULL_ACCESS_TOKEN}`)
      should.equal(response.status, 204)
      should.equal(_.isEmpty(response.body), true)
    })

    it('remove scorecard API - not found', async () => {
      const response = await chai.request(app)
        .delete(`${basePath}/${id}`)
        .set('Authorization', `Bearer ${config.ADMIN_TOKEN}`)
      should.equal(response.status, 404)
      should.equal(response.body.message, `${config.AMAZON.DYNAMODB_SCORECARD_TABLE} with id: ${id} doesn't exist`)
    })

    it('remove scorecard API - invalid id', async () => {
      const response = await chai.request(app)
        .delete(`${basePath}/invalid`)
        .set('Authorization', `Bearer ${config.M2M_UPDATE_ACCESS_TOKEN}`)
      should.equal(response.status, 400)
      should.equal(response.body.message, '"id" must be a valid GUID')
    })
  })
})
