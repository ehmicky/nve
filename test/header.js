import test from 'ava'
import { each } from 'test-each'
import hasAnsi from 'has-ansi'

import { TEST_VERSION } from './helpers/versions.js'
import { runSerial, runParallel } from './helpers/run.js'

each([runSerial, runParallel], ({ title }, run) => {
  test(`Prints headers | ${title}`, async t => {
    const { stdout, stderr } = await run('', TEST_VERSION, 'node --version')

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

  test(`Prints headers in correct order with fast commands | ${title}`, async t => {
    const { stdout, stderr } = await run('', TEST_VERSION, 'echo test')

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

  test(`Prints headers in colors | ${title}`, async t => {
    const { stderr } = await run('', TEST_VERSION, 'node --version', {
      env: { FORCE_COLOR: '1' },
    })

    t.true(hasAnsi(stderr))
  })
})
