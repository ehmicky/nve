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
  const { childProcess, version } = await runVersion(
    versionRange,
    command,
    args,
    {
      ...opts,
      spawnOptions: {
        ...opts.spawnOptions,
        ...stdinOptions,
        stdout: 'inherit',
        stderr: 'inherit',
        buffer: false,
      },
    },
  )

  if (command === undefined) {
    printVersion(version)
    return
  }

  await runProcess(childProcess)
}

const runProcess = async function(childProcess) {
  try {
    await childProcess
  } catch (error) {
    throw handleSingleError({ error })
  }
}
