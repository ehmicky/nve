import filterObj from 'filter-obj'

// Parse nve --options using yargs, and assign default values
export const parseOpts = function(opts, yargs) {
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

// `--shell` CLI flag is `spawnOptions.shell`
const handleSpawnOpts = function({ shell, ...opts }) {
  if (shell === undefined) {
    return opts
  }

  return { ...opts, spawnOptions: { shell } }
}

const DEFAULT_CLI_OPTS = { progress: true }
