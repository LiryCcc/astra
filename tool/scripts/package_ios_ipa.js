import { printUsageAndExit } from '../lib/cli.js';
import { packageIosIpa } from '../lib/package_ios.js';
import { resolveReleaseVersion } from '../lib/resolve_release_version.js';
import { resolveReleaseTag, resolveWorkspace } from '../lib/workspace.js';

const main = () => {
  const argv = process.argv.slice(2);
  const releaseTag = resolveReleaseTag(argv, 0);
  if (!releaseTag) {
    printUsageAndExit(import.meta.filename, '<release-tag> [workspace]');
  }

  const workspace = resolveWorkspace(argv, 1);
  const version = resolveReleaseVersion(releaseTag);

  packageIosIpa({ version, workspace });
};

main();
