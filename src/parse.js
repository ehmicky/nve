import { argv } from 'process'

import { validRange } from 'semver'

import { parseOpts } from './options.js'

// Parse CLI input
export const parseInput = function (yargs) {
  const input = argv.slice(2)

  const { versionRanges, command, args, opts } = parseArgs(input)
  const { opts: optsA, continueOpt, parallel } = parseOpts(opts, yargs)

  // We do this after options parsing in case --help or --version was passed
  if (versionRanges.length === 0) {
    throw new Error('Missing version.')
  }

  return { versionRanges, command, args, opts: optsA, continueOpt, parallel }
}

const parseArgs = function (input) {
  // yargs parses any --option meant for the `command`.
  // However we only want to apply yargs on the --option meant for `nve`.
  const versionStart = getVersionStart(input)
  const opts = input.slice(0, versionStart)
  const otherArgs = input.slice(versionStart)

  // Separate variadic version ranges from `command` and `args`
  const versionEnd = getVersionEnd(otherArgs)
  const versionRanges = otherArgs.slice(0, versionEnd)
  const [command, ...args] = otherArgs.slice(versionEnd)

  return { versionRanges, command, args, opts }
}

// Retrieve the index of the first non --option CLI argument
const getVersionStart = function (input) {
  const versionStart = input.findIndex(isPositionalArg)

  if (versionStart === -1) {
    return input.length
  }

  return versionStart
}

const isPositionalArg = function (arg) {
  return !arg.startsWith('-')
}

// Retrieve the index of the first non versionRange CLI argument
const getVersionEnd = function (otherArgs) {
  const versionEnd = otherArgs.findIndex(isCommand)

  if (versionEnd === -1) {
    return otherArgs.length
  }

  return versionEnd
}

const isCommand = function (arg) {
  return validRange(arg) === null
}
