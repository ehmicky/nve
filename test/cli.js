import test from 'ava'
import readPkgUp from 'read-pkg-up'

import { TEST_VERSION, runCli } from './helpers/main.js'

// Tests fail on Windows when run in parallel unless Node executable is already
// cached. This is due to some bug within `spawn-wrap` (used by nyc)
// TODO: this fails when run with nyc
// test.serial('Forward stdout/stderr', async t => {
//   const { stdout } = await runCli(`${TEST_VERSION} node --version`)

//   t.is(stdout, `v${TEST_VERSION}`)
// })

test('Forward exit code on success | CLI', async t => {
  const { code } = await runCli(`${TEST_VERSION} node --version`)

  t.is(code, 0)
})

test('Forward exit code on failure | CLI', async t => {
  const { code } = await runCli(`${TEST_VERSION} invalidBinary`)

  t.is(code, 1)
})

test('Print errors on stderr', async t => {
  const { stderr } = await runCli(`${TEST_VERSION} invalidBinary`)

  t.true(stderr.includes('invalidBinary'))
})

test('--help | CLI', async t => {
  const { stdout } = await runCli('--help')

  t.snapshot(stdout)
})

test('--version | CLI', async t => {
  const [
    { stdout },
    {
      package: { version },
    },
  ] = await Promise.all([runCli('--version'), readPkgUp()])

  t.is(stdout, version)
})

// Fails with nyc (see above)
// test('node --version | CLI', async t => {
//   const { stdout } = await runCli(`${TEST_VERSION} node --version`)

//   t.is(stdout, `v${TEST_VERSION}`)
// })

test('node --help | CLI', async t => {
  const { stdout } = await runCli(`${TEST_VERSION} node --help`)

  t.true(stdout.includes('Usage: node'))
})
