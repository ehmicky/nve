// In parallel runs, when one child process fails, the others are terminated
// by sending SIGTERM to them.
// We only trigger the termination logic on the first child process that failed.
// Also this does not apply when --continue is used.
export const cleanupProcesses = async function(versions, continueOpt, state) {
  await Promise.all(
    versions.map(({ childProcess, versionRange }) =>
      cleanupProcess({
        childProcess,
        versionRange,
        versions,
        state,
        continueOpt,
      }),
    ),
  )
}

const cleanupProcess = async function({
  childProcess,
  versionRange,
  versions,
  state,
  continueOpt,
}) {
  try {
    await childProcess
  } catch (error) {
    terminateProcesses({ error, versions, versionRange, state, continueOpt })
  }
}

const terminateProcesses = function({
  error,
  versions,
  versionRange,
  state,
  continueOpt,
}) {
  // We check the `continueOpt` after doing `await childProcess` so that later
  // failed child processes do not emit a `rejectionHandled` error when using
  // `--continue`
  if (state.failedError !== undefined || continueOpt) {
    return
  }

  // Remember which child process failed so that we can print it later
  // eslint-disable-next-line fp/no-mutation, no-param-reassign
  state.failedError = error
  // eslint-disable-next-line fp/no-mutation, no-param-reassign
  state.failedVersionRange = versionRange

  versions.forEach(terminateProcess)
}

const terminateProcess = function({ childProcess }) {
  childProcess.kill()
}
