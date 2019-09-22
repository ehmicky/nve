import { ChildProcess } from 'child_process'
import { version } from 'process'

import test from 'ava'
import { each } from 'test-each'

import nve from '../src/main.js'

import { TEST_VERSION, getStdout } from './helpers/main.js'

test('Forward child process | programmatic', async t => {
  const childProcess = await nve(TEST_VERSION, 'node', ['-e', '""'])

  t.true(childProcess instanceof ChildProcess)
})

test('Can pass arguments | programmatic', async t => {
  const stdout = await getStdout({
    versionRange: TEST_VERSION,
    command: 'node',
    args: ['-p', '"test"'],
  })

  t.is(stdout, 'test')
})

each(
  [
    { stdio: 'ignore', output: null },
    { stdio: 'inherit', output: null },
    { stdio: 'pipe', output: `v${TEST_VERSION}` },
    { output: `v${TEST_VERSION}` },
  ],
  ({ title }, { stdio, output }) => {
    test(`Can use stdio | ${title}`, async t => {
      const stdout = await getStdout({
        versionRange: TEST_VERSION,
        spawnOpts: { stdio },
      })

      t.is(stdout, output)
    })
  },
)

test('Can fire binaries', async t => {
  const stdout = await getStdout({
    versionRange: version,
    command: 'npm',
    args: ['--version'],
  })

  t.true(stdout !== '')
})
