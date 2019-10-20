import { version } from 'process'

import test from 'ava'
import { each } from 'test-each'
import hasAnsi from 'has-ansi'

import { TEST_VERSION } from '../helpers/versions.js'
import { runCliParallel } from '../helpers/run.js'

each(
  [
    { env: { TEST_TTY: 'true' }, colors: true },
    { env: {}, colors: false },
    { env: { TEST_TTY: 'true', TERM: 'dumb' }, colors: false },
  ],
  ({ title }, { env, colors }) => {
    test(`Colors with interactive TTY | runCliParallel ${title}`, async t => {
      const { stdout } = await runCliParallel(
        '',
        TEST_VERSION,
        'node -p require("chalk").red("test")',
        { env },
      )

      // TODO: remove after dropping support for Node 8/9
      const colorsA = colors && !version.startsWith('v8.')
      t.is(hasAnsi(stdout), colorsA)
    })
  },
)
