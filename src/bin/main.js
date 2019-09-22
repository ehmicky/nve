#!/usr/bin/env node
import { exit } from 'process'
import { promisify } from 'util'

import pEvent from 'p-event'
import endOfStream from 'end-of-stream'

import nve from '../main.js'

import { defineCli } from './top.js'
import { parseOpts } from './parse.js'

// TODO: replace with `Stream.finished()` after dropping support for Node 8/9
const pEndOfStream = promisify(endOfStream)

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
  const [code] = await Promise.all([
    // TODO: use `require('events').once()` after dropping support for Node 8/9
    pEvent(childProcess, 'exit'),
    waitForStream(childProcess.stdout),
    waitForStream(childProcess.stderr),
  ])
  return code
}

const waitForStream = async function(stream) {
  if (stream === null) {
    return
  }

  await pEndOfStream(stream)
}

const CLI_OPTS = { spawn: { stdio: 'inherit' } }

runCli()
