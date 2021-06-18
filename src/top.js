/* eslint-disable max-lines */
import { argv } from 'process'

import yargs from 'yargs'
// eslint-disable-next-line node/file-extension-in-import
import { hideBin } from 'yargs/helpers'

export const defineCli = function () {
  return yargs(hideBin(argv))
    .options(CONFIG)
    .usage(USAGE)
    .example(EXAMPLES)
    .strict()
}

const CONFIG = {
  parallel: {
    alias: 'p',
    boolean: true,
    describe: `When running multiple Node versions, run all of them at the same time.
This is faster. However this does not work if the command:
  - requires some interactive CLI input (for example using a prompt)
  - is not concurrency-safe
Default: false`,
  },
  continue: {
    alias: 'c',
    boolean: true,
    describe: `When running multiple Node versions, do not abort when one of those versions fails.
Default: false`,
  },
  progress: {
    boolean: true,
    describe: `Show a progress bar.
Default: true`,
  },
  mirror: {
    alias: 'm',
    string: true,
    requiresArg: true,
    describe: `Base URL. Defaults to 'https://nodejs.org/dist'.
Can be customized (for example "https://npm.taobao.org/mirrors/node").

The following environment variables can also be used: NODE_MIRROR, NVM_NODEJS_ORG_MIRROR, N_NODE_MIRROR or NODIST_NODE_MIRROR.`,
  },
  fetch: {
    alias: 'f',
    boolean: true,
    describe: `The list of available Node.js versions is cached for one hour by default. With:
- --fetch: the cache will not be used
- --no-fetch: the cache will be used even if it's older than one hour`,
  },
  arch: {
    alias: 'a',
    string: true,
    requiresArg: true,
    describe: `Node.js binary's CPU architecture. This is useful for example when you're on x64 but would like to run Node.js x32.
All the values from process.arch are allowed except mips and mipsel.
Default: process.arch`,
  },
}

const USAGE = `$0 [OPTIONS...] VERSION,... [COMMAND] [ARGS...]

Run "COMMAND [ARGS...]" on specific Node.js versions.
Either one or several comma-separated VERSION can be specified.
VERSION can be any version range such as "12", "12.6.0" or "<12".
It can also be one of the following aliases: "latest", "lts", "global" or "local".`

const EXAMPLES = [
  ['$0 12 node', 'Same as "node" but with Node 12'],
  ['$0 8 node file.js', 'Same as "node file.js" but with Node 8'],
  ['$0 8 npm test', 'Any command can be used'],
  ['$0 8 ava', 'Execute a local binary'],
  ['$0 12,10,8 npm test', 'Run multiple versions'],
  [
    '$0 --continue 12,10,8 npm test',
    'Do not abort on the first version that fails',
  ],
  ['$0 --parallel 12,10,8 npm test', 'Run all versions in parallel'],
  ['$0 8.10.0 npm test', 'Run a specific version'],
  ['$0 "<8" npm test', 'Use a version range'],
  ['$0 latest npm test', 'Run the latest Node version'],
  ['$0 lts npm test', 'Run the latest LTS Node version'],
  [
    '$0 global npm test',
    'Run the Node version from "~/.nvmrc" or the current process version',
  ],
  [
    '$0 local npm test',
    'Run the current directory\'s Node.js version using its ".nvmrc" or "package.json" ("engines.node" field)',
  ],
  [
    '$0 --mirror=https://npm.taobao.org/mirrors/node 8 npm test',
    'Use a different mirror for the Node binaries',
  ],
  [
    '$0 --fetch 8 npm test',
    'Do not use the cached list of available Node.js versions',
  ],
  [
    '$0 --no-fetch 8 npm test',
    "Always use the cached list of available Node.js versions even if it's more than one hour old",
  ],
  [
    '$0 --arch=x32 8 npm test',
    'Use a different CPU architecture for the Node binaries',
  ],
  ['$0 8 npm run build && $0 8 npm test', 'Chaining command'],
  ['$0 8 node --version', 'Cache Node 8 download'],
  ['$0 12,10,8 node --version', 'Cache multiple Node downloads'],
  ['$0 latest', 'Prints latest Node.js version'],
  ['$0 8', 'Prints latest Node.js 8 version'],
  ['$0 12,10,8', 'Prints latest Node.js 12, 10 and 8 versions'],
]
/* eslint-enable max-lines */
