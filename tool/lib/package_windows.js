import { existsSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { run, runShell } from './process_utils.js';
import { convertToIssPath, resolveIscc, resolveSevenZip, resolveSevenZipSfxModule } from './windows_packaging.js';

/** @typedef {import('./types.js').PackageReleaseOptions} PackageReleaseOptions */

const SFX_CONFIG = `;!@Install@!UTF-8!
Title="Astra"
BeginPrompt="Extract Astra to a temporary folder and run?"
RunProgram="astra.exe"
GUIMode="2"
;!@InstallEnd@!
`;

/**
 * Package Windows release artifacts: portable zip, installer, and standalone SFX exe.
 *
 * @param {PackageReleaseOptions} options
 * @returns {void}
 */
export const packageWindowsRelease = ({ version, workspace }) => {
  if (process.platform !== 'win32') {
    throw new Error('package_windows_release is only supported on Windows');
  }

  const releaseDir = join(workspace, 'build/windows/x64/runner/Release');
  const portableZip = join(workspace, `astra-windows-${version}-portable.zip`);
  const standaloneExe = join(workspace, `astra-windows-${version}-standalone.exe`);
  const issFile = join(workspace, 'windows/installer/astra.iss');

  if (!existsSync(releaseDir)) {
    throw new Error(`Release directory not found: ${releaseDir}`);
  }

  console.log('Creating portable zip...');
  if (existsSync(portableZip)) {
    rmSync(portableZip, { force: true });
  }
  const zipSource = join(releaseDir, '*').replaceAll('/', '\\');
  const zipDest = portableZip.replaceAll('/', '\\');
  runShell(
    `powershell -NoProfile -Command "Compress-Archive -Path '${zipSource}' -DestinationPath '${zipDest}' -Force"`
  );

  console.log('Creating installer...');
  const iscc = resolveIscc();
  const issSourceDir = convertToIssPath(releaseDir);
  const issOutputDir = convertToIssPath(workspace);
  console.log(`ISCC SourceDir=${issSourceDir} OutputDir=${issOutputDir} Version=${version}`);
  run(iscc, [`/DMyAppVersion=${version}`, `/DSourceDir=${issSourceDir}`, `/DOutputDir=${issOutputDir}`, issFile]);

  console.log('Creating standalone SFX executable...');
  const sevenZip = resolveSevenZip();
  const sfxModule = resolveSevenZipSfxModule(sevenZip);
  const archive7z = join(workspace, `.astra-windows-${version}.7z`);
  const sfxConfig = join(workspace, '.sfx-config.txt');

  for (const filePath of [archive7z, standaloneExe]) {
    if (existsSync(filePath)) {
      rmSync(filePath, { force: true });
    }
  }

  run(sevenZip, ['a', '-mx9', archive7z, join(releaseDir, '*')]);
  writeFileSync(sfxConfig, SFX_CONFIG, { encoding: 'ascii' });

  const copyCommand = `copy /b "${sfxModule}" + "${sfxConfig}" + "${archive7z}" "${standaloneExe}"`;
  runShell(`cmd /c ${copyCommand}`);

  for (const filePath of [archive7z, sfxConfig]) {
    rmSync(filePath, { force: true });
  }

  console.log('Windows artifacts:');
  for (const entry of readdirSync(workspace)) {
    if (entry.startsWith(`astra-windows-${version}`)) {
      console.log(`  ${entry}`);
    }
  }
};
