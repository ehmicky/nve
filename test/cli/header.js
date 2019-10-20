import { env } from 'process'

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

test.serial('Prints headers in colors | CLI runCliSerial', async t => {
  // eslint-disable-next-line fp/no-mutation
  env.FORCE_COLOR = '1'
  const { stderr } = await runCliSerial('', TEST_VERSION, 'node --version')
  // eslint-disable-next-line fp/no-delete
  delete env.FORCE_COLOR

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
