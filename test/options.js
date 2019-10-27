import { platform } from 'process'

import test from 'ava'
import { each } from 'test-each'
import isCi from 'is-ci'

import { TEST_VERSION } from './helpers/versions.js'
import { runCli, runSerial, runParallel } from './helpers/run.js'

each([runCli, runSerial, runParallel], ({ title }, run) => {
  // This test does not work with nyc on MacOS
  // This might be fixed with nyc@15
  // See https://github.com/istanbuljs/spawn-wrap/issues/108
  if (platform !== 'darwin' || !isCi) {
    test(`Can run in shell mode | ${title}`, async t => {
      const { exitCode } = await run(
        '--shell',
        TEST_VERSION,
        'node\\ --version\\ &&\\ node\\ --version',
      )

      t.is(exitCode, 0)
      // TODO: enable the following line. It currently does not work with nyc
      // This might be fixed with nyc@15
      // See https://github.com/istanbuljs/spawn-wrap/issues/108
      // t.is(stdout, `v${TEST_VERSION}\nv${TEST_VERSION}`)
    })
  }
})
