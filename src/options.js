import filterObj from 'filter-obj'

// Parse nve --options using yargs, and assign default values
export const parseOpts = function (opts, yargs) {
  const optsA = yargs.parse(opts)
  const optsB = filterObj(optsA, isUserOpt)
  const optsC = { ...DEFAULT_CLI_OPTS, ...optsB }
  const { continue: continueOpt, parallel, ...optsD } = optsC
  return { opts: optsD, continueOpt, parallel }
}

// Remove `yargs`-specific options, shortcuts and dash-cased
const isUserOpt = function (key, value) {
  return (
    value !== undefined &&
    !INTERNAL_KEYS.includes(key) &&
    key.length !== 1 &&
    !key.includes('-')
  )
}

const INTERNAL_KEYS = ['help', 'version', '_', '$0']

const DEFAULT_CLI_OPTS = { progress: true, continue: false, parallel: false }
