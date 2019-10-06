// Ignore this file, this is only needed for internal purposes.
// We mock `require()` so that examples look the same as if the library was
// directly installed.

'use strict'

const Module = require('module')

const { name } = require('../package.json')

const originalRequire = Module.prototype.require

// eslint-disable-next-line fp/no-mutation, func-names
Module.prototype.require = function(moduleName, ...args) {
  const moduleNameA = getMockedName(moduleName)
  // eslint-disable-next-line fp/no-this
  return originalRequire.call(this, moduleNameA, ...args)
}

const getMockedName = function(moduleName) {
  if (moduleName !== name && !moduleName.startsWith(`${name}/`)) {
    return moduleName
  }

  return moduleName.replace(name, `${__dirname}/..`)
}
