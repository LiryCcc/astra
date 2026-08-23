import { printUsageAndExit } from '../lib/cli.js';
import { packageMacosArtifact } from '../lib/package_macos.js';
import { resolveReleaseVersion } from '../lib/resolve_release_version.js';
import { resolveReleaseTag, resolveWorkspace } from '../lib/workspace.js';

/** @typedef {import('../lib/package_macos.js').MacosPackageTarget} MacosPackageTarget */

const TARGETS = /** @type {const} */ (['zip', 'dmg', 'standalone']);

/**
 * @param {string | undefined} value
 * @returns {MacosPackageTarget}
 */
const resolveTarget = (value) => {
  const target = value ?? process.env.ASTRA_PACKAGE_TARGET;
  if (!target || !TARGETS.includes(/** @type {MacosPackageTarget} */ (target))) {
    throw new Error(`Package target must be one of: ${TARGETS.join(', ')}`);
  }
  return /** @type {MacosPackageTarget} */ (target);
};

const main = () => {
  const argv = process.argv.slice(2);
  const releaseTag = resolveReleaseTag(argv, 0);
  if (!releaseTag) {
    printUsageAndExit(import.meta.filename, '<release-tag> [workspace] [zip|dmg|standalone]');
  }

  const workspace = resolveWorkspace(argv, 1);
  const target = resolveTarget(argv[2]);
  const version = resolveReleaseVersion(releaseTag);

  packageMacosArtifact({ version, workspace, target });
};

main();
