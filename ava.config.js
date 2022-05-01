import avaConfig from '@ehmicky/dev-tasks/ava.config.js'
import isCI from 'is-ci'

export default {
  ...avaConfig,
  // CI machines have lower limits for parallel network requests, and sometimes
  // fail, especially macOS on GitHub actions
  serial: isCI,
}
