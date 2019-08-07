/* eslint-disable import/no-commonjs */
// eslint-disable-next-line filenames/match-exported
import { validateInput } from './validate.js'
import { getVersion } from './versions.js'
import { runNode } from './run.js'

// Forwards `args` to another node instance of a specific `versionRange`
const nve = async function(versionRange, args = []) {
  validateInput(versionRange, args)

  const version = await getVersion(versionRange)
  const { exitCode, signal } = await runNode(version, args)
  return { exitCode, signal }
}

// We do not use `export default` because Babel transpiles it in a way that
// requires CommonJS users to `require(...).default` instead of `require(...)`.
module.exports = nve
/* eslint-enable import/no-commonjs */
