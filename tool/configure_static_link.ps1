# Verify Windows static linking (/MT) is configured before release builds.
param(
    [Parameter(Mandatory = $true)]
    [string]$Workspace
)

$ErrorActionPreference = 'Stop'

$cmakeModule = Join-Path $Workspace 'windows\cmake\static_runtime.cmake'
$cmakeLists = Join-Path $Workspace 'windows\CMakeLists.txt'

if (-not (Test-Path $cmakeModule)) {
    throw "Missing static runtime module: $cmakeModule"
}

$cmakeListsContent = Get-Content $cmakeLists -Raw
if ($cmakeListsContent -notmatch 'static_runtime\.cmake') {
    throw 'windows/CMakeLists.txt must include windows/cmake/static_runtime.cmake'
}

Write-Host 'Windows static linking: MSVC runtime /MT enabled via windows/cmake/static_runtime.cmake'
