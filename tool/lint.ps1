# Run static analysis (like ESLint).
# Requires Flutter/Dart SDK and `flutter pub get`.

$ErrorActionPreference = "Stop"

Write-Host "Running dart analyze..." -ForegroundColor Cyan
dart analyze --fatal-infos
Write-Host "No issues found." -ForegroundColor Green
