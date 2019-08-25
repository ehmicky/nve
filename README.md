<img src="https://raw.githubusercontent.com/ehmicky/design/master/nve/nve.svg?sanitize=true" width="400"/>

[![Codecov](https://img.shields.io/codecov/c/github/ehmicky/nve.svg?label=tested&logo=codecov)](https://codecov.io/gh/ehmicky/nve)
[![Travis](https://img.shields.io/badge/cross-platform-4cc61e.svg?logo=travis)](https://travis-ci.org/ehmicky/nve)
[![Gitter](https://img.shields.io/gitter/room/ehmicky/nve.svg?logo=gitter)](https://gitter.im/ehmicky/nve)
[![Twitter](https://img.shields.io/badge/%E2%80%8B-twitter-4cc61e.svg?logo=twitter)](https://twitter.com/intent/follow?screen_name=ehmicky)
[![Medium](https://img.shields.io/badge/%E2%80%8B-medium-4cc61e.svg?logo=medium)](https://medium.com/@ehmicky)

Run any Node.js version.

This executes a file, command or REPL using a specific Node.js version.

Unlike [`nvm run`](https://github.com/nvm-sh/nvm/blob/master/README.md#usage)
it:

- can be run programmatically
- is [10 times faster](#benchmarks)
- does not need a separate installation step for each Node version
- works on Windows
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
$ nve 12
Welcome to Node.js v12.8.0.
Type ".help" for more information.
> .exit

# Same as `node file.js` but with Node 8
$ nve 8 file.js

# Any Node CLI flag can be used
$ nve 8 --print 'process.version'
v8.16.0

# Run a specific version
$ nve 8.10.0 --version
v8.10.0

# Run the latest Node version
$ nve '*' --version
v12.8.0

# Use a version range
$ nve '<8' --version
v7.10.1
```

Or from Node.js:

<!-- Remove 'eslint-skip' once estree supports top-level await -->
<!-- eslint-skip -->

```js
const { promise, childProcess } = await nve('8', ['--version'])
await promise
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
use any Node version.

# Usage (CLI)

```bash
nve VERSION [ARGS...]
```

This is exactly the same as:

```bash
node [ARGS...]
```

But using a specific Node version. Any Node
[CLI flag](https://nodejs.org/api/cli.html) can be passed.

`VERSION` can be any [version range](https://github.com/npm/node-semver) such as
`12`, `12.6.0` or `<12`.

# Usage (Node.js)

<!-- Remove 'eslint-skip' once estree supports top-level await -->
<!-- eslint-skip -->

```js
const options = {}
const { promise, childProcess } = await nve('8', ['--version'], options)
const { code, signal } = await promise
```

You can either:

- use the `promise` if you just want to wait for the child process to complete
  and retrieve its exit `code` or `signal`
- use the
  [`childProcess`](https://nodejs.org/api/child_process.html#child_process_class_childprocess)
  if you want to to access its output. Please note `options.stdio` defaults to
  `inherit`.

## Initial download

The first time `nve` is run with a new `VERSION`, the Node binary is downloaded
from [`nodejs.org`](https://nodejs.org/dist/) under the hood. This initially
takes few seconds. However subsequent runs are
[almost instantaneous](#benchmarks).

A spinner will show the download progress. This can be disabled using the
environment variable `NVE_PROGRESS=0`.

## Native modules

If your code is using native modules, `nve` will work providing:

- they are built with [N-API](https://nodejs.org/api/n-api.html)
- the target Node.js version is `>=8.12.0` (since N-API was not available or
  stable before that)

Otherwise the following error message will be shown:
`Error: The module was compiled against a different Node.js version`.

## Node.js mirror

The binaries are downloaded from
[https://nodejs.org/dist](https://nodejs.org/dist). You can specify a mirror
website using the environment variable `NODE_MIRROR`.

```bash
NODE_MIRROR="https://npm.taobao.org/mirrors/node" nve VERSION [ARGS...]
```

# API (Node.js)

## nve(versionRange, args?, options?)

_versionRange_: `string`<br> _args_: `string[]`<br> _options_:
`object`<br>_Return value_: `object`

`args` and `options` are the same as in
[`child_process.spawn(command, args, options)`](https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options).

The return value is an object with the following properties:

- `promise`: resolves with
  [`code`](https://nodejs.org/api/child_process.html#child_process_event_exit)
  and
  [`signal`](https://nodejs.org/api/child_process.html#child_process_event_exit)
- [`childProcess`](https://nodejs.org/api/child_process.html#child_process_class_childprocess)

# Benchmarks

The [following benchmarks](benchmarks/main.js) compare the average time to run
`nve`, [`nvm run`](https://github.com/nvm-sh/nvm) and
[`npx node`](https://github.com/aredridel/node-bin-gen/blob/master/node-bin-README.md#use-with-npx):

```
nve:        68ms
nvm run:   852ms
npx node: 1385ms
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
