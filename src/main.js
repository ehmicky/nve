import { spawn } from 'child_process'

import getNode from 'get-node'
import findCacheDir from 'find-cache-dir'
import pEvent from 'p-event'

import { validateInput } from './validate.js'

export const CACHE_DIR = findCacheDir({ name: 'nve', create: true })

// Forwards `args` to another node instance of a specific `versionRange`
const nve = async function(versionRange, args = []) {
  validateInput(args)

  // Download the Node.js binary
  const nodePath = await getNode(versionRange, CACHE_DIR)

  const { code, signal } = await runNodeProcess(nodePath, args)
  return { code, signal }
}

// Forward arguments to another node binary located at `nodePath`.
// We also forward standard streams and exit code.
const runNodeProcess = async function(nodePath, args) {
  const childProcess = spawn(nodePath, args, { stdio: 'inherit' })
  const [code, signal] = await pEvent(childProcess, 'exit', { multiArgs: true })
  return { code, signal }
}

// We do not use `export default` because Babel transpiles it in a way that
// requires CommonJS users to `require(...).default` instead of `require(...)`.
module.exports = nve
