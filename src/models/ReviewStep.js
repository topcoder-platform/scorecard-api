/**
 * This defines ReviewStep model.
 */
const config = require('config')
const dynamoose = require('dynamoose')

const Schema = dynamoose.Schema

const schema = new Schema(
  {
    id: {
      type: String,
      hashKey: true,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    nameToLower: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: true
    }
  },
  {
    throughput: {
      read: Number(config.AMAZON.DYNAMODB_READ_CAPACITY_UNITS),
      write: Number(config.AMAZON.DYNAMODB_WRITE_CAPACITY_UNITS)
    },
    timestamps: false
  }
)

module.exports = schema
