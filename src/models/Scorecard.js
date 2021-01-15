/**
 * This defines Scorecard model.
 */
const config = require('config');
const dynamoose = require('dynamoose');

const Schema = dynamoose.Schema;

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
    scorecardDetails: {
      type: 'list',
      list: [
        {
          type: 'map',
          map: {
            scoreSystemId: String,
            weight: Number
          }
        }
      ],
      required: false
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
    timestamps: true // adds createdAt and updatedAt fields
  }
);

module.exports = schema;
