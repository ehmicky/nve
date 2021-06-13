import test from 'ava'
import { readPackageUpAsync } from 'read-pkg-up'
import { each } from 'test-each'

import {
  runCli,
  runCliNoVersion,
  runSerial,
  runParallel,
} from './helpers/run.js'
import { TEST_VERSION } from './helpers/versions.js'

test('--help', async (t) => {
  const { stdout } = await runCliNoVersion('', '', '--help')

  t.true(stdout.includes('Examples'))
})

test('--version', async (t) => {
  const [
    { stdout },
    {
      packageJson: { version },
    },
  ] = await Promise.all([
    runCliNoVersion('', '', '--version'),
    readPackageUpAsync(),
  ])

  t.is(stdout, version)
})

each([runCli, runSerial, runParallel], ({ title }, run) => {
  test(`node --help | ${title}`, async (t) => {
    const { stdout } = await run('', TEST_VERSION, 'node --help')

    t.true(stdout.includes('Usage: node'))
  })
})

test('node --version | runCli', async (t) => {
  const { stdout } = await runCli('', TEST_VERSION, 'node --version')

  t.is(stdout, `v${TEST_VERSION}`)
})

test('node --version | runSerial', async (t) => {
  const { stdout } = await runSerial('', TEST_VERSION, 'node --version')

  t.is(stdout, `v${TEST_VERSION}\nv${TEST_VERSION}`)
})
