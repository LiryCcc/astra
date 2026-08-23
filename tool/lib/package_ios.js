import { existsSync, mkdirSync, rmSync } from 'node:fs';
import { basename, join } from 'node:path';

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

  const iosBuildDir = join(workspace, 'build/ios/iphoneos');
  const runnerApp = join(iosBuildDir, 'Runner.app');
  const payloadDir = join(iosBuildDir, 'Payload');
  const outputIpa = join(workspace, `astra-ios-unsigned-${version}.ipa`);

  if (!existsSync(runnerApp)) {
    throw new Error(`Runner.app not found: ${runnerApp}`);
  }

  rmSync(payloadDir, { recursive: true, force: true });
  mkdirSync(payloadDir, { recursive: true });
  run('cp', ['-R', runnerApp, join(payloadDir, 'Runner.app')]);
  run('zip', ['-r', outputIpa, 'Payload'], { cwd: iosBuildDir });

  console.log(`Created ${basename(outputIpa)}`);
};
