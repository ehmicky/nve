import allNodeVersions from 'all-node-versions'
import { maxSatisfying } from 'semver'

import { getCachedVersions, cacheVersions, VERSIONS_CACHE } from './cache.js'
import { cleanupOnError } from './cleanup.js'

// Retrieve the Node version matching a specific `versionRange`
export const getVersion = async function(versionRange) {
  const versions = await getVersions(versionRange)

  const version = maxSatisfying(versions, versionRange)

  if (version === null) {
    throw new Error(`Invalid Node version: ${versionRange}`)
  }

  return version
}

// Retrieve all available Node versions
const getVersions = async function(versionRange) {
  const cachedVersions = await getCachedVersions(versionRange)

  if (cachedVersions !== undefined) {
    return cachedVersions
  }

  const versions = await allNodeVersions()

  await cleanupOnError(() => cacheVersions(versions), VERSIONS_CACHE)

  return versions
}
