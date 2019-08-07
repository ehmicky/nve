[![Codecov](https://img.shields.io/codecov/c/github/ehmicky/nve.svg?label=tested&logo=codecov)](https://codecov.io/gh/ehmicky/nve)
[![Travis](https://img.shields.io/badge/cross-platform-4cc61e.svg?logo=travis)](https://travis-ci.org/ehmicky/nve)
[![Node](https://img.shields.io/node/v/nve.svg?logo=node.js)](https://www.npmjs.com/package/nve)
[![Gitter](https://img.shields.io/gitter/room/ehmicky/nve.svg?logo=gitter)](https://gitter.im/ehmicky/nve)
[![Twitter](https://img.shields.io/badge/%E2%80%8B-twitter-4cc61e.svg?logo=twitter)](https://twitter.com/intent/follow?screen_name=ehmicky)
[![Medium](https://img.shields.io/badge/%E2%80%8B-medium-4cc61e.svg?logo=medium)](https://medium.com/@ehmicky)

Run a specific Node.js version.

As opposed to [`nvm`](https://github.com/nvm-sh/nvm) this:

- runs the Node.js version for a single command not for the entire shell session
- does not require each Node.js version to be installed first
- works on Windows
- does not require Bash

This is also much faster than [`nvm exec`](https://github.com/nvm-sh/nvm) and
[`npx -r node`](https://github.com/aredridel/node-bin-gen).

# Example

```bash
# Run any Node.js version
$ nve 8 file.js

$ nve 8 --print 'process.version'
v8.16.0

# Run the latest Node.js version
$ nve '*' --version
v8.16.0

# Use version range
$ nve ~8.5 --version
v8.5.0
```

# Demo

You can try this library:

- either directly [in your browser](https://repl.it/@ehmicky/nve).
- or by executing the [`examples` files](examples/README.md) in a terminal.

# Install

First make sure `node` is globally installed. While the global `node` version
must be `>=8.12.0`, the command run by `nve` can use any Node.js version.

Then:

```bash
npm install -g nve
```

# Usage (CLI)

```bash
nve VERSION ARGUMENTS...
```

`VERSION` can be any [version range](https://github.com/npm/node-semver).

A `node` of that specific `VERSION` will be called with `ARGUMENTS`:
`node ARGUMENTS...`.

# Usage (programmatic)

```js
const nve = require('nve')
const { exitCode, signal } = await nve(version, [...args])
```

# Support

If you found a bug or would like a new feature, _don't hesitate_ to
[submit an issue on GitHub](../../issues).

For other questions, feel free to
[chat with us on Gitter](https://gitter.im/ehmicky/nve).

Everyone is welcome regardless of personal background. We enforce a
[Code of conduct](CODE_OF_CONDUCT.md) in order to promote a positive and
inclusive environment.

# Contributing

This project was made with ❤️. The simplest way to give back is by starring and
sharing it online.

If the documentation is unclear or has a typo, please click on the page's `Edit`
button (pencil icon) and suggest a correction.

If you would like to help us fix a bug or add a new feature, please check our
[guidelines](CONTRIBUTING.md). Pull requests are welcome!

<!-- Thanks go to our wonderful contributors: -->

<!-- ALL-CONTRIBUTORS-LIST:START -->
<!-- prettier-ignore -->
<table><tr><td align="center"><a href="https://twitter.com/ehmicky"><img src="https://avatars2.githubusercontent.com/u/8136211?v=4" width="100px;" alt="ehmicky"/><br /><sub><b>ehmicky</b></sub></a><br /><a href="https://github.com/ehmicky/nve/commits?author=ehmicky" title="Code">💻</a> <a href="#design-ehmicky" title="Design">🎨</a> <a href="#ideas-ehmicky" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/ehmicky/nve/commits?author=ehmicky" title="Documentation">📖</a></td></tr></table>

<!-- ALL-CONTRIBUTORS-LIST:END -->
