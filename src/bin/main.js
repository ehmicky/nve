#!/usr/bin/env node
import { exit, stdout, stderr, platform } from 'process'

import { green } from 'chalk'

import { runVersion, runVersions } from '../main.js'

import { defineCli } from './top.js'
import { parseInput } from './parse.js'
import { handleExecaError, handleTopError } from './error.js'

// CLI that forwards its arguments but using a specific Node.js version
const runCli = async function() {
  try {
    const yargs = defineCli()
    const { versionRanges, command, args, opts } = parseInput(yargs)
    const exitCode = await runMain({ versionRanges, command, args, opts })
    exit(exitCode)
  } catch (error) {
    const exitCode = handleTopError(error)
    exit(exitCode)
  }
}

const runMain = function({ versionRanges, command, args, opts }) {
  if (versionRanges.length === 1) {
    return runSingle({ versionRanges, command, args, opts })
  }

  return runSerial({ versionRanges, command, args, opts })
}

const runSingle = async function({
  versionRanges: [versionRange],
  command,
  args,
  opts,
}) {
  const optsA = {
    ...opts,
    spawnOptions: {
      ...opts.spawnOptions,
      stdin: 'inherit',
      stdout: 'inherit',
      stderr: 'inherit',
      buffer: false,
    },
  }
  const { childProcess, version } = await runVersion(
    versionRange,
    command,
    args,
    optsA,
  )

  // When `command` is `undefined`, we only print the normalized Node.js version
  if (childProcess === undefined) {
    console.log(version)
    return 0
  }

  try {
    const { exitCode } = await childProcess
    return exitCode
  } catch (error) {
    throw handleExecaError({ error })
  }
}

const runSerial = async function({ versionRanges, command, args, opts }) {
  const optsA = {
    ...opts,
    spawnOptions: {
      ...opts.spawnOptions,
      stdin: 'inherit',
      stdout: 'pipe',
      stderr: 'pipe',
      buffer: false,
    },
  }
  const iterable = runVersions(versionRanges, command, args, optsA)

  try {
    // eslint-disable-next-line fp/no-loops
    for await (const { childProcess, versionRange, version } of iterable) {
      if (childProcess === undefined) {
        console.log(version)
        continue
      }

      printHeader(versionRange)
      childProcess.stdout.pipe(stdout)
      childProcess.stderr.pipe(stderr)
      await childProcess
    }

    return 0
  } catch (error) {
    throw handleExecaError({ error })
  }
}

const printHeader = function(versionRange) {
  const header = green(`\n ${HEXAGON}  Node ${versionRange}\n\n`)
  stdout.write(header)
}

// TODO: replace with `figures.nodejs` once
// https://github.com/sindresorhus/figures/pull/29 is merged
const HEXAGON = platform === 'win32' ? '\u2666' : '\u2B22'

runCli()
