import test from 'ava'

import { TEST_VERSION, OLD_TEST_VERSION } from '../helpers/versions.js'
import { runCli } from '../helpers/run.js'

test(`Forward exit code and output on late failure | runCliSerial`, async t => {
  const { exitCode, all } = await runCli(
    '',
    `${TEST_VERSION} ${OLD_TEST_VERSION}`,
    'node -p Buffer.from("")',
  )

  t.is(exitCode, 1)
  t.true(
    all.startsWith(
      `<>  Node ${TEST_VERSION}

<Buffer >

 <>  Node ${OLD_TEST_VERSION}

[eval]:1`,
    ),
  )
})

test(`--continue | runCliSerial`, async t => {
  const { exitCode, all } = await runCli(
    '--continue',
    `${OLD_TEST_VERSION} ${TEST_VERSION}`,
    'node -p Buffer.from("")',
  )

  t.is(exitCode, 1)
  t.true(
    all.startsWith(`<>  Node ${OLD_TEST_VERSION}

[eval]:1`),
  )
  t.true(
    all.endsWith(`<>  Node ${TEST_VERSION}

<Buffer >`),
  )
})
