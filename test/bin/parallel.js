import test from 'ava'
import { each } from 'test-each'

import { TEST_VERSION, OLD_TEST_VERSION } from '../helpers/versions.js'
import { runCli, runCliSerial, runCliParallel } from '../helpers/run.js'

test('Forward exit code and output on late failure | runCliParallel', async t => {
  const { exitCode, stdout, stderr } = await runCli(
    '--parallel --continue',
    `${TEST_VERSION} ${OLD_TEST_VERSION}`,
    'node -p Buffer.from("")',
  )

  t.is(exitCode, 1)
  t.true(stderr.startsWith(`<>  Node ${TEST_VERSION}`))
  t.true(
    stderr.endsWith(`<>  Node ${OLD_TEST_VERSION}

Node ${OLD_TEST_VERSION} failed with exit code 1`),
  )
  t.true(
    stdout.startsWith(`<Buffer >
[eval]:1`),
  )
})

test('No --continue | runCliParallel', async t => {
  const { exitCode, stdout, stderr } = await runCli(
    '--parallel',
    `${OLD_TEST_VERSION} ${TEST_VERSION}`,
    'node -p Buffer.from("")',
  )

  t.is(exitCode, 1)
  t.true(stdout.startsWith('[eval]:1'))
  t.is(
    stderr,
    `<>  Node ${OLD_TEST_VERSION}

Node ${OLD_TEST_VERSION} failed with exit code 1`,
  )
})

test('--continue | runCliParallel', async t => {
  const { exitCode, stdout, stderr } = await runCli(
    '--parallel --continue',
    `${OLD_TEST_VERSION} ${TEST_VERSION}`,
    'node -p Buffer.from("")',
  )

  t.is(exitCode, 1)
  t.true(stdout.endsWith('<Buffer >'))
  t.true(stdout.startsWith('[eval]:1'))
  t.is(
    stderr,
    `<>  Node ${OLD_TEST_VERSION}

Node ${OLD_TEST_VERSION} failed with exit code 1

 <>  Node ${TEST_VERSION}`,
  )
})

each(
  [
    { run: runCliSerial, parallel: false },
    { run: runCliParallel, parallel: true },
  ],
  ({ title }, { run, parallel }) => {
    test(`Run in parallel/serial | ${title}`, async t => {
      const { stdout } = await run(
        '',
        TEST_VERSION,
        `node -e console.log(Date.now())
setTimeout(()=>{console.log(Date.now())},5e3)`,
      )

      const [, endOne, startTwo] = stdout.split('\n')
      t.is(endOne >= startTwo, parallel)
    })
  },
)
