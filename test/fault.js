import test from 'ava'
import { each } from 'test-each'

import { TEST_VERSION } from './helpers/versions.js'
import { runCli } from './helpers/run.js'

each(
  [
    { options: '', versionRange: '', command: '' },
    { options: '--shell', versionRange: '', command: '' },
    { options: '--shell', versionRange: '', command: 'node --version' },
    { options: '', versionRange: 'invalid_version', command: 'node --version' },
    {
      options: '--shell',
      versionRange: 'invalid_version',
      command: 'node --version',
    },
    { options: '', versionRange: TEST_VERSION, command: 'invalid' },
    { options: '--shell', versionRange: TEST_VERSION, command: 'invalid' },
  ],
  ({ title }, { options, versionRange, command }) => {
    test(`Invalid input message | ${title}`, async t => {
      const { stderr } = await runCli(options, versionRange, command)

      t.true(stderr.includes('Invalid input'))
    })
  },
)
