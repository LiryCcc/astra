#!/usr/bin/env bash
# Package macOS release artifacts: portable zip, DMG installer, and standalone self-extracting run.
set -euo pipefail

VERSION="${1:?version required}"
WORKSPACE="${2:?workspace required}"

APP_DIR="${WORKSPACE}/build/macos/Build/Products/Release"
APP_PATH="${APP_DIR}/astra.app"

if [[ ! -d "${APP_PATH}" ]]; then
  echo "App bundle not found: ${APP_PATH}" >&2
  exit 1
fi

cd "${APP_DIR}"

echo "Creating portable zip..."
zip -yr "${WORKSPACE}/astra-macos-${VERSION}-portable.zip" astra.app

echo "Creating DMG installer..."
DMG_STAGING="${WORKSPACE}/.dmg-staging"
rm -rf "${DMG_STAGING}"
mkdir -p "${DMG_STAGING}"
cp -R astra.app "${DMG_STAGING}/"
ln -s /Applications "${DMG_STAGING}/Applications"
hdiutil create -volname "Astra" -srcfolder "${DMG_STAGING}" -ov -format UDZO \
  "${WORKSPACE}/astra-macos-${VERSION}.dmg"
rm -rf "${DMG_STAGING}"

echo "Creating standalone self-extracting archive..."
TAR_PATH="${WORKSPACE}/.astra-macos-${VERSION}.tar.gz"
STANDALONE="${WORKSPACE}/astra-macos-${VERSION}-standalone.run"
tar czf "${TAR_PATH}" astra.app

cat >"${STANDALONE}" <<'HEADER'
#!/bin/bash
set -euo pipefail
DIR="$(mktemp -d -t astra-extract)"
trap 'rm -rf "$DIR"' EXIT
ARCHIVE_LINE=$(awk '/^__ARCHIVE_BELOW__/ {print NR + 1; exit 0; }' "$0")
tail -n +"${ARCHIVE_LINE}" "$0" | tar xzf - -C "$DIR"
open "$DIR/astra.app"
HEADER
chmod +x "${STANDALONE}"
echo '__ARCHIVE_BELOW__' >>"${STANDALONE}"
cat "${TAR_PATH}" >>"${STANDALONE}"
rm -f "${TAR_PATH}"

echo "macOS artifacts:"
ls -1 "${WORKSPACE}"/astra-macos-"${VERSION}"*
