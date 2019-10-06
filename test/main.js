import { ChildProcess } from 'child_process'

import test from 'ava'

import { runVersion } from '../src/main.js'

import { TEST_VERSION } from './helpers/versions.js'

test('Forward child process', async t => {
  const { childProcess } = await runVersion(TEST_VERSION, 'node', [
    '-p',
    '"test"',
  ])

  t.true(childProcess instanceof ChildProcess)

  const { exitCode, stdout } = await childProcess
  t.is(exitCode, 0)
  t.is(stdout, 'test')
})

test('Return normalized Node.js version', async t => {
  const { version } = await runVersion(`v${TEST_VERSION}`, 'node', [
    '--version',
  ])

  t.is(version, TEST_VERSION)
})