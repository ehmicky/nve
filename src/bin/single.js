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
  const spawnOptions = {
    ...opts.spawnOptions,
    ...stdinOptions,
    stdout: 'inherit',
    stderr: 'inherit',
    buffer: false,
  }
  const { childProcess, version } = await runVersion(
    versionRange,
    command,
    args,
    { ...opts, spawnOptions },
  )

  if (command === undefined) {
    printVersion(version)
    return
  }

  try {
    await childProcess
  } catch (error) {
    return handleSingleError({ error })
  }
}
