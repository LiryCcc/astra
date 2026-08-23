# Verify Windows static UCRT linking (/MT) is configured before release builds.
param(
    [Parameter(Mandatory = $true)]
    [string]$Workspace
)

$ErrorActionPreference = 'Stop'

$cmakeModule = Join-Path $Workspace 'windows\cmake\static_runtime.cmake'
$cmakeLists = Join-Path $Workspace 'windows\CMakeLists.txt'
$runnerCmake = Join-Path $Workspace 'windows\runner\CMakeLists.txt'
$flutterCmake = Join-Path $Workspace 'windows\flutter\CMakeLists.txt'

foreach ($path in @($cmakeModule, $cmakeLists, $runnerCmake, $flutterCmake)) {
    if (-not (Test-Path $path)) {
        throw "Missing build file: $path"
    }
}

$cmakeListsContent = Get-Content $cmakeLists -Raw
if ($cmakeListsContent -notmatch 'static_runtime\.cmake') {
    throw 'windows/CMakeLists.txt must include windows/cmake/static_runtime.cmake'
}

$staticContent = Get-Content $cmakeModule -Raw
if ($staticContent -notmatch 'UCRT|ucrt') {
    throw 'windows/cmake/static_runtime.cmake must document UCRT static linking'
}
if ($staticContent -notmatch 'CMAKE_MSVC_RUNTIME_LIBRARY.*MultiThreaded') {
    throw 'windows/cmake/static_runtime.cmake must set CMAKE_MSVC_RUNTIME_LIBRARY to MultiThreaded (/MT)'
}
if ($staticContent -notmatch 'APPLY_STATIC_UCRT_RUNTIME') {
    throw 'windows/cmake/static_runtime.cmake must define APPLY_STATIC_UCRT_RUNTIME'
}

$runnerContent = Get-Content $runnerCmake -Raw
if ($runnerContent -notmatch 'apply_static_ucrt_runtime') {
    throw 'windows/runner/CMakeLists.txt must call apply_static_ucrt_runtime'
}

$flutterContent = Get-Content $flutterCmake -Raw
if ($flutterContent -notmatch 'apply_static_ucrt_runtime\(flutter_wrapper_plugin\)') {
    throw 'windows/flutter/CMakeLists.txt must call apply_static_ucrt_runtime for flutter_wrapper_plugin'
}
if ($flutterContent -notmatch 'apply_static_ucrt_runtime\(flutter_wrapper_app\)') {
    throw 'windows/flutter/CMakeLists.txt must call apply_static_ucrt_runtime for flutter_wrapper_app'
}

Write-Host 'Windows static linking: UCRT /MT enabled via windows/cmake/static_runtime.cmake'
