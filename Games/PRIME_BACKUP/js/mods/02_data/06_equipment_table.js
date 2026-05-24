window.RSGame = window.RSGame || {};

(function () {
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
      bonuses: { Crush: 1 },
      requirements: { Mining: 1 },
      icon: "https://oldschool.runescape.wiki/images/thumb/Bronze_pickaxe_detail.png/32px-Bronze_pickaxe_detail.png"
    },
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
      bonuses: { Stab: 5, Slash: 5, Crush: 15 },
      requirements: { Attack: 75 },
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
