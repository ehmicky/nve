import { platform, arch } from 'process'
import { createGunzip } from 'zlib'
import { createWriteStream } from 'fs'

import { extract as tarExtract } from 'tar-fs'
import pEvent from 'p-event'

import { fetchUrl } from './fetch.js'

// Retrieve the Node binary from the Node website and persist it
// The URL depends on the current OS and CPU architecture
export const downloadNode = function(version, outputDir, nodePath) {
  if (platform === 'win32') {
    return downloadWindowsNode(version, nodePath)
  }

  return downloadUnixNode(version, outputDir)
}

// The Windows Node binary comes as a regular file
const downloadWindowsNode = async function(version, nodePath) {
  const { body } = await fetchUrl(
    `${URL_BASE}/v${version}/win-${arch}/${NODE_FILENAME}`,
  )

  const writeStream = createWriteStream(nodePath, { mode: NODE_MODE })
  body.pipe(writeStream)
  await pEvent(writeStream, 'finish')
}

const NODE_MODE = 0o755

// The Unix Node binary comes in a tar.gz folder
const downloadUnixNode = async function(version, outputDir) {
  const { body } = await fetchUrl(
    `${URL_BASE}/v${version}/node-v${version}-${platform}-${arch}.tar.gz`,
  )

  const archive = body.pipe(createGunzip())
  await unarchive(archive, outputDir)
}

const URL_BASE = 'https://nodejs.org/dist'

const unarchive = async function(archive, outputDir) {
  const extract = tarExtract(outputDir, { ignore: shouldExclude, strip: 2 })
  archive.pipe(extract)
  await pEvent(extract, 'finish')
}

// As a performance optimization, we only unpack the node binary, not the other
// files.
const shouldExclude = function(path) {
  return !path.endsWith(`/${NODE_FILENAME}`)
}

export const NODE_FILENAME = platform === 'win32' ? 'node.exe' : 'node'
