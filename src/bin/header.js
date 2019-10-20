import { stderr } from 'process'

import { green } from 'chalk'
import { nodejs } from 'figures'

// When running multiple versions, we prepend a header showing the Node version
export const printHeader = function({
  versionRanges,
  state,
  state: { index },
}) {
  if (index === versionRanges.length) {
    return
  }

  const versionRange = versionRanges[index]
  const header = green(`\n ${nodejs}  Node ${versionRange}\n\n`)
  stderr.write(header)

  // eslint-disable-next-line fp/no-mutation, no-param-reassign
  state.index = index + 1
}
