/*
 * Prepare for tests.
 */
const sinon = require('sinon')
const helper = require('../src/common/helper')
const commonData = require('./unit/common/CommonData')
sinon.stub(helper, 'getESClient').callsFake(() => commonData.ESClient)
require('../app-bootstrap')
