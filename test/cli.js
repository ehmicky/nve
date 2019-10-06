import test from 'ava'
import { each } from 'test-each'
import readPkgUp from 'read-pkg-up'
import { getBinPath } from 'get-bin-path'
import execa from 'execa'
import isCi from 'is-ci'

import { TEST_VERSION } from './helpers/versions.js'

const BIN_PATH = getBinPath()

test('Forward exit code on success | CLI', async t => {
  const { exitCode } = await runCli(`${TEST_VERSION} node --version`)

  t.is(exitCode, 0)
})

test('Forward exit code on failure | CLI', async t => {
  const { exitCode } = await runCli(`${TEST_VERSION} node -e process.exit(2)`)

  t.is(exitCode, 2)
})

test('Default exit code to 1 | CLI', async t => {
  const { exitCode } = await runCli(
    `${TEST_VERSION} node -e process.kill(process.pid)`,
  )

  t.is(exitCode, 1)
})

test('Print non-Execa errors on stderr', async t => {
  const { stderr } = await runCli(`${TEST_VERSION} invalidBinary`)

  t.true(stderr.includes('invalidBinary'))
})

test('Does not print Execa errors on stderr', async t => {
  const { stderr } = await runCli(
    `--no-progress ${TEST_VERSION} node -e process.exit(2)`,
  )

  t.is(stderr, '')
})

test('--help | CLI', async t => {
  const { stdout } = await runCli('--help')

  t.true(stdout.includes('any version range'))
})

test('--version | CLI', async t => {
  const [
    { stdout },
    {
      packageJson: { version },
    },
  ] = await Promise.all([runCli('--version'), readPkgUp()])

  t.is(stdout, version)
})

test('node --help | CLI', async t => {
  const { stdout } = await runCli(`${TEST_VERSION} node --help`)

  t.true(stdout.includes('Usage: node'))
})

test('node --version | CLI', async t => {
  const { stdout } = await runCli(
    `--no-progress ${TEST_VERSION} node --version`,
  )

  t.is(stdout, `v${TEST_VERSION}`)
})

test('CLI flags | CLI', async t => {
  const { exitCode } = await runCli(
    `--no-progress ${TEST_VERSION} node --version`,
  )

  t.is(exitCode, 0)
})

// TODO: this does not work with nyc
// This might be fixed with nyc@15
// See https://github.com/istanbuljs/spawn-wrap/issues/108
if (!isCi) {
  test('Can run in shell mode | CLI', async t => {
    const { all: stdout } = await runCli(
      `--no-progress --shell ${TEST_VERSION} node\\ --version\\ &&\\ node\\ --version`,
    )

    t.is(stdout, `v${TEST_VERSION}\nv${TEST_VERSION}`)
  })
}

each(
  [[''], [TEST_VERSION], ['invalid_version', 'node']],
  ({ title }, [versionRange, command]) => {
    test(`Invalid arguments | CLI ${title}`, async t => {
      const { exitCode, stderr } = await runCli(`${versionRange} ${command}`)

      t.not(exitCode, 0)
      t.true(stderr !== '')
    })
  },
)

const runCli = async function(args) {
  const binPath = await BIN_PATH
  return execa.command(`${binPath} ${args}`, { reject: false })
}
