import { validate } from 'jest-validate'
import filterObj from 'filter-obj'
import isPlainObj from 'is-plain-obj'

import { validateBasic } from './validate.js'

// Validate input parameters and assign default values.
export const getOpts = function({ versionRange, command, args, opts }) {
  const { args: argsA, opts: optsA } = parseBasic({ args, opts })

  validateBasic({ versionRange, command, args: argsA, opts: optsA })

  const { dry, progress, mirror, ...execaOptions } = optsA
  const optsB = { dry, progress, mirror }

  validate(optsB, { exampleConfig: EXAMPLE_OPTS })

  const optsC = filterObj(optsB, isDefined)
  const optsD = { ...DEFAULT_OPTS, ...optsC }
  return { args: argsA, opts: optsD, execaOptions }
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
  progress: false,
  dry: false,
}

const EXAMPLE_OPTS = {
  ...DEFAULT_OPTS,
  mirror: 'https://nodejs.org/dist',
}
