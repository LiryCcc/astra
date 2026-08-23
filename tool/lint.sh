#!/usr/bin/env bash
# Run static analysis (like ESLint).
# Requires Flutter/Dart SDK and `flutter pub get`.

set -euo pipefail

echo "Running dart analyze..."
dart analyze --fatal-infos
echo "No issues found."
