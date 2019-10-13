import { argv, exit } from 'process'

import { validRange } from 'semver'

import { parseOpts } from './options.js'

// Parse CLI input
export const parseInput = function(yargs) {
  const input = argv.slice(2)

  const { versionRanges, command, args, opts } = parseArgs(input, yargs)
  const optsA = parseOpts(opts, yargs)
  return { versionRanges, command, args, opts: optsA }
}

const parseArgs = function(input, yargs) {
  // yargs parses any --option meant for the `command`.
  // However we only want to apply yargs on the --option meant for `nve`.
  const versionStart = getVersionStart(input)
  const opts = input.slice(0, versionStart)
  const otherArgs = input.slice(versionStart)

  if (otherArgs.length === 0) {
    return missingVersion(yargs)
  }

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
