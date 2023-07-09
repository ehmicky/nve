import process from 'node:process'

export const getAbortOptions = (opts) => {
  const controller = new AbortController()
  const optsA = { ...opts, signal: controller.signal }
  return { controller, opts: optsA }
}

// When any Node.js download fails, cancel the others.
// This is unlike command failures, where other commands might keep running.
// This ensures the progress bar are cleared and the error message is printed
// correctly.
export const cancelOnError = async (promises, controller) => {
  try {
    return await Promise.all(promises)
  } catch (error) {
    process.on('uncaughtException', noop)
    controller.abort()
    throw error
  }
}

// `got` throws an uncaught exception on `signal` abort
// eslint-disable-next-line no-empty-function
const noop = () => {}
