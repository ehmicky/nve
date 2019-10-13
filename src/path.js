import npmRunPath from 'npm-run-path'
import filterObj from 'filter-obj'

// Fix `$PATH` so that `node` points to the right version.
// We do this instead of directly calling `node` so that:
//  - child processes use the same Node.js version
//  - binaries work, even on Windows
// We use `npm-run-path`, which means `preferLocal` is always `true` under the
// hood.
export const fixPath = function({
  nodePath,
  spawnOptions,
  spawnOptions: { env, cwd },
}) {
  const npmRunPathOpts = filterObj({ env, cwd, execPath: nodePath }, isDefined)
  const envA = npmRunPath.env(npmRunPathOpts)
  return { ...spawnOptions, env: envA, preferLocal: false }
}

const isDefined = function(key, value) {
  return value !== undefined
}
