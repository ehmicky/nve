import test from 'ava'

import { TEST_VERSION } from './helpers/versions.js'
import { runParallel } from './helpers/run.js'

test('No output | runParallel', async (t) => {
  const { stdout } = await runParallel('--parallel', TEST_VERSION, 'node -p ""')

  t.is(stdout, '')
})
