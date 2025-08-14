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

export function getValidExtensions() {
  return [...Object.keys(CONST.IMAGE_FILE_EXTENSIONS), ...Object.keys(CONST.VIDEO_FILE_EXTENSIONS)].map(k => `.${k}`);
}