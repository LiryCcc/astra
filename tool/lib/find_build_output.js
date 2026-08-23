import { existsSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Return the first existing path from a candidate list.
 *
 * @param {readonly string[]} candidates Absolute paths to check.
 * @param {string} label Human-readable artifact label for errors.
 * @returns {string}
 */
export const findExistingPath = (candidates, label) => {
  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      return candidate;
    }
  }

  throw new Error(
    `${label} not found. Checked:\n${candidates.map((candidate) => `  - ${candidate}`).join('\n')}`
  );
};

/**
 * Locate the Flutter Android release APK across known Gradle output layouts.
 *
 * @param {string} workspace Repository root.
 * @returns {string} Absolute path to the release APK.
 */
export const findAndroidReleaseApk = (workspace) =>
  findExistingPath(
    [
      join(workspace, 'build/app/outputs/flutter-apk/app-release.apk'),
      join(workspace, 'build/app/outputs/apk/release/app-release.apk'),
      join(workspace, 'android/app/build/outputs/apk/release/app-release.apk')
    ],
    'Android release APK'
  );

/**
 * Locate the built iOS app bundle across known Flutter/Xcode output layouts.
 *
 * @param {string} workspace Repository root.
 * @returns {{ appPath: string, buildDir: string, appName: string }}
 */
export const findIosAppBundle = (workspace) => {
  const candidates = [
    { buildDir: join(workspace, 'build/ios/iphoneos'), appName: 'Runner.app' },
    { buildDir: join(workspace, 'build/ios/Release-iphoneos'), appName: 'Runner.app' }
  ];

  for (const { buildDir, appName } of candidates) {
    const appPath = join(buildDir, appName);
    if (existsSync(appPath)) {
      return { appPath, buildDir, appName };
    }
  }

  throw new Error(
    `iOS app bundle not found. Checked:\n${candidates
      .map(({ buildDir, appName }) => `  - ${join(buildDir, appName)}`)
      .join('\n')}`
  );
};
