import test from 'ava'
import { each } from 'test-each'

import { TEST_VERSION } from '../helpers/versions.js'
import { runCli, runCliSerial, runCliParallel } from '../helpers/run.js'

each(
  [
    { run: runCliSerial, output: `${TEST_VERSION}\n${TEST_VERSION}` },
    { run: runCliParallel, output: `${TEST_VERSION}\n${TEST_VERSION}` },
    { run: runCli, output: TEST_VERSION },
  ],
  ({ title }, { run, output }) => {
    test(`No commands | ${title}`, async t => {
      const { stdout } = await run('', `v${TEST_VERSION}`, '')

      t.is(stdout, output)
    })
  },
)
