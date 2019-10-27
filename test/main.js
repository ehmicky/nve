import { ChildProcess } from 'child_process'

import test from 'ava'
import { each } from 'test-each'

import { runVersion, dryRunVersion } from '../src/main.js'

import { TEST_VERSION } from './helpers/versions.js'

each([runVersion, dryRunVersion], ({ title }, run) => {
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

  test(`Returns the Execa options | ${title}`, async t => {
    const {
      execaOptions: { preferLocal },
    } = await run(TEST_VERSION, 'node', ['--version'])

    t.true(preferLocal)
  })
})

test('Forward child process', async t => {
  const { childProcess } = await runVersion(TEST_VERSION, 'node', [
    '-p',
    '"test"',
  ])

  t.true(childProcess instanceof ChildProcess)

  const { exitCode, stdout } = await childProcess
  t.is(exitCode, 0)
  t.is(stdout, 'test')
})
