const config = require('config')

const index = config.ES.ES_INDEX_REVIEW_PROCESS
const type = config.ES.ES_INDEX_TYPE

const T01 = {
  criteria: {},
  esQuery: {
    index,
    type,
    body: {
      query: {
        bool: {
          must: [],
          filter: []
        }
      },
      from: 0,
      size: 20,
      sort: [{ _id: { order: 'asc' } }]
    }
  },
  esSearchResult: {
    body: {
      hits: {
        total: 2,
        hits: [
          {
            _source: {
              id: 'd3329d54-9448-477b-916c-53a0304c12a8',
              title: 'Topcoder Review',
              track: 'Design',
              type: 'type',
              status: 'pending',
              description: 'description',
              createdAt: '2021-10-06T10:06:45.828Z',
              createdBy: 'topcoder user',
              updatedAt: '2021-10-06T10:06:45.828Z',
              updatedBy: 'topcoder user',
              events: [
                {
                  eventType: '6f178d24-5f22-4f64-ac28-e1afc3654d80',
                  steps: [
                    {
                      stepType: 'd3824b5b-4ab7-4f5b-bcb2-ee1ba9dea48e',
                      weight: 100
                    }
                  ]
                }

              ]
            }
          },
          {
            _source: {
              id: 'f7e69f8d-3ac3-45b8-9266-1b453f3d2e29',
              title: 'Topcoder Review 2',
              track: 'Design',
              type: 'type',
              status: 'pending',
              description: 'description',
              createdAt: '2021-10-06T10:06:45.828Z',
              createdBy: 'topcoder user',
              updatedAt: '2021-10-06T10:06:45.828Z',
              updatedBy: 'topcoder user',
              events: [
                {
                  eventType: '6f178d24-5f22-4f64-ac28-e1afc3654d80',
                  steps: [
                    {
                      stepType: 'd3824b5b-4ab7-4f5b-bcb2-ee1ba9dea48e',
                      weight: 100
                    }
                  ]
                }

              ]
            }
          }
        ]
      }
    }
  },
  response: {
    total: 2,
    page: 1,
    perPage: 20,
    result: [
      {
        id: 'd3329d54-9448-477b-916c-53a0304c12a8',
        title: 'Topcoder Review',
        track: 'Design',
        type: 'type',
        status: 'pending',
        createdAt: '2021-10-06T10:06:45.828Z',
        createdBy: 'topcoder user',
        updatedAt: '2021-10-06T10:06:45.828Z',
        updatedBy: 'topcoder user'
      },
      {
        id: 'f7e69f8d-3ac3-45b8-9266-1b453f3d2e29',
        title: 'Topcoder Review 2',
        track: 'Design',
        type: 'type',
        status: 'pending',
        createdAt: '2021-10-06T10:06:45.828Z',
        createdBy: 'topcoder user',
        updatedAt: '2021-10-06T10:06:45.828Z',
        updatedBy: 'topcoder user'
      }
    ]
  }
}
const T02 = {
  criteria: {
    sortBy: 'title',
    sortOrder: 'desc',
    title: 'topcoder',
    track: 'Design',
    page: 1,
    perPage: 5
  },
  esQuery: {
    index,
    type,
    body: {
      query: {
        bool: {
          must: [
            {
              wildcard: {
                title: '*topcoder*'
              }
            }
          ],
          filter: [
            {
              terms: {
                track: ['Design']
              }
            }
          ]
        }
      },
      from: 0,
      size: 5,
      sort: [{ title: { order: 'desc' } }]
    }
  },
  esSearchResult: {
    body: {
      hits: {
        total: 2,
        hits: [
          {
            _source: {
              id: 'f7e69f8d-3ac3-45b8-9266-1b453f3d2e29',
              title: 'Topcoder Review 2',
              track: 'Design',
              type: 'type',
              status: 'pending',
              description: 'description',
              createdAt: '2021-10-06T10:06:45.828Z',
              createdBy: 'topcoder user',
              updatedAt: '2021-10-06T10:06:45.828Z',
              updatedBy: 'topcoder user',
              events: [
                {
                  eventType: '6f178d24-5f22-4f64-ac28-e1afc3654d80',
                  steps: [
                    {
                      stepType: 'd3824b5b-4ab7-4f5b-bcb2-ee1ba9dea48e',
                      weight: 100
                    }
                  ]
                }

              ]
            }
          },
          {
            _source: {
              id: 'd3329d54-9448-477b-916c-53a0304c12a8',
              title: 'Topcoder Review',
              track: 'Design',
              type: 'type',
              status: 'pending',
              description: 'description',
              createdAt: '2021-10-06T10:06:45.828Z',
              createdBy: 'topcoder user',
              updatedAt: '2021-10-06T10:06:45.828Z',
              updatedBy: 'topcoder user',
              events: [
                {
                  eventType: '6f178d24-5f22-4f64-ac28-e1afc3654d80',
                  steps: [
                    {
                      stepType: 'd3824b5b-4ab7-4f5b-bcb2-ee1ba9dea48e',
                      weight: 100
                    }
                  ]
                }

              ]
            }
          }
        ]
      }
    }
  },
  response: {
    total: 2,
    page: 1,
    perPage: 5,
    result: [
      {
        id: 'f7e69f8d-3ac3-45b8-9266-1b453f3d2e29',
        title: 'Topcoder Review 2',
        track: 'Design',
        type: 'type',
        status: 'pending',
        createdAt: '2021-10-06T10:06:45.828Z',
        createdBy: 'topcoder user',
        updatedAt: '2021-10-06T10:06:45.828Z',
        updatedBy: 'topcoder user'
      },
      {
        id: 'd3329d54-9448-477b-916c-53a0304c12a8',
        title: 'Topcoder Review',
        track: 'Design',
        type: 'type',
        status: 'pending',
        createdAt: '2021-10-06T10:06:45.828Z',
        createdBy: 'topcoder user',
        updatedAt: '2021-10-06T10:06:45.828Z',
        updatedBy: 'topcoder user'
      }
    ]
  }
}
const T03 = {
  id: 'd3329d54-9448-477b-916c-53a0304c12a8',
  esResult: {
    id: 'd3329d54-9448-477b-916c-53a0304c12a8',
    title: 'Topcoder Review',
    track: 'Design',
    type: 'type',
    status: 'pending',
    description: 'description',
    createdAt: '2021-10-06T10:06:45.828Z',
    createdBy: 'topcoder user',
    updatedAt: '2021-10-06T10:06:45.828Z',
    updatedBy: 'topcoder user',
    events: [
      {
        eventType: '6f178d24-5f22-4f64-ac28-e1afc3654d80',
        steps: [
          {
            stepType: 'd3824b5b-4ab7-4f5b-bcb2-ee1ba9dea48e',
            weight: 100
          }
        ]
      }

    ]
  },
  getExtraParam: [index, 'd3329d54-9448-477b-916c-53a0304c12a8']
}
const T04 = {
  data: {
    title: 'Topcoder Review',
    track: 'Design',
    type: 'type',
    status: 'pending',
    description: 'description',
    events: [
      {
        eventType: '6f178d24-5f22-4f64-ac28-e1afc3654d80',
        steps: [
          {
            stepType: 'd3824b5b-4ab7-4f5b-bcb2-ee1ba9dea48e',
            weight: 100
          }
        ]
      }

    ]
  },
  options: {
    title: { eq: 'Topcoder Review' },
    track: { eq: 'Design' }
  },
  getByIdCount: 2,
  result: {
    id: 'd3329d54-9448-477b-916c-53a0304c12a8',
    title: 'Topcoder Review',
    track: 'Design',
    type: 'type',
    status: 'pending',
    description: 'description',
    createdAt: '2021-10-06T10:06:45.828Z',
    createdBy: 'admin',
    updatedAt: '2021-10-06T10:06:45.828Z',
    events: [
      {
        eventType: '6f178d24-5f22-4f64-ac28-e1afc3654d80',
        steps: [
          {
            stepType: 'd3824b5b-4ab7-4f5b-bcb2-ee1ba9dea48e',
            weight: 100
          }
        ]
      }

    ]
  }
}
const T05 = {
  data: {
    title: 'Topcoder Review',
    track: 'Design',
    type: 'type',
    status: 'pending',
    description: 'description',
    events: [
      {
        eventType: '6f178d24-5f22-4f64-ac28-e1afc3654d80',
        steps: [
          {
            stepType: 'd3824b5b-4ab7-4f5b-bcb2-ee1ba9dea48e',
            weight: 50
          }
        ]
      }

    ]
  },
  httpStatus: 400,
  errorMessage: 'Following objects total weight must be 100\nevents[0].steps'
}
const T06 = {
  data: {
    title: 'Topcoder Review',
    track: 'Design',
    type: 'type',
    status: 'pending',
    description: 'description',
    events: [
      {
        eventType: '6f178d24-5f22-4f64-ac28-e1afc3654d80',
        steps: [
          {
            stepType: 'd3824b5b-4ab7-4f5b-bcb2-ee1ba9dea48e',
            weight: 100
          }
        ]
      }

    ]
  },
  options: {
    title: { eq: 'Topcoder Review' },
    track: { eq: 'Design' }
  },
  httpStatus: 400,
  errorMessage: 'There is already a review process with title: "Topcoder Review" and track: "Design"'
}
const T07 = {
  data: {
    title: 'Topcoder Review',
    track: 'Design',
    type: 'type',
    status: 'pending',
    description: 'description',
    events: [
      {
        eventType: '6f178d24-5f22-4f64-ac28-e1afc3654d80',
        steps: [
          {
            stepType: 'd3824b5b-4ab7-4f5b-bcb2-ee1ba9dea48e',
            weight: 100
          }
        ]
      }

    ]
  },
  options: {
    title: { eq: 'Topcoder Review' },
    track: { eq: 'Design' }
  },
  getByIdCount: 2,
  result: {
    id: 'd3329d54-9448-477b-916c-53a0304c12a8',
    title: 'Topcoder Review',
    track: 'Design',
    type: 'type',
    status: 'pending',
    description: 'description',
    createdAt: '2021-10-06T10:06:45.828Z',
    createdBy: 'admin',
    updatedAt: '2021-10-06T10:06:45.828Z',
    events: [
      {
        eventType: '6f178d24-5f22-4f64-ac28-e1afc3654d80',
        steps: [
          {
            stepType: 'd3824b5b-4ab7-4f5b-bcb2-ee1ba9dea48e',
            weight: 100
          }
        ]
      }

    ]
  }
}
const T08 = {
  id: 'd3329d54-9448-477b-916c-53a0304c12a8',
  data: {
    title: 'Topcoder Review new',
    track: 'Design',
    events: [
      {
        eventType: '6f178d24-5f22-4f64-ac28-e1afc3654d80',
        steps: [
          {
            stepType: 'd3824b5b-4ab7-4f5b-bcb2-ee1ba9dea48e',
            weight: 100
          }
        ]
      }

    ]
  },
  options: {
    title: { eq: 'Topcoder Review new' },
    track: { eq: 'Design' }
  },
  getByIdCount: 3,
  oldValue: {
    id: 'd3329d54-9448-477b-916c-53a0304c12a8',
    title: 'Topcoder Review',
    track: 'Design',
    type: 'type',
    status: 'pending',
    description: 'description',
    createdAt: '2021-10-06T10:06:45.828Z',
    createdBy: 'admin',
    updatedAt: '2021-10-06T10:06:45.828Z',
    events: [
      {
        eventType: '6f178d24-5f22-4f64-ac28-e1afc3654d80',
        steps: [
          {
            stepType: 'd3824b5b-4ab7-4f5b-bcb2-ee1ba9dea48e',
            weight: 100
          }
        ]
      }

    ]
  },
  result: {
    id: 'd3329d54-9448-477b-916c-53a0304c12a8',
    title: 'Topcoder Review new',
    track: 'Design',
    type: 'type',
    status: 'pending',
    description: 'description',
    createdAt: '2021-10-06T10:06:45.828Z',
    createdBy: 'admin',
    updatedAt: '2021-10-06T10:06:45.828Z',
    updatedBy: 'admin',
    events: [
      {
        eventType: '6f178d24-5f22-4f64-ac28-e1afc3654d80',
        steps: [
          {
            stepType: 'd3824b5b-4ab7-4f5b-bcb2-ee1ba9dea48e',
            weight: 100
          }
        ]
      }

    ]
  }
}
T08.oldValue.originalItem = () => T08.oldValue
const T09 = {
  id: 'd3329d54-9448-477b-916c-53a0304c12a8',
  data: {
    title: 'Topcoder Review',
    track: 'Develop'
  },
  options: {
    title: { eq: 'Topcoder Review' },
    track: { eq: 'Develop' }
  },
  getByIdCount: 1,
  oldValue: {
    id: 'd3329d54-9448-477b-916c-53a0304c12a8',
    title: 'Topcoder Review',
    track: 'Design',
    type: 'type',
    status: 'pending',
    description: 'description',
    createdAt: '2021-10-06T10:06:45.828Z',
    createdBy: 'admin',
    updatedAt: '2021-10-06T10:06:45.828Z',
    events: [
      {
        eventType: '6f178d24-5f22-4f64-ac28-e1afc3654d80',
        steps: [
          {
            stepType: 'd3824b5b-4ab7-4f5b-bcb2-ee1ba9dea48e',
            weight: 100
          }
        ]
      }

    ]
  },
  result: {
    id: 'd3329d54-9448-477b-916c-53a0304c12a8',
    title: 'Topcoder Review',
    track: 'Develop',
    type: 'type',
    status: 'pending',
    description: 'description',
    createdAt: '2021-10-06T10:06:45.828Z',
    createdBy: 'admin',
    updatedAt: '2021-10-06T10:06:45.828Z',
    updatedBy: 'admin',
    events: [
      {
        eventType: '6f178d24-5f22-4f64-ac28-e1afc3654d80',
        steps: [
          {
            stepType: 'd3824b5b-4ab7-4f5b-bcb2-ee1ba9dea48e',
            weight: 100
          }
        ]
      }

    ]
  }
}
T09.oldValue.originalItem = () => T09.oldValue
const T10 = {
  id: 'd3329d54-9448-477b-916c-53a0304c12a8',
  data: {
    status: 'pending'
  },
  getByIdCount: 1,
  oldValue: {
    id: 'd3329d54-9448-477b-916c-53a0304c12a8',
    title: 'Topcoder Review',
    track: 'Design',
    type: 'type',
    status: 'pending',
    description: 'description',
    createdAt: '2021-10-06T10:06:45.828Z',
    createdBy: 'admin',
    updatedAt: '2021-10-06T10:06:45.828Z',
    events: [
      {
        eventType: '6f178d24-5f22-4f64-ac28-e1afc3654d80',
        steps: [
          {
            stepType: 'd3824b5b-4ab7-4f5b-bcb2-ee1ba9dea48e',
            weight: 100
          }
        ]
      }

    ]
  },
  result: {
    id: 'd3329d54-9448-477b-916c-53a0304c12a8',
    title: 'Topcoder Review',
    track: 'Design',
    type: 'type',
    status: 'pending',
    description: 'description',
    createdAt: '2021-10-06T10:06:45.828Z',
    createdBy: 'admin',
    updatedAt: '2021-10-06T10:06:45.828Z',
    updatedBy: 'admin',
    events: [
      {
        eventType: '6f178d24-5f22-4f64-ac28-e1afc3654d80',
        steps: [
          {
            stepType: 'd3824b5b-4ab7-4f5b-bcb2-ee1ba9dea48e',
            weight: 100
          }
        ]
      }

    ]
  }
}
T10.oldValue.originalItem = () => T10.oldValue
const T11 = {
  id: 'd3329d54-9448-477b-916c-53a0304c12a8',
  data: {
    title: 'Topcoder Review',
    track: 'Design',
    type: 'type',
    status: 'pending',
    description: 'description',
    events: [
      {
        eventType: '6f178d24-5f22-4f64-ac28-e1afc3654d80',
        steps: [
          {
            stepType: 'd3824b5b-4ab7-4f5b-bcb2-ee1ba9dea48e',
            weight: 100
          }
        ]
      }

    ]
  },
  getByIdCount: 3,
  oldValue: {
    id: 'd3329d54-9448-477b-916c-53a0304c12a8',
    title: 'Topcoder Review',
    track: 'Design',
    type: 'type',
    status: 'pending',
    description: 'description',
    createdAt: '2021-10-06T10:06:45.828Z',
    createdBy: 'admin',
    updatedAt: '2021-10-06T10:06:45.828Z',
    events: [
      {
        eventType: '6f178d24-5f22-4f64-ac28-e1afc3654d80',
        steps: [
          {
            stepType: 'd3824b5b-4ab7-4f5b-bcb2-ee1ba9dea48e',
            weight: 100
          }
        ]
      }

    ]
  },
  result: {
    id: 'd3329d54-9448-477b-916c-53a0304c12a8',
    title: 'Topcoder Review',
    track: 'Design',
    type: 'type',
    status: 'pending',
    description: 'description',
    createdAt: '2021-10-06T10:06:45.828Z',
    createdBy: 'admin',
    updatedAt: '2021-10-06T10:06:45.828Z',
    updatedBy: 'admin',
    events: [
      {
        eventType: '6f178d24-5f22-4f64-ac28-e1afc3654d80',
        steps: [
          {
            stepType: 'd3824b5b-4ab7-4f5b-bcb2-ee1ba9dea48e',
            weight: 100
          }
        ]
      }

    ]
  }
}
T11.oldValue.originalItem = () => T11.oldValue
const T12 = {
  id: 'd3329d54-9448-477b-916c-53a0304c12a8',
  value: {
    id: 'd3329d54-9448-477b-916c-53a0304c12a8',
    title: 'Topcoder Review',
    track: 'Design',
    type: 'type',
    status: 'pending',
    description: 'description',
    createdAt: '2021-10-06T10:06:45.828Z',
    createdBy: 'admin',
    updatedAt: '2021-10-06T10:06:45.828Z',
    events: [
      {
        eventType: '6f178d24-5f22-4f64-ac28-e1afc3654d80',
        steps: [
          {
            stepType: 'd3824b5b-4ab7-4f5b-bcb2-ee1ba9dea48e',
            weight: 100
          }
        ]
      }

    ]
  }
}
const T13 = {
  id: 'd3329d54-9448-477b-916c-53a0304c12a8',
  value: {
    id: 'd3329d54-9448-477b-916c-53a0304c12a8',
    title: 'Topcoder Review',
    track: 'Design',
    type: 'type',
    status: 'pending',
    description: 'description',
    createdAt: '2021-10-06T10:06:45.828Z',
    createdBy: 'admin',
    updatedAt: '2021-10-06T10:06:45.828Z',
    events: [
      {
        eventType: '6f178d24-5f22-4f64-ac28-e1afc3654d80',
        steps: [
          {
            stepType: 'd3824b5b-4ab7-4f5b-bcb2-ee1ba9dea48e',
            weight: 100
          }
        ]
      }

    ]
  }
}
T13.value.originalItem = () => T13.value
module.exports = {
  index,
  type,
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
  T13
}
