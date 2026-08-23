import { copyFileSync, existsSync } from 'node:fs';
import { basename, join } from 'node:path';

/** @typedef {import('./types.js').PackageReleaseOptions} PackageReleaseOptions */

/**
 * Rename the Flutter Android APK using a resolved release version.
 *
 * @param {PackageReleaseOptions} options
 * @returns {void}
 */
export const renameAndroidApk = ({ version, workspace }) => {
  const sourceApk = join(workspace, 'build/app/outputs/flutter-apk/app-release.apk');
  const targetApk = join(workspace, `astra-android-${version}.apk`);

  if (!existsSync(sourceApk)) {
    throw new Error(`APK not found: ${sourceApk}`);
  }

  copyFileSync(sourceApk, targetApk);
  console.log(`Created ${basename(targetApk)}`);
};
