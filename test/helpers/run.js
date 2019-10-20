import execa from 'execa'
import { getBinPath } from 'get-bin-path'

import { runVersions } from '../../src/main.js'

const BIN_PATH = getBinPath()

// eslint-disable-next-line max-params
export const runVersionMany = async function(
  versionRange,
  command,
  args,
  opts,
) {
  const iterator = await runVersions([versionRange], command, args, opts)
  const { value } = await iterator.next()
  await iterator.next()
  return value
}

// eslint-disable-next-line max-params
export const runCliSerial = function(opts, versionRange, args, execaOpts) {
  return runCli(opts, `${versionRange} ${versionRange}`, args, execaOpts)
}

// eslint-disable-next-line max-params
export const runCli = async function(opts, versionRange, args, execaOpts) {
  const binPath = await BIN_PATH
  const { exitCode, stdout, stderr, all } = await execa.command(
    `${binPath} --no-progress ${opts} ${versionRange} ${args}`,
    { reject: false, all: true, ...execaOpts },
  )
  const stdoutA = normalizeOutput(stdout)
  const stderrA = normalizeOutput(stderr)
  const allA = normalizeOutput(all)
  return { exitCode, stdout: stdoutA, stderr: stderrA, all: allA }
}

const normalizeOutput = function(output) {
  return output
    .trim()
    .replace(/\u2B22/gu, '<>')
    .replace(/\u2666/gu, '<>')
}
