/**
 * Initialize and export all model schemas.
 */

const config = require('config')
const dynamoose = require('dynamoose')

dynamoose.AWS.config.update({
  accessKeyId: config.AMAZON.AWS_ACCESS_KEY_ID,
  secretAccessKey: config.AMAZON.AWS_SECRET_ACCESS_KEY,
  region: config.AMAZON.AWS_REGION
})

if (config.AMAZON.IS_LOCAL_DB) {
  dynamoose.local(config.AMAZON.DYNAMODB_URL)
}

dynamoose.setDefaults({
  create: false,
  update: false,
  waitForActive: false
})

const exportObj = {}
// table name is model name
exportObj[config.AMAZON.DYNAMODB_SCORE_SYSTEM_TABLE] =
  dynamoose.model(config.AMAZON.DYNAMODB_SCORE_SYSTEM_TABLE, require('./ScoreSystem'))
exportObj[config.AMAZON.DYNAMODB_SCORECARD_TABLE] =
  dynamoose.model(config.AMAZON.DYNAMODB_SCORECARD_TABLE, require('./Scorecard'))

module.exports = exportObj
