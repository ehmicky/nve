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

const CONFIG = {}

const USAGE = `nve [OPTIONS...] VERSION COMMAND [ARGS...]

Run "COMMAND [ARGS...]" but using a specific Node.js version.
VERSION can be any version range such as "12", "12.6.0" or "<12".`

const EXAMPLES = [
  ['nve 12 node', 'Same as "node" but with Node 12'],
  ['nve 8 node file.js', 'Same as "node file.js" but with Node 8'],
  ['nve 8 npm test', 'Any command can be used'],
  ['nve 8.10.0 npm test', 'Run a specific version'],
  [`nve "*" npm test`, 'Run the latest Node version'],
  [`nve "<8" npm test`, 'Use a version range'],
]
