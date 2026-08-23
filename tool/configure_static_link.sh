#!/usr/bin/env bash
# Verify macOS static linking settings are configured before release builds.
set -euo pipefail

WORKSPACE="${1:?workspace required}"

RELEASE_XCCONFIG="${WORKSPACE}/macos/Runner/Configs/Release.xcconfig"
STATIC_XCCONFIG="${WORKSPACE}/macos/Runner/Configs/StaticLink.xcconfig"

if [[ ! -f "${STATIC_XCCONFIG}" ]]; then
  echo "Missing static link config: ${STATIC_XCCONFIG}" >&2
  exit 1
fi

if ! grep -q 'StaticLink.xcconfig' "${RELEASE_XCCONFIG}"; then
  echo "Release.xcconfig must include StaticLink.xcconfig" >&2
  exit 1
fi

echo 'macOS static linking: StaticLink.xcconfig enabled for Release builds'
