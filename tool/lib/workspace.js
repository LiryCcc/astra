import { requireArg } from './cli.js';

/**
 * Resolve the repository workspace from env, CLI args, or the current directory.
 *
 * @param {readonly string[]} argv CLI args after the script name.
 * @param {number} [index] Positional workspace argument index.
 * @returns {string}
 */
export const resolveWorkspace = (argv, index = 0) => process.env.ASTRA_WORKSPACE ?? argv[index] ?? process.cwd();

/**
 * Resolve the release tag from env or CLI args.
 *
 * @param {readonly string[]} argv CLI args after the script name.
 * @param {number} [index] Positional release-tag argument index.
 * @returns {string}
 */
export const resolveReleaseTag = (argv, index = 0) =>
  process.env.ASTRA_RELEASE_TAG ?? requireArg(argv, index, 'release-tag');
