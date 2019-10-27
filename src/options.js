import { validate } from 'jest-validate'
import filterObj from 'filter-obj'
import isPlainObj from 'is-plain-obj'

import { validateBasic } from './validate.js'

// Validate input parameters and assign default values.
export const getOpts = function({ versionRange, command, args, opts }) {
  const { args: argsA, opts: optsA } = parseBasic({ args, opts })

  validateBasic({ versionRange, command, args: argsA, opts: optsA })
  validate(optsA, {
    exampleConfig: EXAMPLE_OPTS,
    recursiveBlacklist: ['spawnOptions'],
  })

  const optsB = filterObj(optsA, isDefined)
  const optsC = {
    ...DEFAULT_OPTS,
    ...optsB,
    spawnOptions: { ...DEFAULT_OPTS.spawnOptions, ...optsB.spawnOptions },
  }
  return { args: argsA, opts: optsC }
}

// `args` and `opts` are both optional
const parseBasic = function({
  args: oArgs,
  opts: oOpts,
  args = [],
  opts = {},
}) {
  if (oOpts === undefined && isPlainObj(oArgs)) {
    return { args: [], opts: oArgs }
  }

  return { args, opts }
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
