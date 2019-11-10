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
nve 8 npm --version

print "Run multiple versions"
nve 12 10 8 node --version

print "Do not abort on the first version that fails"
nve --continue 12 10 8 node --version

print "Run all versions in parallel"
nve --parallel 12 10 8 node --version

print "Run a specific version"
nve 8.10.0 node --version

print "Run the latest Node version"
nve "*" node --version

print "Use a version range"
nve "<8" node --version

print "Use a different mirror for the Node binaries"
nve --mirror=https://npm.taobao.org/mirrors/node 8 node --version

print "Chaining commands"
nve 8 node --version && nve 8 node file.js

print "Cache Node 8 download"
nve 8 node --version

print "Cache multiple Node downloads"
nve 12 10 8 node --version

print "Prints latest Node.js version. Make sure you use quotes."
nve "*"

print "Prints latest Node.js 8 version"
nve 8

print "Prints latest Node.js 12, 10 and 8 versions"
nve 12 10 8
