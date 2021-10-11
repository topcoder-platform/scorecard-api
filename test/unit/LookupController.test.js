/* eslint-disable no-unused-expressions */
const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const controller = require('../../src/controllers/LookupController')
const service = require('../../src/services/LookupService')
const helper = require('../../src/common/helper')
const testData = require('./common/LookupControllerData')
const expect = chai.expect
chai.use(sinonChai)

describe('lookup controller test', () => {
  afterEach(() => {
    sinon.restore()
  })
  it('T01:Get process event types', async () => {
    const data = testData.T01
    const stubGetProcessEventTypes = sinon.stub(service, 'getProcessEventTypes').callsFake(async () => data.result)
    const stubSend = sinon.stub(data.res, 'send').callsFake(() => undefined)
    await controller.getProcessEventTypes(data.req, data.res)
    expect(stubGetProcessEventTypes).to.have.been.calledOnce
    expect(stubSend).to.have.been.calledOnce
    expect(stubSend).to.have.been.calledWithExactly(data.result)
  })
  it('T02:Get review steps', async () => {
    const data = testData.T02
    const stubGetReviewSteps = sinon.stub(service, 'getReviewSteps').callsFake(async () => data.result)
    const stubSetResHeaders = sinon.stub(helper, 'setResHeaders').callsFake(() => undefined)
    const stubSend = sinon.stub(data.res, 'send').callsFake(() => undefined)
    await controller.getReviewSteps(data.req, data.res)
    expect(stubGetReviewSteps).to.have.been.calledOnce
    expect(stubGetReviewSteps).to.have.been.calledWithExactly(data.req.query)
    expect(stubSetResHeaders).to.have.been.calledOnce
    expect(stubSetResHeaders).to.have.been.calledWithExactly(data.req, data.res, data.result)
    expect(stubSend).to.have.been.calledOnce
    expect(stubSend).to.have.been.calledWithExactly(data.result.result)
  })
})
