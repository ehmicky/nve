import test from 'ava'
import { clean as cleanVersion } from 'semver'
import { each } from 'test-each'

import { runCli, runSerial, runParallel } from './helpers/run.js'
import {
  TEST_VERSION,
  LATEST_VERSION,
  LTS_VERSION,
  GLOBAL_VERSION,
  LOCAL_VERSION,
} from './helpers/versions.js'

const FIXTURES_DIR = `${__dirname}/helpers/fixtures`

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

  test(`Can use "latest" alias | ${title}`, async (t) => {
    const [{ stdout }, { stdout: stdoutA }] = await Promise.all([
      run('', LATEST_VERSION, 'node --version'),
      run('', '*', 'node --version'),
    ])
    t.is(stdout, stdoutA)
  })

  test(`Can use "local" alias | ${title}`, async (t) => {
    const { stdout } = await run('', LOCAL_VERSION, 'node --version', {
      cwd: `${FIXTURES_DIR}/nvmrc`,
    })

    t.true(stdout.includes(TEST_VERSION))
  })
})

each(
  [runCli, runSerial, runParallel],
  [LTS_VERSION, GLOBAL_VERSION],
  ({ title }, run, alias) => {
    test(`Can use "lts" and "global" alias | ${title}`, async (t) => {
      const { stdout } = await run('', alias, 'node --version')
      const [version] = stdout.split('\n')
      t.is(`v${cleanVersion(version)}`, version)
    })
  },
)
