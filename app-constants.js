/**
 * App constants
 */
const UserRoles = {
  Admin: 'Administrator'
}

const Scopes = {
  ReadScoreSystem: 'read:score_system',
  UpdateScoreSystem: 'update:score_system',
  AllScoreSystem: 'all:score_system',
  ReadScorecard: 'read:scorecard',
  UpdateScorecard: 'update:scorecard',
  AllScorecard: 'all:scorecard'
}

// max sum of scorecard details weights
const MAX_SUM_OF_WEIGHTS = 100

// max value of scorecard details weights
const MAX_WEIGHT = 100

module.exports = {
  UserRoles,
  Scopes,
  MAX_SUM_OF_WEIGHTS,
  MAX_WEIGHT
}
