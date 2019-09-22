#!/usr/bin/env node
import { exit } from 'process'

import pEvent from 'p-event'

import nve from '../main.js'

import { defineCli } from './top.js'
import { parseOpts } from './parse.js'

// CLI that forwards its arguments but using a specific Node.js version
const runCli = async function() {
  try {
    const yargs = defineCli()
    const { versionRange, command, args, opts } = parseOpts(yargs)
    const code = await runMain({ versionRange, command, args, opts })
    exit(code)
  } catch (error) {
    console.error(error.message)
    exit(1)
  }
}

const runMain = async function({ versionRange, command, args, opts }) {
  const childProcess = await nve(versionRange, command, args, {
    ...opts,
    ...CLI_OPTS,
  })
  const code = await pEvent(childProcess, 'exit')
  return code
}

const CLI_OPTS = { spawn: { stdio: 'inherit' } }

runCli()
