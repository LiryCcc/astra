#!/usr/bin/env bash
# CI-style check: verify formatting + run linter.
# Exits non-zero if sources are unformatted or analysis fails.

set -euo pipefail

echo "Checking Dart formatting..."
if ! dart format --output=none --set-exit-if-changed --line-length=120 .; then
  echo "Formatting check failed. Run: ./tool/format.sh"
  exit 1
fi

echo "Running dart analyze..."
dart analyze --fatal-infos

echo "Running flutter test..."
flutter test

echo "All checks passed."
