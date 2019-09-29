import { getBinPath } from 'get-bin-path'
import execa from 'execa'

export const runCli = async function(args) {
  const binPath = await getBinPath()
  const { stdout, stderr, exitCode } = await execa.command(
    `${binPath} ${args}`,
    { reject: false },
  )
  return { stdout, stderr, exitCode }
}
