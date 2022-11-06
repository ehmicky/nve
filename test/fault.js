import { platform } from 'node:process'

import test from 'ava'
import { each } from 'test-each'

import { runCliNoVersion } from './helpers/run.js'
import { TEST_VERSION, INVALID_VERSION } from './helpers/versions.js'

each(
  [
    { versionRange: '', command: '' },
    // This feature does not work on Windows cmd.exe
    ...(platform === 'win32'
      ? []
      : [{ versionRange: TEST_VERSION, command: 'invalid' }]),
  ],
  ({ title }, { versionRange, command }) => {
    test(`Invalid input message | ${title}`, async (t) => {
      const { stderr } = await runCliNoVersion('', versionRange, command)
      t.true(stderr.includes('Invalid input'))
    })
  },
)

each(
  [
    INVALID_VERSION,
    `${TEST_VERSION},${INVALID_VERSION}`,
    `--help ${INVALID_VERSION}`,
  ],
  ({ title }, versionRange) => {
    test(`Invalid version range | ${title}`, async (t) => {
      const { stderr } = await runCliNoVersion(
        '',
        versionRange,
        'node --version',
      )
      t.true(stderr.includes('Not a valid Node version range'))
    })
  },
)
