import test from 'ava'
import { each } from 'test-each'

import { runCli } from './helpers/run.js'

each(
  [
    { versionRange: '', command: '' },
    { versionRange: 'invalid_version', command: 'node --version' },
    { versionRange: '0.0.0', command: 'node --version' },
  ],
  ({ title }, { versionRange, command }) => {
    test(`Invalid input with help | ${title}`, async t => {
      const { exitCode } = await runCli('', versionRange, command)

      t.is(exitCode, 1)
    })
  },
)
