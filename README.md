<img src="https://raw.githubusercontent.com/ehmicky/design/master/nve/nve.svg?sanitize=true" width="400"/>

[![Codecov](https://img.shields.io/codecov/c/github/ehmicky/nve.svg?label=tested&logo=codecov)](https://codecov.io/gh/ehmicky/nve)
[![Build](https://github.com/ehmicky/nve/workflows/Build/badge.svg)](https://github.com/ehmicky/nve/actions)
[![Gitter](https://img.shields.io/gitter/room/ehmicky/nve.svg?logo=gitter)](https://gitter.im/ehmicky/nve)
[![Twitter](https://img.shields.io/badge/%E2%80%8B-twitter-4cc61e.svg?logo=twitter)](https://twitter.com/intent/follow?screen_name=ehmicky)
[![Medium](https://img.shields.io/badge/%E2%80%8B-medium-4cc61e.svg?logo=medium)](https://medium.com/@ehmicky)

Run any command on specific Node.js versions.

Unlike [`nvm exec`](https://github.com/nvm-sh/nvm/blob/master/README.md#usage)
it:

- can run [multiple Node.js versions](#examples-multiple-versions) at once
- can be run [programmatically](https://github.com/ehmicky/nvexeca)
- is [5 times faster](#benchmarks)
- does not need a separate installation step for each Node version
- can run the major release's latest minor/patch version automatically
- works on Windows. No need to run as Administrator.
- does not require Bash
- is installed as a Node module (as opposed to a
  [Bash installation script](https://github.com/nvm-sh/nvm/blob/master/README.md#installation-and-update)
  downloaded with `curl`)

`nve` executes a **single file or command**. It does not change the `node` nor
`npm` global binaries. To run a specific Node.js version for an **entire project
or shell session**, please use [`nvm`](https://github.com/nvm-sh/nvm),
[`nvm-windows`](https://github.com/coreybutler/nvm-windows),
[`n`](https://github.com/tj/n) or [`nvs`](https://github.com/jasongin/nvs)
instead.

# Examples

```bash
# Same as `node` but with Node 12
$ nve 12 node
Welcome to Node.js v12.13.0.
Type ".help" for more information.
> .exit

# Same as `node file.js` but with Node 8
$ nve 8 node file.js

# Any command can be used
$ nve 8 npm test

# Execute a local binary
$ nve 8 ava

# Run a specific version
$ nve 8.10.0 npm test

# Run the latest Node version
$ nve "*" npm test

# Use a version range
$ nve "<8" npm test

# Use a different mirror for the Node binaries
$ nve --mirror=https://npm.taobao.org/mirrors/node 8 npm test

# Use a different CPU architecture for the Node binaries
$ nve --arch=x32 8 npm test

# Chaining commands
$ nve 8 npm run build && nve 8 npm test

# Cache Node 8 download
$ nve 8 node --version
```

# Examples (multiple versions)

```bash
# Run multiple versions
$ nve 12 10 8 npm test

 ⬢  Node 12

  105 tests passed
  Finished 'test' after 3.8 s

 ⬢  Node 10

  105 tests passed
  Finished 'test' after 4.2 s

 ⬢  Node 8

  105 tests passed
  Finished 'test' after 4.5 s

# Do not abort on the first version that fails
$ nve --continue 12 10 8 npm test

# Run all versions in parallel
$ nve --parallel 12 10 8 npm test

# Cache multiple Node downloads
$ nve 12 10 8 node --version
```

# Examples (list versions)

```bash
# Prints latest Node.js version. Make sure you use quotes.
$ nve "*"
13.1.0

# Prints latest Node.js 8 version
$ nve 8
8.16.2

# Prints latest Node.js 12, 10 and 8 versions
$ nve 12 10 8
12.13.0
10.17.0
8.16.2
```

# Demo

You can try this library:

- either directly [in your browser](https://repl.it/@ehmicky/nve).
- or by executing the [`examples` files](examples/README.md) in a terminal.

# Install

```bash
npm install -g nve
```

`node >=10.17.0` must be globally installed. However the command run by `nve`
can use any Node version (providing it is compatible with it).

To use this programmatically (from Node.js) instead, please check
[`nvexeca`](https://github.com/ehmicky/nvexeca).

# Usage

```bash
nve [OPTIONS...] VERSION... [COMMAND] [ARGS...]
```

This is exactly the same as:

```bash
COMMAND [ARGS...]
```

But using specific Node `VERSION`. Several `VERSION` can be specified at once.

`VERSION` can be any [version range](https://github.com/npm/node-semver) such as
`12`, `12.6.0` or `<12`.

`COMMAND` must be compatible with the specific Node `VERSION`. For example `npm`
is [only compatible with Node `>=6`](https://github.com/npm/cli#important).

Both global and local binaries can be executed.

## Options

### --continue

_Alias_: `-c`\
_Type_: `boolean`\
_Default_: `false`

By default, when running multiple Node versions and one of those versions fails,
the others are aborted. This option disables this.

### --parallel

_Alias_: `-p`\
_Type_: `boolean`\
_Default_: `false`

When running multiple Node versions, run all of them at the same time. This is
faster. However this does not work if the command:

- requires some interactive CLI input (for example using a prompt)
- is not concurrency-safe

### --progress

_Type_: `boolean`\
_Default_: `true`

Whether to show a progress bar while the Node binary is downloading.

### --mirror

_Alias_: `-m`\
_Type_: `string`\
_Default_: `https://nodejs.org/dist`

Base URL to retrieve Node binaries. Can be overridden (for example
`https://npm.taobao.org/mirrors/node`).

The following environment variables can also be used: `NODE_MIRROR`,
`NVM_NODEJS_ORG_MIRROR`, `N_NODE_MIRROR` or `NODIST_NODE_MIRROR`.

### --arch

_Alias_: `-a`\
_Type_: `string`\
_Default_:
[`process.arch`](https://nodejs.org/api/process.html#process_process_arch)

Node.js binary's CPU architecture. This is useful for example when you're on x64
but would like to run Node.js x32.

All the values from
[`process.arch`](https://nodejs.org/api/process.html#process_process_arch) are
allowed except `mips` and `mipsel`.

## Initial download

The first time `nve` is run with a new `VERSION`, the Node binary is downloaded
under the hood. This initially takes few seconds. However subsequent runs are
[almost instantaneous](#benchmarks).

`COMMAND` can be omitted in order to cache that initial download without
executing any commands.

## Difference with nvm

`nve` is meant for one-off command execution. Examples include:

- running tests with an older Node.js version
- checking if an older Node.js version supports a specific syntax or feature
- benchmarking different Node.js versions
- [programmatic usage or child processes](https://github.com/ehmicky/nvexeca)

Tools like [`nvm`](https://github.com/nvm-sh/nvm),
[`nvm-windows`](https://github.com/coreybutler/nvm-windows),
[`n`](https://github.com/tj/n) or [`nvs`](https://github.com/jasongin/nvs) are
meant to execute a specific Node.js version for an entire machine, project or
shell session.

`nve` can (and probably should) be used alongside those tools.

## Native modules

If your code is using native modules, `nve` works providing:

- they are built with [N-API](https://nodejs.org/api/n-api.html)
- the target Node.js version is `>=8.12.0` (since N-API was not available or
  stable before that)

Otherwise the following error message is shown:
`Error: The module was compiled against a different Node.js version`.

# Benchmarks

The [following benchmarks](benchmarks/main.yml) compare the average time to run
`nve`, [`nvm exec`](https://github.com/nvm-sh/nvm) and
[`npx node`](https://github.com/aredridel/node-bin-gen/blob/master/node-bin-README.md#use-with-npx):

```
nve:       199ms
nvm exec: 1002ms
npx node: 1343ms
```

# See also

- [`nvexeca`](https://github.com/ehmicky/nvexeca): Like `nve` but programmatic
  (from Node.js)
- [`execa`](https://github.com/sindresorhus/execa): Process execution for humans
- [`get-node`](https://github.com/ehmicky/get-node): Download Node.js
- [`normalize-node-version`](https://github.com/ehmicky/normalize-node-version):
  Normalize and validate Node.js versions
- [`all-node-versions`](https://github.com/ehmicky/all-node-versions): List all
  available Node.js versions
- [`fetch-node-website`](https://github.com/ehmicky/fetch-node-website): Fetch
  releases on nodejs.org
- [`global-cache-dir`](https://github.com/ehmicky/global-cache-dir): Get the
  global cache directory

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

Thanks go to our wonderful contributors:

<!-- ALL-CONTRIBUTORS-LIST:START -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://twitter.com/ehmicky"><img src="https://avatars2.githubusercontent.com/u/8136211?v=4" width="100px;" alt="ehmicky"/><br /><sub><b>ehmicky</b></sub></a><br /><a href="https://github.com/ehmicky/nve/commits?author=ehmicky" title="Code">💻</a> <a href="#design-ehmicky" title="Design">🎨</a> <a href="#ideas-ehmicky" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/ehmicky/nve/commits?author=ehmicky" title="Documentation">📖</a></td>
    <td align="center"><a href="https://scottwarren.dev"><img src="https://avatars2.githubusercontent.com/u/2718494?v=4" width="100px;" alt="Scott Warren"/><br /><sub><b>Scott Warren</b></sub></a><br /><a href="#question-scottwarren" title="Answering Questions">💬</a></td>
    <td align="center"><a href="https://tunnckoCore.com"><img src="https://avatars3.githubusercontent.com/u/5038030?v=4" width="100px;" alt="Charlike Mike Reagent"/><br /><sub><b>Charlike Mike Reagent</b></sub></a><br /><a href="#question-tunnckoCore" title="Answering Questions">💬</a> <a href="#ideas-tunnckoCore" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/Hongarc"><img src="https://avatars1.githubusercontent.com/u/19208123?v=4" width="100px;" alt="Hongarc"/><br /><sub><b>Hongarc</b></sub></a><br /><a href="#ideas-Hongarc" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/papb"><img src="https://avatars3.githubusercontent.com/u/20914054?v=4" width="100px;" alt="Pedro Augusto de Paula Barbosa"/><br /><sub><b>Pedro Augusto de Paula Barbosa</b></sub></a><br /><a href="https://github.com/ehmicky/nve/issues?q=author%3Apapb" title="Bug reports">🐛</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
