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

  const { nodePath, version } = await downloadNode(versionRange, optsA)

  const {
    childProcess,
    command: commandA,
    args: argsA,
    spawnOptions: spawnOptionsA,
  } = spawnProcess({ nodePath, command, args, spawnOptions })

  return {
    childProcess,
    version,
    versionRange,
    command: commandA,
    args: argsA,
    spawnOptions: spawnOptionsA,
  }
}

// Same as `runVersion()` but for several versions at once
// eslint-disable-next-line max-params
export const runVersions = async function*(
  versionRanges,
  command,
  args = [],
  opts = {},
) {
  validateRanges(versionRanges)
  const { spawnOptions, ...optsA } = getOpts({ command, args, opts })

  const nodes = await Promise.all(
    versionRanges.map(versionRange => downloadNode(versionRange, optsA)),
  )

  // eslint-disable-next-line fp/no-loops
  for (const { nodePath, version, versionRange } of nodes) {
    const {
      childProcess,
      command: commandA,
      args: argsA,
      spawnOptions: spawnOptionsA,
    } = spawnProcess({ nodePath, command, args, spawnOptions })

    yield {
      childProcess,
      version,
      versionRange,
      command: commandA,
      args: argsA,
      spawnOptions: spawnOptionsA,
    }
  }
}

const downloadNode = async function(versionRange, opts) {
  const { path: nodePath, version } = await getNode(versionRange, opts)
  return { nodePath, version, versionRange }
}
