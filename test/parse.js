import test from 'ava'
import { each } from 'test-each'

import { runCli, runSerial, runParallel } from './helpers/run.js'
import { TEST_VERSION } from './helpers/versions.js'

each(
  [
    { versionRange: '', command: '' },
    { versionRange: 'invalid_version', command: 'node --version' },
    { versionRange: '0.0.0', command: 'node --version' },
  ],
  ({ title }, { versionRange, command }) => {
    test(`Invalid input with help | ${title}`, async (t) => {
      const { exitCode } = await runCli('', versionRange, command)

      t.is(exitCode, 1)
    })
  },
)

each(
  [runCli, runSerial, runParallel],
  ['--fetch', '--no-fetch', '--fetch=true', '--fetch true'],
  ({ title }, run, opts) => {
    test(`Parse nve CLI flags | ${title}`, async (t) => {
      const { exitCode } = await run(opts, TEST_VERSION, 'node --version')
      t.is(exitCode, 0)
    })
  },
)
