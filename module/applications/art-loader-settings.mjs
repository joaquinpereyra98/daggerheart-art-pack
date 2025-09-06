import CONSTANTS from "../constants.mjs";
import { getValidExtensions, getWildCardPath, matchSlug } from "../utils.mjs";

const { HandlebarsApplicationMixin, ApplicationV2 } = foundry.applications.api;
const { SchemaField, FilePathField, TypedObjectField, NumberField, BooleanField } = foundry.data.fields;

/**
 * @import {ApplicationClickAction} from "@client/applications/_types.mjs"
 * @import FormDataExtended from "@client/applications/ux/form-data-extended.mjs"
 */

export default class DHArtMappingConfig extends HandlebarsApplicationMixin(ApplicationV2) {
  /** @inheritDoc */
  static DEFAULT_OPTIONS = {
    tag: "form",
    window: {
      title: "Daggerheart Art Loader",
      contentClasses: ["standard-form"]
    },
    form: {
      closeOnSubmit: true,
      handler: DHArtMappingConfig._onSubmit,
    },
    position: { width: 400 },
    actions: {
      reset: DHArtMappingConfig._onReset,
      importArt: DHArtMappingConfig._onImportArt,
      addActorPack: DHArtMappingConfig._onAddActorPack,
      toggleAccordion: DHArtMappingConfig._onToggleAccordion
    },
    classes: ["daggerheart-art-pack"]
  };

  /** @override */
  static PARTS = {
    form: {
      template: `modules/${CONSTANTS.MODULE_ID}/templates/mapping-config.hbs`,
      scrollable: [""],
    },
    footer: {
      template: "templates/generic/form-footer.hbs"
    }
  }

  /**
   * The data schema for the  setting.
   * @type {SchemaField}
   */
  static get schema() {
    return DHArtMappingConfig.#schema;
  }

