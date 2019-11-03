import yargs from 'yargs'

export const defineCli = function() {
  const yargsA = EXAMPLES.reduce(addExample, yargs)
  return yargsA
    .options(CONFIG)
    .usage(USAGE)
    .help()
    .version()
    .strict()
}

const addExample = function(yargsA, [example, description]) {
  return yargsA.example(example, description)
}

const CONFIG = {
  shell: {
    alias: 's',
    boolean: true,
    describe: `Run command inside a shell (such as Bash or cmd.exe).
Default: false`,
  },
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
}

const USAGE = `$0 [OPTIONS...] VERSION... [COMMAND] [ARGS...]

Run "COMMAND [ARGS...]" on specific Node.js versions.
Either one or several VERSION can be specified.
VERSION can be any version range such as "12", "12.6.0" or "<12".`

const EXAMPLES = [
  ['nve 12 node', 'Same as "node" but with Node 12'],
  ['nve 8 node file.js', 'Same as "node file.js" but with Node 8'],
  ['nve 8 npm test', 'Any command can be used'],
  ['nve 8 ava', 'Execute a local binary'],
  ['nve 12 10 8 npm test', 'Run multiple versions'],
  [
    'nve --continue 12 10 8 npm test',
    'Do not abort on the first version that fails',
  ],
  ['nve 8.10.0 npm test', 'Run a specific version'],
  [`nve "*" npm test`, 'Run the latest Node version'],
  [`nve "<8" npm test`, 'Use a version range'],
  [
    `nve --mirror=https://npm.taobao.org/mirrors/node 8 npm test`,
    'Use a different mirror for the Node binaries',
  ],
  ['nve 8 npm run build && nve 8 npm test', 'Chaining command without a shell'],
  [
    'nve --shell 8 "npm run build && npm test"',
    'Chaining command with a shell',
  ],
  ['nve 8', 'Cache Node 8 download without executing any command'],
  ['nve 12 10 8', 'Cache multiple Node downloads'],
]