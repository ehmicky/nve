import { unlinkSync } from 'fs'

import onExit from 'signal-exit'
import pathExists from 'path-exists'

// If an error happens while persisting the `node` executable or
// `versions.json`, it will be corrupted so we need to remove it.
// We catch both exits like CTRL-C and exceptions thrown.
// This needs to be synchronous if it happens on exit.
export const cleanupOnError = async function(func, path) {
  const removeOnExit = onExit(() => cleanup(path))

  try {
    await func()
  } catch (error) {
    removeOnExit()
    cleanup(path)
    throw error
  }

  removeOnExit()
}

const cleanup = function(path) {
  if (!pathExists.sync(path)) {
    return
  }

  unlinkSync(path)
}
