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
export const handleExecaError = function({
  error,
  error: { originalMessage = '' },
}) {
  // eslint-disable-next-line fp/no-mutation, no-param-reassign
  error.message = originalMessage
  return error
}

export const handleTopError = function({
  exitCode = DEFAULT_EXIT_CODE,
  message,
}) {
  const messageA = message.trim()

  if (messageA !== '') {
    console.error(messageA)
  }

  return exitCode
}

const DEFAULT_EXIT_CODE = 1
