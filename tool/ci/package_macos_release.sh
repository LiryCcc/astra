#!/usr/bin/env bash
# CI entry point: resolve release tag then package macOS artifacts.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=resolve_release_version.sh
source "${SCRIPT_DIR}/resolve_release_version.sh"

TAG="${1:?release tag required}"
WORKSPACE="${2:?workspace required}"
VERSION="$(resolve_release_version "${TAG}")"

bash "${SCRIPT_DIR}/../package_macos_release.sh" "${VERSION}" "${WORKSPACE}"
