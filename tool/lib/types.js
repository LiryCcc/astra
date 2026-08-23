/**
 * @typedef {import('node:child_process').SpawnSyncOptions} SpawnSyncOptions
 */

/**
 * @typedef {Object} PackageReleaseOptions
 * @property {string} version Resolved release version (not raw tag).
 * @property {string} workspace Absolute path to the repository root.
 */

/**
 * @typedef {Object} WindowsPackagingTools
 * @property {string} iscc Absolute path to Inno Setup compiler.
 * @property {string} sevenZip Absolute path to 7z.exe.
 * @property {string} sfxModule Absolute path to 7zSD.sfx or 7z.sfx.
 */

export {};
