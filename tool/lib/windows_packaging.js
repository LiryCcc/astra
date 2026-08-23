import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';

import { run } from './process_utils.js';

/** @typedef {import('./types.js').WindowsPackagingTools} WindowsPackagingTools */

/**
 * Convert a Windows path for Inno Setup `/D` defines (forward slashes only).
 *
 * @param {string} value Filesystem path.
 * @returns {string}
 */
export const convertToIssPath = (value) => value.replaceAll('\\', '/');

/**
 * @param {readonly string[]} candidates
 * @param {string} label Tool label for error messages.
 * @returns {string}
 */
const firstExistingPath = (candidates, label) => {
  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      return candidate;
    }
  }
  throw new Error(`${label} not found`);
};

/**
 * Locate Inno Setup compiler on Windows.
 *
 * @returns {string} Absolute path to `ISCC.exe`.
 */
export const resolveIscc = () =>
  firstExistingPath(
    [
      join(process.env['ProgramFiles(x86)'] ?? '', 'Inno Setup 6/ISCC.exe'),
      join(process.env.ProgramFiles ?? '', 'Inno Setup 6/ISCC.exe')
    ],
    'Inno Setup compiler (ISCC.exe)'
  );

/**
 * Locate 7-Zip executable on Windows.
 *
 * @returns {string} Absolute path to `7z.exe`.
 */
export const resolveSevenZip = () =>
  firstExistingPath(
    [
      join(process.env.ProgramFiles ?? '', '7-Zip/7z.exe'),
      join(process.env['ProgramFiles(x86)'] ?? '', '7-Zip/7z.exe')
    ],
    '7-Zip (7z.exe)'
  );

/**
 * Locate a 7-Zip SFX module next to `7z.exe`.
 *
 * @param {string} sevenZipExe Absolute path to `7z.exe`.
 * @returns {string} Absolute path to `7zSD.sfx` or `7z.sfx`.
 */
export const resolveSevenZipSfxModule = (sevenZipExe) => {
  const sevenZipDir = dirname(sevenZipExe);
  const sfxSd = join(sevenZipDir, '7zSD.sfx');
  if (existsSync(sfxSd)) {
    return sfxSd;
  }

  const sfx = join(sevenZipDir, '7z.sfx');
  if (existsSync(sfx)) {
    console.warn('7zSD.sfx not found; falling back to 7z.sfx');
    return sfx;
  }

  throw new Error('7-Zip SFX module not found (expected 7zSD.sfx or 7z.sfx next to 7z.exe)');
};

/**
 * Resolve Inno Setup and 7-Zip tooling required for Windows packaging.
 *
 * @returns {WindowsPackagingTools}
 */
export const resolveWindowsPackagingTools = () => {
  const sevenZip = resolveSevenZip();
  return {
    iscc: resolveIscc(),
    sevenZip,
    sfxModule: resolveSevenZipSfxModule(sevenZip)
  };
};

/**
 * Install Inno Setup and 7-Zip via Chocolatey, then verify they are available.
 *
 * @returns {WindowsPackagingTools}
 */
export const installWindowsPackagingTools = () => {
  if (process.platform !== 'win32') {
    throw new Error('install_windows_packaging_tools is only supported on Windows');
  }

  run('choco', ['install', 'innosetup', '7zip.install', '-y', '--no-progress']);
  const tools = resolveWindowsPackagingTools();
  console.log(`Packaging tools OK: ISCC=${tools.iscc} 7z=${tools.sevenZip} sfx=${tools.sfxModule}`);
  return tools;
};

/**
 * Verify Inno Setup and 7-Zip are installed without installing them.
 *
 * @returns {WindowsPackagingTools}
 */
export const verifyWindowsPackagingTools = () => {
  const tools = resolveWindowsPackagingTools();
  console.log(`Packaging tools OK: ISCC=${tools.iscc} 7z=${tools.sevenZip} sfx=${tools.sfxModule}`);
  return tools;
};
