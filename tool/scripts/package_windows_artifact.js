import { printUsageAndExit } from '../lib/cli.js';
import { packageWindowsArtifact } from '../lib/package_windows.js';
import { resolveReleaseVersion } from '../lib/resolve_release_version.js';
import { resolveReleaseTag, resolveWorkspace } from '../lib/workspace.js';

/** @typedef {import('../lib/package_windows.js').WindowsPackageTarget} WindowsPackageTarget */

const TARGETS = /** @type {const} */ (['zip', 'setup', 'standalone']);

/**
 * @param {string | undefined} value
 * @returns {WindowsPackageTarget}
 */
const resolveTarget = (value) => {
  const target = value ?? process.env.ASTRA_PACKAGE_TARGET;
  if (!target || !TARGETS.includes(/** @type {WindowsPackageTarget} */ (target))) {
    throw new Error(`Package target must be one of: ${TARGETS.join(', ')}`);
  }
  return /** @type {WindowsPackageTarget} */ (target);
};

const main = () => {
  const argv = process.argv.slice(2);
  const releaseTag = resolveReleaseTag(argv, 0);
  if (!releaseTag) {
    printUsageAndExit(import.meta.filename, '<release-tag> [workspace] [zip|setup|standalone]');
  }

  const workspace = resolveWorkspace(argv, 1);
  const target = resolveTarget(argv[2]);
  const version = resolveReleaseVersion(releaseTag);

  packageWindowsArtifact({ version, workspace, target });
};

main();
