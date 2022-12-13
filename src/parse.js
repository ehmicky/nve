import { argv } from 'node:process'

import semver from 'semver'

import { parseOpts } from './options.js'

// Parse CLI input
export const parseInput = (yargs) => {
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
const parseArgs = (input) => {
  const versionStart = getVersionStart(input)
  const opts = input.slice(0, versionStart)
  const [versionArg, command, ...args] = input.slice(versionStart)
  return { opts, versionArg, command, args }
}

// Retrieve the index of the first non --option CLI argument
const getVersionStart = (input) => {
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
const isGenericFlags = (input) => input.every(isGenericFlag)

const isGenericFlag = (arg) => GENERIC_FLAGS.has(arg)

const GENERIC_FLAGS = new Set(['-h', '--help', '-v', '--version'])

const isVersionArg = (arg) => arg.split(VERSION_DELIMITER).every(isVersion)

const isVersion = (value) =>
  ALIASES.has(value) || semver.validRange(value) !== null

const ALIASES = new Set(['latest', 'lts', 'global', 'local'])

const VERSION_DELIMITER = ','
