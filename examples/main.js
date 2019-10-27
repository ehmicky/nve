// Demo of the programmatic usage.
// This file can be directly run:
//   npm install nve
//   node node_modules/nve/examples/main.js
// An online demo is also available at:
//   https://repl.it/@ehmicky/nve

'use strict'

// Ignore the following line: this is only needed for internal purposes.
require('./utils.js')

const { runVersion } = require('nve')

const run = async function() {
  const { childProcess, versionRange, version } = await runVersion(
    '8',
    'node',
    ['--version'],
  )
  console.log(`Node ${versionRange} (${version})`) // Node 8 (8.16.1)
  const { exitCode, stdout, stderr } = await childProcess
  console.log(`Exit code: ${exitCode}`) // Exit code: 0
  console.log(stdout) // v8.16.1
  console.log(stderr) // empty
}

run()
