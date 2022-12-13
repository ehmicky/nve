import { excludeKeys } from 'filter-obj'

// Parse nve --options using yargs, and assign default values
export const parseOpts = (opts, yargs) => {
  const optsA = yargs.parse(opts)
  const optsB = excludeKeys(optsA, isInternalOpt)
  const optsC = { ...DEFAULT_CLI_OPTS, ...optsB }
  const { continue: continueOpt, parallel, ...optsD } = optsC
  return { opts: optsD, continueOpt, parallel }
}

// Remove `yargs`-specific options, shortcuts and dash-cased
const isInternalOpt = (key, value) =>
  value === undefined ||
  INTERNAL_KEYS.has(key) ||
  key.length === 1 ||
  key.includes('-')

const INTERNAL_KEYS = new Set(['help', 'version', '_', '$0'])

const DEFAULT_CLI_OPTS = { progress: true, continue: false, parallel: false }
