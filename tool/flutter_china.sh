#!/usr/bin/env bash
# Run Flutter commands with China pub/storage mirrors (Tsinghua TUNA).
# Usage: ./tool/flutter_china.sh pub get

set -euo pipefail

export PUB_HOSTED_URL=https://mirrors.tuna.tsinghua.edu.cn/dart-pub
export FLUTTER_STORAGE_BASE_URL=https://mirrors.tuna.tsinghua.edu.cn/flutter

if [ "$#" -eq 0 ]; then
  echo "Usage: ./tool/flutter_china.sh <flutter-args...>"
  echo "Example: ./tool/flutter_china.sh pub get"
  exit 1
fi

echo "PUB_HOSTED_URL=$PUB_HOSTED_URL"
echo "FLUTTER_STORAGE_BASE_URL=$FLUTTER_STORAGE_BASE_URL"
flutter "$@"
