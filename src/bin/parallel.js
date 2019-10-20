import { stdout } from 'process'
import { promisify } from 'util'

import { runVersions } from '../main.js'

import { getParallelStdinOptions } from './stdin.js'
import { printVersionHeader } from './header.js'
import { printVersions } from './dry.js'
import { cleanupProcesses } from './cleanup.js'
import { handleParallelError, handleFastParallelError } from './error.js'
import { writeProcessOutput } from './output.js'
import { asyncIteratorAll } from './utils.js'

const pSetTimeout = promisify(setTimeout)

// Run multiple Node versions in parallel
export const runParallel = async function({
  versionRanges,
  command,
  args,
  opts,
  continueOpt,
}) {
  const stdinOptions = await getParallelStdinOptions()
  const spawnOptions = {
    ...opts.spawnOptions,
    ...stdinOptions,
    stdout: 'pipe',
    stderr: 'pipe',
    buffer: true,
    all: true,
    stripFinalNewline: true,
  }
  const iterable = runVersions(versionRanges, command, args, {
    ...opts,
    spawnOptions,
  })

  if (command === undefined) {
    await printVersions(iterable)
    return
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
  // eslint-disable-next-line fp/no-loops
  for await (const { childProcess, versionRange } of versions) {
    const shouldStop = await runProcess({
      childProcess,
      versionRange,
      continueOpt,
      state,
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
  childProcess,
  versionRange,
  continueOpt,
  state,
}) {
  printVersionHeader(versionRange)

  try {
    const { all } = await childProcess
    writeProcessOutput(all, stdout)
  } catch (error) {
    await handleProcessError({ error, versionRange, continueOpt, state })
    return !continueOpt
  }
}

// We use different error handling logic depending on whether `--continue` is
// used
const handleProcessError = async function({
  error,
  versionRange,
  continueOpt,
  state,
}) {
  if (continueOpt) {
    handleParallelError(error, versionRange, state)
    return
  }

  // Ensure termination logic is triggered first
  await pSetTimeout(0)

  handleFastParallelError(error, versionRange, state)
}
