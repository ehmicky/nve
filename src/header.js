import { stderr } from 'node:process'

import chalk from 'chalk'
import figures from 'figures'

export const printVersionHeader = (versionRange) => {
  const header = chalk.green(`\n ${figures.nodejs}  Node ${versionRange}\n\n`)
  stderr.write(header)
}
