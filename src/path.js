import { env as processEnv, cwd as getCwd } from 'process'

import npmRunPath from 'npm-run-path'
import pathKey from 'path-key'

// Fix `$PATH` so that `node` points to the right version.
// We do this instead of directly calling `node` so that:
//  - child processes use the same Node.js version
//  - binaries work, even on Windows
// We use `npm-run-path`, which means `preferLocal` is always `true`.
export const fixPath = function({
  nodePath,
  spawnOptions,
  spawnOptions: { env = processEnv, cwd = getCwd() },
}) {
  const pathName = pathKey({ env })
  const path = env[pathName] || ''

  const pathA = npmRunPath({ path, cwd, execPath: nodePath })

  return { ...spawnOptions, env: { [pathName]: pathA }, preferLocal: false }
}
