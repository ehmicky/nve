import test from 'ava'
import { each } from 'test-each'

import { TEST_VERSION } from '../helpers/versions.js'
import { runCli, runCliSerial, runCliParallel } from '../helpers/run.js'

each(
  [
    { run: runCli, output: 'test' },
    { run: runCliSerial, output: 'test\ntest' },
    { run: runCliParallel, output: 'test\ntest' },
  ],
  ({ title }, { run, output }) => {
    test(`stdin | ${title}`, async t => {
      const { stdout } = await run(
        '',
        TEST_VERSION,
        'node -e process.stdin.pipe(process.stdout)',
        { input: 'test\n', stdin: 'pipe' },
      )

      t.is(stdout, output)
    })

    test(`No stdin | ${title}`, async t => {
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