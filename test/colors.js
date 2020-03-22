import test from 'ava'
import { each } from 'test-each'
import hasAnsi from 'has-ansi'

import { HELPER_VERSION } from './helpers/versions.js'
import { runParallel } from './helpers/run.js'

each(
  [
    { env: { TEST_TTY: 'true' }, colors: true },
    { env: {}, colors: false },
    { env: { TEST_TTY: 'true', TERM: 'dumb' }, colors: false },
  ],
  ({ title }, { env, colors }) => {
    test(`Colors with interactive TTY | runParallel ${title}`, async (t) => {
      const { stdout } = await runParallel(
        '',
        HELPER_VERSION,
        'node -p require("chalk").red("test")',
        { env },
      )

      t.is(hasAnsi(stdout), colors)
    })
  },
)
