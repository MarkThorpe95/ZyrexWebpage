(function () {
  const NON_MENU_SKILLS = new Set([]);
  const COMBAT_SKILLS = new Set(["Attack", "Strength", "Defence", "Hitpoints", "Ranged", "Prayer", "Magic"]);

  const PATCH_TYPES = {
    allotment: "Allotment",
    herb: "Herb",
    tree: "Tree"
  };

  const FARM_PATCHES = [
    { id: "allotment_north", name: "North Allotment", type: "allotment" },
    { id: "allotment_south", name: "South Allotment", type: "allotment" },
    { id: "herb_patch", name: "Herb Patch", type: "herb" },
    { id: "tree_patch", name: "Tree Patch", type: "tree" }
  ];

  const FARM_SEEDS = [
    { id: "potato_seed", name: "Potato seed", type: "allotment", level: 1, growMs: 2 * 60 * 1000, xpPlant: 8, xpHarvest: 9, yield: [3, 6], produce: { id: "potato", name: "Potato", icon: "Potato.png" }, icon: "Potato_seed_5.png" },
    { id: "onion_seed", name: "Onion seed", type: "allotment", level: 5, growMs: 3 * 60 * 1000, xpPlant: 10, xpHarvest: 10.5, yield: [3, 6], produce: { id: "onion", name: "Onion", icon: "Onion.png" }, icon: "Onion_seed_5.png" },
    { id: "sweetcorn_seed", name: "Sweetcorn seed", type: "allotment", level: 20, growMs: 4 * 60 * 1000, xpPlant: 17, xpHarvest: 19, yield: [3, 6], produce: { id: "sweetcorn", name: "Sweetcorn", icon: "Sweetcorn.png" }, icon: "Sweetcorn_seed_5.png" },

    { id: "guam_seed", name: "Guam seed", type: "herb", level: 9, growMs: 5 * 60 * 1000, xpPlant: 11, xpHarvest: 12.5, yield: [4, 7], produce: { id: "grimy_guam", name: "Grimy guam", icon: "Grimy_guam_leaf.png" }, icon: "Guam_seed_5.png" },
    { id: "ranarr_seed", name: "Ranarr seed", type: "herb", level: 32, growMs: 6 * 60 * 1000, xpPlant: 27, xpHarvest: 30.5, yield: [4, 7], produce: { id: "grimy_ranarr", name: "Grimy ranarr", icon: "Grimy_ranarr_weed.png" }, icon: "Ranarr_seed_5.png" },
    { id: "snapdragon_seed", name: "Snapdragon seed", type: "herb", level: 62, growMs: 7 * 60 * 1000, xpPlant: 47.5, xpHarvest: 54.5, yield: [4, 7], produce: { id: "grimy_snapdragon", name: "Grimy snapdragon", icon: "Grimy_snapdragon.png" }, icon: "Snapdragon_seed_5.png" },

    { id: "oak_acorn", name: "Oak seed", type: "tree", level: 15, growMs: 8 * 60 * 1000, xpPlant: 14, xpHarvest: 466, yield: [4, 6], produce: { id: "oak_log", name: "Oak Logs", icon: "Oak_logs.png" }, icon: "Oak_seedling.png" },
    { id: "maple_seed", name: "Maple seed", type: "tree", level: 45, growMs: 9 * 60 * 1000, xpPlant: 45, xpHarvest: 3403, yield: [4, 6], produce: { id: "maple_log", name: "Maple Logs", icon: "Maple_logs.png" }, icon: "Maple_seedling.png" },
    { id: "yew_seed", name: "Yew seed", type: "tree", level: 60, growMs: 10 * 60 * 1000, xpPlant: 81, xpHarvest: 7069.9, yield: [4, 6], produce: { id: "yew_log", name: "Yew Logs", icon: "Yew_logs.png" }, icon: "Yew_seedling.png" }
  ];

  const SKILL_MENUS = {
    Attack: {
      description: "Train melee accuracy through combat and specialized training.",
      actions: [
        { id: "atk_dummies", name: "Attack Dummies", level: 1, xp: 5, interval: 2400, displayIcon: "Attack_icon_(detail).png" },
        { id: "atk_chickens", name: "Fight Chickens", level: 1, xp: 8, interval: 2200, displayIcon: "Chicken.png" },
        { id: "atk_goblins", name: "Fight Goblins", level: 1, xp: 12.5, interval: 2000, displayIcon: "Goblin.png" },
        { id: "atk_cows", name: "Fight Cows", level: 1, xp: 15, interval: 1900, displayIcon: "Cow.png" },
        { id: "atk_hill_giants", name: "Fight Hill Giants", level: 1, xp: 35, interval: 1800, displayIcon: "Hill_Giant.png" },
        { id: "atk_green_dragons", name: "Fight Green Dragons", level: 1, xp: 75, interval: 1600, displayIcon: "Green_dragon.png" },
        { id: "atk_blue_dragons", name: "Fight Blue Dragons", level: 1, xp: 107.5, interval: 1500, displayIcon: "Blue_dragon.png" },
        { id: "atk_red_dragons", name: "Fight Red Dragons", level: 1, xp: 140, interval: 1400, displayIcon: "Red_dragon.png" },
        { id: "atk_black_dragons", name: "Fight Black Dragons", level: 1, xp: 157.5, interval: 1350, displayIcon: "Black_dragon.png" }
      ]
    },

    Strength: {
      description: "Train melee damage through combat and strength-focused training.",
      actions: [
        { id: "str_dummies", name: "Strength Dummies", level: 1, xp: 5, interval: 2400, displayIcon: "Strength_icon_(detail).png" },
        { id: "str_chickens", name: "Fight Chickens", level: 1, xp: 8, interval: 2200, displayIcon: "Chicken.png" },
        { id: "str_goblins", name: "Fight Goblins", level: 1, xp: 12.5, interval: 2000, displayIcon: "Goblin.png" },
        { id: "str_cows", name: "Fight Cows", level: 1, xp: 15, interval: 1900, displayIcon: "Cow.png" },
        { id: "str_hill_giants", name: "Fight Hill Giants", level: 1, xp: 35, interval: 1800, displayIcon: "Hill_Giant.png" },
        { id: "str_green_dragons", name: "Fight Green Dragons", level: 1, xp: 75, interval: 1600, displayIcon: "Green_dragon.png" },
        { id: "str_blue_dragons", name: "Fight Blue Dragons", level: 1, xp: 107.5, interval: 1500, displayIcon: "Blue_dragon.png" },
        { id: "str_red_dragons", name: "Fight Red Dragons", level: 1, xp: 140, interval: 1400, displayIcon: "Red_dragon.png" },
        { id: "str_black_dragons", name: "Fight Black Dragons", level: 1, xp: 157.5, interval: 1350, displayIcon: "Black_dragon.png" }
      ]
    },

    Defence: {
      description: "Train defensive capabilities through combat and defensive training.",
      actions: [
        { id: "def_dummies", name: "Defence Dummies", level: 1, xp: 5, interval: 2400, displayIcon: "Defence_icon_(detail).png" },
        { id: "def_chickens", name: "Fight Chickens", level: 1, xp: 8, interval: 2200, displayIcon: "Chicken.png" },
        { id: "def_goblins", name: "Fight Goblins", level: 1, xp: 12.5, interval: 2000, displayIcon: "Goblin.png" },
        { id: "def_cows", name: "Fight Cows", level: 1, xp: 15, interval: 1900, displayIcon: "Cow.png" },
        { id: "def_hill_giants", name: "Fight Hill Giants", level: 1, xp: 35, interval: 1800, displayIcon: "Hill_Giant.png" },
        { id: "def_green_dragons", name: "Fight Green Dragons", level: 1, xp: 75, interval: 1600, displayIcon: "Green_dragon.png" },
        { id: "def_blue_dragons", name: "Fight Blue Dragons", level: 1, xp: 107.5, interval: 1500, displayIcon: "Blue_dragon.png" },
        { id: "def_red_dragons", name: "Fight Red Dragons", level: 1, xp: 140, interval: 1400, displayIcon: "Red_dragon.png" },
        { id: "def_black_dragons", name: "Fight Black Dragons", level: 1, xp: 157.5, interval: 1350, displayIcon: "Black_dragon.png" }
      ]
    },

    Hitpoints: {
      description: "Train constitution through combat and health regeneration.",
      actions: [
        { id: "hp_regen", name: "Health Regeneration", level: 1, xp: 1.33, interval: 60000, displayIcon: "Hitpoints_icon_(detail).png" },
        { id: "hp_combat", name: "Combat Training", level: 1, xp: 13, interval: 2400, displayIcon: "Bandages.png" },
        { id: "hp_burthorpe", name: "Burthorpe Games Room", level: 1, xp: 3, interval: 30000, displayIcon: "Games_room.png" }
      ]
    },

    Ranged: {
      description: "Train ranged combat with bows and crossbows.",
      actions: [
        { id: "range_dummies", name: "Ranged Dummies", level: 1, xp: 5, interval: 2400, displayIcon: "Ranged_icon_(detail).png" },
        { id: "range_chickens", name: "Hunt Chickens", level: 1, xp: 8, interval: 2200, displayIcon: "Chicken.png" },
        { id: "range_goblins", name: "Hunt Goblins", level: 1, xp: 12.5, interval: 2000, displayIcon: "Goblin.png" },
        { id: "range_cows", name: "Hunt Cows", level: 1, xp: 15, interval: 1900, displayIcon: "Cow.png" },
        { id: "range_ducks", name: "Hunt Ducks", level: 1, xp: 17, interval: 1800, displayIcon: "Duck.png" },
        { id: "range_bears", name: "Hunt Bears", level: 1, xp: 25, interval: 1700, displayIcon: "Bear_cub.png" },
        { id: "range_unicorns", name: "Hunt Unicorns", level: 1, xp: 30, interval: 1600, displayIcon: "Unicorn.png" },
        { id: "range_wolves", name: "Hunt Wolves", level: 1, xp: 35, interval: 1500, displayIcon: "Wolf.png" },
        { id: "range_green_dragons", name: "Hunt Green Dragons", level: 1, xp: 75, interval: 1400, displayIcon: "Green_dragon.png" },
        { id: "range_blue_dragons", name: "Hunt Blue Dragons", level: 1, xp: 107.5, interval: 1300, displayIcon: "Blue_dragon.png" }
      ]
    },

    Prayer: {
      description: "Train prayer through burying bones and using prayer altars.",
      actions: [
        { id: "pray_bones", name: "Bury Bones", level: 1, xp: 4.5, interval: 1800, displayIcon: "Prayer_icon_(detail).png" },
        { id: "pray_big_bones", name: "Bury Big Bones", level: 1, xp: 15, interval: 1800, displayIcon: "Big_bones.png" },
        { id: "pray_baby_dragon_bones", name: "Bury Baby Dragon Bones", level: 1, xp: 30, interval: 1800, displayIcon: "Baby_dragon_bones.png" },
        { id: "pray_dragon_bones", name: "Bury Dragon Bones", level: 1, xp: 72, interval: 1800, displayIcon: "Dragon_bones.png" },
        { id: "pray_frost_dragon_bones", name: "Bury Frost Dragon Bones", level: 1, xp: 180, interval: 1800, displayIcon: "Frost_dragon_bones.png" },
        { id: "pray_altar", name: "Chaos Altar", level: 1, xp: 3.6, interval: 2400, displayIcon: "Chaos_altar.png" },
        { id: "pray_gilded_altar", name: "Gilded Altar", level: 1, xp: 250, interval: 1800, displayIcon: "Gilded_altar.png" }
      ]
    },

    Magic: {
      description: "Train magic through spellcasting and alchemy.",
      actions: [
        { id: "mage_dummies", name: "Magic Dummies", level: 1, xp: 5, interval: 2400, displayIcon: "Magic_icon_(detail).png" },
        { id: "mage_splash", name: "Splash Spells", level: 1, xp: 0, interval: 2400, displayIcon: "Splash.png" },
        { id: "mage_strike", name: "Wind Strike", level: 1, xp: 5.5, interval: 2400, displayIcon: "Wind_Strike.png" },
        { id: "mage_bolt", name: "Wind Bolt", level: 17, xp: 13.5, interval: 2200, displayIcon: "Wind_Bolt.png" },
        { id: "mage_blast", name: "Wind Blast", level: 41, xp: 25.5, interval: 2000, displayIcon: "Wind_Blast.png" },
        { id: "mage_wave", name: "Wind Wave", level: 62, xp: 36, interval: 1800, displayIcon: "Wind_Wave.png" },
        { id: "mage_surge", name: "Wind Surge", level: 81, xp: 44.5, interval: 1600, displayIcon: "Wind_Surge.png" },
        { id: "mage_alch", name: "Low Alchemy", level: 21, xp: 31, interval: 1800, displayIcon: "Low_Level_Alchemy.png" },
        { id: "mage_high_alch", name: "High Alchemy", level: 55, xp: 65, interval: 1800, displayIcon: "High_Level_Alchemy.png" }
      ]
    },

    Woodcutting: {
      description: "Chop trees directly from the Skills tab.",
      actions: [
        { id: "wc_normal", name: "Cut Trees", level: 1, xp: 25, interval: 3000, outputs: [{ id: "normal_log", name: "Logs", qty: 1, icon: "Logs.png", stackable: true }], displayIcon: "Tree.png" },
        { id: "wc_oak", name: "Cut Oak Trees", level: 15, xp: 37.5, interval: 3500, outputs: [{ id: "oak_log", name: "Oak Logs", qty: 1, icon: "Oak_logs.png", stackable: true }], displayIcon: "Oak_tree.png" },
        { id: "wc_willow", name: "Cut Willow Trees", level: 30, xp: 67.5, interval: 4000, outputs: [{ id: "willow_log", name: "Willow Logs", qty: 1, icon: "Willow_logs.png", stackable: true }], displayIcon: "Willow_tree.png" },
        { id: "wc_teak", name: "Cut Teak Trees", level: 35, xp: 85, interval: 4200, outputs: [{ id: "teak_log", name: "Teak Logs", qty: 1, icon: "Teak_logs.png", stackable: true }], displayIcon: "Teak_tree.png" },
        { id: "wc_maple", name: "Cut Maple Trees", level: 45, xp: 100, interval: 4500, outputs: [{ id: "maple_log", name: "Maple Logs", qty: 1, icon: "Maple_logs.png", stackable: true }], displayIcon: "Maple_tree.png" },
        { id: "wc_mahogany", name: "Cut Mahogany Trees", level: 50, xp: 125, interval: 4800, outputs: [{ id: "mahogany_log", name: "Mahogany Logs", qty: 1, icon: "Mahogany_logs.png", stackable: true }], displayIcon: "Mahogany_tree.png" },
        { id: "wc_yew", name: "Cut Yew Trees", level: 60, xp: 175, interval: 5000, outputs: [{ id: "yew_log", name: "Yew Logs", qty: 1, icon: "Yew_logs.png", stackable: true }], displayIcon: "Yew_tree.png" },
        { id: "wc_magic", name: "Cut Magic Trees", level: 75, xp: 250, interval: 5500, outputs: [{ id: "magic_log", name: "Magic Logs", qty: 1, icon: "Magic_logs.png", stackable: true }], displayIcon: "Magic_tree.png" },
        { id: "wc_redwood", name: "Cut Redwood Trees", level: 90, xp: 380, interval: 6200, outputs: [{ id: "redwood_log", name: "Redwood Logs", qty: 1, icon: "Redwood_logs.png", stackable: true }], displayIcon: "Redwood_tree.png" }
      ]
    },

    Mining: {
      description: "Mine rocks directly from the Skills tab.",
      actions: [
        { id: "mine_rune_essence", name: "Mine Rune essence", level: 1, xp: 5, interval: 100, outputs: [{ id: "rune_essence", name: "Rune essence", qty: 5, icon: "Rune_essence.png", stackable: true }], displayIcon: "Rune_essence.png" },
        { id: "mine_copper", name: "Mine Copper", level: 1, xp: 17.5, interval: 1800, outputs: [{ id: "copper_ore", name: "Copper Ore", qty: 1, icon: "Copper_ore.png", stackable: true }], displayIcon: "Copper_ore.png" },
        { id: "mine_tin", name: "Mine Tin", level: 1, xp: 17.5, interval: 1800, outputs: [{ id: "tin_ore", name: "Tin Ore", qty: 1, icon: "Tin_ore.png", stackable: true }], displayIcon: "Tin_ore.png" },
        { id: "mine_iron", name: "Mine Iron", level: 15, xp: 35, interval: 2200, outputs: [{ id: "iron_ore", name: "Iron Ore", qty: 1, icon: "Iron_ore.png", stackable: true }], displayIcon: "Iron_ore.png" },
        { id: "mine_silver", name: "Mine Silver", level: 20, xp: 40, interval: 2400, outputs: [{ id: "silver_ore", name: "Silver Ore", qty: 1, icon: "Silver_ore.png", stackable: true }], displayIcon: "Silver_ore.png" },
        { id: "mine_pure_essence", name: "Mine Pure essence", level: 1, xp: 5, interval: 2800, outputs: [{ id: "pure_essence", name: "Pure essence", qty: 1, icon: "Pure_essence.png", stackable: true }], displayIcon: "Pure_essence.png" },
        { id: "mine_coal", name: "Mine Coal", level: 30, xp: 50, interval: 2600, outputs: [{ id: "coal", name: "Coal", qty: 1, icon: "Coal.png", stackable: true }], displayIcon: "Coal.png" },
        { id: "mine_gold", name: "Mine Gold", level: 40, xp: 65, interval: 2800, outputs: [{ id: "gold_ore", name: "Gold Ore", qty: 1, icon: "Gold_ore.png", stackable: true }], displayIcon: "Gold_ore.png" },
        { id: "mine_mithril", name: "Mine Mithril", level: 55, xp: 80, interval: 3200, outputs: [{ id: "mithril_ore", name: "Mithril Ore", qty: 1, icon: "Mithril_ore.png", stackable: true }], displayIcon: "Mithril_ore.png" },
        { id: "mine_adamantite", name: "Mine Adamantite", level: 70, xp: 95, interval: 5000, outputs: [{ id: "adamantite_ore", name: "Adamantite Ore", qty: 1, icon: "Adamantite_ore.png", stackable: true }], displayIcon: "Adamantite_ore.png" },
        { id: "mine_soft_clay", name: "Mine Soft Clay", level: 70, xp: 5, interval: 250, outputs: [{ id: "soft_clay", name: "Soft Clay", qty: 1, icon: "Soft_clay.png", stackable: true }], displayIcon: "Soft_clay.png" },
        { id: "mine_runite", name: "Mine Runite", level: 85, xp: 125, interval: 4800, outputs: [{ id: "runite_ore", name: "Runite Ore", qty: 5, icon: "Runite_ore.png", stackable: true }], displayIcon: "Runite_ore.png" },
        { id: "mine_amethyst", name: "Mine Amethyst", level: 92, xp: 240, interval: 600, outputs: [{ id: "amethyst", name: "Amethyst", qty: 16, icon: "Amethyst.png", stackable: true }], displayIcon: "Amethyst.png" }
        
      ]
    },

    Fletching: {
      description: "Whittle logs and assemble arrows from gathered resources.",
      actions: [
        { id: "fletch_shafts", name: "Whittle Arrow Shafts", level: 1, xp: 5, interval: 1800, inputs: [{ id: "normal_log", qty: 1 }], outputs: [{ id: "arrow_shaft", name: "Arrow shaft", qty: 15, icon: "Arrow_shaft.png", stackable: true }], displayIcon: "Arrow_shaft.png" },
        { id: "fletch_headless_arrows", name: "Craft Headless Arrows", level: 1, xp: 5, interval: 1800, inputs: [{ id: "arrow_shaft", qty: 15 }], outputs: [{ id: "headless_arrow", name: "Headless arrow", qty: 15, icon: "Headless_arrow.png", stackable: true }], displayIcon: "Headless_arrow.png" },
        { id: "fletch_shortbow_u", name: "Fletch Shortbow (u)", level: 5, xp: 5, interval: 2200, inputs: [{ id: "normal_log", qty: 1 }], outputs: [{ id: "normal_shortbow_u", name: "Shortbow (u)", qty: 1, icon: "Shortbow_(u).png", stackable: false }], displayIcon: "Shortbow_(u).png" },
        { id: "fletch_longbow_u", name: "Fletch Longbow (u)", level: 10, xp: 10, interval: 2400, inputs: [{ id: "normal_log", qty: 1 }], outputs: [{ id: "normal_longbow_u", name: "Longbow (u)", qty: 1, icon: "Longbow_(u).png", stackable: false }], displayIcon: "Longbow_(u).png" },
        { id: "fletch_oak_shortbow_u", name: "Fletch Oak Shortbow (u)", level: 20, xp: 16.5, interval: 2600, inputs: [{ id: "oak_log", qty: 1 }], outputs: [{ id: "oak_shortbow_u", name: "Oak shortbow (u)", qty: 1, icon: "Oak_shortbow_(u).png", stackable: false }], displayIcon: "Oak_shortbow_(u).png" },
        { id: "fletch_oak_longbow_u", name: "Fletch Oak Longbow (u)", level: 25, xp: 20, interval: 2800, inputs: [{ id: "oak_log", qty: 1 }], outputs: [{ id: "oak_longbow_u", name: "Oak longbow (u)", qty: 1, icon: "Oak_longbow_(u).png", stackable: false }], displayIcon: "Oak_longbow_(u).png" },
        { id: "fletch_willow_shortbow_u", name: "Fletch Willow Shortbow (u)", level: 30, xp: 25, interval: 2400, inputs: [{ id: "willow_log", qty: 1 }], outputs: [{ id: "willow_shortbow_u", name: "Willow shortbow (u)", qty: 1, icon: "Willow_shortbow_(u).png", stackable: false }], displayIcon: "Willow_shortbow_(u).png" },
        { id: "fletch_willow_longbow_u", name: "Fletch Willow Longbow (u)", level: 35, xp: 30, interval: 2600, inputs: [{ id: "willow_log", qty: 1 }], outputs: [{ id: "willow_longbow_u", name: "Willow longbow (u)", qty: 1, icon: "Willow_longbow_(u).png", stackable: false }], displayIcon: "Willow_longbow_(u).png" },
        { id: "fletch_maple_shortbow_u", name: "Fletch Maple Shortbow (u)", level: 45, xp: 41.5, interval: 2600, inputs: [{ id: "maple_log", qty: 1 }], outputs: [{ id: "maple_shortbow_u", name: "Maple shortbow (u)", qty: 1, icon: "Maple_shortbow_(u).png", stackable: false }], displayIcon: "Maple_shortbow_(u).png" },
        { id: "fletch_maple_longbow_u", name: "Fletch Maple Longbow (u)", level: 50, xp: 50, interval: 2800, inputs: [{ id: "maple_log", qty: 1 }], outputs: [{ id: "maple_longbow_u", name: "Maple longbow (u)", qty: 1, icon: "Maple_longbow_(u).png", stackable: false }], displayIcon: "Maple_longbow_(u).png" },
        { id: "fletch_yew_shortbow_u", name: "Fletch Yew Shortbow (u)", level: 60, xp: 67.5, interval: 2800, inputs: [{ id: "yew_log", qty: 1 }], outputs: [{ id: "yew_shortbow_u", name: "Yew shortbow (u)", qty: 1, icon: "Yew_shortbow_(u).png", stackable: false }], displayIcon: "Yew_shortbow_(u).png" },
        { id: "fletch_yew_longbow_u", name: "Fletch Yew Longbow (u)", level: 65, xp: 75, interval: 3000, inputs: [{ id: "yew_log", qty: 1 }], outputs: [{ id: "yew_longbow_u", name: "Yew longbow (u)", qty: 1, icon: "Yew_longbow_(u).png", stackable: false }], displayIcon: "Yew_longbow_(u).png" },
        { id: "fletch_magic_shortbow_u", name: "Fletch Magic Shortbow (u)", level: 75, xp: 100, interval: 3000, inputs: [{ id: "magic_log", qty: 1 }], outputs: [{ id: "magic_shortbow_u", name: "Magic shortbow (u)", qty: 1, icon: "Magic_shortbow_(u).png", stackable: false }], displayIcon: "Magic_shortbow_(u).png" },
        { id: "fletch_magic_longbow_u", name: "Fletch Magic Longbow (u)", level: 80, xp: 125, interval: 3200, inputs: [{ id: "magic_log", qty: 1 }], outputs: [{ id: "magic_longbow_u", name: "Magic longbow (u)", qty: 1, icon: "Magic_longbow_(u).png", stackable: false }], displayIcon: "Magic_longbow_(u).png" },
        { id: "fletch_bronze_arrows", name: "Attach Feathers to Bronze Arrows", level: 1, xp: 5, interval: 1800, inputs: [{ id: "bronze_arrow", qty: 15 }, { id: "feather", qty: 15 }], outputs: [{ id: "bronze_arrow", name: "Bronze arrow", qty: 15, icon: "Bronze_arrow_5.png", stackable: true }], displayIcon: "Bronze_arrow_5.png" },
        { id: "fletch_steel_arrows", name: "Attach Feathers to Steel Arrows", level: 35, xp: 37.5, interval: 2800, inputs: [{ id: "steel_arrow", qty: 15 }, { id: "feather", qty: 15 }], outputs: [{ id: "steel_arrow", name: "Steel arrow", qty: 15, icon: "Steel_arrow_5.png", stackable: true }], displayIcon: "Steel_arrow_5.png" },
        { id: "fletch_mithril_arrows", name: "Attach Feathers to Mithril Arrows", level: 50, xp: 62.5, interval: 3000, inputs: [{ id: "mithril_arrow", qty: 15 }, { id: "feather", qty: 15 }], outputs: [{ id: "mithril_arrow", name: "Mithril arrow", qty: 15, icon: "Mithril_arrow_5.png", stackable: true }], displayIcon: "Mithril_arrow_5.png" },
        { id: "fletch_adamant_arrows", name: "Attach Feathers to Adamant Arrows", level: 65, xp: 87.5, interval: 3200, inputs: [{ id: "adamant_arrow", qty: 15 }, { id: "feather", qty: 15 }], outputs: [{ id: "adamant_arrow", name: "Adamant arrow", qty: 15, icon: "Adamant_arrow_5.png", stackable: true }], displayIcon: "Adamant_arrow_5.png" },
        { id: "fletch_rune_arrows", name: "Attach Feathers to Rune Arrows", level: 80, xp: 112.5, interval: 3400, inputs: [{ id: "rune_arrow", qty: 15 }, { id: "feather", qty: 15 }], outputs: [{ id: "rune_arrow", name: "Rune arrow", qty: 15, icon: "Rune_arrow_5.png", stackable: true }], displayIcon: "Rune_arrow_5.png" },
        { id: "fletch_amethyst_arrows", name: "Attach Feathers to Amethyst Arrows", level: 92, xp: 150, interval: 3600, inputs: [{ id: "amethyst_arrow", qty: 15 }, { id: "feather", qty: 15 }], outputs: [{ id: "amethyst_arrow", name: "Amethyst arrow", qty: 15, icon: "Amethyst_arrow_5.png", stackable: true }], displayIcon: "Amethyst_arrow_5.png" },
        { id: "fletch_bronze_darts", name: "Attach Feathers to Bronze Darts", level: 1, xp: 5, interval: 1800, inputs: [{ id: "bronze_dart", qty: 10 }, { id: "feather", qty: 10 }], outputs: [{ id: "bronze_dart", name: "Bronze dart", qty: 10, icon: "Bronze_dart_5.png", stackable: true }], displayIcon: "Bronze_dart_5.png" },
        { id: "fletch_iron_darts", name: "Attach Feathers to Iron Darts", level: 40, xp: 40, interval: 2800, inputs: [{ id: "iron_dart", qty: 10 }, { id: "feather", qty: 10 }], outputs: [{ id: "iron_dart", name: "Iron dart", qty: 10, icon: "Iron_dart_5.png", stackable: true }], displayIcon: "Iron_dart_5.png" },
        { id: "fletch_steel_darts", name: "Attach Feathers to Steel Darts", level: 50, xp: 62.5, interval: 3000, inputs: [{ id: "steel_dart", qty: 10 }, { id: "feather", qty: 10 }], outputs: [{ id: "steel_dart", name: "Steel dart", qty: 10, icon: "Steel_dart_5.png", stackable: true }], displayIcon: "Steel_dart_5.png" },
        { id: "fletch_mithril_darts", name: "Attach Feathers to Mithril Darts", level: 60, xp: 87.5, interval: 3200, inputs: [{ id: "mithril_dart", qty: 10 }, { id: "feather", qty: 10 }], outputs: [{ id: "mithril_dart", name: "Mithril dart", qty: 10, icon: "Mithril_dart_5.png", stackable: true }], displayIcon: "Mithril_dart_5.png" },
        { id: "fletch_adamant_darts", name: "Attach Feathers to Adamant Darts", level: 70, xp: 112.5, interval: 3400, inputs: [{ id: "adamant_dart", qty: 10 }, { id: "feather", qty: 10 }], outputs: [{ id: "adamant_dart", name: "Adamant dart", qty: 10, icon: "Adamant_dart_5.png", stackable: true }], displayIcon: "Adamant_dart_5.png" },
        { id: "fletch_rune_darts", name: "Attach Feathers to Rune Darts", level: 80, xp: 150, interval: 3600, inputs: [{ id: "rune_dart", qty: 10 }, { id: "feather", qty: 10 }], outputs: [{ id: "rune_dart", name: "Rune dart", qty: 10, icon: "Rune_dart_5.png", stackable: true }], displayIcon: "Rune_dart_5.png" },
        { id: "fletch_amethyst_darts", name: "Attach Feathers to Amethyst Darts", level: 92, xp: 200, interval: 3800, inputs: [{ id: "amethyst_dart", qty: 10 }, { id: "feather", qty: 10 }], outputs: [{ id: "amethyst_dart", name: "Amethyst dart", qty: 10, icon: "Amethyst_dart_5.png", stackable: true }], displayIcon: "Amethyst_dart_5.png" },
        { id: "fletch_dragon_darts", name: "Attach Feathers to Dragon Darts", level: 95, xp: 250, interval: 4000, inputs: [{ id: "dragon_dart", qty: 10 }, { id: "feather", qty: 10 }], outputs: [{ id: "dragon_dart", name: "Dragon dart", qty: 10, icon: "Dragon_dart_5.png", stackable: true }], displayIcon: "Dragon_dart_5.png" }
      ]
    },

    Ranged: {
      description: "Train ranged with target practice and crafted arrows.",
      actions: [
        { id: "ranged_target", name: "Target Practice", level: 1, xp: 8, interval: 2400, outputs: [{ id: "broken_arrow_shaft", name: "Broken arrow shafts", qty: 1, icon: "Arrow_shaft.png", stackable: true }] },
        { id: "ranged_arrow_drill", name: "Arrow Drill", level: 20, xp: 17, interval: 3000, inputs: [{ id: "steel_arrow", qty: 10 }], outputs: [{ id: "fletching_scrap", name: "Fletching scrap", qty: 1, icon: "Feather.png", stackable: true }] }
      ]
    },

    Prayer: {
      description: "Bury bones to gain Prayer XP.",
      actions: [
        { id: "prayer_bones", name: "Bury Bones", level: 1, xp: 4.5, interval: 1600, inputs: [{ id: "bones", qty: 1 }] },
        { id: "prayer_big_bones", name: "Bury Big Bones", level: 15, xp: 15, interval: 1900, inputs: [{ id: "big_bones", qty: 1 }] }
      ]
    },

    Magic: {
      description: "Cast offensive spells from Standard, Ancient, and Arceuus spellbooks. Skilling utility spells are passive unlocks.",
      actions: [
        { id: "magic_wind_strike", name: "[Standard] Wind Strike", level: 1, xp: 5.5, interval: 1800, inputs: [{ id: "air_rune", qty: 1 }, { id: "mind_rune", qty: 1 }], displayIcon: "Wind_Strike.png" },
        { id: "magic_water_strike", name: "[Standard] Water Strike", level: 5, xp: 7.5, interval: 1900, inputs: [{ id: "air_rune", qty: 1 }, { id: "water_rune", qty: 1 }, { id: "mind_rune", qty: 1 }], displayIcon: "Water_Strike.png" },
        { id: "magic_earth_strike", name: "[Standard] Earth Strike", level: 9, xp: 9.5, interval: 1950, inputs: [{ id: "air_rune", qty: 1 }, { id: "earth_rune", qty: 2 }, { id: "mind_rune", qty: 1 }], displayIcon: "Earth_Strike.png" },
        { id: "magic_fire_strike", name: "[Standard] Fire Strike", level: 13, xp: 11.5, interval: 2000, inputs: [{ id: "air_rune", qty: 2 }, { id: "fire_rune", qty: 3 }, { id: "mind_rune", qty: 1 }], displayIcon: "Fire_Strike.png" },
        { id: "magic_wind_bolt", name: "[Standard] Wind Bolt", level: 17, xp: 13.5, interval: 2050, inputs: [{ id: "air_rune", qty: 2 }, { id: "chaos_rune", qty: 1 }], displayIcon: "Wind_Bolt.png" },
        { id: "magic_water_bolt", name: "[Standard] Water Bolt", level: 23, xp: 16.5, interval: 2100, inputs: [{ id: "air_rune", qty: 2 }, { id: "water_rune", qty: 2 }, { id: "chaos_rune", qty: 1 }], displayIcon: "Water_Bolt.png" },
        { id: "magic_earth_bolt", name: "[Standard] Earth Bolt", level: 29, xp: 19.5, interval: 2200, inputs: [{ id: "air_rune", qty: 3 }, { id: "earth_rune", qty: 3 }, { id: "chaos_rune", qty: 1 }], displayIcon: "Earth_Bolt.png" },
        { id: "magic_fire_bolt", name: "[Standard] Fire Bolt", level: 35, xp: 22.5, interval: 2300, inputs: [{ id: "air_rune", qty: 4 }, { id: "fire_rune", qty: 4 }, { id: "chaos_rune", qty: 1 }], displayIcon: "Fire_Bolt.png" },
        { id: "magic_wind_blast", name: "[Standard] Wind Blast", level: 41, xp: 25.5, interval: 2400, inputs: [{ id: "air_rune", qty: 3 }, { id: "death_rune", qty: 1 }], displayIcon: "Wind_Blast.png" },
        { id: "magic_water_blast", name: "[Standard] Water Blast", level: 47, xp: 28.5, interval: 2500, inputs: [{ id: "air_rune", qty: 3 }, { id: "water_rune", qty: 3 }, { id: "death_rune", qty: 1 }], displayIcon: "Water_Blast.png" },
        { id: "magic_earth_blast", name: "[Standard] Earth Blast", level: 53, xp: 31.5, interval: 2600, inputs: [{ id: "air_rune", qty: 4 }, { id: "earth_rune", qty: 4 }, { id: "death_rune", qty: 1 }], displayIcon: "Earth_Blast.png" },
        { id: "magic_fire_blast", name: "[Standard] Fire Blast", level: 59, xp: 34.5, interval: 2700, inputs: [{ id: "air_rune", qty: 5 }, { id: "fire_rune", qty: 5 }, { id: "death_rune", qty: 1 }], displayIcon: "Fire_Blast.png" },
        { id: "magic_saradomin_strike", name: "[Standard] Saradomin Strike", level: 60, xp: 35, interval: 2750, inputs: [{ id: "air_rune", qty: 4 }, { id: "fire_rune", qty: 2 }, { id: "blood_rune", qty: 2 }], displayIcon: "Saradomin_Strike.png" },
        { id: "magic_claws_of_guthix", name: "[Standard] Claws of Guthix", level: 60, xp: 35, interval: 2750, inputs: [{ id: "air_rune", qty: 4 }, { id: "fire_rune", qty: 1 }, { id: "blood_rune", qty: 2 }], displayIcon: "Claws_of_Guthix.png" },
        { id: "magic_flames_of_zamorak", name: "[Standard] Flames of Zamorak", level: 60, xp: 35, interval: 2750, inputs: [{ id: "air_rune", qty: 4 }, { id: "fire_rune", qty: 4 }, { id: "blood_rune", qty: 2 }], displayIcon: "Flames_of_Zamorak.png" },
        { id: "magic_wind_wave", name: "[Standard] Wind Wave", level: 62, xp: 36, interval: 2800, inputs: [{ id: "air_rune", qty: 5 }, { id: "blood_rune", qty: 1 }], displayIcon: "Wind_Wave.png" },
        { id: "magic_water_wave", name: "[Standard] Water Wave", level: 65, xp: 37.5, interval: 2850, inputs: [{ id: "air_rune", qty: 5 }, { id: "water_rune", qty: 7 }, { id: "blood_rune", qty: 1 }], displayIcon: "Water_Wave.png" },
        { id: "magic_earth_wave", name: "[Standard] Earth Wave", level: 70, xp: 40, interval: 2900, inputs: [{ id: "air_rune", qty: 5 }, { id: "earth_rune", qty: 7 }, { id: "blood_rune", qty: 1 }], displayIcon: "Earth_Wave.png" },
        { id: "magic_fire_wave", name: "[Standard] Fire Wave", level: 75, xp: 42.5, interval: 3000, inputs: [{ id: "air_rune", qty: 5 }, { id: "fire_rune", qty: 7 }, { id: "blood_rune", qty: 1 }], displayIcon: "Fire_Wave.png" },
        { id: "magic_wind_surge", name: "[Standard] Wind Surge", level: 81, xp: 44.5, interval: 3150, inputs: [{ id: "air_rune", qty: 7 }, { id: "wrath_rune", qty: 1 }], displayIcon: "Wind_Surge.png" },
        { id: "magic_water_surge", name: "[Standard] Water Surge", level: 85, xp: 46.5, interval: 3200, inputs: [{ id: "air_rune", qty: 7 }, { id: "water_rune", qty: 10 }, { id: "wrath_rune", qty: 1 }], displayIcon: "Water_Surge.png" },
        { id: "magic_earth_surge", name: "[Standard] Earth Surge", level: 90, xp: 48.5, interval: 3300, inputs: [{ id: "air_rune", qty: 7 }, { id: "earth_rune", qty: 10 }, { id: "wrath_rune", qty: 1 }], displayIcon: "Earth_Surge.png" },
        { id: "magic_fire_surge", name: "[Standard] Fire Surge", level: 95, xp: 50.5, interval: 3400, inputs: [{ id: "air_rune", qty: 7 }, { id: "fire_rune", qty: 10 }, { id: "wrath_rune", qty: 1 }], displayIcon: "Fire_Surge.png" },

        { id: "magic_smoke_rush", name: "[Ancient] Smoke Rush", level: 50, xp: 30, interval: 2600, inputs: [{ id: "air_rune", qty: 1 }, { id: "fire_rune", qty: 1 }, { id: "chaos_rune", qty: 2 }, { id: "death_rune", qty: 2 }], displayIcon: "Smoke_Rush.png" },
        { id: "magic_shadow_rush", name: "[Ancient] Shadow Rush", level: 52, xp: 31, interval: 2600, inputs: [{ id: "air_rune", qty: 1 }, { id: "soul_rune", qty: 1 }, { id: "chaos_rune", qty: 2 }, { id: "death_rune", qty: 2 }], displayIcon: "Shadow_Rush.png" },
        { id: "magic_blood_rush", name: "[Ancient] Blood Rush", level: 56, xp: 33, interval: 2700, inputs: [{ id: "blood_rune", qty: 2 }, { id: "chaos_rune", qty: 2 }, { id: "death_rune", qty: 2 }], displayIcon: "Blood_Rush.png" },
        { id: "magic_ice_rush", name: "[Ancient] Ice Rush", level: 58, xp: 34, interval: 2700, inputs: [{ id: "water_rune", qty: 2 }, { id: "chaos_rune", qty: 2 }, { id: "death_rune", qty: 2 }], displayIcon: "Ice_Rush.png" },
        { id: "magic_smoke_burst", name: "[Ancient] Smoke Burst", level: 62, xp: 36, interval: 2800, inputs: [{ id: "air_rune", qty: 2 }, { id: "fire_rune", qty: 2 }, { id: "chaos_rune", qty: 4 }, { id: "death_rune", qty: 2 }], displayIcon: "Smoke_Burst.png" },
        { id: "magic_shadow_burst", name: "[Ancient] Shadow Burst", level: 64, xp: 37, interval: 2800, inputs: [{ id: "air_rune", qty: 1 }, { id: "soul_rune", qty: 2 }, { id: "chaos_rune", qty: 4 }, { id: "death_rune", qty: 2 }], displayIcon: "Shadow_Burst.png" },
        { id: "magic_blood_burst", name: "[Ancient] Blood Burst", level: 68, xp: 39, interval: 2900, inputs: [{ id: "blood_rune", qty: 2 }, { id: "chaos_rune", qty: 4 }, { id: "death_rune", qty: 2 }], displayIcon: "Blood_Burst.png" },
        { id: "magic_ice_burst", name: "[Ancient] Ice Burst", level: 70, xp: 40, interval: 2950, inputs: [{ id: "water_rune", qty: 4 }, { id: "chaos_rune", qty: 4 }, { id: "death_rune", qty: 2 }], displayIcon: "Ice_Burst.png" },
        { id: "magic_smoke_blitz", name: "[Ancient] Smoke Blitz", level: 74, xp: 42, interval: 3000, inputs: [{ id: "air_rune", qty: 2 }, { id: "fire_rune", qty: 2 }, { id: "blood_rune", qty: 2 }, { id: "death_rune", qty: 2 }], displayIcon: "Smoke_Blitz.png" },
        { id: "magic_shadow_blitz", name: "[Ancient] Shadow Blitz", level: 76, xp: 43, interval: 3050, inputs: [{ id: "air_rune", qty: 2 }, { id: "soul_rune", qty: 2 }, { id: "blood_rune", qty: 2 }, { id: "death_rune", qty: 2 }], displayIcon: "Shadow_Blitz.png" },
        { id: "magic_blood_blitz", name: "[Ancient] Blood Blitz", level: 80, xp: 45, interval: 3100, inputs: [{ id: "blood_rune", qty: 4 }, { id: "death_rune", qty: 2 }], displayIcon: "Blood_Blitz.png" },
        { id: "magic_ice_blitz", name: "[Ancient] Ice Blitz", level: 82, xp: 46, interval: 3150, inputs: [{ id: "water_rune", qty: 3 }, { id: "blood_rune", qty: 2 }, { id: "death_rune", qty: 2 }], displayIcon: "Ice_Blitz.png" },
        { id: "magic_smoke_barrage", name: "[Ancient] Smoke Barrage", level: 86, xp: 48, interval: 3200, inputs: [{ id: "air_rune", qty: 4 }, { id: "fire_rune", qty: 4 }, { id: "blood_rune", qty: 2 }, { id: "death_rune", qty: 4 }], displayIcon: "Smoke_Barrage.png" },
        { id: "magic_shadow_barrage", name: "[Ancient] Shadow Barrage", level: 88, xp: 49, interval: 3250, inputs: [{ id: "air_rune", qty: 4 }, { id: "soul_rune", qty: 3 }, { id: "blood_rune", qty: 2 }, { id: "death_rune", qty: 4 }], displayIcon: "Shadow_Barrage.png" },
        { id: "magic_blood_barrage", name: "[Ancient] Blood Barrage", level: 92, xp: 51, interval: 3300, inputs: [{ id: "blood_rune", qty: 4 }, { id: "death_rune", qty: 4 }, { id: "soul_rune", qty: 1 }], displayIcon: "Blood_Barrage.png" },
        { id: "magic_ice_barrage", name: "[Ancient] Ice Barrage", level: 94, xp: 52, interval: 3350, inputs: [{ id: "water_rune", qty: 6 }, { id: "blood_rune", qty: 2 }, { id: "death_rune", qty: 4 }], displayIcon: "Ice_Barrage.png" },

        { id: "magic_ghostly_grasp", name: "[Arceuus] Ghostly Grasp", level: 35, xp: 19, interval: 2300, inputs: [{ id: "air_rune", qty: 1 }, { id: "chaos_rune", qty: 1 }], displayIcon: "Ghostly_Grasp.png" },
        { id: "magic_skeletal_grasp", name: "[Arceuus] Skeletal Grasp", level: 56, xp: 35, interval: 2700, inputs: [{ id: "earth_rune", qty: 1 }, { id: "nature_rune", qty: 1 }, { id: "chaos_rune", qty: 1 }], displayIcon: "Skeletal_Grasp.png" },
        { id: "magic_undead_grasp", name: "[Arceuus] Undead Grasp", level: 79, xp: 46.5, interval: 3100, inputs: [{ id: "fire_rune", qty: 1 }, { id: "nature_rune", qty: 1 }, { id: "chaos_rune", qty: 1 }], displayIcon: "Undead_Grasp.png" },
        { id: "magic_inferior_demonbane", name: "[Arceuus] Inferior Demonbane", level: 44, xp: 24, interval: 2500, inputs: [{ id: "fire_rune", qty: 1 }, { id: "chaos_rune", qty: 1 }], displayIcon: "Inferior_Demonbane.png" },
        { id: "magic_superior_demonbane", name: "[Arceuus] Superior Demonbane", level: 62, xp: 36, interval: 2900, inputs: [{ id: "fire_rune", qty: 1 }, { id: "soul_rune", qty: 1 }, { id: "chaos_rune", qty: 1 }], displayIcon: "Superior_Demonbane.png" },
        { id: "magic_dark_demonbane", name: "[Arceuus] Dark Demonbane", level: 82, xp: 48, interval: 3300, inputs: [{ id: "fire_rune", qty: 2 }, { id: "soul_rune", qty: 2 }, { id: "chaos_rune", qty: 2 }], displayIcon: "Dark_Demonbane.png" }
      ]
    },

    Runecraft: {
      description: "Craft runes from rune essence.",
      actions: [
        { id: "rc_air", name: "Craft Air Runes", level: 1, xp: 5, interval: 500, inputs: [{ id: "rune_essence", qty: 1 }], outputs: [{ id: "air_rune", name: "Air rune", qty: 5, icon: "Air_rune.png", stackable: true }] },
        { id: "rc_mind", name: "Craft Mind Runes", level: 2, xp: 5.5, interval: 500, inputs: [{ id: "rune_essence", qty: 1 }], outputs: [{ id: "mind_rune", name: "Mind rune", qty: 4, icon: "Mind_rune.png", stackable: true }] },
        { id: "rc_water", name: "Craft Water Runes", level: 5, xp: 6, interval: 500, inputs: [{ id: "rune_essence", qty: 1 }], outputs: [{ id: "water_rune", name: "Water rune", qty: 4, icon: "Water_rune.png", stackable: true }] },
        { id: "rc_earth", name: "Craft Earth Runes", level: 9, xp: 6.5, interval: 500, inputs: [{ id: "rune_essence", qty: 1 }], outputs: [{ id: "earth_rune", name: "Earth rune", qty: 4, icon: "Earth_rune.png", stackable: true }] },
        { id: "rc_fire", name: "Craft Fire Runes", level: 14, xp: 7, interval: 500, inputs: [{ id: "rune_essence", qty: 1 }], outputs: [{ id: "fire_rune", name: "Fire rune", qty: 4, icon: "Fire_rune.png", stackable: true }] },
        { id: "rc_body", name: "Craft Body Runes", level: 20, xp: 7.5, interval: 500, inputs: [{ id: "rune_essence", qty: 1 }], outputs: [{ id: "body_rune", name: "Body rune", qty: 4, icon: "Body_rune.png", stackable: true }] },
        { id: "rc_cosmic", name: "Craft Cosmic Runes", level: 27, xp: 8.5, interval: 500, inputs: [{ id: "rune_essence", qty: 1 }], outputs: [{ id: "cosmic_rune", name: "Cosmic rune", qty: 4, icon: "Cosmic_rune.png", stackable: true }] },
        { id: "rc_chaos", name: "Craft Chaos Runes", level: 35, xp: 9.5, interval: 500, inputs: [{ id: "rune_essence", qty: 1 }], outputs: [{ id: "chaos_rune", name: "Chaos rune", qty: 4, icon: "Chaos_rune.png", stackable: true }] },
        { id: "rc_nature", name: "Craft Nature Runes", level: 44, xp: 10.5, interval: 500, inputs: [{ id: "rune_essence", qty: 1 }], outputs: [{ id: "nature_rune", name: "Nature rune", qty: 4, icon: "Nature_rune.png", stackable: true }] },
        { id: "rc_law", name: "Craft Law Runes", level: 54, xp: 11.5, interval: 500, inputs: [{ id: "rune_essence", qty: 1 }], outputs: [{ id: "law_rune", name: "Law rune", qty: 4, icon: "Law_rune.png", stackable: true }] },
        { id: "rc_death", name: "Craft Death Runes", level: 65, xp: 13, interval: 500, inputs: [{ id: "rune_essence", qty: 1 }], outputs: [{ id: "death_rune", name: "Death rune", qty: 4, icon: "Death_rune.png", stackable: true }] },
        { id: "rc_blood", name: "Craft Blood Runes", level: 77, xp: 14.5, interval: 500, inputs: [{ id: "rune_essence", qty: 1 }], outputs: [{ id: "blood_rune", name: "Blood rune", qty: 4, icon: "Blood_rune.png", stackable: true }] },
        { id: "rc_soul", name: "Craft Soul Runes", level: 90, xp: 11, interval: 500, inputs: [{ id: "rune_essence", qty: 1 }], outputs: [{ id: "soul_rune", name: "Soul rune", qty: 4, icon: "Soul_rune.png", stackable: true }] },
        { id: "rc_wrath", name: "Craft Wrath Runes", level: 95, xp: 12, interval: 500, inputs: [{ id: "rune_essence", qty: 1 }], outputs: [{ id: "wrath_rune", name: "Wrath rune", qty: 50, icon: "Wrath_rune.png", stackable: true }] }
      ]
    },

    Construction: {
      description: "Turn logs into planks and build basic furniture.",
      actions: [
        { id: "con_planks", name: "Saw Planks", level: 1, xp: 8, interval: 2500, inputs: [{ id: "normal_log", qty: 2 }], outputs: [{ id: "plank", name: "Plank", qty: 1, icon: "Plank.png", stackable: true }] },
        { id: "con_oak_planks", name: "Saw Oak Planks", level: 15, xp: 15, interval: 2500, inputs: [{ id: "oak_log", qty: 2 }], outputs: [{ id: "oak_plank", name: "Oak Plank", qty: 1, icon: "Oak_plank.png", stackable: true }] },
        { id: "con_teak_planks", name: "Saw Teak Planks", level: 35, xp: 27, interval: 2500, inputs: [{ id: "teak_log", qty: 2 }], outputs: [{ id: "teak_plank", name: "Teak Plank", qty: 1, icon: "Teak_plank.png", stackable: true }] },
        { id: "con_mahogany_planks", name: "Saw Mahogany Planks", level: 50, xp: 41, interval: 2500, inputs: [{ id: "mahogany_log", qty: 2 }], outputs: [{ id: "mahogany_plank", name: "Mahogany Plank", qty: 1, icon: "Mahogany_plank.png", stackable: true }] },
        { id: "con_chair", name: "Build Chair", level: 8, xp: 15, interval: 2800, inputs: [{ id: "plank", qty: 2 }], outputs: [{ id: "sawdust", name: "Sawdust", qty: 1, icon: "Logs.png", stackable: true }] },
        { id: "con_oak_chair", name: "Build Oak Chair", level: 19, xp: 60, interval: 2800, inputs: [{ id: "oak_plank", qty: 2 }], outputs: [{ id: "sawdust", name: "Sawdust", qty: 1, icon: "Logs.png", stackable: true }] },
        { id: "con_teak_chair", name: "Build Teak Chair", level: 35, xp: 90, interval: 2800, inputs: [{ id: "teak_plank", qty: 2 }], outputs: [{ id: "sawdust", name: "Sawdust", qty: 1, icon: "Logs.png", stackable: true }] },
        { id: "con_mahogany_chair", name: "Build Mahogany Chair", level: 50, xp: 120, interval: 2800, inputs: [{ id: "mahogany_plank", qty: 2 }], outputs: [{ id: "sawdust", name: "Sawdust", qty: 1, icon: "Logs.png", stackable: true }] },
        { id: "con_bookcase", name: "Build Oak Bookcase", level: 29, xp: 180, interval: 3000, inputs: [{ id: "oak_plank", qty: 3 }], outputs: [{ id: "sawdust", name: "Sawdust", qty: 1, icon: "Logs.png", stackable: true }] },
        { id: "con_dining_table", name: "Build Oak Dining Table", level: 22, xp: 240, interval: 3200, inputs: [{ id: "oak_plank", qty: 4 }], outputs: [{ id: "sawdust", name: "Sawdust", qty: 1, icon: "Logs.png", stackable: true }] },
        { id: "con_mahogany_table", name: "Build Mahogany Table", level: 52, xp: 840, interval: 3500, inputs: [{ id: "mahogany_plank", qty: 6 }], outputs: [{ id: "sawdust", name: "Sawdust", qty: 1, icon: "Logs.png", stackable: true }] },
        { id: "con_crystal_ball", name: "Build Crystal Ball", level: 42, xp: 280, interval: 2800, inputs: [{ id: "teak_plank", qty: 3 }, { id: "uncut_diamond", qty: 1 }], outputs: [{ id: "sawdust", name: "Sawdust", qty: 1, icon: "Logs.png", stackable: true }] },
        { id: "con_elemental_sphere", name: "Build Elemental Sphere", level: 54, xp: 580, interval: 3000, inputs: [{ id: "mahogany_plank", qty: 3 }, { id: "uncut_ruby", qty: 1 }], outputs: [{ id: "sawdust", name: "Sawdust", qty: 1, icon: "Logs.png", stackable: true }] },
        { id: "con_crystal_of_power", name: "Build Crystal of Power", level: 66, xp: 890, interval: 3200, inputs: [{ id: "mahogany_plank", qty: 2 }, { id: "uncut_diamond", qty: 1 }], outputs: [{ id: "sawdust", name: "Sawdust", qty: 1, icon: "Logs.png", stackable: true }] }
      ]
    },

    Agility: {
      description: "Run rooftop laps for Agility XP.",
      actions: [
        { id: "agi_gnome", name: "Gnome Course", level: 1, xp: 86.5, interval: 4000, outputs: [{ id: "mark_of_grace", name: "Mark of grace", qty: 1, icon: "Mark_of_grace.png", stackable: true, chance: 0.08 }] },
        { id: "agi_draynor", name: "Draynor Course", level: 10, xp: 120, interval: 4200, outputs: [{ id: "mark_of_grace", name: "Mark of grace", qty: 1, icon: "Mark_of_grace.png", stackable: true, chance: 0.12 }] },
        { id: "agi_al_kharid", name: "Al Kharid Course", level: 20, xp: 180, interval: 4400, outputs: [{ id: "mark_of_grace", name: "Mark of grace", qty: 1, icon: "Mark_of_grace.png", stackable: true, chance: 0.15 }] },
        { id: "agi_varrock", name: "Varrock Course", level: 30, xp: 238, interval: 4600, outputs: [{ id: "mark_of_grace", name: "Mark of grace", qty: 1, icon: "Mark_of_grace.png", stackable: true, chance: 0.18 }] },
        { id: "agi_canifis", name: "Canifis Course", level: 40, xp: 240, interval: 4800, outputs: [{ id: "mark_of_grace", name: "Mark of grace", qty: 1, icon: "Mark_of_grace.png", stackable: true, chance: 0.20 }] },
        { id: "agi_falador", name: "Falador Course", level: 50, xp: 440, interval: 5000, outputs: [{ id: "mark_of_grace", name: "Mark of grace", qty: 1, icon: "Mark_of_grace.png", stackable: true, chance: 0.22 }] },
        { id: "agi_seers", name: "Seers' Village Course", level: 60, xp: 570, interval: 5200, outputs: [{ id: "mark_of_grace", name: "Mark of grace", qty: 1, icon: "Mark_of_grace.png", stackable: true, chance: 0.25 }] },
        { id: "agi_pollivneach", name: "Pollnivneach Course", level: 70, xp: 890, interval: 5400, outputs: [{ id: "mark_of_grace", name: "Mark of grace", qty: 1, icon: "Mark_of_grace.png", stackable: true, chance: 0.28 }] },
        { id: "agi_relekka", name: "Rellekka Course", level: 80, xp: 780, interval: 5600, outputs: [{ id: "mark_of_grace", name: "Mark of grace", qty: 1, icon: "Mark_of_grace.png", stackable: true, chance: 0.30 }] },
        { id: "agi_ardougne", name: "Ardougne Course", level: 90, xp: 793, interval: 5800, outputs: [{ id: "mark_of_grace", name: "Mark of grace", qty: 1, icon: "Mark_of_grace.png", stackable: true, chance: 0.32 }] }
      ]
    },

    Herblore: {
      description: "Clean herbs and brew potions.",
      actions: [
        // Herb Cleaning
        { id: "herb_clean_guam", name: "Clean Guam", level: 3, xp: 2.5, interval: 1400, inputs: [{ id: "grimy_guam", qty: 1 }], outputs: [{ id: "guam_leaf", name: "Guam leaf", qty: 1, icon: "Guam_leaf.png", stackable: true }] },
        { id: "herb_clean_marrentill", name: "Clean Marrentill", level: 5, xp: 3.8, interval: 1500, inputs: [{ id: "grimy_marrentill", qty: 1 }], outputs: [{ id: "marrentill", name: "Marrentill", qty: 1, icon: "Marrentill.png", stackable: true }] },
        { id: "herb_clean_tarromin", name: "Clean Tarromin", level: 11, xp: 5, interval: 1600, inputs: [{ id: "grimy_tarromin", qty: 1 }], outputs: [{ id: "tarromin", name: "Tarromin", qty: 1, icon: "Tarromin.png", stackable: true }] },
        { id: "herb_clean_harralander", name: "Clean Harralander", level: 20, xp: 6.3, interval: 1700, inputs: [{ id: "grimy_harralander", qty: 1 }], outputs: [{ id: "harralander", name: "Harralander", qty: 1, icon: "Harralander.png", stackable: true }] },
        { id: "herb_clean_ranarr", name: "Clean Ranarr", level: 25, xp: 7.5, interval: 1800, inputs: [{ id: "grimy_ranarr", qty: 1 }], outputs: [{ id: "ranarr_weed", name: "Ranarr weed", qty: 1, icon: "Ranarr_weed.png", stackable: true }] },
        { id: "herb_clean_toadflax", name: "Clean Toadflax", level: 30, xp: 8, interval: 1900, inputs: [{ id: "grimy_toadflax", qty: 1 }], outputs: [{ id: "toadflax", name: "Toadflax", qty: 1, icon: "Toadflax.png", stackable: true }] },
        { id: "herb_clean_irit", name: "Clean Irit", level: 40, xp: 8.8, interval: 2000, inputs: [{ id: "grimy_irit", qty: 1 }], outputs: [{ id: "irit_leaf", name: "Irit leaf", qty: 1, icon: "Irit_leaf.png", stackable: true }] },
        { id: "herb_clean_avantoe", name: "Clean Avantoe", level: 48, xp: 10, interval: 2100, inputs: [{ id: "grimy_avantoe", qty: 1 }], outputs: [{ id: "avantoe", name: "Avantoe", qty: 1, icon: "Avantoe.png", stackable: true }] },
        { id: "herb_clean_kwuarm", name: "Clean Kwuarm", level: 54, xp: 11.3, interval: 2200, inputs: [{ id: "grimy_kwuarm", qty: 1 }], outputs: [{ id: "kwuarm", name: "Kwuarm", qty: 1, icon: "Kwuarm.png", stackable: true }] },
        { id: "herb_clean_snapdragon", name: "Clean Snapdragon", level: 59, xp: 11.8, interval: 2300, inputs: [{ id: "grimy_snapdragon", qty: 1 }], outputs: [{ id: "snapdragon", name: "Snapdragon", qty: 1, icon: "Snapdragon.png", stackable: true }] },
        { id: "herb_clean_cadantine", name: "Clean Cadantine", level: 65, xp: 12.5, interval: 2400, inputs: [{ id: "grimy_cadantine", qty: 1 }], outputs: [{ id: "cadantine", name: "Cadantine", qty: 1, icon: "Cadantine.png", stackable: true }] },
        { id: "herb_clean_lantadyme", name: "Clean Lantadyme", level: 67, xp: 13.1, interval: 2500, inputs: [{ id: "grimy_lantadyme", qty: 1 }], outputs: [{ id: "lantadyme", name: "Lantadyme", qty: 1, icon: "Lantadyme.png", stackable: true }] },
        { id: "herb_clean_dwarf_weed", name: "Clean Dwarf Weed", level: 70, xp: 13.8, interval: 2600, inputs: [{ id: "grimy_dwarf_weed", qty: 1 }], outputs: [{ id: "dwarf_weed", name: "Dwarf weed", qty: 1, icon: "Dwarf_weed.png", stackable: true }] },
        { id: "herb_clean_torstol", name: "Clean Torstol", level: 75, xp: 15, interval: 2700, inputs: [{ id: "grimy_torstol", qty: 1 }], outputs: [{ id: "torstol", name: "Torstol", qty: 1, icon: "Torstol.png", stackable: true }] },

        // Potion Brewing
        { id: "herb_attack", name: "Brew Attack Potion", level: 3, xp: 25, interval: 2800, inputs: [{ id: "guam_leaf", qty: 1 }, { id: "vial_of_water", qty: 1 }], outputs: [{ id: "attack_potion_3", name: "Attack potion(3)", qty: 1, icon: "Attack_potion(3).png", stackable: false }] },
        { id: "herb_antipoison", name: "Brew Antipoison", level: 5, xp: 37.5, interval: 2900, inputs: [{ id: "marrentill", qty: 1 }, { id: "vial_of_water", qty: 1 }], outputs: [{ id: "antipoison_3", name: "Antipoison(3)", qty: 1, icon: "Antipoison(3).png", stackable: false }] },
        { id: "herb_strength", name: "Brew Strength Potion", level: 12, xp: 50, interval: 3000, inputs: [{ id: "tarromin", qty: 1 }, { id: "vial_of_water", qty: 1 }], outputs: [{ id: "strength_potion_3", name: "Strength potion(3)", qty: 1, icon: "Strength_potion(3).png", stackable: false }] },
        { id: "herb_restore", name: "Brew Restore Potion", level: 22, xp: 62.5, interval: 3100, inputs: [{ id: "harralander", qty: 1 }, { id: "vial_of_water", qty: 1 }], outputs: [{ id: "restore_potion_3", name: "Restore potion(3)", qty: 1, icon: "Restore_potion(3).png", stackable: false }] },
        { id: "herb_defence", name: "Brew Defence Potion", level: 30, xp: 75, interval: 3200, inputs: [{ id: "ranarr_weed", qty: 1 }, { id: "vial_of_water", qty: 1 }], outputs: [{ id: "defence_potion_3", name: "Defence potion(3)", qty: 1, icon: "Defence_potion(3).png", stackable: false }] },
        { id: "herb_energy", name: "Brew Energy Potion", level: 26, xp: 67.5, interval: 3300, inputs: [{ id: "harralander", qty: 1 }, { id: "chocolate_dust", qty: 1 }, { id: "vial_of_water", qty: 1 }], outputs: [{ id: "energy_potion_3", name: "Energy potion(3)", qty: 1, icon: "Energy_potion(3).png", stackable: false }] },
        { id: "herb_agility", name: "Brew Agility Potion", level: 34, xp: 80, interval: 3400, inputs: [{ id: "toadflax", qty: 1 }, { id: "vial_of_water", qty: 1 }], outputs: [{ id: "agility_potion_3", name: "Agility potion(3)", qty: 1, icon: "Agility_potion(3).png", stackable: false }] },
        { id: "herb_combat", name: "Brew Combat Potion", level: 36, xp: 84, interval: 3500, inputs: [{ id: "harralander", qty: 1 }, { id: "goat_horn_dust", qty: 1 }, { id: "vial_of_water", qty: 1 }], outputs: [{ id: "combat_potion_3", name: "Combat potion(3)", qty: 1, icon: "Combat_potion(3).png", stackable: false }] },
        { id: "herb_prayer", name: "Brew Prayer Potion", level: 38, xp: 87.5, interval: 3600, inputs: [{ id: "ranarr_weed", qty: 1 }, { id: "snape_grass", qty: 1 }, { id: "vial_of_water", qty: 1 }], outputs: [{ id: "prayer_potion_3", name: "Prayer potion(3)", qty: 1, icon: "Prayer_potion(3).png", stackable: false }] },
        { id: "herb_super_attack", name: "Brew Super Attack", level: 45, xp: 100, interval: 3700, inputs: [{ id: "irit_leaf", qty: 1 }, { id: "eye_of_newt", qty: 1 }, { id: "vial_of_water", qty: 1 }], outputs: [{ id: "super_attack_3", name: "Super attack(3)", qty: 1, icon: "Super_attack(3).png", stackable: false }] },
        { id: "herb_super_antipoison", name: "Brew Super Antipoison", level: 48, xp: 106.3, interval: 3800, inputs: [{ id: "irit_leaf", qty: 1 }, { id: "unicorn_horn_dust", qty: 1 }, { id: "vial_of_water", qty: 1 }], outputs: [{ id: "super_antipoison_3", name: "Super antipoison(3)", qty: 1, icon: "Super_antipoison(3).png", stackable: false }] },
        { id: "herb_fishing", name: "Brew Fishing Potion", level: 50, xp: 112.5, interval: 3900, inputs: [{ id: "avantoe", qty: 1 }, { id: "snape_grass", qty: 1 }, { id: "vial_of_water", qty: 1 }], outputs: [{ id: "fishing_potion_3", name: "Fishing potion(3)", qty: 1, icon: "Fishing_potion(3).png", stackable: false }] },
        { id: "herb_super_energy", name: "Brew Super Energy", level: 52, xp: 117.5, interval: 4000, inputs: [{ id: "avantoe", qty: 1 }, { id: "mort_myre_fungus", qty: 1 }, { id: "vial_of_water", qty: 1 }], outputs: [{ id: "super_energy_3", name: "Super energy(3)", qty: 1, icon: "Super_energy(3).png", stackable: false }] },
        { id: "herb_super_strength", name: "Brew Super Strength", level: 55, xp: 125, interval: 4100, inputs: [{ id: "kwuarm", qty: 1 }, { id: "limpwurt_root", qty: 1 }, { id: "vial_of_water", qty: 1 }], outputs: [{ id: "super_strength_3", name: "Super strength(3)", qty: 1, icon: "Super_strength(3).png", stackable: false }] },
        { id: "herb_weapon_poison", name: "Brew Weapon Poison", level: 60, xp: 137.5, interval: 4200, inputs: [{ id: "kwuarm", qty: 1 }, { id: "dragon_scale_dust", qty: 1 }, { id: "vial_of_water", qty: 1 }], outputs: [{ id: "weapon_poison", name: "Weapon poison", qty: 1, icon: "Weapon_poison.png", stackable: false }] },
        { id: "herb_super_restore", name: "Brew Super Restore", level: 63, xp: 142.5, interval: 4300, inputs: [{ id: "snapdragon", qty: 1 }, { id: "red_spiders_eggs", qty: 1 }, { id: "vial_of_water", qty: 1 }], outputs: [{ id: "super_restore_3", name: "Super restore(3)", qty: 1, icon: "Super_restore(3).png", stackable: false }] },
        { id: "herb_super_defence", name: "Brew Super Defence", level: 66, xp: 150, interval: 4400, inputs: [{ id: "cadantine", qty: 1 }, { id: "white_berries", qty: 1 }, { id: "vial_of_water", qty: 1 }], outputs: [{ id: "super_defence_3", name: "Super defence(3)", qty: 1, icon: "Super_defence(3).png", stackable: false }] },
        { id: "herb_antidote_plus", name: "Brew Antidote++", level: 68, xp: 155, interval: 4500, inputs: [{ id: "toadflax", qty: 1 }, { id: "yew_roots", qty: 1 }, { id: "vial_of_water", qty: 1 }], outputs: [{ id: "antidote++_3", name: "Antidote++(3)", qty: 1, icon: "Antidote++(3).png", stackable: false }] },
        { id: "herb_antifire", name: "Brew Antifire Potion", level: 69, xp: 157.5, interval: 4600, inputs: [{ id: "lantadyme", qty: 1 }, { id: "dragon_scale_dust", qty: 1 }, { id: "vial_of_water", qty: 1 }], outputs: [{ id: "antifire_potion_3", name: "Antifire potion(3)", qty: 1, icon: "Antifire_potion(3).png", stackable: false }] },
        { id: "herb_divine_super_attack", name: "Brew Divine Super Attack", level: 70, xp: 2, interval: 4700, inputs: [{ id: "avantoe", qty: 1 }, { id: "eye_of_newt", qty: 1 }, { id: "crushed_superior_dragon_bones", qty: 1 }, { id: "vial_of_water", qty: 1 }], outputs: [{ id: "divine_super_attack_potion_4", name: "Divine super attack potion(4)", qty: 1, icon: "Divine_super_attack_potion(4).png", stackable: false }] },
        { id: "herb_divine_super_defence", name: "Brew Divine Super Defence", level: 70, xp: 2, interval: 4800, inputs: [{ id: "lantadyme", qty: 1 }, { id: "white_berries", qty: 1 }, { id: "crushed_superior_dragon_bones", qty: 1 }, { id: "vial_of_water", qty: 1 }], outputs: [{ id: "divine_super_defence_potion_4", name: "Divine super defence potion(4)", qty: 1, icon: "Divine_super_defence_potion(4).png", stackable: false }] },
        { id: "herb_divine_super_strength", name: "Brew Divine Super Strength", level: 70, xp: 2, interval: 4900, inputs: [{ id: "kwuarm", qty: 1 }, { id: "limpwurt_root", qty: 1 }, { id: "crushed_superior_dragon_bones", qty: 1 }, { id: "vial_of_water", qty: 1 }], outputs: [{ id: "divine_super_strength_potion_4", name: "Divine super strength potion(4)", qty: 1, icon: "Divine_super_strength_potion(4).png", stackable: false }] },
        { id: "herb_ranging", name: "Brew Ranging Potion", level: 72, xp: 162.5, interval: 5000, inputs: [{ id: "dwarf_weed", qty: 1 }, { id: "wine_of_zamorak", qty: 1 }, { id: "vial_of_water", qty: 1 }], outputs: [{ id: "ranging_potion_3", name: "Ranging potion(3)", qty: 1, icon: "Ranging_potion(3).png", stackable: false }] },
        { id: "herb_magic", name: "Brew Magic Potion", level: 76, xp: 172.5, interval: 5100, inputs: [{ id: "lantadyme", qty: 1 }, { id: "potato_cactus", qty: 1 }, { id: "vial_of_water", qty: 1 }], outputs: [{ id: "magic_potion_3", name: "Magic potion(3)", qty: 1, icon: "Magic_potion(3).png", stackable: false }] },
        { id: "herb_stamina", name: "Brew Stamina Potion", level: 77, xp: 76.5, interval: 5200, inputs: [{ id: "avantoe", qty: 1 }, { id: "super_energy_3", qty: 1 }, { id: "amylase_crystal", qty: 1 }], outputs: [{ id: "stamina_potion_3", name: "Stamina potion(3)", qty: 1, icon: "Stamina_potion(3).png", stackable: false }] },
        { id: "herb_saradomin_brew", name: "Brew Saradomin Brew", level: 81, xp: 180, interval: 5300, inputs: [{ id: "toadflax", qty: 1 }, { id: "crushed_nest", qty: 1 }, { id: "vial_of_water", qty: 1 }], outputs: [{ id: "saradomin_brew_3", name: "Saradomin brew(3)", qty: 1, icon: "Saradomin_brew(3).png", stackable: false }] },
        { id: "herb_weapon_poison_plus", name: "Brew Weapon Poison(+)", level: 73, xp: 165, interval: 5400, inputs: [{ id: "cactus_spine", qty: 1 }, { id: "red_spiders_eggs", qty: 1 }, { id: "kwuarm", qty: 1 }, { id: "vial_of_water", qty: 1 }], outputs: [{ id: "weapon_poison+", name: "Weapon poison(+)", qty: 1, icon: "Weapon_poison(+).png", stackable: false }] },
        { id: "herb_super_combat", name: "Brew Super Combat", level: 90, xp: 150, interval: 5500, inputs: [{ id: "torstol", qty: 1 }, { id: "super_attack_3", qty: 1 }, { id: "super_strength_3", qty: 1 }, { id: "super_defence_3", qty: 1 }], outputs: [{ id: "super_combat_potion_3", name: "Super combat potion(3)", qty: 1, icon: "Super_combat_potion(3).png", stackable: false }] },
        { id: "herb_zamorak_brew", name: "Brew Zamorak Brew", level: 78, xp: 175, interval: 5600, inputs: [{ id: "torstol", qty: 1 }, { id: "jangerberries", qty: 1 }, { id: "vial_of_water", qty: 1 }], outputs: [{ id: "zamorak_brew_3", name: "Zamorak brew(3)", qty: 1, icon: "Zamorak_brew(3).png", stackable: false }] }
      ]
    },

    Thieving: {
      description: "Pickpocket NPCs and steal from stalls for coins and supplies.",
      actions: [
        // Pickpocketing NPCs
        {
          id: "thief_man",
          name: "Pickpocket Man",
          level: 1,
          xp: 8,
          interval: 2200,
          success: { base: 0.62, max: 0.97, levelSpan: 55 },
          outputs: [
            { id: "coins", name: "Coins", qty: 45, icon: "Coins_10000.png", stackable: true },
            { id: "potato_seed", name: "Potato seed", qty: 1, icon: "Potato_seed_5.png", stackable: true, chance: 0.07 }
          ]
        },
        {
          id: "thief_farmer",
          name: "Pickpocket Farmer",
          level: 10,
          xp: 35,
          interval: 2500,
          success: { base: 0.54, max: 0.95, levelSpan: 60 },
          outputs: [
            { id: "coins", name: "Coins", qty: 80, icon: "Coins_10000.png", stackable: true },
            { id: "onion_seed", name: "Onion seed", qty: 1, icon: "Onion_seed_5.png", stackable: true, chance: 0.1 },
            { id: "rune_essence", name: "Rune essence", qty: 1, icon: "Rune_essence.png", stackable: true, chance: 0.08 }
          ]
        },
        {
          id: "thief_female_ham",
          name: "Pickpocket Female H.A.M.",
          level: 15,
          xp: 18.5,
          interval: 2600,
          success: { base: 0.52, max: 0.94, levelSpan: 62 },
          outputs: [
            { id: "coins", name: "Coins", qty: 90, icon: "Coins_10000.png", stackable: true },
            { id: "iron_ore", name: "Iron ore", qty: 1, icon: "Iron_ore.png", stackable: true, chance: 0.15 },
            { id: "coal", name: "Coal", qty: 1, icon: "Coal.png", stackable: true, chance: 0.12 }
          ]
        },
        {
          id: "thief_male_ham",
          name: "Pickpocket Male H.A.M.",
          level: 20,
          xp: 22.5,
          interval: 2700,
          success: { base: 0.50, max: 0.93, levelSpan: 63 },
          outputs: [
            { id: "coins", name: "Coins", qty: 110, icon: "Coins_10000.png", stackable: true },
            { id: "steel_bar", name: "Steel bar", qty: 1, icon: "Steel_bar.png", stackable: true, chance: 0.08 },
            { id: "tin_ore", name: "Tin ore", qty: 1, icon: "Tin_ore.png", stackable: true, chance: 0.1 }
          ]
        },
        {
          id: "thief_warrior",
          name: "Pickpocket Warrior",
          level: 25,
          xp: 26,
          interval: 2800,
          success: { base: 0.48, max: 0.92, levelSpan: 64 },
          outputs: [
            { id: "coins", name: "Coins", qty: 130, icon: "Coins_10000.png", stackable: true },
            { id: "iron_sword", name: "Iron sword", qty: 1, icon: "Iron_sword.png", stackable: false, chance: 0.05 }
          ]
        },
        {
          id: "thief_rogue",
          name: "Pickpocket Rogue",
          level: 32,
          xp: 35.5,
          interval: 2900,
          success: { base: 0.46, max: 0.91, levelSpan: 65 },
          outputs: [
            { id: "coins", name: "Coins", qty: 180, icon: "Coins_10000.png", stackable: true },
            { id: "air_rune", name: "Air rune", qty: 8, icon: "Air_rune.png", stackable: true, chance: 0.12 },
            { id: "lockpick", name: "Lockpick", qty: 1, icon: "Lockpick.png", stackable: true, chance: 0.08 }
          ]
        },
        {
          id: "thief_master_farmer",
          name: "Pickpocket Master Farmer",
          level: 38,
          xp: 43,
          interval: 3000,
          success: { base: 0.44, max: 0.92, levelSpan: 65 },
          outputs: [
            { id: "coins", name: "Coins", qty: 160, icon: "Coins_10000.png", stackable: true },
            { id: "ranarr_seed", name: "Ranarr seed", qty: 2, icon: "Ranarr_seed_5.png", stackable: true, chance: 0.2 },
            { id: "snapdragon_seed", name: "Snapdragon seed", qty: 3, icon: "Snapdragon_seed_5.png", stackable: true, chance: 0.1 },
            { id: "vial_of_water", name: "Vial of water", qty: 1, icon: "Vial_of_water.png", stackable: true, chance: 0.2 }
          ]
        },
        {
          id: "thief_guard",
          name: "Pickpocket Guard",
          level: 40,
          xp: 46.5,
          interval: 3100,
          success: { base: 0.42, max: 0.90, levelSpan: 66 },
          outputs: [
            { id: "coins", name: "Coins", qty: 200, icon: "Coins_10000.png", stackable: true },
            { id: "steel_bar", name: "Steel bar", qty: 1, icon: "Steel_bar.png", stackable: true, chance: 0.1 },
            { id: "iron_ore", name: "Iron ore", qty: 2, icon: "Iron_ore.png", stackable: true, chance: 0.15 }
          ]
        },
        {
          id: "thief_fremennik_citizen",
          name: "Pickpocket Fremennik Citizen",
          level: 45,
          xp: 65,
          interval: 3200,
          success: { base: 0.40, max: 0.89, levelSpan: 67 },
          outputs: [
            { id: "coins", name: "Coins", qty: 250, icon: "Coins_10000.png", stackable: true },
            { id: "beer", name: "Beer", qty: 1, icon: "Beer.png", stackable: true, chance: 0.2 },
            { id: "kebab", name: "Kebab", qty: 1, icon: "Kebab.png", stackable: true, chance: 0.15 }
          ]
        },
        {
          id: "thief_bearded_bandit",
          name: "Pickpocket Bearded Bandit",
          level: 45,
          xp: 65,
          interval: 3200,
          success: { base: 0.40, max: 0.89, levelSpan: 67 },
          outputs: [
            { id: "coins", name: "Coins", qty: 250, icon: "Coins_10000.png", stackable: true },
            { id: "antipoison_3", name: "Antipoison(3)", qty: 1, icon: "Antipoison(3).png", stackable: false, chance: 0.1 },
            { id: "lockpick", name: "Lockpick", qty: 1, icon: "Lockpick.png", stackable: true, chance: 0.12 }
          ]
        },
        {
          id: "thief_desert_bandit",
          name: "Pickpocket Desert Bandit",
          level: 53,
          xp: 79.5,
          interval: 3300,
          success: { base: 0.38, max: 0.88, levelSpan: 68 },
          outputs: [
            { id: "coins", name: "Coins", qty: 300, icon: "Coins_10000.png", stackable: true },
            { id: "antidote++_3", name: "Antidote++(3)", qty: 1, icon: "Antidote++(3).png", stackable: false, chance: 0.08 },
            { id: "cadantine", name: "Cadantine", qty: 1, icon: "Cadantine.png", stackable: true, chance: 0.1 }
          ]
        },
        {
          id: "thief_knight",
          name: "Pickpocket Knight",
          level: 55,
          xp: 84.3,
          interval: 3400,
          success: { base: 0.36, max: 0.87, levelSpan: 69 },
          outputs: [
            { id: "coins", name: "Coins", qty: 350, icon: "Coins_10000.png", stackable: true },
            { id: "blood_rune", name: "Blood rune", qty: 5, icon: "Blood_rune.png", stackable: true, chance: 0.08 },
            { id: "adamant_sword", name: "Adamant sword", qty: 1, icon: "Adamant_sword.png", stackable: false, chance: 0.03 }
          ]
        },
        {
          id: "thief_watchman",
          name: "Pickpocket Watchman",
          level: 65,
          xp: 137.5,
          interval: 3500,
          success: { base: 0.34, max: 0.86, levelSpan: 70 },
          outputs: [
            { id: "coins", name: "Coins", qty: 400, icon: "Coins_10000.png", stackable: true },
            { id: "gold_bar", name: "Gold bar", qty: 1, icon: "Gold_bar.png", stackable: true, chance: 0.1 },
            { id: "wine_of_zamorak", name: "Wine of Zamorak", qty: 1, icon: "Wine_of_Zamorak.png", stackable: true, chance: 0.05 }
          ]
        },
        {
          id: "thief_paladin",
          name: "Pickpocket Paladin",
          level: 70,
          xp: 151.8,
          interval: 3600,
          success: { base: 0.32, max: 0.85, levelSpan: 71 },
          outputs: [
            { id: "coins", name: "Coins", qty: 500, icon: "Coins_10000.png", stackable: true },
            { id: "rune_sword", name: "Rune sword", qty: 1, icon: "Rune_sword.png", stackable: false, chance: 0.02 },
            { id: "nature_rune", name: "Nature rune", qty: 3, icon: "Nature_rune.png", stackable: true, chance: 0.1 }
          ]
        },
        {
          id: "thief_gnome",
          name: "Pickpocket Gnome",
          level: 75,
          xp: 198.3,
          interval: 3700,
          success: { base: 0.30, max: 0.84, levelSpan: 72 },
          outputs: [
            { id: "coins", name: "Coins", qty: 600, icon: "Coins_10000.png", stackable: true },
            { id: "gold_ore", name: "Gold ore", qty: 1, icon: "Gold_ore.png", stackable: true, chance: 0.12 },
            { id: "fire_orb", name: "Fire orb", qty: 1, icon: "Fire_orb.png", stackable: false, chance: 0.08 }
          ]
        },
        {
          id: "thief_hero",
          name: "Pickpocket Hero",
          level: 80,
          xp: 273.3,
          interval: 3800,
          success: { base: 0.28, max: 0.83, levelSpan: 73 },
          outputs: [
            { id: "coins", name: "Coins", qty: 750, icon: "Coins_10000.png", stackable: true },
            { id: "death_rune", name: "Death rune", qty: 2, icon: "Death_rune.png", stackable: true, chance: 0.15 },
            { id: "diamond", name: "Diamond", qty: 1, icon: "Diamond.png", stackable: true, chance: 0.05 }
          ]
        },
        {
          id: "thief_elite_dark_warrior",
          name: "Pickpocket Elite Dark Warrior",
          level: 85,
          xp: 397.5,
          interval: 3900,
          success: { base: 0.26, max: 0.82, levelSpan: 74 },
          outputs: [
            { id: "coins", name: "Coins", qty: 900, icon: "Coins_10000.png", stackable: true },
            { id: "rune_full_helm", name: "Rune full helm", qty: 1, icon: "Rune_full_helm.png", stackable: false, chance: 0.02 },
            { id: "cosmic_rune", name: "Cosmic rune", qty: 4, icon: "Cosmic_rune.png", stackable: true, chance: 0.12 }
          ]
        },
        {
          id: "thief_menaphite_thug",
          name: "Pickpocket Menaphite Thug",
          level: 65,
          xp: 137.5,
          interval: 3500,
          success: { base: 0.34, max: 0.86, levelSpan: 70 },
          outputs: [
            { id: "coins", name: "Coins", qty: 400, icon: "Coins_10000.png", stackable: true },
            { id: "gold_bar", name: "Gold bar", qty: 1, icon: "Gold_bar.png", stackable: true, chance: 0.1 },
            { id: "wine_of_zamorak", name: "Wine of Zamorak", qty: 1, icon: "Wine_of_Zamorak.png", stackable: true, chance: 0.05 }
          ]
        },

        // Stall Stealing
        {
          id: "thief_vegetable_stall",
          name: "Steal from Vegetable Stall",
          level: 2,
          xp: 10,
          interval: 2400,
          success: { base: 0.60, max: 0.95, levelSpan: 50 },
          outputs: [
            { id: "potato", name: "Potato", qty: 1, icon: "Potato.png", stackable: true },
            { id: "onion", name: "Onion", qty: 1, icon: "Onion.png", stackable: true },
            { id: "cabbage", name: "Cabbage", qty: 1, icon: "Cabbage.png", stackable: true },
            { id: "tomato", name: "Tomato", qty: 1, icon: "Tomato.png", stackable: true }
          ]
        },
        {
          id: "thief_bakery_stall",
          name: "Steal from Bakery Stall",
          level: 5,
          xp: 16,
          interval: 2600,
          success: { base: 0.58, max: 0.94, levelSpan: 52 },
          outputs: [
            { id: "bread", name: "Bread", qty: 1, icon: "Bread.png", stackable: true },
            { id: "cake", name: "Cake", qty: 1, icon: "Cake.png", stackable: true },
            { id: "chocolate_slice", name: "Chocolate slice", qty: 1, icon: "Chocolate_slice.png", stackable: true }
          ]
        },
        {
          id: "thief_crafting_stall",
          name: "Steal from Crafting Stall",
          level: 35,
          xp: 16,
          interval: 3000,
          success: { base: 0.46, max: 0.91, levelSpan: 65 },
          outputs: [
            { id: "chisel", name: "Chisel", qty: 1, icon: "Chisel.png", stackable: true },
            { id: "necklace_mould", name: "Necklace mould", qty: 1, icon: "Necklace_mould.png", stackable: true },
            { id: "ring_mould", name: "Ring mould", qty: 1, icon: "Ring_mould.png", stackable: true },
            { id: "amethyst", name: "Amethyst", qty: 1, icon: "Amethyst.png", stackable: true, chance: 0.1 }
          ]
        },
        {
          id: "thief_monkey_food_stall",
          name: "Steal from Monkey Food Stall",
          level: 35,
          xp: 16,
          interval: 3000,
          success: { base: 0.46, max: 0.91, levelSpan: 65 },
          outputs: [
            { id: "banana", name: "Banana", qty: 1, icon: "Banana.png", stackable: true },
            { id: "monkey_nuts", name: "Monkey nuts", qty: 1, icon: "Monkey_nuts.png", stackable: true },
            { id: "monkey_bar", name: "Monkey bar", qty: 1, icon: "Monkey_bar.png", stackable: true }
          ]
        },
        {
          id: "thief_magic_stall",
          name: "Steal from Magic Stall",
          level: 42,
          xp: 16,
          interval: 3100,
          success: { base: 0.44, max: 0.90, levelSpan: 66 },
          outputs: [
            { id: "air_rune", name: "Air rune", qty: 10, icon: "Air_rune.png", stackable: true },
            { id: "earth_rune", name: "Earth rune", qty: 10, icon: "Earth_rune.png", stackable: true },
            { id: "fire_rune", name: "Fire rune", qty: 10, icon: "Fire_rune.png", stackable: true },
            { id: "water_rune", name: "Water rune", qty: 10, icon: "Water_rune.png", stackable: true }
          ]
        },
        {
          id: "thief_scimitar_stall",
          name: "Steal from Scimitar Stall",
          level: 65,
          xp: 16,
          interval: 3500,
          success: { base: 0.34, max: 0.86, levelSpan: 70 },
          outputs: [
            { id: "iron_scimitar", name: "Iron scimitar", qty: 1, icon: "Iron_scimitar.png", stackable: false },
            { id: "steel_scimitar", name: "Steel scimitar", qty: 1, icon: "Steel_scimitar.png", stackable: false },
            { id: "mithril_scimitar", name: "Mithril scimitar", qty: 1, icon: "Mithril_scimitar.png", stackable: false }
          ]
        },
        {
          id: "thief_gem_stall",
          name: "Steal from Gem Stall",
          level: 75,
          xp: 16,
          interval: 3700,
          success: { base: 0.30, max: 0.84, levelSpan: 72 },
          outputs: [
            { id: "sapphire", name: "Sapphire", qty: 1, icon: "Sapphire.png", stackable: true },
            { id: "emerald", name: "Emerald", qty: 1, icon: "Emerald.png", stackable: true },
            { id: "ruby", name: "Ruby", qty: 1, icon: "Ruby.png", stackable: true },
            { id: "diamond", name: "Diamond", qty: 1, icon: "Diamond.png", stackable: true, chance: 0.05 }
          ]
        },
        {
          id: "thief_silk_stall",
          name: "Steal from Silk Stall",
          level: 20,
          xp: 24,
          interval: 2700,
          success: { base: 0.50, max: 0.93, levelSpan: 63 },
          outputs: [
            { id: "silk", name: "Silk", qty: 1, icon: "Silk.png", stackable: true }
          ]
        },
        {
          id: "thief_wine_stall",
          name: "Steal from Wine Stall",
          level: 22,
          xp: 27,
          interval: 2800,
          success: { base: 0.48, max: 0.92, levelSpan: 64 },
          outputs: [
            { id: "jug_of_wine", name: "Jug of wine", qty: 1, icon: "Jug_of_wine.png", stackable: true },
            { id: "grapes", name: "Grapes", qty: 1, icon: "Grapes.png", stackable: true, chance: 0.2 }
          ]
        },
        {
          id: "thief_seed_stall",
          name: "Steal from Seed Stall",
          level: 27,
          xp: 10,
          interval: 2900,
          success: { base: 0.46, max: 0.91, levelSpan: 65 },
          outputs: [
            { id: "potato_seed", name: "Potato seed", qty: 3, icon: "Potato_seed_5.png", stackable: true },
            { id: "onion_seed", name: "Onion seed", qty: 3, icon: "Onion_seed_5.png", stackable: true },
            { id: "cabbage_seed", name: "Cabbage seed", qty: 3, icon: "Cabbage_seed_5.png", stackable: true },
            { id: "tomato_seed", name: "Tomato seed", qty: 3, icon: "Tomato_seed_5.png", stackable: true }
          ]
        },
        {
          id: "thief_fur_stall",
          name: "Steal from Fur Stall",
          level: 35,
          xp: 36,
          interval: 3000,
          success: { base: 0.46, max: 0.91, levelSpan: 65 },
          outputs: [
            { id: "grey_wolf_fur", name: "Grey wolf fur", qty: 1, icon: "Grey_wolf_fur.png", stackable: true },
            { id: "bear_fur", name: "Bear fur", qty: 1, icon: "Bear_fur.png", stackable: true }
          ]
        },
        {
          id: "thief_fish_stall",
          name: "Steal from Fish Stall",
          level: 42,
          xp: 42,
          interval: 3100,
          success: { base: 0.44, max: 0.90, levelSpan: 66 },
          outputs: [
            { id: "raw_salmon", name: "Raw salmon", qty: 1, icon: "Raw_salmon.png", stackable: true },
            { id: "raw_tuna", name: "Raw tuna", qty: 1, icon: "Raw_tuna.png", stackable: true },
            { id: "seaweed", name: "Seaweed", qty: 1, icon: "Seaweed.png", stackable: true, chance: 0.3 }
          ]
        },
        {
          id: "thief_crossbow_stall",
          name: "Steal from Crossbow Stall",
          level: 49,
          xp: 52,
          interval: 3200,
          success: { base: 0.42, max: 0.89, levelSpan: 67 },
          outputs: [
            { id: "bronze_bolts", name: "Bronze bolts", qty: 5, icon: "Bronze_bolts_5.png", stackable: true },
            { id: "iron_bolts", name: "Iron bolts", qty: 5, icon: "Iron_bolts_5.png", stackable: true },
            { id: "steel_bolts", name: "Steel bolts", qty: 5, icon: "Steel_bolts_5.png", stackable: true }
          ]
        },
        {
          id: "thief_silver_stall",
          name: "Steal from Silver Stall",
          level: 50,
          xp: 54,
          interval: 3300,
          success: { base: 0.42, max: 0.89, levelSpan: 67 },
          outputs: [
            { id: "silver_ore", name: "Silver ore", qty: 1, icon: "Silver_ore.png", stackable: true },
            { id: "silver_bar", name: "Silver bar", qty: 1, icon: "Silver_bar.png", stackable: true }
          ]
        },
        {
          id: "thief_spice_stall",
          name: "Steal from Spice Stall",
          level: 65,
          xp: 81,
          interval: 3500,
          success: { base: 0.34, max: 0.86, levelSpan: 70 },
          outputs: [
            { id: "spice", name: "Spice", qty: 1, icon: "Spice.png", stackable: true },
            { id: "curry_leaf", name: "Curry leaf", qty: 1, icon: "Curry_leaf.png", stackable: true, chance: 0.2 }
          ]
        },
        {
          id: "thief_fruit_stall",
          name: "Steal from Fruit Stall",
          level: 25,
          xp: 28,
          interval: 2850,
          success: { base: 0.48, max: 0.92, levelSpan: 64 },
          outputs: [
            { id: "cooking_apple", name: "Cooking apple", qty: 1, icon: "Cooking_apple.png", stackable: true },
            { id: "banana", name: "Banana", qty: 1, icon: "Banana.png", stackable: true },
            { id: "strawberry", name: "Strawberry", qty: 1, icon: "Strawberry.png", stackable: true },
            { id: "pineapple", name: "Pineapple", qty: 1, icon: "Pineapple.png", stackable: true, chance: 0.1 }
          ]
        }
      ]
    },

    Crafting: {
      description: "Cut gems and craft utility components.",
      actions: [
        { id: "craft_ball_of_wool", name: "Craft Ball of Wool", level: 1, xp: 2.5, interval: 2000, inputs: [{ id: "wool", qty: 1 }], outputs: [{ id: "ball_of_wool", name: "Ball of Wool", qty: 1, icon: "Ball_of_wool.png", stackable: true }] },
        { id: "craft_bow_string", name: "Craft Bow String", level: 10, xp: 15, interval: 2800, inputs: [{ id: "flax", qty: 1 }], outputs: [{ id: "bow_string", name: "Bow String", qty: 1, icon: "Bow_string.png", stackable: true }] },
        { id: "craft_crossbow_string", name: "Craft Crossbow String", level: 10, xp: 15, interval: 3000, inputs: [{ id: "sinew", qty: 1 }], outputs: [{ id: "crossbow_string", name: "Crossbow String", qty: 1, icon: "Crossbow_string.png", stackable: true }] },
        { id: "craft_linen_yarn", name: "Craft Linen Yarn", level: 12, xp: 16, interval: 3000, inputs: [{ id: "flax", qty: 1 }], outputs: [{ id: "linen_yarn", name: "Linen Yarn", qty: 1, icon: "Linen_yarn.png", stackable: true }] },
        { id: "craft_magic_string", name: "Craft Magic String", level: 34, xp: 85, interval: 3000, inputs: [{ id: "uncut_ruby", qty: 1 }], outputs: [{ id: "ruby", name: "Ruby", qty: 1, icon: "Ruby.png", stackable: true }] },
        { id: "craft_rope", name: "Craft Rope", level: 30, xp: 25, interval: 3000, inputs: [{ id: "hair", qty: 1 }], outputs: [{ id: "rope", name: "Rope", qty: 1, icon: "Rope.png", stackable: true }] },
        { id: "craft_hemp_yarn", name: "Craft Hemp Yarn", level: 39, xp: 60, interval: 3000, inputs: [{ id: "hemp", qty: 1 }], outputs: [{ id: "hemp_yarn", name: "Hemp Yarn", qty: 1, icon: "Hemp_yarn.png", stackable: true }] },
        { id: "craft_cotton_yarn", name: "Craft Cotton Yarn", level: 73, xp: 105, interval: 3000, inputs: [{ id: "cotton_boll", qty: 1 }], outputs: [{ id: "cotton_yarn", name: "Cotton Yarn", qty: 1, icon: "Cotton_yarn.png", stackable: true }] },
        { id: "craft_cut_opal", name: "Cut Opal", level: 1, xp: 15, interval: 3000, inputs: [{ id: "uncut_opal", qty: 1 }], outputs: [{ id: "opal", name: "Opal", qty: 1, icon: "Opal.png", stackable: true }] },
        { id: "craft_cut_jade", name: "Cut Jade", level: 13, xp: 20, interval: 3000, inputs: [{ id: "uncut_jade", qty: 1 }], outputs: [{ id: "jade", name: "Jade", qty: 1, icon: "Jade.png", stackable: true }] },
        { id: "craft_red_topaz", name: "Cut Red Topaz", level: 16, xp: 85, interval: 3000, inputs: [{ id: "uncut_red_topaz", qty: 1 }], outputs: [{ id: "red_topaz", name: "Red Topaz", qty: 1, icon: "Red_topaz.png", stackable: true }] },
        { id: "craft_sapphire", name: "Cut Sapphire", level: 20, xp: 50, interval: 3000, inputs: [{ id: "uncut_sapphire", qty: 1 }], outputs: [{ id: "sapphire", name: "Sapphire", qty: 1, icon: "Sapphire.png", stackable: true }] },
        { id: "craft_emerald", name: "Cut Emerald", level: 27, xp: 68, interval: 3000, inputs: [{ id: "uncut_emerald", qty: 1 }], outputs: [{ id: "emerald", name: "Emerald", qty: 1, icon: "Emerald.png", stackable: true }] },
        { id: "craft_cut_ruby", name: "Cut Ruby", level: 34, xp: 85, interval: 3000, inputs: [{ id: "uncut_ruby", qty: 1 }], outputs: [{ id: "ruby", name: "Ruby", qty: 1, icon: "Ruby.png", stackable: true }] },
        { id: "craft_cut_diamond", name: "Cut Diamond", level: 43, xp: 107.5, interval: 3000, inputs: [{ id: "uncut_diamond", qty: 1 }], outputs: [{ id: "diamond", name: "Diamond", qty: 1, icon: "Diamond.png", stackable: true }] },
        { id: "craft_cut_dragonstone", name: "Cut Dragonstone", level: 55, xp: 137.5, interval: 3000, inputs: [{ id: "Uncut_Dragonstone", qty: 1 }], outputs: [{ id: "dragonstone", name: "Dragonstone", qty: 1, icon: "Dragonstone.png", stackable: true }] },
        { id: "craft_cut_onyx", name: "Cut Onyx", level: 67, xp: 167.5, interval: 3000, inputs: [{ id: "uncut_onyx", qty: 1 }], outputs: [{ id: "onyx", name: "Onyx", qty: 1, icon: "Onyx.png", stackable: true }] },
        { id: "craft_cut_zenyte", name: "Cut Zenyte", level: 89, xp: 50, interval: 3000, inputs: [{ id: "uncut_zenyte", qty: 1 }], outputs: [{ id: "zenyte", name: "Zenyte", qty: 1, icon: "Zenyte.png", stackable: true }] },
        { id: "craft_amethyst_bolt_tips", name: "Craft Amethyst Bolt Tips", level: 83, xp: 60, interval: 3000, inputs: [{ id: "uncut_amethyst", qty: 15 }], outputs: [{ id: "amethyst_bolt_tips", name: "Amethyst Bolt Tips", qty: 1, icon: "Amethyst_bolt_tips.png", stackable: true }] },
        { id: "craft_amethyst_arrowtips", name: "Craft Amethyst Arrowtips", level: 85, xp: 60, interval: 3000, inputs: [{ id: "uncut_amethyst", qty: 15 }], outputs: [{ id: "amethyst_arrowtips", name: "Amethyst Arrowtips", qty: 1, icon: "Amethyst_arrowtips.png", stackable: true }] },
        { id: "craft_amethyst_javelin_tips", name: "Craft Amethyst Javelin Tips", level: 87, xp: 60, interval: 3000, inputs: [{ id: "uncut_amethyst", qty: 5 }], outputs: [{ id: "amethyst_javelin_tips", name: "Amethyst Javelin Tips", qty: 1, icon: "Amethyst_javelin_tips.png", stackable: true }] },
        { id: "craft_amethyst_dart_tips", name: "Craft Amethyst Dart Tips", level: 89, xp: 60, interval: 3000, inputs: [{ id: "uncut_amethyst", qty: 8 }], outputs: [{ id: "amethyst_dart_tips", name: "Amethyst Dart Tips", qty: 1, icon: "Amethyst_dart_tips.png", stackable: true }] }
      
      ]
    },

    Slayer: {
      description: "Take slayer contracts and complete simple task cycles.",
      actions: [
        { id: "slayer_bats", name: "Bat Contract", level: 1, xp: 18, interval: 3200, outputs: [{ id: "bones", name: "Bones", qty: 1, icon: "Bones.png", stackable: true }, { id: "coins", name: "Coins", qty: 30, icon: "Coins_10000.png", stackable: true }] },
        { id: "slayer_crawlers", name: "Crawling Hand Contract", level: 5, xp: 30, interval: 3600, outputs: [{ id: "big_bones", name: "Big bones", qty: 1, icon: "Big_bones.png", stackable: true }, { id: "grimy_guam", name: "Grimy guam", qty: 1, icon: "Grimy_guam_leaf.png", stackable: true, chance: 0.2 }] }
      ]
    },

    Hunter: {
      description: "Catch creatures for meat, bones, and supplies.",
      actions: [
        { id: "hunt_bird", name: "Bird Snaring", level: 1, xp: 34, interval: 3000, outputs: [{ id: "raw_bird_meat", name: "Raw bird meat", qty: 1, icon: "Raw_bird_meat.png", stackable: true }, { id: "bones", name: "Bones", qty: 1, icon: "Bones.png", stackable: true }, { id: "feather", name: "Feather", qty: 6, icon: "Feather.png", stackable: true }] },
        { id: "hunt_chinchompa", name: "Catch Chinchompa", level: 53, xp: 198, interval: 4200, outputs: [{ id: "chinchompa", name: "Chinchompa", qty: 6, icon: "Chinchompa.png", stackable: true }, { id: "rune_essence", name: "Rune essence", qty: 2, icon: "Rune_essence.png", stackable: true, chance: 0.25 }] }
      ]
    },

    Fishing: {
      description: "Catch fish for Cooking training.",
      actions: [
        { id: "fish_shrimp", name: "Net Shrimp", level: 1, xp: 10, interval: 2200, success: { base: 0.62, max: 0.98, levelSpan: 55 }, outputs: [{ id: "raw_shrimps", name: "Raw shrimps", qty: 1, icon: "Raw_shrimps.png", stackable: true }] },
        { id: "fish_sardine", name: "Bait Sardine", level: 5, xp: 20, interval: 3000, success: { base: 0.52, max: 0.95, levelSpan: 55 }, outputs: [{ id: "raw_sardine", name: "Raw sardine", qty: 1, icon: "Raw_sardine.png", stackable: true }] },
        { id: "fish_herring", name: "Bait Herring", level: 10, xp: 30, interval: 3800, success: { base: 0.46, max: 0.9, levelSpan: 50 }, outputs: [{ id: "raw_herring", name: "Raw herring", qty: 1, icon: "Raw_herring.png", stackable: true }] },
        { id: "fish_anchovies", name: "Net Anchovies", level: 15, xp: 40, interval: 3800, success: { base: 0.46, max: 0.9, levelSpan: 50 }, outputs: [{ id: "raw_anchovies", name: "Raw anchovies", qty: 1, icon: "Raw_anchovies.png", stackable: true }] },
        { id: "fish_mackerel", name: "Net Mackerel", level: 16, xp: 20, interval: 3800, success: { base: 0.46, max: 0.9, levelSpan: 50 }, outputs: [{ id: "raw_mackerel", name: "Raw mackerel", qty: 1, icon: "Raw_mackerel.png", stackable: true }] },
        { id: "fish_trout", name: "Fly Trout", level: 20, xp: 50, interval: 4000, success: { base: 0.44, max: 0.88, levelSpan: 50 }, outputs: [{ id: "raw_trout", name: "Raw trout", qty: 1, icon: "Raw_trout.png", stackable: true }] },
        { id: "fish_cod", name: "Big Net Cod", level: 23, xp: 45, interval: 4200, success: { base: 0.42, max: 0.86, levelSpan: 50 }, outputs: [{ id: "raw_cod", name: "Raw cod", qty: 1, icon: "Raw_cod.png", stackable: true }] },
        { id: "fish_pike", name: "Bait Pike", level: 25, xp: 60, interval: 4300, outputs: [{ id: "raw_pike", name: "Raw pike", qty: 1, icon: "Raw_pike.png", stackable: true }] },
        { id: "fish_slimy_eel", name: "Bait Slimy eel", level: 28, xp: 80, interval: 4400, outputs: [{ id: "raw_slimy_eel", name: "Raw slimy eel", qty: 1, icon: "Raw_slimy_eel.png", stackable: true }] },
        { id: "fish_salmon", name: "Fly Salmon", level: 30, xp: 70, interval: 4500, outputs: [{ id: "raw_salmon", name: "Raw salmon", qty: 1, icon: "Raw_salmon.png", stackable: true }] },
        { id: "fish_tuna", name: "Harpoon Tuna", level: 35, xp: 80, interval: 4600, outputs: [{ id: "raw_tuna", name: "Raw tuna", qty: 1, icon: "Raw_tuna.png", stackable: true }] },
        { id: "fish_lobster", name: "Cage Lobster", level: 40, xp: 90, interval: 4700, outputs: [{ id: "raw_lobster", name: "Raw lobster", qty: 1, icon: "Raw_lobster.png", stackable: true }] },
        { id: "fish_swordfish", name: "Harpoon Swordfish", level: 50, xp: 100, interval: 5000, outputs: [{ id: "raw_swordfish", name: "Raw swordfish", qty: 1, icon: "Raw_swordfish.png", stackable: true }] },
        { id: "fish_monkfish", name: "Net Monkfish", level: 62, xp: 120, interval: 5400, outputs: [{ id: "raw_monkfish", name: "Raw monkfish", qty: 1, icon: "Raw_monkfish.png", stackable: true }] },
        { id: "fish_karambwan", name: "Vessel Karambwan", level: 65, xp: 50, interval: 5500, outputs: [{ id: "raw_karambwan", name: "Raw karambwan", qty: 1, icon: "Raw_karambwan.png", stackable: true }] },
        { id: "fish_shark", name: "Harpoon Shark", level: 76, xp: 110, interval: 6000, outputs: [{ id: "raw_shark", name: "Raw shark", qty: 1, icon: "Raw_shark.png", stackable: true }] },
        { id: "fish_sea_turtle", name: "Fishing Trawler Sea turtle", level: 79, xp: 38, interval: 6200, outputs: [{ id: "raw_sea_turtle", name: "Raw sea turtle", qty: 1, icon: "Raw_sea_turtle.png", stackable: true }] },
        { id: "fish_manta_ray", name: "Fishing Trawler Manta ray", level: 81, xp: 91, interval: 6400, outputs: [{ id: "raw_manta_ray", name: "Raw manta ray", qty: 1, icon: "Raw_manta_ray.png", stackable: true }] },
        { id: "fish_anglerfish", name: "Sandworms Anglerfish", level: 82, xp: 120, interval: 6600, outputs: [{ id: "raw_anglerfish", name: "Raw anglerfish", qty: 1, icon: "Raw_anglerfish.png", stackable: true }] },
        { id: "fish_dark_crab", name: "Cage with dark bait Dark crab", level: 85, xp: 130, interval: 7000, outputs: [{ id: "raw_dark_crab", name: "Raw dark crab", qty: 1, icon: "Raw_dark_crab.png", stackable: true }] },
        { id: "fish_haddock", name: "Deep sea trawling Haddock", level: 73, xp: 128.5, interval: 6100, outputs: [{ id: "raw_haddock", name: "Raw haddock", qty: 1, icon: "Raw_haddock.png", stackable: true }] },
        { id: "fish_yellowfin", name: "Deep sea trawling Yellowfin", level: 79, xp: 155.5, interval: 6300, outputs: [{ id: "raw_yellowfin", name: "Raw yellowfin", qty: 1, icon: "Raw_yellowfin.png", stackable: true }] },
        { id: "fish_marlin", name: "Deep sea trawling Marlin", level: 91, xp: 265.5, interval: 100, outputs: [{ id: "raw_marlin", name: "Raw marlin", qty: 3, icon: "Raw_marlin.png", stackable: true }] }
      ]
    },

    Smithing: {
      description: "Smelt ores and forge weapons and armor.",
      actions: [
        // Smelting
        { id: "smith_bronze_bar", name: "Smelt Bronze Bar", level: 1, xp: 6.2, interval: 2400, inputs: [{ id: "copper_ore", qty: 1 }, { id: "tin_ore", qty: 1 }], outputs: [{ id: "bronze_bar", name: "Bronze bar", qty: 1, icon: "Bronze_bar.png", stackable: true }] },
        { id: "smith_iron_bar", name: "Smelt Iron Bar", level: 15, xp: 12.5, interval: 2600, success: { base: 0.5, max: 0.8, levelSpan: 50 }, inputs: [{ id: "iron_ore", qty: 1 }], outputs: [{ id: "iron_bar", name: "Iron bar", qty: 1, icon: "Iron_bar.png", stackable: true }] },
        { id: "smith_silver_bar", name: "Smelt Silver Bar", level: 20, xp: 13.7, interval: 2700, inputs: [{ id: "silver_ore", qty: 1 }], outputs: [{ id: "silver_bar", name: "Silver bar", qty: 1, icon: "Silver_bar.png", stackable: true }] },
        { id: "smith_steel_bar", name: "Smelt Steel Bar", level: 30, xp: 17.5, interval: 3000, inputs: [{ id: "iron_ore", qty: 1 }, { id: "coal", qty: 2 }], outputs: [{ id: "steel_bar", name: "Steel bar", qty: 1, icon: "Steel_bar.png", stackable: true }] },
        { id: "smith_gold_bar", name: "Smelt Gold Bar", level: 40, xp: 22.5, interval: 3200, inputs: [{ id: "gold_ore", qty: 1 }], outputs: [{ id: "gold_bar", name: "Gold bar", qty: 1, icon: "Gold_bar.png", stackable: true }] },
        { id: "smith_mithril_bar", name: "Smelt Mithril Bar", level: 50, xp: 30, interval: 3400, inputs: [{ id: "mithril_ore", qty: 1 }, { id: "coal", qty: 4 }], outputs: [{ id: "mithril_bar", name: "Mithril bar", qty: 1, icon: "Mithril_bar.png", stackable: true }] },
        { id: "smith_adamantite_bar", name: "Smelt Adamantite Bar", level: 70, xp: 37.5, interval: 3800, inputs: [{ id: "adamantite_ore", qty: 1 }, { id: "coal", qty: 6 }], outputs: [{ id: "adamantite_bar", name: "Adamantite bar", qty: 1, icon: "Adamantite_bar.png", stackable: true }] },
        { id: "smith_runite_bar", name: "Smelt Runite Bar", level: 85, xp: 50, interval: 4200, inputs: [{ id: "runite_ore", qty: 1 }, { id: "coal", qty: 8 }], outputs: [{ id: "runite_bar", name: "Runite bar", qty: 1, icon: "Runite_bar.png", stackable: true }] },

        // Bronze Forging
        { id: "smith_bronze_dagger", name: "Smith Bronze Dagger", level: 1, xp: 12.5, interval: 2500, inputs: [{ id: "bronze_bar", qty: 1 }], outputs: [{ id: "bronze_dagger", name: "Bronze dagger", qty: 1, icon: "Bronze_dagger.png", stackable: false }] },
        { id: "smith_bronze_sword", name: "Smith Bronze Sword", level: 4, xp: 12.5, interval: 2600, inputs: [{ id: "bronze_bar", qty: 1 }], outputs: [{ id: "bronze_sword", name: "Bronze sword", qty: 1, icon: "Bronze_sword.png", stackable: false }] },
        { id: "smith_bronze_scimitar", name: "Smith Bronze Scimitar", level: 5, xp: 25, interval: 2700, inputs: [{ id: "bronze_bar", qty: 2 }], outputs: [{ id: "bronze_scimitar", name: "Bronze scimitar", qty: 1, icon: "Bronze_scimitar.png", stackable: false }] },
        { id: "smith_bronze_platebody", name: "Smith Bronze Platebody", level: 18, xp: 62.5, interval: 3000, inputs: [{ id: "bronze_bar", qty: 5 }], outputs: [{ id: "bronze_platebody", name: "Bronze platebody", qty: 1, icon: "Bronze_platebody.png", stackable: false }] },

        // Iron Forging
        { id: "smith_iron_dagger", name: "Smith Iron Dagger", level: 15, xp: 25, interval: 2800, inputs: [{ id: "iron_bar", qty: 1 }], outputs: [{ id: "iron_dagger", name: "Iron dagger", qty: 1, icon: "Iron_dagger.png", stackable: false }] },
        { id: "smith_iron_sword", name: "Smith Iron Sword", level: 19, xp: 25, interval: 2900, inputs: [{ id: "iron_bar", qty: 1 }], outputs: [{ id: "iron_sword", name: "Iron sword", qty: 1, icon: "Iron_sword.png", stackable: false }] },
        { id: "smith_iron_scimitar", name: "Smith Iron Scimitar", level: 20, xp: 50, interval: 3000, inputs: [{ id: "iron_bar", qty: 2 }], outputs: [{ id: "iron_scimitar", name: "Iron scimitar", qty: 1, icon: "Iron_scimitar.png", stackable: false }] },
        { id: "smith_iron_platebody", name: "Smith Iron Platebody", level: 33, xp: 125, interval: 3200, inputs: [{ id: "iron_bar", qty: 5 }], outputs: [{ id: "iron_platebody", name: "Iron platebody", qty: 1, icon: "Iron_platebody.png", stackable: false }] },

        // Steel Forging
        { id: "smith_steel_dagger", name: "Smith Steel Dagger", level: 30, xp: 37.5, interval: 3100, inputs: [{ id: "steel_bar", qty: 1 }], outputs: [{ id: "steel_dagger", name: "Steel dagger", qty: 1, icon: "Steel_dagger.png", stackable: false }] },
        { id: "smith_steel_sword", name: "Smith Steel Sword", level: 34, xp: 37.5, interval: 3200, inputs: [{ id: "steel_bar", qty: 1 }], outputs: [{ id: "steel_sword", name: "Steel sword", qty: 1, icon: "Steel_sword.png", stackable: false }] },
        { id: "smith_steel_scimitar", name: "Smith Steel Scimitar", level: 35, xp: 75, interval: 3300, inputs: [{ id: "steel_bar", qty: 2 }], outputs: [{ id: "steel_scimitar", name: "Steel scimitar", qty: 1, icon: "Steel_scimitar.png", stackable: false }] },
        { id: "smith_steel_platebody", name: "Smith Steel Platebody", level: 48, xp: 187.5, interval: 3500, inputs: [{ id: "steel_bar", qty: 5 }], outputs: [{ id: "steel_platebody", name: "Steel platebody", qty: 1, icon: "Steel_platebody.png", stackable: false }] },

        // Mithril Forging
        { id: "smith_mithril_dagger", name: "Smith Mithril Dagger", level: 50, xp: 50, interval: 3400, inputs: [{ id: "mithril_bar", qty: 1 }], outputs: [{ id: "mithril_dagger", name: "Mithril dagger", qty: 1, icon: "Mithril_dagger.png", stackable: false }] },
        { id: "smith_mithril_sword", name: "Smith Mithril Sword", level: 54, xp: 50, interval: 3500, inputs: [{ id: "mithril_bar", qty: 1 }], outputs: [{ id: "mithril_sword", name: "Mithril sword", qty: 1, icon: "Mithril_sword.png", stackable: false }] },
        { id: "smith_mithril_scimitar", name: "Smith Mithril Scimitar", level: 55, xp: 100, interval: 3600, inputs: [{ id: "mithril_bar", qty: 2 }], outputs: [{ id: "mithril_scimitar", name: "Mithril scimitar", qty: 1, icon: "Mithril_scimitar.png", stackable: false }] },
        { id: "smith_mithril_platebody", name: "Smith Mithril Platebody", level: 68, xp: 250, interval: 3800, inputs: [{ id: "mithril_bar", qty: 5 }], outputs: [{ id: "mithril_platebody", name: "Mithril platebody", qty: 1, icon: "Mithril_platebody.png", stackable: false }] },

        // Adamant Forging
        { id: "smith_adamant_dagger", name: "Smith Adamant Dagger", level: 70, xp: 62.5, interval: 3800, inputs: [{ id: "adamantite_bar", qty: 1 }], outputs: [{ id: "adamant_dagger", name: "Adamant dagger", qty: 1, icon: "Adamant_dagger.png", stackable: false }] },
        { id: "smith_adamant_sword", name: "Smith Adamant Sword", level: 74, xp: 62.5, interval: 3900, inputs: [{ id: "adamantite_bar", qty: 1 }], outputs: [{ id: "adamant_sword", name: "Adamant sword", qty: 1, icon: "Adamant_sword.png", stackable: false }] },
        { id: "smith_adamant_scimitar", name: "Smith Adamant Scimitar", level: 75, xp: 125, interval: 4000, inputs: [{ id: "adamantite_bar", qty: 2 }], outputs: [{ id: "adamant_scimitar", name: "Adamant scimitar", qty: 1, icon: "Adamant_scimitar.png", stackable: false }] },
        { id: "smith_adamant_platebody", name: "Smith Adamant Platebody", level: 88, xp: 312.5, interval: 4200, inputs: [{ id: "adamantite_bar", qty: 5 }], outputs: [{ id: "adamant_platebody", name: "Adamant platebody", qty: 1, icon: "Adamant_platebody.png", stackable: false }] },

        // Rune Forging
        { id: "smith_rune_dagger", name: "Smith Rune Dagger", level: 85, xp: 75, interval: 4200, inputs: [{ id: "runite_bar", qty: 1 }], outputs: [{ id: "rune_dagger", name: "Rune dagger", qty: 1, icon: "Rune_dagger.png", stackable: false }] },
        { id: "smith_rune_sword", name: "Smith Rune Sword", level: 89, xp: 75, interval: 4300, inputs: [{ id: "runite_bar", qty: 1 }], outputs: [{ id: "rune_sword", name: "Rune sword", qty: 1, icon: "Rune_sword.png", stackable: false }] },
        { id: "smith_rune_scimitar", name: "Smith Rune Scimitar", level: 90, xp: 150, interval: 4400, inputs: [{ id: "runite_bar", qty: 2 }], outputs: [{ id: "rune_scimitar", name: "Rune scimitar", qty: 1, icon: "Rune_scimitar.png", stackable: false }] },
        { id: "smith_rune_platebody", name: "Smith Rune Platebody", level: 99, xp: 375, interval: 4600, inputs: [{ id: "runite_bar", qty: 5 }], outputs: [{ id: "rune_platebody", name: "Rune platebody", qty: 1, icon: "Rune_platebody.png", stackable: false }] }
      ]
    },

    Cooking: {
      description: "Cook fish and meat gathered from other skills.",
      actions: [
        {
          id: "cook_shrimp",
          name: "Cook Shrimp",
          level: 1,
          xp: 30,
          interval: 2300,
          success: { base: 0.72, max: 1, levelSpan: 30 },
          fail: [{ id: "burnt_shrimps", name: "Burnt shrimps", qty: 1, icon: "Burnt_shrimps.png", stackable: true }],
          inputs: [{ id: "raw_shrimps", qty: 1 }],
          outputs: [{ id: "shrimps", name: "Shrimps", qty: 1, icon: "Shrimps.png", stackable: true }]
        },
        {
          id: "cook_trout",
          name: "Cook Trout",
          level: 15,
          xp: 70,
          interval: 2700,
          success: { base: 0.6, max: 1, levelSpan: 35 },
          fail: [{ id: "burnt_fish", name: "Burnt fish", qty: 1, icon: "Burnt_fish.png", stackable: true }],
          inputs: [{ id: "raw_trout", qty: 1 }],
          outputs: [{ id: "trout", name: "Trout", qty: 1, icon: "Trout.png", stackable: true }]
        },
        {
          id: "cook_salmon",
          name: "Cook Salmon",
          level: 25,
          xp: 90,
          interval: 2800,
          fail: [{ id: "burnt_salmon", name: "Burnt salmon", qty: 1, icon: "Burnt_fish.png", stackable: true }],
          inputs: [{ id: "raw_salmon", qty: 1 }],
          outputs: [{ id: "salmon", name: "Salmon", qty: 1, icon: "Salmon.png", stackable: true }]
        },
        {
          id: "cook_tuna",
          name: "Cook Tuna",
          level: 30,
          xp: 100,
          interval: 2900,
          fail: [{ id: "burnt_tuna", name: "Burnt tuna", qty: 1, icon: "Burnt_fish.png", stackable: true }],
          inputs: [{ id: "raw_tuna", qty: 1 }],
          outputs: [{ id: "tuna", name: "Tuna", qty: 1, icon: "Tuna.png", stackable: true }]
        },
        {
          id: "cook_lobster",
          name: "Cook Lobster",
          level: 40,
          xp: 120,
          interval: 3400,
          fail: [{ id: "burnt_lobster", name: "Burnt lobster", qty: 1, icon: "Burnt_lobster.png", stackable: true }],
          inputs: [{ id: "raw_lobster", qty: 1 }],
          outputs: [{ id: "lobster", name: "Lobster", qty: 1, icon: "Lobster.png", stackable: true }]
        },
        {
          id: "cook_swordfish",
          name: "Cook Swordfish",
          level: 45,
          xp: 140,
          interval: 3500,
          fail: [{ id: "burnt_swordfish", name: "Burnt swordfish", qty: 1, icon: "Burnt_fish.png", stackable: true }],
          inputs: [{ id: "raw_swordfish", qty: 1 }],
          outputs: [{ id: "swordfish", name: "Swordfish", qty: 1, icon: "Swordfish.png", stackable: true }]
        },
        {
          id: "cook_monkfish",
          name: "Cook Monkfish",
          level: 62,
          xp: 150,
          interval: 3700,
          fail: [{ id: "burnt_monkfish", name: "Burnt monkfish", qty: 1, icon: "Burnt_fish.png", stackable: true }],
          inputs: [{ id: "raw_monkfish", qty: 1 }],
          outputs: [{ id: "monkfish", name: "Monkfish", qty: 1, icon: "Monkfish.png", stackable: true }]
        },
        {
          id: "cook_shark",
          name: "Cook Shark",
          level: 80,
          xp: 210,
          interval: 4000,
          fail: [{ id: "burnt_shark", name: "Burnt shark", qty: 1, icon: "Burnt_fish.png", stackable: true }],
          inputs: [{ id: "raw_shark", qty: 1 }],
          outputs: [{ id: "shark", name: "Shark", qty: 1, icon: "Shark.png", stackable: true }]
        },
        {
          id: "cook_manta_ray",
          name: "Cook Manta Ray",
          level: 91,
          xp: 216.2,
          interval: 4200,
          fail: [{ id: "burnt_manta_ray", name: "Burnt manta ray", qty: 1, icon: "Burnt_fish.png", stackable: true }],
          inputs: [{ id: "raw_manta_ray", qty: 1 }],
          outputs: [{ id: "manta_ray", name: "Manta ray", qty: 1, icon: "Manta_ray.png", stackable: true }]
        },
        {
          id: "cook_anglerfish",
          name: "Cook Anglerfish",
          level: 84,
          xp: 230,
          interval: 4100,
          fail: [{ id: "burnt_anglerfish", name: "Burnt anglerfish", qty: 1, icon: "Burnt_fish.png", stackable: true }],
          inputs: [{ id: "raw_anglerfish", qty: 1 }],
          outputs: [{ id: "anglerfish", name: "Anglerfish", qty: 1, icon: "Anglerfish.png", stackable: true }]
        },
        {
          id: "cook_dark_crab",
          name: "Cook Dark Crab",
          level: 90,
          xp: 215,
          interval: 4150,
          fail: [{ id: "burnt_dark_crab", name: "Burnt dark crab", qty: 1, icon: "Burnt_fish.png", stackable: true }],
          inputs: [{ id: "raw_dark_crab", qty: 1 }],
          outputs: [{ id: "dark_crab", name: "Dark crab", qty: 1, icon: "Dark_crab.png", stackable: true }]
        },
        {
          id: "cook_sea_turtle",
          name: "Cook Sea Turtle",
          level: 82,
          xp: 211.3,
          interval: 4120,
          fail: [{ id: "burnt_sea_turtle", name: "Burnt sea turtle", qty: 1, icon: "Burnt_fish.png", stackable: true }],
          inputs: [{ id: "raw_sea_turtle", qty: 1 }],
          outputs: [{ id: "sea_turtle", name: "Sea turtle", qty: 1, icon: "Sea_turtle.png", stackable: true }]
        },
        {
          id: "cook_marlin",
          name: "Cook Marlin",
          level: 92,
          xp: 225,
          interval: 4300,
          fail: [{ id: "burnt_marlin", name: "Burnt marlin", qty: 1, icon: "Burnt_fish.png", stackable: true }],
          inputs: [{ id: "raw_marlin", qty: 1 }],
          outputs: [{ id: "marlin", name: "Marlin", qty: 1, icon: "Marlin.png", stackable: true }]
        }
      ]
    },

    Firemaking: {
      description: "Burn logs from Woodcutting.",
      actions: [
        { id: "fire_logs", name: "Burn Logs", level: 1, xp: 40, interval: 2200, inputs: [{ id: "normal_log", qty: 1 }], outputs: [{ id: "ashes", name: "Ashes", qty: 1, icon: "Ashes.png", stackable: true }] },
        { id: "fire_oak", name: "Burn Oak Logs", level: 15, xp: 60, interval: 2500, inputs: [{ id: "oak_log", qty: 1 }], outputs: [{ id: "ashes", name: "Ashes", qty: 1, icon: "Ashes.png", stackable: true }] },
        { id: "fire_willow", name: "Burn Willow Logs", level: 30, xp: 90, interval: 2800, inputs: [{ id: "willow_log", qty: 1 }], outputs: [{ id: "ashes", name: "Ashes", qty: 1, icon: "Ashes.png", stackable: true }] },
        { id: "fire_teak", name: "Burn Teak Logs", level: 35, xp: 105, interval: 3000, inputs: [{ id: "teak_log", qty: 1 }], outputs: [{ id: "ashes", name: "Ashes", qty: 1, icon: "Ashes.png", stackable: true }] },
        { id: "fire_maple", name: "Burn Maple Logs", level: 45, xp: 135, interval: 3200, inputs: [{ id: "maple_log", qty: 1 }], outputs: [{ id: "ashes", name: "Ashes", qty: 1, icon: "Ashes.png", stackable: true }] },
        { id: "fire_mahogany", name: "Burn Mahogany Logs", level: 50, xp: 157.5, interval: 3400, inputs: [{ id: "mahogany_log", qty: 1 }], outputs: [{ id: "ashes", name: "Ashes", qty: 1, icon: "Ashes.png", stackable: true }] },
        { id: "fire_yew", name: "Burn Yew Logs", level: 60, xp: 202.5, interval: 3600, inputs: [{ id: "yew_log", qty: 1 }], outputs: [{ id: "ashes", name: "Ashes", qty: 1, icon: "Ashes.png", stackable: true }] },
        { id: "fire_magic", name: "Burn Magic Logs", level: 75, xp: 304, interval: 4000, inputs: [{ id: "magic_log", qty: 1 }], outputs: [{ id: "ashes", name: "Ashes", qty: 1, icon: "Ashes.png", stackable: true }] },
        { id: "fire_redwood", name: "Burn Redwood Logs", level: 90, xp: 500, interval: 4500, inputs: [{ id: "redwood_log", qty: 1 }], outputs: [{ id: "ashes", name: "Ashes", qty: 1, icon: "Ashes.png", stackable: true }] }
      ]
    },

    Farming: {
      description: "Right-click a patch to plant a seed for that patch type. Longest growth is scaled to 10 minutes.",
      farming: true,
      actions: [
        // Allotment Seeds
        { id: "farm_potato", name: "Plant Potato Seeds", level: 1, xp: 8, interval: 120000, inputs: [{ id: "potato_seed", qty: 3 }], outputs: [{ id: "potato", name: "Potato", qty: 12, icon: "Potato.png", stackable: true }] },
        { id: "farm_onion", name: "Plant Onion Seeds", level: 5, xp: 10, interval: 180000, inputs: [{ id: "onion_seed", qty: 3 }], outputs: [{ id: "onion", name: "Onion", qty: 12, icon: "Onion.png", stackable: true }] },
        { id: "farm_sweetcorn", name: "Plant Sweetcorn Seeds", level: 20, xp: 17, interval: 240000, inputs: [{ id: "sweetcorn_seed", qty: 3 }], outputs: [{ id: "sweetcorn", name: "Sweetcorn", qty: 12, icon: "Sweetcorn.png", stackable: true }] },

        // Herb Seeds
        { id: "farm_guam", name: "Plant Guam Seeds", level: 9, xp: 11, interval: 300000, inputs: [{ id: "guam_seed", qty: 3 }], outputs: [{ id: "grimy_guam", name: "Grimy guam", qty: 15, icon: "Grimy_guam_leaf.png", stackable: true }] },
        { id: "farm_ranarr", name: "Plant Ranarr Seeds", level: 32, xp: 27, interval: 360000, inputs: [{ id: "ranarr_seed", qty: 3 }], outputs: [{ id: "grimy_ranarr", name: "Grimy ranarr", qty: 15, icon: "Grimy_ranarr_weed.png", stackable: true }] },
        { id: "farm_snapdragon", name: "Plant Snapdragon Seeds", level: 62, xp: 47.5, interval: 420000, inputs: [{ id: "snapdragon_seed", qty: 3 }], outputs: [{ id: "grimy_snapdragon", name: "Grimy snapdragon", qty: 15, icon: "Grimy_snapdragon.png", stackable: true }] },

        // Tree Seeds
        { id: "farm_oak", name: "Plant Oak Seeds", level: 15, xp: 14, interval: 480000, inputs: [{ id: "oak_acorn", qty: 1 }], outputs: [{ id: "oak_log", name: "Oak Logs", qty: 20, icon: "Oak_logs.png", stackable: true }] },
        { id: "farm_maple", name: "Plant Maple Seeds", level: 45, xp: 45, interval: 540000, inputs: [{ id: "maple_seed", qty: 1 }], outputs: [{ id: "maple_log", name: "Maple Logs", qty: 20, icon: "Maple_logs.png", stackable: true }] },
        { id: "farm_yew", name: "Plant Yew Seeds", level: 60, xp: 81, interval: 600000, inputs: [{ id: "yew_seed", qty: 1 }], outputs: [{ id: "yew_log", name: "Yew Logs", qty: 20, icon: "Yew_logs.png", stackable: true }] }
      ]
    }
  };

  const MAGIC_PASSIVE_PERKS = [
    {
      id: "telekinetic_grab",
      level: 33,
      name: "Telekinetic Grab",
      description: "Grand Exchange offers fill 8% faster. This only affects fill speed, never price or payout.",
      geFillRateMultiplier: 1.08
    },
    {
      id: "superheat_item",
      level: 43,
      name: "Superheat Item",
      description: "Smithing gains 10% more XP and 8% success chance.",
      skill: "Smithing",
      xpMultiplier: 1.1,
      successBonus: 0.08
    },
    {
      id: "high_level_alchemy",
      level: 55,
      name: "High Level Alchemy",
      description: "Legitimate coin rewards are increased by 20%. Does not affect GE profits or Duel Arena stakes.",
      coinRewardMultiplier: 1.2,
      allowedCoinSources: ["combat", "clues", "raids", "skills"]
    },
    {
      id: "humidify",
      level: 68,
      name: "Humidify",
      description: "Farming harvests yield 15% more produce.",
      skill: "Farming",
      outputMultiplier: 1.15
    },
    {
      id: "spin_flax",
      level: 76,
      name: "Spin Flax",
      description: "Crafting gains 10% more XP and outputs 10% more materials.",
      skill: "Crafting",
      xpMultiplier: 1.1,
      outputMultiplier: 1.1
    },
    {
      id: "plank_make",
      level: 86,
      name: "Plank Make",
      description: "Construction gains 12% more XP.",
      skill: "Construction",
      xpMultiplier: 1.12
    }
  ];

  let selectedSkill = null;
  let activePlayer = null;
  let activeAction = null;

  // Expose for UI
  window.RSGame = window.RSGame || {};
  window.RSGame.SkillsSuite = window.RSGame.SkillsSuite || {};
  Object.defineProperty(window.RSGame.SkillsSuite, 'activeAction', {
    get: () => activeAction
  });
  Object.defineProperty(window.RSGame.SkillsSuite, 'selectedSkill', {
    get: () => selectedSkill
  });
  let actionTimer = null;
  let uiRoot = null;
  let actionStatusEl = null;
  let farmingMenuEl = null;
  let farmingTickTimer = null;
  let skillsGridEl = null;
  let menuOpen = false;

  function getTimeScale() {
    return Math.max(1, Number(RSGame.Game?.getTimeScale?.()) || 1);
  }

  function now() {
    return Date.now();
  }

  function itemIcon(file) {
    return RSGame.UI?.getItemIcon?.(file) || ("https://oldschool.runescape.wiki/images/thumb/" + file + "/32px-" + file);
  }

  function getMagicLevel(player = activePlayer) {
    return Math.max(1, Number(player?.skills?.Magic?.level) || 1);
  }

  function getUnlockedMagicPerks(player = activePlayer) {
    if (player?.funMode) {
      return MAGIC_PASSIVE_PERKS.slice();
    }
    const magicLevel = getMagicLevel(player);
    return MAGIC_PASSIVE_PERKS.filter((perk) => magicLevel >= perk.level);
  }

  function getMagicPerkModifiers(player = activePlayer) {
    const unlocked = getUnlockedMagicPerks(player);
    const state = {
      geFillRateMultiplier: 1,
      coinRewardMultiplierBySource: {},
      skillMods: {}
    };

    unlocked.forEach((perk) => {
      if (perk.geFillRateMultiplier) {
        state.geFillRateMultiplier *= perk.geFillRateMultiplier;
      }
      if (perk.coinRewardMultiplier && Array.isArray(perk.allowedCoinSources)) {
        perk.allowedCoinSources.forEach((source) => {
          state.coinRewardMultiplierBySource[source] = Math.max(
            state.coinRewardMultiplierBySource[source] || 1,
            perk.coinRewardMultiplier
          );
        });
      }
      if (perk.skill) {
        const skillState = state.skillMods[perk.skill] || {
          xpMultiplier: 1,
          outputMultiplier: 1,
          successBonus: 0
        };
        if (perk.xpMultiplier) skillState.xpMultiplier *= perk.xpMultiplier;
        if (perk.outputMultiplier) skillState.outputMultiplier *= perk.outputMultiplier;
        if (perk.successBonus) skillState.successBonus += perk.successBonus;
        state.skillMods[perk.skill] = skillState;
      }
    });

    return state;
  }

  function applyCoinRewardMultiplier(amount, source, player = activePlayer) {
    const base = Math.max(0, Number(amount) || 0);
    if (base <= 0) return 0;
    const sourceKey = String(source || "").toLowerCase();
    if (sourceKey === "duel" || sourceKey === "ge") return Math.round(base);
    const mods = getMagicPerkModifiers(player);
    const magicMult = Number(mods.coinRewardMultiplierBySource[sourceKey]) || 1;
    const petsApplied = Number(window.RSGame?.PetsPerks?.applyCoinRewardMultiplier?.(base, sourceKey, player) || base) || base;
    const petsMult = Math.max(1, petsApplied / Math.max(1, base));
    return Math.max(0, Math.round(base * magicMult * petsMult));
  }

  function getSkillModifier(skillName, key, fallback = 1) {
    const mods = getMagicPerkModifiers(activePlayer).skillMods[String(skillName || "")] || {};
    const magicVal = key === "successBonus"
      ? (Number(mods.successBonus) || 0)
      : (Number(mods[key]) || fallback);

    const petsVal = Number(window.RSGame?.PetsPerks?.getSkillModifier?.(skillName, key, key === "successBonus" ? 0 : 1, activePlayer) || (key === "successBonus" ? 0 : 1));
    if (key === "successBonus") return magicVal + petsVal;
    return magicVal * petsVal;
  }

  function publishMagicPerksApi() {
    window.RSGame = window.RSGame || {};
    window.RSGame.MagicPerks = {
      getUnlockedPerks: (player) => getUnlockedMagicPerks(player || activePlayer).map((perk) => ({ ...perk })),
      getGeFillRateMultiplier: (player) => getMagicPerkModifiers(player || activePlayer).geFillRateMultiplier || 1,
      applyCoinRewardMultiplier: (amount, source, player) => applyCoinRewardMultiplier(amount, source, player || activePlayer),
      getSkillModifier: (skillName, key, fallback) => {
        const mods = getMagicPerkModifiers(activePlayer).skillMods[String(skillName || "")] || {};
        if (key === "successBonus") return Number(mods.successBonus) || 0;
        return Number(mods[key]) || fallback;
      }
    };
  }

  function skillLevel(skillName) {
    return Math.max(1, Number(activePlayer?.skills?.[skillName]?.level) || 1);
  }

  function addXp(skillName, amount) {
    const skill = activePlayer?.skills?.[skillName];
    if (!skill || amount <= 0) return;
    const boostedAmount = amount * getSkillModifier(skillName, "xpMultiplier", 1);

    if (typeof skill.addXP === "function") skill.addXP(boostedAmount);
    else if (typeof skill.gainXP === "function") skill.gainXP(boostedAmount);
    else if (typeof skill.addExperience === "function") skill.addExperience(boostedAmount);

    RSGame.Events?.emit?.("xpGain", { amount: boostedAmount, skill: skillName, source: "skillsSuite" });
    activePlayer.updateTotalLevel?.();
    RSGame.UI?.renderPlayerSummary?.(activePlayer);
    RSGame.UI?.renderSkills?.(activePlayer);
    refreshSkillSelectionHighlight();
  }

  function allSlots() {
    return activePlayer?.inventory?.getSlots?.() || activePlayer?.inventory?.slots || [];
  }


  function countItemByIdOrName(id, name) {
    return allSlots().reduce((sum, slot) => {
      if (!slot) return sum;
      if (String(slot.id) === String(id) || (name && String(slot.name).toLowerCase() === String(name).toLowerCase())) {
        return sum + Math.max(0, Number(slot.qty) || 0);
      }
      return sum;
    }, 0);
  }

  function hasAllInputs(inputs) {
    if (!Array.isArray(inputs) || !inputs.length) return true;
    return inputs.every((entry) => countItemByIdOrName(entry.id, entry.name) >= (Number(entry.qty) || 1));
  }

  function removeItemQty(id, qty, name) {
    let remaining = Math.max(0, Number(qty) || 0);
    if (remaining <= 0) return true;

    const slots = allSlots();
    for (let i = 0; i < slots.length && remaining > 0; i++) {
      const slot = slots[i];
      if (!slot) continue;
      if (String(slot.id) === String(id) || (name && String(slot.name).toLowerCase() === String(name).toLowerCase())) {
        const take = Math.min(remaining, Math.max(1, Number(slot.qty) || 1));
        slot.qty -= take;
        if (slot.qty <= 0) slots[i] = null;
        remaining -= take;
      }
    }
    return remaining <= 0;
  }

  function addItem(entry, category) {
    const skillName = String(category || "Skilling");
    const baseQty = Math.max(1, Number(entry.qty) || 1);
    const qty = entry.id === "coins"
      ? applyCoinRewardMultiplier(baseQty, "skills")
      : Math.max(1, Math.round(baseQty * getSkillModifier(skillName, "outputMultiplier", 1)));
    const chance = Number(entry.chance);
    if (Number.isFinite(chance) && chance > 0 && Math.random() > chance) {
      return true;
    }

    const added = !!activePlayer?.inventory?.addItem?.({
      id: entry.id,
      name: entry.name,
      qty,
      icon: itemIcon(entry.icon || "Coins_10000.png"),
      stackable: !!entry.stackable
    });
    if (added) {
      RSGame.Bank?.recordLegitimateObtain?.(activePlayer, {
        id: entry.id,
        name: entry.name,
        icon: itemIcon(entry.icon || "Coins_10000.png"),
        category: category || "Skilling"
      }, qty);
    }
    return added;
  }

  function getSuccessRate(action, level, skillName) {
    const success = action?.success;
    if (!success) return 1;

    const base = Math.max(0, Math.min(1, Number(success.base) || 0));
    const max = Math.max(base, Math.min(1, Number(success.max) || 1));
    const span = Math.max(1, Number(success.levelSpan) || 50);
    const delta = Math.max(0, Number(level) - (Number(action.level) || 1));
    const pct = Math.min(1, delta / span);
    return Math.max(0, Math.min(1, base + (max - base) * pct + getSkillModifier(skillName, "successBonus", 0)));
  }

  function applyActionTick(skillName, action) {
    if (!activePlayer || !action) return;

    if (!hasAllInputs(action.inputs)) {
      stopAction("Missing resources.");
      return;
    }

    const removed = [];
    if (Array.isArray(action.inputs)) {
      for (let i = 0; i < action.inputs.length; i++) {
        const input = action.inputs[i];
        const ok = removeItemQty(input.id, input.qty, input.name);
        if (!ok) {
          stopAction("Missing resources.");
          return;
        }
        removed.push(input);
      }
    }

    const level = skillLevel(skillName);
    const successRate = getSuccessRate(action, level, skillName);
    const didSucceed = Math.random() <= successRate;

    // --- Clue bottle drop for Redwood/Amethyst ---
    let clueDropSucceeded = false;
    let clueDropAttempted = false;
    try {
      if ((action.id === "wc_redwood" && skillName === "Woodcutting") || (action.id === "mine_amethyst" && skillName === "Mining")) {
        if (Math.random() < 1/50) {
          clueDropAttempted = true;
          const dropped = window.RSGame?.Clues?.trySkillingDrop?.(activePlayer, skillName, 1);
          if (dropped) {
            clueDropSucceeded = true;
            // clue bottle dropped (console log removed)
          } else {
            // clue bottle roll hit, but drop failed (console log removed)
          }
        }
      }
    } catch (e) {
      // error in clue bottle logic (console log removed)
    }
    // --- End clue bottle drop ---

    // Deliver outputs: always deliver the resource, and if clue drop succeeded, both
    if (didSucceed) {
      if (Array.isArray(action.outputs)) {
        for (let i = 0; i < action.outputs.length; i++) {
          const out = action.outputs[i];
          const ok = addItem(out, skillName);
          if (!ok) {
            removed.forEach((entry) => {
              activePlayer.inventory.addItem({
                id: entry.id,
                name: entry.id,
                qty: entry.qty,
                stackable: true
              });
            });
            stopAction("Inventory is full.");
            return;
          }
        }
      }
    } else {
      if (Array.isArray(action.fail)) {
        for (let i = 0; i < action.fail.length; i++) {
          const out = action.fail[i];
          const ok = addItem(out, skillName);
          if (!ok) {
            removed.forEach((entry) => {
              activePlayer.inventory.addItem({
                id: entry.id,
                name: entry.id,
                qty: entry.qty,
                stackable: true
              });
            });
            stopAction("Inventory is full.");
            return;
          }
        }
      }
    }

    if (!didSucceed) {
      if (actionStatusEl) {
        actionStatusEl.textContent = action.name + " failed.";
      }
      RSGame.UI?.renderInventory?.(activePlayer);
      renderSkillMenu();
      RSGame.Game?.saveNow?.();
      return;
    }

    addXp(skillName, Number(action.xp) || 0);
    RSGame.UI?.renderInventory?.(activePlayer);

    if (actionStatusEl) {
      actionStatusEl.textContent = action.name + " in progress...";
    }

    renderSkillMenu();
    RSGame.Game?.saveNow?.();
  }

  function stopAction(statusText) {
    if (actionTimer) {
      clearInterval(actionTimer);
      actionTimer = null;
    }
    activeAction = null;
    if (statusText && actionStatusEl) {
      actionStatusEl.textContent = statusText;
    }
    renderSkillMenu();
  }

  function startAction(skillName, action) {
    const level = skillLevel(skillName);
    if (level < (Number(action.level) || 1)) {
      if (actionStatusEl) actionStatusEl.textContent = "You need " + skillName + " level " + action.level + ".";
      return;
    }

    if (!hasAllInputs(action.inputs)) {
      if (actionStatusEl) actionStatusEl.textContent = "Missing resources for " + action.name + ".";
      return;
    }

    if (activeAction && activeAction.skillName === skillName && activeAction.actionId === action.id) {
      stopAction("Training stopped.");
      return;
    }

    stopAction("");
    activeAction = { skillName, actionId: action.id };

    const interval = Math.max(150, Math.round((Number(action.interval) || 2400) / getTimeScale()));
    actionTimer = setInterval(() => applyActionTick(skillName, action), interval);

    if (actionStatusEl) actionStatusEl.textContent = action.name + " started.";
    renderSkillMenu();
  }

  function getPatchState() {
    const state = activePlayer?.farmingPatches;
    if (!state || typeof state !== "object") {
      activePlayer.farmingPatches = {};
    }

    FARM_PATCHES.forEach((patch) => {
      if (!activePlayer.farmingPatches[patch.id]) {
        activePlayer.farmingPatches[patch.id] = {
          patchId: patch.id,
          type: patch.type,
          seedId: null,
          plantedAt: 0,
          readyAt: 0,
          harvested: false
        };
      }
    });

    return activePlayer.farmingPatches;
  }

  function findSeed(seedId) {
    return FARM_SEEDS.find((seed) => seed.id === seedId) || null;
  }

  function patchProgressText(patchState) {
    if (!patchState?.seedId) return "Empty";
    const seed = findSeed(patchState.seedId);
    if (!seed) return "Empty";

    const remaining = patchState.readyAt - now();
    if (remaining <= 0) return "Ready to harvest";

    const secs = Math.ceil(remaining / 1000);
    const min = Math.floor(secs / 60);
    const sec = secs % 60;
    return "Growing: " + String(min).padStart(2, "0") + ":" + String(sec).padStart(2, "0");
  }

  function harvestPatch(patch) {
    const state = getPatchState()[patch.id];
    if (!state?.seedId) return;

    const seed = findSeed(state.seedId);
    if (!seed) return;

    if (state.readyAt > now()) {
      if (actionStatusEl) actionStatusEl.textContent = patch.name + " is still growing.";
      return;
    }

    const minYield = seed.yield?.[0] || 3;
    const maxYield = seed.yield?.[1] || minYield;
    const baseQty = Math.max(minYield, Math.floor(Math.random() * (maxYield - minYield + 1)) + minYield);
    const qty = Math.max(1, Math.round(baseQty * getSkillModifier("Farming", "outputMultiplier", 1)));

    const ok = activePlayer.inventory.addItem({
      id: seed.produce.id,
      name: seed.produce.name,
      qty,
      icon: itemIcon(seed.produce.icon),
      stackable: true
    });

    if (!ok) {
      if (actionStatusEl) actionStatusEl.textContent = "Inventory is full.";
      return;
    }

    RSGame.Bank?.recordLegitimateObtain?.(activePlayer, {
      id: seed.produce.id,
      name: seed.produce.name,
      icon: itemIcon(seed.produce.icon),
      category: "Farming"
    }, qty);

    addXp("Farming", Number(seed.xpHarvest) || 0);

    state.seedId = null;
    state.plantedAt = 0;
    state.readyAt = 0;
    state.harvested = true;

    RSGame.UI?.renderInventory?.(activePlayer);
    renderSkillMenu();
    RSGame.Game?.saveNow?.();
  }

  function plantSeed(patch, seed) {
    const fLvl = skillLevel("Farming");
    if (fLvl < seed.level) {
      if (actionStatusEl) actionStatusEl.textContent = "Need Farming level " + seed.level + " for " + seed.name + ".";
      return;
    }

    if (countItemByIdOrName(seed.id) < 1) {
      if (actionStatusEl) actionStatusEl.textContent = "You need " + seed.name + ".";
      return;
    }

    const state = getPatchState()[patch.id];
    if (state.seedId) {
      if (actionStatusEl) actionStatusEl.textContent = patch.name + " is already planted.";
      return;
    }

    removeItemQty(seed.id, 1);

    const scale = getTimeScale();
    const adjustedGrow = Math.max(12000, Math.round(seed.growMs / scale));

    state.seedId = seed.id;
    state.plantedAt = now();
    state.readyAt = now() + adjustedGrow;
    state.harvested = false;

    addXp("Farming", Number(seed.xpPlant) || 0);
    RSGame.UI?.renderInventory?.(activePlayer);

    if (actionStatusEl) {
      actionStatusEl.textContent = "Planted " + seed.name + " in " + patch.name + ".";
    }

    renderSkillMenu();
    RSGame.Game?.saveNow?.();
  }

  function ensureFarmMenuEl() {
    if (farmingMenuEl) return farmingMenuEl;

    const el = document.createElement("ul");
    el.className = "skills-suite-menu";
    el.style.display = "none";
    document.body.appendChild(el);
    farmingMenuEl = el;

    document.addEventListener("click", () => {
      if (farmingMenuEl) farmingMenuEl.style.display = "none";
    }, { capture: true });

    return farmingMenuEl;
  }

  function showPatchSeedMenu(e, patch) {
    e.preventDefault();
    const menu = ensureFarmMenuEl();
    menu.innerHTML = "";

    const seeds = FARM_SEEDS.filter((seed) => seed.type === patch.type);
    const level = skillLevel("Farming");

    function getBankSeedQty(seedId) {
      const bankItems = activePlayer?.bank?.items || {};
      return Math.max(0, Number(bankItems?.[seedId]?.qty) || 0);
    }

    seeds.forEach((seed) => {
      const li = document.createElement("li");
      const canUse = level >= seed.level;
      li.className = canUse ? "" : "locked";
      const bankQty = getBankSeedQty(seed.id);
      li.textContent = seed.name + " (Lv " + seed.level + ") - Bank: " + bankQty;
      li.addEventListener("mousedown", (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        menu.style.display = "none";
        if (!canUse) return;
        plantSeed(patch, seed);
      });
      menu.appendChild(li);
    });

    menu.style.display = "block";
    menu.style.left = "0";
    menu.style.top = "0";
    const rect = menu.getBoundingClientRect();
    menu.style.left = Math.min(e.clientX, window.innerWidth - rect.width - 8) + "px";
    menu.style.top = Math.min(e.clientY, window.innerHeight - rect.height - 8) + "px";
  }

  function openCombatTab(skillName) {
    const combatTab = document.querySelector('.tab-btn[data-tab="combat"]');
    if (!combatTab) return;

    combatTab.click();

    const styleBySkill = {
      Attack: "Attack",
      Strength: "Strength",
      Defence: "Defence"
    };

    const style = styleBySkill[skillName];
    if (!style) return;

    setTimeout(() => {
      const btn = document.querySelector('#combat-style-btns .combat-style-btn[data-style="' + style + '"]');
      btn?.click?.();
    }, 0);
  }

  function renderSkillSelectionTabs() {
    // Intentionally no-op: skill selection happens from the main skills grid.
  }

  function setMenuOpen(open) {
    menuOpen = !!open;
    if (!uiRoot || !skillsGridEl) return;

    uiRoot.style.display = menuOpen ? "block" : "none";
    skillsGridEl.style.display = menuOpen ? "none" : "grid";
  }

  function closeMenu() {
    stopAction("");
    selectedSkill = null;
    setMenuOpen(false);
    refreshSkillSelectionHighlight();
  }

  function renderFarmingMenu() {
    const cfg = SKILL_MENUS.Farming;
    if (!uiRoot) return;

    const body = uiRoot.querySelector(".skills-suite-body");
    if (!body) return;

    const state = getPatchState();

    body.innerHTML = `
      <div class="skills-suite-note">${cfg.description}</div>
      <div class="farming-patch-grid"></div>
      <div class="skills-suite-status"></div>
    `;

    actionStatusEl = body.querySelector(".skills-suite-status");

    const grid = body.querySelector(".farming-patch-grid");
    FARM_PATCHES.forEach((patch) => {
      const patchState = state[patch.id];
      const seed = findSeed(patchState.seedId);
      const ready = !!seed && patchState.readyAt <= now();

      const card = document.createElement("div");
      card.className = "farming-patch-card" + (seed ? " planted" : "") + (ready ? " ready" : "");
      card.innerHTML = `
        <div class="farming-patch-name">${patch.name}</div>
        <div class="farming-patch-type">${PATCH_TYPES[patch.type]}</div>
        <div class="farming-patch-seed">${seed ? seed.name : "No seed planted"}</div>
        <div class="farming-patch-progress">${patchProgressText(patchState)}</div>
        <div class="farming-patch-hint">Right-click to plant seed</div>
      `;

      card.addEventListener("contextmenu", (e) => showPatchSeedMenu(e, patch));
      card.addEventListener("click", () => harvestPatch(patch));

      grid.appendChild(card);
    });
  }

  function renderActionsMenu(skillName) {
    const cfg = SKILL_MENUS[skillName];
    if (!cfg || !uiRoot) return;

    const body = uiRoot.querySelector(".skills-suite-body");
    if (!body) return;

    const level = skillLevel(skillName);
    const rows = cfg.actions || [];

    body.innerHTML = `
      <div class="skills-suite-note">${cfg.description}</div>
      <div class="skills-suite-card-grid"></div>
      <div class="skills-suite-status"></div>
    `;

    actionStatusEl = body.querySelector(".skills-suite-status");
    const wrap = body.querySelector(".skills-suite-card-grid");

    rows.forEach((action) => {
      const locked = level < (Number(action.level) || 1);
      const active = activeAction && activeAction.skillName === skillName && activeAction.actionId === action.id;
      const row = document.createElement("div");
      row.className = "skills-suite-card" + (locked ? " locked" : "") + (active ? " active" : "");

      const inputs = Array.isArray(action.inputs) && action.inputs.length
        ? action.inputs.map((x) => x.qty + "x " + x.id.replaceAll("_", " ")).join(", ")
        : "None";

      const outputs = Array.isArray(action.outputs) && action.outputs.length
        ? action.outputs.map((x) => x.qty + "x " + x.name).join(", ")
        : "XP only";

      const successPct = Math.round(getSuccessRate(action, level, skillName) * 100);
      const iconFile = action.displayIcon
        || action.outputs?.[0]?.icon
        || action.fail?.[0]?.icon
        || action.inputs?.[0]?.icon
        || "Coins_10000.png";

      row.innerHTML = `
        <div class="skills-suite-card-top">
          <div class="skills-suite-card-icon-wrap">
            <img src="${itemIcon(iconFile)}" alt="${action.name}" class="skills-suite-card-icon" />
          </div>
          <div class="skills-suite-card-title">${action.name}</div>
          <div class="skills-suite-card-badges">
            <span class="skills-suite-badge">Lv ${action.level}</span>
            <span class="skills-suite-badge">${action.xp} XP</span>
            <span class="skills-suite-badge">${(action.interval / 1000).toFixed(1)}s</span>
            <span class="skills-suite-badge">${successPct}%</span>
          </div>
        </div>
        <div class="skills-suite-card-io"><span>In:</span> ${inputs}</div>
        <div class="skills-suite-card-io"><span>Out:</span> ${outputs}</div>
        <div class="skills-suite-card-actions">
          <button type="button" class="skills-suite-run-btn">${active ? "Stop" : "Start"}</button>
          ${locked ? '<div class="skills-suite-lock">Requires level ' + action.level + '</div>' : ""}
        </div>
      `;

      const runBtn = row.querySelector(".skills-suite-run-btn");
      runBtn.disabled = locked;
      runBtn.addEventListener("click", () => startAction(skillName, action));

      wrap.appendChild(row);
    });

    if (skillName === "Magic") {
      const perkTitle = document.createElement("div");
      perkTitle.className = "skills-suite-note";
      perkTitle.textContent = "Passive spell unlocks";
      body.appendChild(perkTitle);

      const perkWrap = document.createElement("div");
      perkWrap.className = "skills-suite-card-grid";
      body.appendChild(perkWrap);

      const magicLevel = getMagicLevel();
      MAGIC_PASSIVE_PERKS.forEach((perk) => {
        const unlocked = magicLevel >= perk.level;
        const perkCard = document.createElement("div");
        perkCard.className = "skills-suite-card" + (unlocked ? "" : " locked");
        perkCard.innerHTML = `
          <div class="skills-suite-card-top">
            <div class="skills-suite-card-title">${perk.name}</div>
            <div class="skills-suite-card-badges">
              <span class="skills-suite-badge">Lv ${perk.level}</span>
              <span class="skills-suite-badge">${unlocked ? "Unlocked" : "Locked"}</span>
            </div>
          </div>
          <div class="skills-suite-card-io"><span>Effect:</span> ${perk.description}</div>
        `;
        perkWrap.appendChild(perkCard);
      });
    }
  }

  function renderSkillMenu() {
    if (!uiRoot) return;
    if (!selectedSkill || !SKILL_MENUS[selectedSkill]) return;

    const title = uiRoot.querySelector(".skills-suite-title");
    if (title) {
      title.textContent = selectedSkill + " Menu";
    }

    if (selectedSkill === "Farming") {
      renderFarmingMenu();
      return;
    }

    renderActionsMenu(selectedSkill);
  }

  function buildUi() {
    const panel = document.querySelector(".panel.skills-panel");
    if (!panel) return;

    skillsGridEl = document.getElementById("skills-grid");
    if (!skillsGridEl) return;

    let host = panel.querySelector(".skills-suite");
    if (!host) {
      host = document.createElement("section");
      host.className = "skills-suite";
      panel.insertBefore(host, skillsGridEl);
    }

    host.innerHTML = `
      <div class="skills-suite-head">
        <div class="skills-suite-head-top">
          <button type="button" class="skills-suite-back-btn">Back To Skills</button>
          <div class="skills-suite-title"></div>
        </div>
      </div>
      <div class="skills-suite-body"></div>
    `;

    uiRoot = host;
    const backBtn = uiRoot.querySelector(".skills-suite-back-btn");
    if (backBtn) {
      backBtn.addEventListener("click", () => closeMenu());
    }

    setMenuOpen(false);
    refreshSkillSelectionHighlight();
  }

  function refreshSkillSelectionHighlight() {
    const grid = document.getElementById("skills-grid");
    if (!grid) return;

    grid.querySelectorAll(".skill-cell").forEach((cell) => {
      const name = cell.dataset.skillName;
      const active = menuOpen && name === selectedSkill && !!SKILL_MENUS[name];
      cell.classList.toggle("selected", active);
      if (SKILL_MENUS[name]) {
        cell.classList.add("clickable");
      } else {
        cell.classList.remove("clickable");
      }
    });
  }

  function ensureStarterResources(player) {
    if (player.skillsSuiteStarterGranted) return;
    player.skillsSuiteStarterGranted = true;
  }

  function tickFarmingUi() {
    if (!menuOpen || selectedSkill !== "Farming") return;
    renderSkillMenu();
  }

  RSGame.Events?.on?.("skillMenuSelect", ({ skill } = {}) => {
    if (!skill) return;

    if (COMBAT_SKILLS.has(skill)) {
      closeMenu();
      openCombatTab(skill);
      return;
    }

    if (!SKILL_MENUS[skill]) return;
    selectedSkill = skill;
    setMenuOpen(true);
    stopAction("");
    renderSkillMenu();
    refreshSkillSelectionHighlight();
  });

  RSGame.Events?.on?.("gameSpeedChange", () => {
    if (!activeAction || !actionTimer) return;
    const skillName = activeAction.skillName;
    const cfg = SKILL_MENUS[skillName];
    const action = cfg?.actions?.find((row) => row.id === activeAction.actionId);
    if (!action) return;
    startAction(skillName, action);
  });

  function getHighestUnlockedAction(skillName) {
    const cfg = SKILL_MENUS[skillName];
    if (!cfg?.actions?.length) return null;

    const level = skillLevel(skillName);
    let highest = null;

    for (const action of cfg.actions) {
      if (level >= (Number(action.level) || 1)) {
        if (!highest || Number(action.level) > Number(highest.level)) {
          highest = action;
        }
      }
    }

    if (!highest) return null;
    if (!hasAllInputs(highest.inputs)) return null;
    return highest;
  }

  function autoProgressCurrentAction(skillName) {
    if (!window.Player?.autoSkillProgression) return;
    if (!activeAction || activeAction.skillName !== skillName) return;

    const cfg = SKILL_MENUS[skillName];
    if (!cfg?.actions?.length) return;

    const currentAction = cfg.actions.find((action) => action.id === activeAction.actionId);
    if (!currentAction) return;

    const nextAction = getHighestUnlockedAction(skillName);
    if (!nextAction || nextAction.id === currentAction.id) return;
    if (Number(nextAction.level) <= Number(currentAction.level)) return;

    startAction(skillName, nextAction);
    if (actionStatusEl) {
      actionStatusEl.textContent = `${nextAction.name} auto-selected.`;
    }
  }

  RSGame.Events?.on?.("xpGain", ({ skill }) => {
    if (typeof skill === "string") {
      const normalizedSkill = skill.charAt(0).toUpperCase() + skill.slice(1);
      autoProgressCurrentAction(normalizedSkill);
    }

    refreshSkillSelectionHighlight();
    if (uiRoot && menuOpen) {
      // Keep title/selection visuals fresh while menu is open.
      renderSkillMenu();
    }
  });

  RSGame.Game.registerMod({
    name: "Skills Suite",

    onGameInit(game) {
      activePlayer = game.player;
      ensureStarterResources(activePlayer);
      publishMagicPerksApi();
      buildUi();
      refreshSkillSelectionHighlight();

      if (farmingTickTimer) clearInterval(farmingTickTimer);
      farmingTickTimer = setInterval(tickFarmingUi, 1000);

      console.log("[Skills Suite] Menus, locks, and inter-skill resource loops enabled.");
    }
  });
})();
