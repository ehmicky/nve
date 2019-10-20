import { stderr } from 'process'

// Handle top-level errors not due to child process errors, such as input
// validation errors, Node.js download errors and bugs.
export const handleFault = function({ message }) {
  stderr.write(`${message}\n`)
  printHelp(message)
}

// Print --help on common input syntax mistakes
const printHelp = function(message) {
  if (!shouldPrintHelp(message)) {
    return
  }

  stderr.write(SHORT_USAGE)
}

const SHORT_USAGE = `Invalid input syntax. It should be:

  nve [OPTIONS...] VERSION... [COMMAND] [ARGS...]

Examples:

  nve 8 npm test
  nve 8 9 10 npm test
  nve --no-progress 8 npm test
`

const shouldPrintHelp = function(message) {
  return message.includes('Missing version')
}
