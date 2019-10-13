import { argv, exit } from 'process'

import filterObj from 'filter-obj'
import { validRange } from 'semver'

// Parse CLI input
export const parseInput = function(yargs) {
  const input = argv.slice(2)

  const { versionRanges, command, args, opts } = parseArgs(input, yargs)
  const optsA = parseOpts(opts, yargs)
  return { versionRanges, command, args, opts: optsA }
}

const parseArgs = function(input, yargs) {
  if (input.length === 0) {
    return missingVersion(yargs)
  }

  // yargs parses any --option meant for the `command`.
  // However we only want to apply yargs on the --option meant for `nve`.
  const versionStart = getVersionStart(input)
  const opts = input.slice(0, versionStart)
  const otherArgs = input.slice(versionStart)

  // Separate variadic version ranges from `command` and `args`
  const versionEnd = getVersionEnd(otherArgs, yargs)
  const versionRanges = otherArgs.slice(0, versionEnd)
  const [command, ...args] = otherArgs.slice(versionEnd)

  return { versionRanges, command, args, opts }
}

// Retrieve the index of the first non --option CLI argument
const getVersionStart = function(input) {
  const versionStart = input.findIndex(isPositionalArg)

  if (versionStart === -1) {
    return input.length
  }

  return versionStart
}

const isPositionalArg = function(arg) {
  return !arg.startsWith('-')
}

// Retrieve the index of the first non versionRange CLI argument
const getVersionEnd = function(otherArgs, yargs) {
  const versionEnd = otherArgs.findIndex(isCommand)

  if (versionEnd === 0) {
    return missingVersion(yargs)
  }

  if (versionEnd === -1) {
    return otherArgs.length
  }

  return versionEnd
}

const isCommand = function(arg) {
  return validRange(arg) === null
}

// Common mistake: the first argument (versionRange) is missing
const missingVersion = function(yargs) {
  console.error(`Missing version.\n`)
  yargs.showHelp()
  exit(1)
}

// Parse nve --options using yargs, and assign default values
const parseOpts = function(opts, yargs) {
  const optsA = yargs.parse(opts)
  const optsB = filterObj(optsA, isUserOpt)
  const optsC = handleSpawnOpts(optsB)
  const optsD = { ...DEFAULT_CLI_OPTS, ...optsC }
  return optsD
}

// Remove `yargs`-specific options, shortcuts and dash-cased
const isUserOpt = function(key, value) {
  return (
    value !== undefined &&
    !INTERNAL_KEYS.includes(key) &&
    key.length !== 1 &&
    !key.includes('-')
  )
}

const INTERNAL_KEYS = ['help', 'version', '_', '$0']

// `--shell` CLI flag is `spawnOptions.shell`
const handleSpawnOpts = function({ shell, ...opts }) {
  if (shell === undefined) {
    return opts
  }

  return { ...opts, spawnOptions: { shell } }
}

const DEFAULT_CLI_OPTS = { progress: true }
