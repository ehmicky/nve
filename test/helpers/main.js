import { getBinPath } from 'get-bin-path'
import execa from 'execa'
import getStream from 'get-stream'

import nve from '../../src/main.js'

export const TEST_VERSION = '6.0.0'
export const HELPER_VERSION = '8.16.1'

export const runCli = async function(args) {
  const binPath = await getBinPath()
  const { stdout, stderr, exitCode: code } = await execa.command(
    `${binPath} ${args}`,
    { reject: false },
  )
  return { stdout, stderr, code }
}

export const getStdout = async function(
  versionRange = TEST_VERSION,
  command = 'node',
  args = ['--version'],
) {
  const { stdout } = await nve(versionRange, command, args, {
    spawn: { stdio: 'pipe' },
  })
  const stdoutA = await getStream(stdout)
  return stdoutA.trim()
}
