import { copyFileSync } from 'node:fs';
import { basename, join } from 'node:path';

import { findAndroidReleaseApk } from './find_build_output.js';

/** @typedef {import('./types.js').PackageReleaseOptions} PackageReleaseOptions */

/**
 * Rename the Flutter Android APK using a resolved release version.
 *
 * @param {PackageReleaseOptions} options
 * @returns {void}
 */
export const renameAndroidApk = ({ version, workspace }) => {
  const sourceApk = findAndroidReleaseApk(workspace);
  const targetApk = join(workspace, `astra-android-${version}.apk`);

  copyFileSync(sourceApk, targetApk);
  console.log(`Created ${basename(targetApk)} from ${basename(sourceApk)}`);
};
