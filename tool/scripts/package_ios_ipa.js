import { requireArg, printUsageAndExit } from '../lib/cli.js';
import { packageIosIpa } from '../lib/package_ios.js';
import { resolveReleaseVersion } from '../lib/resolve_release_version.js';
import { getRepoRootFromScriptDir } from '../lib/repo_root.js';

const main = () => {
  const argv = process.argv.slice(2);
  if (argv.length < 1) {
    printUsageAndExit(import.meta.filename, '<release-tag> [workspace]');
  }

  const releaseTag = requireArg(argv, 0, 'release-tag');
  const workspace = argv[1] ?? getRepoRootFromScriptDir(import.meta.dirname);
  const version = resolveReleaseVersion(releaseTag);

  packageIosIpa({ version, workspace });
};

main();
