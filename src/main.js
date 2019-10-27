import getNode from 'get-node'
import execa from 'execa'

import { getOpts } from './options.js'
import { validateRanges } from './validate.js'
import { getCommand, getExecaOptions } from './spawn.js'

// Forwards command to another node instance of a specific `versionRange`
// eslint-disable-next-line max-params
export const runVersion = async function(versionRange, command, args, opts) {
  const {
    version,
    versionRange: versionRangeA,
    command: commandA,
    args: argsA,
    execaOptions,
  } = await dryRunVersion(versionRange, command, args, opts)

  const childProcess = execa(commandA, argsA, execaOptions)
  return {
    childProcess,
    version,
    versionRange: versionRangeA,
    command: commandA,
    args: argsA,
    execaOptions,
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
    execaOptions,
  } of nodes) {
    const childProcess = execa(commandA, argsA, execaOptions)
    yield {
      childProcess,
      version,
      versionRange,
      command: commandA,
      args: argsA,
      execaOptions,
    }
  }
}

// Same as `runVersion()` but does not execute the command
// eslint-disable-next-line max-params
export const dryRunVersion = async function(versionRange, command, args, opts) {
  const {
    args: argsA,
    opts: { execaOptions, ...optsA },
  } = getOpts({ versionRange, command, args, opts })

  const { path: nodePath, version } = await getNode(versionRange, optsA)

  const commandA = getCommand(command, nodePath, execaOptions)
  const execaOptionsA = getExecaOptions(execaOptions, nodePath)

  return {
    version,
    versionRange,
    command: commandA,
    args: argsA,
    execaOptions: execaOptionsA,
  }
}
