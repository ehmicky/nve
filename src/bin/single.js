import { runVersion } from '../main.js'

import { printVersion } from './print.js'
import { handleSingleError } from './error.js'

// Run a single Node version
export const runSingle = async function({
  versionRanges: [versionRange],
  command,
  args,
  opts,
}) {
  const optsA = {
    ...opts,
    spawnOptions: { ...opts.spawnOptions, stdio: 'inherit', buffer: false },
  }
  const { childProcess, version } = await runVersion(
    versionRange,
    command,
    args,
    optsA,
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
