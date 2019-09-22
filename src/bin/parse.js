import { argv } from 'process'

import filterObj from 'filter-obj'

export const parseOpts = function(yargs) {
  const input = argv.slice(2)

  // yargs parses any --option meant for the `command`. We only want to apply
  // yargs on the --option meant for `nve`
  const versionIndex = getVersionIndex(input)
  const opts = input.slice(0, versionIndex)
  const [versionRange, command, ...args] = input.slice(versionIndex)

  const optsA = yargs.parse(opts)
  const optsB = filterObj(optsA, isUserOpt)

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
const isUserOpt = function(key, value) {
  return (
    value !== undefined &&
    !INTERNAL_KEYS.includes(key) &&
    key.length !== 1 &&
    !key.includes('-')
  )
}

const INTERNAL_KEYS = ['help', 'version', '_', '$0']
