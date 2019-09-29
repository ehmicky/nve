import test from 'ava'
import readPkgUp from 'read-pkg-up'

import { runCli } from './helpers/cli.js'
import { TEST_VERSION } from './helpers/versions.js'

test('Forward exit code on success | CLI', async t => {
  const { exitCode } = await runCli(`${TEST_VERSION} node --version`)

  t.is(exitCode, 0)
})

test('Forward exit code on failure | CLI', async t => {
  const { exitCode } = await runCli(`${TEST_VERSION} invalidBinary`)

  t.not(exitCode, 0)
})

test('Print errors on stderr', async t => {
  const { stderr } = await runCli(`${TEST_VERSION} invalidBinary`)

  t.true(stderr.includes('invalidBinary'))
})

test('--help | CLI', async t => {
  const { stdout } = await runCli('--help')

  t.true(stdout.includes('any version range'))
})

test('--version | CLI', async t => {
  const [
    { stdout },
    {
      packageJson: { version },
    },
  ] = await Promise.all([runCli('--version'), readPkgUp()])

  t.is(stdout, version)
})

test('node --help | CLI', async t => {
  const { stdout } = await runCli(`${TEST_VERSION} node --help`)

  t.true(stdout.includes('Usage: node'))
})

test('node --version | CLI', async t => {
  const { stdout } = await runCli(`${TEST_VERSION} node --version`)

  t.is(stdout, `v${TEST_VERSION}`)
})

test('CLI flags | CLI', async t => {
  const { exitCode } = await runCli(
    `--no-progress ${TEST_VERSION} node --version`,
  )

  t.is(exitCode, 0)
})
