import getNode from 'get-node'

import { getOpts } from './options.js'
import { spawnProcess } from './spawn.js'

// Forwards `args` to another node instance of a specific `versionRange`
// eslint-disable-next-line max-params
const nve = async function(versionRange, command, args = [], opts = {}) {
  const { spawn: spawnOpts, ...optsA } = getOpts({
    versionRange,
    command,
    args,
    opts,
  })

  const { path: nodePath } = await getNode(versionRange, optsA)

  const childProcess = spawnProcess({ nodePath, command, args, spawnOpts })
  return childProcess
}

// We do not use `export default` because Babel transpiles it in a way that
// requires CommonJS users to `require(...).default` instead of `require(...)`.
module.exports = nve
