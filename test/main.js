import test from 'ava'
import { getBinPath } from 'get-bin-path'
import execa from 'execa'

const TEST_VERSION = '6.0.0'

const runCli = async function(args = '--version') {
  const binPath = await getBinPath()
  const { stdout, exitCode } = await execa.command(
    `${binPath} ${TEST_VERSION} ${args}`,
  )
  return { stdout, exitCode }
}

test('Success', async t => {
  const { stdout } = await runCli()

  t.is(stdout, `v${TEST_VERSION}`)
})
