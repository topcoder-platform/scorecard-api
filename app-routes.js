/**
 * Configure all routes for express app
 */
const _ = require('lodash')
const config = require('config')
const HttpStatus = require('http-status-codes')
const helper = require('./src/common/helper')
const errors = require('./src/common/errors')
const routes = require('./src/routes')
const authenticator = require('tc-core-library-js').middleware.jwtAuthenticator

/**
 * Configure all routes for express app
 * @param app the express app
 */
module.exports = app => {
  // Load all routes
  _.each(routes, (verbs, path) => {
    _.each(verbs, (def, verb) => {
      const controllerPath = `./src/controllers/${def.controller}`
      const method = require(controllerPath)[def.method]
      if (!method) {
        throw new Error(`${def.method} is undefined`)
      }

      const actions = []
      actions.push((req, res, next) => {
        req.signature = `${def.controller}#${def.method}`
        next()
      })

      // Authentication and Authorization
      if (def.auth === 'jwt') {
        actions.push((req, res, next) => {
          authenticator(_.pick(config, ['AUTH_SECRET', 'VALID_ISSUERS']))(req, res, next)
        })

        actions.push((req, res, next) => {
          if (!req.authUser) {
            return next(new errors.UnauthorizedError('Action is not allowed for invalid token'))
          }
          if (req.authUser.isMachine) {
            // M2M
            if (def.scopes && !helper.checkIfExists(def.scopes, req.authUser.scopes)) {
              res.forbidden = true
              next(new errors.ForbiddenError('You are not allowed to perform this action!'))
            } else {
              req.authUser.handle = config.M2M_AUDIT_HANDLE
              next()
            }
          } else if (req.authUser.roles) {
            // user
            if (def.access && !helper.checkIfExists(_.map(def.access, a => a.toLowerCase()), _.map(req.authUser.roles, r => r.toLowerCase()))) {
              res.forbidden = true
              next(new errors.ForbiddenError('You are not allowed to perform this action!'))
            } else {
              next()
            }
          } else if (
            (_.isArray(def.access) && def.access.length > 0) ||
            (_.isArray(def.scopes) && def.scopes.length > 0)
          ) {
            next(new errors.UnauthorizedError('You are not authorized to perform this action'))
          } else {
            next()
          }
        })
      }

      actions.push(method)
      app[verb](`${config.API_VERSION}${path}`, helper.autoWrapExpress(actions))
    })
  })

  // Check if the route is not found or HTTP method is not supported
  app.use('*', (req, res) => {
    const route = routes[req.baseUrl]
    let status
    let message
    if (route) {
      status = HttpStatus.METHOD_NOT_ALLOWED
      message = 'The requested HTTP method is not supported.'
    } else {
      status = HttpStatus.NOT_FOUND
      message = 'The requested resource cannot be found.'
    }
    res.status(status).json({ message })
  })
}
