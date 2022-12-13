#!/usr/bin/env node
import { dirname } from 'node:path'
import { exit } from 'node:process'
import { fileURLToPath } from 'node:url'

import handleCliError from 'handle-cli-error'
import { readPackageUp } from 'read-pkg-up'
import updateNotifier from 'update-notifier'

import { handleFault } from './fault.js'
import { runParallel } from './parallel.js'
import { parseInput } from './parse.js'
import { runSerial } from './serial.js'
import { runSingle } from './single.js'
// eslint-disable-next-line import/max-dependencies
import { defineCli } from './top.js'

// CLI that forwards its arguments but using a specific Node.js version
const runCli = async () => {
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
    handleCliError(error, { stack: false })
  }
}

// TODO: use static JSON imports once those are possible
const checkUpdate = async () => {
  const cwd = dirname(fileURLToPath(import.meta.url))
  const { packageJson } = await readPackageUp({ cwd, normalize: false })
  updateNotifier({ pkg: packageJson }).notify()
}

const runMain = ({
  versionRanges,
  command,
  args,
  opts,
  continueOpt,
  parallel,
}) => {
  if (versionRanges.length === 1) {
    return runSingle({ versionRanges, command, args, opts })
  }

  if (parallel) {
    return runParallel({ versionRanges, command, args, opts, continueOpt })
  }

  return runSerial({ versionRanges, command, args, opts, continueOpt })
}

// TODO: use `await runCli()` after dropping support for Node <14.19.0
// eslint-disable-next-line unicorn/prefer-top-level-await
runCli()
