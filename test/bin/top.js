import test from 'ava'
import { each } from 'test-each'
import readPkgUp from 'read-pkg-up'

import { TEST_VERSION } from '../helpers/versions.js'
import { runCli, runCliSerial, runCliParallel } from '../helpers/run.js'

test('--help', async t => {
  const { stdout } = await runCli('', '', '--help')

  t.true(stdout.includes('Examples'))
})

test('--version', async t => {
  const [
    { stdout },
    {
      packageJson: { version },
    },
  ] = await Promise.all([runCli('', '', '--version'), readPkgUp()])

  t.is(stdout, version)
})

each([runCli, runCliSerial, runCliParallel], ({ title }, run) => {
  test(`node --help | ${title}`, async t => {
    const { stdout } = await run('', TEST_VERSION, 'node --help')

    t.true(stdout.includes('Usage: node'))
  })
})

test('node --version | runCli', async t => {
  const { stdout } = await runCli('', TEST_VERSION, 'node --version')

  t.is(stdout, `v${TEST_VERSION}`)
})

test('node --version | runCliSerial', async t => {
  const { stdout } = await runCliSerial('', TEST_VERSION, 'node --version')

  t.is(stdout, `v${TEST_VERSION}\nv${TEST_VERSION}`)
})
