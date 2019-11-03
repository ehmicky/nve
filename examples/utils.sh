#!/usr/bin/env bash
# Ignore this file, this is only needed for internal purposes.

dir="$(dirname "$BASH_SOURCE")"
projectRoot="$(realpath "$dir/..")"
binaryName="$(basename "$projectRoot")"
pathToBinary="build/src/bin.js"

cd "$dir"

shopt -s expand_aliases

# We create an alias so that examples look the same as if the library was
# directly installed.
alias "$binaryName"="$projectRoot/$pathToBinary"

print() {
  echo -e "\n\e[36m# $1\e[0m"
}
