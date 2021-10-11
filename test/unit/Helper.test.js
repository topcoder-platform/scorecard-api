/* eslint-disable no-unused-expressions */
const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const rewire = require('rewire')
const helper = rewire('../../src/common/helper')
const testData = require('./common/HelperData')
const _ = require('lodash')
const expect = chai.expect
chai.use(sinonChai)

describe('helper test', () => {
  afterEach(() => {
    sinon.restore()
  })
  it('T01:AutoWrapExpress with sync function', () => {
    const data = testData.T01
    const res = helper.autoWrapExpress(data.fn)
    expect(data.fn).to.eql(res)
  })

  it('T02:AutoWrapExpress with async function', () => {
    const data = testData.T02
    const res = helper.autoWrapExpress(data.fn)
    res()
    expect(res).to.be.a('function')
  })

  it('T03:AutoWrapExpress with function array', () => {
    const data = testData.T03
    const res = helper.autoWrapExpress(data.fn)
    expect(res).to.be.a('array')
  })

  it('T04:AutoWrapExpress with object', () => {
    const data = testData.T04
    const res = helper.autoWrapExpress(data.obj)
    expect(res).to.be.a('object')
    expect(res.fn).to.be.a('function')
  })
  it('T05:Get es client', () => {
    const data = testData.T05
    const restore1 = helper.__set__('elasticsearch', data.elasticsearch)
    try {
      const res = helper.getESClient()
      expect(res).to.be.a('object')
      expect(res.test).to.eql('test')
    } finally {
      restore1()
    }
  })
  it('T06:Get es client 2', () => {
    const data = testData.T06
    const restore1 = helper.__set__('elasticsearch', data.elasticsearch)
    const restore2 = helper.__set__('esClient', undefined)
    const restore3 = helper.__set__('config', data.config)
    try {
      const res = helper.getESClient()
      expect(res).to.be.a('object')
      expect(res.test).to.eql('test')
    } finally {
      restore1()
      restore2()
      restore3()
    }
  })
  it('T07:Create with es client', async () => {
    const data = testData.T07
    const restore1 = helper.__set__('elasticsearch', data.elasticsearch)
    const restore2 = helper.__set__('esClient', undefined)
    try {
      const esClient = helper.getESClient()
      await esClient.createExtra()
      expect(esClient).to.be.a('object')
      expect(esClient.test).to.eql('test')
      expect(esClient.created).to.be.true
    } finally {
      restore1()
      restore2()
    }
  })
  it('T08:Fail to create with es client', async () => {
    const data = testData.T08
    const restore1 = helper.__set__('elasticsearch', data.elasticsearch)
    const restore2 = helper.__set__('esClient', undefined)
    const esClient = helper.getESClient()
    let error
    try {
      await esClient.createExtra('index', 'id')
    } catch (err) {
      error = err
    } finally {
      restore1()
      restore2()
    }
    expect(esClient).to.be.a('object')
    expect(esClient.test).to.eql('test')
    expect(esClient.created).to.be.false
    expect(error.message).to.eql('index with id: id already exists')
  })
  it('T09:Fail to create with es client 2', async () => {
    const data = testData.T09
    const restore1 = helper.__set__('elasticsearch', data.elasticsearch)
    const restore2 = helper.__set__('esClient', undefined)
    const esClient = helper.getESClient()
    let error
    try {
      await esClient.createExtra('index', 'id')
    } catch (err) {
      error = err
    } finally {
      restore1()
      restore2()
    }
    expect(esClient).to.be.a('object')
    expect(esClient.test).to.eql('test')
    expect(esClient.created).to.be.false
    expect(error.message).to.eql('test')
  })
  it('T10:Update with es client', async () => {
    const data = testData.T10
    const restore1 = helper.__set__('elasticsearch', data.elasticsearch)
    const restore2 = helper.__set__('esClient', undefined)
    try {
      const esClient = helper.getESClient()
      await esClient.updateExtra()
      expect(esClient).to.be.a('object')
      expect(esClient.test).to.eql('test')
      expect(esClient.updated).to.be.true
    } finally {
      restore1()
      restore2()
    }
  })
  it('T11:Fail to update with es client', async () => {
    const data = testData.T11
    const restore1 = helper.__set__('elasticsearch', data.elasticsearch)
    const restore2 = helper.__set__('esClient', undefined)
    const esClient = helper.getESClient()
    let error
    try {
      await esClient.updateExtra('index', 'id')
    } catch (err) {
      error = err
    } finally {
      restore1()
      restore2()
    }
    expect(esClient).to.be.a('object')
    expect(esClient.test).to.eql('test')
    expect(esClient.updated).to.be.false
    expect(error.message).to.eql("index with id: id doesn't exist")
  })
  it('T12:Fail to update with es client 2', async () => {
    const data = testData.T12
    const restore1 = helper.__set__('elasticsearch', data.elasticsearch)
    const restore2 = helper.__set__('esClient', undefined)
    const esClient = helper.getESClient()
    let error
    try {
      await esClient.updateExtra('index', 'id')
    } catch (err) {
      error = err
    } finally {
      restore1()
      restore2()
    }
    expect(esClient).to.be.a('object')
    expect(esClient.test).to.eql('test')
    expect(esClient.updated).to.be.false
    expect(error.message).to.eql('test')
  })
  it('T13:Delete with es client', async () => {
    const data = testData.T13
    const restore1 = helper.__set__('elasticsearch', data.elasticsearch)
    const restore2 = helper.__set__('esClient', undefined)
    try {
      const esClient = helper.getESClient()
      await esClient.deleteExtra()
      expect(esClient).to.be.a('object')
      expect(esClient.test).to.eql('test')
      expect(esClient.deleted).to.be.true
    } finally {
      restore1()
      restore2()
    }
  })
  it('T14:Fail to delete with es client', async () => {
    const data = testData.T14
    const restore1 = helper.__set__('elasticsearch', data.elasticsearch)
    const restore2 = helper.__set__('esClient', undefined)
    const esClient = helper.getESClient()
    let error
    try {
      await esClient.deleteExtra('index', 'id')
    } catch (err) {
      error = err
    } finally {
      restore1()
      restore2()
    }
    expect(esClient).to.be.a('object')
    expect(esClient.test).to.eql('test')
    expect(esClient.deleted).to.be.false
    expect(error.message).to.eql("index with id: id doesn't exist")
  })
  it('T15:Fail to delete with es client 2', async () => {
    const data = testData.T15
    const restore1 = helper.__set__('elasticsearch', data.elasticsearch)
    const restore2 = helper.__set__('esClient', undefined)
    const esClient = helper.getESClient()
    let error
    try {
      await esClient.deleteExtra('index', 'id')
    } catch (err) {
      error = err
    } finally {
      restore1()
      restore2()
    }
    expect(esClient).to.be.a('object')
    expect(esClient.test).to.eql('test')
    expect(esClient.deleted).to.be.false
    expect(error.message).to.eql('test')
  })
  it('T16:Get with es client', async () => {
    const data = testData.T16
    const restore1 = helper.__set__('elasticsearch', data.elasticsearch)
    const restore2 = helper.__set__('esClient', undefined)
    try {
      const esClient = helper.getESClient()
      const result = await esClient.getExtra()
      expect(esClient).to.be.a('object')
      expect(esClient.test).to.eql('test')
      expect(result).to.eql('test')
    } finally {
      restore1()
      restore2()
    }
  })
  it('T17:Fail to get with es client', async () => {
    const data = testData.T17
    const restore1 = helper.__set__('elasticsearch', data.elasticsearch)
    const restore2 = helper.__set__('esClient', undefined)
    const esClient = helper.getESClient()
    let error
    try {
      await esClient.getExtra('index', 'id')
    } catch (err) {
      error = err
    } finally {
      restore1()
      restore2()
    }
    expect(esClient).to.be.a('object')
    expect(esClient.test).to.eql('test')
    expect(error.message).to.eql("index with id: id doesn't exist")
  })
  it('T18:Fail to get with es client 2', async () => {
    const data = testData.T18
    const restore1 = helper.__set__('elasticsearch', data.elasticsearch)
    const restore2 = helper.__set__('esClient', undefined)
    const esClient = helper.getESClient()
    let error
    try {
      await esClient.getExtra('index', 'id')
    } catch (err) {
      error = err
    } finally {
      restore1()
      restore2()
    }
    expect(esClient).to.be.a('object')
    expect(esClient.test).to.eql('test')
    expect(error.message).to.eql('test')
  })
  it('T19:Create index', async () => {
    const data = testData.T19
    const restore = helper.__set__('esClient', data.esClient)
    try {
      await helper.createIndex('index', 'type', data.logger)
    } finally {
      restore()
    }
  })
  it('T20:Delete index', async () => {
    const data = testData.T20
    const restore = helper.__set__('esClient', data.esClient)
    try {
      await helper.deleteIndex('index', data.logger)
    } finally {
      restore()
    }
  })
  it('T21:Check if exists 1', () => {
    const data = testData.T21
    const result = helper.checkIfExists(data.source, data.term)
    expect(result).to.eql(data.result)
  })
  it('T22:Check if exists 2', () => {
    const data = testData.T22
    const result = helper.checkIfExists(data.source, data.term)
    expect(result).to.eql(data.result)
  })
  it('T23:Check if exists 3', () => {
    const data = testData.T23
    let error
    try {
      helper.checkIfExists(data.source, data.term)
    } catch (err) {
      error = err
    }
    expect(error.message).to.eql(data.message)
  })
  it('T24:check if exists 4', () => {
    const data = testData.T24
    let error
    try {
      helper.checkIfExists(data.source, data.term)
    } catch (err) {
      error = err
    }
    expect(error.message).to.eql(data.message)
  })
  it('T25:Set response headers', () => {
    const data = testData.T25
    helper.setResHeaders(data.req, data.res, data.result)
    expect(data.headers).to.eql(data.expected)
  })
  it('T26:Set response headers 2', () => {
    const data = testData.T26
    helper.setResHeaders(data.req, data.res, data.result)
    expect(data.headers).to.eql(data.expected)
  })
  it('T27:Set response headers 3', () => {
    const data = testData.T27
    helper.setResHeaders(data.req, data.res, data.result)
    expect(data.headers).to.eql(data.expected)
  })
  it('T28:Get by id', async () => {
    const data = testData.T28
    const result = await helper.getById(data.model, data.modelName, data.id, data.ErrorClass)
    expect(result).to.eql(data.result)
  })
  it('T29:Fail to get by id', async () => {
    const data = testData.T29
    let error
    try {
      await helper.getById(data.model, data.modelName, data.id)
    } catch (err) {
      error = err
    }
    expect(error.message).to.eql(data.message)
  })
  it('T30:Fail to get by id 2', async () => {
    const data = testData.T30
    let error
    try {
      await helper.getById(data.model, data.modelName, data.id)
    } catch (err) {
      error = err
    }
    expect(error.message).to.eql(data.message)
  })
  it('T31:Create', async () => {
    const data = testData.T31
    const result = await helper.create(data.model, data.data)
    expect(result).to.eql(data.result)
  })
  it('T32:Fail to create', async () => {
    const data = testData.T32
    let error
    try {
      await helper.create(data.model, data.data)
    } catch (err) {
      error = err
    }
    expect(error.message).to.eql(data.message)
  })
  it('T33:Update', async () => {
    const data = testData.T33
    const result = await helper.update(data.model, data.data)
    expect(result).to.eql(_.assignIn(data.model, data.data))
  })
  it('T34:Fail to update', async () => {
    const data = testData.T34
    let error
    try {
      await helper.update(data.model, data.data)
    } catch (err) {
      error = err
    }
    expect(error.message).to.eql(data.message)
  })
  it('T35:Remove', async () => {
    const data = testData.T35
    const result = await helper.remove(data.model)
    expect(result).to.eql(data.model)
  })
  it('T36:Fail to remove', async () => {
    const data = testData.T36
    let error
    try {
      await helper.remove(data.model)
    } catch (err) {
      error = err
    }
    expect(error.message).to.eql(data.message)
  })
  it('T37:Scan all', async () => {
    const data = testData.T37
    const results = await helper.scanAll(data.model)
    expect(results).to.eql(data.results)
  })
  it('T38:Clean result 1', () => {
    const data = testData.T38
    const results = helper.cleanResult(data.result, data.include, data.exclude)
    expect(results).to.eql(data.results)
  })
  it('T39:Clean result 2', () => {
    const data = testData.T39
    const results = helper.cleanResult(data.result, data.include, data.exclude)
    expect(results).to.eql(data.results)
  })
  it('T40:Clean result 3', () => {
    const data = testData.T40
    const results = helper.cleanResult(data.result, data.include, data.exclude)
    expect(results).to.eql(data.results)
  })
  it('T41:Clean result 4', () => {
    const data = testData.T41
    const results = helper.cleanResult(data.result, data.include, data.exclude)
    expect(results).to.eql(data.results)
  })
  it('T42:Clean result 5', () => {
    const data = testData.T42
    const results = helper.cleanResult(data.result, data.include, data.exclude)
    expect(results).to.eql(data.results)
  })
  it('T43:Clean result 6', () => {
    const data = testData.T43
    const results = helper.cleanResult(data.result, data.include, data.exclude)
    expect(results).to.eql(data.results)
  })
})
