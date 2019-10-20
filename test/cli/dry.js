import test from 'ava'

import { TEST_VERSION } from '../helpers/versions.js'
import { runCli, runCliSerial } from '../helpers/run.js'

test('No commands | runCli', async t => {
  const { stdout } = await runCli('', `v${TEST_VERSION}`, '')

  t.is(stdout, TEST_VERSION)
})

test('No commands | runCliSerial', async t => {
  const { stdout } = await runCliSerial('', `v${TEST_VERSION}`, '')

  t.is(stdout, `${TEST_VERSION}\n${TEST_VERSION}`)
})
