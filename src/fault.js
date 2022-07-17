import { stderr } from 'process'

import chalk from 'chalk'

// Print --help on common input syntax mistakes
export const handleFault = function (error) {
  if (shouldPrintHelp(error)) {
    error.message += `\n${SHORT_USAGE}`
  }
}

const shouldPrintHelp = function (error) {
  return (
    error instanceof Error &&
    typeof error.message === 'string' &&
    error.message.includes('Missing version')
  )
}

// Print --help when command is not found, usually indicating input syntax
// mistake
export const printInvalidCommand = function (code, exitCode) {
  if (!isInvalidComment(code, exitCode)) {
    return
  }

  stderr.write(`${SHORT_USAGE}\n`)
}

// This does not always work, e.g. not on Windows cmd.exe
const isInvalidComment = function (code, exitCode) {
  return code === 'ENOENT' || exitCode === BASH_COMMAND_CODE
}

// This is only valid for Bash, so might give false positives for other programs
// that use that exit code
const BASH_COMMAND_CODE = 127

const SHORT_USAGE = `
${chalk.red('Invalid input syntax.')}

It should be:

  nve [OPTIONS...] VERSION,... [COMMAND] [ARGS...]

Examples:

  nve 8 node file.js
  nve 8 npm test
  nve 8,9,10 npm test
  nve --no-progress 8 npm test`
