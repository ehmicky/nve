import { execa } from 'execa'
import nvexeca from 'nvexeca'

import { cancelOnError } from './abort.js'
import { printVersions } from './dry.js'
import { handleSerialError } from './error.js'
import { printVersionHeader } from './header.js'
import { getSerialStdinOptions } from './stdin.js'

// Run multiple Node versions serially
export const runSerial = async ({
  versionRanges,
  command,
  args,
  opts,
  controller,
  continueOpt,
}) => {
  if (command === undefined) {
    return printVersions(versionRanges, opts, controller)
  }

  const stdinOptions = await getSerialStdinOptions()
  const optsA = {
    ...opts,
    dry: true,
    ...stdinOptions,
    stdout: 'inherit',
    stderr: 'inherit',
    reject: true,
    buffer: false,
  }

  const versions = await cancelOnError(
    versionRanges.map((versionRange) =>
      nvexeca(versionRange, command, args, optsA),
    ),
    controller,
  )

  const state = {}
  await runProcesses({ versions, state, continueOpt })
  return state.exitCode
}

const runProcesses = async ({ versions, state, continueOpt }) => {
  // eslint-disable-next-line fp/no-loops
  for (const { version, command, args, execaOptions } of versions) {
    printVersionHeader(version)

    // eslint-disable-next-line no-await-in-loop
    const shouldStop = await runProcess({
      version,
      command,
      args,
      execaOptions,
      state,
      continueOpt,
    })

    // If the `continue` option is `false` (default), we stop execution.
    // Otherwise, we continue execution but we print the error message and use
    // the last non-0 exit code.
    // eslint-disable-next-line max-depth
    if (shouldStop) {
      return
    }
  }
}

const runProcess = async ({
  version,
  command,
  args,
  execaOptions,
  state,
  continueOpt,
}) => {
  try {
    await execa(command, args, execaOptions)
  } catch (error) {
    handleSerialError(error, version, state)
    return !continueOpt
  }
}
