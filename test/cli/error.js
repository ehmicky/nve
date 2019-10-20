import test from 'ava'
import { each } from 'test-each'

import { TEST_VERSION } from '../helpers/versions.js'
import { runCli, runCliSerial } from '../helpers/run.js'

each([runCli, runCliSerial], ({ title }, run) => {
  test(`Print non-Execa errors on stderr | ${title}`, async t => {
    const { stderr } = await run('', TEST_VERSION, 'invalidBinary')

    t.true(stderr.includes('invalidBinary'))
  })
})

test('Does not print Execa errors on stderr | runCli', async t => {
  const { stderr } = await runCli('', TEST_VERSION, 'node -e process.exit(2)')

  t.is(stderr, '')
})

test('Prints Execa errors on stderr | runCliSerial', async t => {
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
