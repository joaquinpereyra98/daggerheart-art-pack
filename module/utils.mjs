/**
 * Check if a file path matches a given name by comparing common slug variations.
 * @param {string} name
 * @param {string} filePath
 * @returns {boolean}
 */
export function matchSlug(name, filePath) {
  const slugOpts = { lowercase: true, strict: true };

  const variations = [
    name.slugify({ ...slugOpts, replacement: "-" }), // kebab-case
    name.slugify({ ...slugOpts, replacement: "_" }), // snake_case
    name.titleCase(),                                // Title Case
    name.charAt(0).toLowerCase() + name.titleCase().slice(1), // camelCase
  ];

  // Get basename without extension and decode URI safely
  const fileName = decodeURIComponent(filePath.split(/[\\/]/).pop().replace(/\.[^.]+$/, "")).toLowerCase();

  return variations.some(v => fileName.startsWith(v));
}

/**
 * Build a wildcard path for FoundryVTT given multiple matching file paths.
 * @param {string[]} files - Array of matching file paths.
 * @returns {string} A wildcard-compatible path.
 */
export function getWildCardPath(files) {

  const bases = files.map(f =>
    decodeURI(f.replace(/^.*[\\/]/, "")).replace(/\.[^/.]+$/, "")
  );

  // Find longest common prefix
  let prefix = bases[0];
  for (const b of bases.slice(1)) {
    let i = 0;
    while (i < prefix.length && i < b.length && prefix[i] === b[i]) i++;
    prefix = prefix.slice(0, i);
    if (!prefix) break;
  }


  if (prefix) {
    const pattern = `${prefix}*`
    const dir = files[0].replace(/[^\\/]*$/, "");
    return `${dir}${pattern}`;
  } else {
    return files[0];
  }
}

/**
 * Get a list of valid file extensions for image and video files supported by Foundry.
 * @function getValidExtensions
 * @returns {string[]} An array of file extensions (including the leading dot).
 */
export function getValidExtensions() {
  return Object.keys(CONST.IMAGE_FILE_EXTENSIONS).map(k => `.${k}`);
}