import test from 'ava'
import { each } from 'test-each'

import { runCli } from '../helpers/run.js'

each(
  [
    { options: '', versionRange: '', command: '' },
    { options: '--shell', versionRange: '', command: 'node --version' },
    { options: '--shell', versionRange: '', command: '' },
    {
      options: '--shell',
      versionRange: 'invalid_version',
      command: 'node --version',
    },
    { options: '', versionRange: 'invalid_version', command: 'node --version' },
    { options: '', versionRange: '0.0.0', command: 'node --version' },
  ],
  ({ title }, { options, versionRange, command }) => {
    test(`Invalid input with help | ${title}`, async t => {
      const { exitCode } = await runCli(options, versionRange, command)

      t.is(exitCode, 1)
    })
  },
)
