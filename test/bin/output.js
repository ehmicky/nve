import test from 'ava'

import { TEST_VERSION } from '../helpers/versions.js'
import { runCliParallel } from '../helpers/run.js'

test('No output | runCliParallel', async t => {
  const { stdout } = await runCliParallel(
    '--parallel',
    TEST_VERSION,
    'node -p ""',
  )

  t.is(stdout, '')
})
