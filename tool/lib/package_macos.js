import {
  appendFileSync,
  chmodSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  symlinkSync,
  writeFileSync
} from 'node:fs';
import { join } from 'node:path';

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
 * Package macOS release artifacts: portable zip, DMG, and standalone `.run`.
 *
 * @param {PackageReleaseOptions} options
 * @returns {void}
 */
export const packageMacosRelease = ({ version, workspace }) => {
  if (process.platform !== 'darwin') {
    throw new Error('package_macos_release is only supported on macOS');
  }

  const appDir = join(workspace, 'build/macos/Build/Products/Release');
  const appPath = join(appDir, 'astra.app');

  if (!existsSync(appPath)) {
    throw new Error(`App bundle not found: ${appPath}`);
  }

  console.log('Creating portable zip...');
  run('zip', ['-yr', join(workspace, `astra-macos-${version}-portable.zip`), 'astra.app'], {
    cwd: appDir
  });

  console.log('Creating DMG installer...');
  const dmgStaging = join(workspace, '.dmg-staging');
  rmSync(dmgStaging, { recursive: true, force: true });
  mkdirSync(dmgStaging, { recursive: true });
  run('cp', ['-R', 'astra.app', dmgStaging], { cwd: appDir });
  symlinkSync('/Applications', join(dmgStaging, 'Applications'));
  run('hdiutil', [
    'create',
    '-volname',
    'Astra',
    '-srcfolder',
    dmgStaging,
    '-ov',
    '-format',
    'UDZO',
    join(workspace, `astra-macos-${version}.dmg`)
  ]);
  rmSync(dmgStaging, { recursive: true, force: true });

  console.log('Creating standalone self-extracting archive...');
  const tarPath = join(workspace, `.astra-macos-${version}.tar.gz`);
  const standalone = join(workspace, `astra-macos-${version}-standalone.run`);
  run('tar', ['czf', tarPath, 'astra.app'], { cwd: appDir });

  writeFileSync(standalone, STANDALONE_HEADER, { encoding: 'utf8' });
  chmodSync(standalone, 0o755);
  appendFileSync(standalone, '__ARCHIVE_BELOW__\n');
  appendFileSync(standalone, readFileSync(tarPath));
  rmSync(tarPath, { force: true });

  console.log('macOS artifacts:');
  for (const entry of readdirSync(workspace)) {
    if (entry.startsWith(`astra-macos-${version}`)) {
      console.log(`  ${entry}`);
    }
  }
};
