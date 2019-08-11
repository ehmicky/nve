import test from 'ava'
import { getBinPath } from 'get-bin-path'
import execa from 'execa'

const TEST_VERSION = '6.0.0'

const runCli = async function(args = '--version') {
  const binPath = await getBinPath()
  const { stdout, exitCode } = await execa.command(
    `${binPath} ${TEST_VERSION} ${args}`,
    { reject: false },
  )
  return { stdout, exitCode }
}

test('Execute command', async t => {
  const { stdout } = await runCli()

  t.is(stdout, `v${TEST_VERSION}`)
})

test('Forward exit code on success', async t => {
  const { exitCode } = await runCli()

  t.is(exitCode, 0)
})

test('Forward exit code on failure', async t => {
  const { exitCode } = await runCli('does_not_exist.js')

  t.is(exitCode, 1)
})
