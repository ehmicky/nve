import { ChildProcess } from 'child_process'
import { version } from 'process'

import test from 'ava'
import { each } from 'test-each'
import pathKey from 'path-key'

import nve from '../src/main.js'

import { TEST_VERSION } from './helpers/versions.js'

test('Forward child process | programmatic', async t => {
  const { childProcess } = await nve(TEST_VERSION, 'node', ['-p', '"test"'])

  t.true(childProcess instanceof ChildProcess)

  const { exitCode, stdout } = await childProcess
  t.is(exitCode, 0)
  t.is(stdout, 'test')
})

each(
  [
    { stdio: 'ignore', output: undefined },
    { stdio: 'inherit', output: undefined },
    { stdio: 'pipe', output: `v${TEST_VERSION}` },
    { output: `v${TEST_VERSION}` },
  ],
  ({ title }, { stdio, output }) => {
    test(`Can use stdio | ${title}`, async t => {
      const { childProcess } = await nve(TEST_VERSION, 'node', ['--version'], {
        spawn: { stdio },
      })
      const { stdout } = await childProcess

      t.is(stdout, output)
    })
  },
)

test('Can fire global binaries', async t => {
  const { childProcess } = await nve(version, 'npm', ['--version'])
  const { stdout } = await childProcess

  t.true(stdout !== '')
})

test('Can fire local binaries', async t => {
  const { childProcess } = await nve(version, 'ava', ['--version'], {
    spawn: { env: { [pathKey()]: '' }, preferLocal: true },
  })
  const { stdout } = await childProcess

  t.true(stdout !== '')
})

test('Can disable firing local binaries', async t => {
  const { childProcess } = await nve(version, 'ava', ['--version'], {
    spawn: { env: { [pathKey()]: '' }, preferLocal: false, stdio: 'ignore' },
  })
  const { exitCode } = await t.throwsAsync(childProcess)

  t.not(exitCode, 0)
})

test('Can specify both preferLocal and cwd options', async t => {
  const { childProcess } = await nve(version, 'ava', ['--version'], {
    spawn: {
      env: { [pathKey()]: '' },
      preferLocal: true,
      cwd: '/',
      stdio: 'ignore',
    },
  })
  const { exitCode } = await t.throwsAsync(childProcess)

  t.not(exitCode, 0)
})
