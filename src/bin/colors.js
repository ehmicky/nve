import { stdout, env } from 'process'
import { WriteStream } from 'tty'

const {
  prototype: { getColorDepth },
} = WriteStream

// When running child processes in parallel, stdout cannot be the interactive
// TTY since it needs to be buffered so we print each child process output in
// order. However colors usually depends on `stdout.isTTY`.
// We fix this by setting the `FORCE_COLOR` environment variable instead, which
// is used for example by `stdout.hasColors()` and `chalk`.
export const getColorOptions = function() {
  if (!isInteractiveOutput()) {
    return {}
  }

  // TODO: remove after dropping support for Node 8/9
  if (getColorDepth === undefined) {
    return {}
  }

  const colorDepth = getColorDepth()

  // No need to do this change since current process already cannot show colors
  if (colorDepth === 1) {
    return {}
  }

  const forceColor = COLOR_DEPTH_TO_FORCE[colorDepth]
  return { env: { FORCE_COLOR: forceColor } }
}

// We need to use an environment variable in tests since automated tests
// cannot use an interactive TTY
const isInteractiveOutput = function() {
  return stdout.isTTY || env.TEST_TTY === 'true'
}

const COLOR_DEPTH_TO_FORCE = { '1': '0', '4': '1', '8': '2', '24': '3' }
