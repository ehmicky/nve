import test from 'ava'
import { each } from 'test-each'

import { TEST_VERSION } from './helpers/versions.js'
import { runCli } from './helpers/run.js'

each(
  [
    { versionRange: '', command: '' },
    { versionRange: 'invalid_version', command: 'node --version' },
    { versionRange: TEST_VERSION, command: 'invalid' },
  ],
  ({ title }, { versionRange, command }) => {
    test(`Invalid input message | ${title}`, async (t) => {
      const { stderr } = await runCli('', versionRange, command)

      t.true(stderr.includes('Invalid input'))
    })
  },
)
