import test from 'ava'
import { each } from 'test-each'

import { runCli, runCliSerial } from '../helpers/run.js'
import { TEST_VERSION } from '../helpers/versions.js'

each([runCli, runCliSerial], ({ title }, run) => {
  test(`Forward exit code on success | CLI ${title}`, async t => {
    const { exitCode } = await run('', TEST_VERSION, 'node --version')

    t.is(exitCode, 0)
  })

  test(`Forward exit code on failure | CLI ${title}`, async t => {
    const { exitCode } = await run('', TEST_VERSION, 'node -e process.exit(2)')

    t.is(exitCode, 2)
  })

  test(`Default exit code to 1 | CLI ${title}`, async t => {
    const { exitCode } = await run(
      '',
      TEST_VERSION,
      'node -e process.kill(process.pid)',
    )

    t.is(exitCode, 1)
  })
})
