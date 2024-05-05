import test from 'ava'
import { each } from 'test-each'

import { printModernNodeArgs } from './helpers/args.test.js'
import { runCli, runSerial, runParallel } from './helpers/run.test.js'
import { TEST_VERSION, OLD_TEST_VERSION } from './helpers/versions.test.js'

test('Forward exit code and output on late failure | runParallel', async (t) => {
  const { exitCode, stdout, stderr } = await runCli(
    `${TEST_VERSION},${OLD_TEST_VERSION}`,
    printModernNodeArgs,
    ['--parallel', '--continue'],
  )

  t.is(exitCode, 1)
  t.true(stderr.startsWith(`<>  Node ${TEST_VERSION}`))
  t.true(
    stderr.endsWith(`<>  Node ${OLD_TEST_VERSION}

Node ${OLD_TEST_VERSION} failed with exit code 1`),
  )
  t.true(
    stdout.startsWith(`.
[eval]:1`),
  )
})

test('No --continue | runParallel', async (t) => {
  const { exitCode, stdout, stderr } = await runCli(
    `${OLD_TEST_VERSION},${TEST_VERSION}`,
    printModernNodeArgs,
    ['--parallel'],
  )

  t.is(exitCode, 1)
  t.true(stdout.startsWith('[eval]:1'))
  t.is(
    stderr,
    `<>  Node ${OLD_TEST_VERSION}

Node ${OLD_TEST_VERSION} failed with exit code 1`,
  )
})

test('--continue | runParallel', async (t) => {
  const { exitCode, stdout, stderr } = await runCli(
    `${OLD_TEST_VERSION},${TEST_VERSION}`,
    printModernNodeArgs,
    ['--parallel', '--continue'],
  )

  t.is(exitCode, 1)
  t.true(stdout.endsWith('.'))
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
    { run: runSerial, parallel: false },
    { run: runParallel, parallel: true },
  ],
  ({ title }, { run, parallel }) => {
    test(`Run in parallel/serial | ${title}`, async (t) => {
      const { stdout } = await run(TEST_VERSION, [
        'node',
        '-e',
        `console.log(Date.now())
        setTimeout(() => {
          console.log(Date.now())
        }, 5e3)`,
      ])

      const [, endOne, startTwo] = stdout.split('\n')
      t.is(endOne >= startTwo, parallel)
    })
  },
)
