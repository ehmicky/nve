import { spawn } from 'child_process'
import { mkdir } from 'fs'
import { promisify } from 'util'

import pEvent from 'p-event'
import pathExists from 'path-exists'

import { CACHE_DIR } from './cache.js'
import { downloadNode, NODE_FILENAME } from './download.js'
import { cleanupOnError } from './cleanup.js'

const pMkdir = promisify(mkdir)

// Download the Node binary for a specific `version` then run it with `args`
export const runNode = async function(version, args) {
  const nodePath = await getNodePath(version)
  const { code, signal } = await runNodeProcess(nodePath, args)
  return { code, signal }
}

// Download the Node binary for a specific `version`.
// The binary is cached under `node_modules/.cache/nve/{version}/node`.
const getNodePath = async function(version) {
  const outputDir = `${CACHE_DIR}/${version}`
  const nodePath = `${outputDir}/${NODE_FILENAME}`

  if (await pathExists(nodePath)) {
    return nodePath
  }

  await createOutputDir(outputDir)

  await cleanupOnError(
    () => downloadNode(version, outputDir, nodePath),
    nodePath,
  )

  return nodePath
}

const createOutputDir = async function(outputDir) {
  if (await pathExists(outputDir)) {
    return
  }

  await pMkdir(outputDir)
}

// Forward arguments to another node binary located at `nodePath`.
// We also forward standard streams and exit code.
const runNodeProcess = async function(nodePath, args) {
  const childProcess = spawn(nodePath, args, { stdio: 'inherit' })
  const [code, signal] = await pEvent(childProcess, 'exit', { multiArgs: true })
  return { code, signal }
}
