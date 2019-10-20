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

export const runCliSerial = function(opts, versionRange, args) {
  return runCli(opts, `${versionRange} ${versionRange}`, args)
}

export const runCli = async function(opts, versionRange, args) {
  const binPath = await BIN_PATH
  return execa.command(
    `${binPath} --no-progress ${opts} ${versionRange} ${args}`,
    { reject: false },
  )
}
