import { runChecks } from '../lib/check.js';
import { getRepoRootFromScriptDir } from '../lib/repo_root.js';

const main = async () => {
  const workspace = process.argv[2] ?? getRepoRootFromScriptDir(import.meta.dirname);
  await runChecks(workspace);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
