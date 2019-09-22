import { spawn } from 'child_process'
import { platform } from 'process'

import { fixPath } from './path.js'

// Forward arguments to another node binary located at `nodePath`.
// We also forward standard streams.
export const spawnProcess = function({ nodePath, command, args, spawnOpts }) {
  const commandA = getCommand(command, nodePath)

  const spawnOptsA = fixPath({ nodePath, spawnOpts })

  const childProcess = spawn(commandA, args, spawnOptsA)
  return childProcess
}

const getCommand = function(command, nodePath) {
  // Some libraries like `spawn-wrap` (used by `nyc`) monkey patch
  // `child_process.spawn()` to modify `$PATH` and prepend their own `node`
  // wrapper. We fix it by using the `node` absolute path instead of relying on
  // `PATH`. Note that this does not work:
  //  - with nested child processes
  //  - with binaries
  // This is also slightly faster as it does not require any PATH lookup.
  if (command === 'node') {
    return nodePath
  }

  // On Windows, global binaries (except `node` itself) have two files:
  //   - `file`: a Node.js file which is not executable (but can be run with
  //     `node`)
  //   - `file.cmd`: the actual executable file
  if (platform === 'win32') {
    return `${command}.cmd`
  }

  return command
}
