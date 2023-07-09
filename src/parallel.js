/* eslint-disable max-lines */
import { stdout } from 'node:process'

import { execa } from 'execa'
import nvexeca from 'nvexeca'

import { cancelOnError } from './abort.js'
import { cleanupProcesses } from './cleanup.js'
import { getColorOptions } from './colors.js'
import { printVersions } from './dry.js'
import { handleParallelError } from './error.js'
import { printVersionHeader } from './header.js'
import { writeProcessOutput } from './output.js'
// eslint-disable-next-line import/max-dependencies
import { getParallelStdinOptions } from './stdin.js'

// Run multiple Node versions in parallel
export const runParallel = async ({
  versionRanges,
  command,
  args,
  continueOpt,
  opts,
  controller,
}) => {
  if (command === undefined) {
    return printVersions(versionRanges, opts, controller)
  }

  const stdinOptions = await getParallelStdinOptions()
  const colorOptions = getColorOptions()
  const optsA = {
    ...opts,
    dry: true,
    ...stdinOptions,
    ...colorOptions,
    stdout: 'pipe',
    stderr: 'pipe',
    buffer: true,
    all: true,
    stripFinalNewline: true,
    reject: true,
  }

  const versions = await startProcesses({
    versionRanges,
    command,
    args,
    opts: optsA,
    controller,
  })

  const state = {}
  await Promise.all([
    cleanupProcesses(versions, continueOpt, state),
    runProcesses(versions, continueOpt, state),
  ])

  return state.exitCode
}

// We start child processes in parallel.
// We make a dry run first to ensure Node.js downloads happens before any
// child process.
const startProcesses = async ({
  versionRanges,
  command,
  args,
  opts,
  controller,
}) => {
  const versions = await cancelOnError(
    versionRanges.map((versionRange) =>
      nvexeca(versionRange, command, args, opts),
    ),
    controller,
  )
  const versionsA = versions.map(startProcess)
  return versionsA
}

const startProcess = ({ versionRange, command, args, execaOptions }) => {
  const childProcess = execa(command, args, execaOptions)
  return { childProcess, versionRange }
}

// Print child processes in serial order, even though they are running in
// parallel in the background.
const runProcesses = async (versions, continueOpt, state) => {
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

const runProcess = async ({
  childProcess,
  versionRange,
  continueOpt,
  state,
  index,
}) => {
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
/* eslint-enable max-lines */
