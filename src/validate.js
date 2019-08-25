import { isPlainObject } from './utils.js'

// Validate input parameters
// `versionRange` can start with `v` or not. It is already validated by
// `get-node`
// eslint-disable-next-line complexity
export const validateInput = function({ versionRange, command, args, opts }) {
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
