import { validate } from 'jest-validate'
import filterObj from 'filter-obj'

import { validateBasic } from './validate.js'

// Validate input parameters and assign default values.
export const getOpts = function({ versionRange, command, args, opts }) {
  validateBasic({ versionRange, command, args, opts })
  validate(opts, {
    exampleConfig: EXAMPLE_OPTS,
    recursiveBlacklist: ['spawnOptions'],
  })

  const optsA = filterObj(opts, isDefined)
  const optsB = {
    ...DEFAULT_OPTS,
    ...optsA,
    spawnOptions: { ...DEFAULT_OPTS.spawnOptions, ...optsA.spawnOptions },
  }
  return optsB
}

const isDefined = function(key, value) {
  return value !== undefined
}

const DEFAULT_OPTS = {
  spawnOptions: {},
  progress: false,
}

const EXAMPLE_OPTS = {
  ...DEFAULT_OPTS,
  spawnOptions: { stdio: 'inherit' },
  mirror: 'https://nodejs.org/dist',
}
