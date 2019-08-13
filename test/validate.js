import test from 'ava'
import { each } from 'test-each'

import { nve } from '../src/main.js'

import { TEST_VERSION, runCli } from './helpers/main.js'

test('Invalid arguments | CLI', async t => {
  const { stderr, code } = await runCli('invalid_version')

  t.is(code, 1)
  t.true(stderr.includes('invalid_version'))
})

each(
  [[TEST_VERSION, true], [TEST_VERSION, [true]], ['invalid_version']],
  ({ title }, [versionRange, args]) => {
    test(`Invalid arguments | programmatic ${title}`, async t => {
      await t.throwsAsync(nve(versionRange, args))
    })
  },
)
