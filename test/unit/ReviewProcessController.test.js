/* eslint-disable no-unused-expressions */
const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const controller = require('../../src/controllers/ReviewProcessController')
const service = require('../../src/services/ReviewProcessService')
const helper = require('../../src/common/helper')
const testData = require('./common/ReviewProcessControllerData')
const expect = chai.expect
chai.use(sinonChai)

describe('review process controller test', () => {
  afterEach(() => {
    sinon.restore()
  })
  it('T01:Search review processes', async () => {
    const data = testData.T01
    const stubSearchReviewProcesses = sinon.stub(service, 'searchReviewProcesses').callsFake(async () => data.result)
    const stubSetResHeaders = sinon.stub(helper, 'setResHeaders').callsFake(() => undefined)
    const stubSend = sinon.stub(data.res, 'send').callsFake(() => undefined)
    await controller.searchReviewProcesses(data.req, data.res)
    expect(stubSearchReviewProcesses).to.have.been.calledOnce
    expect(stubSearchReviewProcesses).to.have.been.calledWithExactly(data.req.query)
    expect(stubSetResHeaders).to.have.been.calledOnce
    expect(stubSetResHeaders).to.have.been.calledWithExactly(data.req, data.res, data.result)
    expect(stubSend).to.have.been.calledOnce
    expect(stubSend).to.have.been.calledWithExactly(data.result.result)
  })
  it('T02:Create review process', async () => {
    const data = testData.T02
    const stubCreateReviewProcess = sinon.stub(service, 'createReviewProcess').callsFake(async () => data.result)
    const stubStatus = sinon.stub(data.res, 'status').callsFake(() => data.res)
    const stubSend = sinon.stub(data.res, 'send').callsFake(() => undefined)
    await controller.createReviewProcess(data.req, data.res)
    expect(stubCreateReviewProcess).to.have.been.calledOnce
    expect(stubCreateReviewProcess).to.have.been.calledWithExactly(data.req.authUser, data.req.body)
    expect(stubStatus).to.have.been.calledOnce
    expect(stubStatus).to.have.been.calledWithExactly(201)
    expect(stubSend).to.have.been.calledOnce
    expect(stubSend).to.have.been.calledWithExactly(data.result)
  })
  it('T03:Get review process', async () => {
    const data = testData.T03
    const stubGetReviewProcess = sinon.stub(service, 'getReviewProcess').callsFake(async () => data.result)
    const stubSend = sinon.stub(data.res, 'send').callsFake(() => undefined)
    await controller.getReviewProcess(data.req, data.res)
    expect(stubGetReviewProcess).to.have.been.calledOnce
    expect(stubGetReviewProcess).to.have.been.calledWithExactly(data.req.params.processId)
    expect(stubSend).to.have.been.calledOnce
    expect(stubSend).to.have.been.calledWithExactly(data.result)
  })
  it('T04:Fully update review process', async () => {
    const data = testData.T04
    const stubFullyUpdateReviewProcess = sinon.stub(service, 'fullyUpdateReviewProcess').callsFake(async () => data.result)
    const stubSend = sinon.stub(data.res, 'send').callsFake(() => undefined)
    await controller.fullyUpdateReviewProcess(data.req, data.res)
    expect(stubFullyUpdateReviewProcess).to.have.been.calledOnce
    expect(stubFullyUpdateReviewProcess).to.have.been.calledWithExactly(data.req.authUser, data.req.params.processId, data.req.body)
    expect(stubSend).to.have.been.calledOnce
    expect(stubSend).to.have.been.calledWithExactly(data.result)
  })
  it('T05:Partially update review process', async () => {
    const data = testData.T05
    const stubPartiallyUpdateReviewProcess = sinon.stub(service, 'partiallyUpdateReviewProcess').callsFake(async () => data.result)
    const stubSend = sinon.stub(data.res, 'send').callsFake(() => undefined)
    await controller.partiallyUpdateReviewProcess(data.req, data.res)
    expect(stubPartiallyUpdateReviewProcess).to.have.been.calledOnce
    expect(stubPartiallyUpdateReviewProcess).to.have.been.calledWithExactly(data.req.authUser, data.req.params.processId, data.req.body)
    expect(stubSend).to.have.been.calledOnce
    expect(stubSend).to.have.been.calledWithExactly(data.result)
  })
  it('T06:Delete review process', async () => {
    const data = testData.T06
    const stubDeleteReviewProcess = sinon.stub(service, 'deleteReviewProcess').callsFake(async () => data.result)
    const stubSend = sinon.stub(data.res, 'send').callsFake(() => undefined)
    await controller.deleteReviewProcess(data.req, data.res)
    expect(stubDeleteReviewProcess).to.have.been.calledOnce
    expect(stubDeleteReviewProcess).to.have.been.calledWithExactly(data.req.params.processId)
    expect(stubSend).to.have.been.calledOnce
    expect(stubSend).to.have.been.calledWithExactly(data.result)
  })
})
