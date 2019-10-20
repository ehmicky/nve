import { stdout, stderr } from 'process'

import { red } from 'chalk'

import { writeProcessOutput } from './output.js'

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
  error,
  error: { originalMessage = '' },
}) {
  // eslint-disable-next-line fp/no-mutation, no-param-reassign
  error.message = originalMessage
  return error
}

// If several serial versions were specified, `nve` is more explicit about
// failures.
// If the `continue` option is `false` (default), we stop execution.
// Otherwise, we continue execution but we print the error message and use the
// last non-0 exit code.
export const handleSerialError = function({
  error,
  error: { message, exitCode = DEFAULT_EXIT_CODE },
  versionRange,
  state,
  continueOpt,
}) {
  const commandMessage = getCommandMessage(message, versionRange)

  if (!continueOpt) {
    // eslint-disable-next-line fp/no-mutation, no-param-reassign
    error.message = commandMessage
    throw error
  }

  stderr.write(`${commandMessage}\n`)

  // eslint-disable-next-line fp/no-mutation, no-param-reassign
  state.exitCode = exitCode
}

// If several parallel versions were specified, `nve` is also more explicit
// about failures.
export const handleParallelError = function({
  error: { message, exitCode = DEFAULT_EXIT_CODE, all },
  versionRange,
  state,
}) {
  writeProcessOutput(`${all}\n`, stdout)

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

export const handleTopError = function(
  { exitCode = DEFAULT_EXIT_CODE, message, code },
  yargs,
) {
  writeProcessOutput(message.trim(), stderr)

  printHelp(message, code, yargs)

  return exitCode
}

const DEFAULT_EXIT_CODE = 1

// Print --help on common input syntax mistakes
const printHelp = function(message, code, yargs) {
  if (!shouldPrintHelp(message, code)) {
    return
  }

  stderr.write(`\nError: invalid input syntax.\n\n`)
  yargs.showHelp()
}

const shouldPrintHelp = function(message, code) {
  return message.includes('Missing version') || code === 'ENOENT'
}
