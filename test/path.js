import { env as processEnv } from 'process'

import test from 'ava'
import getStream from 'get-stream'
import { each } from 'test-each'
import { getBinPathSync } from 'get-bin-path'

import nve from '../src/main.js'

import { HELPER_VERSION } from './helpers/main.js'

const FORK_FILE = `${__dirname}/helpers/fork.js`

each(
  [
    ['node', '--version'],
    ['node', FORK_FILE, 'node', '--version'],
    ['node', getBinPathSync(), HELPER_VERSION, 'node', '--version'],
  ],
  [undefined, { title: 'env', env: processEnv }],
  ({ title }, args, opts) => {
    test(`Works with child processes | ${title}`, async t => {
      const childProcess = await nve(
        HELPER_VERSION,
        'node',
        [FORK_FILE, ...args],
        { stdio: 'pipe', ...opts },
      )
      const stdout = await getStream(childProcess.stdout)
      const version = stdout.trim().replace(LEADING_V_REGEXP, '')

      t.is(version, HELPER_VERSION)
    })
  },
)

const LEADING_V_REGEXP = /^v/u
