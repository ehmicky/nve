import { ChildProcess } from 'child_process'

import test from 'ava'
import { each } from 'test-each'

import { runVersion } from '../src/main.js'

import { TEST_VERSION } from './helpers/versions.js'
import { runFirstVersion } from './helpers/run.js'

each([runVersion, runFirstVersion], ({ title }, run) => {
  test(`Forward child process | ${title}`, async t => {
    const { childProcess } = await run(TEST_VERSION, 'node', ['-p', '"test"'])

    t.true(childProcess instanceof ChildProcess)

    const { exitCode, stdout } = await childProcess
    t.is(exitCode, 0)
    t.is(stdout, 'test')
  })

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

  test(`Can omit command | ${title}`, async t => {
    const { version } = await run(TEST_VERSION)

    t.is(version, TEST_VERSION)
  })

  test(`Returns the modified command | ${title}`, async t => {
    const { command } = await run(TEST_VERSION, 'node', ['--version'])

    t.not(command, 'node')
  })

  test(`Returns the modified command even if undefined | ${title}`, async t => {
    const { command } = await run(TEST_VERSION)

    t.is(command, undefined)
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
