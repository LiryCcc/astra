# CI entry point: resolve release tag then package Windows artifacts.
param(
    [Parameter(Mandatory = $true)]
    [string]$ReleaseTag,

    [Parameter(Mandatory = $true)]
    [string]$Workspace
)

$ErrorActionPreference = 'Stop'

. "$PSScriptRoot/resolve_release_version.ps1"
$version = Resolve-ReleaseVersion -Tag $ReleaseTag
& "$PSScriptRoot/../package_windows_release.ps1" -Version $version -Workspace $Workspace
