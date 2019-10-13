import isPlainObj from 'is-plain-obj'

// Validate `versionRange` and `versionRanges`. They can start with `v` or not.
// Further validation is done by `get-node`.
export const validateRanges = function(versionRanges) {
  if (!Array.isArray(versionRanges)) {
    throw new TypeError('Versions are missing')
  }

  versionRanges.forEach(validateRange)
}

export const validateRange = function(versionRange) {
  if (typeof versionRange !== 'string') {
    throw new TypeError(`Invalid version: ${versionRange}`)
  }
}

// Validate input parameters
export const validateBasic = function({ command, args, opts }) {
  if (!isValidCommand(command)) {
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

const isValidCommand = function(command) {
  return typeof command === 'string' || command === undefined
}

const isStringArray = function(args) {
  return Array.isArray(args) && args.every(isString)
}

const isString = function(arg) {
  return typeof arg === 'string'
}
