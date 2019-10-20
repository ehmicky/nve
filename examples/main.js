// Demo of the programmatic usage.
// This file can be directly run:
//   npm install nve
//   node node_modules/nve/examples/main.js
// An online demo is also available at:
//   https://repl.it/@ehmicky/nve

'use strict'

// Ignore the following line: this is only needed for internal purposes.
require('./utils.js')

const { runVersion, runVersions } = require('nve')

const run = async function() {
  await runSingleVersion()
  await runMultipleVersions()
}

const runSingleVersion = async function() {
  const { childProcess, version } = await runVersion('8', 'node', ['--version'])
  console.log(`Node ${version}`) // Node 8.16.1
  const { exitCode, stdout, stderr } = await childProcess
  console.log(`Exit code: ${exitCode}`) // Exit code: 0
  console.log(stdout) // v8.16.1
  console.log(stderr) // empty
}

const runMultipleVersions = async function() {
  // eslint-disable-next-line fp/no-loops
  for await (const { childProcess, version } of runVersions(
    ['8', '10', '12'],
    'node',
    ['--version'],
  )) {
    console.log(`Node ${version}`)
    const { exitCode, stdout, stderr } = await childProcess
    console.log(`Exit code: ${exitCode}`)
    console.log(stdout)
    console.log(stderr)
  }
}

run()
