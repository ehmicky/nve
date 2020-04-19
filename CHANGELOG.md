# 11.0.0

## Breaking changes

- Aliases `c` and `current` renamed to `now`
- The [alias `now`](/README.md#usage) now takes into account `package.json`
  `engines.node` field and
  [additional files](https://github.com/ehmicky/preferred-node-version/blob/master/README.md)
  used by other Node.js version managers.
- Alias `l` removed: please use `latest` instead

## Features

- Added [alias `lts`](/README.md#usage) to target the latest LTS version

# 10.0.1

## Bug fixes

- Fix aliases shortcuts `l` and `c`

# 10.0.0

## Breaking changes

- Rename `*` alias to [`latest` or `l`](/README.md#usage)
- Rename `.` alias to [`current` or `c`](/README.md#usage)
- Remove `_` alias

# 9.3.1

## Bug fixes

- Fix warning message printed when running some commands

# 9.3.0

## Features

- Add [`fetch` CLI flag](/README.md#--fetch) to control caching

## Bug fixes

- Checksum checks were not working when the `mirror` option was used

# 9.2.0

## Features

- Can use the `_` alias to refer to the
  [current process's Node.js version](/README.md#usage): `nve _ npm test`
- Can use the `.` alias to refer to the
  [current project's Node.js version](/README.md#usage) using its `.nvmrc`,
  `.node-version` or `.naverc`: `nve . npm test`

# 9.1.2

## Bug fixes

- Fix terminal color changing on Windows

# 9.1.1

## Bug fixes

- Fix
  [`arch` option](https://github.com/ehmicky/nve/blob/master/README.md#--arch)

# 9.1.0

## Features

- Add
  [`arch` option](https://github.com/ehmicky/nve/blob/master/README.md#--arch)
  to specify the CPU architecture.

# 9.0.0

## Breaking changes

- Minimal supported Node.js version is now `10.17.0`

# 8.3.0

## Features

- Node.js binary download is now 50% faster on Windows

## Bug fixes

- Fix crash when Node.js binary URL is invalid

# 8.2.0

## Features

- Node.js binary download is now twice faster on Windows

## Bug fixes

- Fix ARM, PowerPC, S390 support

# 8.1.0

## Features

- Warn when a new version is available

# 8.0.3

## Bug fixes

- Fix running `npm` or `npx` binaries on Windows

# 8.0.2

## Bug fixes

- Fix global binaries
  [not working on Windows](https://github.com/ehmicky/nve/issues/14)

# 8.0.1

## Bug fixes

- Fix executing binaries by specifying their file paths on Windows

# 8.0.0

## Breaking changes

- Remove the `--shell` CLI flag. Since `nve` already runs in a shell, this flag
  is not needed. Shell-specific features (such as variables, globbing, etc.)
  work as expected since those are performed before `nve` is called.

# 7.3.1

## Bug fixes

- Fix executing `yarn`.

# 7.3.0

## Features

- Improve the internal directory structure used to cache the Node.js binary
- Cleanup temporary files when Node.js download fails

## Bug fixes

- Executing `npm`, `yarn` and `pnpm` was not working properly, for example when
  doing global installs (`npm i -g ...`).

# 7.2.0

## Features

- Improve the appearance of the progress bar

# 7.1.0

## Features

- Ensure Node.js binaries are not corrupted by checking their
  [checksums](https://github.com/nodejs/node#verifying-binaries)
- Use cache when offline (no network connection)

# 7.0.0

## Breaking changes

- When `nve` is run without any command, it prints the available Node.js
  version. If you also want to cache the initial Node.js binary download, you
  must now use `nve VERSION node --version` instead of `nve VERSION`.

## Features

- Make Node.js binary download twice faster on Linux and MacOS
- Improve error messages

# 6.1.2

## Dependencies

- Reduce the number of dependencies

# 6.1.1

## Dependencies

- Reduce the number of dependencies

# 6.1.0

## Dependencies

- Upgrade `nvexeca` to `1.1.0`

# 6.0.0

## Breaking changes

- The programmatic API has been moved to a separate repository and npm package
  [`nvexeca`](https://github.com/ehmicky/nvexeca) with fewer dependencies.

# 5.0.0

## Breaking changes

- The programmatic API has been updated. Please refer to its new
  [documentation](https://github.com/ehmicky/nve/blob/fb764f9c205c0b92c594d406b28386561aec019d/README.md#programmatic).

## Features

- Use a progress bar instead of a spinner with the
  [`progress` CLI flag](https://github.com/ehmicky/nve/blob/fb764f9c205c0b92c594d406b28386561aec019d/README.md#--progress).

# 4.0.1

## Internal

- Internal changes

# 4.0.0

## Features

- To perform a dry run programatically, `command: undefined` cannot be used with
  [`runVersion()`](https://github.com/ehmicky/nve/blob/fb764f9c205c0b92c594d406b28386561aec019d/README.md#runversionversionrange-command-args-options)
  or
  [`runVersions`](https://github.com/ehmicky/nve/blob/fb764f9c205c0b92c594d406b28386561aec019d/README.md#runversionsversionranges-command-args-options).
  A new method
  [`dryRunVersion()`](https://github.com/ehmicky/nve/blob/fb764f9c205c0b92c594d406b28386561aec019d/README.md#dryrunversionversionrange-command-args-options)
  should be used instead.

# 3.6.0

## Features

- Add the
  [`--parallel` CLI flag](https://github.com/ehmicky/nve/blob/8dcfbfc68180fcf56ab4af70893b81346de07f0b/README.md#--parallel).
  This allows running multiple Node versions in parallel (at the same time)
  which is faster.
- Improve error messages

# 3.5.0

## Features

- Add the
  [`--continue` CLI flag](https://github.com/ehmicky/nve/blob/336d50edd7fd5f35c5c15f9b8da9f56d8ce748a9/README.md#--continue).
  By default, when running multiple Node versions and one of those versions
  fails, the others are aborted. This flag disables this.

# 3.4.0

## Features

- Show percentage instead of number of megabytes in spinner

# 3.3.0

## Features

- Allow running
  [multiple versions at once](https://github.com/ehmicky/nve/blob/9441a69a0539caf5245f2b9e67c8031b70b5c5c2/README.md#examples-multiple-versions).
  For example `nve 12 10 8 npm test` will run tests on Node 8, 10 and 12.
- Running multiple versions can also be done programmatically using
  [`runVersions()`](https://github.com/ehmicky/nve/blob/9441a69a0539caf5245f2b9e67c8031b70b5c5c2/README.md#runversionsversionranges-command-args-options)
- Improve error messages

# 3.2.2

## Bug fixes

- Fix missing dependency

# 3.2.1

## Dependencies

- Remove `npm-run-path` and `filter-obj` as direct production dependencies

# 3.2.0

## Features

- Improve speed

# 3.1.4

## Dependencies

- Remove `path-key` as a direct production dependency

# 3.1.3

## Dependencies

- [Upgrade `execa`](https://github.com/sindresorhus/execa/releases/tag/v3.0.0)

# 3.1.2

## Internal

- Internal changes

# 3.1.1

## Bug fixes

- Make the
  [`progress` option](https://github.com/ehmicky/nve/blob/master/README.md#progress)
  default to `false` programmatically.

# 3.1.0

## Features

- It is now possible to
  [omit the `command`](https://github.com/ehmicky/nve/blob/master/README.md#cli).
  For example `nve 8` instead of `nve 8 npm test`. This can be used to cache the
  Node.js binary download without executing any command.

# 3.0.0

## Breaking changes

- `nve VERSION` must now
  [be followed by `node`](https://github.com/ehmicky/nve/blob/master/README.md#examples).
  For example `nve 8` should now be `nve 8 node` and `nve 8 file.js` should be
  `nve 8 node file.js`.
- The `NVE_PROGRESS` environment variable has been removed. The
  [`--no-progress` option](https://github.com/ehmicky/nve/blob/master/README.md#--progress)
  should be used instead.
- The programmatic usage has changed: please see the new
  [API](https://github.com/ehmicky/nve/blob/master/README.md#programmatic)

## Features

- Global binaries can now be executed such as `nve 8 npm test`. Keep in mind
  that the binary must be compatible with the chosen Node.js version. For
  example `npm` is only compatible with Node `>=6`.
- Local binaries can be executed as well
- Add the
  [`--shell` option](https://github.com/ehmicky/nve/blob/master/README.md#--shell)
  to run a command inside a shell
- Add the
  [`--mirror` option](https://github.com/ehmicky/nve/blob/master/README.md#--mirror)
  to change the base URL to retrieve Node.js binaries
- Add the `--help` and `--version` CLI flags
- [Execa](https://github.com/sindresorhus/execa) is now used under the hood
  which provides with additional
  [features](https://github.com/sindresorhus/execa#why) and
  [options](https://github.com/sindresorhus/execa#options) when run
  programmatically

## Bug fixes

- If the script spawns child processes, those will now use the correct Node.js
  version
- Ensure `nve` does not exit until `stdout` and `stderr` have been flushed

# 2.2.3

## Internal

- Internal changes

# 2.2.2

## Bug fixes

- Improve error messages

# 2.2.1

## Bug fixes

- Fix `CTRL-C` not working

# 2.2.0

## Features

- Improve progress messages on console

# 2.1.0

## Features

- Improve progress messages on console
- Add alternative names for `NODE_MIRROR`: `NVM_NODEJS_ORG_MIRROR`,
  `N_NODE_MIRROR` and `NODIST_NODE_MIRROR`

# 2.0.1

## Bug fixes

- Fix cache invalidation bug

# 2.0.0

## Features

- `nve` can now be accessed from
  [Node.js/programmatically](https://github.com/ehmicky/nve#api-nodejs).

# 1.3.0

## Features

- Retry downloading the Node.js binaries on network errors.

# 1.2.2

## Internal

- Internal changes

# 1.2.1

## Features

- Spinner can now be disabled with the environment variable `NVE_PROGRESS=0`

# 1.2.0

## Features

- A spinner is now shown when a new Node.js version is downloading

# 1.1.5

## Bug fixes

- Fix `EXDEV` error thrown when temporary directory uses a different partition
  (https://github.com/ehmicky/get-node/issues/1)
