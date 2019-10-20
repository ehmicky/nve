import test from 'ava'
import { each } from 'test-each'

import { runVersion } from '../src/main.js'

import { TEST_VERSION } from './helpers/versions.js'
import { runFirstVersion } from './helpers/run.js'

each(
  [
    [],
    [TEST_VERSION, true],
    [TEST_VERSION, 'node', true],
    [TEST_VERSION, 'node', [true]],
    [TEST_VERSION, 'node', [], true],
    [TEST_VERSION, 'node', [], { spawnOptions: true }],
    [TEST_VERSION, 'node', [], { progress: '' }],
    [TEST_VERSION, 'node', [], { mirror: true }],
    ['invalid_version', 'node'],
  ],
  [runVersion, runFirstVersion],
  ({ title }, [versionRange, command, args, opts], run) => {
    test(`Invalid arguments | programmatic ${title}`, async t => {
      await t.throwsAsync(run(versionRange, command, args, opts))
    })
  },
)
