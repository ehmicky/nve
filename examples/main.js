// Demo of the programmatic usage.
// This file can be directly run:
//   npm install nve
//   node node_modules/nve/examples/main.js
// An online demo is also available at:
//   https://repl.it/@ehmicky/nve

'use strict'

// Ignore the following line: this is only needed for internal purposes.
require('./utils.js')

const { runVersion, runVersions, dryRunVersion } = require('nve')

const run = async function() {
  await runSingleVersion()
  await runMultipleVersions()
  await runDry()
}

const runSingleVersion = async function() {
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

const runMultipleVersions = async function() {
  // eslint-disable-next-line fp/no-loops
  for await (const { childProcess, versionRange, version } of runVersions(
    ['8', '10', '12'],
    'node',
    ['--version'],
  )) {
    console.log(`Node ${versionRange} (${version})`)
    const { exitCode, stdout, stderr } = await childProcess
    console.log(`Exit code: ${exitCode}`)
    console.log(stdout)
    console.log(stderr)
  }
}

const runDry = async function() {
  const { versionRange, version } = await dryRunVersion('8', 'node', [
    '--version',
  ])
  console.log(`Node ${versionRange} (${version})`) // Node 8 (8.16.1)
}

run()
