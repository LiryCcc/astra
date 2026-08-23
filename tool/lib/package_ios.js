import { existsSync, mkdirSync, renameSync, rmSync } from 'node:fs';
import { basename, join } from 'node:path';

import { findIosAppBundle } from './find_build_output.js';
import { run } from './process_utils.js';

/** @typedef {import('./types.js').PackageReleaseOptions} PackageReleaseOptions */

/**
 * Package an unsigned iOS IPA from the Flutter build output.
 *
 * @param {PackageReleaseOptions} options
 * @returns {void}
 */
export const packageIosIpa = ({ version, workspace }) => {
  if (process.platform !== 'darwin') {
    throw new Error('package_ios_ipa is only supported on macOS');
  }

  const { buildDir: iosBuildDir, appName } = findIosAppBundle(workspace);
  const runnerApp = join(iosBuildDir, appName);
  const payloadDir = join(iosBuildDir, 'Payload');
  const ipaName = `astra-ios-unsigned-${version}.ipa`;
  const outputIpa = join(workspace, ipaName);
  const stagedIpa = join(iosBuildDir, ipaName);

  if (!existsSync(runnerApp)) {
    throw new Error(`App bundle not found: ${runnerApp}`);
  }

  rmSync(payloadDir, { recursive: true, force: true });
  mkdirSync(payloadDir, { recursive: true });
  run('cp', ['-R', runnerApp, join(payloadDir, appName)]);
  run('zip', ['-r', ipaName, 'Payload'], { cwd: iosBuildDir });
  rmSync(outputIpa, { force: true });
  renameSync(stagedIpa, outputIpa);

  console.log(`Created ${basename(outputIpa)}`);
};
