import test from 'ava'
import hasAnsi from 'has-ansi'
import { each } from 'test-each'

import { printVersionArgs } from './helpers/args.test.js'
import { runSerial, runParallel } from './helpers/run.test.js'
import { TEST_VERSION } from './helpers/versions.test.js'

each([runSerial, runParallel], ({ title }, run) => {
  test(`Prints headers | ${title}`, async (t) => {
    const { stdout, stderr } = await run(TEST_VERSION, printVersionArgs)

    t.is(
      stdout,
      `v${TEST_VERSION}
v${TEST_VERSION}`,
    )
    t.is(
      stderr,
      `<>  Node ${TEST_VERSION}


 <>  Node ${TEST_VERSION}`,
    )
  })

  test(`Prints headers in correct order with fast commands | ${title}`, async (t) => {
    const { stdout, stderr } = await run(TEST_VERSION, ['echo', 'test'])

    t.is(
      stdout,
      `test
test`,
    )
    t.is(
      stderr,
      `<>  Node ${TEST_VERSION}


 <>  Node ${TEST_VERSION}`,
    )
  })

  test(`Prints headers in colors | ${title}`, async (t) => {
    const { stderr } = await run(TEST_VERSION, printVersionArgs, [], {
      env: { FORCE_COLOR: '1' },
    })

    t.true(hasAnsi(stderr))
  })
})
