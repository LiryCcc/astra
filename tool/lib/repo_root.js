import { resolve } from 'node:path';

/**
 * Resolve the repository root from a script entry file location.
 *
 * @param {string} scriptDir `import.meta.dirname` of a file under `tool/scripts/`.
 * @returns {string} Absolute path to the repository root.
 */
export const getRepoRootFromScriptDir = (scriptDir) => resolve(scriptDir, '../..');
