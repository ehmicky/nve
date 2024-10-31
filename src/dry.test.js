import test from 'ava'
import { each } from 'test-each'

import { runCli, runParallel, runSerial } from './helpers/run.test.js'
import { TEST_VERSION } from './helpers/versions.test.js'

each(
  [
    { run: runSerial, output: `${TEST_VERSION}\n${TEST_VERSION}` },
    { run: runParallel, output: `${TEST_VERSION}\n${TEST_VERSION}` },
    { run: runCli, output: TEST_VERSION },
  ],
  ({ title }, { run, output }) => {
    test(`No commands | ${title}`, async (t) => {
      const { stdout } = await run(`v${TEST_VERSION}`, [])

      t.is(stdout, output)
    })
  },
)
