import { delimiter, dirname } from 'path'
import { env as processEnv, cwd as getCwd } from 'process'

import npmRunPath from 'npm-run-path'
import pathKey from 'path-key'

// Fix `$PATH` so that `node` points to the right version.
// We do this instead of directly calling `node` so that:
//  - child processes use the same Node.js version
//  - binaries work, even on Windows
export const fixPath = function({
  nodePath,
  spawnOptions,
  spawnOptions: { env = processEnv, preferLocal, cwd = getCwd() },
}) {
  const pathName = pathKey({ env })
  const path = env[pathName] || ''

  const pathA = handleLocalBinaries(path, preferLocal, cwd)
  const pathB = prependNodePath(pathA, nodePath)

  return { ...spawnOptions, env: { [pathName]: pathB }, preferLocal: false }
}

// `execa()` `preferLocal: true` option conflicts with `nve` in two ways:
//  - it adds local binaries in front of the `$PATH` which means
//    `npm install node` has priority over `nodePath`
//  - it adds `process.execPath` in front of the `$PATH` which makes it higher
//    priority than `nodePath`
// We fix this by emulating `preferLocal: true` ourselves.
// TODO: once https://github.com/sindresorhus/npm-run-path/pull/9 and
// https://github.com/sindresorhus/npm-run-path/pull/8 are merged, and an
// `execPath` option is added to `execa`, we can use that option instead of
// both calling `npm-run-path` and modifying `$PATH` ourselves.
const handleLocalBinaries = function(path, preferLocal, cwd) {
  if (!preferLocal) {
    return path
  }

  return npmRunPath({ path, cwd })
}

const prependNodePath = function(path, nodePath) {
  const tokens = path.split(delimiter)
  const nodeDir = dirname(nodePath)

  // Already added
  if (tokens.some(token => token === nodeDir)) {
    return path
  }

  return [nodeDir, ...tokens].join(delimiter)
}
