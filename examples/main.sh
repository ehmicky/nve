#!/usr/bin/env bash
# `nve` demo.
# This file can be directly run
#   npm install nve
#   bash node_modules/nve/examples/main.sh
# An online demo is also available at:
#   https://repl.it/@ehmicky/nve

# Ignore the following line: this is only needed for internal purposes.
. "$(dirname "$BASH_SOURCE")/utils.sh"

print "Same as 'node --version' but with Node 12"
nve 12 node --version

print "Same as 'node file.js' but with Node 8"
nve 8 node file.js

print "Any command can be used, including local binaries"
nve 12 npm --version

print "Run multiple versions"
nve 12,10,8 node --version

print "Do not abort on the first version that fails"
nve --continue 12,10,8 node --version

print "Run all versions in parallel"
nve --parallel 12,10,8 node --version

print "Run a specific version"
nve 8.10.0 node --version

print "Use a version range"
nve "<8" node --version

print "Run the latest Node.js version"
nve latest node --version

print "Run the latest LTS Node.js version"
nve lts node --version

print "Run the Node version from '~/.nvmrc' or the current process version"
nve global node --version

print "Run the current directory's Node.js version using its '.nvmrc' or 'package.json' ('engines.node' field)"
nve local node --version

print "Use a different mirror for the Node binaries"
nve --mirror=https://npm.taobao.org/mirrors/node 8 node --version

print "Do not use the cached list of available Node.js versions"
nve --fetch 8 node --version

print "Always use the cached list of available Node.js versions even if it's more than one hour old"
nve --no-fetch 8 node --version

# print "Use a different CPU architecture for the Node binaries"
# nve --arch=x32 8 node --version

print "Chaining commands"
nve 8 node --version && nve 8 node file.js

print "Cache Node 8 download"
nve 8 node --version

print "Cache multiple Node downloads"
nve 12,10,8 node --version

print "Prints latest Node.js version"
nve latest

print "Prints latest Node.js 8 version"
nve 8

print "Prints latest Node.js 12, 10 and 8 versions"
nve 12,10,8
