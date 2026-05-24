window.RSGame = window.RSGame || {};

(function () {
  const MAX_STACK_QTY = 2147483647;
  const COINS_PER_PLAT_TOKEN = 1000;
  const PLAT_TOKENS_PER_DIVINE_TOKEN = 100_000; // 100,000 platinum tokens
  const COINS_PER_DIVINE_TOKEN = 1_000_000_000; // 1 billion coins

  function isUnlimitedStackItem(itemId) {
    return String(itemId || "") === "platinum_token" || String(itemId || "") === "divine_token";
  }

  const itemIntelCache = new Map();
  const pendingIntelById = new Map();

  function normalizeItemName(name) {
    return String(name || "")
      .replace(/\s*\(noted\)\s*$/i, "")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
  }

  function wikiThumb(file) {
    return "https://oldschool.runescape.wiki/images/thumb/" + file + "/32px-" + file;
  }

  function getArrowFallbackIcon(itemId) {
    if (itemId === "steel_arrow") return wikiThumb("Steel_arrow_5.png");
    if (itemId === "adamant_arrow") return wikiThumb("Adamant_arrow_5.png");
    if (itemId === "rune_arrow") return wikiThumb("Rune_arrow_5.png");
    return null;
  }

  function normalizeEquipmentLookupKey(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/\s*\(noted\)\s*$/i, "")
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_]/g, "");
  }

  function getEquipmentMetadata(item) {
    if (!item) return null;
    const table = window.RSGame?.EquipmentTable;
    if (!table || typeof table.getEquipMetadata !== "function") return null;

    const metadata = table.getEquipMetadata(item);
    if (metadata) return metadata;

    if (item.name && String(item.name).trim()) {
      return table.getEquipMetadata({ name: item.name });
    }

    return null;
  }

  function getEquipActionLabel(slotName) {
    const slot = String(slotName || "").toLowerCase();
    if (!slot) return "Use";
    const displaySlot = slot.replace(/_/g, " ");
    return `Equip ${displaySlot.charAt(0).toUpperCase()}${displaySlot.slice(1)}`;
  }

  function convertEquipmentBonuses(equipment) {
    if (!equipment || typeof equipment !== "object") return null;
    return {
      "Stab": Number(equipment.attack_stab) || 0,
      "Slash": Number(equipment.attack_slash) || 0,
      "Crush": Number(equipment.attack_crush) || 0,
      "Ranged": Number(equipment.attack_ranged) || 0,
      "Magic": Number(equipment.attack_magic) || 0,
      "Stab Defence": Number(equipment.defence_stab) || 0,
      "Slash Defence": Number(equipment.defence_slash) || 0,
      "Crush Defence": Number(equipment.defence_crush) || 0,
      "Ranged Defence": Number(equipment.defence_ranged) || 0,
      "Magic Defence": Number(equipment.defence_magic) || 0,
      "Melee Strength": Number(equipment.melee_strength) || 0,
      "Ranged Strength": Number(equipment.ranged_strength) || 0,
      "Magic Damage": Number(equipment.magic_damage) || 0,
      "Prayer": Number(equipment.prayer) || 0
    };
  }

  function buildFallbackIntel(item) {
    const id = String(item?.id || "").toLowerCase();
    const name = String(item?.name || "").toLowerCase();
    const metadata = getEquipmentMetadata(item);
    const slot = metadata?.slot || String(item?.slot || "").toLowerCase();

    const stackable = id === "coins" || id.includes("_arrow") || id.includes("_rune") || !!item?.noted || !!item?.stackable;
    const itemType = metadata?.slot
      ? "Equipment"
      : (id.includes("log") || id.includes("ore") || id.includes("fish") || id.includes("arrow") || id.includes("rune") || name.includes("ore") || name.includes("log"))
        ? "Resource"
        : "General";

    const fallbackSlot = metadata?.slot || null;
    const leftClickAction = fallbackSlot ? getEquipActionLabel(fallbackSlot) : "Use";
    const rightClickActions = fallbackSlot
      ? [leftClickAction, "Use", "Drop", "Examine"]
      : ["Use", "Drop", "Examine"];

    // Fetch price from G.E cache or estimate
    let price = 0;
    if (window.RSGame?.GE?.getCachedPrice) {
      price = window.RSGame.GE.getCachedPrice(item?.name || id) || 0;
    }

    return {
      stackable,
      itemType,
      slot: fallbackSlot,
      bonuses: metadata?.bonuses || item?.bonuses || null,
      requirements: metadata?.requirements || null,
      leftClickAction,
      rightClickActions,
      icon: getArrowFallbackIcon(id),
      price: price || item?.price || 0
    };
  }

  async function fetchWikiIntel(item) {
    return buildFallbackIntel(item);
  }

  class Inventory {
    constructor(size = 28) {
      this.size = size;
      this.slots = new Array(size).fill(null);
      this.stackAllItems = false;
    }

    getStackKey(item) {
      if (!item || !item.id) return "";
      return `${item.id}::${item.noted ? "noted" : "regular"}`;
    }

    isAlwaysStackable(itemId) {
      return itemId === "coins" || itemId === "platinum_token" || itemId === "divine_token";
    }

    applyStackMergeMeta(existing, incoming) {
      if (!existing || !incoming) return;
      if (!existing.icon && incoming.icon) existing.icon = incoming.icon;
      if (!existing.name && incoming.name) existing.name = incoming.name;
      if (incoming.noted) existing.noted = true;
      if (incoming.stackable) existing.stackable = true;
      if (!existing.slot && incoming.slot) existing.slot = incoming.slot;
      if (!existing.bonuses && incoming.bonuses) existing.bonuses = incoming.bonuses;
      if (!existing.itemType && incoming.itemType) existing.itemType = incoming.itemType;
      if (!existing.leftClickAction && incoming.leftClickAction) existing.leftClickAction = incoming.leftClickAction;
      if ((!existing.rightClickActions || !existing.rightClickActions.length) && incoming.rightClickActions) {
        existing.rightClickActions = incoming.rightClickActions.slice();
      }
    }

    computeCoinAndTokenTotals(currentCoins, addedCoins) {
      const totalCoins = Math.max(0, Number(currentCoins) || 0) + Math.max(0, Number(addedCoins) || 0);
      if (totalCoins <= MAX_STACK_QTY) {
        return { finalCoins: totalCoins, tokenQty: 0 };
      }

      const overflow = totalCoins - MAX_STACK_QTY;
      const tokenQty = Math.ceil(overflow / COINS_PER_PLAT_TOKEN);
      const finalCoins = Math.max(0, MAX_STACK_QTY - (tokenQty * COINS_PER_PLAT_TOKEN - overflow));
      return { finalCoins, tokenQty };
    }

    computeTokenAndDivineTotals(currentTokens, addedTokens) {
      const totalTokens = Math.max(0, Number(currentTokens) || 0) + Math.max(0, Number(addedTokens) || 0);
      if (totalTokens <= MAX_STACK_QTY) {
        return { finalTokens: totalTokens, divineQty: 0 };
      }

      const overflow = totalTokens - MAX_STACK_QTY;
      const divineQty = Math.ceil(overflow / PLAT_TOKENS_PER_DIVINE_TOKEN);
      const finalTokens = Math.max(0, MAX_STACK_QTY - (divineQty * PLAT_TOKENS_PER_DIVINE_TOKEN - overflow));
      return { finalTokens, divineQty };
    }

    addCoinsWithTokenConversion(normalizedCoinsItem) {
      const coinsSlot = this.slots.find((slot) => this.canMergeIntoStack(slot, normalizedCoinsItem));
      const currentCoins = Math.max(0, Number(coinsSlot?.qty) || 0);
      const { finalCoins, tokenQty } = this.computeCoinAndTokenTotals(currentCoins, normalizedCoinsItem.qty);

      const tokenSeed = {
        id: "platinum_token",
        name: "Platinum token",
        qty: tokenQty,
        icon: "https://oldschool.runescape.wiki/images/thumb/Platinum_token_detail.png/32px-Platinum_token_detail.png",
        noted: false,
        stackable: true,
        slot: null,
        bonuses: null,
        itemType: null,
        leftClickAction: null,
        rightClickActions: null
      };
      this.enrichItem(tokenSeed);

      let tokenSlot = this.slots.find((slot) => this.canMergeIntoStack(slot, tokenSeed));
      const currentTokens = Math.max(0, Number(tokenSlot?.qty) || 0);
      const { finalTokens, divineQty } = this.computeTokenAndDivineTotals(currentTokens, tokenQty);

      if (tokenQty > 0 && !tokenSlot) {
        const emptyTokenIndex = this.slots.findIndex((s) => s === null);
        if (emptyTokenIndex === -1) return false;
      }

      if (coinsSlot) {
        coinsSlot.qty = finalCoins;
        this.applyStackMergeMeta(coinsSlot, normalizedCoinsItem);
      } else {
        const coinSlotIndex = this.slots.findIndex((s) => s === null);
        if (coinSlotIndex === -1) return false;
        this.slots[coinSlotIndex] = { ...normalizedCoinsItem, qty: finalCoins };
      }

      if (tokenQty > 0) {
        tokenSlot = this.slots.find((slot) => this.canMergeIntoStack(slot, tokenSeed));
        if (tokenSlot) {
          tokenSlot.qty = finalTokens;
          this.applyStackMergeMeta(tokenSlot, tokenSeed);
        } else {
          const emptyTokenIndex = this.slots.findIndex((s) => s === null);
          if (emptyTokenIndex === -1) return false;
          this.slots[emptyTokenIndex] = {
            ...tokenSeed,
            qty: finalTokens
          };
          tokenSlot = this.slots[emptyTokenIndex];
        }

        if (divineQty > 0) {
          const divineSeed = {
            id: "divine_token",
            name: "Divine token",
            qty: divineQty,
            icon: wikiThumb("Platinum_token_detail.png") + "#glowy-yellow",
            noted: false,
            stackable: true,
            slot: null,
            bonuses: null,
            itemType: null,
            leftClickAction: null,
            rightClickActions: null
          };
          this.enrichItem(divineSeed);
          let divineSlot = this.slots.find((slot) => this.canMergeIntoStack(slot, divineSeed));
          if (divineSlot) {
            divineSlot.qty += divineQty;
            this.applyStackMergeMeta(divineSlot, divineSeed);
          } else {
            const emptyDivineIndex = this.slots.findIndex((s) => s === null);
            if (emptyDivineIndex === -1) return false;
            this.slots[emptyDivineIndex] = {
              ...divineSeed,
              qty: divineQty
            };
          }
        }
      }
      this.pruneItemIntel();
      return true;
    }

    addPlatinumWithDivineConversion(normalizedPlatinumItem) {
      const tokenSlot = this.slots.find((slot) => this.canMergeIntoStack(slot, normalizedPlatinumItem));
      const currentTokens = Math.max(0, Number(tokenSlot?.qty) || 0);
      const { finalTokens, divineQty } = this.computeTokenAndDivineTotals(currentTokens, normalizedPlatinumItem.qty);

      if (tokenSlot) {
        tokenSlot.qty = finalTokens;
        this.applyStackMergeMeta(tokenSlot, normalizedPlatinumItem);
      } else {
        const tokenIndex = this.slots.findIndex((s) => s === null);
        if (tokenIndex === -1) return false;
        this.slots[tokenIndex] = {
          ...normalizedPlatinumItem,
          qty: finalTokens
        };
      }

      if (divineQty > 0) {
        const divineSeed = {
          id: "divine_token",
          name: "Divine token",
          qty: divineQty,
          icon: wikiThumb("Platinum_token_detail.png") + "#glowy-yellow",
          noted: false,
          stackable: true,
          slot: null,
          bonuses: null,
          itemType: null,
          leftClickAction: null,
          rightClickActions: null
        };
        this.enrichItem(divineSeed);
        let divineSlot = this.slots.find((slot) => this.canMergeIntoStack(slot, divineSeed));
        if (divineSlot) {
          divineSlot.qty += divineQty;
          this.applyStackMergeMeta(divineSlot, divineSeed);
        } else {
          const emptyDivineIndex = this.slots.findIndex((s) => s === null);
          if (emptyDivineIndex === -1) return false;
          this.slots[emptyDivineIndex] = {
            ...divineSeed,
            qty: divineQty
          };
        }
      }

      this.pruneItemIntel();
      return true;
    }

    canStackItem(itemOrId, noted = false) {
      const itemId = typeof itemOrId === "object" && itemOrId !== null ? itemOrId.id : itemOrId;
      const isNoted = typeof itemOrId === "object" && itemOrId !== null ? !!itemOrId.noted : !!noted;
      const isMarkedStackable = typeof itemOrId === "object" && itemOrId !== null ? !!itemOrId.stackable : false;
      return !!itemId && (this.stackAllItems || this.isAlwaysStackable(itemId) || isNoted || isMarkedStackable);
    }

    canMergeIntoStack(existingSlot, incomingItem) {
      if (!existingSlot || !incomingItem) return false;
      if (!existingSlot.id || !incomingItem.id) return false;
      if (existingSlot.id !== incomingItem.id) return false;
      if (!!existingSlot.noted !== !!incomingItem.noted) return false;

      // Always merge when either side is stackable, or when an existing stack already formed.
      if (this.canStackItem(existingSlot) || this.canStackItem(incomingItem)) return true;
      return (Number(existingSlot.qty) || 0) > 1;
    }

    setStackAll(enabled) {
      this.stackAllItems = !!enabled;
      if (this.stackAllItems) {
        this.consolidateStacks();
      }
    }

    consolidateStacks() {
      const merged = [];
      const indexById = new Map();

      this.slots.forEach((slot) => {
        if (!slot) return;

        if (!this.canStackItem(slot)) {
          merged.push({ ...slot });
          return;
        }

        const stackKey = this.getStackKey(slot);
        const existingIndex = indexById.get(stackKey);
        if (existingIndex !== undefined) {
          const incomingQty = Math.max(1, Number(slot.qty) || 1);
          const existingQty = Math.max(0, Number(merged[existingIndex].qty) || 0);
          const canAdd = isUnlimitedStackItem(slot.id)
            ? incomingQty
            : Math.max(0, MAX_STACK_QTY - existingQty);
          const addHere = Math.min(canAdd, incomingQty);
          merged[existingIndex].qty = existingQty + addHere;
          this.applyStackMergeMeta(merged[existingIndex], slot);

          const overflow = incomingQty - addHere;
          if (overflow > 0 && !isUnlimitedStackItem(slot.id)) {
            let remaining = overflow;
            while (remaining > 0) {
              const chunk = Math.min(MAX_STACK_QTY, remaining);
              merged.push({
                id: slot.id,
                name: slot.name,
                qty: chunk,
                icon: slot.icon || null,
                noted: !!slot.noted,
                stackable: !!slot.stackable,
                slot: slot.slot || null,
                bonuses: slot.bonuses || null,
                itemType: slot.itemType || null,
                leftClickAction: slot.leftClickAction || null,
                rightClickActions: Array.isArray(slot.rightClickActions) ? slot.rightClickActions.slice() : null
              });
              remaining -= chunk;
            }
          }
          return;
        }

        indexById.set(stackKey, merged.length);
        const totalQty = Math.max(1, Number(slot.qty) || 1);
        let remaining = totalQty;
        let first = true;
        while (remaining > 0) {
          const chunk = isUnlimitedStackItem(slot.id) ? remaining : Math.min(MAX_STACK_QTY, remaining);
          const nextIndex = merged.length;
          merged.push({
            id: slot.id,
            name: slot.name,
            qty: chunk,
            icon: slot.icon || null,
            noted: !!slot.noted,
            stackable: !!slot.stackable,
            slot: slot.slot || null,
            bonuses: slot.bonuses || null,
            itemType: slot.itemType || null,
            leftClickAction: slot.leftClickAction || null,
            rightClickActions: Array.isArray(slot.rightClickActions) ? slot.rightClickActions.slice() : null
          });
          if (first) {
            indexById.set(stackKey, nextIndex);
            first = false;
          }
          remaining -= chunk;
        }
      });

      this.slots = merged.slice(0, this.size);
      while (this.slots.length < this.size) {
        this.slots.push(null);
      }

      this.pruneItemIntel();
    }

    applyIntelToItem(item, intel) {
      if (!item || !intel) return;

      if (!item.icon && intel.icon) item.icon = intel.icon;
      if (intel.stackable) item.stackable = true;
      if (intel.price && !item.price) item.price = intel.price;

      if (!item.itemType && intel.itemType) item.itemType = intel.itemType;
      if (!item.leftClickAction && intel.leftClickAction) item.leftClickAction = intel.leftClickAction;
      if ((!item.rightClickActions || !item.rightClickActions.length) && Array.isArray(intel.rightClickActions)) {
        item.rightClickActions = intel.rightClickActions.slice();
      }

      if (!item.noted && !item.slot && intel.slot) {
        item.slot = intel.slot;
      }
      if ((!item.bonuses || typeof item.bonuses !== "object") && intel.bonuses) {
        item.bonuses = intel.bonuses;
      }
      if ((!item.requirements || typeof item.requirements !== "object") && intel.requirements) {
        item.requirements = intel.requirements;
      }
    }

    applyIntelToSlots(itemId, intel) {
      if (!itemId || !intel) return;

      let changed = false;
      this.slots.forEach((slot) => {
        if (!slot || slot.id !== itemId) return;
        const before = JSON.stringify({
          icon: slot.icon || null,
          stackable: !!slot.stackable,
          itemType: slot.itemType || null,
          slot: slot.slot || null,
          bonuses: slot.bonuses || null,
          leftClickAction: slot.leftClickAction || null,
          rightClickActions: slot.rightClickActions || null
        });
        this.applyIntelToItem(slot, intel);
        const after = JSON.stringify({
          icon: slot.icon || null,
          stackable: !!slot.stackable,
          itemType: slot.itemType || null,
          slot: slot.slot || null,
          bonuses: slot.bonuses || null,
          leftClickAction: slot.leftClickAction || null,
          rightClickActions: slot.rightClickActions || null
        });
        if (before !== after) changed = true;
      });

      if (!changed) return;

      if (intel.stackable || this.stackAllItems) {
        this.consolidateStacks();
      }

      if (window.Player && window.Player.inventory === this) {
        RSGame.UI?.renderInventory?.(window.Player);
        RSGame.Bank?.refresh?.();
        RSGame.Events?.emit?.("playerUpdated", { reason: "item-intel", itemId });
      }
    }

    enrichItem(item) {
      if (!item || !item.id || !item.name) return;

      const fallback = buildFallbackIntel(item);
      this.applyIntelToItem(item, fallback);

      if (itemIntelCache.has(item.id)) {
        this.applyIntelToItem(item, itemIntelCache.get(item.id));
        return;
      }

      if (pendingIntelById.has(item.id)) return;

      const equipmentMetadata = getEquipmentMetadata(item);
      if (equipmentMetadata) {
        itemIntelCache.set(item.id, fallback);
        return;
      }

      const pending = fetchWikiIntel(item)
        .then((intel) => {
          itemIntelCache.set(item.id, intel || fallback);
          this.applyIntelToSlots(item.id, intel || fallback);
        })
        .catch(() => {
          itemIntelCache.set(item.id, fallback);
          this.applyIntelToSlots(item.id, fallback);
        })
        .finally(() => {
          pendingIntelById.delete(item.id);
        });

      pendingIntelById.set(item.id, pending);
    }

    enrichCurrentSlots() {
      this.slots.forEach((slot) => {
        if (!slot) return;
        this.enrichItem(slot);
      });
    }

    pruneItemIntel() {
      const ownedIds = new Set();
      this.slots.forEach((slot) => {
        if (slot?.id) ownedIds.add(slot.id);
      });

      const equipped = window.Player?.equipment?.slots || {};
      Object.values(equipped).forEach((item) => {
        if (item?.id) ownedIds.add(item.id);
      });

      Array.from(itemIntelCache.keys()).forEach((id) => {
        if (!ownedIds.has(id)) itemIntelCache.delete(id);
      });
    }

    addItem(id, name, qty = 1, icon = null) {
      let noted = false;
      let stackable = false;
      let slot = null;
      let bonuses = null;
      let itemType = null;
      let leftClickAction = null;
      let rightClickActions = null;

      if (typeof id === "object" && id !== null) {
        const item = id;
        ({ id, name, qty = 1, icon = null, noted = false, stackable = false, slot = null, bonuses = null, itemType = null, leftClickAction = null, rightClickActions = null } = item);
      }

      if (!id || !name) return false;

      const amount = Math.max(1, Number(qty) || 1);
      const normalizedId = String(id);
      const normalizedNoted = normalizedId === "coins" ? false : !!noted;
      const normalizedItem = {
        id: normalizedId,
        name,
        qty: amount,
        icon,
        noted: normalizedNoted,
        stackable: normalizedId === "coins" ? true : !!stackable,
        slot: slot || null,
        bonuses: bonuses || null,
        itemType: itemType || null,
        leftClickAction: leftClickAction || null,
        rightClickActions: Array.isArray(rightClickActions) ? rightClickActions.slice() : null
      };

      const equipmentMetadata = getEquipmentMetadata(normalizedItem);
      if (equipmentMetadata?.slot) {
        const canonicalId = normalizeEquipmentLookupKey(normalizedItem.name);
        if (canonicalId && canonicalId !== normalizedItem.id) {
          normalizedItem.id = canonicalId;
        }
        normalizedItem.slot = normalizedItem.slot || equipmentMetadata.slot;
        normalizedItem.itemType = normalizedItem.itemType || "Equipment";
        normalizedItem.leftClickAction = normalizedItem.leftClickAction || getEquipActionLabel(normalizedItem.slot);
        normalizedItem.rightClickActions = normalizedItem.rightClickActions || [normalizedItem.leftClickAction, "Use", "Drop", "Examine"];
        normalizedItem.bonuses = normalizedItem.bonuses || equipmentMetadata.bonuses || null;
        normalizedItem.requirements = normalizedItem.requirements || equipmentMetadata.requirements || null;
        normalizedItem.icon = normalizedItem.icon || equipmentMetadata.icon || null;
      } else if (!normalizedItem.itemType && !normalizedItem.slot) {
        normalizedItem.slot = null;
        normalizedItem.itemType = null;
        normalizedItem.leftClickAction = null;
        normalizedItem.rightClickActions = normalizedItem.rightClickActions || ["Use", "Drop", "Examine"];
      }

      this.enrichItem(normalizedItem);

      if (normalizedId === "coins") {
        return this.addCoinsWithTokenConversion(normalizedItem);
      }

      if (normalizedId === "platinum_token") {
        return this.addPlatinumWithDivineConversion(normalizedItem);
      }

      const existing = this.slots.find((slot) => this.canMergeIntoStack(slot, normalizedItem));
      if (existing) {
        const nextQty = Math.max(0, Number(existing.qty) || 0) + amount;
        if (!isUnlimitedStackItem(normalizedId) && nextQty > MAX_STACK_QTY) return false;
        existing.qty = nextQty;
        this.applyStackMergeMeta(existing, normalizedItem);

        this.pruneItemIntel();
        return true;
      }

      if (!isUnlimitedStackItem(normalizedId) && amount > MAX_STACK_QTY) return false;

      const index = this.slots.findIndex((s) => s === null);
      if (index === -1) return false;
      this.slots[index] = normalizedItem;
      this.pruneItemIntel();
      return true;
    }

    getSlots() {
      return this.slots;
    }

    swapSlots(fromIndex, toIndex) {
      const a = Number(fromIndex);
      const b = Number(toIndex);
      if (!Number.isInteger(a) || !Number.isInteger(b)) return false;
      if (a < 0 || b < 0 || a >= this.size || b >= this.size || a === b) return false;

      const temp = this.slots[a];
      this.slots[a] = this.slots[b];
      this.slots[b] = temp;
      return true;
    }
  }

  RSGame.Inventory = Inventory;
})();

