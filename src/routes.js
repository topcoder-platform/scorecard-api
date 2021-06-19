/**
 * Contains all routes.
 * If access roles are not configured for a route, then any role is allowed.
 * If scopes are not configured for a route, then any scope is allowed.
 */

const constants = require('../app-constants')

module.exports = {
  '/scoreSystems': {
    get: {
      controller: 'ScoreSystemController',
      method: 'list',
      auth: 'jwt',
      // any role is allowed
      scopes: [constants.Scopes.ReadScoreSystem, constants.Scopes.AllScoreSystem]
    },
    head: {
      controller: 'ScoreSystemController',
      method: 'listHead',
      auth: 'jwt',
      // any role is allowed
      scopes: [constants.Scopes.ReadScoreSystem, constants.Scopes.AllScoreSystem]
    },
    post: {
      controller: 'ScoreSystemController',
      method: 'create',
      auth: 'jwt',
      access: [constants.UserRoles.Admin],
      scopes: [constants.Scopes.UpdateScoreSystem, constants.Scopes.AllScoreSystem]
    }
  },
  '/scoreSystems/:id': {
    get: {
      controller: 'ScoreSystemController',
      method: 'getEntity',
      auth: 'jwt',
      // any role is allowed
      scopes: [constants.Scopes.ReadScoreSystem, constants.Scopes.AllScoreSystem]
    },
    head: {
      controller: 'ScoreSystemController',
      method: 'getEntityHead',
      auth: 'jwt',
      // any role is allowed
      scopes: [constants.Scopes.ReadScoreSystem, constants.Scopes.AllScoreSystem]
    },
    put: {
      controller: 'ScoreSystemController',
      method: 'update',
      auth: 'jwt',
      access: [constants.UserRoles.Admin],
      scopes: [constants.Scopes.UpdateScoreSystem, constants.Scopes.AllScoreSystem]
    },
    patch: {
      controller: 'ScoreSystemController',
      method: 'partiallyUpdate',
      auth: 'jwt',
      access: [constants.UserRoles.Admin],
      scopes: [constants.Scopes.UpdateScoreSystem, constants.Scopes.AllScoreSystem]
    },
    delete: {
      controller: 'ScoreSystemController',
      method: 'remove',
      auth: 'jwt',
      access: [constants.UserRoles.Admin],
      scopes: [constants.Scopes.UpdateScoreSystem, constants.Scopes.AllScoreSystem]
    }
  },

  '/scorecards': {
    get: {
      controller: 'ScorecardController',
      method: 'list',
      auth: 'jwt',
      // any role is allowed
      scopes: [constants.Scopes.ReadScorecard, constants.Scopes.AllScorecard]
    },
    head: {
      controller: 'ScorecardController',
      method: 'listHead',
      auth: 'jwt',
      // any role is allowed
      scopes: [constants.Scopes.ReadScorecard, constants.Scopes.AllScorecard]
    },
    post: {
      controller: 'ScorecardController',
      method: 'create',
      auth: 'jwt',
      access: [constants.UserRoles.Admin],
      scopes: [constants.Scopes.UpdateScorecard, constants.Scopes.AllScorecard]
    }
  },
  '/scorecards/:id': {
    get: {
      controller: 'ScorecardController',
      method: 'getEntity',
      auth: 'jwt',
      // any role is allowed
      scopes: [constants.Scopes.ReadScorecard, constants.Scopes.AllScorecard]
    },
    head: {
      controller: 'ScorecardController',
      method: 'getEntityHead',
      auth: 'jwt',
      // any role is allowed
      scopes: [constants.Scopes.ReadScorecard, constants.Scopes.AllScorecard]
    },
    put: {
      controller: 'ScorecardController',
      method: 'update',
      auth: 'jwt',
      access: [constants.UserRoles.Admin],
      scopes: [constants.Scopes.UpdateScorecard, constants.Scopes.AllScorecard]
    },
    patch: {
      controller: 'ScorecardController',
      method: 'partiallyUpdate',
      auth: 'jwt',
      access: [constants.UserRoles.Admin],
      scopes: [constants.Scopes.UpdateScorecard, constants.Scopes.AllScorecard]
    },
    delete: {
      controller: 'ScorecardController',
      method: 'remove',
      auth: 'jwt',
      access: [constants.UserRoles.Admin],
      scopes: [constants.Scopes.UpdateScorecard, constants.Scopes.AllScorecard]
    }
  },
  '/health': {
    get: {
      controller: 'HealthController',
      method: 'checkHealth'
    }
  }
}
