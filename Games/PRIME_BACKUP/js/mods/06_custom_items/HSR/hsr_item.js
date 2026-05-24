// Custom item definition for Hazelmere's Signet Ring
window.RSGame = window.RSGame || {};
RSGame.CustomItems = RSGame.CustomItems || {};

const HSR_ITEM_ID = "39814";

RSGame.CustomItems[HSR_ITEM_ID] = {
  id: 39814,
  name: "Hazelmere's Signet Ring",
  icon: "js/mods/06_custom_items/HSR/Hazelmere's_signet_ring.png",
  tradable: false,
  description: "Dev ring of Zyrex.",
  stackable: false,
  slot: "ring",
  itemType: "Equipment",
  bonuses: {
    Stab: 100000,
    Slash: 100000,
    Crush: 100000,
    Ranged: 100000,
    Magic: 100000,
    "Stab Defence": 100000,
    "Slash Defence": 100000,
    "Crush Defence": 100000,
    "Ranged Defence": 100000,
    "Magic Defence": 100000,
    "Melee Strength": 100000,
    "Ranged Strength": 100000,
    "Magic Damage": 100000,
    Prayer: 2
  },
  leftClickAction: "Equip Ring",
  rightClickActions: ["Equip Ring", "Use", "Drop", "Examine"]
};

RSGame.CustomItems.hasItem = function (player, itemId) {
  if (!player) return false;
  const normalizedId = String(itemId);
  const slots = player.inventory?.getSlots?.() || player.inventory?.slots || [];
  if (slots.some((slot) => String(slot?.id) === normalizedId)) return true;

  const equipped = player.equipment?.slots || {};
  return Object.values(equipped).some((item) => String(item?.id) === normalizedId);
};

RSGame.CustomItems["26374"] = {
  id: 26374,
  name: "Unknown Item 26374",
  icon: "https://oldschool.runescape.wiki/images/thumb/Coins_10000.png/32px-Coins_10000.png",
  tradable: true,
  description: "An unknown item.",
  stackable: false,
  slot: null,
  itemType: "General",
  bonuses: {},
  leftClickAction: "Use",
  rightClickActions: ["Use", "Drop", "Examine"]
};

RSGame.CustomItems["26386"] = {
  id: 26386,
  name: "Unknown Item 26386",
  icon: "https://oldschool.runescape.wiki/images/thumb/Coins_10000.png/32px-Coins_10000.png",
  tradable: true,
  description: "An unknown item.",
  stackable: false,
  slot: null,
  itemType: "General",
  bonuses: {},
  leftClickAction: "Use",
  rightClickActions: ["Use", "Drop", "Examine"]
};

RSGame.CustomItems["26382"] = {
  id: 26382,
  name: "Unknown Item 26382",
  icon: "https://oldschool.runescape.wiki/images/thumb/Coins_10000.png/32px-Coins_10000.png",
  tradable: true,
  description: "An unknown item.",
  stackable: false,
  slot: null,
  itemType: "General",
  bonuses: {},
  leftClickAction: "Use",
  rightClickActions: ["Use", "Drop", "Examine"]
};

RSGame.CustomItems["26384"] = {
  id: 26384,
  name: "Unknown Item 26384",
  icon: "https://oldschool.runescape.wiki/images/thumb/Coins_10000.png/32px-Coins_10000.png",
  tradable: true,
  description: "An unknown item.",
  stackable: false,
  slot: null,
  itemType: "General",
  bonuses: {},
  leftClickAction: "Use",
  rightClickActions: ["Use", "Drop", "Examine"]
};
