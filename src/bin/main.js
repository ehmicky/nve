#!/usr/bin/env node
import { exit } from 'process'

import { runVersion } from '../main.js'

import { defineCli } from './top.js'
import { parseOpts } from './parse.js'
import { handleExecaError, handleTopError } from './error.js'

// CLI that forwards its arguments but using a specific Node.js version
const runCli = async function() {
  try {
    const yargs = defineCli()
    const { versionRange, command, args, opts } = parseOpts(yargs)
    const exitCode = await runMain({
      versionRange,
      command,
      args,
      opts,
    })
    exit(exitCode)
  } catch (error) {
    const exitCode = handleTopError(error)
    exit(exitCode)
  }
}

const runMain = async function({ versionRange, command, args, opts }) {
  const { childProcess, version } = await runVersion(
    versionRange,
    command,
    args,
    opts,
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

runCli()
