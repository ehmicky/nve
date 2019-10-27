import nvexeca from '../main.js'

import { getSingleStdinOptions } from './stdin.js'
import { printVersion } from './dry.js'
import { handleSingleError } from './error.js'

// Run a single Node version
export const runSingle = async function({
  versionRanges: [versionRange],
  command,
  args,
  opts,
}) {
  if (command === undefined) {
    return printVersion(versionRange, opts)
  }

  const stdinOptions = getSingleStdinOptions()
  const optsA = {
    ...opts,
    ...stdinOptions,
    stdout: 'inherit',
    stderr: 'inherit',
    buffer: false,
    reject: true,
  }

  const { childProcess } = await nvexeca(versionRange, command, args, optsA)

  try {
    await childProcess
  } catch (error) {
    return handleSingleError(error)
  }
}
