import { runDartChecks } from '../lib/check.js';
import { getRepoRootFromScriptDir } from '../lib/repo_root.js';

const main = () => {
  const workspace = process.argv[2] ?? getRepoRootFromScriptDir(import.meta.dirname);
  runDartChecks(workspace);
};

main();
