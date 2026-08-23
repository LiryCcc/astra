#!/usr/bin/env bash
# Rename the Flutter Android APK using the release tag.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=resolve_release_version.sh
source "${SCRIPT_DIR}/resolve_release_version.sh"

TAG="${1:?release tag required}"
VERSION="$(resolve_release_version "${TAG}")"

cp build/app/outputs/flutter-apk/app-release.apk "astra-android-${VERSION}.apk"
echo "Created astra-android-${VERSION}.apk"
