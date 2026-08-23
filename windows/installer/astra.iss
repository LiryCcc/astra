#ifndef MyAppVersion
  #define MyAppVersion "1.0.0"
#endif

#ifndef SourceDir
  #define SourceDir "build/windows/x64/runner/Release"
#endif

#ifndef OutputDir
  #define OutputDir "."
#endif

[Setup]
AppId={{F8E3A1B2-4C5D-6E7F-8A9B-0C1D2E3F4A5B}
AppName=Astra
AppVersion={#MyAppVersion}
DefaultDirName={autopf}\Astra
DefaultGroupName=Astra
OutputDir={#OutputDir}
OutputBaseFilename=astra-windows-{#MyAppVersion}-setup
Compression=lzma2
SolidCompression=yes
ArchitecturesInstallIn64BitMode=x64
PrivilegesRequired=lowest
WizardStyle=modern

[Files]
Source: "{#SourceDir}\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{group}\Astra"; Filename: "{app}\astra.exe"
Name: "{autodesktop}\Astra"; Filename: "{app}\astra.exe"; Tasks: desktopicon

[Tasks]
Name: "desktopicon"; Description: "Create a &desktop icon"; GroupDescription: "Additional icons:"; Flags: unchecked

[Run]
Filename: "{app}\astra.exe"; Description: "Launch Astra"; Flags: nowait postinstall skipifsilent
