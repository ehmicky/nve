import { spawn } from 'child_process'

import getNode from 'get-node'
import globalCacheDir from 'global-cache-dir'
import pEvent from 'p-event'

import { validateInput } from './validate.js'

// Forwards `args` to another node instance of a specific `versionRange`
export const nve = async function(versionRange, args = []) {
  validateInput(args)

  // Download the Node.js binary
  const cacheDir = await globalCacheDir(CACHE_DIR)
  const nodePath = await getNode(versionRange, cacheDir)

  const { code, signal } = await runNodeProcess(nodePath, args)
  return { code, signal }
}

const CACHE_DIR = 'nve'

// Forward arguments to another node binary located at `nodePath`.
// We also forward standard streams and exit code.
const runNodeProcess = async function(nodePath, args) {
  const childProcess = spawn(nodePath, args, { stdio: 'inherit' })
  const [code, signal] = await pEvent(childProcess, 'exit', { multiArgs: true })
  return { code, signal }
}
