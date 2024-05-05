import { execa } from 'execa'
import figures from 'figures'
import { getBinPath } from 'get-bin-path'

const BIN_PATH = getBinPath()

// eslint-disable-next-line max-params
export const runSerial = (versionRange, args, opts, execaOpts) =>
  runCli(`${versionRange},${versionRange}`, args, opts, execaOpts)

// eslint-disable-next-line max-params
export const runParallel = (versionRange, args, opts = [], execaOpts = {}) =>
  runCli(
    `${versionRange},${versionRange}`,
    args,
    [...opts, '--parallel'],
    execaOpts,
  )

// eslint-disable-next-line max-params
export const runCliNoVersion = (versionRange, args, opts, execaOpts) =>
  runCli(versionRange, args, opts, execaOpts, true)

// When calling several `nve` in parallel, their output is sometimes duplicated
// in `execa.all`. This bug is not related to `nve` but to some bug inside
// `execa` (based on the `merge-stream` package).
// So we don't use `execa.all`
export const runCli = async (
  versionRange,
  args,
  opts = [],
  execaOpts = {},
  progress = false,
  // eslint-disable-next-line max-params
) => {
  const noProgress = progress ? [] : ['--no-progress']
  const versionRangeArgs = versionRange === '' ? [] : [versionRange]
  const { exitCode, stdout, stderr } = await execa(
    await BIN_PATH,
    [...noProgress, ...opts, ...versionRangeArgs, ...args],
    { reject: false, stdin: 'ignore', ...execaOpts },
  )
  const stdoutA = normalizeOutput(stdout)
  const stderrA = normalizeOutput(stderr)
  return { exitCode, stdout: stdoutA, stderr: stderrA }
}

// Normalize Windows specifics
const normalizeOutput = (output) =>
  output
    .replaceAll('\r\n', '\n')
    .replaceAll('cmd "test"', 'test')
    .trim()
    .replaceAll(figures.nodejs, '<>')
