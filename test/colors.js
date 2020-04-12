import test from 'ava'
import hasAnsi from 'has-ansi'
import { each } from 'test-each'

import { runParallel } from './helpers/run.js'
import { HELPER_VERSION } from './helpers/versions.js'

each(
  [
    { env: { TEST_TTY: 'true', FORCE_COLOR: '1' }, colors: true },
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
