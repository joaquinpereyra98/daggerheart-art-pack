import patchPackCompendium from "./module/patch-pack-compendium.mjs";
import patchPackCompendiumArt from "./module/patch-pack-compendium-art.mjs";
import DHArtMappingConfig from "./module/applications/art-loader-settings.mjs";
import pathItemDocument from "./module/patch-item-document.mjs";
import CONSTANTS from "./module/constants.mjs";

Hooks.on("init", async () => {
  pathItemDocument()
  patchPackCompendium();
  patchPackCompendiumArt();
  DHArtMappingConfig.registerSettings();

  game.settings.register(CONSTANTS.MODULE_ID, CONSTANTS.HAS_MAPPING, {
    config: false,
    default: false,
    scope: "world",
    type: Boolean,
  });
});