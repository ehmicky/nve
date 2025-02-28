import test from 'ava'
import { each } from 'test-each'

import { runCli, runParallel, runSerial } from './helpers/run.test.js'
import { OLD_TEST_VERSION, TEST_VERSION } from './helpers/versions.test.js'

each([runCli, runSerial, runParallel], ({ title }, run) => {
  test(`Print non-Execa errors on stderr | ${title}`, async (t) => {
    const { stdout, stderr } = await run(TEST_VERSION, ['invalidBinary'])

    t.true(`${stdout}${stderr}`.includes('invalidBinary'))
  })
})

test('Does not print Execa errors on stderr | runCli', async (t) => {
  const { stderr } = await runCli(TEST_VERSION, [
    'node',
    '-e',
    'process.exit(2)',
  ])

  t.is(stderr, '')
})

each([runSerial, runParallel], ({ title }, run) => {
  test(`Prints Execa errors on stderr | ${title}`, async (t) => {
    const { stderr } = await run(TEST_VERSION, [
      'node',
      '-e',
      'process.exit(2)',
    ])

    t.true(
      stderr.endsWith(
        `<>  Node ${TEST_VERSION}

Node ${TEST_VERSION} failed with exit code 2`,
      ),
    )
  })
})

test(`Prints aborted message if late | runParallel`, async (t) => {
  const { stderr } = await runCli(
    `${TEST_VERSION},${OLD_TEST_VERSION}`,
    [
      'node',
      '-p',
      `".".at(0)
      setTimeout(() => {}, 1e9)`,
    ],
    ['--parallel'],
  )

  t.is(
    stderr,
    `<>  Node ${TEST_VERSION}

Node ${TEST_VERSION} aborted

 <>  Node ${OLD_TEST_VERSION}

Node ${OLD_TEST_VERSION} failed with exit code 1`,
  )
})

test(`Prints no aborted message if early | runParallel`, async (t) => {
  const { stderr } = await runCli(
    `${OLD_TEST_VERSION},${TEST_VERSION}`,
    [
      'node',
      '-p',
      `".".at(0)
      setTimeout(() => {}, 1e9)`,
    ],
    ['--parallel'],
  )

  t.is(
    stderr,
    `<>  Node ${OLD_TEST_VERSION}

Node ${OLD_TEST_VERSION} failed with exit code 1`,
  )
})

test(`Write buffered output | runParallel`, async (t) => {
  const { stdout } = await runParallel(TEST_VERSION, [
    'node',
    '-e',
    `console.log('test')
    ".".at(0)`,
  ])

  t.true(stdout.includes('test'))
})
