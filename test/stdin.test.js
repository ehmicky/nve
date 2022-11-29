import test from 'ava'
import { each } from 'test-each'

import { runCli, runSerial, runParallel } from './helpers/run.js'
import { TEST_VERSION } from './helpers/versions.js'

each(
  [
    { run: runCli, output: 'test' },
    { run: runSerial, output: 'test\ntest' },
    { run: runParallel, output: 'test\ntest' },
  ],
  ({ title }, { run, output }) => {
    test(`stdin | ${title}`, async (t) => {
      const { stdout } = await run(
        '',
        TEST_VERSION,
        'node -e process.stdin.pipe(process.stdout)',
        { input: 'test\n', stdin: 'pipe' },
      )

      t.is(stdout, output)
    })

    test(`No stdin | ${title}`, async (t) => {
      const { stdout } = await run(
        '',
        TEST_VERSION,
        'node -e process.stdin.pipe(process.stdout)',
        { stdin: 'ignore' },
      )

      t.is(stdout, '')
    })
  },
)
