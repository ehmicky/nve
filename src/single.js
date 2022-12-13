import nvexeca from 'nvexeca'

import { printVersion } from './dry.js'
import { handleSingleError } from './error.js'
import { getSingleStdinOptions } from './stdin.js'

// Run a single Node version
export const runSingle = async ({
  versionRanges: [versionRange],
  command,
  args,
  opts,
}) => {
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
