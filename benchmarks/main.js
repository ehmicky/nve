import { execFile } from 'child_process'
import { promisify } from 'util'

import { getBinPathSync } from 'get-bin-path'

const NVE_PATH = getBinPathSync()

const pExecFile = promisify(execFile)

const VERSION = '6.0.0'

// This must be substracted from the time taken by any of the following tasks
export const nodeVersion = {
  title: 'node --version',
  async main() {
    await pExecFile('node', ['--version'])
  },
}

// This must be substracted from the time taken by nvm
export const bash = async function() {
  await pExecFile('bash', ['-i', '-c', ''])
}

export const nve = async function() {
  await pExecFile(NVE_PATH, [VERSION, '--version'])
}

export const nvm = async function() {
  await pExecFile('bash', ['-i', '-c', `nvm run ${VERSION} --version`])
}

export const npx = {
  title: 'npx -r node',
  async main() {
    await pExecFile('npx', [`node@${VERSION}`, '--version'])
  },
}
