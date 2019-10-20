/* eslint-disable max-lines */
import { stdout } from 'process'
import { promisify } from 'util'

import asyncIteratorAll from 'async-iterator-all'
import pMapSeries from 'p-map-series'

import { runVersions } from '../main.js'

import { getParallelStdinOptions } from './stdin.js'
import { printVersionHeader } from './header.js'
import { printVersions } from './dry.js'
import { handleParallelError } from './error.js'

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
    versions.map(({ childProcess }, index) =>
      cleanupProcess({ childProcess, index, versions, state, continueOpt }),
    ),
  )
}

const cleanupProcess = async function({
  childProcess,
  index,
  versions,
  state,
  continueOpt,
}) {
  try {
    await childProcess
  } catch (error) {
    terminateProcesses({ index, versions, state, continueOpt })
  }
}

const terminateProcesses = function({ index, versions, state, continueOpt }) {
  if (state.failedIndex !== undefined || continueOpt) {
    return
  }

  // eslint-disable-next-line fp/no-mutation, no-param-reassign
  state.failedIndex = index
  versions.forEach(terminateProcess)
}

const terminateProcess = function({ childProcess }) {
  childProcess.kill()
}

const runProcesses = async function(versions, continueOpt, state) {
  await pMapSeries(versions, ({ childProcess, versionRange }, index) =>
    runProcess({ childProcess, versionRange, continueOpt, state, index }),
  )
}

const runProcess = async function({
  childProcess,
  versionRange,
  continueOpt,
  state,
  index,
}) {
  const isFailedProcess = state.failedIndex === index

  if (!state.abortedPrinted || isFailedProcess) {
    printVersionHeader(versionRange)
  }

  try {
    const { all } = await childProcess
    stdout.write(`${all}\n`)
  } catch (error) {
    await handleProcessError({ error, versionRange, continueOpt, state, index })
  }
}

// eslint-disable-next-line max-statements, complexity
const handleProcessError = async function({
  error,
  versionRange,
  continueOpt,
  state,
  index,
}) {
  if (continueOpt) {
    handleParallelError({ error, versionRange })
    return
  }

  // Ensure abort logic is triggered first
  await pSetTimeout(0)

  // TODO: remove
  if (state.failedIndex === undefined) {
    throw new Error('Should never happen')
  }

  const isFailedProcess = state.failedIndex === index

  if (state.abortedPrinted && !isFailedProcess) {
    return
  }

  // eslint-disable-next-line fp/no-mutation, no-param-reassign
  state.abortedPrinted = true

  if (!isFailedProcess) {
    stdout.write(error.all)
    console.error(`Node ${versionRange} aborted`)
    return
  }

  handleParallelError({ error, versionRange })
}
/* eslint-enable max-lines */
