import filterObj from 'filter-obj'

// Parse nve --options using yargs, and assign default values
export const parseOpts = function(opts, yargs) {
  const optsA = yargs.parse(opts)
  const optsB = filterObj(optsA, isUserOpt)
  const optsC = handleSpawnOpts(optsB)
  const optsD = { ...DEFAULT_CLI_OPTS, ...optsC }
  const { continue: continueOpt, parallel, ...optsE } = optsD
  return { opts: optsE, continueOpt, parallel }
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

// `--shell` CLI flag is `execaOptions.shell`
const handleSpawnOpts = function({ shell, ...opts }) {
  if (shell === undefined) {
    return opts
  }

  return { ...opts, execaOptions: { shell } }
}

const DEFAULT_CLI_OPTS = { progress: true, continue: false, parallel: false }
