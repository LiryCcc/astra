import { verifyStaticLink } from '../lib/static_link.js';
import { resolveWorkspace } from '../lib/workspace.js';

const main = () => {
  const argv = process.argv.slice(2);
  verifyStaticLink(resolveWorkspace(argv, 0));
};

main();
