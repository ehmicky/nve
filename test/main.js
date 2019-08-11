import test from 'ava'
import { getBinPath } from 'get-bin-path'
import execa from 'execa'
import { each } from 'test-each'

import nve from '../src/main.js'

const TEST_VERSION = '6.0.0'

const runCli = async function(args = '--version', versionRange = TEST_VERSION) {
  const binPath = await getBinPath()
  const { stdout, stderr, exitCode: code } = await execa.command(
    `${binPath} ${versionRange} ${args}`,
    { reject: false },
  )
  return { stdout, stderr, code }
}

test('Forward stdout/stderr', async t => {
  const { stdout } = await runCli()

  t.is(stdout, `v${TEST_VERSION}`)
})

test('Print errors on stderr', async t => {
  const { stderr } = await runCli('--invalid')

  t.true(stderr.includes('--invalid'))
})

test('Forward exit code on success | CLI', async t => {
  const { code } = await runCli()

  t.is(code, 0)
})

test('Forward exit code on failure | CLI', async t => {
  const { code } = await runCli('does_not_exist.js')

  t.is(code, 1)
})

test('Forward exit code | programmatic', async t => {
  const { code } = await nve(TEST_VERSION, ['-e', '""'])

  t.is(code, 0)
})

test('Forward signal | programmatic', async t => {
  const { signal } = await nve(TEST_VERSION, ['-e', '""'])

  t.is(signal, null)
})

test('Invalid arguments | CLI', async t => {
  const { stderr, code } = await runCli('', 'invalid_version')

  t.is(code, 1)
  t.true(stderr.includes('invalid_version'))
})

each(
  [[TEST_VERSION, true], [TEST_VERSION, [true]], ['invalid_version']],
  ({ title }, [versionRange, args]) => {
    test(`Invalid arguments | programmatic ${title}`, async t => {
      await t.throwsAsync(nve(versionRange, args))
    })
  },
)
