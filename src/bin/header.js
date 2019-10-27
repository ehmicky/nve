import { stderr } from 'process'

import { green } from 'chalk'
import { nodejs } from 'figures'

export const printVersionHeader = function(versionRange) {
  const header = green(`\n ${nodejs}  Node ${versionRange}\n\n`)
  stderr.write(header)
}
