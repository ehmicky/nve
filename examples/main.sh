#!/usr/bin/env bash
# `nve` demo.
# This file can be directly run
#   npm install nve
#   bash node_modules/nve/examples/main.sh
# An online demo is also available at:
#   https://repl.it/@ehmicky/nve

# Ignore the following line: this is only needed for internal purposes.
. "$(dirname "$BASH_SOURCE")/utils.sh"

# Same as `node --version` but with Node 12
nve 12 node --version

# Same as `node file.js` but with Node 8
nve 8 node file.js

# Any command can be used, including local binaries
nve 8 npm --version

# Run multiple versions
nve 12 10 8 node --version

# Do not abort on the first version that fails
nve --continue 12 10 8 node --version

# Run all versions in parallel
nve --parallel 12 10 8 node --version

# Run a specific version
nve 8.10.0 node --version

# Run the latest Node version
nve '*' node --version

# Use a version range
nve '<8' node --version

# Use a different mirror for the Node binaries
nve --mirror=https://npm.taobao.org/mirrors/node 8 node --version

# Chaining commands without a shell
nve 8 node --version && nve 8 node file.js

# Chaining commands with a shell
nve --shell 8 "node --version && node file.js"

# Cache Node 8 download
nve 8 node --version

# Cache multiple Node downloads
nve 12 10 8 node --version

# Prints latest Node.js version. Make sure you use quotes.
nve "*"

# Prints latest Node.js 8 version
nve 8

# Prints latest Node.js 12, 10 and 8 versions
nve 12 10 8
