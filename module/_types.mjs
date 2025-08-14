/**
* @typedef {import("@client/helpers/_types.mjs").CompendiumArtInfo} CompendiumArtInfo
*/

/**
 * @typedef _DHCompendiumArtInfo
 * @property {string} [item] - The path to the Items's portrait image.
 * @property {string} [__DOCUMENT_NAME__] - Document Name, use for internal use.
 */

/**
 * @typedef {CompendiumArtInfo & _DHCompendiumArtInfo} DHCompendiumArtInfo
 */

/**
* @typedef {Record<string, Record<string, DHCompendiumArtInfo>>} DHCompendiumArtMapping - A mapping of compendium pack IDs to Document IDs to art information.
*/