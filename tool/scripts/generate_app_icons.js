import { generateAppIcons } from '../lib/generate_app_icons.js';
import { getRepoRootFromScriptDir } from '../lib/repo_root.js';

const main = async () => {
  const workspace = process.argv[2] ?? getRepoRootFromScriptDir(import.meta.dirname);
  await generateAppIcons(workspace);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
