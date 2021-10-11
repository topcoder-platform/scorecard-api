const T01 = {
  fn: function () { return null }
}
const T02 = {
  fn: async function () { return null }
}
const T03 = {
  fn: [
    function () { return null }
  ]
}
const T04 = {
  obj: {
    fn: function () { return null }
  }
}
const T05 = {
  elasticsearch: {
    Client: class client {
      constructor () {
        this.test = 'test'
      }
    }
  }
}
const T06 = {
  config: {
    get: function () {},
    ES: {
      ELASTICCLOUD: {
        id: '123'
      }
    }
  },
  elasticsearch: {
    Client: class client {
      constructor () {
        this.test = 'test'
      }
    }
  }
}
const T07 = {
  elasticsearch: {
    Client: class client {
      constructor () {
        this.test = 'test'
        this.created = false
      }
      async create () {
        this.created = true
      }
    }
  }
}
const T08 = {
  elasticsearch: {
    Client: class client {
      constructor () {
        this.test = 'test'
        this.created = false
      }
      async create () {
        const error = new Error()
        error.statusCode = 409
        throw error
      }
    }
  }
}
const T09 = {
  elasticsearch: {
    Client: class client {
      constructor () {
        this.test = 'test'
        this.created = false
      }
      async create () {
        throw new Error('test')
      }
    }
  }
}
const T10 = {
  elasticsearch: {
    Client: class client {
      constructor () {
        this.test = 'test'
        this.updated = false
      }
      async update () {
        this.updated = true
      }
    }
  }
}
const T11 = {
  elasticsearch: {
    Client: class client {
      constructor () {
        this.test = 'test'
        this.updated = false
      }
      async update () {
        const error = new Error()
        error.statusCode = 404
        throw error
      }
    }
  }
}
const T12 = {
  elasticsearch: {
    Client: class client {
      constructor () {
        this.test = 'test'
        this.updated = false
      }
      async update () {
        throw new Error('test')
      }
    }
  }
}
const T13 = {
  elasticsearch: {
    Client: class client {
      constructor () {
        this.test = 'test'
        this.deleted = false
      }
      async delete () {
        this.deleted = true
      }
    }
  }
}
const T14 = {
  elasticsearch: {
    Client: class client {
      constructor () {
        this.test = 'test'
        this.deleted = false
      }
      async delete () {
        const error = new Error()
        error.statusCode = 404
        throw error
      }
    }
  }
}
const T15 = {
  elasticsearch: {
    Client: class client {
      constructor () {
        this.test = 'test'
        this.deleted = false
      }
      async delete () {
        throw new Error('test')
      }
    }
  }
}
const T16 = {
  elasticsearch: {
    Client: class client {
      constructor () {
        this.test = 'test'
      }
      async getSource () {
        return { body: 'test' }
      }
    }
  }
}
const T17 = {
  elasticsearch: {
    Client: class client {
      constructor () {
        this.test = 'test'
      }
      async getSource () {
        const error = new Error()
        error.statusCode = 404
        throw error
      }
    }
  }
}
const T18 = {
  elasticsearch: {
    Client: class client {
      constructor () {
        this.test = 'test'
      }
      async getSource () {
        throw new Error('test')
      }
    }
  }
}
const T19 = {
  esClient: {
    indices: {
      create: async function () {},
      close: async function () {},
      putSettings: async function () {},
      open: async function () {},
      putMapping: async function () {}
    }
  },
  logger: {
    info: function () {}
  }
}
const T20 = {
  esClient: {
    indices: {
      delete: async function () {}
    }
  },
  logger: {
    info: function () {}
  }
}
const T21 = {
  source: ['3', '2', '1'],
  term: '1',
  result: true
}
const T22 = {
  source: ['3', '2', '1'],
  term: ['0'],
  result: false
}
const T23 = {
  source: 3,
  term: ['0'],
  message: 'Source argument should be an array'
}
const T24 = {
  source: ['3'],
  term: 3,
  message: 'Term argument should be either a string or an array'
}
const T25 = {
  headers: [],
  req: {
    query: { name: 'a' }
  },
  res: {
    set: function (x, y) { T25.headers.push({ x, y }) }
  },
  result: {
    total: 30,
    page: 2,
    perPage: 10
  },
  expected: [ { x: 'X-Prev-Page', y: 1 },
    { x: 'X-Next-Page', y: 3 },
    { x: 'X-Page', y: 2 },
    { x: 'X-Per-Page', y: 10 },
    { x: 'X-Total', y: 30 },
    { x: 'X-Total-Pages', y: 3 },
    { x: 'Link',
      y:
     '<http://localhost:3000undefined?name=a&page=1>; rel="first", <http://localhost:3000undefined?name=a&page=3>; rel="last", <http://localhost:3000undefined?name=a&page=1>; rel="prev", <http://localhost:3000undefined?name=a&page=3>; rel="next"' } ]
}
const T26 = {
  headers: [],
  req: {
    query: { name: 'a' }
  },
  res: {
    set: function (x, y) { T25.headers.push({ x, y }) }
  },
  result: {
    total: 5,
    page: 1,
    perPage: 10
  },
  expected: []
}
const T27 = {
  headers: [],
  req: {
    query: { name: 'a' }
  },
  res: {
    set: function (x, y) { T25.headers.push({ x, y }) }
  },
  result: {
    total: 0,
    page: 1,
    perPage: 10
  },
  expected: []
}
const T28 = {
  model: {
    get: function (id, cb) { cb(undefined, T28.result) }
  },
  modelName: 'model',
  id: '6bf94340-57eb-4fbe-aa64-c4e0c10ceddb',
  result: 'test',
  ErrorClass: Error
}
const T29 = {
  model: {
    get: function (id, cb) { cb(undefined, undefined) }
  },
  modelName: 'model',
  id: '6bf94340-57eb-4fbe-aa64-c4e0c10ceddb',
  message: "model with id: 6bf94340-57eb-4fbe-aa64-c4e0c10ceddb doesn't exist"
}
const T30 = {
  model: {
    get: function (id, cb) { cb(new Error('test'), undefined) }
  },
  modelName: 'model',
  id: '6bf94340-57eb-4fbe-aa64-c4e0c10ceddb',
  message: 'test'
}
const T31 = {
  model: {
    create: function (data, cb) { cb(undefined, T31.result) }
  },
  data: 'data',
  result: 'test'
}
const T32 = {
  model: {
    create: function (data, cb) { cb(new Error('test'), undefined) }
  },
  data: 'data',
  message: 'test'
}
const T33 = {
  model: {
    save: function (cb) { cb() }
  },
  data: {
    test: 1
  }
}
const T34 = {
  model: {
    save: function (cb) { cb(new Error('test')) }
  },
  data: {
    test: 1
  },
  message: 'test'
}
const T35 = {
  model: {
    delete: function (cb) { cb() }
  }
}
const T36 = {
  model: {
    delete: function (cb) { cb(new Error('test')) }
  },
  message: 'test'
}
const T37 = {
  model: {
    scan: function () { return T37.model },
    startAt: function () {
      T37.result.lastKey = undefined
      return T37.model
    },
    exec: async function () { return T37.result }
  },
  result: [1, 2, 3],
  results: [1, 2, 3, 1, 2, 3]
}
T37.result.lastKey = 1
const T38 = {
  result: undefined,
  results: {}
}
const T39 = {
  result: [],
  results: []
}
const T40 = {
  result: [
    {
      a: 1,
      b: 2
    },
    {
      a: 1,
      b: 2
    }
  ],
  include: ['a'],
  results: [
    {
      a: 1
    },
    {
      a: 1
    }
  ]
}
const T41 = {
  result: [
    {
      a: 1,
      b: 2
    },
    {
      a: 1,
      b: 2
    }
  ],
  exclude: ['a'],
  results: [
    {
      b: 2
    },
    {
      b: 2
    }
  ]
}
const T42 = {
  result: {
    a: 1,
    b: 2
  },
  include: ['a'],
  results: {
    a: 1
  }
}
const T43 = {
  result: {
    a: 1,
    b: 2
  },
  exclude: ['a'],
  results: {
    b: 2
  }
}

module.exports = {
  T01,
  T02,
  T03,
  T04,
  T05,
  T06,
  T07,
  T08,
  T09,
  T10,
  T11,
  T12,
  T13,
  T14,
  T15,
  T16,
  T17,
  T18,
  T19,
  T20,
  T21,
  T22,
  T23,
  T24,
  T25,
  T26,
  T27,
  T28,
  T29,
  T30,
  T31,
  T32,
  T33,
  T34,
  T35,
  T36,
  T37,
  T38,
  T39,
  T40,
  T41,
  T42,
  T43
}
