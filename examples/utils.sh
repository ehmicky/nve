#!/usr/bin/env bash
# Ignore this file, this is only needed for internal purposes.

examplesDir="$(dirname "$BASH_SOURCE")"

alias "nve"="npx nve"

print() {
  echo -e "\n\e[36m# $1\e[0m"
}