  static get #actorsField() {
    return new TypedObjectField(new SchemaField({
      portrait: new FilePathField({ categories: ["IMAGE"] }),
      token: new SchemaField({
        texture: new foundry.data.TextureData({}, { wildcard: true }),
        width: new NumberField({ required: true, nullable: false, positive: true, initial: 1 }),
        height: new NumberField({ required: true, nullable: false, positive: true, initial: 1 }),
        randomImg: new BooleanField()
      }),
    }), { validateKey: foundry.data.validators.isValidId });
  }

  static get #itemsField() {
    return new TypedObjectField(new SchemaField({
      portrait: new FilePathField({ categories: ["IMAGE"] }),
    }), { validateKey: foundry.data.validators.isValidId });
  }

  static #schema = new SchemaField({
    actors: new SchemaField(CONSTANTS.ACTOR_PACKS.reduce((acc, k) => {
      acc[k] = this.#actorsField;
      return acc;
    }, {})),
    items: new SchemaField(CONSTANTS.ITEM_PACKS.reduce((acc, k) => {
      acc[k] = this.#itemsField;
      return acc;
    }, {})),
  });


  /**
 * The current setting value
 * @type {DHArtMappingConfig.schema}
 */
  #setting;

  /**
   * Register the module's settings and configuration menu with Foundry VTT.
   * @static
   */
  static registerSettings() {
    game.settings.registerMenu(CONSTANTS.MODULE_ID, CONSTANTS.ART_MAPPING_CONFIG, {
      name: "Art Mapping Config",
      label: "Art Mapping Config",
      hint: "Setting to configure Daggerheart's Compendium Art",
      icon: "fa-solid fa-palette",
      type: DHArtMappingConfig
    });

    game.settings.register(CONSTANTS.MODULE_ID, CONSTANTS.ART_MAPPING, {
      scope: "world",
      config: false,
      type: DHArtMappingConfig.schema,
      onChange: DHArtMappingConfig._updateMappinFile,
      requiresReload: true,
    });
  }

  /** @override */
  async _prepareContext(options) {
    if (options.isFirstRender) this.#setting = game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.ART_MAPPING);
    return {
      setting: this.#setting,
      lists: this._prepareLists(),
      buttons: [
        { type: "reset", label: "Reset", icon: "fa-solid fa-arrow-rotate-left", action: "reset" },
        { type: "button", label: "Import Art", icon: "fa-solid fa-upload", action: "importArt" },
        { type: "submit", label: "Save Changes", icon: "fa-solid fa-floppy-disk" }
      ]
    };
  }

  /**
   * Prepare structured lists of Items and Actors from configured compendium packs.
   * @returns {{items: Object, actors: Object}}
   */
  _prepareLists() {
    // Helper to build list data for a given set of packs

    const prepateSetting = (source) => {
      if (!source.token) return source;
      const token = {
        scale: Math.abs(source.token.texture.scaleX),
        mirrorX: source.token.texture.scaleX < 0,
        mirrorY: source.token.texture.scaleY < 0,
      };
      return foundry.utils.mergeObject(source, { token }, { inplace: false });
    }
    /**
     * 
     * @param {string[]} packs 
     * @param {foundry.abstract.Document} docCls 
     * @returns {Object[]}
     */
    const buildList = (packs, docCls) => {
      const p = [];
      for (const key of packs) {
        const pack = game.packs.get(`daggerheart.${key}`);
        const setting = this.#setting[docCls.collectionName][key];
        const keysOnSetting = Object.keys(setting);
        const selected = pack.index
          .filter(({ _id }) => keysOnSetting.includes(_id))
          .map((index) => ({
            ...index,
            ...prepateSetting(setting[index._id]),
            path: `${docCls.collectionName}.${key}.${index._id}`,
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
        const available = pack.index
          .filter(({ _id }) => !keysOnSetting.includes(_id))
          .sort((a, b) => a.name.localeCompare(b.name))
          .reduce((acc, { _id, name }) => ({ ...acc, [_id]: name }), { "": "" });

        p.push({
          key,
          label: pack.title,
          index: selected,
          choices: available,
          type: docCls.documentName,
        })
      }
      return {
        name: game.i18n.localize(docCls.metadata.labelPlural),
        packs: p
      };
    };

    return {
      actors: buildList(CONSTANTS.ACTOR_PACKS, foundry.documents.Actor),
      items: buildList(CONSTANTS.ITEM_PACKS, foundry.documents.Item),
    };
  }


  /* -------------------------------------------- */

  /** @inheritdoc */
  _preSyncPartState(partId, newElement, priorElement, _state) {
    super._preSyncPartState(partId, newElement, priorElement, _state);
    if (partId !== "form") return;

    for (const el of priorElement.querySelectorAll(".open[data-accordion]")) {
      const selector = `[data-accordion="${el.dataset.accordion}"]`;
      const target = newElement.querySelector(selector);
      if (target) target.classList.add("open");
    }
  }

  /* -------------------------------------------- */

  /**
   * Submit the configuration form.
   * @this {DHArtMappingConfig}
   * @param {SubmitEvent} event
   * @param {HTMLFormElement} form
   * @param {FormDataExtended} formData
   * @returns {Promise<void>}
   */
  static async _onSubmit(_event, _form, formData) {
    const formDataExpanded = foundry.utils.expandObject(formData.object);

    for (const pack of Object.values(formDataExpanded?.actors ?? {})) {
      for (const d of Object.values(pack)) {
        if (!d.token) continue;
        if (typeof d.token.scale === "number") {
          d.token.texture.scaleX = d.token.scale * (d.token.mirrorX ? -1 : 1);
          d.token.texture.scaleY = d.token.scale * (d.token.mirrorY ? -1 : 1);
        }
        for (const key of ["scale", "mirrorX", "mirrorY"]) delete d.token[key];
      }
    }

    foundry.utils.mergeObject(this.#setting, DHArtMappingConfig.schema.clean(formDataExpanded));
    await game.settings.set(CONSTANTS.MODULE_ID, CONSTANTS.ART_MAPPING, this.#setting);
  }

  /* -------------------------------------------- */

  /**
   * Reset the form back to default values.
   * @this {DHArtMappingConfig}
   * @type {ApplicationClickAction}
   */
  static async _onReset() {
    this.#setting = DHArtMappingConfig.#schema.clean({});
    await this.render({ force: false });
  }

  /**
   * Reset the form back to default values.
   * @this {DHArtMappingConfig}
   * @type {ApplicationClickAction} 
   */
  static async _onImportArt() {
    const { DialogV2 } = foundry.applications.api;

    const result = await DialogV2.wait({
      rejectClose: false,
      content: "What kind of art will go up?",
      buttons: [
        { action: "token", label: "Token Art", icon: "fa-solid fa-hexagon-image", style: { whiteSpace: "nowrap" } },
        { action: "portrait", label: "Portrait Art", icon: "fa-solid fa-image-portrait", style: { whiteSpace: "nowrap" } }
      ]
    });

    if (!result) return;

    const settingToken = result === "token";
    const packs = settingToken ? CONSTANTS.ACTOR_PACKS : [...CONSTANTS.ACTOR_PACKS, ...CONSTANTS.ITEM_PACKS];

    const FP = foundry.applications.apps.FilePicker.implementation;
    await new FP({
      type: "folder",
      callback:
        /**
         * @param {string} target 
         * @param {foundry.applications.apps.FilePicker} object 
         */
        async (target, { activeSource, source }) => {
          const files = (await FP.browse(activeSource, target, { extensions: getValidExtensions(), bucket: source.bucket })).files;
          const newData = foundry.utils.duplicate(this.#setting)

          for (const name of packs) {
            const { index, documentClass } = game.packs.get(`daggerheart.${name}`);
            const basePath = [documentClass.collectionName, name];

            for (const i of index) {
              const matching = files.filter(path => matchSlug(i.name, path));
              if (!matching.length) continue;

              const path = [...basePath, i._id];

              const randomImg = matching.length > 1 && settingToken;
              const filePath = randomImg ? getWildCardPath(matching) : matching[0];

              if (!settingToken) {
                path.push("portrait");
                foundry.utils.setProperty(newData, path.join("."), filePath);
              } else {
                path.push("token");
                foundry.utils.setProperty(newData, `${path.join(".")}.texture.src`, filePath);
                foundry.utils.setProperty(newData, `${path.join(".")}.randomImg`, randomImg);
              }
            }
          }


          foundry.utils.mergeObject(this.#setting, DHArtMappingConfig.schema.clean(newData));
          console.log(this.#setting)
          this.render();
        }
    }).browse();
  }


  /**
   * @this {DHArtMappingConfig}
   * @type {ApplicationClickAction}
   */
  static _onAddActorPack(_, target) {
    const selected = target.parentElement.querySelector("select").value;
    const list = target.closest("[data-list]").dataset.list;
    const pack = target.dataset.pack;
    const isActor = list === "actors";

    const newData = isActor ?
      DHArtMappingConfig.#actorsField.clean({ [selected]: {} }) :
      DHArtMappingConfig.#itemsField.clean({ [selected]: {} });

    foundry.utils.mergeObject(this.#setting[list][pack], newData);
    this.render();
  }


  /**
   * Toggle an accordion section open or closed with smooth animation.
   * Expands the body to its scroll height when opening, and collapses it when closing.
   * 
   * @this {DHArtMappingConfig}
   * @type {ApplicationClickAction}
   */
  static _onToggleAccordion(event, target) {
    event.stopImmediatePropagation();
    event.stopPropagation();
    const accordion = target.closest(".accordion");
    accordion.classList.toggle("open");
  }

  /* -------------------------------------------- */

  /**
   * Update and persist the mapping file with customized artwork for Actors and Items.
   *
   * @async
   * @param {Object} mapping - The mapping data to process.
   * @param {Object<string, Object>} mapping.actors - A mapping of compendium keys to actor data.
   * @param {Object<string, Object>} mapping.items  - A mapping of compendium keys to item data.
   */
  static async _updateMappinFile(mapping) {
    const mappingFile = {};

    const processDocs = (docs, type, defaultArt) => {
      for (const [pKey, obj] of Object.entries(docs)) {
        const packData = {};
        for (const [id, data] of Object.entries(obj)) {
          if (data.portrait !== defaultArt.img) {
            foundry.utils.setProperty(packData, `${id}.${type}`, data.portrait);
          }
          if (type === "actor" && data.token?.texture) {
            if (data.token.texture.src !== defaultArt.texture.src) {
              const initialValue = (new foundry.data.TextureData()).getInitialValue({});
              data.token.texture = foundry.utils.diffObject(initialValue, data.token.texture, { deletionKeys: false });
              delete data.token.texture.tint;
              foundry.utils.setProperty(packData, `${id}.token`, data.token);
            }
          }
        }
        if (Object.keys(packData).length) {
          mappingFile[`daggerheart.${pKey}`] = packData;
        }
      }
    };

    processDocs(mapping.actors, "actor", foundry.documents.Actor.getDefaultArtwork({}));
    processDocs(mapping.items, "item", foundry.documents.Item.getDefaultArtwork({}));

    const json = new File(
      [JSON.stringify(mappingFile)],
      CONSTANTS.MAPPING_FILE,
      { type: "application/json" }
    );
    await foundry.applications.apps.FilePicker.implementation.uploadPersistent(CONSTANTS.MODULE_ID, "", json);

    if (!game.settings.get(CONSTANTS.MODULE_ID, CONSTANTS.HAS_MAPPING)) {
      await game.settings.set(CONSTANTS.MODULE_ID, CONSTANTS.HAS_MAPPING, true);
    }
    await foundry.applications.settings.SettingsConfig.reloadConfirm({ world: true });
  }

}
