import { stdout } from 'process'

import nvexeca from 'nvexeca'

// When `command` is `undefined`, we only print the normalized Node.js version
export const printVersions = async function(versionRanges, opts) {
  const versions = await Promise.all(
    versionRanges.map(versionRange => getVersion(versionRange, opts)),
  )
  versions.forEach(writeVersion)
}

export const printVersion = async function(versionRange, opts) {
  const version = await getVersion(versionRange, opts)
  writeVersion(version)
}

const getVersion = async function(versionRange, opts) {
  const { version } = await nvexeca(versionRange, '', [], {
    ...opts,
    dry: true,
  })
  return version
}

const writeVersion = function(version) {
  stdout.write(`${version}\n`)
}
