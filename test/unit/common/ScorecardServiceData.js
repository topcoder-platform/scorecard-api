const config = require('config')

const index = config.ES.ES_INDEX_SCORECARD
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
              'description': 'description',
              'title': 'Topcoder Challenge',
              'track': 'Design',
              'type': 'Custom',
              'status': 'pending',
              'groups': [
                {
                  'name': 'Copyright and Licenses',
                  'weight': 100,
                  'sections': [
                    {
                      'name': 'Stock Art',
                      'weight': 100,
                      'questions': [
                        {
                          'questionText': 'If stockart is allowed in this contest, are all elements photographs',
                          'questionGuidelines': 'If stockart is allowed in this contest, are all elements photographs',
                          'questionType': 'Scale1-4',
                          'weight': 100,
                          'isUpload': true
                        }
                      ]
                    }
                  ]
                }
              ],
              'id': 'e242b4a2-1341-48a0-a559-647c21eefe42',
              'createdBy': 'TonyJ',
              'createdAt': '2021-10-06T21:34:59.190Z',
              'updatedAt': '2021-10-06T21:34:59.190Z'
            }
          },
          {
            _source: {
              'description': 'description',
              'title': 'Topcoder Challenge 2',
              'track': 'Develop',
              'type': 'Custom',
              'status': 'pending',
              'groups': [
                {
                  'name': 'Copyright and Licenses',
                  'weight': 100,
                  'sections': [
                    {
                      'name': 'Stock Art',
                      'weight': 100,
                      'questions': [
                        {
                          'questionText': 'If stockart is allowed in this contest, are all elements photographs',
                          'questionGuidelines': 'If stockart is allowed in this contest, are all elements photographs',
                          'questionType': 'Scale1-4',
                          'weight': 100,
                          'isUpload': true
                        }
                      ]
                    }
                  ]
                }
              ],
              'id': 'f132ab52-8234-4e17-9840-d0689103a3b4',
              'createdBy': 'callmekatootie',
              'createdAt': '2021-10-06T21:36:11.155Z',
              'updatedAt': '2021-10-06T21:36:11.155Z'
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
        'id': 'e242b4a2-1341-48a0-a559-647c21eefe42',
        'title': 'Topcoder Challenge',
        'track': 'Design',
        'type': 'Custom',
        'status': 'pending',
        'createdAt': '2021-10-06T21:34:59.190Z',
        'createdBy': 'TonyJ',
        'updatedAt': '2021-10-06T21:34:59.190Z'
      },
      {
        'id': 'f132ab52-8234-4e17-9840-d0689103a3b4',
        'title': 'Topcoder Challenge 2',
        'track': 'Develop',
        'type': 'Custom',
        'status': 'pending',
        'createdAt': '2021-10-06T21:36:11.155Z',
        'createdBy': 'callmekatootie',
        'updatedAt': '2021-10-06T21:36:11.155Z'
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
        total: 1,
        hits: [
          {
            _source: {
              'description': 'description',
              'title': 'Topcoder Challenge',
              'track': 'Design',
              'type': 'Custom',
              'status': 'pending',
              'groups': [
                {
                  'name': 'Copyright and Licenses',
                  'weight': 100,
                  'sections': [
                    {
                      'name': 'Stock Art',
                      'weight': 100,
                      'questions': [
                        {
                          'questionText': 'If stockart is allowed in this contest, are all elements photographs',
                          'questionGuidelines': 'If stockart is allowed in this contest, are all elements photographs',
                          'questionType': 'Scale1-4',
                          'weight': 100,
                          'isUpload': true
                        }
                      ]
                    }
                  ]
                }
              ],
              'id': 'e242b4a2-1341-48a0-a559-647c21eefe42',
              'createdBy': 'TonyJ',
              'createdAt': '2021-10-06T21:34:59.190Z',
              'updatedAt': '2021-10-06T21:34:59.190Z'
            }
          }
        ]
      }
    }
  },
  response: {
    total: 1,
    page: 1,
    perPage: 5,
    result: [
      {
        'id': 'e242b4a2-1341-48a0-a559-647c21eefe42',
        'title': 'Topcoder Challenge',
        'track': 'Design',
        'type': 'Custom',
        'status': 'pending',
        'createdAt': '2021-10-06T21:34:59.190Z',
        'createdBy': 'TonyJ',
        'updatedAt': '2021-10-06T21:34:59.190Z'
      }
    ]
  }
}
const T03 = {
  id: 'e242b4a2-1341-48a0-a559-647c21eefe42',
  esResult: {
    'description': 'description',
    'title': 'Topcoder Challenge',
    'track': 'Design',
    'type': 'Custom',
    'status': 'pending',
    'groups': [
      {
        'name': 'Copyright and Licenses',
        'weight': 100,
        'sections': [
          {
            'name': 'Stock Art',
            'weight': 100,
            'questions': [
              {
                'questionText': 'If stockart is allowed in this contest, are all elements photographs',
                'questionGuidelines': 'If stockart is allowed in this contest, are all elements photographs',
                'questionType': 'Scale1-4',
                'weight': 100,
                'isUpload': true
              }
            ]
          }
        ]
      }
    ],
    'id': 'e242b4a2-1341-48a0-a559-647c21eefe42',
    'createdBy': 'TonyJ',
    'createdAt': '2021-10-06T21:34:59.190Z',
    'updatedAt': '2021-10-06T21:34:59.190Z'
  }
}
const T04 = {
  data: {
    'description': 'description',
    'title': 'Topcoder Challenge',
    'track': 'Design',
    'type': 'Custom',
    'status': 'pending',
    'groups': [
      {
        'name': 'Copyright and Licenses',
        'weight': 100,
        'sections': [
          {
            'name': 'Stock Art',
            'weight': 100,
            'questions': [
              {
                'questionText': 'If stockart is allowed in this contest, are all elements photographs',
                'questionGuidelines': 'If stockart is allowed in this contest, are all elements photographs',
                'questionType': 'Scale1-4',
                'weight': 100,
                'isUpload': true
              }
            ]
          }
        ]
      }
    ]
  },
  options: {
    title: { eq: 'Topcoder Challenge' },
    track: { eq: 'Design' }
  },
  result: {
    'description': 'description',
    'title': 'Topcoder Challenge',
    'track': 'Design',
    'type': 'Custom',
    'status': 'pending',
    'groups': [
      {
        'name': 'Copyright and Licenses',
        'weight': 100,
        'sections': [
          {
            'name': 'Stock Art',
            'weight': 100,
            'questions': [
              {
                'questionText': 'If stockart is allowed in this contest, are all elements photographs',
                'questionGuidelines': 'If stockart is allowed in this contest, are all elements photographs',
                'questionType': 'Scale1-4',
                'weight': 100,
                'isUpload': true
              }
            ]
          }
        ]
      }
    ],
    'id': 'e242b4a2-1341-48a0-a559-647c21eefe42',
    'createdBy': 'TonyJ',
    'createdAt': '2021-10-06T21:34:59.190Z',
    'updatedAt': '2021-10-06T21:34:59.190Z'
  }
}
const T05 = {
  data: {
    'description': 'description',
    'title': 'Topcoder Challenge',
    'track': 'Design',
    'type': 'Custom',
    'status': 'pending',
    'groups': [
      {
        'name': 'Copyright and Licenses',
        'weight': 50,
        'sections': [
          {
            'name': 'Stock Art',
            'weight': 50,
            'questions': [
              {
                'questionText': 'If stockart is allowed in this contest, are all elements photographs',
                'questionGuidelines': 'If stockart is allowed in this contest, are all elements photographs',
                'questionType': 'Scale1-4',
                'weight': 50,
                'isUpload': true
              }
            ]
          }
        ]
      }
    ]
  },
  httpStatus: 400,
  errorMessage: 'Following objects total weight must be 100\ngroups[0].sections[0].questions\ngroups[0].sections\ngroups'
}
const T06 = {
  data: {
    'description': 'description',
    'title': 'Topcoder Challenge',
    'track': 'Design',
    'type': 'Custom',
    'status': 'pending',
    'groups': [
      {
        'name': 'Copyright and Licenses',
        'weight': 100,
        'sections': [
          {
            'name': 'Stock Art',
            'weight': 100,
            'questions': [
              {
                'questionText': 'If stockart is allowed in this contest, are all elements photographs',
                'questionGuidelines': 'If stockart is allowed in this contest, are all elements photographs',
                'questionType': 'Scale1-4',
                'weight': 100,
                'isUpload': true
              }
            ]
          }
        ]
      }
    ]
  },
  options: {
    title: { eq: 'Topcoder Challenge' },
    track: { eq: 'Design' }
  },
  httpStatus: 400,
  errorMessage: 'There is already a scorecard with title: "Topcoder Challenge" and track: "Design"'
}
const T07 = {
  data: {
    'description': 'description',
    'title': 'Topcoder Challenge',
    'track': 'Design',
    'type': 'Custom',
    'status': 'pending',
    'groups': [
      {
        'name': 'Copyright and Licenses',
        'weight': 100,
        'sections': [
          {
            'name': 'Stock Art',
            'weight': 100,
            'questions': [
              {
                'questionText': 'If stockart is allowed in this contest, are all elements photographs',
                'questionGuidelines': 'If stockart is allowed in this contest, are all elements photographs',
                'questionType': 'Scale1-4',
                'weight': 100,
                'isUpload': true
              }
            ]
          }
        ]
      }
    ]
  },
  options: {
    title: { eq: 'Topcoder Challenge' },
    track: { eq: 'Design' }
  },
  result: {
    'description': 'description',
    'title': 'Topcoder Challenge',
    'track': 'Design',
    'type': 'Custom',
    'status': 'pending',
    'groups': [
      {
        'name': 'Copyright and Licenses',
        'weight': 100,
        'sections': [
          {
            'name': 'Stock Art',
            'weight': 100,
            'questions': [
              {
                'questionText': 'If stockart is allowed in this contest, are all elements photographs',
                'questionGuidelines': 'If stockart is allowed in this contest, are all elements photographs',
                'questionType': 'Scale1-4',
                'weight': 100,
                'isUpload': true
              }
            ]
          }
        ]
      }
    ],
    'id': 'e242b4a2-1341-48a0-a559-647c21eefe42',
    'createdBy': 'TonyJ',
    'createdAt': '2021-10-06T21:34:59.190Z',
    'updatedAt': '2021-10-06T21:34:59.190Z'
  }
}
const T08 = {
  id: 'e242b4a2-1341-48a0-a559-647c21eefe42',
  data: {
    'description': 'description',
    'title': 'Topcoder Challenge new',
    'track': 'Design',
    'type': 'Custom',
    'status': 'pending',
    'groups': [
      {
        'name': 'Copyright and Licenses',
        'weight': 100,
        'sections': [
          {
            'name': 'Stock Art',
            'weight': 100,
            'questions': [
              {
                'questionText': 'If stockart is allowed in this contest, are all elements photographs',
                'questionGuidelines': 'If stockart is allowed in this contest, are all elements photographs',
                'questionType': 'Scale1-4',
                'weight': 100,
                'isUpload': true
              }
            ]
          }
        ]
      }
    ]
  },
  options: {
    title: { eq: 'Topcoder Challenge new' },
    track: { eq: 'Design' }
  },
  oldValue: {
    'description': 'description',
    'title': 'Topcoder Challenge',
    'track': 'Design',
    'type': 'Custom',
    'status': 'pending',
    'groups': [
      {
        'name': 'Copyright and Licenses',
        'weight': 100,
        'sections': [
          {
            'name': 'Stock Art',
            'weight': 100,
            'questions': [
              {
                'questionText': 'If stockart is allowed in this contest, are all elements photographs',
                'questionGuidelines': 'If stockart is allowed in this contest, are all elements photographs',
                'questionType': 'Scale1-4',
                'weight': 100,
                'isUpload': true
              }
            ]
          }
        ]
      }
    ],
    'id': 'e242b4a2-1341-48a0-a559-647c21eefe42',
    'createdBy': 'TonyJ',
    'createdAt': '2021-10-06T21:34:59.190Z',
    'updatedAt': '2021-10-06T21:34:59.190Z'
  },
  result: {
    'description': 'description',
    'title': 'Topcoder Challenge new',
    'track': 'Design',
    'type': 'Custom',
    'status': 'pending',
    'groups': [
      {
        'name': 'Copyright and Licenses',
        'weight': 100,
        'sections': [
          {
            'name': 'Stock Art',
            'weight': 100,
            'questions': [
              {
                'questionText': 'If stockart is allowed in this contest, are all elements photographs',
                'questionGuidelines': 'If stockart is allowed in this contest, are all elements photographs',
                'questionType': 'Scale1-4',
                'weight': 100,
                'isUpload': true
              }
            ]
          }
        ]
      }
    ],
    'id': 'e242b4a2-1341-48a0-a559-647c21eefe42',
    'createdBy': 'TonyJ',
    'createdAt': '2021-10-06T21:34:59.190Z',
    'updatedAt': '2021-10-06T21:34:59.190Z'
  }
}
T08.oldValue.originalItem = () => T08.oldValue
const T09 = {
  id: 'e242b4a2-1341-48a0-a559-647c21eefe42',
  data: {
    'description': 'description',
    'title': 'Topcoder Challenge',
    'track': 'Develop',
    'type': 'Custom',
    'status': 'pending',
    'groups': [
      {
        'name': 'Copyright and Licenses',
        'weight': 100,
        'sections': [
          {
            'name': 'Stock Art',
            'weight': 100,
            'questions': [
              {
                'questionText': 'If stockart is allowed in this contest, are all elements photographs',
                'questionGuidelines': 'If stockart is allowed in this contest, are all elements photographs',
                'questionType': 'Scale1-4',
                'weight': 100,
                'isUpload': true
              }
            ]
          }
        ]
      }
    ]
  },
  options: {
    title: { eq: 'Topcoder Challenge' },
    track: { eq: 'Develop' }
  },
  oldValue: {
    'description': 'description',
    'title': 'Topcoder Challenge',
    'track': 'Design',
    'type': 'Custom',
    'status': 'pending',
    'groups': [
      {
        'name': 'Copyright and Licenses',
        'weight': 100,
        'sections': [
          {
            'name': 'Stock Art',
            'weight': 100,
            'questions': [
              {
                'questionText': 'If stockart is allowed in this contest, are all elements photographs',
                'questionGuidelines': 'If stockart is allowed in this contest, are all elements photographs',
                'questionType': 'Scale1-4',
                'weight': 100,
                'isUpload': true
              }
            ]
          }
        ]
      }
    ],
    'id': 'e242b4a2-1341-48a0-a559-647c21eefe42',
    'createdBy': 'TonyJ',
    'createdAt': '2021-10-06T21:34:59.190Z',
    'updatedAt': '2021-10-06T21:34:59.190Z'
  },
  result: {
    'description': 'description',
    'title': 'Topcoder Challenge',
    'track': 'Develop',
    'type': 'Custom',
    'status': 'pending',
    'groups': [
      {
        'name': 'Copyright and Licenses',
        'weight': 100,
        'sections': [
          {
            'name': 'Stock Art',
            'weight': 100,
            'questions': [
              {
                'questionText': 'If stockart is allowed in this contest, are all elements photographs',
                'questionGuidelines': 'If stockart is allowed in this contest, are all elements photographs',
                'questionType': 'Scale1-4',
                'weight': 100,
                'isUpload': true
              }
            ]
          }
        ]
      }
    ],
    'id': 'e242b4a2-1341-48a0-a559-647c21eefe42',
    'createdBy': 'TonyJ',
    'createdAt': '2021-10-06T21:34:59.190Z',
    'updatedAt': '2021-10-06T21:34:59.190Z'
  }
}
T09.oldValue.originalItem = () => T09.oldValue
const T10 = {
  id: 'e242b4a2-1341-48a0-a559-647c21eefe42',
  data: {
    'type': 'Custom',
    'status': 'pending'
  },
  oldValue: {
    'description': 'description',
    'title': 'Topcoder Challenge',
    'track': 'Design',
    'type': 'Custom',
    'status': 'pending',
    'groups': [
      {
        'name': 'Copyright and Licenses',
        'weight': 100,
        'sections': [
          {
            'name': 'Stock Art',
            'weight': 100,
            'questions': [
              {
                'questionText': 'If stockart is allowed in this contest, are all elements photographs',
                'questionGuidelines': 'If stockart is allowed in this contest, are all elements photographs',
                'questionType': 'Scale1-4',
                'weight': 100,
                'isUpload': true
              }
            ]
          }
        ]
      }
    ],
    'id': 'e242b4a2-1341-48a0-a559-647c21eefe42',
    'createdBy': 'TonyJ',
    'createdAt': '2021-10-06T21:34:59.190Z',
    'updatedAt': '2021-10-06T21:34:59.190Z'
  },
  result: {
    'description': 'description',
    'title': 'Topcoder Challenge',
    'track': 'Design',
    'type': 'Custom',
    'status': 'pending',
    'groups': [
      {
        'name': 'Copyright and Licenses',
        'weight': 100,
        'sections': [
          {
            'name': 'Stock Art',
            'weight': 100,
            'questions': [
              {
                'questionText': 'If stockart is allowed in this contest, are all elements photographs',
                'questionGuidelines': 'If stockart is allowed in this contest, are all elements photographs',
                'questionType': 'Scale1-4',
                'weight': 100,
                'isUpload': true
              }
            ]
          }
        ]
      }
    ],
    'id': 'e242b4a2-1341-48a0-a559-647c21eefe42',
    'createdBy': 'TonyJ',
    'createdAt': '2021-10-06T21:34:59.190Z',
    'updatedAt': '2021-10-06T21:34:59.190Z'
  }
}
T10.oldValue.originalItem = () => T10.oldValue
const T11 = {
  id: 'e242b4a2-1341-48a0-a559-647c21eefe42',
  data: {
    'description': 'description',
    'title': 'Topcoder Challenge',
    'track': 'Design',
    'type': 'Custom',
    'status': 'pending',
    'groups': [
      {
        'name': 'Copyright and Licenses',
        'weight': 100,
        'sections': [
          {
            'name': 'Stock Art',
            'weight': 100,
            'questions': [
              {
                'questionText': 'If stockart is allowed in this contest, are all elements photographs',
                'questionGuidelines': 'If stockart is allowed in this contest, are all elements photographs',
                'questionType': 'Scale1-4',
                'weight': 100,
                'isUpload': true
              }
            ]
          }
        ]
      }
    ]
  },
  oldValue: {
    'description': 'description',
    'title': 'Topcoder Challenge',
    'track': 'Design',
    'type': 'Custom',
    'status': 'pending',
    'groups': [
      {
        'name': 'Copyright and Licenses',
        'weight': 100,
        'sections': [
          {
            'name': 'Stock Art',
            'weight': 100,
            'questions': [
              {
                'questionText': 'If stockart is allowed in this contest, are all elements photographs',
                'questionGuidelines': 'If stockart is allowed in this contest, are all elements photographs',
                'questionType': 'Scale1-4',
                'weight': 100,
                'isUpload': true
              }
            ]
          }
        ]
      }
    ],
    'id': 'e242b4a2-1341-48a0-a559-647c21eefe42',
    'createdBy': 'TonyJ',
    'createdAt': '2021-10-06T21:34:59.190Z',
    'updatedAt': '2021-10-06T21:34:59.190Z'
  },
  result: {
    'description': 'description',
    'title': 'Topcoder Challenge',
    'track': 'Design',
    'type': 'Custom',
    'status': 'pending',
    'groups': [
      {
        'name': 'Copyright and Licenses',
        'weight': 100,
        'sections': [
          {
            'name': 'Stock Art',
            'weight': 100,
            'questions': [
              {
                'questionText': 'If stockart is allowed in this contest, are all elements photographs',
                'questionGuidelines': 'If stockart is allowed in this contest, are all elements photographs',
                'questionType': 'Scale1-4',
                'weight': 100,
                'isUpload': true
              }
            ]
          }
        ]
      }
    ],
    'id': 'e242b4a2-1341-48a0-a559-647c21eefe42',
    'createdBy': 'TonyJ',
    'createdAt': '2021-10-06T21:34:59.190Z',
    'updatedAt': '2021-10-06T21:34:59.190Z'
  }
}
T11.oldValue.originalItem = () => T11.oldValue
const T12 = {
  id: 'e242b4a2-1341-48a0-a559-647c21eefe42',
  value: {
    'description': 'description',
    'title': 'Topcoder Challenge',
    'track': 'Design',
    'type': 'Custom',
    'status': 'pending',
    'groups': [
      {
        'name': 'Copyright and Licenses',
        'weight': 100,
        'sections': [
          {
            'name': 'Stock Art',
            'weight': 100,
            'questions': [
              {
                'questionText': 'If stockart is allowed in this contest, are all elements photographs',
                'questionGuidelines': 'If stockart is allowed in this contest, are all elements photographs',
                'questionType': 'Scale1-4',
                'weight': 100,
                'isUpload': true
              }
            ]
          }
        ]
      }
    ],
    'id': 'e242b4a2-1341-48a0-a559-647c21eefe42',
    'createdBy': 'TonyJ',
    'createdAt': '2021-10-06T21:34:59.190Z',
    'updatedAt': '2021-10-06T21:34:59.190Z'
  }
}
const T13 = {
  id: 'e242b4a2-1341-48a0-a559-647c21eefe42',
  value: {
    'description': 'description',
    'title': 'Topcoder Challenge',
    'track': 'Design',
    'type': 'Custom',
    'status': 'pending',
    'groups': [
      {
        'name': 'Copyright and Licenses',
        'weight': 100,
        'sections': [
          {
            'name': 'Stock Art',
            'weight': 100,
            'questions': [
              {
                'questionText': 'If stockart is allowed in this contest, are all elements photographs',
                'questionGuidelines': 'If stockart is allowed in this contest, are all elements photographs',
                'questionType': 'Scale1-4',
                'weight': 100,
                'isUpload': true
              }
            ]
          }
        ]
      }
    ],
    'id': 'e242b4a2-1341-48a0-a559-647c21eefe42',
    'createdBy': 'TonyJ',
    'createdAt': '2021-10-06T21:34:59.190Z',
    'updatedAt': '2021-10-06T21:34:59.190Z'
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
