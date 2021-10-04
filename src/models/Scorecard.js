/**
 * This defines Scorecard model.
 */
const config = require('config')
const dynamoose = require('dynamoose')
const _ = require('lodash')
const { ScorecardStatus, ScorecardQuestionTypes } = require('../../app-constants')

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
        let validStatuses = _.values(ScorecardStatus)
        return undefined === s || ~validStatuses.indexOf(s)
      }
    },
    description: {
      type: String,
      required: false
    },
    groups: {
      type: Array,
      required: true,
      schema: [{
        type: Object,
        required: false,
        schema: {
          name: {
            type: String,
            required: true
          },
          weight: {
            type: Number,
            required: true
          },
          sections: {
            type: Array,
            required: true,
            schema: [{
              type: Object,
              required: false,
              schema: {
                name: {
                  type: String,
                  required: true
                },
                weight: {
                  type: Number,
                  required: true
                },
                questions: {
                  type: Array,
                  required: true,
                  schema: [{
                    type: Object,
                    required: false,
                    schema: {
                      questionText: {
                        type: String,
                        required: true
                      },
                      questionGuidelines: {
                        type: String,
                        required: true
                      },
                      questionType: {
                        type: String,
                        required: true,
                        validate: (s) => {
                          let validStatuses = _.values(ScorecardQuestionTypes)
                          return undefined === s || ~validStatuses.indexOf(s)
                        }
                      },
                      weight: {
                        type: Number,
                        required: true
                      },
                      isUpload: {
                        type: Boolean,
                        required: true
                      }
                    }
                  }]
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
