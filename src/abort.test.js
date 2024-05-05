import test from 'ava'
import { each } from 'test-each'

import { runCli } from './helpers/run.test.js'
import { VERY_OLD_TEST_VERSION, TEST_VERSION } from './helpers/versions.test.js'

const RECENT_ARCH_OPT = ['--arch', 'arm']

each([[], ['--parallel']], ({ title }, parallelFlag) => {
  test.serial(`Node.js binary failure | ${title}`, async (t) => {
    const { stdout, stderr, exitCode } = await runCli(
      `${VERY_OLD_TEST_VERSION},${TEST_VERSION}`,
      ['node', '--version'],
      [...RECENT_ARCH_OPT, ...parallelFlag],
    )

    t.is(stdout, '')
    t.is(exitCode, 1)
    t.true(stderr.includes('No Node.js binaries available'))
  })
})
