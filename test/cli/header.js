import test from 'ava'
import { each } from 'test-each'
import hasAnsi from 'has-ansi'

import { TEST_VERSION } from '../helpers/versions.js'
import { runCliSerial, runCliParallel } from '../helpers/run.js'

// When calling several `nve --parallel` in parallel, their output is sometimes
// duplicated. This is fixed by using stdout|stderr instead of `all`.
// This bug is not related to `nve` but to some bug inside `execa` `all` option
// (based on the `merge-stream` package).

each([runCliSerial, runCliParallel], ({ title }, run) => {
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
