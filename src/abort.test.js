import test from 'ava'
import { each } from 'test-each'

import { printVersionArgs } from './helpers/args.test.js'
import { runCli } from './helpers/run.test.js'
import { TEST_VERSION, VERY_OLD_TEST_VERSION } from './helpers/versions.test.js'

const RECENT_ARCH_OPT = ['--arch', 'arm']

each([[], ['--parallel']], ({ title }, parallelFlag) => {
  test.serial(`Node.js binary failure | ${title}`, async (t) => {
    const { stdout, stderr, exitCode } = await runCli(
      `${VERY_OLD_TEST_VERSION},${TEST_VERSION}`,
      printVersionArgs,
      [...RECENT_ARCH_OPT, ...parallelFlag],
    )

    t.is(stdout, '')
    t.is(exitCode, 1)
    t.true(stderr.includes('No Node.js binaries available'))
  })
})
