import test from 'ava'
import { each } from 'test-each'

import { runCli, runSerial, runParallel } from './helpers/run.test.js'
import { TEST_VERSION } from './helpers/versions.test.js'

each(
  [
    { versionRange: '', args: [] },
    { versionRange: 'invalid_version', args: ['node', '--version'] },
    { versionRange: '0.0.0', args: ['node', '--version'] },
  ],
  ({ title }, { versionRange, args }) => {
    test(`Invalid input with help | ${title}`, async (t) => {
      const { exitCode } = await runCli(versionRange, args)

      t.is(exitCode, 1)
    })
  },
)

each(
  [runCli, runSerial, runParallel],
  [['--no-fetch'], ['--fetch=false'], ['--fetch', 'false']],
  ({ title }, run, opts) => {
    test(`Parse nve CLI flags | ${title}`, async (t) => {
      const { exitCode } = await run(TEST_VERSION, ['node', '--version'], opts)
      t.is(exitCode, 0)
    })
  },
)
