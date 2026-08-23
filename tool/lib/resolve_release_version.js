/**
 * Resolve a Git tag or commit SHA into a filesystem-safe release version string.
 *
 * @param {string} tag Release tag (e.g. `v1.0.0`) or full commit SHA.
 * @returns {string} Version string suitable for artifact filenames.
 */
export const resolveReleaseVersion = (tag) => {
  let version = tag;
  if (version.startsWith('v')) {
    version = version.slice(1);
  }
  if (/^[0-9a-f]{40}$/.test(version)) {
    version = version.slice(0, 7);
  }
  return version;
};
