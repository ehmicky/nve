import { delimiter, dirname } from 'path'
import { env as processEnv } from 'process'

import pathKey from 'path-key'

// Fix `$PATH` so that `node` points to the right version.
// We do this instead of directly calling `node` so that:
//  - child processes use the same Node.js version
//  - binaries work, even on Windows
export const fixPath = function({
  nodePath,
  spawnOpts,
  spawnOpts: { env = processEnv },
}) {
  const pathName = pathKey({ env })
  // `PATH` should always be defined on a normal OS
  // istanbul ignore next
  const path = env[pathName] || ''

  const tokens = path.split(delimiter)
  const nodeDir = dirname(nodePath)

  // Already added
  if (tokens.some(token => token === nodeDir)) {
    return spawnOpts
  }

  const pathA = [nodeDir, ...tokens].join(delimiter)
  return { ...spawnOpts, env: { [pathName]: pathA } }
}

// This is needed to fix a bug with execa `preferLocal: true` option.
// See https://github.com/sindresorhus/npm-run-path/pull/5#issuecomment-538677471
export const patchExecPath = function(nodePath) {
  // eslint-disable-next-line no-restricted-globals, node/prefer-global/process
  const { execPath } = process
  // eslint-disable-next-line no-restricted-globals, node/prefer-global/process, fp/no-mutation
  process.execPath = nodePath
  return execPath
}

export const unpatchExecPath = function(execPath) {
  // eslint-disable-next-line no-restricted-globals, node/prefer-global/process, fp/no-mutation
  process.execPath = execPath
}
