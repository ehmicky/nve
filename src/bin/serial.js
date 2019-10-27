import execa from 'execa'

import { runVersion } from '../main.js'

import { getSerialStdinOptions } from './stdin.js'
import { printVersionHeader } from './header.js'
import { printVersions } from './dry.js'
import { handleSerialError } from './error.js'

// Run multiple Node versions serially
export const runSerial = async function({
  versionRanges,
  command,
  args,
  opts,
  continueOpt,
}) {
  const stdinOptions = await getSerialStdinOptions()
  const optsA = {
    ...opts,
    dry: true,
    execaOptions: {
      ...opts.execaOptions,
      ...stdinOptions,
      stdout: 'inherit',
      stderr: 'inherit',
      reject: true,
      buffer: false,
    },
  }

  if (command === undefined) {
    return printVersions(versionRanges, args, optsA)
  }

  const versions = await Promise.all(
    versionRanges.map(versionRange =>
      runVersion(versionRange, command, args, optsA),
    ),
  )

  const state = {}
  await runProcesses({ versions, state, continueOpt })
  return state.exitCode
}

const runProcesses = async function({ versions, state, continueOpt }) {
  // eslint-disable-next-line fp/no-loops
  for (const { versionRange, command, args, execaOptions } of versions) {
    printVersionHeader(versionRange)

    // eslint-disable-next-line no-await-in-loop
    const shouldStop = await runProcess({
      versionRange,
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

const runProcess = async function({
  versionRange,
  command,
  args,
  execaOptions,
  state,
  continueOpt,
}) {
  try {
    await execa(command, args, execaOptions)
  } catch (error) {
    handleSerialError(error, versionRange, state)
    return !continueOpt
  }
}
