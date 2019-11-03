#!/usr/bin/env node
import { exit } from 'process'

import { defineCli } from './top.js'
import { parseInput } from './parse.js'
import { runSingle } from './single.js'
import { runSerial } from './serial.js'
import { runParallel } from './parallel.js'
import { handleFault } from './fault.js'

// CLI that forwards its arguments but using a specific Node.js version
const runCli = async function() {
  try {
    const yargs = defineCli()
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
    handleFault(error)
    exit(1)
  }
}

const runMain = function({
  versionRanges,
  command,
  args,
  opts,
  continueOpt,
  parallel,
}) {
  if (versionRanges.length === 1) {
    return runSingle({ versionRanges, command, args, opts })
  }

  if (parallel) {
    return runParallel({ versionRanges, command, args, opts, continueOpt })
  }

  return runSerial({ versionRanges, command, args, opts, continueOpt })
}

runCli()