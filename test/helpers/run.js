import execa from 'execa'
import { nodejs } from 'figures'
import { getBinPath } from 'get-bin-path'

const BIN_PATH = getBinPath()

// eslint-disable-next-line max-params
export const runSerial = function (opts, versionRange, args, execaOpts) {
  return runCli(opts, `${versionRange} ${versionRange}`, args, execaOpts)
}

// eslint-disable-next-line max-params
export const runParallel = function (opts, versionRange, args, execaOpts) {
  return runCli(
    `${opts} --parallel`,
    `${versionRange} ${versionRange}`,
    args,
    execaOpts,
  )
}

// When calling several `nve` in parallel, their output is sometimes duplicated
// in `execa.all`. This bug is not related to `nve` but to some bug inside
// `execa` (based on the `merge-stream` package).
// So we don't use `execa.all`
// eslint-disable-next-line max-params
export const runCli = async function (opts, versionRange, args, execaOpts) {
  const binPath = await BIN_PATH
  const {
    exitCode,
    stdout,
    stderr,
  } = await execa.command(
    `${binPath} --no-progress ${opts} ${versionRange} ${args}`,
    { reject: false, stdin: 'ignore', ...execaOpts },
  )
  const stdoutA = normalizeOutput(stdout)
  const stderrA = normalizeOutput(stderr)
  return { exitCode, stdout: stdoutA, stderr: stderrA }
}

// Normalize Windows specifics
const normalizeOutput = function (output) {
  return output
    .replace(/\r\n/gu, '\n')
    .replace(/cmd "test"/gu, 'test')
    .trim()
    .replace(new RegExp(nodejs, 'gu'), '<>')
}
