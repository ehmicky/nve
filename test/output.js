import test from 'ava'

import { runParallel } from './helpers/run.js'
import { TEST_VERSION } from './helpers/versions.js'

test('No output | runParallel', async (t) => {
  const { stdout } = await runParallel('--parallel', TEST_VERSION, 'node -p ""')

  t.is(stdout, '')
})
