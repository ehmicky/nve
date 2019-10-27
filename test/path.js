import { platform } from 'process'
import { normalize } from 'path'

import test from 'ava'
import { each } from 'test-each'
import { getBinPathSync } from 'get-bin-path'
import execa from 'execa'
import isCi from 'is-ci'
import pathKey from 'path-key'

import nvexeca from '../src/main.js'

import { HELPER_VERSION, TEST_VERSION } from './helpers/versions.js'

const FORK_FILE = normalize(`${__dirname}/helpers/fork.js`)
const BIN_PATH = getBinPathSync()

// Those tests do not work in Travis CI with Windows.
// However they work on Windows locally.
// TODO: figure out why those tests are failing on CI.
// This will probably be fixed once nyc@15 is released.
// See https://github.com/istanbuljs/spawn-wrap/issues/108
if (platform !== 'win32' || !isCi) {
  each(
    [
      ['node', '--version'],
      ['node', FORK_FILE, 'node', '--version'],
      ['node', BIN_PATH, HELPER_VERSION, 'node', '--version'],
    ],
    [{}, { [pathKey()]: undefined }],
    ({ title }, args, env) => {
      test(`Works with child processes | ${title}`, async t => {
        const { childProcess } = await nvexeca(
          HELPER_VERSION,
          'node',
          [FORK_FILE, ...args],
          { env },
        )
        const { stdout } = await childProcess

        t.is(stdout.trim(), `v${HELPER_VERSION}`)
      })
    },
  )

  test.serial('Works with nyc as child', async t => {
    const { childProcess } = await nvexeca(HELPER_VERSION, 'nyc', [
      '--silent',
      '--',
      'node',
      '--version',
    ])
    const { stdout } = await childProcess

    t.is(stdout, `v${HELPER_VERSION}`)
  })
}

// `nyc nve ...` does not work because `nyc` monkey patches
// `child_process.spawn()` and forces `node` to be `process.execPath` (the
// `node` that spawned `nyc`, i.e. the global `node`) by modifying the `$PATH`
// environment variable.
// This should be fixed with nyc@15
// See https://github.com/istanbuljs/spawn-wrap/issues/108
test('Works with nyc as parent with node command', async t => {
  const { stdout } = await execa.command(
    `nyc --silent -- ${BIN_PATH} --no-progress ${HELPER_VERSION} node --version`,
  )

  t.is(stdout, `v${HELPER_VERSION}`)
})

test('Does not change process.execPath', async t => {
  // eslint-disable-next-line no-restricted-globals, node/prefer-global/process
  const { execPath } = process
  await nvexeca(TEST_VERSION, 'node', ['--version'])

  // eslint-disable-next-line no-restricted-globals, node/prefer-global/process
  t.is(process.execPath, execPath)
})
