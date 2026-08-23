# Verify Inno Setup and 7-Zip are available for Windows release packaging.
$ErrorActionPreference = 'Stop'

$iscc = @(
    "${env:ProgramFiles(x86)}\Inno Setup 6\ISCC.exe",
    "$env:ProgramFiles\Inno Setup 6\ISCC.exe"
) | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $iscc) {
    throw 'ISCC.exe not found. Install Inno Setup 6 (choco install innosetup).'
}

$sevenZip = @(
    "$env:ProgramFiles\7-Zip\7z.exe",
    "${env:ProgramFiles(x86)}\7-Zip\7z.exe"
) | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $sevenZip) {
    throw '7z.exe not found. Install 7-Zip (choco install 7zip.install).'
}

$sfxDir = Split-Path -Parent $sevenZip
$sfx = @('7zSD.sfx', '7z.sfx') |
    ForEach-Object { Join-Path $sfxDir $_ } |
    Where-Object { Test-Path $_ } |
    Select-Object -First 1
if (-not $sfx) {
    throw '7-Zip SFX module not found (7zSD.sfx or 7z.sfx).'
}

Write-Host "Packaging tools OK: ISCC=$iscc 7z=$sevenZip sfx=$sfx"
