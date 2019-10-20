import test from 'ava'
import { each } from 'test-each'

import { OLD_TEST_VERSION, TEST_VERSION } from '../helpers/versions.js'
import { runCli, runCliSerial, runCliParallel } from '../helpers/run.js'

each([runCliSerial, runCliParallel], ({ title }, run) => {
  test(`Works with early failures | ${title}`, async t => {
    const { exitCode } = await run('', TEST_VERSION, 'invalid')

    t.is(exitCode, 1)
  })
})

each(
  [runCliSerial, runCliParallel],
  [
    { opts: '', minimum: 0, maximum: 5e3 },
    { opts: '--continue', minimum: 5e3, maximum: 10e3 },
  ],
  ({ title }, run, { opts, minimum, maximum }) => {
    test.serial(
      `Does not run other processes on failures | ${title}`,
      async t => {
        const start = Date.now()
        await runCli(
          opts,
          `${OLD_TEST_VERSION} ${TEST_VERSION}`,
          'node -e Buffer.from("")&&setTimeout(()=>{},5e3)',
        )
        const duration = Date.now() - start

        t.true(duration >= minimum)
        t.true(duration <= maximum)
      },
    )
  },
)
