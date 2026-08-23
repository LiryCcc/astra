# Run Flutter commands with China pub/storage mirrors (Tsinghua TUNA).
# Usage: .\tool\flutter_china.ps1 pub get

$ErrorActionPreference = "Stop"

$env:PUB_HOSTED_URL = "https://mirrors.tuna.tsinghua.edu.cn/dart-pub"
$env:FLUTTER_STORAGE_BASE_URL = "https://mirrors.tuna.tsinghua.edu.cn/flutter"

$flutter = Get-Command flutter -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Source
if (-not $flutter) {
  Write-Error "Flutter SDK not found in PATH. Add Flutter bin to PATH first."
}

if ($args.Count -eq 0) {
  Write-Host "Usage: .\tool\flutter_china.ps1 <flutter-args...>" -ForegroundColor Yellow
  Write-Host "Example: .\tool\flutter_china.ps1 pub get" -ForegroundColor Yellow
  exit 1
}

Write-Host "PUB_HOSTED_URL=$env:PUB_HOSTED_URL" -ForegroundColor DarkGray
Write-Host "FLUTTER_STORAGE_BASE_URL=$env:FLUTTER_STORAGE_BASE_URL" -ForegroundColor DarkGray
& $flutter @args
