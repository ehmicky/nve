import { ChildProcess } from 'child_process'
import { platform } from 'process'

import test from 'ava'
import { each } from 'test-each'
import pathKey from 'path-key'
import isCi from 'is-ci'

import { runVersion } from '../src/main.js'

import { TEST_VERSION, HELPER_VERSION } from './helpers/versions.js'

test('Forward child process | programmatic', async t => {
  const { childProcess } = await runVersion(TEST_VERSION, 'node', [
    '-p',
    '"test"',
  ])

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
      const { childProcess } = await runVersion(
        TEST_VERSION,
        'node',
        ['--version'],
        { spawn: { stdio } },
      )
      const { stdout } = await childProcess

      t.is(stdout, output)
    })
  },
)

test('Can fire global binaries', async t => {
  const { childProcess } = await runVersion(HELPER_VERSION, 'npm', [
    '--version',
  ])
  const { stdout } = await childProcess

  t.true(stdout !== '')
})

test('Can fire local binaries', async t => {
  const { childProcess } = await runWithoutPath({ preferLocal: true })
  const { stdout } = await childProcess

  t.true(stdout !== '')
})

// Those tests do not work in Travis CI with Windows.
// However they work on Windows locally.
// TODO: figure out why those tests are failing on CI.
// This will probably be fixed once nyc@15 is released.
// See https://github.com/istanbuljs/spawn-wrap/issues/108
if (platform !== 'win32' || !isCi) {
  test('Can disable firing local binaries', async t => {
    const { childProcess } = await runWithoutPath({
      preferLocal: false,
      stdio: 'ignore',
    })
    const { exitCode } = await t.throwsAsync(childProcess)

    t.not(exitCode, 0)
  })

  test('Can specify both preferLocal and cwd options', async t => {
    const { childProcess } = await runWithoutPath({
      preferLocal: true,
      cwd: '/',
      stdio: 'ignore',
    })
    const { exitCode } = await t.throwsAsync(childProcess)

    t.not(exitCode, 0)
  })
}

const runWithoutPath = function(spawnOpts) {
  return runVersion(HELPER_VERSION, 'ava', ['--version'], {
    spawn: { env: { [pathKey()]: '' }, ...spawnOpts },
  })
}
