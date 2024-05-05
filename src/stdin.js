import { stdin } from 'node:process'

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
//  - piping `get-stdin` is not needed since it would pipe an empty buffer
// If stdin is piped:
//  - inheriting it works
//  - with serial commands, the whole stdin must be retrieved first then piped
//    to each command. Otherwise only the first command would get stdin.

export const singleStdinOptions = { stdin: 'inherit' }

export const getSerialStdinOptions = async () => {
  // stdin in automated tests is always non-interactive, so this must be
  // manually tested instead.
  /* c8 ignore start */
  if (stdin.isTTY) {
    return { stdin: 'inherit' }
  }
  /* c8 ignore stop */

  return await getPipedStdin()
}

export const getParallelStdinOptions = async () => await getPipedStdin()

const getPipedStdin = async () => {
  const input = await getStdin.buffer()
  return input.length === 0 ? { stdin: 'inherit' } : { stdin: 'pipe', input }
}
