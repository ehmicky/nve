import { platform } from 'process'

import test from 'ava'
import { each } from 'test-each'
import pathKey from 'path-key'
import isCi from 'is-ci'

import { runVersion } from '../src/main.js'

import { TEST_VERSION, HELPER_VERSION } from './helpers/versions.js'
import { runVersionMany } from './helpers/run.js'

each(
  [
    { stdio: 'ignore', output: undefined },
    { stdio: 'inherit', output: undefined },
    { stdio: 'pipe', output: `v${TEST_VERSION}` },
    { output: `v${TEST_VERSION}` },
  ],
  [runVersion, runVersionMany],
  ({ title }, { stdio, output }, run) => {
    test(`Can use stdio | ${title}`, async t => {
      const { childProcess } = await run(TEST_VERSION, 'node', ['--version'], {
        spawnOptions: { stdio },
      })
      const { stdout } = await childProcess

      t.is(stdout, output)
    })
  },
)

// eslint-disable-next-line complexity
each([runVersion, runVersionMany], ({ title }, run) => {
  test(`Can fire global binaries | ${title}`, async t => {
    const { childProcess } = await run(HELPER_VERSION, 'npm', ['--version'])
    const { stdout } = await childProcess

    t.true(stdout !== '')
  })

  test(`Can fire local binaries | ${title}`, async t => {
    const { childProcess } = await runWithoutPath(run, {})
    const { stdout } = await childProcess

    t.true(stdout !== '')
  })

  test(`Can use preferLocal: true (noop) | ${title}`, async t => {
    const { childProcess } = await runWithoutPath(run, { preferLocal: true })
    const { stdout } = await childProcess

    t.true(stdout !== '')
  })

  // Those tests do not work in Travis CI with Windows.
  // However they work on Windows locally.
  // TODO: figure out why those tests are failing on CI.
  // This will probably be fixed once nyc@15 is released.
  // See https://github.com/istanbuljs/spawn-wrap/issues/108
  if (platform !== 'win32' || !isCi) {
    test(`Can use cwd options for local binaries | ${title}`, async t => {
      const { childProcess } = await runWithoutPath(run, {
        cwd: '/',
        stdio: 'ignore',
      })
      const { exitCode } = await t.throwsAsync(childProcess)

      t.not(exitCode, 0)
    })
  }

  // This does not work with nyc on MacOS
  // This might be fixed with nyc@15
  // See https://github.com/istanbuljs/spawn-wrap/issues/108
  if (platform !== 'darwin' || !isCi) {
    test(`Can run in shell mode | programmatic ${title}`, async t => {
      const { childProcess } = await run(
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
})

const runWithoutPath = function(run, spawnOptions) {
  return run(HELPER_VERSION, 'ava', ['--version'], {
    spawnOptions: { env: { [pathKey()]: '' }, ...spawnOptions },
  })
}
