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
