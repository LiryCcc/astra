import { spawnSync } from 'node:child_process';

/** @typedef {import('./types.js').SpawnSyncOptions} SpawnSyncOptions */

/**
 * Run a command and throw when it exits with a non-zero status.
 *
 * @param {string} command Executable name or path.
 * @param {readonly string[]} [args] Command arguments.
 * @param {SpawnSyncOptions} [options] `spawnSync` options.
 * @returns {import('node:child_process').SpawnSyncReturns<string | Buffer>}
 */
export const run = (command, args = [], options = {}) => {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    ...options
  });

  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    throw new Error(`${command} failed with exit code ${result.status ?? 'unknown'}`);
  }

  return result;
};

/**
 * Run a shell command string and throw when it exits with a non-zero status.
 *
 * @param {string} command Shell command.
 * @param {SpawnSyncOptions} [options] `spawnSync` options.
 * @returns {import('node:child_process').SpawnSyncReturns<string | Buffer>}
 */
export const runShell = (command, options = {}) => {
  const result = spawnSync(command, {
    shell: true,
    stdio: 'inherit',
    ...options
  });

  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    throw new Error(`Command failed with exit code ${result.status ?? 'unknown'}: ${command}`);
  }

  return result;
};
