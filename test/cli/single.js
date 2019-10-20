import test from 'ava'

import { TEST_VERSION } from '../helpers/versions.js'
import { runCli } from '../helpers/run.js'

test('No commands | CLI runCli', async t => {
  const { stdout } = await runCli('', `v${TEST_VERSION}`, '')

  t.is(stdout, TEST_VERSION)
})
