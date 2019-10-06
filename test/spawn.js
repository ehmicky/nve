import { platform } from 'process'

import test from 'ava'
import { each } from 'test-each'
import pathKey from 'path-key'
import isCi from 'is-ci'

import { runVersion } from '../src/main.js'

import { TEST_VERSION, HELPER_VERSION } from './helpers/versions.js'

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
        { spawnOptions: { stdio } },
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

const runWithoutPath = function(spawnOptions) {
  return runVersion(HELPER_VERSION, 'ava', ['--version'], {
    spawnOptions: { env: { [pathKey()]: '' }, ...spawnOptions },
  })
}

// This does not work with nyc on MacOS
// This might be fixed with nyc@15
// See https://github.com/istanbuljs/spawn-wrap/issues/108
if (platform !== 'darwin' || !isCi) {
  test('Can run in shell mode | programmatic', async t => {
    const { childProcess } = await runVersion(
      TEST_VERSION,
      'node --version && node --version',
      [],
      { spawnOptions: { shell: true } },
    )
    const { exitCode } = await childProcess

    t.is(exitCode, 0)
    // TODO: enable the following line. It currently does not work with nyc
    // This might be fixed with nyc@15
    // See https://github.com/istanbuljs/spawn-wrap/issues/108
    // t.is(stdout, `v${TEST_VERSION}\nv${TEST_VERSION}`)
  })
}
