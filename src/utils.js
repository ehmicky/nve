// Is a plain object, including `Object.create(null)`
export const isPlainObject = function(val) {
  return (
    typeof val === 'object' &&
    val !== null &&
    // istanbul ignore next
    (val.constructor === Object || val.constructor === undefined)
  )
}

// Like lodash _.omitBy()
export const omitBy = function(object, condition) {
  const pairs = Object.entries(object)
    .filter(([key, value]) => !condition(key, value))
    .map(([key, value]) => ({ [key]: value }))
  return Object.assign({}, ...pairs)
}
