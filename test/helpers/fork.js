import { execFile } from 'child_process'
import { promisify } from 'util'
import { argv } from 'process'

const pExecFile = promisify(execFile)

const forkNode = async function() {
  const [command, ...args] = argv.slice(2)
  const { stdout } = await pExecFile(command, args)
  // eslint-disable-next-line no-restricted-globals, no-console
  console.log(stdout)
}

forkNode()
