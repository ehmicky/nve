import { env } from 'process'

import getNode from 'get-node'

import { validateInput } from './validate.js'
import { spawnProcess } from './spawn.js'

// Forwards `args` to another node instance of a specific `versionRange`
// eslint-disable-next-line max-params
const nve = async function(versionRange, command, args = [], opts = {}) {
  validateInput({ versionRange, command, args, opts })

  const nodePath = await getNodePath(versionRange)

  const childProcess = spawnProcess({ nodePath, command, args, opts })
  return childProcess
}

// Download the Node.js binary
const getNodePath = async function(versionRange) {
  const progress = env.NVE_PROGRESS !== '0'
  const { path: nodePath } = await getNode(versionRange, { progress })
  return nodePath
}

// We do not use `export default` because Babel transpiles it in a way that
// requires CommonJS users to `require(...).default` instead of `require(...)`.
module.exports = nve
