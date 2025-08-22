/**
 * Monkey-patches {@link foundry.documents.collections.CompendiumCollection#getIndex}
 * to add custom handling for `Item` documents.
 * @function patchPackCompendium
 * @returns {void}
 */
export default function patchPackCompendium() {
  const proto = foundry.documents.collections.CompendiumCollection.prototype;

  const _getIndex = proto.getIndex;

  proto.getIndex = async function ({ fields = [] } = {}) {
    const index = await _getIndex.call(this, { fields });

    const restoreArt = this.documentName === "Item";
    for (const i of index) {
      const existing = this.index.get(i._id);
      const indexed = existing ? foundry.utils.mergeObject(existing, i) : i;
      indexed.uuid = this.getUuid(indexed._id);
      if (restoreArt) {
        indexed.img = game.compendiumArt.get(indexed.uuid)?.item ?? indexed.img;
      }
      this.index.set(i._id, indexed);
    }

    return index;
  };

  console.log("ArtPackDHCompendiumCollection patch applied.");
}
