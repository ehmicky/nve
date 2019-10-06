<img src="https://raw.githubusercontent.com/ehmicky/design/master/nve/nve.svg?sanitize=true" width="400"/>

[![Codecov](https://img.shields.io/codecov/c/github/ehmicky/nve.svg?label=tested&logo=codecov)](https://codecov.io/gh/ehmicky/nve)
[![Travis](https://img.shields.io/badge/cross-platform-4cc61e.svg?logo=travis)](https://travis-ci.org/ehmicky/nve)
[![Gitter](https://img.shields.io/gitter/room/ehmicky/nve.svg?logo=gitter)](https://gitter.im/ehmicky/nve)
[![Twitter](https://img.shields.io/badge/%E2%80%8B-twitter-4cc61e.svg?logo=twitter)](https://twitter.com/intent/follow?screen_name=ehmicky)
[![Medium](https://img.shields.io/badge/%E2%80%8B-medium-4cc61e.svg?logo=medium)](https://medium.com/@ehmicky)

Run any Node.js version.

This executes any command using a specific Node.js version.

Unlike [`nvm exec`](https://github.com/nvm-sh/nvm/blob/master/README.md#usage)
it:

- can be run [programmatically](#programmatic)
- is [10 times faster](#benchmarks)
- does not need a separate installation step for each Node version
- runs always the latest minor/patch Node version (when only the major version
  is specified)
- works on Windows (no need to run as Administrator)
- does not require Bash
- is installed as a Node module (as opposed to a
  [Bash installation script](https://github.com/nvm-sh/nvm/blob/master/README.md#installation-and-update)
  downloaded with `curl`)

`nve` executes a single file or command. It does not change the `node` nor `npm`
global binaries. To run a specific Node.js version for an entire project or
shell session, please use [`nvm`](https://github.com/nvm-sh/nvm),
[`nvm-windows`](https://github.com/coreybutler/nvm-windows),
[`n`](https://github.com/tj/n) or [`nvs`](https://github.com/jasongin/nvs)
instead.

# Examples

```bash
# Same as `node` but with Node 12
$ nve 12 node
Welcome to Node.js v12.10.0.
Type ".help" for more information.
> .exit

# Same as `node file.js` but with Node 8
$ nve 8 node file.js

# Any command can be used
$ nve 8 npm test

# Run a specific version
$ nve 8.10.0 npm test

# Run the latest Node version
$ nve "*" npm test

# Use a version range
$ nve "<8" npm test

# Use a different mirror for the Node binaries
$ nve --mirror=https://npm.taobao.org/mirrors/node 8 npm test
```

Or [programmatically](#programmatic):

<!-- Remove 'eslint-skip' once estree supports top-level await -->
<!-- eslint-skip -->

```js
const childProcess = await nve('8', 'node', ['--version'])
```

# Demo

You can try this library:

- either directly [in your browser](https://repl.it/@ehmicky/nve).
- or by executing the [`examples` files](examples/README.md) in a terminal.

# Install

```bash
npm install -g nve
```

`node >=8.12.0` must be globally installed. However the command run by `nve` can
use any Node version (providing it is compatible with it).

# Usage

## CLI

```bash
nve [OPTIONS...] VERSION COMMAND [ARGS...]
```

This is exactly the same as:

```bash
COMMAND [ARGS...]
```

But using a specific Node version.

`VERSION` can be any [version range](https://github.com/npm/node-semver) such as
`12`, `12.6.0` or `<12`.

`COMMAND` must be compatible with the specific Node `VERSION`. For example `npm`
is [only compatible with Node `>=6`](https://github.com/npm/cli#important).

The first time `nve` is run with a new `VERSION`, the Node binary is downloaded
under the hood. This initially takes few seconds. However subsequent runs are
[almost instantaneous](#benchmarks).

## Options

### --progress

_Type_: `boolean`<br>_Default_: `true`

Whether to show a progress spinner when the Node binary is downloading.

### --mirror

_Alias_: `-m`<br>_Type_: `string`<br>_Default_: `https://nodejs.org/dist`

Base URL to retrieve Node binaries. Can be overridden (for example
`https://npm.taobao.org/mirrors/node`).

The following environment variables can also be used: `NODE_MIRROR`,
`NVM_NODEJS_ORG_MIRROR`, `N_NODE_MIRROR` or `NODIST_NODE_MIRROR`.

## Native modules

If your code is using native modules, `nve` will work providing:

- they are built with [N-API](https://nodejs.org/api/n-api.html)
- the target Node.js version is `>=8.12.0` (since N-API was not available or
  stable before that)

Otherwise the following error message will be shown:
`Error: The module was compiled against a different Node.js version`.

## Programmatic

### nve(versionRange, command, args?, options?)

_versionRange_: `string`<br> _command_: `string`<br>_args_: `string[]`<br>
_options_: `object`<br>_Return value_:
[`Promise<childProcess>`](https://nodejs.org/api/child_process.html#child_process_class_childprocess)

`options` has the same members as the CLI options: [`progress`](#--progress) and
[`mirror`](#--mirror).

`command` and `args` are the same as in
[`child_process.spawn(command, args, options)`](https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options).
An `options.spawn` object can be specified to pass options to
`child_process.spawn()`.

<!-- Remove 'eslint-skip' once estree supports top-level await -->
<!-- eslint-skip -->

```js
const childProcess = await nve('8', 'command', ['--version'], options)
```

# Benchmarks

The [following benchmarks](benchmarks/main.js) compare the average time to run
`nve`, [`nvm exec`](https://github.com/nvm-sh/nvm) and
[`npx node`](https://github.com/aredridel/node-bin-gen/blob/master/node-bin-README.md#use-with-npx):

```
nve:       106ms
nvm exec: 1020ms
npx node: 1437ms
```

# See also

- [`get-node`](https://github.com/ehmicky/get-node): Download Node.js
- [`normalize-node-version`](https://github.com/ehmicky/normalize-node-version):
  Normalize and validate Node.js versions
- [`all-node-versions`](https://github.com/ehmicky/all-node-versions): List all
  available Node.js versions
- [`fetch-node-website`](https://github.com/ehmicky/fetch-node-website): Fetch
  releases on nodejs.org

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
<!-- prettier-ignore -->
<table>
  <tr>
    <td align="center"><a href="https://twitter.com/ehmicky"><img src="https://avatars2.githubusercontent.com/u/8136211?v=4" width="100px;" alt="ehmicky"/><br /><sub><b>ehmicky</b></sub></a><br /><a href="https://github.com/ehmicky/nve/commits?author=ehmicky" title="Code">💻</a> <a href="#design-ehmicky" title="Design">🎨</a> <a href="#ideas-ehmicky" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/ehmicky/nve/commits?author=ehmicky" title="Documentation">📖</a></td>
    <td align="center"><a href="https://scottwarren.dev"><img src="https://avatars2.githubusercontent.com/u/2718494?v=4" width="100px;" alt="Scott Warren"/><br /><sub><b>Scott Warren</b></sub></a><br /><a href="#question-scottwarren" title="Answering Questions">💬</a></td>
    <td align="center"><a href="https://tunnckoCore.com"><img src="https://avatars3.githubusercontent.com/u/5038030?v=4" width="100px;" alt="Charlike Mike Reagent"/><br /><sub><b>Charlike Mike Reagent</b></sub></a><br /><a href="#question-tunnckoCore" title="Answering Questions">💬</a> <a href="#ideas-tunnckoCore" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/Hongarc"><img src="https://avatars1.githubusercontent.com/u/19208123?v=4" width="100px;" alt="Hongarc"/><br /><sub><b>Hongarc</b></sub></a><br /><a href="#ideas-Hongarc" title="Ideas, Planning, & Feedback">🤔</a></td>
  </tr>
</table>

<!-- ALL-CONTRIBUTORS-LIST:END -->
