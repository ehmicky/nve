import test from 'ava'
import hasAnsi from 'has-ansi'

import { TEST_VERSION } from '../helpers/versions.js'
import { runCliSerial } from '../helpers/run.js'

test('Prints headers | CLI runCliSerial', async t => {
  const { all } = await runCliSerial('', TEST_VERSION, 'node --version')

  t.is(
    all,
    `<>  Node ${TEST_VERSION}

v${TEST_VERSION}

 <>  Node ${TEST_VERSION}

v${TEST_VERSION}`,
  )
})

test('Prints headers in colors | CLI runCliSerial', async t => {
  const { stderr } = await runCliSerial('', TEST_VERSION, 'node --version', {
    env: { FORCE_COLOR: '1' },
  })

  t.true(hasAnsi(stderr))
})

test('Prints headers in correct order | CLI runCliSerial', async t => {
  const { all } = await runCliSerial('', TEST_VERSION, 'echo')

  t.is(
    all,
    `<>  Node ${TEST_VERSION}



 <>  Node ${TEST_VERSION}`,
  )
})
