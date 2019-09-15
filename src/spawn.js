import { spawn } from 'child_process'
import { platform } from 'process'

import { fixPath } from './path.js'

// Forward arguments to another node binary located at `nodePath`.
// We also forward standard streams.
export const spawnProcess = function({ nodePath, command, args, spawnOpts }) {
  const commandA = fixWindowsCommand(command)

  const spawnOptsA = fixPath({ nodePath, spawnOpts })

  const childProcess = spawn(commandA, args, spawnOptsA)
  return childProcess
}

// On Windows, global binaries (except `node` itself) have two files:
//   - `file`: a Node.js file which is not executable (but can be run with
//     `node`)
//   - `file.cmd`: the actual executable file
const fixWindowsCommand = function(command) {
  if (platform !== 'win32' || command === 'node') {
    return command
  }

  return `${command}.cmd`
}
