/* eslint-disable max-lines */
import { stdout, stderr } from 'process'
import { promisify } from 'util'

import { red } from 'chalk'

import { runVersions } from '../main.js'

import { getParallelStdinOptions } from './stdin.js'
import { printVersionHeader } from './header.js'
import { printVersions } from './dry.js'
import { handleParallelError } from './error.js'
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
  const versions = await asyncIteratorAll(iterable)

  await Promise.all([
    cleanupProcesses(versions, continueOpt, state),
    runProcesses(versions, continueOpt, state),
  ])
}

const cleanupProcesses = async function(versions, continueOpt, state) {
  await Promise.all(
    versions.map(({ childProcess, versionRange }) =>
      cleanupProcess({
        childProcess,
        versionRange,
        versions,
        state,
        continueOpt,
      }),
    ),
  )
}

const cleanupProcess = async function({
  childProcess,
  versionRange,
  versions,
  state,
  continueOpt,
}) {
  try {
    await childProcess
  } catch (error) {
    terminateProcesses({ error, versions, versionRange, state, continueOpt })
  }
}

const terminateProcesses = function({
  error,
  versions,
  versionRange,
  state,
  continueOpt,
}) {
  if (state.failedError !== undefined || continueOpt) {
    return
  }

  // eslint-disable-next-line fp/no-mutation, no-param-reassign
  state.failedError = error
  // eslint-disable-next-line fp/no-mutation, no-param-reassign
  state.failedVersionRange = versionRange

  versions.forEach(terminateProcess)
}

const terminateProcess = function({ childProcess }) {
  childProcess.kill()
}

const runProcesses = async function(versions, continueOpt, state) {
  // eslint-disable-next-line fp/no-loops
  for await (const { childProcess, versionRange } of versions) {
    const shouldStop = await runProcess({
      childProcess,
      versionRange,
      continueOpt,
      state,
    })

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
    return handleProcessError({ error, versionRange, continueOpt, state })
  }
}

const handleProcessError = async function({
  error,
  versionRange,
  continueOpt,
  state,
}) {
  if (continueOpt) {
    handleParallelError({ error, versionRange })
    return false
  }

  // Ensure termination logic is triggered first
  await pSetTimeout(0)

  const { failedError, failedVersionRange } = state

  printAborted({ error, failedError, versionRange, failedVersionRange })

  handleParallelError({ error: failedError, versionRange: failedVersionRange })

  return true
}

const printAborted = function({
  error,
  error: { all },
  failedError,
  versionRange,
  failedVersionRange,
}) {
  if (failedError === error) {
    return
  }

  writeProcessOutput(all, stdout)

  stderr.write(red(`Node ${versionRange} aborted\n`))

  printVersionHeader(failedVersionRange)
}

/* eslint-enable max-lines */
