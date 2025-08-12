import fs from "fs/promises";
import path from "path";

const folderPath = path.resolve("art-map");
const outputPath = path.resolve("core-mapping.json");

const files = await fs.readdir(folderPath);
const merged = [];

for (const file of files) {
  if (file.endsWith(".json")) {
    const content = await fs.readFile(path.join(folderPath, file), "utf-8");
    merged.push(JSON.parse(content));
  }
}

await fs.writeFile(
  outputPath,
  JSON.stringify(merged, null, 2),
  "utf-8"
);

console.log(`Merged ${merged.length} JSON files into core-mapping.json`);
