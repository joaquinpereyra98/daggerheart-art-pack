import ArtPackDHItem from "./module/item-document.mjs";
import patchPackCompendium from "./module/patch-pack-compendium.mjs";
import patchPackCompendiumArt from "./module/patch-pack-compendium-art.mjs";

Hooks.on("init", () => {
  CONFIG.Item.documentClass = ArtPackDHItem;
  patchPackCompendium();
  patchPackCompendiumArt();
});