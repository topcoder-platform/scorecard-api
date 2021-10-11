/* eslint-disable no-unused-expressions */
const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const controller = require('../../src/controllers/ScorecardController')
const service = require('../../src/services/ScorecardService')
const helper = require('../../src/common/helper')
const testData = require('./common/ScorecardControllerData')
const expect = chai.expect
chai.use(sinonChai)

describe('scorecard controller test', () => {
  afterEach(() => {
    sinon.restore()
  })
  it('T01:Search scorecard', async () => {
    const data = testData.T01
    const stubSearchScorecards = sinon.stub(service, 'searchScorecards').callsFake(async () => data.result)
    const stubSetResHeaders = sinon.stub(helper, 'setResHeaders').callsFake(() => undefined)
    const stubSend = sinon.stub(data.res, 'send').callsFake(() => undefined)
    await controller.searchScorecards(data.req, data.res)
    expect(stubSearchScorecards).to.have.been.calledOnce
    expect(stubSearchScorecards).to.have.been.calledWithExactly(data.req.query)
    expect(stubSetResHeaders).to.have.been.calledOnce
    expect(stubSetResHeaders).to.have.been.calledWithExactly(data.req, data.res, data.result)
    expect(stubSend).to.have.been.calledOnce
    expect(stubSend).to.have.been.calledWithExactly(data.result.result)
  })
  it('T02:Create scorecard', async () => {
    const data = testData.T02
    const stubCreateScorecard = sinon.stub(service, 'createScorecard').callsFake(async () => data.result)
    const stubStatus = sinon.stub(data.res, 'status').callsFake(() => data.res)
    const stubSend = sinon.stub(data.res, 'send').callsFake(() => undefined)
    await controller.createScorecard(data.req, data.res)
    expect(stubCreateScorecard).to.have.been.calledOnce
    expect(stubCreateScorecard).to.have.been.calledWithExactly(data.req.authUser, data.req.body)
    expect(stubStatus).to.have.been.calledOnce
    expect(stubStatus).to.have.been.calledWithExactly(201)
    expect(stubSend).to.have.been.calledOnce
    expect(stubSend).to.have.been.calledWithExactly(data.result)
  })
  it('T03:Get scorecard', async () => {
    const data = testData.T03
    const stubGetScorecard = sinon.stub(service, 'getScorecard').callsFake(async () => data.result)
    const stubSend = sinon.stub(data.res, 'send').callsFake(() => undefined)
    await controller.getScorecard(data.req, data.res)
    expect(stubGetScorecard).to.have.been.calledOnce
    expect(stubGetScorecard).to.have.been.calledWithExactly(data.req.params.scorecardId)
    expect(stubSend).to.have.been.calledOnce
    expect(stubSend).to.have.been.calledWithExactly(data.result)
  })
  it('T04:Fully update scorecard', async () => {
    const data = testData.T04
    const stubFullyUpdateScorecard = sinon.stub(service, 'fullyUpdateScorecard').callsFake(async () => data.result)
    const stubSend = sinon.stub(data.res, 'send').callsFake(() => undefined)
    await controller.fullyUpdateScorecard(data.req, data.res)
    expect(stubFullyUpdateScorecard).to.have.been.calledOnce
    expect(stubFullyUpdateScorecard).to.have.been.calledWithExactly(data.req.authUser, data.req.params.scorecardId, data.req.body)
    expect(stubSend).to.have.been.calledOnce
    expect(stubSend).to.have.been.calledWithExactly(data.result)
  })
  it('T05:Partially update review process', async () => {
    const data = testData.T05
    const stubPartiallyUpdateScorecard = sinon.stub(service, 'partiallyUpdateScorecard').callsFake(async () => data.result)
    const stubSend = sinon.stub(data.res, 'send').callsFake(() => undefined)
    await controller.partiallyUpdateScorecard(data.req, data.res)
    expect(stubPartiallyUpdateScorecard).to.have.been.calledOnce
    expect(stubPartiallyUpdateScorecard).to.have.been.calledWithExactly(data.req.authUser, data.req.params.scorecardId, data.req.body)
    expect(stubSend).to.have.been.calledOnce
    expect(stubSend).to.have.been.calledWithExactly(data.result)
  })
  it('T06:Delete review process', async () => {
    const data = testData.T06
    const stubDeleteScorecard = sinon.stub(service, 'deleteScorecard').callsFake(async () => data.result)
    const stubSend = sinon.stub(data.res, 'send').callsFake(() => undefined)
    await controller.deleteScorecard(data.req, data.res)
    expect(stubDeleteScorecard).to.have.been.calledOnce
    expect(stubDeleteScorecard).to.have.been.calledWithExactly(data.req.params.scorecardId)
    expect(stubSend).to.have.been.calledOnce
    expect(stubSend).to.have.been.calledWithExactly(data.result)
  })
})
