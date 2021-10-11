/* eslint-disable no-unused-expressions */
const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const { ReviewStep } = require('../../src/models')
const service = require('../../src/services/LookupService')
const helper = require('../../src/common/helper')
const testData = require('./common/LookupServiceData')
const expect = chai.expect
chai.use(sinonChai)

describe('lookup service test', () => {
  beforeEach(() => {

  })
  afterEach(() => {
    sinon.restore()
  })
  it('T01:Get process event types', async () => {
    const data = testData.T01
    const stubScanAll = sinon.stub(helper, 'scanAll').callsFake(async () => data.scanResult)
    const result = await service.getProcessEventTypes()
    expect(stubScanAll).to.have.been.calledOnce
    expect(result).to.deep.eql(data.scanResult)
  })
  it('T02:Get review steps', async () => {
    const data = testData.T02
    const stubScanAll = sinon.stub(helper, 'scanAll').callsFake(async () => data.scanResult)
    const result = await service.getReviewSteps(data.criteria)
    expect(stubScanAll).to.have.been.calledOnce
    expect(stubScanAll).to.have.been.calledWithExactly(ReviewStep, data.options)
    expect(result).to.deep.eql(data.response)
  })
  it('T03:Get review steps with criteria', async () => {
    const data = testData.T03
    const stubScanAll = sinon.stub(helper, 'scanAll').callsFake(async () => data.scanResult)
    const result = await service.getReviewSteps(data.criteria)
    expect(stubScanAll).to.have.been.calledOnce
    expect(stubScanAll).to.have.been.calledWithExactly(ReviewStep, data.options)
    expect(result).to.deep.eql(data.response)
  })
})
