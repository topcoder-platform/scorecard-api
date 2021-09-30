/**
 * App constants
 */
const UserRoles = {
  Admin: 'Administrator',
  Copilot: 'Copilot'
}

const Scopes = {
  READ_REVIEW_PROCESS: 'read:reviewProcess',
  CREATE_REVIEW_PROCESS: 'create:reviewProcess',
  UPDATE_REVIEW_PROCESS: 'update:reviewProcess',
  DELETE_REVIEW_PROCESS: 'delete:reviewProcess',
  ALL_REVIEW_PROCESS: 'all:reviewProcess',
  READ_SCORECARD: 'read:scorecard',
  CREATE_SCORECARD: 'create:scorecard',
  UPDATE_SCORECARD: 'update:scorecard',
  DELETE_SCORECARD: 'delete:scorecard',
  ALL_SCORECARD: 'all:scorecard',
  READ_CHALLENGES: 'read:challenges',
  ALL_CHALLENGES: 'all:challenges'
}

// ReviewStep fields will be hidden from the result
const ReviewStepInternalFields = ['nameToLower']

// ReviewProcess fields will be returned in search api
const ReviewProcessFields = ['id', 'title', 'track', 'type', 'status', 'createdAt', 'createdBy', 'updatedAt', 'updatedBy']

// ReviewProcess fields will be hidden from the result
const ReviewProcessInternalFields = ['titleToLower']

// Scorecard fields will be returned in search api
const ScorecardFields = ['id', 'title', 'track', 'type', 'status', 'createdAt', 'createdBy', 'updatedAt', 'updatedBy']

// Scorecard fields will be hidden from the result
const ScorecardInternalFields = ['titleToLower']

// The status names for ReviewProcess
const ReviewProcessStatus = {
  COMPLETE: 'complete',
  PENDING: 'pending',
  RUNNING: 'running'
}

// The status names for Scorecard
const ScorecardStatus = {
  COMPLETE: 'complete',
  PENDING: 'pending',
  RUNNING: 'running'
}

// The question types for Scorecard
const ScorecardQuestionTypes = {
  SCALE_1_4: 'Scale1-4',
  SCALE_1_9: 'Scale1-9',
  YES_OR_NO: 'YesOrNo'
}

// sum of scorecard details weights
const SUM_OF_WEIGHTS = 100

// max value of scorecard details weights
const MAX_WEIGHT = 100

module.exports = {
  UserRoles,
  Scopes,
  ReviewStepInternalFields,
  ReviewProcessFields,
  ReviewProcessInternalFields,
  ScorecardFields,
  ScorecardInternalFields,
  ReviewProcessStatus,
  ScorecardStatus,
  ScorecardQuestionTypes,
  SUM_OF_WEIGHTS,
  MAX_WEIGHT
}
