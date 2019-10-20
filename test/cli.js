import { platform } from 'process'

import test from 'ava'
import { each } from 'test-each'
import readPkgUp from 'read-pkg-up'
import isCi from 'is-ci'

import { TEST_VERSION } from './helpers/versions.js'
import { runCli, runCliSerial } from './helpers/run.js'

each([runCli, runCliSerial], ({ title }, run) => {
  test(`Forward exit code on success | CLI ${title}`, async t => {
    const { exitCode } = await run('', TEST_VERSION, 'node --version')

    t.is(exitCode, 0)
  })

  test(`Forward exit code on failure | CLI ${title}`, async t => {
    const { exitCode } = await run('', TEST_VERSION, 'node -e process.exit(2)')

    t.is(exitCode, 2)
  })

  test(`Default exit code to 1 | CLI ${title}`, async t => {
    const { exitCode } = await run(
      '',
      TEST_VERSION,
      'node -e process.kill(process.pid)',
    )

    t.is(exitCode, 1)
  })

  test(`Print non-Execa errors on stderr | CLI ${title}`, async t => {
    const { stderr } = await run('', TEST_VERSION, 'invalidBinary')

    t.true(stderr.includes('invalidBinary'))
  })

  // This does not work with nyc on MacOS
  // This might be fixed with nyc@15
  // See https://github.com/istanbuljs/spawn-wrap/issues/108
  if (platform !== 'darwin' || !isCi) {
    test(`Can run in shell mode | CLI ${title}`, async t => {
      const { exitCode } = await run(
        '--shell',
        TEST_VERSION,
        'node\\ --version\\ &&\\ node\\ --version',
      )

      t.is(exitCode, 0)
      // TODO: enable the following line. It currently does not work with nyc
      // This might be fixed with nyc@15
      // See https://github.com/istanbuljs/spawn-wrap/issues/108
      // t.is(stdout, `v${TEST_VERSION}\nv${TEST_VERSION}`)
    })
  }

  test(`node --help | CLI ${title}`, async t => {
    const { stdout } = await run('', TEST_VERSION, 'node --help')

    t.true(stdout.includes('Usage: node'))
  })
})

each(
  [['', ''], [TEST_VERSION, 'invalid_binary'], ['invalid_version', 'node']],
  [runCli, runCliSerial],
  ({ title }, [versionRange, command], run) => {
    test(`Invalid arguments | CLI ${title}`, async t => {
      const { exitCode, stderr } = await run('', versionRange, command)

      t.not(exitCode, 0)
      t.true(stderr !== '')
    })
  },
)

test('Does not print Execa errors on stderr | CLI runCli', async t => {
  const { stderr } = await runCli('', TEST_VERSION, 'node -e process.exit(2)')

  t.is(stderr, '')
})

test('Prints Execa errors on stderr | CLI runMany', async t => {
  const { stderr } = await runCliSerial(
    '',
    TEST_VERSION,
    'node -e process.exit(2)',
  )

  t.is(
    stderr,
    `<>  Node ${TEST_VERSION}\n\nNode ${TEST_VERSION} failed with exit code 2`,
  )
})

test('No commands | CLI runCli', async t => {
  const { stdout } = await runCli('', `v${TEST_VERSION}`, '')

  t.is(stdout, TEST_VERSION)
})

test('No commands | CLI runCliSerial', async t => {
  const { stdout } = await runCliSerial('', `v${TEST_VERSION}`, '')

  t.is(stdout, `${TEST_VERSION}\n${TEST_VERSION}`)
})

test('--help | CLI', async t => {
  const { stdout } = await runCli('', '', '--help')

  t.true(stdout.includes('any version range'))
})

test('--version | CLI', async t => {
  const [
    { stdout },
    {
      packageJson: { version },
    },
  ] = await Promise.all([runCli('', '', '--version'), readPkgUp()])

  t.is(stdout, version)
})

test('node --version | CLI runCli', async t => {
  const { stdout } = await runCli('', TEST_VERSION, 'node --version')

  t.is(stdout, `v${TEST_VERSION}`)
})

test('node --version | CLI runCliSerial', async t => {
  const { stdout } = await runCliSerial('', TEST_VERSION, 'node --version')

  t.is(stdout, `v${TEST_VERSION}\nv${TEST_VERSION}`)
})
