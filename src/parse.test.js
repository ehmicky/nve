import test from 'ava'
import { each } from 'test-each'

import { printVersionArgs } from './helpers/args.test.js'
import { runCli, runSerial, runParallel } from './helpers/run.test.js'
import { TEST_VERSION } from './helpers/versions.test.js'

each(
  [
    { versionRange: '', args: [] },
    { versionRange: 'invalid_version', args: printVersionArgs },
    { versionRange: '0.0.0', args: printVersionArgs },
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
      const { exitCode } = await run(TEST_VERSION, printVersionArgs, opts)
      t.is(exitCode, 0)
    })
  },
)
