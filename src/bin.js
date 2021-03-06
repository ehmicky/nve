#!/usr/bin/env node
import { dirname } from 'path'
import { exit } from 'process'
import { fileURLToPath } from 'url'

import { readPackageUpAsync } from 'read-pkg-up'
import UpdateNotifier from 'update-notifier'

import { handleFault } from './fault.js'
import { runParallel } from './parallel.js'
import { parseInput } from './parse.js'
import { runSerial } from './serial.js'
import { runSingle } from './single.js'
// eslint-disable-next-line import/max-dependencies
import { defineCli } from './top.js'

// CLI that forwards its arguments but using a specific Node.js version
const runCli = async function () {
  try {
    await checkUpdate()

    const yargs = defineCli()
    const { versionRanges, command, args, opts, continueOpt, parallel } =
      parseInput(yargs)
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

// TODO: use static JSON imports once those are possible
const checkUpdate = async function () {
  const cwd = dirname(fileURLToPath(import.meta.url))
  const { packageJson } = await readPackageUpAsync({ cwd, normalize: false })
  UpdateNotifier({ pkg: packageJson }).notify()
}

const runMain = function ({
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
