# Daggerheart Art Pack
Daggerheart Art Pack is a module designed to simplify the implementation of Art Compendiums for the Daggerheart System FoundryVTT Implementation, developed by the Daggerborne team.
With this module, you can customize the images for actors and items in the system’s compendiums.

## How use it
To use this module, simply go to Configure Settings and scroll down to the "daggerheart-art-pack" section. There, you’ll find a single button called Art Mapping Config, which opens the window to set up the Compendium Art for documents within the compendiums.

<img width="479" height="671" alt="image" src="https://github.com/user-attachments/assets/ff2230b3-d397-45e3-89b2-fbed3087e0c0" />

The interface is divided into two main categories:
- Actors: That includes the Adversaries and Environments compenidums.
-Items: Includes the Ancestries, Armors, Beastforms, Classes, Communities, Consumables, Domains, Loot, Subclasses, and Weapons compendiums.

Each category includes a field that allows you to manually load a new item from the compendium, configure it manually.

At the bottom of the window, there are three main buttons:
- Reset – Restores the default settings.
- Import Art – Imports all artwork from a Folder.
- Save Changes – Saves your current configuration.

### Import Art from Folder
The second button, Import Art, allows the user to select a folder containing artwork and automatically maps each piece to its corresponding document.

### Naming Your Files
For the module to recognize your images, the file names must follow a slugified version of the document name:
- Use lowercase letters.
- Replace spaces with underscores _.
- The file name should start with the document name.
  
#### Example
If you want to replace the portrait or token of the actor *Acid Burrower*, your files could be:
```
acid_burrower_token.png
acid_burrower_tk.png
acid_burrowerCircle.png
```
These will all be recognized and can populate the compendium automatically.

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
**Q: Can I add multiple tokens for the same actor?**
A: Yes. You can use variations (wildcards), and all matching files will be automatically associated with the same document.

**Q: Can I add multiple portraits for the same actor or item ?**
A: No. Variations (wildcards) are only supported for tokens, not portraits.

**Q: What if my image doesn’t appear in the compendium?**
A: Make sure:
- The file is placed in the correct subfolder for the compendium.
- The filename follows the slugified naming rules.
- The image format is supported by FoundryVTT.

**Q: Can I change the size of the token or the border?**
You can change the size of the token, but adjusting the border isn’t possible at the moment. This may be considered in a future update.

## Disclaimer
- Although the developer of this module is part of the Foundryborne team, the **Foundryborne team is NOT responsible** for the development or maintenance of this module.
- The Daggerborne team or the developer not are responsible for copyright infringement from user-added content.
- Foundry Virtual Tabletop © Copyright 2023, [Foundry Gaming](https://foundryvtt.com/), LLC. All rights reserved.
- Daggerheart ©  Critical Role LLC All rights reserved For more information please visit [DarrigtonPress Offical Website](https://darringtonpress.com/license/)

