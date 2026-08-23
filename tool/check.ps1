# CI-style check: verify formatting + run linter.
# Exits non-zero if sources are unformatted or analysis fails.

$ErrorActionPreference = "Stop"

Write-Host "Checking Dart formatting..." -ForegroundColor Cyan
dart format --output=none --set-exit-if-changed --line-length=120 .
if ($LASTEXITCODE -ne 0) {
  Write-Host "Formatting check failed. Run: .\tool\format.ps1" -ForegroundColor Red
  exit $LASTEXITCODE
}

Write-Host "Running dart analyze..." -ForegroundColor Cyan
dart analyze --fatal-infos
if ($LASTEXITCODE -ne 0) {
  Write-Host "Analysis failed." -ForegroundColor Red
  exit $LASTEXITCODE
}

Write-Host "Running flutter test..." -ForegroundColor Cyan
flutter test
if ($LASTEXITCODE -ne 0) {
  Write-Host "Tests failed." -ForegroundColor Red
  exit $LASTEXITCODE
}

Write-Host "All checks passed." -ForegroundColor Green
