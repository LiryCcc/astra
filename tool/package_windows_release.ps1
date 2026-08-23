# Package Windows release artifacts: portable zip, installer, and standalone SFX exe.
param(
    [Parameter(Mandatory = $true)]
    [string]$Version,

    [Parameter(Mandatory = $true)]
    [string]$Workspace
)

$ErrorActionPreference = 'Stop'

function Convert-ToIssPath {
    param([Parameter(Mandatory = $true)][string]$Path)
  # Inno Setup /D defines treat backslashes as escapes (e.g. \a in D:\a\...).
    return ($Path -replace '\\', '/')
}

function Resolve-SevenZip {
    $candidates = @(
        (Join-Path $env:ProgramFiles '7-Zip\7z.exe'),
        (Join-Path ${env:ProgramFiles(x86)} '7-Zip\7z.exe')
    )
    foreach ($candidate in $candidates) {
        if (Test-Path $candidate) {
            return $candidate
        }
    }
    throw '7-Zip not found. Install 7-Zip (choco install 7zip).'
}

function Resolve-SevenZipSfxModule {
    param([Parameter(Mandatory = $true)][string]$SevenZipExe)

    $sevenZipDir = Split-Path -Parent $SevenZipExe
    $sfxCandidates = @(
        (Join-Path $sevenZipDir '7zSD.sfx'),
        (Join-Path $sevenZipDir '7z.sfx')
    )
    foreach ($candidate in $sfxCandidates) {
        if (Test-Path $candidate) {
            if ($candidate -notlike '*7zSD.sfx') {
                Write-Warning "7zSD.sfx not found; falling back to $(Split-Path -Leaf $candidate)"
            }
            return $candidate
        }
    }
    throw '7-Zip SFX module not found (expected 7zSD.sfx or 7z.sfx next to 7z.exe).'
}

function Invoke-NativeCommand {
    param(
        [Parameter(Mandatory = $true)][string]$Label,
        [Parameter(Mandatory = $true)][scriptblock]$Command
    )

    & $Command
    if ($LASTEXITCODE -ne 0) {
        throw "$Label failed with exit code $LASTEXITCODE"
    }
}

$releaseDir = Join-Path $Workspace 'build\windows\x64\runner\Release'
$portableZip = Join-Path $Workspace "astra-windows-$Version-portable.zip"
$standaloneExe = Join-Path $Workspace "astra-windows-$Version-standalone.exe"
$issFile = Join-Path $Workspace 'windows\installer\astra.iss'

if (-not (Test-Path $releaseDir)) {
    throw "Release directory not found: $releaseDir"
}

Write-Host "Creating portable zip..."
if (Test-Path $portableZip) {
    Remove-Item $portableZip -Force
}
Compress-Archive -Path "$releaseDir\*" -DestinationPath $portableZip

Write-Host "Creating installer..."
$iscc = Join-Path ${env:ProgramFiles(x86)} 'Inno Setup 6\ISCC.exe'
if (-not (Test-Path $iscc)) {
    $iscc = Join-Path $env:ProgramFiles 'Inno Setup 6\ISCC.exe'
}
if (-not (Test-Path $iscc)) {
    throw 'Inno Setup compiler (ISCC.exe) not found. Install Inno Setup 6.'
}

$issSourceDir = Convert-ToIssPath $releaseDir
$issOutputDir = Convert-ToIssPath $Workspace
Write-Host "ISCC SourceDir=$issSourceDir OutputDir=$issOutputDir Version=$Version"

Invoke-NativeCommand -Label 'Inno Setup compile' -Command {
    & $iscc "/DMyAppVersion=$Version" "/DSourceDir=$issSourceDir" "/DOutputDir=$issOutputDir" $issFile
}

Write-Host "Creating standalone SFX executable..."
$sevenZip = Resolve-SevenZip
$sfxModule = Resolve-SevenZipSfxModule -SevenZipExe $sevenZip

$archive7z = Join-Path $Workspace ".astra-windows-$Version.7z"
$sfxConfig = Join-Path $Workspace '.sfx-config.txt'
if (Test-Path $archive7z) {
    Remove-Item $archive7z -Force
}
if (Test-Path $standaloneExe) {
    Remove-Item $standaloneExe -Force
}

Invoke-NativeCommand -Label '7-Zip archive' -Command {
    & $sevenZip a -mx9 $archive7z "$releaseDir\*"
}

@'
;!@Install@!UTF-8!
Title="Astra"
BeginPrompt="Extract Astra to a temporary folder and run?"
RunProgram="astra.exe"
GUIMode="2"
;!@InstallEnd@!
'@ | Out-File -FilePath $sfxConfig -Encoding ascii

Invoke-NativeCommand -Label 'SFX assembly' -Command {
    cmd /c "copy /b `"$sfxModule`" + `"$sfxConfig`" + `"$archive7z`" `"$standaloneExe`""
}

Remove-Item $archive7z, $sfxConfig -Force -ErrorAction SilentlyContinue

Write-Host "Windows artifacts:"
Get-ChildItem $Workspace -Filter "astra-windows-$Version*" | ForEach-Object { Write-Host "  $($_.Name)" }
