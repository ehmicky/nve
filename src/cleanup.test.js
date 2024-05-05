import test from 'ava'
import { each } from 'test-each'

import { runCli, runSerial, runParallel } from './helpers/run.test.js'
import { OLD_TEST_VERSION, TEST_VERSION } from './helpers/versions.test.js'

each([runSerial, runParallel], ({ title }, run) => {
  test(`Works with early failures | ${title}`, async (t) => {
    const { exitCode } = await run(TEST_VERSION, ['invalid'])

    t.is(exitCode, 1)
  })
})

each(
  [
    { opts: [], terminate: true },
    { opts: ['--continue'], terminate: false },
  ],
  ({ title }, { opts, terminate }) => {
    test(`Terminate other processes on failures | ${title}`, async (t) => {
      const { stdout } = await runCli(
        `${TEST_VERSION},${OLD_TEST_VERSION}`,
        [
          'node',
          '-e',
          `".".at(0)
          setTimeout(() => {
            console.log("test")
          }, 5e3)`,
        ],
        ['--parallel', ...opts],
        { all: true },
      )

      t.not(stdout.startsWith('test'), terminate)
    })
  },
)
