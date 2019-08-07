import { maxSatisfying } from 'semver'

import { getCachedVersions, cacheVersions, VERSIONS_CACHE } from './cache.js'
import { cleanupOnError } from './cleanup.js'
import { fetchUrl } from './fetch.js'

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

  const versions = await fetchVersions()

  await cleanupOnError(() => cacheVersions(versions), VERSIONS_CACHE)

  return versions
}

// Fetch all available Node versions by making a HTTP request to Node website
// Versions are already sorted from newest to oldest
const fetchVersions = async function() {
  const response = await fetchUrl(INDEX_URL)
  const index = await response.json()
  const versions = index.map(getVersionField)
  return versions
}

const INDEX_URL = 'https://nodejs.org/dist/index.json'

const getVersionField = function({ version }) {
  // Remove the leading `v`
  return version.slice(1)
}
