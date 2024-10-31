import test from 'ava'

import { printModernNodeArgs } from './helpers/args.test.js'
import { runCli } from './helpers/run.test.js'
import { OLD_TEST_VERSION, TEST_VERSION } from './helpers/versions.test.js'

test(`Forward exit code and output on late failure | runSerial`, async (t) => {
  const { exitCode, stdout, stderr } = await runCli(
    `${TEST_VERSION},${OLD_TEST_VERSION}`,
    printModernNodeArgs,
  )

  t.is(exitCode, 1)
  t.is(stdout, '.')
  t.true(
    stderr.startsWith(
      `<>  Node ${TEST_VERSION}


 <>  Node ${OLD_TEST_VERSION}

[eval]:1`,
    ),
  )
})

test(`--continue | runSerial`, async (t) => {
  const { exitCode, stdout, stderr } = await runCli(
    `${OLD_TEST_VERSION},${TEST_VERSION}`,
    printModernNodeArgs,
    ['--continue'],
  )

  t.is(exitCode, 1)
  t.is(stdout, '.')
  t.true(
    stderr.startsWith(
      `<>  Node ${OLD_TEST_VERSION}

[eval]:1`,
    ),
  )
  t.true(stderr.endsWith(`<>  Node ${TEST_VERSION}`))
})
