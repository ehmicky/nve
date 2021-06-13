import { stderr } from 'process'

import chalk from 'chalk'
import { nodejs } from 'figures'

export const printVersionHeader = function (versionRange) {
  const header = chalk.green(`\n ${nodejs}  Node ${versionRange}\n\n`)
  stderr.write(header)
}
