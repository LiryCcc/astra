import { existsSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';

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
 * @param {string} workspace
 * @returns {string}
 */
const resolveWindowsReleaseDir = (workspace) => {
  if (process.platform !== 'win32') {
    throw new Error('Windows packaging is only supported on Windows');
  }

  const releaseDir = join(workspace, 'build/windows/x64/runner/Release');
  if (!existsSync(releaseDir)) {
    throw new Error(`Release directory not found: ${releaseDir}`);
  }

  return releaseDir;
};

/**
 * @param {PackageReleaseOptions} options
 * @returns {void}
 */
export const packageWindowsZip = ({ version, workspace }) => {
  const releaseDir = resolveWindowsReleaseDir(workspace);
  const portableZip = join(workspace, `astra-windows-${version}-portable.zip`);

  console.log('Creating portable zip...');
  if (existsSync(portableZip)) {
    rmSync(portableZip, { force: true });
  }

  const zipSource = join(releaseDir, '*').replaceAll('/', '\\');
  const zipDest = portableZip.replaceAll('/', '\\');
  runShell(
    `powershell -NoProfile -Command "Compress-Archive -Path '${zipSource}' -DestinationPath '${zipDest}' -Force"`
  );
  console.log(`Created ${basename(portableZip)}`);
};

/**
 * @param {PackageReleaseOptions} options
 * @returns {void}
 */
export const packageWindowsSetup = ({ version, workspace }) => {
  const releaseDir = resolveWindowsReleaseDir(workspace);
  const issFile = join(workspace, 'windows/installer/astra.iss');

  console.log('Creating installer...');
  const iscc = resolveIscc();
  const issSourceDir = convertToIssPath(releaseDir);
  const issOutputDir = convertToIssPath(workspace);
  run(iscc, [`/DMyAppVersion=${version}`, `/DSourceDir=${issSourceDir}`, `/DOutputDir=${issOutputDir}`, issFile]);
  console.log(`Created astra-windows-${version}-setup.exe`);
};

/**
 * @param {PackageReleaseOptions} options
 * @returns {void}
 */
export const packageWindowsStandalone = ({ version, workspace }) => {
  const releaseDir = resolveWindowsReleaseDir(workspace);
  const standaloneExe = join(workspace, `astra-windows-${version}-standalone.exe`);
  const archive7z = join(workspace, `.astra-windows-${version}.7z`);
  const sfxConfig = join(workspace, '.sfx-config.txt');

  console.log('Creating standalone SFX executable...');
  const sevenZip = resolveSevenZip();
  const sfxModule = resolveSevenZipSfxModule(sevenZip);

  for (const filePath of [archive7z, standaloneExe, sfxConfig]) {
    if (existsSync(filePath)) {
      rmSync(filePath, { force: true });
    }
  }

  run(sevenZip, ['a', '-mx9', archive7z, join(releaseDir, '*')]);
  writeFileSync(sfxConfig, SFX_CONFIG, { encoding: 'ascii' });
  runShell(`cmd /c copy /b "${sfxModule}" + "${sfxConfig}" + "${archive7z}" "${standaloneExe}"`);

  for (const filePath of [archive7z, sfxConfig]) {
    rmSync(filePath, { force: true });
  }

  console.log(`Created ${basename(standaloneExe)}`);
};

/** @typedef {'zip' | 'setup' | 'standalone'} WindowsPackageTarget */

/**
 * @param {PackageReleaseOptions & { target: WindowsPackageTarget }} options
 * @returns {void}
 */
export const packageWindowsArtifact = ({ version, workspace, target }) => {
  switch (target) {
    case 'zip':
      packageWindowsZip({ version, workspace });
      return;
    case 'setup':
      packageWindowsSetup({ version, workspace });
      return;
    case 'standalone':
      packageWindowsStandalone({ version, workspace });
      return;
    default:
      throw new Error(`Unsupported Windows package target: ${target}`);
  }
};

/**
 * Package all Windows release artifacts.
 *
 * @param {PackageReleaseOptions} options
 * @returns {void}
 */
export const packageWindowsRelease = ({ version, workspace }) => {
  packageWindowsZip({ version, workspace });
  packageWindowsSetup({ version, workspace });
  packageWindowsStandalone({ version, workspace });

  console.log('Windows artifacts:');
  for (const entry of readdirSync(workspace)) {
    if (entry.startsWith(`astra-windows-${version}`)) {
      console.log(`  ${entry}`);
    }
  }
};
