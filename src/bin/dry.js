// When `command` is `undefined`, we only print the normalized Node.js version
export const printVersions = async function(iterable) {
  // eslint-disable-next-line fp/no-loops
  for await (const { version } of iterable) {
    printVersion(version)
  }
}

export const printVersion = function(version) {
  console.log(version)
}
