import {
  appendFileSync,
  chmodSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync
} from 'node:fs';
import { basename, join } from 'node:path';

import { run } from './process_utils.js';

/** @typedef {import('./types.js').PackageReleaseOptions} PackageReleaseOptions */

const STANDALONE_HEADER = `#!/bin/bash
set -euo pipefail
DIR="$(mktemp -d -t astra-extract)"
trap 'rm -rf "$DIR"' EXIT
ARCHIVE_LINE=$(awk '/^__ARCHIVE_BELOW__/ {print NR + 1; exit 0; }' "$0")
tail -n +"\${ARCHIVE_LINE}" "$0" | tar xzf - -C "$DIR"
open "$DIR/astra.app"
`;

/**
 * @param {string} workspace
 * @returns {{ appDir: string, appPath: string }}
 */
const resolveMacosAppBundle = (workspace) => {
  if (process.platform !== 'darwin') {
    throw new Error('macOS packaging is only supported on macOS');
  }

  const appDir = join(workspace, 'build/macos/Build/Products/Release');
  const appPath = join(appDir, 'astra.app');

  if (!existsSync(appPath)) {
    throw new Error(`App bundle not found: ${appPath}`);
  }

  return { appDir, appPath };
};

/**
 * @param {PackageReleaseOptions} options
 * @returns {void}
 */
export const packageMacosZip = ({ version, workspace }) => {
  const { appDir } = resolveMacosAppBundle(workspace);
  const output = join(workspace, `astra-macos-${version}-portable.zip`);

  console.log('Creating portable zip...');
  run('zip', ['-yr', output, 'astra.app'], { cwd: appDir });
  console.log(`Created ${basename(output)}`);
};

/**
 * @param {PackageReleaseOptions} options
 * @returns {void}
 */
export const packageMacosDmg = ({ version, workspace }) => {
  const { appDir } = resolveMacosAppBundle(workspace);
  const output = join(workspace, `astra-macos-${version}.dmg`);
  const dmgStaging = join(workspace, '.dmg-staging');

  console.log('Creating DMG installer...');
  rmSync(dmgStaging, { recursive: true, force: true });
  mkdirSync(dmgStaging, { recursive: true });
  run('cp', ['-R', 'astra.app', dmgStaging], { cwd: appDir });
  symlinkSync('/Applications', join(dmgStaging, 'Applications'));
  run('hdiutil', ['create', '-volname', 'Astra', '-srcfolder', dmgStaging, '-ov', '-format', 'UDZO', output]);
  rmSync(dmgStaging, { recursive: true, force: true });
  console.log(`Created ${basename(output)}`);
};

/**
 * @param {PackageReleaseOptions} options
 * @returns {void}
 */
export const packageMacosStandalone = ({ version, workspace }) => {
  const { appDir } = resolveMacosAppBundle(workspace);
  const tarPath = join(workspace, `.astra-macos-${version}.tar.gz`);
  const output = join(workspace, `astra-macos-${version}-standalone.run`);

  console.log('Creating standalone self-extracting archive...');
  run('tar', ['czf', tarPath, 'astra.app'], { cwd: appDir });

  writeFileSync(output, STANDALONE_HEADER, { encoding: 'utf8' });
  chmodSync(output, 0o755);
  appendFileSync(output, '__ARCHIVE_BELOW__\n');
  appendFileSync(output, readFileSync(tarPath));
  rmSync(tarPath, { force: true });
  console.log(`Created ${basename(output)}`);
};

/** @typedef {'zip' | 'dmg' | 'standalone'} MacosPackageTarget */

/**
 * @param {PackageReleaseOptions & { target: MacosPackageTarget }} options
 * @returns {void}
 */
export const packageMacosArtifact = ({ version, workspace, target }) => {
  switch (target) {
    case 'zip':
      packageMacosZip({ version, workspace });
      return;
    case 'dmg':
      packageMacosDmg({ version, workspace });
      return;
    case 'standalone':
      packageMacosStandalone({ version, workspace });
      return;
    default:
      throw new Error(`Unsupported macOS package target: ${target}`);
  }
};

/**
 * Package all macOS release artifacts.
 *
 * @param {PackageReleaseOptions} options
 * @returns {void}
 */
export const packageMacosRelease = ({ version, workspace }) => {
  packageMacosZip({ version, workspace });
  packageMacosDmg({ version, workspace });
  packageMacosStandalone({ version, workspace });
};
