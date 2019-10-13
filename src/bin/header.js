import { stderr, platform } from 'process'

import { green } from 'chalk'

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
  const header = green(`\n ${HEXAGON}  Node ${versionRange}\n\n`)
  stderr.write(header)

  // eslint-disable-next-line fp/no-mutation, no-param-reassign
  state.index = index + 1
}

// TODO: replace with `figures.nodejs` once
// https://github.com/sindresorhus/figures/pull/29 is merged
const HEXAGON = platform === 'win32' ? '\u2666' : '\u2B22'
