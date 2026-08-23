const FULL_SHA_RE = /^[0-9a-f]{40}$/i;
const OBJECT_HASH_RE = /^[0-9a-f]{64}$/i;

/**
 * GitHub rejects tag names that are exactly 40- or 64-character hex strings.
 *
 * @param {string} tag Candidate release tag or commit SHA.
 * @returns {string} Tag name safe for GitHub Releases.
 */
export const resolveGitHubReleaseTag = (tag) => {
  if (FULL_SHA_RE.test(tag) || OBJECT_HASH_RE.test(tag)) {
    return `build-${tag}`;
  }
  return tag;
};

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
  if (FULL_SHA_RE.test(version)) {
    version = version.slice(0, 7);
  }
  return version;
};
