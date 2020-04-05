import { version } from 'process'

import test from 'ava'
import { each } from 'test-each'

import { runCli, runSerial, runParallel } from './helpers/run.js'
import { TEST_VERSION } from './helpers/versions.js'

each([runCli, runSerial, runParallel], ({ title }, run) => {
  test(`Forward exit code on success | ${title}`, async (t) => {
    const { exitCode } = await run('', TEST_VERSION, 'node --version')

    t.is(exitCode, 0)
  })

  test(`Forward exit code on failure | ${title}`, async (t) => {
    const { exitCode } = await run('', TEST_VERSION, 'node -e process.exit(2)')

    t.is(exitCode, 2)
  })

  test(`Default exit code to 1 | ${title}`, async (t) => {
    const { exitCode } = await run(
      '',
      TEST_VERSION,
      'node -e process.kill(process.pid)',
    )

    t.is(exitCode, 1)
  })

  test(`Can use aliases | ${title}`, async (t) => {
    const { stdout } = await run('', '.', 'node --version')

    t.true(stdout.includes(version))
  })
})
