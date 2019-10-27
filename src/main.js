import getNode from 'get-node'
import execa from 'execa'

import { getOpts } from './options.js'
import { getCommand, getExecaOptions } from './spawn.js'

// Forwards command to another node instance of a specific `versionRange`
// eslint-disable-next-line max-params
const nvexeca = async function(versionRange, command, args, opts) {
  const {
    args: argsA,
    opts: { dry, progress, mirror },
    execaOptions,
  } = getOpts({ versionRange, command, args, opts })

  const { path: nodePath, version } = await getNode(versionRange, {
    progress,
    mirror,
  })

  const commandA = getCommand(command, nodePath, execaOptions)
  const execaOptionsA = getExecaOptions(execaOptions, nodePath)

  const childProcess = startProcess({
    command: commandA,
    args: argsA,
    execaOptions: execaOptionsA,
    dry,
  })

  return {
    childProcess,
    version,
    versionRange,
    command: commandA,
    args: argsA,
    execaOptions: execaOptionsA,
  }
}

const startProcess = function({ command, args, execaOptions, dry }) {
  if (dry) {
    return
  }

  return execa(command, args, execaOptions)
}

// We do not use `export default` because Babel transpiles it in a way that
// requires CommonJS users to `require(...).default` instead of `require(...)`.
module.exports = nvexeca
