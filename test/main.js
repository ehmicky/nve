import { ChildProcess } from 'child_process'

import test from 'ava'
import { each } from 'test-each'

import { runVersion, runVersions, dryRunVersion } from '../src/main.js'

import { TEST_VERSION, SECOND_TEST_VERSION } from './helpers/versions.js'
import { runVersionMany } from './helpers/run.js'

each([runVersion, runVersionMany, dryRunVersion], ({ title }, run) => {
  test(`Return normalized Node.js version | ${title}`, async t => {
    const { version } = await run(`v${TEST_VERSION}`, 'node', ['--version'])

    t.is(version, TEST_VERSION)
  })

  test(`Return non-normalized Node.js version | ${title}`, async t => {
    const { versionRange } = await run(`v${TEST_VERSION}`, 'node', [
      '--version',
    ])

    t.is(versionRange, `v${TEST_VERSION}`)
  })

  test(`Can omit arguments but specify options | ${title}`, async t => {
    const { version } = await run(`v${TEST_VERSION}`, 'echo', {})

    t.is(version, TEST_VERSION)
  })

  test(`Can omit both arguments and options | ${title}`, async t => {
    const { version } = await run(`v${TEST_VERSION}`, 'echo')

    t.is(version, TEST_VERSION)
  })

  test(`Returns the modified command | ${title}`, async t => {
    const { command } = await run(TEST_VERSION, 'node', ['--version'])

    t.not(command, 'node')
  })

  test(`Returns the modified args | ${title}`, async t => {
    const { args } = await run(TEST_VERSION, 'node', ['--version'])

    t.deepEqual(args, ['--version'])
  })

  test(`Returns the spawn options | ${title}`, async t => {
    const {
      spawnOptions: { preferLocal },
    } = await run(TEST_VERSION, 'node', ['--version'])

    t.true(preferLocal)
  })
})

each([runVersion, runVersionMany], ({ title }, run) => {
  test(`Forward child process | ${title}`, async t => {
    const { childProcess } = await run(TEST_VERSION, 'node', ['-p', '"test"'])

    t.true(childProcess instanceof ChildProcess)

    const { exitCode, stdout } = await childProcess
    t.is(exitCode, 0)
    t.is(stdout, 'test')
  })
})

// eslint-disable-next-line max-statements
test('Can iterate | runVersionMany', async t => {
  const iterator = runVersions(
    [`v${TEST_VERSION}`, `v${SECOND_TEST_VERSION}`],
    'node',
    ['--version'],
  )

  const { value } = await iterator.next()

  const { exitCode, stdout } = await value.childProcess
  t.is(exitCode, 0)
  t.is(stdout, `v${TEST_VERSION}`)
  t.is(value.version, TEST_VERSION)
  t.is(value.versionRange, `v${TEST_VERSION}`)

  const { value: valueTwo } = await iterator.next()

  const {
    exitCode: exitCodeTwo,
    stdout: stdoutTwo,
  } = await valueTwo.childProcess
  t.is(exitCodeTwo, 0)
  // eslint-disable-next-line ava/max-asserts
  t.is(stdoutTwo, `v${SECOND_TEST_VERSION}`)
  t.is(valueTwo.version, SECOND_TEST_VERSION)
  t.is(valueTwo.versionRange, `v${SECOND_TEST_VERSION}`)
})
