const T01 = {
  req: {},
  res: {
    send: function () {}
  },
  result: {
    checksRun: 1
  }
}
const T02 = {
  req: {},
  res: {},
  message: 'test',
  errorMessage: 'There is database operation error, test',
  httpStatus: 503
}
const T03 = {
  req: {},
  res: {},
  errorMessage: 'Database operation is slow.',
  httpStatus: 503
}
module.exports = {
  T01,
  T02,
  T03
}
