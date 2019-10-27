import { stdout } from 'process'

import nvexeca from '../main.js'

// When `command` is `undefined`, we only print the normalized Node.js version
export const printVersions = async function(versionRanges, args, opts) {
  // eslint-disable-next-line fp/no-loops
  for (const versionRange of versionRanges) {
    // eslint-disable-next-line no-await-in-loop
    await printVersion(versionRange, args, opts)
  }
}

export const printVersion = async function(versionRange, args, opts) {
  const { version } = await nvexeca(versionRange, '', args, {
    ...opts,
    dry: true,
  })
  stdout.write(`${version}\n`)
}
