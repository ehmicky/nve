import { validate } from 'jest-validate'

import { isPlainObject, omitBy } from './utils.js'

// Validate input parameters and assign default values.
// `versionRange` can start with `v` or not.
export const getOpts = function({ versionRange, command, args, opts }) {
  validateBasic({ versionRange, command, args, opts })
  validate(opts, { exampleConfig: EXAMPLE_OPTS, recursiveBlacklist: ['spawn'] })

  const optsA = omitBy(opts, isUndefined)
  const optsB = { ...DEFAULT_OPTS, ...optsA }
  return optsB
}

// Validate input parameters
// `versionRange` can start with `v` or not. It is already validated by
// `get-node`
// eslint-disable-next-line complexity
const validateBasic = function({ versionRange, command, args, opts }) {
  if (typeof versionRange !== 'string') {
    throw new TypeError(`First argument must be a version: ${versionRange}`)
  }

  if (typeof command !== 'string') {
    throw new TypeError(`Second argument must be a command: ${command}`)
  }

  if (!isStringArray(args)) {
    throw new TypeError(`Third argument must be an array of strings: ${args}`)
  }

  if (!isPlainObject(opts)) {
    throw new TypeError(`Last argument must be an options object: ${opts}`)
  }
}

const isStringArray = function(args) {
  return Array.isArray(args) && args.every(isString)
}

const isString = function(arg) {
  return typeof arg === 'string'
}

const isUndefined = function(key, value) {
  return value === undefined
}

const DEFAULT_OPTS = {
  spawn: {},
}

const EXAMPLE_OPTS = {
  ...DEFAULT_OPTS,
  spawn: { stdio: 'inherit' },
  progress: true,
  mirror: 'https://nodejs.org/dist',
}
