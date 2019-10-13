#!/usr/bin/env node
import { exit } from 'process'

import { defineCli } from './top.js'
import { parseInput } from './parse.js'
import { runSingle } from './single.js'
import { runSerial } from './serial.js'
import { handleTopError } from './error.js'

// CLI that forwards its arguments but using a specific Node.js version
const runCli = async function() {
  try {
    const yargs = defineCli()
    const { versionRanges, command, args, opts } = parseInput(yargs)
    await runMain({ versionRanges, command, args, opts })
    exit(0)
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

runCli()
