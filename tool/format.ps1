# Format all Dart files (like Prettier).
# Requires Flutter/Dart SDK. Line width matches .editorconfig (120).

$ErrorActionPreference = "Stop"

Write-Host "Formatting Dart sources..." -ForegroundColor Cyan
dart format --line-length=120 .
Write-Host "Done." -ForegroundColor Green
