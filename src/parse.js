import { argv } from 'process'

import { validRange } from 'semver'

import { parseOpts } from './options.js'

// Parse CLI input
export const parseInput = function (yargs) {
  const input = argv.slice(2)

  const { opts, versionArg, command, args } = parseArgs(input)
  const { opts: optsA, continueOpt, parallel } = parseOpts(opts, yargs)

  // We do this after options parsing in case --help or --version was passed
  if (versionArg === undefined) {
    throw new Error('Missing version.')
  }

  const versionRanges = versionArg.split(VERSION_DELIMITER)
  return { versionRanges, command, args, opts: optsA, continueOpt, parallel }
}

// yargs parses any --option meant for the `command`.
// However we only want to apply yargs on the --option meant for `nve`.
const parseArgs = function (input) {
  const versionStart = getVersionStart(input)
  const opts = input.slice(0, versionStart)
  const [versionArg, command, ...args] = input.slice(versionStart)
  return { opts, versionArg, command, args }
}

// Retrieve the index of the first non --option CLI argument
const getVersionStart = function (input) {
  const versionStart = input.findIndex(isVersionArg)

  if (versionStart !== -1) {
    return versionStart
  }

  if (isGenericFlags(input)) {
    return input.length
  }

  return 0
}

// When no version has been specified, this can mean:
//   - one of those CLI flags has been used
//   - user error: the version is missing or has a typo
const isGenericFlags = function (input) {
  return input.every(isGenericFlag)
}

const isGenericFlag = function (arg) {
  return GENERIC_FLAGS.has(arg)
}

const GENERIC_FLAGS = new Set(['-h', '--help', '-v', '--version'])

const isVersionArg = function (arg) {
  return arg.split(VERSION_DELIMITER).every(isVersion)
}

const isVersion = function (value) {
  return ALIASES.has(value) || validRange(value) !== null
}

const ALIASES = new Set(['latest', 'lts', 'global', 'local'])

const VERSION_DELIMITER = ','
