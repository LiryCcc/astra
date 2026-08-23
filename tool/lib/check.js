import { generateAppIcons } from './generate_app_icons.js';
import { run } from './process_utils.js';

/**
 * Run icon generation and Dart format, analyze, and Flutter tests.
 *
 * @param {string} [workspace] Working directory; defaults to `process.cwd()`.
 * @returns {Promise<void>}
 */
export const runChecks = async (workspace = process.cwd()) => {
  console.log('Generating app icons...');
  await generateAppIcons(workspace);

  console.log('Checking Dart formatting...');
  run('dart', ['format', '--output=none', '--set-exit-if-changed', '--line-length=120', '.'], { cwd: workspace });

  console.log('Running dart analyze...');
  run('dart', ['analyze', '--fatal-infos'], { cwd: workspace });

  console.log('Running flutter test...');
  run('flutter', ['test'], { cwd: workspace });

  console.log('All checks passed.');
};

/**
 * @param {string} [workspace]
 * @returns {Promise<void>}
 */
export const runDartChecks = runChecks;

