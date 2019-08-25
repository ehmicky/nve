import test from 'ava'
import { each } from 'test-each'

import nve from '../src/main.js'

import { TEST_VERSION, runCli } from './helpers/main.js'

each(
  [[''], [TEST_VERSION], ['invalid_version', 'node']],
  ({ title }, [versionRange, command]) => {
    test(`Invalid arguments | CLI ${title}`, async t => {
      const { code, stderr } = await runCli(`${versionRange} ${command}`)

      t.is(code, 1)
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
    ['invalid_version', 'node'],
  ],
  ({ title }, [versionRange, command, args, opts]) => {
    test(`Invalid arguments | programmatic ${title}`, async t => {
      await t.throwsAsync(nve(versionRange, command, args, opts))
    })
  },
)
