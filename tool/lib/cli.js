/**
 * Read a required positional CLI argument.
 *
 * @param {readonly string[]} argv Raw `process.argv` slice (without node/binary).
 * @param {number} index Zero-based positional index.
 * @param {string} name Human-readable argument name for error messages.
 * @returns {string}
 */
export const requireArg = (argv, index, name) => {
  const value = argv[index];
  if (!value) {
    throw new Error(`Missing required argument: ${name}`);
  }
  return value;
};

/**
 * @param {string} scriptFilename `import.meta.filename` of the entry script.
 * @param {string} usage Usage line without the script name.
 * @returns {never}
 */
export const printUsageAndExit = (scriptFilename, usage) => {
  const scriptName = scriptFilename.split(/[/\\]/).pop() ?? 'script.js';
  console.error(`Usage: node ${scriptName} ${usage}`);
  process.exit(1);
};
