#!/usr/bin/env bash
# Format all Dart files (like Prettier).
# Requires Flutter/Dart SDK. Line width matches .editorconfig (120).

set -euo pipefail

echo "Formatting Dart sources..."
dart format --line-length=120 .
echo "Done."
