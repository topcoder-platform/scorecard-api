const T01 = {
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
const T02 = {
  req: {
    authUser: {
      test: 1
    },
    body: {
      test: 1
    }
  },
  res: {
    status: function () {},
    send: function () {}
  },
  result: {
    test: 1
  }
}
const T03 = {
  req: {
    params: {
      scorecardId: 1
    }
  },
  res: {
    send: function () {}
  },
  result: {
    test: 1
  }
}
const T04 = {
  req: {
    authUser: {
      test: 1
    },
    body: {
      test: 1
    },
    params: {
      scorecardId: 1
    }
  },
  res: {
    send: function () {}
  },
  result: {
    test: 1
  }
}
const T05 = {
  req: {
    authUser: {
      test: 1
    },
    body: {
      test: 1
    },
    params: {
      scorecardId: 1
    }
  },
  res: {
    send: function () {}
  },
  result: {
    test: 1
  }
}
const T06 = {
  req: {
    params: {
      scorecardId: 1
    }
  },
  res: {
    send: function () {}
  },
  result: {
    test: 1
  }
}
module.exports = {
  T01,
  T02,
  T03,
  T04,
  T05,
  T06
}
