#!/usr/bin/env bash
# EXPLANATION
# This file can be directly run:
#   - first install `nve`
#   - then `bash node_modules/nve/examples/before.sh`
# An online demo is also available at:
#   https://repl.it/@ehmicky/nve

# Ignore the following line: this is only needed for internal purposes.
. "$(dirname "$BASH_SOURCE")/utils.sh"

# Same as `node --version` but with Node 12
nve 12 --version

# Same as `node file.js` but with Node 8
nve 8 file.js

# Any Node CLI flag can be used
nve 8 --print 'process.version'

# Run a specific version
nve 8.10.0 --version

# Run the latest Node version
nve '*' --version

# Use a version range
nve '<8' --version
