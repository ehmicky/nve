import { stdout } from 'node:process'

import nodeVersionAlias from 'node-version-alias'

import { cancelOnError } from './abort.js'

// When `command` is `undefined`, we only print the normalized Node.js version
export const printVersions = async (versionRanges, opts, controller) => {
  const versions = await cancelOnError(
    versionRanges.map((versionRange) => getVersion(versionRange, opts)),
    controller,
  )
  versions.forEach(writeVersion)
}

export const printVersion = async (versionRange, opts) => {
  const version = await getVersion(versionRange, opts)
  writeVersion(version)
}

// We default `fetch` to `true` so that any new Node.js release is shown
// right away, unless overridden by `--no-fetch`.
// This is because dry-mode is meant to show available Node.js versions.
// However non-dry mode uses cache, i.e. new Node.js releases might take up to
// one hour to be used.
const getVersion = (versionRange, { fetch: fetchOpt = true, mirror, signal }) =>
  nodeVersionAlias(versionRange, { fetch: fetchOpt, mirror, signal })

const writeVersion = (version) => {
  stdout.write(`${version}\n`)
}
