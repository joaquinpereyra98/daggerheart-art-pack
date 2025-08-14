import CONSTANTS from "../module/constants.mjs";
import fs from "fs";
import path from "path";

const TARGET_PATH = "./storage/assets";

for (const file of fs.readdirSync(TARGET_PATH)) {
  const filePath = path.join(TARGET_PATH, file);
  const stat = fs.lstatSync(filePath);
  stat.isDirectory() ? fs.rmSync(filePath, { recursive: true, force: true }) : fs.unlinkSync(filePath);
}

[...CONSTANTS.ACTOR_PACKS, ...CONSTANTS.ITEM_PACKS].forEach(pack => {
  const packPath = path.join(path.join(TARGET_PATH, "portraits"), pack);
  fs.mkdirSync(packPath, { recursive: true });
});

CONSTANTS.ACTOR_PACKS.forEach(pack => {
  const packPath = path.join(path.join(TARGET_PATH, "tokens"), pack);
  fs.mkdirSync(packPath, { recursive: true });
});

console.log("Assets folders created successfully.");
