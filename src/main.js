import { spawn } from 'child_process'
import { env } from 'process'

import getNode from 'get-node'
import pEvent from 'p-event'

import { validateInput } from './validate.js'

// Forwards `args` to another node instance of a specific `versionRange`
export const nve = async function(versionRange, args = [], opts) {
  validateInput(args)

  // Download the Node.js binary
  const progress = env.NVE_PROGRESS !== '0'
  const { path: nodePath } = await getNode(versionRange, { progress })

  // Forward arguments to another node binary located at `nodePath`.
  // We also forward standard streams.
  const childProcess = spawn(nodePath, args, { ...DEFAULT_OPTIONS, ...opts })

  const result = getResult(childProcess)
  return { childProcess, result }
}

const DEFAULT_OPTIONS = { stdio: 'inherit' }

const getResult = async function(childProcess) {
  const [code, signal] = await pEvent(childProcess, 'exit', { multiArgs: true })
  return { code, signal }
}
