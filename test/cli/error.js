import test from 'ava'
import { each } from 'test-each'

import { TEST_VERSION } from '../helpers/versions.js'
import { runCli, runCliSerial, runCliParallel } from '../helpers/run.js'

each([runCli, runCliSerial, runCliParallel], ({ title }, run) => {
  test(`Print non-Execa errors on stderr | ${title}`, async t => {
    const { stderr } = await run('', TEST_VERSION, 'invalidBinary')

    t.true(stderr.includes('invalidBinary'))
  })
})

test('Does not print Execa errors on stderr | runCli', async t => {
  const { stderr } = await runCli('', TEST_VERSION, 'node -e process.exit(2)')

  t.is(stderr, '')
})

each([runCliSerial, runCliParallel], ({ title }, run) => {
  test(`Prints Execa errors on stderr | ${title}`, async t => {
    const { stderr } = await run('', TEST_VERSION, 'node -e process.exit(2)')

    t.true(
      stderr.endsWith(
        `<>  Node ${TEST_VERSION}

Node ${TEST_VERSION} failed with exit code 2`,
      ),
    )
  })
})
