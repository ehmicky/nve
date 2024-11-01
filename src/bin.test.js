import test from 'ava'
import semver from 'semver'
import { each } from 'test-each'

import { printVersionArgs } from './helpers/args.test.js'
import { runCli, runParallel, runSerial } from './helpers/run.test.js'
import {
  GLOBAL_VERSION,
  LATEST_STAR_VERSION,
  LATEST_VERSION,
  LOCAL_VERSION,
  LTS_VERSION,
  TEST_VERSION,
} from './helpers/versions.test.js'

const FIXTURES_DIR = new URL('fixtures/', import.meta.url)

each([runCli, runSerial, runParallel], ({ title }, run) => {
  test(`Forward exit code on success | ${title}`, async (t) => {
    const { exitCode } = await run(TEST_VERSION, printVersionArgs)

    t.is(exitCode, 0)
  })

  test(`Forward exit code on failure | ${title}`, async (t) => {
    const { exitCode } = await run(TEST_VERSION, [
      'node',
      '-e',
      'process.exit(2)',
    ])

    t.is(exitCode, 2)
  })

  test(`Default exit code to 1 | ${title}`, async (t) => {
    const { exitCode } = await run(TEST_VERSION, [
      'node',
      '-e',
      'process.kill(process.pid)',
    ])

    t.is(exitCode, 1)
  })
})

// Download too many Node.js binaries at once makes nodejs.org/dist either
// drop the connection or make it hang forever. Since those tests use different
// versions, we make sure they are only called once and not inside `test-each`.
test('Can use "latest" alias', async (t) => {
  const [{ stdout }, { stdout: stdoutA }] = await Promise.all([
    runCli(LATEST_VERSION, printVersionArgs),
    runCli(LATEST_STAR_VERSION, printVersionArgs),
  ])
  t.is(stdout, stdoutA)
})

test('Can use "lts" alias', async (t) => {
  const { stdout } = await runCli(LTS_VERSION, printVersionArgs)
  t.is(`v${semver.clean(stdout)}`, stdout)
})

test('Can use "global" alias', async (t) => {
  const { stdout } = await runCli(GLOBAL_VERSION, printVersionArgs)
  t.is(`v${semver.clean(stdout)}`, stdout)
})

test('Can use "local" alias', async (t) => {
  const { stdout } = await runCli(LOCAL_VERSION, printVersionArgs, [], {
    cwd: new URL('nvmrc', FIXTURES_DIR),
  })
  t.true(stdout.includes(TEST_VERSION))
})

test('Can use a version file path', async (t) => {
  const { stdout } = await runCli('nvmrc/.nvmrc', printVersionArgs, [], {
    cwd: FIXTURES_DIR,
  })
  t.true(stdout.includes(TEST_VERSION))
})
