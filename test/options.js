import test from 'ava'
import { each } from 'test-each'

import { runVersion, runVersions, dryRunVersion } from '../src/main.js'

import { TEST_VERSION } from './helpers/versions.js'
import { runVersionMany } from './helpers/run.js'

each(
  [
    [],
    [TEST_VERSION],
    [TEST_VERSION, true],
    [TEST_VERSION, 'node', true],
    [TEST_VERSION, 'node', [true]],
    [TEST_VERSION, 'node', [], true],
    [TEST_VERSION, 'node', [], { spawnOptions: true }],
    [TEST_VERSION, 'node', [], { progress: '' }],
    [TEST_VERSION, 'node', [], { mirror: true }],
    ['invalid_version', 'node'],
  ],
  [runVersion, runVersionMany, dryRunVersion],
  ({ title }, [versionRange, command, args, opts], run) => {
    test(`Invalid arguments | programmatic ${title}`, async t => {
      await t.throwsAsync(run(versionRange, command, args, opts))
    })
  },
)

each(
  [[TEST_VERSION, 'node', ['--version']]],
  ({ title }, [versionRange, command, args, opts]) => {
    test(`Invalid arguments | programmatic runVersionMany ${title}`, async t => {
      const iterator = await runVersions(versionRange, command, args, opts)
      await t.throwsAsync(iterator.next())
    })
  },
)
