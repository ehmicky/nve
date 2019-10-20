import { stdout } from 'process'

import { runVersions } from '../main.js'

import { getParallelStdinOptions } from './stdin.js'
import { getColorOptions } from './colors.js'
import { printVersionHeader } from './header.js'
import { printVersions } from './dry.js'
import { cleanupProcesses } from './cleanup.js'
import { handleParallelError } from './error.js'
import { writeProcessOutput } from './output.js'
import { asyncIteratorAll } from './utils.js'

// Run multiple Node versions in parallel
export const runParallel = async function({
  versionRanges,
  command,
  args,
  opts,
  continueOpt,
}) {
  const stdinOptions = await getParallelStdinOptions()
  const colorOptions = getColorOptions()
  const spawnOptions = {
    ...opts.spawnOptions,
    ...stdinOptions,
    ...colorOptions,
    stdout: 'pipe',
    stderr: 'pipe',
    buffer: true,
    all: true,
    stripFinalNewline: true,
    reject: true,
  }
  const iterable = runVersions(versionRanges, command, args, {
    ...opts,
    spawnOptions,
  })

  if (command === undefined) {
    return printVersions(iterable)
  }

  const state = {}
  // Start all child processes in parallel, but do not await them yet
  const versions = await asyncIteratorAll(iterable)

  await Promise.all([
    cleanupProcesses(versions, continueOpt, state),
    runProcesses(versions, continueOpt, state),
  ])

  return state.exitCode
}

// Print child processes in serial order, even though they are running in
// parallel in the background.
const runProcesses = async function(versions, continueOpt, state) {
  // eslint-disable-next-line fp/no-let
  let index = 0

  // eslint-disable-next-line fp/no-loops
  for await (const { childProcess, versionRange } of versions) {
    const shouldStop = await runProcess({
      childProcess,
      versionRange,
      continueOpt,
      state,
      index,
    })

    // If the `continue` option is `false` (default), we stop execution.
    // Otherwise, we continue execution but we print the error message and use
    // the last non-0 exit code.
    // eslint-disable-next-line max-depth
    if (shouldStop) {
      return
    }

    // eslint-disable-next-line fp/no-mutation
    index += 1
  }
}

const runProcess = async function({
  childProcess,
  versionRange,
  continueOpt,
  state,
  index,
}) {
  printVersionHeader(versionRange)

  // We stream the first child process output because it is more
  // developer-friendly. However the next ones cannot be streamed since they
  // start in parallel
  if (index === 0) {
    childProcess.all.pipe(stdout)
  }

  try {
    const { all } = await childProcess
    writeProcessOutput(all, stdout, index)
  } catch (error) {
    await handleParallelError({
      error,
      versionRange,
      continueOpt,
      state,
      index,
    })
    return !continueOpt
  }
}
