import { spawn } from 'child_process'
import { env } from 'process'

import getNode from 'get-node'
import globalCacheDir from 'global-cache-dir'
import pEvent from 'p-event'

import { validateInput } from './validate.js'

// Forwards `args` to another node instance of a specific `versionRange`
export const nve = async function(versionRange, args = []) {
  validateInput(args)

  const nodePath = await getPath(versionRange)

  const { code, signal } = await runNodeProcess(nodePath, args)
  return { code, signal }
}

// Download the Node.js binary
export const getPath = async function(versionRange, progress) {
  const cacheDir = await globalCacheDir(CACHE_DIR)
  const progressA = progress !== false && env.NVE_PROGRESS !== '0'
  const nodePath = await getNode(versionRange, cacheDir, {
    progress: progressA,
  })
  return nodePath
}

const CACHE_DIR = 'nve'

// Forward arguments to another node binary located at `nodePath`.
// We also forward standard streams and exit code.
const runNodeProcess = async function(nodePath, args) {
  const childProcess = spawn(nodePath, args, { stdio: 'inherit' })
  const [code, signal] = await pEvent(childProcess, 'exit', { multiArgs: true })
  return { code, signal }
}
