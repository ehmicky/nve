import test from 'ava'
import { each } from 'test-each'
import hasAnsi from 'has-ansi'

import { TEST_VERSION } from '../helpers/versions.js'
import { runCliSerial, runCliParallel } from '../helpers/run.js'

// Tests in this file randomly fail (printing the same line twice in some
// child processes output) when run in parallel.
// TODO: figure out why

each([runCliSerial, runCliParallel], ({ title }, run) => {
  test.serial(`Prints headers | ${title}`, async t => {
    const { all } = await run('', TEST_VERSION, 'node --version')

    t.is(
      all,
      `<>  Node ${TEST_VERSION}

v${TEST_VERSION}

 <>  Node ${TEST_VERSION}

v${TEST_VERSION}`,
    )
  })
})

test.serial('Prints headers in colors | runCliSerial', async t => {
  const { stderr } = await runCliSerial('', TEST_VERSION, 'node --version', {
    env: { FORCE_COLOR: '1' },
  })

  t.true(hasAnsi(stderr))
})

test.serial('Prints headers in correct order | runCliSerial', async t => {
  const { all } = await runCliSerial('', TEST_VERSION, 'echo test')

  t.is(
    all,
    `<>  Node ${TEST_VERSION}

test

 <>  Node ${TEST_VERSION}

test`,
  )
})
