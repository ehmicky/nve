# 3.0.0

## Breaking changes

- `nve VERSION` must now be followed by `node`. For example `nve 8` should now
  be `nve 8 node` and `nve 8 file.js` should be `nve 8 node file.js`.
- If you use use `nve` from
  [Node.js/programmatically](https://github.com/ehmicky/nve#api-nodejs), the
  return value is now `childProcess` instead of `{ promise, childProcess }`.

## Features

- Binaries can now be executed such as `nve 8 npm test`. Keep in mind that the
  binary must be compatible with the chosen Node.js version. For example `npm`
  is only compatible with Node `>=6`.
- If the script spawn child processes, those will now re-use the same Node.js
  version.
- Add `--help` and `--version` CLI flags.

# 2.2.3

## Internal

- Internal changes

# 2.2.2

## Bugs

- Improve error messages

# 2.2.1

## Bugs

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

## Bugs

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
