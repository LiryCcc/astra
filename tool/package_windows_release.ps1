# Package Windows release artifacts: portable zip, installer, and standalone SFX exe.
param(
    [Parameter(Mandatory = $true)]
    [string]$Version,

    [Parameter(Mandatory = $true)]
    [string]$Workspace
)

$ErrorActionPreference = 'Stop'

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
& $iscc "/DMyAppVersion=$Version" "/DSourceDir=$releaseDir" "/DOutputDir=$Workspace" $issFile

Write-Host "Creating standalone SFX executable..."
$sevenZip = Join-Path $env:ProgramFiles '7-Zip\7z.exe'
$sfxModule = Join-Path $env:ProgramFiles '7-Zip\7zSD.sfx'
if (-not (Test-Path $sevenZip)) {
    throw '7-Zip not found. Install 7-Zip.'
}
if (-not (Test-Path $sfxModule)) {
    throw '7-Zip SFX module (7zSD.sfx) not found.'
}

$archive7z = Join-Path $Workspace ".astra-windows-$Version.7z"
$sfxConfig = Join-Path $Workspace '.sfx-config.txt'
if (Test-Path $archive7z) {
    Remove-Item $archive7z -Force
}
if (Test-Path $standaloneExe) {
    Remove-Item $standaloneExe -Force
}

& $sevenZip a -mx9 $archive7z "$releaseDir\*" | Out-Host

@'
;!@Install@!UTF-8!
Title="Astra"
BeginPrompt="Extract Astra to a temporary folder and run?"
RunProgram="astra.exe"
GUIMode="2"
;!@InstallEnd@!
'@ | Out-File -FilePath $sfxConfig -Encoding ascii

cmd /c "copy /b `"$sfxModule`" + `"$sfxConfig`" + `"$archive7z`" `"$standaloneExe`"" | Out-Host

Remove-Item $archive7z, $sfxConfig -Force -ErrorAction SilentlyContinue

Write-Host "Windows artifacts:"
Get-ChildItem $Workspace -Filter "astra-windows-$Version*" | ForEach-Object { Write-Host "  $($_.Name)" }
