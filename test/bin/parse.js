import test from 'ava'
import { each } from 'test-each'

import { runCli } from '../helpers/run.js'

each(
  [
    { options: '', versionRange: '', command: '', showHelp: true },
    { options: '--shell', versionRange: '', command: '', showHelp: true },
    {
      options: '--shell',
      versionRange: '',
      command: 'node --version',
      showHelp: true,
    },
    {
      options: '',
      versionRange: 'invalid_version',
      command: 'node --version',
      showHelp: true,
    },
    {
      options: '--shell',
      versionRange: 'invalid_version',
      command: 'node --version',
      showHelp: true,
    },
    {
      options: '',
      versionRange: '0.0.0',
      command: 'node --version',
      showHelp: false,
    },
  ],
  ({ title }, { options, versionRange, command, showHelp }) => {
    test(`Invalid input with help | ${title}`, async t => {
      const { exitCode, stderr } = await runCli(options, versionRange, command)

      t.is(exitCode, 1)
      t.is(stderr.includes('Invalid input'), showHelp)
    })
  },
)
