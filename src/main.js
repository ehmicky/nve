import getNode from 'get-node'

import { getOpts } from './options.js'
import { spawnProcess } from './spawn.js'

// Forwards `args` to another node instance of a specific `versionRange`
// eslint-disable-next-line max-params
export const runVersion = async function(
  versionRange,
  command,
  args = [],
  opts = {},
) {
  const { spawnOptions, ...optsA } = getOpts({
    versionRange,
    command,
    args,
    opts,
  })

  const { path: nodePath, version } = await getNode(versionRange, optsA)

  const {
    childProcess,
    command: commandA,
    args: argsA,
    spawnOptions: spawnOptionsA,
  } = spawnProcess({ nodePath, command, args, spawnOptions })

  return {
    childProcess,
    version,
    command: commandA,
    args: argsA,
    spawnOptions: spawnOptionsA,
  }
}
