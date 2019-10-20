import test from 'ava'
import { each } from 'test-each'
import readPkgUp from 'read-pkg-up'

import { TEST_VERSION } from '../helpers/versions.js'
import { runCli, runCliSerial } from '../helpers/run.js'

each([runCli, runCliSerial], ({ title }, run) => {
  test(`node --help | CLI ${title}`, async t => {
    const { stdout } = await run('', TEST_VERSION, 'node --help')

    t.true(stdout.includes('Usage: node'))
  })
})

test('--help | CLI', async t => {
  const { stdout } = await runCli('', '', '--help')

  t.true(stdout.includes('any version range'))
})

test('--version | CLI', async t => {
  const [
    { stdout },
    {
      packageJson: { version },
    },
  ] = await Promise.all([runCli('', '', '--version'), readPkgUp()])

  t.is(stdout, version)
})

test('node --version | CLI runCli', async t => {
  const { stdout } = await runCli('', TEST_VERSION, 'node --version')

  t.is(stdout, `v${TEST_VERSION}`)
})

test('node --version | CLI runCliSerial', async t => {
  const { stdout } = await runCliSerial('', TEST_VERSION, 'node --version')

  t.is(stdout, `v${TEST_VERSION}\nv${TEST_VERSION}`)
})
