import ArtPackDHItem from "./module/item-document.mjs";
import ArtPackDHCompendiumCollection from "./module/compendium-collection.mjs";
import ArtPackCompendiumArt from "./module/compendium-art.mjs";

Hooks.on("init", () => {
  CONFIG.Item.documentClass = ArtPackDHItem;
  foundry.documents.collections.CompendiumCollection = ArtPackDHCompendiumCollection;
  foundry.helpers.media.CompendiumArt = ArtPackCompendiumArt;
});