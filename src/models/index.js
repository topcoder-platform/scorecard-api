/**
 * Initialize and export all model schemas.
 */

const config = require('config')
const dynamoose = require('dynamoose')

const awsConfig = config.AMAZON.IS_LOCAL_DB ? {
  accessKeyId: config.AMAZON.AWS_ACCESS_KEY_ID,
  secretAccessKey: config.AMAZON.AWS_SECRET_ACCESS_KEY,
  region: config.AMAZON.AWS_REGION
} : {
  region: config.AMAZON.AWS_REGION
}

dynamoose.AWS.config.update(awsConfig)

if (config.AMAZON.IS_LOCAL_DB) {
  dynamoose.local(config.AMAZON.DYNAMODB_URL)
}

dynamoose.setDefaults({
  create: false,
  update: false,
  waitForActive: false
})

module.exports = {
  ProcessEventType: dynamoose.model('ProcessEventType', require('./ProcessEventType')),
  ReviewStep: dynamoose.model('ReviewStep', require('./ReviewStep')),
  Scorecard: dynamoose.model('Scorecard', require('./Scorecard')),
  ReviewProcess: dynamoose.model('ReviewProcess', require('./ReviewProcess'))
}
