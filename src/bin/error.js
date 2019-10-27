import { stdout, stderr } from 'process'
import { promisify } from 'util'

import { red } from 'chalk'

import { printInvalidCommand } from './fault.js'
import { writeProcessOutput } from './output.js'
import { printVersionHeader } from './header.js'

const pSetTimeout = promisify(setTimeout)

// Handle errors thrown by `execa()`
// We forward the exit code reported by `execa()` using `error.exitCode`.
// An error is thrown if:
//  a) the exit code is non-0
//  b) the process was killed by a signal
//  c) the process could not be started, e.g. due to permissions or the command
//     not existing
//  d) the process timed out using the `timeout` option
//  e) an error happened on the stdin|stdout|stderr stream

// If only one version was specified, `nve` should be as transparent as
// possible, so no error messages should be printed except for c) d) and e) as
// those are not application errors.
// Execa reports the last three ones differently, using `error.originalMessage`.
export const handleSingleError = function({
  originalMessage,
  exitCode = DEFAULT_EXIT_CODE,
  ...error
}) {
  if (originalMessage !== undefined) {
    stderr.write(`${originalMessage}\n`)
  }

  printInvalidCommand({ ...error, exitCode })

  return exitCode
}

// Handle errors thrown in serial runs
export const handleSerialError = function(error, versionRange, state) {
  handleMultipleError(error, versionRange, state)
}

// Handle errors thrown in parallel runs.
// We use different error handling logic depending on whether `--continue` is
// used
export const handleParallelError = async function({
  error,
  versionRange,
  continueOpt,
  state,
  index,
}) {
  if (continueOpt) {
    handleAnyParallelError({ error, versionRange, state, index })
    return
  }

  // Ensure termination logic is triggered first
  await pSetTimeout(0)

  handleFastParallelError({ error, versionRange, state, index })
}

// Handle errors thrown in parallel runs without --continue
const handleFastParallelError = function({
  error,
  versionRange,
  state,
  index,
}) {
  printAborted({ error, versionRange, state, index })
  handleAnyParallelError({
    error: state.failedError,
    versionRange: state.failedVersionRange,
    state,
    index: state.failedIndex,
  })
}

// When processes are run in parallel and one fails but is not the current one,
// the current child process shows its current buffered output and a message
// indicating it's been aborted.
const printAborted = function({
  error,
  versionRange,
  state: { failedError, failedVersionRange },
  index,
}) {
  if (failedError === error) {
    return
  }

  writeProcessOutput(error.all, stdout, index)

  stderr.write(red(`Node ${versionRange} aborted\n`))

  printVersionHeader(failedVersionRange)
}

// Handle errors thrown in parallel runs (with|without --continue)
const handleAnyParallelError = function({ error, versionRange, state, index }) {
  writeProcessOutput(`${error.all}\n`, stdout, index)
  handleMultipleError(error, versionRange, state)
}

// If several versions were specified, `nve` is also more explicit about
// failures. This is for both serial and parallel runs.
// The exit code is the one of the last error that was printed:
//  - with serial runs and parallel runs with --continue, this is the last
//    failed child process in input order
//  - with parallel runs without --continue, this is the first failed child
//    process
const handleMultipleError = function(
  { message, exitCode = DEFAULT_EXIT_CODE, ...error },
  versionRange,
  state,
) {
  const commandMessage = getCommandMessage(message, versionRange)
  stderr.write(`${commandMessage}\n`)

  printInvalidCommand({ ...error, exitCode })

  // eslint-disable-next-line fp/no-mutation, no-param-reassign
  state.exitCode = exitCode
}

const getCommandMessage = function(message, versionRange) {
  return red(
    message
      .replace(COMMAND_REGEXP, '')
      .replace('Command', `Node ${versionRange}`),
  )
}

// Remove the command path and arguments from the error message
const COMMAND_REGEXP = /:.*/u

const DEFAULT_EXIT_CODE = 1
