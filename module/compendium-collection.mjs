export default class ArtPackDHCompendiumCollection extends foundry.documents.collections.CompendiumCollection {
  /**@inheritdoc */
  getIndex({ fields = [] }) {
    const index = super.getIndex({ fields });

    const restoreArt = this.documentName === "Item";
    for (const i of index) {
      const existing = this.index.get(i._id);
      const indexed = existing ? foundry.utils.mergeObject(existing, i) : i;
      indexed.uuid = this.getUuid(indexed._id);
      if (restoreArt) indexed.img = game.compendiumArt.get(indexed.uuid)?.item ?? indexed.img;
      this.index.set(i._id, indexed);
    }

    return index;
  }
} 