import { argv } from 'process'

import { omitBy } from '../utils.js'

export const parseOpts = function(yargs) {
  const input = argv.slice(2)

  // yargs parses any --option meant for the `command`. We only want to apply
  // yargs on the --option meant for `nve`
  const versionIndex = getVersionIndex(input)
  const opts = input.slice(0, versionIndex)
  const [versionRange, command, ...args] = input.slice(versionIndex)

  const optsA = yargs.parse(opts)
  const optsB = omitBy(optsA, isInternalKey)

  return { versionRange, command, args, opts: optsB }
}

const getVersionIndex = function(input) {
  const versionIndex = input.findIndex(isPositionalArg)

  if (versionIndex === -1) {
    return input.length
  }

  return versionIndex
}

const isPositionalArg = function(arg) {
  return !arg.startsWith('-')
}

// Remove `yargs`-specific options, shortcuts and dash-cased
const isInternalKey = function(key, value) {
  return (
    value === undefined ||
    INTERNAL_KEYS.includes(key) ||
    key.length === 1 ||
    key.includes('-')
  )
}

const INTERNAL_KEYS = ['help', 'version', '_', '$0']
