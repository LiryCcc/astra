import { run } from './process_utils.js';

/**
 * Run Dart format, analyze, and Flutter tests (CI-style checks).
 *
 * @param {string} [workspace] Working directory; defaults to `process.cwd()`.
 * @returns {void}
 */
export const runDartChecks = (workspace = process.cwd()) => {
  console.log('Checking Dart formatting...');
  run('dart', ['format', '--output=none', '--set-exit-if-changed', '--line-length=120', '.'], { cwd: workspace });

  console.log('Running dart analyze...');
  run('dart', ['analyze', '--fatal-infos'], { cwd: workspace });

  console.log('Running flutter test...');
  run('flutter', ['test'], { cwd: workspace });

  console.log('All checks passed.');
};
