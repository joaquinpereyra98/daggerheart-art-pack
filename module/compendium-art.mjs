export default class ArtPackCompendiumArt extends foundry.helpers.media.CompendiumArt {

  /**@override */
  async _registerArt() {
    this.clear();
    // Load packages in reverse order so that higher-priority packages overwrite lower-priority ones.
    for (const { packageId, mapping, credit } of this.getPackages().reverse()) {
      try {
        const json = await foundry.utils.fetchJsonWithTimeout(mapping);
        await this.#parseArtMapping(packageId, json, credit);
      } catch (e) {
        const pkg = packageId === game.system.id ? game.system : game.modules.get(packageId);
        Hooks.onError("CompendiumArt#_registerArt", e, {
          msg: `Failed to parse compendium art mapping for package '${pkg?.title}'`,
          log: "error"
        });
      }
    }
  }

  /**
   * Parse a provided art mapping and store it for reference later, and update compendium indices to use the provided
   * art.
   * @param {string} packageId - The ID of the package providing the mapping.
   * @param {CompendiumArtMapping} mapping - The art mapping information provided by the package.
   * @param {string} [credit] - An optional credit string for use by the game system to apply in an appropriate place.
   */
  async #parseArtMapping(packageId, mapping, credit) {
    const settings = game.settings.get("core", this.SETTING)?.[packageId] ?? { portraits: true, tokens: true };
    for (const [packName, docs] of Object.entries(mapping)) {
      const pack = game.packs.get(packName);
      if (!pack) continue;
      for (let [docId, info] of Object.entries(docs)) {
        const entry = pack.index.get(docId);
        if (!entry || !(settings.portraits || settings.tokens)) continue;
        if (settings.portraits) entry.img = info.actor ?? info.item;
        else delete info.actor;
        if (!settings.tokens) delete info.token;
        if (credit) info.credit = credit;
        const uuid = pack.getUuid(docId);
        info = Object.assign(this.get(uuid) ?? {}, info);
        this.set(uuid, info);
      }
    }
  }
}