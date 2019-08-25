import { ChildProcess } from 'child_process'

import test from 'ava'
import getStream from 'get-stream'

import nve from '../src/main.js'

import { TEST_VERSION, runCli } from './helpers/main.js'

// Tests fail on Windows when run in parallel unless Node executable is already
// cached. This is due to some bug within `spawn-wrap` (used by nyc)
test.serial('Forward stdout/stderr', async t => {
  const { stdout } = await runCli()

  t.is(stdout, `v${TEST_VERSION}`)
})

test('Print errors on stderr', async t => {
  const { stderr } = await runCli(TEST_VERSION, '--invalid')

  t.true(stderr.includes('--invalid'))
})

test('Forward exit code on success | CLI', async t => {
  const { code } = await runCli()

  t.is(code, 0)
})

test('Forward exit code on failure | CLI', async t => {
  const { code } = await runCli(TEST_VERSION, 'does_not_exist.js')

  t.is(code, 1)
})

test('Forward exit code | programmatic', async t => {
  const { promise } = await nve(TEST_VERSION, ['-e', '""'])

  const { code } = await promise
  t.is(code, 0)
})

test('Forward signal | programmatic', async t => {
  const { promise } = await nve(TEST_VERSION, ['-e', '""'])

  const { signal } = await promise
  t.is(signal, null)
})

test('Forward child process | programmatic', async t => {
  const { childProcess } = await nve(TEST_VERSION, ['-e', '""'])

  t.true(childProcess instanceof ChildProcess)
})

test('Can pass arguments and options | programmatic', async t => {
  const { childProcess } = await nve(TEST_VERSION, ['-p', '"test"'], {
    stdio: 'pipe',
  })

  const stdout = await getStream(childProcess.stdout)
  t.is(stdout.trim(), 'test')
})
