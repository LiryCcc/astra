# Install Windows release packaging dependencies via Chocolatey.
$ErrorActionPreference = 'Stop'

choco install innosetup 7zip.install -y --no-progress
& "$PSScriptRoot/verify_windows_packaging_tools.ps1"
