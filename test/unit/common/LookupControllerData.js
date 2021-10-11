const T01 = {
  req: {},
  res: {
    send: function () {}
  },
  result: {
    test: 1
  }
}
const T02 = {
  req: {
    query: 'test'
  },
  res: {
    send: function () {}
  },
  result: {
    result: {
      test: 1
    }
  }
}
module.exports = {
  T01,
  T02
}
