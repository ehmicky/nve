import test from 'ava'

import { TEST_VERSION } from '../helpers/versions.js'
import { runCli } from '../helpers/run.js'

test(`Allow stdin | runCli`, async t => {
  const { stdout } = await runCli(
    '',
    TEST_VERSION,
    'node -e process.stdin.pipe(process.stdout)',
    { input: 'test' },
  )

  t.is(stdout, 'test')
})
