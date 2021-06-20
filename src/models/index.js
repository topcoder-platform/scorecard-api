/**
 * Initialize and export all model schemas.
 */

const config = require('config')
const dynamoose = require('dynamoose')

dynamoose.AWS.config.update({
  region: config.AMAZON.AWS_REGION
})

dynamoose.setDefaults({
  create: false,
  update: false,
  waitForActive: false
})

const exportObj = {}
// table name is model name
exportObj[config.AMAZON.DYNAMODB_SCORE_SYSTEM_TABLE] = dynamoose.model(
  config.AMAZON.DYNAMODB_SCORE_SYSTEM_TABLE,
  require('./ScoreSystem')
)
exportObj[config.AMAZON.DYNAMODB_SCORECARD_TABLE] = dynamoose.model(
  config.AMAZON.DYNAMODB_SCORECARD_TABLE,
  require('./Scorecard')
)

module.exports = exportObj
