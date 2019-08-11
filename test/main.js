import { execFile } from 'child_process'
import { promisify } from 'util'

import test from 'ava'
import { getBinPath } from 'get-bin-path'

const pExecFile = promisify(execFile)

const TEST_VERSION = '6.0.0'

test('Success', async t => {
  const binPath = await getBinPath()
  const { stdout } = await pExecFile('node', [
    binPath,
    TEST_VERSION,
    '--version',
  ])
  const stdoutA = stdout.trim()

  t.is(stdoutA, `v${TEST_VERSION}`)
})
