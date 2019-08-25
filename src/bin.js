#!/usr/bin/env node
import { argv, exit } from 'process'

import nve from './main.js'

// CLI that forwards its arguments to another node instance of a specific
// version range. The version range is specified as the first argument.
const runCli = async function() {
  try {
    const [, , versionRange, ...args] = argv
    const { promise } = await nve(versionRange, args)
    const { code } = await promise
    // Forward the exit code from the child process
    exit(code)
  } catch (error) {
    console.error(error.message)
    exit(1)
  }
}

runCli()
