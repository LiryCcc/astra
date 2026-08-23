#!/usr/bin/env bash
# Package an unsigned iOS IPA from the Flutter build output.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=resolve_release_version.sh
source "${SCRIPT_DIR}/resolve_release_version.sh"

TAG="${1:?release tag required}"
WORKSPACE="${2:?workspace required}"
VERSION="$(resolve_release_version "${TAG}")"

cd "${WORKSPACE}/build/ios/iphoneos"
mkdir -p Payload
cp -r Runner.app Payload/
zip -r "${WORKSPACE}/astra-ios-unsigned-${VERSION}.ipa" Payload
echo "Created astra-ios-unsigned-${VERSION}.ipa"
