/**
 * Check if a slug matches the filename (without extension)
 * @param {string} slug - the slug to match
 * @param {string} filePath - the file path to test
 * @returns {boolean}
 */
export function matchSlug(slug, filePath) {
  // Extract the basename without extension
  const fileName = filePath.replace(/^.*[\\/]/, "").replace(/\.[^/.]+$/, "");

  const slice = fileName.slice(0, slug.length)
  return slice === slug;
}

/**
 * Get a list of valid file extensions for image and video files supported by Foundry.
 * @function getValidExtensions
 * @returns {string[]} An array of file extensions (including the leading dot).
 */
export function getValidExtensions() {
  return Object.keys(CONST.IMAGE_FILE_EXTENSIONS).map(k => `.${k}`);
}