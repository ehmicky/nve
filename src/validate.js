import { validRange } from 'semver'

// Validate input parameters
// `versionRange` can start with `v` or not.
export const validateInput = function(versionRange, args) {
  validateVersion(versionRange)
  validateArgs(args)
}

const validateVersion = function(versionRange) {
  if (typeof versionRange !== 'string' || validRange(versionRange) === null) {
    throw new TypeError('First argument must be a valid Node version range')
  }
}

const validateArgs = function(args) {
  if (!Array.isArray(args) || !args.every(isString)) {
    throw new TypeError('Second argument must be an array of strings')
  }
}

const isString = function(arg) {
  return typeof arg === 'string'
}
