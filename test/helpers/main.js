import { getBinPath } from 'get-bin-path'
import execa from 'execa'

export const TEST_VERSION = '6.0.0'

export const runCli = async function(
  versionRange = TEST_VERSION,
  args = '--version',
) {
  const binPath = await getBinPath()
  const { stdout, stderr, exitCode: code } = await execa.command(
    `${binPath} ${versionRange} ${args}`,
    { reject: false },
  )
  return { stdout, stderr, code }
}
