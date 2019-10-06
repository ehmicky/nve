import { platform } from 'process'

import execa from 'execa'

import { fixPath } from './path.js'

// Forward arguments to another node binary located at `nodePath`.
// We also forward standard streams.
export const spawnProcess = function({
  nodePath,
  command,
  args,
  spawnOptions,
}) {
  const commandA = getCommand(command, nodePath, spawnOptions)

  const spawnOptionsA = fixPath({ nodePath, spawnOptions })

  const childProcess = execa(commandA, args, spawnOptionsA)
  return childProcess
}

const getCommand = function(command, nodePath, { shell }) {
  // The following is not relevant in shell mode:
  //  - shell spawning creates a nested child process
  //  - `file.cmd` is not necessary when run through `cmd.exe`
  if (shell) {
    return command
  }

  // Some libraries like `spawn-wrap` (used by `nyc`) monkey patch
  // `child_process.spawn()` to modify `$PATH` and prepend their own `node`
  // wrapper. We fix it by using the `node` absolute path instead of relying on
  // `$PATH`. Note that this does not work:
  //  - with nested child processes
  //  - with binaries
  // This is also slightly faster as it does not require any `$PATH` lookup.
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
