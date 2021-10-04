/**
 * This defines Review Process model.
 */
const config = require('config')
const dynamoose = require('dynamoose')
const _ = require('lodash')
const { ReviewProcessStatus } = require('../../app-constants')

const Schema = dynamoose.Schema

const schema = new Schema(
  {
    id: {
      type: String,
      hashKey: true,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    track: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: false
    },
    status: {
      type: String,
      required: true,
      validate: (s) => {
        let validStatuses = _.values(ReviewProcessStatus)
        return undefined === s || ~validStatuses.indexOf(s)
      }
    },
    description: {
      type: String,
      required: false
    },
    events: {
      type: Array,
      required: true,
      schema: [{
        type: Object,
        required: false,
        schema: {
          eventType: {
            type: String,
            required: true
          },
          steps: {
            type: Array,
            required: true,
            schema: [{
              type: Object,
              required: false,
              schema: {
                stepType: {
                  type: String,
                  required: true
                },
                weight: {
                  type: Number,
                  required: true
                }
              }
            }]
          }
        }
      }]
    },
    createdBy: {
      type: String,
      required: true
    },
    updatedBy: {
      type: String,
      required: false
    }
  },
  {
    throughput: {
      read: Number(config.AMAZON.DYNAMODB_READ_CAPACITY_UNITS),
      write: Number(config.AMAZON.DYNAMODB_WRITE_CAPACITY_UNITS)
    },
    timestamps: true
  }
)

module.exports = schema
