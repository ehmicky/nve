import test from 'ava'
import { each } from 'test-each'

import { TEST_VERSION } from '../helpers/versions.js'
import { runCli, runCliSerial } from '../helpers/run.js'

each(
  [['', ''], [TEST_VERSION, 'invalid_binary'], ['invalid_version', 'node']],
  [runCli, runCliSerial],
  ({ title }, [versionRange, command], run) => {
    test(`Invalid arguments | CLI ${title}`, async t => {
      const { exitCode, stderr } = await run('', versionRange, command)

      t.not(exitCode, 0)
      t.true(stderr !== '')
    })
  },
)
