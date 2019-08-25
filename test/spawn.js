import { ChildProcess } from 'child_process'
import { version } from 'process'

import test from 'ava'

import nve from '../src/main.js'

import { TEST_VERSION, getStdout } from './helpers/main.js'

test('Forward child process | programmatic', async t => {
  const childProcess = await nve(TEST_VERSION, 'node', ['-e', '""'])

  t.true(childProcess instanceof ChildProcess)
})

test('Can pass arguments and options | programmatic', async t => {
  const stdout = await getStdout(TEST_VERSION, 'node', ['-p', '"test"'])

  t.is(stdout, 'test')
})

test('Can fire binaries', async t => {
  const stdout = await getStdout(version, 'npm', ['--version'])

  t.true(stdout !== '')
})
