#!/usr/bin/env node
import { exit } from 'process'

import { defineCli } from './top.js'
import { parseInput } from './parse.js'
import { runSingle } from './single.js'
import { runSerial } from './serial.js'
import { handleTopError } from './error.js'

// CLI that forwards its arguments but using a specific Node.js version
const runCli = async function() {
  const yargs = defineCli()

  try {
    const {
      versionRanges,
      command,
      args,
      opts,
      continueOpt,
      parallel,
    } = parseInput(yargs)
    const exitCode = await runMain({
      versionRanges,
      command,
      args,
      opts,
      continueOpt,
      parallel,
    })
    exit(exitCode)
  } catch (error) {
    const exitCode = handleTopError(error, yargs)
    exit(exitCode)
  }
}

const runMain = function({ versionRanges, command, args, opts, continueOpt }) {
  if (versionRanges.length === 1) {
    return runSingle({ versionRanges, command, args, opts })
  }

  return runSerial({ versionRanges, command, args, opts, continueOpt })
}

runCli()
