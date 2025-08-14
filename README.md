# Daggerheart Art Pack
Daggerheart Art Pack is a module designed to simplify the implementation of Art Compendiums for the Daggerheart System FoundryVTT Implementation, developed by the Daggerborne team.
With this module, you can customize the images for actors and items in the system’s compendiums.

## How use it
The module uses a simple folder structure to manage your images. When you place images in the correct folders, they will automatically populate the corresponding compendium.

### Folder Structure
```
storage/portraits/... → for actor or item portraits
storage/tokens/...  → for actor tokens
```
Each folder already contains subfolders named as the compendiums; place your images inside the appropriate one.

### Naming Your Files
For the module to recognize your images, the file names must follow a slugified version of the document name:
- Use lowercase letters.
- Replace spaces with underscores _.
- The file name should start with the document name.
  
#### Example
If you want to replace the portrait or token of the actor *Acid Burrower*, your files could be:
```
storage/
├─ portraits/
│  ├─ Adversaries/         <-- Subfolder for Adversaries portraits
│  │  ├─ acid_burrower.png
│  │  ├─ fire_mage.png
│  └─ ...                    <-- Other compendium folders
│
└─ tokens/ 
   ├─ Adversaries/      <-- Subfolder for Adversaries tokens
   │  ├─ acid_burrower_token.png
   │  ├─ acid_burrower_tk.png
   │  └─ acid_burrowercircle.png
   └─ ...                    <-- Other compendium folders

```
These will all be recognized and can populate the compendium automatically.

### Step-by-Step Guide

 1. Open the module folder and navigate to `storage/portraits` or `storage/tokens`.
 2. Inside the folder, find the existing subfolder that matches the compendium name you want to populate.
 3. Place your images in the subfolder.
 4. Make sure each file name follows the **lowercase** + **underscores** rule.
 5. Save your changes and open FoundryVTT. The images should now automatically appear in the compendium

## FAQ
**Q: Do I need to create the subfolders myself?**
A: No. The portraits and tokens folders already include subfolders for each compendium. Simply place your images in the appropriate subfolder.

**Q: The subfolders don't exist, can I create them myself?**
A: Yes, but you must be especially careful when creating the names of folders and subfolders.

**Q: How should I name my image files?**
A: Use a slugified version of the document name: lowercase letters, spaces replaced with underscores _. You can add numbers or extra text after the name if you want variations for **Tokens**.
Example:
```
acid_burrower.png
acid_burrower1.png
acid_burrower_variant.png
```
**Q: Can I add multiple portraits for the same actor or item ?**
A: No, variations(wildcards) are only possible for tokens.

**Q: What if my image doesn’t appear in the compendium?**
A: Make sure:
- The file is placed in the correct subfolder for the compendium.
- The filename follows the slugified naming rules.
- The image format is supported by FoundryVTT.

**Q: Can I replace existing images without losing them?**
A: Yes. You can overwrite existing files or add new ones. The module will automatically use any new images placed in the subfolders.

**Q: Can I change the size of the token or the border?**
Currently this is not possible but something I will think about for future additions.

## Disclaimer
Although the developer of this module is part of the Foundryborne team, the **Foundryborne team is NOT responsible** for the development or maintenance of this module.
The Daggerborne team or the developer not are responsible for copyright infringement from user-added content.
Foundry Virtual Tabletop © Copyright 2023, [Foundry Gaming](https://foundryvtt.com/), LLC. All rights reserved.
Daggerheart ©  Critical Role LLC All rights reserved For more information please visit [DarrigtonPress Offical Website](https://darringtonpress.com/license/)
