import { stdout, stderr } from 'process'

import { red } from 'chalk'

import { writeProcessOutput } from './output.js'
import { printVersionHeader } from './header.js'

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
}) {
  if (originalMessage !== undefined) {
    stderr.write(`${originalMessage}\n`)
  }

  return exitCode
}

// Handle errors thrown in serial runs
export const handleSerialError = function(error, versionRange, state) {
  handleMultipleError(error, versionRange, state)
}

// Handle errors thrown in parallel runs without --continue
export const handleFastParallelError = function(error, versionRange, state) {
  printAborted(error, versionRange, state)
  handleParallelError(state.failedError, state.failedVersionRange, state)
}

// When processes are run in parallel and one fails but is not the current one,
// the current child process shows its current buffered output and a message
// indicating it's been aborted.
const printAborted = function(
  error,
  versionRange,
  { failedError, failedVersionRange },
) {
  if (failedError === error) {
    return
  }

  writeProcessOutput(error.all, stdout)

  stderr.write(red(`Node ${versionRange} aborted\n`))

  printVersionHeader(failedVersionRange)
}

// Handle errors thrown in parallel runs (with|without --continue)
export const handleParallelError = function(error, versionRange, state) {
  writeProcessOutput(`${error.all}\n`, stdout)
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
  { message, exitCode = DEFAULT_EXIT_CODE },
  versionRange,
  state,
) {
  const commandMessage = getCommandMessage(message, versionRange)
  stderr.write(`${commandMessage}\n`)

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

// Handle top-level errors not due to child process errors, such as input
// validation errors, Node.js download errors and bugs.
export const handleTopError = function({ message }, yargs) {
  stderr.write(`${message}\n`)
  printHelp(message, yargs)
}

// Print --help on common input syntax mistakes
const printHelp = function(message, yargs) {
  if (!shouldPrintHelp(message)) {
    return
  }

  stderr.write(`\nError: invalid input syntax.\n\n`)
  yargs.showHelp()
}

const shouldPrintHelp = function(message) {
  return message.includes('Missing version')
}
