const T01 = {
  scanResult: [
    {
      'id': '040768a2-a125-46a6-a90d-a6a43cb4d88e',
      'name': 'Submission Phase Opened'
    },
    {
      'id': 'a4cb5bae-40fc-40e6-88fc-daa2a75b4ce6',
      'name': 'Submission Uploaded'
    },
    {
      'id': 'c32e1335-56fc-42dc-b31d-671506b9ee64',
      'name': 'Submission Phase Closed'
    }
  ]
}
const T02 = {
  scanResult: [
    {
      'id': '9fa84207-ed88-40b2-8c01-600f0a5c604e',
      'name': 'SonarQube',
      'icon': 'Icon 1'
    },
    {
      'id': '4c80db37-7136-4716-80f5-c7efa8ed7b40',
      'name': 'Antivirus Scan',
      'icon': 'Icon 2'
    },
    {
      'id': '59dd4e3e-a190-42b8-ab7c-5adb47e14852',
      'name': 'Checkmarx',
      'icon': 'Icon 3'
    }
  ],
  criteria: {

  },
  options: {

  },
  response: {
    total: 3,
    page: 1,
    perPage: 20,
    result: [
      {
        'id': '9fa84207-ed88-40b2-8c01-600f0a5c604e',
        'name': 'SonarQube',
        'icon': 'Icon 1'
      },
      {
        'id': '4c80db37-7136-4716-80f5-c7efa8ed7b40',
        'name': 'Antivirus Scan',
        'icon': 'Icon 2'
      },
      {
        'id': '59dd4e3e-a190-42b8-ab7c-5adb47e14852',
        'name': 'Checkmarx',
        'icon': 'Icon 3'
      }
    ]
  }
}
const T03 = {
  scanResult: [
    {
      'id': '9fa84207-ed88-40b2-8c01-600f0a5c604e',
      'name': 'SonarQube',
      'icon': 'Icon 1'
    },
    {
      'id': '4c80db37-7136-4716-80f5-c7efa8ed7b40',
      'name': 'Antivirus Scan',
      'icon': 'Icon 2'
    },
    {
      'id': '59dd4e3e-a190-42b8-ab7c-5adb47e14852',
      'name': 'Checkmarx',
      'icon': 'Icon 3'
    }
  ],
  criteria: {
    page: 2,
    perPage: 1,
    name: 'a'
  },
  options: {
    name: { contains: 'a' }
  },
  response: {
    total: 3,
    page: 2,
    perPage: 1,
    result: [
      {
        'id': '4c80db37-7136-4716-80f5-c7efa8ed7b40',
        'name': 'Antivirus Scan',
        'icon': 'Icon 2'
      }
    ]
  }
}
module.exports = {
  T01,
  T02,
  T03
}
