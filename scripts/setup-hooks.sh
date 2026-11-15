#!/bin/sh
[ "$(git rev-parse --show-toplevel 2>/dev/null)" = "$(pwd -P)" ] || exit 0

current=$(git config --get core.hooksPath)
[ -z "$current" ] && exec git config core.hooksPath .githooks
[ "$current" = .githooks ] || echo "core.hooksPath is already '$current': left unchanged, .githooks not enabled." >&2
