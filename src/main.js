import getNode from 'get-node'
import execa from 'execa'

import { getOpts } from './options.js'
import { validateRanges } from './validate.js'
import { getCommand, getSpawnOptions } from './spawn.js'

// Forwards command to another node instance of a specific `versionRange`
// eslint-disable-next-line max-params
export const runVersion = async function(versionRange, command, args, opts) {
  const {
    version,
    versionRange: versionRangeA,
    command: commandA,
    args: argsA,
    spawnOptions,
  } = await dryRunVersion(versionRange, command, args, opts)

  const childProcess = execa(commandA, argsA, spawnOptions)
  return {
    childProcess,
    version,
    versionRange: versionRangeA,
    command: commandA,
    args: argsA,
    spawnOptions,
  }
}

// Same as `runVersion()` but for several versions at once
// eslint-disable-next-line max-params
export const runVersions = async function*(versionRanges, command, args, opts) {
  validateRanges(versionRanges)

  // We perform all Node.js downloads before starting any child process
  const nodes = await Promise.all(
    versionRanges.map(versionRange =>
      dryRunVersion(versionRange, command, args, opts),
    ),
  )

  // eslint-disable-next-line fp/no-loops
  for (const {
    version,
    versionRange,
    command: commandA,
    args: argsA,
    spawnOptions,
  } of nodes) {
    const childProcess = execa(commandA, argsA, spawnOptions)
    yield {
      childProcess,
      version,
      versionRange,
      command: commandA,
      args: argsA,
      spawnOptions,
    }
  }
}

// Same as `runVersion()` but does not execute the command
// eslint-disable-next-line max-params
export const dryRunVersion = async function(versionRange, command, args, opts) {
  const {
    args: argsA,
    opts: { spawnOptions, ...optsA },
  } = getOpts({ versionRange, command, args, opts })

  const { path: nodePath, version } = await getNode(versionRange, optsA)

  const commandA = getCommand(command, nodePath, spawnOptions)
  const spawnOptionsA = getSpawnOptions(spawnOptions, nodePath)

  return {
    version,
    versionRange,
    command: commandA,
    args: argsA,
    spawnOptions: spawnOptionsA,
  }
}
