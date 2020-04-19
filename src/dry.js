import { stdout } from 'process'

import nodeVersionAlias from 'node-version-alias'

// When `command` is `undefined`, we only print the normalized Node.js version
export const printVersions = async function (versionRanges, opts) {
  const versions = await Promise.all(
    versionRanges.map((versionRange) => getVersion(versionRange, opts)),
  )
  versions.forEach(writeVersion)
}

export const printVersion = async function (versionRange, opts) {
  const version = await getVersion(versionRange, opts)
  writeVersion(version)
}

// We use `cache: false` so that any new Node.js release is shown right away.
// This is because dry-mode is meant to show available Node.js versions.
// However non-dry mode uses cache, i.e. new Node.js releases might take up to
// one hour to be used.
const getVersion = function (versionRange, { mirror }) {
  return nodeVersionAlias(versionRange, { fetch: true, mirror })
}

const writeVersion = function (version) {
  stdout.write(`${version}\n`)
}
