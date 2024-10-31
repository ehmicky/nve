import { platform } from 'node:process'

import test from 'ava'
import { each } from 'test-each'

import { runCliNoVersion } from './helpers/run.test.js'
import { INVALID_VERSION, TEST_VERSION } from './helpers/versions.test.js'

each(
  [
    { versionRange: '', args: [] },
    // This feature does not work on Windows cmd.exe
    ...(platform === 'win32'
      ? []
      : [{ versionRange: TEST_VERSION, args: ['invalid'] }]),
  ],
  ({ title }, { versionRange, args }) => {
    test(`Invalid input message | ${title}`, async (t) => {
      const { stderr } = await runCliNoVersion(versionRange, args)
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
      const { stderr } = await runCliNoVersion(versionRange, [
        'node',
        '--version',
      ])
      t.true(stderr.includes('Not a valid Node version range'))
    })
  },
)
