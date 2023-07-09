import { stderr } from 'node:process'

import chalk from 'chalk'
import figures from 'figures'

export const printVersionHeader = (version) => {
  const header = chalk.green(`\n ${figures.nodejs}  Node ${version}\n\n`)
  stderr.write(header)
}
