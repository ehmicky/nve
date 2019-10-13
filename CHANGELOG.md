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
