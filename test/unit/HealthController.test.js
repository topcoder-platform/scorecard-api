/* eslint-disable no-unused-expressions */
const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const controller = require('../../src/controllers/HealthController')
const { ProcessEventType } = require('../../src/models')
const testData = require('./common/HealthControllerData')
const expect = chai.expect
chai.use(sinonChai)

describe('health controller test', () => {
  afterEach(() => {
    sinon.restore()
  })
  it('T01:Check Health', async () => {
    const data = testData.T01
    const stubScan = sinon.stub(ProcessEventType, 'scan').callsFake(() => ({ limit: async function () {} }))
    const stubSend = sinon.stub(data.res, 'send').callsFake(() => undefined)
    await controller.checkHealth(data.req, data.res)
    expect(stubScan).to.have.been.calledOnce
    expect(stubSend).to.have.been.calledOnce
    expect(stubSend).to.have.been.calledWithExactly(data.result)
  })
  it('T02:Fail Check Health', async () => {
    const data = testData.T02
    const stubScan = sinon.stub(ProcessEventType, 'scan').callsFake(() => ({ limit: async function () { throw new Error(data.message) } }))
    let error
    try {
      await controller.checkHealth(data.req, data.res)
    } catch (err) {
      error = err
    }
    expect(stubScan).to.have.been.calledOnce
    expect(error.httpStatus).to.eql(data.httpStatus)
    expect(error.message).to.eql(data.errorMessage)
  })
  it('T03:Fail Check Health due to slowness', async () => {
    const data = testData.T03
    const stubScan = sinon.stub(ProcessEventType, 'scan').callsFake(() => ({ limit: async function () {} }))
    let counter = 0
    sinon.stub(Date.prototype, 'getTime').callsFake(() => {
      counter += 1
      if (counter === 1) {
        return 0
      } else {
        return 1000000000
      }
    })
    let error
    try {
      await controller.checkHealth(data.req, data.res)
    } catch (err) {
      error = err
    }
    expect(stubScan).to.have.been.calledOnce
    expect(error.httpStatus).to.eql(data.httpStatus)
    expect(error.message).to.eql('Database operation is slow.')
  })
})
