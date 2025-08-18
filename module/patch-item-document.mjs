/**
 * 
 * @returns {foundry.documents.Item}
 */
export default function pathItemDocument() {
  class ArtPackDHItem extends foundry.documents.Item.implementation {
    /**@inheritdoc */
    _initializeSource(source, options = {}) {
      source = super._initializeSource(source, options);

      const pack = game.packs.get(options.pack);
      if (source._id && pack && game.compendiumArt.enabled) {
        const uuid = pack.getUuid(source._id);
        const art = game.compendiumArt.get(uuid) ?? {};
        if (art.item) source.img = art.item;
      }

      return source;
    }

  }

  return CONFIG.Item.documentClass = ArtPackDHItem;
}