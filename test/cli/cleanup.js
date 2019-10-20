import test from 'ava'
import { each } from 'test-each'

import { TEST_VERSION } from '../helpers/versions.js'
import { runCliSerial, runCliParallel } from '../helpers/run.js'

each([runCliSerial, runCliParallel], ({ title }, run) => {
  test(`Works with early failures | ${title}`, async t => {
    const { exitCode } = await run('', TEST_VERSION, 'invalid')

    t.is(exitCode, 1)
  })
})
