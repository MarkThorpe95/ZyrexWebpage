window.RSGame = window.RSGame || {};

(function () {
  function wikiThumb(file) {
    return `https://oldschool.runescape.wiki/images/thumb/${file}/32px-${file}`;
  }

  function createWeaponMeta(tierIndex, attackRequirement, iconFile) {
    const stab = 2 + (tierIndex * 4);
    const slash = stab + 1;
    const crush = Math.max(1, stab - 1);
    const strength = 3 + (tierIndex * 2);

    return {
      slot: "weapon",
      bonuses: {
        Stab: stab,
        Slash: slash,
        Crush: crush,
        "Melee Strength": strength
      },
      requirements: {
        Attack: attackRequirement
      },
      icon: wikiThumb(iconFile)
    };
  }

  function createArmorMeta(tierIndex, slot, defenceRequirement, iconFile) {
    const base = 2 + (tierIndex * 2);
    const slotScale = slot === "body" ? 3 : slot === "shield" ? 2 : 1;
    const defence = base * slotScale;

    return {
      slot,
      bonuses: {
        "Stab Defence": defence,
        "Slash Defence": defence,
        "Crush Defence": defence + (slot === "body" ? 1 : 0),
        "Ranged Defence": Math.max(0, defence - 1),
        "Magic Defence": Math.max(0, defence - 2)
      },
      requirements: {
        Defence: defenceRequirement
      },
      icon: wikiThumb(iconFile)
    };
  }

  function createPickaxeMeta(tierIndex, miningRequirement, iconFile) {
    return {
      slot: "weapon",
      bonuses: {
        Stab: 1 + tierIndex,
        Slash: 1 + tierIndex,
        Crush: 2 + (tierIndex * 2),
        "Melee Strength": 0,
        Mining: 1 + tierIndex
      },
      requirements: {
        Mining: miningRequirement
      },
      icon: wikiThumb(iconFile)
    };
  }

  const EQUIPMENT_TABLE = {
    bronze_sword: {
      slot: "weapon",
      bonuses: { Stab: 2, Slash: 3, Crush: 1 },
      requirements: { Attack: 1 },
      icon: "https://oldschool.runescape.wiki/images/thumb/Bronze_sword_detail.png/32px-Bronze_sword_detail.png"
    },
    iron_sword: {
      slot: "weapon",
      bonuses: { Stab: 4, Slash: 5, Crush: 2 },
      requirements: { Attack: 5 },
      icon: "https://oldschool.runescape.wiki/images/thumb/Iron_sword_detail.png/32px-Iron_sword_detail.png"
    },
    steel_sword: {
      slot: "weapon",
      bonuses: { Stab: 10, Slash: 12, Crush: 5 },
      requirements: { Attack: 20 },
      icon: "https://oldschool.runescape.wiki/images/thumb/Steel_sword_detail.png/32px-Steel_sword_detail.png"
    },
    bronze_pickaxe: {
      slot: "weapon",
      bonuses: { Stab: 1, Slash: 1, Crush: 2, "Melee Strength": 0, Mining: 1 },
      requirements: { Mining: 1 },
      icon: "https://oldschool.runescape.wiki/images/thumb/Bronze_pickaxe_detail.png/32px-Bronze_pickaxe_detail.png"
    },
    bronze_scimitar: createWeaponMeta(0, 1, "Bronze_scimitar_detail.png"),
    bronze_dagger: createWeaponMeta(0, 1, "Bronze_dagger_detail.png"),
    bronze_full_helm: createArmorMeta(0, "head", 1, "Bronze_full_helm_detail.png"),
    bronze_platebody: createArmorMeta(0, "body", 1, "Bronze_platebody_detail.png"),
    bronze_platelegs: createArmorMeta(0, "legs", 1, "Bronze_platelegs_detail.png"),
    bronze_plateskirt: createArmorMeta(0, "legs", 1, "Bronze_plateskirt_detail.png"),
    bronze_kiteshield: createArmorMeta(0, "shield", 1, "Bronze_kiteshield_detail.png"),
    iron_scimitar: createWeaponMeta(1, 1, "Iron_scimitar_detail.png"),
    iron_dagger: createWeaponMeta(1, 1, "Iron_dagger_detail.png"),
    iron_full_helm: createArmorMeta(1, "head", 1, "Iron_full_helm_detail.png"),
    iron_platebody: createArmorMeta(1, "body", 1, "Iron_platebody_detail.png"),
    iron_platelegs: createArmorMeta(1, "legs", 1, "Iron_platelegs_detail.png"),
    iron_plateskirt: createArmorMeta(1, "legs", 1, "Iron_plateskirt_detail.png"),
    iron_kiteshield: createArmorMeta(1, "shield", 1, "Iron_kiteshield_detail.png"),
    steel_scimitar: createWeaponMeta(2, 5, "Steel_scimitar_detail.png"),
    steel_dagger: createWeaponMeta(2, 5, "Steel_dagger_detail.png"),
    steel_full_helm: createArmorMeta(2, "head", 5, "Steel_full_helm_detail.png"),
    steel_platebody: createArmorMeta(2, "body", 5, "Steel_platebody_detail.png"),
    steel_platelegs: createArmorMeta(2, "legs", 5, "Steel_platelegs_detail.png"),
    steel_plateskirt: createArmorMeta(2, "legs", 5, "Steel_plateskirt_detail.png"),
    steel_kiteshield: createArmorMeta(2, "shield", 5, "Steel_kiteshield_detail.png"),
    black_sword: createWeaponMeta(3, 10, "Black_sword_detail.png"),
    black_scimitar: createWeaponMeta(3, 10, "Black_scimitar_detail.png"),
    black_dagger: createWeaponMeta(3, 10, "Black_dagger_detail.png"),
    black_full_helm: createArmorMeta(3, "head", 10, "Black_full_helm_detail.png"),
    black_platebody: createArmorMeta(3, "body", 10, "Black_platebody_detail.png"),
    black_platelegs: createArmorMeta(3, "legs", 10, "Black_platelegs_detail.png"),
    black_plateskirt: createArmorMeta(3, "legs", 10, "Black_plateskirt_detail.png"),
    black_kiteshield: createArmorMeta(3, "shield", 10, "Black_kiteshield_detail.png"),
    black_pickaxe: createPickaxeMeta(3, 11, "Black_pickaxe_detail.png"),
    mithril_sword: createWeaponMeta(4, 20, "Mithril_sword_detail.png"),
    mithril_scimitar: createWeaponMeta(4, 20, "Mithril_scimitar_detail.png"),
    mithril_dagger: createWeaponMeta(4, 20, "Mithril_dagger_detail.png"),
    mithril_full_helm: createArmorMeta(4, "head", 20, "Mithril_full_helm_detail.png"),
    mithril_platebody: createArmorMeta(4, "body", 20, "Mithril_platebody_detail.png"),
    mithril_platelegs: createArmorMeta(4, "legs", 20, "Mithril_platelegs_detail.png"),
    mithril_plateskirt: createArmorMeta(4, "legs", 20, "Mithril_plateskirt_detail.png"),
    mithril_kiteshield: createArmorMeta(4, "shield", 20, "Mithril_kiteshield_detail.png"),
    mithril_pickaxe: createPickaxeMeta(4, 21, "Mithril_pickaxe_detail.png"),
    adamant_sword: createWeaponMeta(5, 30, "Adamant_sword_detail.png"),
    adamant_scimitar: createWeaponMeta(5, 30, "Adamant_scimitar_detail.png"),
    adamant_dagger: createWeaponMeta(5, 30, "Adamant_dagger_detail.png"),
    adamant_full_helm: createArmorMeta(5, "head", 30, "Adamant_full_helm_detail.png"),
    adamant_platebody: createArmorMeta(5, "body", 30, "Adamant_platebody_detail.png"),
    adamant_platelegs: createArmorMeta(5, "legs", 30, "Adamant_platelegs_detail.png"),
    adamant_plateskirt: createArmorMeta(5, "legs", 30, "Adamant_plateskirt_detail.png"),
    adamant_kiteshield: createArmorMeta(5, "shield", 30, "Adamant_kiteshield_detail.png"),
    adamant_pickaxe: createPickaxeMeta(5, 31, "Adamant_pickaxe_detail.png"),
    rune_sword: createWeaponMeta(6, 40, "Rune_sword_detail.png"),
    rune_scimitar: createWeaponMeta(6, 40, "Rune_scimitar_detail.png"),
    rune_dagger: createWeaponMeta(6, 40, "Rune_dagger_detail.png"),
    rune_full_helm: createArmorMeta(6, "head", 40, "Rune_full_helm_detail.png"),
    rune_platebody: createArmorMeta(6, "body", 40, "Rune_platebody_detail.png"),
    rune_platelegs: createArmorMeta(6, "legs", 40, "Rune_platelegs_detail.png"),
    rune_plateskirt: createArmorMeta(6, "legs", 40, "Rune_plateskirt_detail.png"),
    rune_kiteshield: createArmorMeta(6, "shield", 40, "Rune_kiteshield_detail.png"),
    rune_pickaxe: createPickaxeMeta(6, 41, "Rune_pickaxe_detail.png"),
    dragon_sword: createWeaponMeta(7, 60, "Dragon_sword_detail.png"),
    dragon_scimitar: createWeaponMeta(7, 60, "Dragon_scimitar_detail.png"),
    dragon_dagger: createWeaponMeta(7, 60, "Dragon_dagger_detail.png"),
    dragon_full_helm: createArmorMeta(7, "head", 60, "Dragon_full_helm_detail.png"),
    dragon_med_helm: createArmorMeta(7, "head", 60, "Dragon_med_helm_detail.png"),
    dragon_chainbody: createArmorMeta(7, "body", 60, "Dragon_chainbody_detail.png"),
    dragon_platebody: createArmorMeta(7, "body", 60, "Dragon_platebody_detail.png"),
    dragon_platelegs: createArmorMeta(7, "legs", 60, "Dragon_platelegs_detail.png"),
    dragon_plateskirt: createArmorMeta(7, "legs", 60, "Dragon_plateskirt_detail.png"),
    dragon_kiteshield: createArmorMeta(7, "shield", 60, "Dragon_kiteshield_detail.png"),
    dragon_pickaxe: createPickaxeMeta(7, 61, "Dragon_pickaxe_detail.png"),
    crystal_pickaxe: createPickaxeMeta(8, 71, "Crystal_pickaxe_detail.png"),
    leather_body: {
      slot: "body",
      bonuses: { "Melee Strength": 1 },
      requirements: { Defence: 1 },
      icon: "https://oldschool.runescape.wiki/images/thumb/Leather_body_detail.png/32px-Leather_body_detail.png"
    },
    iron_platelegs: {
      slot: "legs",
      bonuses: { "Crush Defence": 2 },
      requirements: { Defence: 10 },
      icon: "https://oldschool.runescape.wiki/images/thumb/Iron_platelegs_detail.png/32px-Iron_platelegs_detail.png"
    },
    wooden_shield: {
      slot: "shield",
      bonuses: { "Crush Defence": 3 },
      requirements: { Defence: 5 },
      icon: "https://oldschool.runescape.wiki/images/thumb/Wooden_shield_detail.png/32px-Wooden_shield_detail.png"
    },
    plain_robe_top: {
      slot: "body",
      bonuses: { "Magic Defence": 1 },
      requirements: { Magic: 1 },
      icon: "https://oldschool.runescape.wiki/images/thumb/Wizard_robe_top_detail.png/32px-Wizard_robe_top_detail.png"
    },
    hazelmere_signet_ring: {
      slot: "ring",
      bonuses: { Prayer: 10000, "All Attack Bonus": 5000, "All Defence Bonus": 5000, "Luck": 10000 },
      requirements: { Prayer: 1 },
      icon: "https://oldschool.runescape.wiki/images/thumb/Hazelmeres_signet_ring_detail.png/32px-Hazelmeres_signet_ring_detail.png"
    },

    // Torva

    torva_full_helm: {
      slot: "head",
      bonuses: { "Melee Strength": 10, "Ranged Strength": 10, "Magic Damage": 10 },
      requirements: { Defence: 75 },
      icon: "https://oldschool.runescape.wiki/images/thumb/Torva_full_helm_detail.png/32px-Torva_full_helm_detail.png"
    },
    torva_platebody: {
      slot: "body",
      bonuses: { "Melee Strength": 10, "Ranged Strength": 10, "Magic Damage": 10 },
      requirements: { Defence: 75 },
      icon: "https://oldschool.runescape.wiki/images/thumb/Torva_platebody_detail.png/32px-Torva_platebody_detail.png"
    },
    torva_platelegs: {
      slot: "legs",
      bonuses: { "Melee Strength": 10, "Ranged Strength": 10, "Magic Damage": 10 },
      requirements: { Defence: 75 },
      icon: "https://oldschool.runescape.wiki/images/thumb/Torva_platelegs_detail.png/32px-Torva_platelegs_detail.png"
    },

    // Bandos

    bandos_tassets: {
      slot: "legs",
      bonuses: { "Melee Strength": 8, "Ranged Strength": 8, "Magic Damage": 8 },
      requirements: { Defence: 65 },
      icon: "https://oldschool.runescape.wiki/images/thumb/Bandos_tassets_detail.png/32px-Bandos_tassets_detail.png"
    },
    bandos_chestplate: {
      slot: "body",
      bonuses: { "Melee Strength": 8, "Ranged Strength": 8, "Magic Damage": 8 },
      requirements: { Defence: 65 },
      icon: "https://oldschool.runescape.wiki/images/thumb/Bandos_chestplate_detail.png/32px-Bandos_chestplate_detail.png"
    },
    bandos_boots: {
      slot: "feet",
      bonuses: { "Melee Strength": 8, "Ranged Strength": 8, "Magic Damage": 8 },
      requirements: { Defence: 65 },
      icon: "https://oldschool.runescape.wiki/images/thumb/Bandos_boots_detail.png/32px-Bandos_boots_detail.png"
    },

    // Rings

    berserker_ring: {
      slot: "ring",
      bonuses: { "Melee Strength": 6 },
      requirements: { Attack: 75 },
      icon: "https://oldschool.runescape.wiki/images/thumb/Berserker_ring_detail.png/32px-Berserker_ring_detail.png"
    },
    seers_ring: {
      slot: "ring",
      bonuses: { "Magic Damage": 6 },
      requirements: { Magic: 75 },
      icon: "https://oldschool.runescape.wiki/images/thumb/Seers_ring_detail.png/32px-Seers_ring_detail.png"
    },
    archers_ring: {
      slot: "ring",
      bonuses: { "Ranged Strength": 6 },
      requirements: { Ranged: 75 },
      icon: "https://oldschool.runescape.wiki/images/thumb/Archers_ring_detail.png/32px-Archers_ring_detail.png"
    },

    // Amulets

    amulet_of_fury: {
      slot: "amulet",
      bonuses: { "Melee Strength": 10, "Ranged Strength": 10, "Magic Damage": 10 },
      requirements: { Prayer: 75 },
      icon: "https://oldschool.runescape.wiki/images/thumb/Amulet_of_fury_detail.png/32px-Amulet_of_fury_detail.png"
    },
    amulet_of_torture: {
      slot: "amulet",
      bonuses: { "Melee Strength": 15 },
      requirements: { Prayer: 75 },
      icon: "https://oldschool.runescape.wiki/images/thumb/Amulet_of_torture_detail.png/32px-Amulet_of_torture_detail.png"
    },
    amulet_of_rancour: {
      slot: "amulet",
      bonuses: { "Melee Strength": 10 },
      requirements: { Prayer: 75 },
      icon: "https://oldschool.runescape.wiki/images/thumb/Amulet_of_rancour_detail.png/32px-Amulet_of_rancour_detail.png"
    },

    // mele weapons

    dragon_hunter_lance: {
      slot: "weapon",
      bonuses: { Stab: 20, Slash: 10, Crush: 5, "Melee Strength": 15 },
      requirements: { Attack: 75 },
      icon: "https://oldschool.runescape.wiki/images/thumb/Dragon_hunter_lance_detail.png/32px-Dragon_hunter_lance_detail.png"
    },
    scythe_of_vitur: {
      slot: "weapon",
      bonuses: { Stab: 15, Slash: 15, Crush: 15, "Melee Strength": 10 },
      requirements: { Attack: 75 },
      icon: "https://oldschool.runescape.wiki/images/thumb/Scythe_of_vitur_detail.png/32px-Scythe_of_vitur_detail.png"
    },
    dragon_hunter_lance: {
      slot: "weapon",
      bonuses: { Stab: 20, Slash: 10, Crush: 5, "Melee Strength": 15 },
      requirements: { Attack: 75 },
      icon: "https://oldschool.runescape.wiki/images/thumb/Dragon_hunter_lance_detail.png/32px-Dragon_hunter_lance_detail.png"
    },

    // shields

    elysian_spirit_shield: {
      slot: "shield",
      bonuses: { "Magic Defence": 15, "Ranged Defence": 15, "Stab Defence": 10, "Slash Defence": 10, "Crush Defence": 10 },
      requirements: { Defence: 75 },
      icon: "https://oldschool.runescape.wiki/images/thumb/Elysian_spirit_shield_detail.png/32px-Elysian_spirit_shield_detail.png"
    },
    arcane_spirit_shield: {
      slot: "shield",
      bonuses: { "Magic Defence": 20, "Ranged Defence": 10, "Stab Defence": 5, "Slash Defence": 5, "Crush Defence": 5 }, 
      requirements: { Defence: 75 },
      icon: "https://oldschool.runescape.wiki/images/thumb/Arcane_spirit_shield_detail.png/32px-Arcane_spirit_shield_detail.png"
    },
    spectral_spirit_shield: {
      slot: "shield",
      bonuses: { "Magic Defence": 10, "Ranged Defence": 20, "Stab Defence": 5, "Slash Defence": 5, "Crush Defence": 5 },
      requirements: { Defence: 75 },
      icon: "https://oldschool.runescape.wiki/images/thumb/Spectral_spirit_shield_detail.png/32px-Spectral_spirit_shield_detail.png"
    },

    // skilling

    third_age_axe: {
      slot: "weapon",
      bonuses: { Stab: 10, Slash: 10, Crush: 10, "Melee Strength": 10 },
      requirements: { Attack: 75 },
      icon: "https://oldschool.runescape.wiki/images/thumb/3rd_age_axe_detail.png/32px-3rd_age_axe_detail.png"
    },
    third_age_pickaxe: {
      slot: "weapon",
      bonuses: { Stab: 10, Slash: 10, Crush: 18, "Melee Strength": 0, Mining: 10 },
      requirements: { Mining: 75 },
      icon: "https://oldschool.runescape.wiki/images/thumb/3rd_age_pickaxe_detail.png/32px-3rd_age_pickaxe_detail.png"
    }
  };

  const NORMALIZED_EQUIPMENT_TABLE = {};
  Object.keys(EQUIPMENT_TABLE).forEach((originalKey) => {
    NORMALIZED_EQUIPMENT_TABLE[normalizeEquipmentLookupKey(originalKey)] = EQUIPMENT_TABLE[originalKey];
  });

  function normalizeEquipmentLookupKey(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/\s*\(noted\)\s*$/i, "")
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_]/g, "");
  }

  function getEquipMetadata(item) {
    if (!item) return null;

    const idKey = normalizeEquipmentLookupKey(item.id);
    if (idKey && NORMALIZED_EQUIPMENT_TABLE[idKey]) {
      return NORMALIZED_EQUIPMENT_TABLE[idKey];
    }

    if (item.name) {
      const nameKey = normalizeEquipmentLookupKey(item.name);
      if (nameKey && NORMALIZED_EQUIPMENT_TABLE[nameKey]) {
        return NORMALIZED_EQUIPMENT_TABLE[nameKey];
      }
    }

    return null;
  }

  function isItemEquipable(item) {
    return !!getEquipMetadata(item);
  }

  function getAllEquipMetadata() {
    return { ...EQUIPMENT_TABLE };
  }

  window.RSGame.EquipmentTable = {
    getEquipMetadata(item) {
      return getEquipMetadata(item);
    },
    isEquipable: isItemEquipable,
    getAllEquipMetadata,
    table: EQUIPMENT_TABLE
  };
})();
