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
  [{ opts: '', terminate: true }, { opts: '--continue', terminate: false }],
  ({ title }, { opts, terminate }) => {
    test.serial(`Terminate other processes on failures | ${title}`, async t => {
      const { stdout } = await runCli(
        `--parallel ${opts}`,
        `${TEST_VERSION} ${OLD_TEST_VERSION}`,
        `node -e process.on("SIGTERM",()=>{console.log("SIGTERM");process.exit()})
setTimeout(()=>{Buffer.from("")},2e3)
setTimeout(()=>{},1e4)`,
        { all: true },
      )

      t.is(stdout.startsWith('SIGTERM'), terminate)
    })
  },
)
