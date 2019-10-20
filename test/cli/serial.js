import test from 'ava'

import { TEST_VERSION, OLD_TEST_VERSION } from '../helpers/versions.js'
import { runCli } from '../helpers/run.js'

test(`Forward exit code and output on late failure | CLI runCliSerial`, async t => {
  const { exitCode, all } = await runCli(
    '',
    `${TEST_VERSION} ${OLD_TEST_VERSION}`,
    'node -p Buffer.from("")',
  )

  t.is(exitCode, 1)
  t.true(
    all.startsWith(
      `<>  Node ${TEST_VERSION}\n\n<Buffer >\n\n <>  Node ${OLD_TEST_VERSION}\n\n[eval]:1`,
    ),
  )
})
