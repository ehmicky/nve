import { argv, exit } from 'process'

import filterObj from 'filter-obj'
import { validRange } from 'semver'

export const parseInput = function(yargs) {
  const input = argv.slice(2)

  const { versionRanges, command, args, opts } = parseArgs(input, yargs)
  const optsA = parseOpts(opts, yargs)
  return { versionRanges, command, args, opts: optsA }
}

const parseArgs = function(input, yargs) {
  if (input.length === 0) {
    missingVersion(yargs)
  }

  // yargs parses any --option meant for the `command`. We only want to apply
  // yargs on the --option meant for `nve`
  const versionStart = getVersionStart(input)
  const opts = input.slice(0, versionStart)
  const otherArgs = input.slice(versionStart)

  // Separate variadic version ranges from `command` and `args`
  const versionEnd = getVersionEnd(otherArgs, yargs)
  const versionRanges = otherArgs.slice(0, versionEnd)
  const [command, ...args] = otherArgs.slice(versionEnd)

  return { versionRanges, command, args, opts }
}

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

const getVersionEnd = function(otherArgs, yargs) {
  const versionEnd = otherArgs.findIndex(isNotVersion)

  if (versionEnd === 0) {
    missingVersion(yargs)
  }

  if (versionEnd === -1) {
    return otherArgs.length
  }

  return versionEnd
}

const isNotVersion = function(arg) {
  return validRange(arg) === null
}

const missingVersion = function(yargs) {
  console.error(`Missing version.\n`)
  yargs.showHelp()
  exit(1)
}

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

const handleSpawnOpts = function({ shell, ...opts }) {
  if (shell === undefined) {
    return opts
  }

  return { ...opts, spawnOptions: { shell } }
}

const DEFAULT_CLI_OPTS = { progress: true }
