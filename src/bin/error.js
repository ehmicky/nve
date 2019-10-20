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
  error: { originalMessage, exitCode = DEFAULT_EXIT_CODE },
}) {
  if (originalMessage !== undefined) {
    stderr.write(`${originalMessage}\n`)
  }

  return exitCode
}

// If several serial versions were specified, `nve` is more explicit about
// failures.
// If the `continue` option is `false` (default), we stop execution.
// Otherwise, we continue execution but we print the error message and use the
// last non-0 exit code.
export const handleSerialError = function(
  { message, exitCode = DEFAULT_EXIT_CODE },
  versionRange,
  state,
) {
  const commandMessage = getCommandMessage(message, versionRange)
  stderr.write(`${commandMessage}\n`)

  // eslint-disable-next-line fp/no-mutation, no-param-reassign
  state.exitCode = exitCode
}

// If several parallel versions were specified, `nve` is also more explicit
// about failures.
export const handleParallelError = function(
  { message, exitCode = DEFAULT_EXIT_CODE, all },
  versionRange,
  state,
) {
  writeProcessOutput(`${all}\n`, stdout)

  const commandMessage = getCommandMessage(message, versionRange)
  stderr.write(`${commandMessage}\n`)

  // eslint-disable-next-line fp/no-mutation, no-param-reassign
  state.exitCode = exitCode
}

const DEFAULT_EXIT_CODE = 1

const getCommandMessage = function(message, versionRange) {
  return red(
    message
      .replace(COMMAND_REGEXP, '')
      .replace('Command', `Node ${versionRange}`),
  )
}

// Remove the command path and arguments from the error message
const COMMAND_REGEXP = /:.*/u

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
