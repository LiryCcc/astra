import { requireArg, printUsageAndExit } from '../lib/cli.js';
import { verifyStaticLink } from '../lib/static_link.js';

const main = () => {
  const argv = process.argv.slice(2);
  if (argv.length < 1) {
    printUsageAndExit(import.meta.filename, '<workspace>');
  }

  const workspace = requireArg(argv, 0, 'workspace');
  verifyStaticLink(workspace);
};

main();
