#!/usr/bin/env bash
# Resolve a Git tag or commit SHA into a filesystem-safe release version string.
set -euo pipefail

resolve_release_version() {
  local tag="$1"
  if [[ "${tag}" == v* ]]; then
    tag="${tag#v}"
  fi
  if [[ "${tag}" =~ ^[0-9a-f]{40}$ ]]; then
    tag="${tag:0:7}"
  fi
  printf '%s' "${tag}"
}

if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
  resolve_release_version "${1:?release tag required}"

fi
