import execa from 'execa'

import { dryRunVersion } from '../main.js'

import { getSerialStdinOptions } from './stdin.js'
import { printHeader } from './header.js'
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
      dryRunVersion(versionRange, command, args, optsA),
    ),
  )

  const state = { index: 0 }
  await runProcesses({ versionRanges, versions, state, continueOpt })
  return state.exitCode
}

const runProcesses = async function({
  versionRanges,
  versions,
  state,
  continueOpt,
}) {
  // When spawning a child process with stdout|stderr `inherit`, it might
  // print to it synchronously (e.g. when spawning `echo ...`). The header
  // must be printed first so we must resort to doing it like this.
  printHeader({ versionRanges, state })

  // eslint-disable-next-line fp/no-loops
  for (const { versionRange, command, args, execaOptions } of versions) {
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

    printHeader({ versionRanges, state })
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
