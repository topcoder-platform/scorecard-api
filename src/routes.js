/**
 * Contains all routes.
 * If access roles are not configured for a route, then any role is allowed.
 * If scopes are not configured for a route, then any scope is allowed.
 */

const constants = require('../app-constants')

module.exports = {
  '/health': {
    get: {
      controller: 'HealthController',
      method: 'checkHealth'
    }
  },

  '/processEventTypes': {
    get: {
      controller: 'LookupController',
      method: 'getProcessEventTypes',
      auth: 'jwt'
      // any role is allowed
      // any scope is allowed
    }
  },

  '/reviewSteps': {
    get: {
      controller: 'LookupController',
      method: 'getReviewSteps',
      auth: 'jwt'
      // any role is allowed
      // any scope is allowed
    }
  },

  '/processes': {
    get: {
      controller: 'ReviewProcessController',
      method: 'searchReviewProcesses',
      auth: 'jwt',
      // any role is allowed
      scopes: [constants.Scopes.READ_REVIEW_PROCESS, constants.Scopes.ALL_REVIEW_PROCESS, constants.Scopes.READ_CHALLENGES, constants.Scopes.ALL_CHALLENGES]
    },
    post: {
      controller: 'ReviewProcessController',
      method: 'createReviewProcess',
      auth: 'jwt',
      access: [constants.UserRoles.Admin, constants.UserRoles.Copilot],
      scopes: [constants.Scopes.CREATE_REVIEW_PROCESS, constants.Scopes.ALL_REVIEW_PROCESS]
    }
  },

  '/processes/:processId': {
    get: {
      controller: 'ReviewProcessController',
      method: 'getReviewProcess',
      auth: 'jwt',
      // any role is allowed
      scopes: [constants.Scopes.READ_REVIEW_PROCESS, constants.Scopes.ALL_REVIEW_PROCESS, constants.Scopes.READ_CHALLENGES, constants.Scopes.ALL_CHALLENGES]
    },
    put: {
      controller: 'ReviewProcessController',
      method: 'fullyUpdateReviewProcess',
      auth: 'jwt',
      access: [constants.UserRoles.Admin, constants.UserRoles.Copilot],
      scopes: [constants.Scopes.UPDATE_REVIEW_PROCESS, constants.Scopes.ALL_REVIEW_PROCESS]
    },
    patch: {
      controller: 'ReviewProcessController',
      method: 'partiallyUpdateReviewProcess',
      auth: 'jwt',
      access: [constants.UserRoles.Admin, constants.UserRoles.Copilot],
      scopes: [constants.Scopes.UPDATE_REVIEW_PROCESS, constants.Scopes.ALL_REVIEW_PROCESS]
    },
    delete: {
      controller: 'ReviewProcessController',
      method: 'deleteReviewProcess',
      auth: 'jwt',
      access: [constants.UserRoles.Admin, constants.UserRoles.Copilot],
      scopes: [constants.Scopes.DELETE_REVIEW_PROCESS, constants.Scopes.ALL_REVIEW_PROCESS]
    }
  },

  '/scorecards': {
    get: {
      controller: 'ScorecardController',
      method: 'searchScorecards',
      auth: 'jwt',
      // any role is allowed
      scopes: [constants.Scopes.READ_SCORECARD, constants.Scopes.ALL_SCORECARD, constants.Scopes.READ_CHALLENGES, constants.Scopes.ALL_CHALLENGES]
    },
    post: {
      controller: 'ScorecardController',
      method: 'createScorecard',
      auth: 'jwt',
      access: [constants.UserRoles.Admin, constants.UserRoles.Copilot],
      scopes: [constants.Scopes.CREATE_SCORECARD, constants.Scopes.ALL_SCORECARD]
    }
  },

  '/scorecards/:scorecardId': {
    get: {
      controller: 'ScorecardController',
      method: 'getScorecard',
      auth: 'jwt',
      // any role is allowed
      scopes: [constants.Scopes.READ_SCORECARD, constants.Scopes.ALL_SCORECARD, constants.Scopes.READ_CHALLENGES, constants.Scopes.ALL_CHALLENGES]
    },
    put: {
      controller: 'ScorecardController',
      method: 'fullyUpdateScorecard',
      auth: 'jwt',
      access: [constants.UserRoles.Admin, constants.UserRoles.Copilot],
      scopes: [constants.Scopes.UPDATE_SCORECARD, constants.Scopes.ALL_SCORECARD]
    },
    patch: {
      controller: 'ScorecardController',
      method: 'partiallyUpdateScorecard',
      auth: 'jwt',
      access: [constants.UserRoles.Admin, constants.UserRoles.Copilot],
      scopes: [constants.Scopes.UPDATE_SCORECARD, constants.Scopes.ALL_SCORECARD]
    },
    delete: {
      controller: 'ScorecardController',
      method: 'deleteScorecard',
      auth: 'jwt',
      access: [constants.UserRoles.Admin, constants.UserRoles.Copilot],
      scopes: [constants.Scopes.DELETE_SCORECARD, constants.Scopes.ALL_SCORECARD]
    }
  }
}
