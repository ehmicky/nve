#!/usr/bin/env bash
# Ignore this file, this is only needed for internal purposes.

shopt -s expand_aliases
examplesDir="$(dirname "$BASH_SOURCE")"
alias "nve"='node "$examplesDir/../build/src/bin.js"'

print() {
  echo -e "\n\e[36m# $1\e[0m"
}
