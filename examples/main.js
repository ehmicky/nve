// Demo of the programmatic usage.
// This file can be directly run:
//   - first install `nve` globally
//   - then `node node_modules/nve/examples/main.js`
// An online demo is also available at:
//   https://repl.it/@ehmicky/nve

'use strict'

// Ignore the following line: this is only needed for internal purposes.
require('./utils.js')

const { runVersion } = require('nve')

const runExample = async function() {
  const { childProcess, version } = await runVersion('8', 'node', ['--version'])
  console.log(version) // 8.16.1
  const { exitCode, stdout, stderr } = await childProcess
  console.log(exitCode) // 0
  console.log(stdout) // v8.16.1
  console.log(stderr) // empty
}

runExample()
