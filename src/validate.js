// Validate input parameters
// `versionRange` can start with `v` or not. It is already validated by
// `get-node`
export const validateInput = function(args) {
  if (!Array.isArray(args) || !args.every(isString)) {
    throw new TypeError('Second argument must be an array of strings')
  }
}

const isString = function(arg) {
  return typeof arg === 'string'
}
