import { validate } from 'jest-validate'
import isPlainObj from 'is-plain-obj'
import filterObj from 'filter-obj'

// Validate input parameters and assign default values.
// `versionRange` can start with `v` or not.
export const getOpts = function({ versionRange, command, args, opts }) {
  validateBasic({ versionRange, command, args, opts })
  validate(opts, {
    exampleConfig: EXAMPLE_OPTS,
    recursiveBlacklist: ['spawnOptions'],
  })

  const optsA = filterObj(opts, isDefined)
  const optsB = {
    ...DEFAULT_OPTS,
    ...optsA,
    spawnOptions: { ...DEFAULT_OPTS.spawnOptions, ...optsA.spawnOptions },
  }
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

  if (typeof command !== 'string' && command !== undefined) {
    throw new TypeError(
      `Second argument must be a command or undefined: ${command}`,
    )
  }

  if (!isStringArray(args)) {
    throw new TypeError(`Third argument must be an array of strings: ${args}`)
  }

  if (!isPlainObj(opts)) {
    throw new TypeError(`Last argument must be an options object: ${opts}`)
  }
}

const isStringArray = function(args) {
  return Array.isArray(args) && args.every(isString)
}

const isString = function(arg) {
  return typeof arg === 'string'
}

const isDefined = function(key, value) {
  return value !== undefined
}

const DEFAULT_OPTS = {
  spawnOptions: {},
  progress: false,
}

const EXAMPLE_OPTS = {
  ...DEFAULT_OPTS,
  spawnOptions: { stdio: 'inherit' },
  mirror: 'https://nodejs.org/dist',
}
