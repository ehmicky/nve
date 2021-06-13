import { fileURLToPath } from 'url'

import test from 'ava'
import semver from 'semver'
import { each } from 'test-each'

import { runCli, runSerial, runParallel } from './helpers/run.js'
import {
  TEST_VERSION,
  LATEST_STAR_VERSION,
  LATEST_VERSION,
  LTS_VERSION,
  GLOBAL_VERSION,
  LOCAL_VERSION,
} from './helpers/versions.js'

const FIXTURES_DIR = fileURLToPath(
  new URL('./helpers/fixtures', import.meta.url),
)

each([runCli, runSerial, runParallel], ({ title }, run) => {
  test(`Forward exit code on success | ${title}`, async (t) => {
    const { exitCode } = await run('', TEST_VERSION, 'node --version')

    t.is(exitCode, 0)
  })

  test(`Forward exit code on failure | ${title}`, async (t) => {
    const { exitCode } = await run('', TEST_VERSION, 'node -e process.exit(2)')

    t.is(exitCode, 2)
  })

  test(`Default exit code to 1 | ${title}`, async (t) => {
    const { exitCode } = await run(
      '',
      TEST_VERSION,
      'node -e process.kill(process.pid)',
    )

    t.is(exitCode, 1)
  })
})

// Download too many Node.js binaries at once makes nodejs.org/dist either
// drop the connection or make it hang forever. Since those tests use different
// versions, we make sure they are only called once and not inside `test-each`.
test('Can use "latest" alias', async (t) => {
  const [{ stdout }, { stdout: stdoutA }] = await Promise.all([
    runCli('', LATEST_VERSION, 'node --version'),
    runCli('', LATEST_STAR_VERSION, 'node --version'),
  ])
  t.is(stdout, stdoutA)
})

test('Can use "lts" alias', async (t) => {
  const { stdout } = await runCli('', LTS_VERSION, 'node --version')
  t.is(`v${semver.clean(stdout)}`, stdout)
})

test('Can use "global" alias', async (t) => {
  const { stdout } = await runCli('', GLOBAL_VERSION, 'node --version')
  t.is(`v${semver.clean(stdout)}`, stdout)
})

test('Can use "local" alias', async (t) => {
  const { stdout } = await runCli('', LOCAL_VERSION, 'node --version', {
    cwd: `${FIXTURES_DIR}/nvmrc`,
  })
  t.true(stdout.includes(TEST_VERSION))
})
