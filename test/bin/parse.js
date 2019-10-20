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
    test(`Invalid input with help | ${title}`, async t => {
      const { exitCode, stderr } = await runCli(options, versionRange, command)

      t.is(exitCode, 1)
      t.true(stderr.includes('Invalid input'))
    })
  },
)

each(
  [['', '0.0.0', 'node --version']],
  ({ title }, [options, versionRange, command]) => {
    test(`Invalid input without help | ${title}`, async t => {
      const { exitCode, stderr } = await runCli(options, versionRange, command)

      t.is(exitCode, 1)
      t.false(stderr.includes('Invalid input'))
    })
  },
)
