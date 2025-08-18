import CONSTANTS from "./constants.mjs";

/**
 * @import {DHCompendiumArtMapping} from "./_types.mjs"
 */

/**
 * Monkey-patches {@link foundry.helpers.media.CompendiumArt#_registerArt} to add
 * custom handling for specific art mappings.
 * @function patchPackCompendiumArt
 * @returns {void}
 */
export default function patchPackCompendiumArt() {
  const proto = foundry.helpers.media.CompendiumArt.prototype;

  proto._registerArt = async function () {
    this.clear();
    // Load packages in reverse order so that higher-priority packages overwrite lower-priority ones.
    for (const { packageId, mapping, credit } of this.getPackages().reverse()) {
      if (packageId === CONSTANTS.MODULE_ID) {
        await handleModuleArt.call(this, mapping, credit);
      } else {
        try {
          const json = await foundry.utils.fetchJsonWithTimeout(mapping);
          await parseArtMapping.call(this, packageId, json, credit);
        } catch (e) {
          const pkg = packageId === game.system.id ? game.system : game.modules.get(packageId);
          Hooks.onError("CompendiumArt#_registerArt", e, {
            msg: `Failed to parse compendium art mapping for package '${pkg?.title}'`,
            log: "error"
          });
        }
      }
    }
  };

  console.log("ArtPackCompendiumArt patch applied.");
}

/**
 * Handle the special case for the module's own packages.
 * Filters mapping by available files in storage and constructs a new art mapping.
 *
 * @param {string} mappingPath - URL or path to JSON mapping
 * @param {string} [credit] - Optional credit string
 * @this foundry.helpers.media.CompendiumArt
 */
async function handleModuleArt(mappingPath, credit) {
  if (!game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.HAS_MAPPING)) return;
  const json = await foundry.utils.fetchJsonWithTimeout(mappingPath);
  await parseArtMapping.call(this, CONSTANTS.MODULE_ID, json, credit);
}


/**
 * Parse and register compendium art mappings for a given package.
 * @param {string} packageId - The ID of the package providing the art mapping.
 * @param {DHCompendiumArtMapping} mapping - A mapping of compendium pack IDs to Document IDs to art information.
 * @param {string} [credit] - An optional credit string to attach to all processed art data for the package.
 * @returns {Promise<void>} Resolves once all art entries have been parsed and registered.
 * 
 * @async
 * @this foundry.helpers.media.CompendiumArt
 */
async function parseArtMapping(packageId, mapping, credit) {
  const settings = game.settings.get("core", this.SETTING)?.[packageId] ?? { portraits: true, tokens: true };
  for (const [packName, docs] of Object.entries(mapping)) {
    const pack = game.packs.get(packName);
    if (!pack) continue;
    for (let [docId, info] of Object.entries(docs)) {
      const entry = pack.index.get(docId);
      if (!entry || !(settings.portraits || settings.tokens)) continue;
      if (settings.portraits && (info.actor || info.item)) entry.img = info.actor ?? info.item;
      else delete info.actor;
      if (!settings.tokens) delete info.token;
      if (credit) info.credit = credit;
      const uuid = pack.getUuid(docId);
      info = Object.assign(this.get(uuid) ?? {}, info);
      this.set(uuid, info);
    }
  }
}

