import { stdin } from 'process'

import getStdin from 'get-stdin'

// If the command is run in an interactive terminal, we keep stdin interactive:
//  - this is in case the command depends on user interaction (e.g. user
//    prompts)
//  - several utilities depend on process.stdin.isTTY, including to decide
//    whether to show colors
//  - this works for serial commands, but not for parallel commands since those
//    would compete for the same stdin
// If there is no stdin:
//  - inheriting stdin works
//  - piping `get-stdin` works because it pipes an empty buffer
// If stdin is piped:
//  - inheriting it works
//  - with serial commands, the whole stdin must be retrieved first then piped
//    to each command. Otherwise only the first command would get stdin.

export const getSingleStdinOptions = function() {
  return { stdin: 'inherit' }
}

export const getSerialStdinOptions = async function() {
  // stdin in automated tests is always non-interactive, so this must be
  // manually tested instead.
  // istanbul ignore next
  if (stdin.isTTY) {
    return { stdin: 'inherit' }
  }

  const input = await getStdin.buffer()
  return { stdin: 'pipe', input }
}

export const getParallelStdinOptions = async function() {
  const input = await getStdin.buffer()
  return { stdin: 'pipe', input }
}
