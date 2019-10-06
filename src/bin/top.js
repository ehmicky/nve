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
  progress: {
    boolean: true,
    describe: `Show a loading spinner.
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
  shell: {
    alias: 's',
    boolean: true,
    describe: `Run command inside a shell (such as Bash or cmd.exe).
Default: false`,
  },
}

const USAGE = `$0 [OPTIONS...] VERSION COMMAND [ARGS...]

Run "COMMAND [ARGS...]" but using a specific Node.js version.
VERSION can be any version range such as "12", "12.6.0" or "<12".`

const EXAMPLES = [
  ['nve 12 node', 'Same as "node" but with Node 12'],
  ['nve 8 node file.js', 'Same as "node file.js" but with Node 8'],
  ['nve 8 npm test', 'Any command can be used'],
  ['nve 8.10.0 npm test', 'Run a specific version'],
  [`nve "*" npm test`, 'Run the latest Node version'],
  [`nve "<8" npm test`, 'Use a version range'],
  [
    `nve --mirror=https://npm.taobao.org/mirrors/node 8 npm test`,
    'Use a different mirror for the Node binaries',
  ],
  ['nve --shell 8 "npm run build && npm test"', 'Run command inside a shell'],
]
