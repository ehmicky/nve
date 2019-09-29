import test from 'ava'
import { each } from 'test-each'

import nve from '../src/main.js'

import { runCli } from './helpers/cli.js'
import { TEST_VERSION } from './helpers/versions.js'

each(
  [[''], [TEST_VERSION], ['invalid_version', 'node']],
  ({ title }, [versionRange, command]) => {
    test(`Invalid arguments | CLI ${title}`, async t => {
      const { exitCode, stderr } = await runCli(`${versionRange} ${command}`)

      t.not(exitCode, 0)
      t.true(stderr !== '')
    })
  },
)

each(
  [
    [],
    [TEST_VERSION],
    [TEST_VERSION, true],
    [TEST_VERSION, 'node', true],
    [TEST_VERSION, 'node', [true]],
    [TEST_VERSION, 'node', [], true],
    [TEST_VERSION, 'node', [], { spawn: true }],
    [TEST_VERSION, 'node', [], { progress: '' }],
    [TEST_VERSION, 'node', [], { mirror: true }],
    ['invalid_version', 'node'],
  ],
  ({ title }, [versionRange, command, args, opts]) => {
    test(`Invalid arguments | programmatic ${title}`, async t => {
      await t.throwsAsync(nve(versionRange, command, args, opts))
    })
  },
)
