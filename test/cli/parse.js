import test from 'ava'
import { each } from 'test-each'

import { runCli } from '../helpers/run.js'

each(
  [
    ['', '', ''],
    ['--shell', '', ''],
    ['--shell', '', 'node --version'],
    ['', 'invalid_version', 'node --version'],
    ['--shell', 'invalid_version', 'node --version'],
  ],
  ({ title }, [options, versionRange, command]) => {
    test(`Invalid input | ${title}`, async t => {
      const { exitCode, stderr } = await runCli(options, versionRange, command)

      t.is(exitCode, 1)
      t.true(stderr.includes('invalid input'))
      t.true(stderr.includes('Examples'))
    })
  },
)
