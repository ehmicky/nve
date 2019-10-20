import { runVersions } from '../main.js'

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
  const spawnOptions = {
    ...opts.spawnOptions,
    ...stdinOptions,
    stdout: 'inherit',
    stderr: 'inherit',
    buffer: false,
  }
  const iterable = runVersions(versionRanges, command, args, {
    ...opts,
    spawnOptions,
  })

  if (command === undefined) {
    await printVersions(iterable)
    return
  }

  const state = { index: 0 }
  await runProcesses({ versionRanges, iterable, state, continueOpt })
  return state.exitCode
}

const runProcesses = async function({
  versionRanges,
  iterable,
  state,
  continueOpt,
}) {
  // When spawning a child process with stdout|stderr `inherit`, it might
  // print to it synchronously (e.g. when spawning `echo ...`). The header
  // must be printed first so we must resort to doing it like this.
  printHeader({ versionRanges, state })

  // eslint-disable-next-line fp/no-loops
  for await (const { childProcess, versionRange } of iterable) {
    await runProcess({ childProcess, versionRange, state, continueOpt })

    printHeader({ versionRanges, state })
  }
}

const runProcess = async function({
  childProcess,
  versionRange,
  state,
  continueOpt,
}) {
  try {
    await childProcess
  } catch (error) {
    handleSerialError({ error, versionRange, state, continueOpt })
  }
}
