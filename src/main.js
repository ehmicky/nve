import getNode from 'get-node'

import { getOpts } from './options.js'
import { validateRange, validateRanges } from './validate.js'
import { spawnProcess } from './spawn.js'

// Forwards `args` to another node instance of a specific `versionRange`
// eslint-disable-next-line max-params
export const runVersion = async function(
  versionRange,
  command,
  args = [],
  opts = {},
) {
  validateRange(versionRange)
  const { spawnOptions, ...optsA } = getOpts({ command, args, opts })

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

// Same as `runVersion()` but for several versions at once
// eslint-disable-next-line max-params
export const runVersions = async function(
  versionRanges,
  command,
  args = [],
  opts = {},
) {
  validateRanges(versionRanges)
  const { spawnOptions, ...optsA } = getOpts({ command, args, opts })

  const nodes = await Promise.all(
    versionRanges.map(versionRange => getNode(versionRange, optsA)),
  )

  return nodes.map(({ path: nodePath, version }) => {
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
  })
}
