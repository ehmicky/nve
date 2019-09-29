// Handle errors thrown by `execa()`
// We forward the exit code reported by `execa()` using `error.exitCode`.
// An error is thrown if:
//  a) the exit code is non-0
//  b) the process was killed by a signal
//  c) the process could not be started, e.g. due to permissions or the command
//     not existing
//  d) the process timed out using the `timeout` option
//  e) an error happened on the stdin|stdout|stderr stream
// `nve` should be as transparent as possible, so no error messages should be
// printed for a) and b). However we should report c) d) and e) as those are
// not application errors.
// Execa reports the last three ones differently, using `error.originalMessage`.
export const handleExecaError = function(error) {
  const errorA = fixOriginalMessage(error)
  // eslint-disable-next-line fp/no-mutation
  errorA.message = getErrorMessage(errorA)
  return errorA
}

// TODO: remove once https://github.com/sindresorhus/execa/pull/373 is merged.
// That PR is adding `error.originalMessage` to `execa`
const fixOriginalMessage = function(error) {
  const lines = error.message.split('\n')

  if (lines.length <= 1) {
    return error
  }

  // eslint-disable-next-line no-param-reassign, fp/no-mutation
  error.originalMessage = lines.slice(1).join('\n')
  return error
}

const getErrorMessage = function({ originalMessage = '' }) {
  return originalMessage
}

export const handleTopError = function({
  exitCode = DEFAULT_EXIT_CODE,
  message,
}) {
  if (message.trim() !== '') {
    console.error(message)
  }

  return exitCode
}

const DEFAULT_EXIT_CODE = 1
