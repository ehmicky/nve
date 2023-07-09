// In parallel runs, when one child process fails, the others are terminated
// by sending SIGTERM to them.
// We only trigger the termination logic on the first child process that failed.
// Also this does not apply when --continue is used.
export const cleanupProcesses = async (versions, continueOpt, state) => {
  await Promise.all(
    versions.map(({ childProcess, version }, index) =>
      cleanupProcess({
        childProcess,
        version,
        versions,
        state,
        continueOpt,
        index,
      }),
    ),
  )
}

const cleanupProcess = async ({
  childProcess,
  version,
  versions,
  state,
  continueOpt,
  index,
}) => {
  try {
    await childProcess
  } catch (error) {
    terminateProcesses({ error, versions, version, state, continueOpt, index })
  }
}

const terminateProcesses = ({
  error,
  versions,
  version,
  state,
  continueOpt,
  index,
}) => {
  // We check the `continueOpt` after doing `await childProcess` so that later
  // failed child processes do not emit a `rejectionHandled` error when using
  // `--continue`
  if (state.failedError !== undefined || continueOpt) {
    return
  }

  // Remember which child process failed so that we can print it later
  // eslint-disable-next-line fp/no-mutating-assign
  Object.assign(state, {
    failedError: error,
    failedVersion: version,
    failedIndex: index,
  })

  versions.forEach(terminateProcess)
}

const terminateProcess = ({ childProcess }) => {
  childProcess.kill()
}
