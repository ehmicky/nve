import { runVersion } from '../main.js'

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
  const stdinOptions = getSingleStdinOptions()
  const optsA = {
    ...opts,
    execaOptions: {
      ...opts.execaOptions,
      ...stdinOptions,
      stdout: 'inherit',
      stderr: 'inherit',
      buffer: false,
      reject: true,
    },
  }

  if (command === undefined) {
    return printVersion(versionRange, args, optsA)
  }

  const { childProcess } = await runVersion(versionRange, command, args, optsA)

  try {
    await childProcess
  } catch (error) {
    return handleSingleError(error)
  }
}
