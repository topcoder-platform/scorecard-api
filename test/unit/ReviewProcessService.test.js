/* eslint-disable no-unused-expressions */
const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const { ReviewProcess } = require('../../src/models')
const service = require('../../src/services/ReviewProcessService')
const helper = require('../../src/common/helper')
const commonData = require('./common/CommonData')
const testData = require('./common/ReviewProcessServiceData')
const expect = chai.expect
chai.use(sinonChai)

describe('review process service test', () => {
  const ESClient = commonData.ESClient
  beforeEach(() => {

  })
  afterEach(() => {
    sinon.restore()
  })
  it('T01:Search review processes', async () => {
    const data = testData.T01
    const stubSearch = sinon.stub(ESClient, 'search').callsFake(() => data.esSearchResult)
    const result = await service.searchReviewProcesses(data.criteria)
    expect(stubSearch).to.have.been.calledOnce
    expect(stubSearch).to.have.been.calledWithExactly(data.esQuery)
    expect(result).to.deep.eql(data.response)
  })
  it('T02:Search review processes with criteria', async () => {
    const data = testData.T02
    const stubSearch = sinon.stub(ESClient, 'search').callsFake(() => data.esSearchResult)
    const result = await service.searchReviewProcesses(data.criteria)
    expect(stubSearch).to.have.been.calledOnce
    expect(stubSearch).to.have.been.calledWithExactly(data.esQuery)
    expect(result).to.deep.eql(data.response)
  })
  it('T03:Get review process', async () => {
    const data = testData.T03
    const stubGetExtra = sinon.stub(ESClient, 'getExtra').callsFake(() => data.esResult)
    const result = await service.getReviewProcess(data.id)
    expect(stubGetExtra).to.have.been.calledOnce
    expect(stubGetExtra).to.have.been.calledWithExactly(...data.getExtraParam)
    expect(result).to.deep.eql(data.esResult)
  })
  it('T04:Create review process', async () => {
    const data = testData.T04
    const stubScanAll = sinon.stub(helper, 'scanAll').callsFake(async () => [])
    const stubGetById = sinon.stub(helper, 'getById').callsFake(async () => undefined)
    const stubCreate = sinon.stub(helper, 'create').callsFake(async () => data.result)
    const stubCreateExtra = sinon.stub(ESClient, 'createExtra').callsFake(async () => undefined)
    const result = await service.createReviewProcess(commonData.userAdmin, data.data)
    expect(stubScanAll).to.have.been.calledOnce
    expect(stubScanAll).to.have.been.calledWithExactly(ReviewProcess, data.options)
    expect(stubGetById).to.have.callCount(data.getByIdCount)
    expect(stubCreate).to.have.been.calledOnce
    expect(stubCreateExtra).to.have.been.calledOnce
    expect(stubCreateExtra).to.have.been.calledWithMatch(testData.index, stubCreate.getCall(0).args[1].id, data.result)
    expect(result).to.deep.eql(data.result)
  })
  it('T05:Create review process with wrong weights', async () => {
    const data = testData.T05
    let error
    try {
      await service.createReviewProcess(commonData.userAdmin, data.data)
    } catch (err) {
      error = err
    }
    expect(error.httpStatus).to.eql(data.httpStatus)
    expect(error.message).to.eql(data.errorMessage)
  })
  it('T06:Create review process with duplicated title', async () => {
    const data = testData.T06
    const stubScanAll = sinon.stub(helper, 'scanAll').callsFake(async () => ({ count: 1 }))
    let error
    try {
      await service.createReviewProcess(commonData.userAdmin, data.data)
    } catch (err) {
      error = err
    }
    expect(stubScanAll).to.have.been.calledOnce
    expect(stubScanAll).to.have.been.calledWithExactly(ReviewProcess, data.options)
    expect(error.httpStatus).to.eql(data.httpStatus)
    expect(error.message).to.eql(data.errorMessage)
  })
  it('T07:Fail to create review process', async () => {
    const data = testData.T07
    const stubScanAll = sinon.stub(helper, 'scanAll').callsFake(async () => [])
    const stubGetById = sinon.stub(helper, 'getById').callsFake(async () => undefined)
    const stubCreate = sinon.stub(helper, 'create').callsFake(async () => data.result)
    const stubCreateExtra = sinon.stub(ESClient, 'createExtra').throws(new Error('test'))
    const stubRemove = sinon.stub(helper, 'remove').callsFake(async () => undefined)
    let error
    try {
      const user = JSON.parse(JSON.stringify(commonData.userAdmin))
      user.handle = undefined
      user.sub = 'admin'
      await service.createReviewProcess(user, data.data)
    } catch (err) {
      error = err
    }
    expect(stubScanAll).to.have.been.calledOnce
    expect(stubScanAll).to.have.been.calledWithExactly(ReviewProcess, data.options)
    expect(stubGetById).to.have.callCount(data.getByIdCount)
    expect(stubCreate).to.have.been.calledOnce
    expect(stubCreateExtra).to.have.been.calledOnce
    expect(stubCreateExtra).to.have.been.calledWithExactly(testData.index, stubCreate.getCall(0).args[1].id, data.result)
    expect(stubRemove).to.have.been.calledOnce
    expect(stubRemove).to.have.been.calledWithExactly(data.result)
    expect(error.message).to.eql('test')
  })
  it('T08:Partially update review process', async () => {
    const data = testData.T08
    const stubScanAll = sinon.stub(helper, 'scanAll').callsFake(async () => [])
    const stubGetById = sinon.stub(helper, 'getById').callsFake(async () => data.oldValue)
    const stubUpdate = sinon.stub(helper, 'update').callsFake(async () => data.result)
    const stubUpdateExtra = sinon.stub(ESClient, 'updateExtra').callsFake(async () => undefined)
    const result = await service.partiallyUpdateReviewProcess(commonData.userAdmin, data.id, data.data)
    expect(stubScanAll).to.have.been.calledOnce
    expect(stubScanAll).to.have.been.calledWithExactly(ReviewProcess, data.options)
    expect(stubGetById).to.have.callCount(data.getByIdCount)
    data.data.updatedBy = 'admin'
    expect(stubUpdate).to.have.been.calledOnce
    expect(stubUpdate).to.have.been.calledWithExactly(data.oldValue, data.data)
    expect(stubUpdateExtra).to.have.been.calledOnce
    expect(stubUpdateExtra).to.have.been.calledWithExactly(testData.index, data.id, data.result)
    expect(result).to.deep.eql(data.result)
  })
  it('T09:Partially update review process 2', async () => {
    const data = testData.T09
    const stubScanAll = sinon.stub(helper, 'scanAll').callsFake(async () => [])
    const stubGetById = sinon.stub(helper, 'getById').callsFake(async () => data.oldValue)
    const stubUpdate = sinon.stub(helper, 'update').callsFake(async () => data.result)
    const stubUpdateExtra = sinon.stub(ESClient, 'updateExtra').callsFake(async () => undefined)
    const result = await service.partiallyUpdateReviewProcess(commonData.userAdmin, data.id, data.data)
    expect(stubScanAll).to.have.been.calledOnce
    expect(stubScanAll).to.have.been.calledWithExactly(ReviewProcess, data.options)
    expect(stubGetById).to.have.callCount(data.getByIdCount)
    expect(stubUpdate).to.have.been.calledOnce
    data.data.updatedBy = 'admin'
    expect(stubUpdate).to.have.been.calledWithExactly(data.oldValue, data.data)
    expect(stubUpdateExtra).to.have.been.calledOnce
    expect(stubUpdateExtra).to.have.been.calledWithExactly(testData.index, data.id, data.result)
    expect(result).to.deep.eql(data.result)
  })
  it('T10:Fail to update review process', async () => {
    const data = testData.T10
    const stubGetById = sinon.stub(helper, 'getById').callsFake(async () => data.oldValue)
    const stubUpdate = sinon.stub(helper, 'update').callsFake(async () => data.result)
    const stubUpdateExtra = sinon.stub(ESClient, 'updateExtra').throws(new Error('test'))
    let error
    try {
      const user = JSON.parse(JSON.stringify(commonData.userAdmin))
      user.handle = undefined
      user.sub = 'admin'
      await service.partiallyUpdateReviewProcess(user, data.id, data.data)
    } catch (err) {
      error = err
    }
    expect(stubGetById).to.have.callCount(data.getByIdCount)
    expect(stubUpdate).to.have.been.calledTwice
    data.data.updatedBy = 'admin'
    expect(stubUpdate).to.have.been.calledWithExactly(data.oldValue, data.data)
    expect(stubUpdateExtra).to.have.been.calledOnce
    expect(stubUpdateExtra).to.have.been.calledWithExactly(testData.index, data.id, data.result)
    expect(stubUpdate).to.have.been.calledWithExactly(data.result, data.oldValue.originalItem())
    expect(error.message).to.eql('test')
  })
  it('T11:Fully update review process', async () => {
    const data = testData.T11
    const stubGetById = sinon.stub(helper, 'getById').callsFake(async () => data.oldValue)
    const stubUpdate = sinon.stub(helper, 'update').callsFake(async () => data.result)
    const stubUpdateExtra = sinon.stub(ESClient, 'updateExtra').callsFake(async () => undefined)
    const result = await service.fullyUpdateReviewProcess(commonData.userAdmin, data.id, data.data)
    expect(stubGetById).to.have.callCount(data.getByIdCount)
    expect(stubUpdate).to.have.been.calledOnce
    data.data.updatedBy = 'admin'
    expect(stubUpdate).to.have.been.calledWithExactly(data.oldValue, data.data)
    expect(stubUpdateExtra).to.have.been.calledOnce
    expect(stubUpdateExtra).to.have.been.calledWithExactly(testData.index, data.id, data.result)
    expect(result).to.deep.eql(data.result)
  })
  it('T12:Delete review process', async () => {
    const data = testData.T12
    const stubGetById = sinon.stub(helper, 'getById').callsFake(async () => data.value)
    const stubRemove = sinon.stub(helper, 'remove').callsFake(async () => undefined)
    const stubDeleteExtra = sinon.stub(ESClient, 'deleteExtra').callsFake(async () => undefined)
    const result = await service.deleteReviewProcess(data.id)
    expect(stubGetById).to.have.been.calledOnce
    expect(stubRemove).to.have.been.calledOnce
    expect(stubRemove).to.have.been.calledWithExactly(data.value)
    expect(stubDeleteExtra).to.have.been.calledOnce
    expect(stubDeleteExtra).to.have.been.calledWithExactly(testData.index, data.id)
    expect(result).to.deep.eql(data.value)
  })
  it('T13:Fail to delete review process', async () => {
    const data = testData.T13
    const stubGetById = sinon.stub(helper, 'getById').callsFake(async () => data.value)
    const stubRemove = sinon.stub(helper, 'remove').callsFake(async () => undefined)
    const stubDeleteExtra = sinon.stub(ESClient, 'deleteExtra').throws(new Error('test'))
    const stubCreate = sinon.stub(helper, 'create').callsFake(async () => undefined)
    let error
    try {
      await service.deleteReviewProcess(data.id)
    } catch (err) {
      error = err
    }
    expect(stubGetById).to.have.been.calledOnce
    expect(stubRemove).to.have.been.calledOnce
    expect(stubRemove).to.have.been.calledWithExactly(data.value)
    expect(stubDeleteExtra).to.have.been.calledOnce
    expect(stubDeleteExtra).to.have.been.calledWithExactly(testData.index, data.id)
    expect(stubCreate).to.have.been.calledOnce
    expect(stubCreate).to.have.been.calledWithExactly(ReviewProcess, data.value.originalItem())
    expect(error.message).to.eql('test')
  })
})
