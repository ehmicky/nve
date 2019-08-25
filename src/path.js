import { delimiter, dirname } from 'path'
import { env as processEnv } from 'process'

import pathKey from 'path-key'

// Fix `$PATH` so that `node` points to the right version.
// We do this instead of directly calling `node` so that:
//  - child processes use the same Node.js version
//  - binaries work, even on Windows
export const fixPath = function({
  nodePath,
  opts,
  opts: { env = processEnv },
}) {
  const pathName = pathKey({ env })
  // `PATH` should always be defined on a normal OS
  // istanbul ignore next
  const path = env[pathName] || ''

  const tokens = path.split(delimiter)
  const nodeDir = dirname(nodePath)

  // Already added
  if (tokens.some(token => token === nodeDir)) {
    return opts
  }

  const pathA = [nodeDir, ...tokens].join(delimiter)
  return { ...opts, env: { ...env, [pathName]: pathA } }
}
