import { spawn } from 'child_process'

import pEvent from 'p-event'
import pathExists from 'path-exists'

import { CACHE_DIR } from './cache.js'
import { downloadNode, NODE_FILENAME } from './download.js'
import { cleanupOnError } from './cleanup.js'

// Download the Node binary for a specific `version` then run it with `args`
export const runNode = async function(version, args) {
  const nodePath = await getNodePath(version)
  const { exitCode, signal } = await runNodeProcess(nodePath, args)
  return { exitCode, signal }
}

// Download the Node binary for a specific `version`.
// The binary is cached under `node_modules/.cache/nve/{version}/node`.
const getNodePath = async function(version) {
  const outputDir = `${CACHE_DIR}/${version}`
  const nodePath = `${outputDir}/${NODE_FILENAME}`

  if (await pathExists(nodePath)) {
    return nodePath
  }

  await cleanupOnError(
    () => downloadNode(version, outputDir, nodePath),
    nodePath,
  )

  return nodePath
}

// Forward arguments to another node binary located at `nodePath`.
// We also forward standard streams and exit code.
const runNodeProcess = async function(nodePath, args) {
  const childProcess = spawn(nodePath, args, { stdio: 'inherit' })
  const [exitCode, signal] = await pEvent(childProcess, 'exit', {
    multiArgs: true,
  })
  return { exitCode, signal }
}
