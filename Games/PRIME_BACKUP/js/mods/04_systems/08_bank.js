window.RSGame = window.RSGame || {};

(function () {
  const MAX_STACK_QTY = 2147483647;
  const COINS_PER_PLAT_TOKEN = 1000;
  const PLAT_TOKENS_PER_DIVINE_TOKEN = 100_000; // 100,000 platinum tokens
  const COINS_PER_DIVINE_TOKEN = 1_000_000_000; // 1 billion coins

  function isUnlimitedStackItem(itemId) {
    return String(itemId || "") === "platinum_token" || String(itemId || "") === "divine_token";
  }

  function wikiIcon(file) {
    return "https://oldschool.runescape.wiki/images/thumb/" + file + "/32px-" + file;
  }

  function normalizePlatinumTokenIcon(icon) {
    const value = String(icon || "");
    if (!value) return wikiIcon("Platinum_token_detail.png");
    if (value.includes("Platinum_token_detail.png")) return value;
    if (value.includes("Platinum_token.png")) return wikiIcon("Platinum_token_detail.png");
    return value;
  }

  const BANK_CATALOG = [
    { id: "coins", name: "Coins", icon: wikiIcon("Coins_10000.png"), category: "General" },
    { id: "platinum_token", name: "Platinum token", icon: "https://oldschool.runescape.wiki/images/thumb/Platinum_token_detail.png/32px-Platinum_token_detail.png", category: "General" },
    { id: "divine_token", name: "Divine token", icon: wikiIcon("Platinum_token_detail.png") + "#glowy-yellow", category: "General" }, // TODO: Replace with actual glowy yellow effect
    { id: "bronze_sword", name: "Bronze Sword", icon: wikiIcon("Bronze_sword.png"), category: "Attack" },
    { id: "bronze_pickaxe", name: "Bronze Pickaxe", icon: wikiIcon("Bronze_pickaxe.png"), category: "Mining" },
    { id: "knife", name: "Knife", icon: wikiIcon("Knife.png"), category: "Fletching" },
    { id: "bow_string", name: "Bow string", icon: wikiIcon("Bow_string.png"), category: "Fletching" },
    { id: "tinderbox", name: "Tinderbox", icon: wikiIcon("Tinderbox.png"), category: "Firemaking" },
    { id: "small_fishing_net", name: "Small Fishing Net", icon: wikiIcon("Small_fishing_net.png"), category: "Fishing" },
    { id: "normal_log", name: "Logs", icon: wikiIcon("Logs.png"), category: "Woodcutting" },
    { id: "oak_log", name: "Oak Logs", icon: wikiIcon("Oak_logs.png"), category: "Woodcutting" },
    { id: "willow_log", name: "Willow Logs", icon: wikiIcon("Willow_logs.png"), category: "Woodcutting" },
    { id: "maple_log", name: "Maple Logs", icon: wikiIcon("Maple_logs.png"), category: "Woodcutting" },
    { id: "yew_log", name: "Yew Logs", icon: wikiIcon("Yew_logs.png"), category: "Woodcutting" },
    { id: "blisterwood_log", name: "Blisterwood Logs", icon: wikiIcon("Blisterwood_logs.png"), category: "Woodcutting" },
    { id: "magic_log", name: "Magic Logs", icon: wikiIcon("Magic_logs.png"), category: "Woodcutting" },
    { id: "redwood_log", name: "Redwood Logs", icon: wikiIcon("Redwood_logs.png"), category: "Woodcutting" },
    { id: "normal_shortbow_u", name: "Shortbow (u)", icon: wikiIcon("Shortbow_(u).png"), category: "Fletching" },
    { id: "normal_longbow_u", name: "Longbow (u)", icon: wikiIcon("Longbow_(u).png"), category: "Fletching" },
    { id: "oak_shortbow_u", name: "Oak shortbow (u)", icon: wikiIcon("Oak_shortbow_(u).png"), category: "Fletching" },
    { id: "oak_longbow_u", name: "Oak longbow (u)", icon: wikiIcon("Oak_longbow_(u).png"), category: "Fletching" },
    { id: "willow_shortbow_u", name: "Willow shortbow (u)", icon: wikiIcon("Willow_shortbow_(u).png"), category: "Fletching" },
    { id: "willow_longbow_u", name: "Willow longbow (u)", icon: wikiIcon("Willow_longbow_(u).png"), category: "Fletching" },
    { id: "maple_shortbow_u", name: "Maple shortbow (u)", icon: wikiIcon("Maple_shortbow_(u).png"), category: "Fletching" },
    { id: "maple_longbow_u", name: "Maple longbow (u)", icon: wikiIcon("Maple_longbow_(u).png"), category: "Fletching" },
    { id: "yew_shortbow_u", name: "Yew shortbow (u)", icon: wikiIcon("Yew_shortbow_(u).png"), category: "Fletching" },
    { id: "yew_longbow_u", name: "Yew longbow (u)", icon: wikiIcon("Yew_longbow_(u).png"), category: "Fletching" },
    { id: "magic_shortbow_u", name: "Magic shortbow (u)", icon: wikiIcon("Magic_shortbow_(u).png"), category: "Fletching" },
    { id: "magic_longbow_u", name: "Magic longbow (u)", icon: wikiIcon("Magic_longbow_(u).png"), category: "Fletching" },
    { id: "normal_shortbow", name: "Shortbow", icon: wikiIcon("Shortbow.png"), category: "Fletching" },
    { id: "normal_longbow", name: "Longbow", icon: wikiIcon("Longbow.png"), category: "Fletching" },
    { id: "oak_shortbow", name: "Oak shortbow", icon: wikiIcon("Oak_shortbow.png"), category: "Fletching" },
    { id: "oak_longbow", name: "Oak longbow", icon: wikiIcon("Oak_longbow.png"), category: "Fletching" },
    { id: "willow_shortbow", name: "Willow shortbow", icon: wikiIcon("Willow_shortbow.png"), category: "Fletching" },
    { id: "willow_longbow", name: "Willow longbow", icon: wikiIcon("Willow_longbow.png"), category: "Fletching" },
    { id: "maple_shortbow", name: "Maple shortbow", icon: wikiIcon("Maple_shortbow.png"), category: "Fletching" },
    { id: "maple_longbow", name: "Maple longbow", icon: wikiIcon("Maple_longbow.png"), category: "Fletching" },
    { id: "yew_shortbow", name: "Yew shortbow", icon: wikiIcon("Yew_shortbow.png"), category: "Fletching" },
    { id: "yew_longbow", name: "Yew longbow", icon: wikiIcon("Yew_longbow.png"), category: "Fletching" },
    { id: "magic_shortbow", name: "Magic shortbow", icon: wikiIcon("Magic_shortbow.png"), category: "Fletching" },
    { id: "magic_longbow", name: "Magic longbow", icon: wikiIcon("Magic_longbow.png"), category: "Fletching" },
    { id: "copper_ore", name: "Copper Ore", icon: wikiIcon("Copper_ore.png"), category: "Mining" },
    { id: "tin_ore", name: "Tin Ore", icon: wikiIcon("Tin_ore.png"), category: "Mining" },
    { id: "iron_ore", name: "Iron Ore", icon: wikiIcon("Iron_ore.png"), category: "Mining" },
    { id: "silver_ore", name: "Silver Ore", icon: wikiIcon("Silver_ore.png"), category: "Mining" },
    { id: "coal", name: "Coal", icon: wikiIcon("Coal.png"), category: "Mining" },
    { id: "gold_ore", name: "Gold Ore", icon: wikiIcon("Gold_ore.png"), category: "Mining" },
    { id: "mithril_ore", name: "Mithril Ore", icon: wikiIcon("Mithril_ore.png"), category: "Mining" },
    { id: "adamantite_ore", name: "Adamantite Ore", icon: wikiIcon("Adamantite_ore.png"), category: "Mining" },
    { id: "runite_ore", name: "Runite Ore", icon: wikiIcon("Runite_ore.png"), category: "Mining" },
    { id: "amethyst", name: "Amethyst", icon: wikiIcon("Amethyst.png"), category: "Mining" },
    { id: "raw_shrimp", name: "Raw Shrimps", icon: wikiIcon("Raw_shrimps.png"), category: "Fishing" },
    { id: "raw_sardine", name: "Raw Sardine", icon: wikiIcon("Raw_sardine.png"), category: "Fishing" },
    { id: "raw_herring", name: "Raw Herring", icon: wikiIcon("Raw_herring.png"), category: "Fishing" },
    { id: "raw_anchovies", name: "Raw Anchovies", icon: wikiIcon("Raw_anchovies.png"), category: "Fishing" },
    { id: "raw_trout", name: "Raw Trout", icon: wikiIcon("Raw_trout.png"), category: "Fishing" },
    { id: "raw_salmon", name: "Raw Salmon", icon: wikiIcon("Raw_salmon.png"), category: "Fishing" },
    { id: "raw_tuna", name: "Raw Tuna", icon: wikiIcon("Raw_tuna.png"), category: "Fishing" },
    { id: "raw_lobster", name: "Raw Lobster", icon: wikiIcon("Raw_lobster.png"), category: "Fishing" },
    { id: "raw_swordfish", name: "Raw Swordfish", icon: wikiIcon("Raw_swordfish.png"), category: "Fishing" },
    { id: "raw_monkfish", name: "Raw Monkfish", icon: wikiIcon("Raw_monkfish.png"), category: "Fishing" },
    { id: "raw_karambwan", name: "Raw Karambwan", icon: wikiIcon("Raw_karambwan.png"), category: "Fishing" },
    { id: "raw_shark", name: "Raw Shark", icon: wikiIcon("Raw_shark.png"), category: "Fishing" },
    { id: "raw_anglerfish", name: "Raw Anglerfish", icon: wikiIcon("Raw_anglerfish.png"), category: "Fishing" },
    { id: "raw_dark_crab", name: "Raw Dark Crab", icon: wikiIcon("Raw_dark_crab.png"), category: "Fishing" },
    { id: "sacred_eel", name: "Sacred Eel", icon: wikiIcon("Sacred_eel.png"), category: "Fishing" },

    { id: "clue_bottle_easy", name: "Clue bottle (easy)", icon: wikiIcon("Clue_bottle_(easy).png"), category: "Clues - Easy" },
    { id: "clue_casket_easy", name: "Clue casket (easy)", icon: wikiIcon("Clue_scroll_(easy).png"), category: "Clues - Easy" },
    { id: "black_armour_set_lg", name: "Black armour set (lg)", icon: wikiIcon("Black_armour_set_(lg).png"), category: "Clues - Easy" },
    { id: "black_full_helm_g", name: "Black full helm (g)", icon: wikiIcon("Black_full_helm_(g).png"), category: "Clues - Easy" },
    { id: "black_platebody_g", name: "Black platebody (g)", icon: wikiIcon("Black_platebody_(g).png"), category: "Clues - Easy" },
    { id: "black_platelegs_g", name: "Black platelegs (g)", icon: wikiIcon("Black_platelegs_(g).png"), category: "Clues - Easy" },
    { id: "black_kiteshield_g", name: "Black kiteshield (g)", icon: wikiIcon("Black_kiteshield_(g).png"), category: "Clues - Easy" },
    { id: "wizard_robe_g", name: "Wizard robe (g)", icon: wikiIcon("Wizard_robe_(g).png"), category: "Clues - Easy" },
    { id: "wizard_hat_g", name: "Wizard hat (g)", icon: wikiIcon("Wizard_hat_(g).png"), category: "Clues - Easy" },
    { id: "monk_robe_top_g", name: "Monk robe top (g)", icon: wikiIcon("Monk%27s_robe_top_(g).png"), category: "Clues - Easy" },
    { id: "monk_robe_g", name: "Monk robe (g)", icon: wikiIcon("Monk%27s_robe_(g).png"), category: "Clues - Easy" },
    { id: "amulet_of_power_t", name: "Amulet of power (t)", icon: wikiIcon("Amulet_of_power_(t).png"), category: "Clues - Easy" },

    { id: "clue_bottle_medium", name: "Clue bottle (medium)", icon: wikiIcon("Clue_bottle_(medium).png"), category: "Clues - Medium" },
    { id: "clue_casket_medium", name: "Clue casket (medium)", icon: wikiIcon("Clue_scroll_(medium).png"), category: "Clues - Medium" },
    { id: "ranger_boots", name: "Ranger boots", icon: wikiIcon("Ranger_boots.png"), category: "Clues - Medium" },
    { id: "wizard_boots", name: "Wizard boots", icon: wikiIcon("Wizard_boots.png"), category: "Clues - Medium" },
    { id: "holy_sandals", name: "Holy sandals", icon: wikiIcon("Holy_sandals.png"), category: "Clues - Medium" },
    { id: "adamant_armour_set_lg", name: "Adamant armour set (lg)", icon: wikiIcon("Adamant_armour_set_(lg).png"), category: "Clues - Medium" },
    { id: "adamant_full_helm_g", name: "Adamant full helm (g)", icon: wikiIcon("Adamant_full_helm_(g).png"), category: "Clues - Medium" },
    { id: "adamant_platebody_g", name: "Adamant platebody (g)", icon: wikiIcon("Adamant_platebody_(g).png"), category: "Clues - Medium" },
    { id: "adamant_platelegs_g", name: "Adamant platelegs (g)", icon: wikiIcon("Adamant_platelegs_(g).png"), category: "Clues - Medium" },
    { id: "adamant_kiteshield_g", name: "Adamant kiteshield (g)", icon: wikiIcon("Adamant_kiteshield_(g).png"), category: "Clues - Medium" },
    { id: "mithril_full_helm_t", name: "Mithril full helm (t)", icon: wikiIcon("Mithril_full_helm_(t).png"), category: "Clues - Medium" },
    { id: "mithril_platebody_t", name: "Mithril platebody (t)", icon: wikiIcon("Mithril_platebody_(t).png"), category: "Clues - Medium" },

    { id: "clue_bottle_hard", name: "Clue bottle (hard)", icon: wikiIcon("Clue_bottle_(hard).png"), category: "Clues - Hard" },
    { id: "clue_casket_hard", name: "Clue casket (hard)", icon: wikiIcon("Clue_scroll_(hard).png"), category: "Clues - Hard" },
    { id: "robin_hood_hat", name: "Robin hood hat", icon: wikiIcon("Robin_hood_hat.png"), category: "Clues - Hard" },
    { id: "rune_armour_set_lg", name: "Rune armour set (lg)", icon: wikiIcon("Rune_armour_set_(lg).png"), category: "Clues - Hard" },
    { id: "rune_full_helm_g", name: "Rune full helm (g)", icon: wikiIcon("Rune_full_helm_(g).png"), category: "Clues - Hard" },
    { id: "rune_platebody_g", name: "Rune platebody (g)", icon: wikiIcon("Rune_platebody_(g).png"), category: "Clues - Hard" },
    { id: "rune_platelegs_g", name: "Rune platelegs (g)", icon: wikiIcon("Rune_platelegs_(g).png"), category: "Clues - Hard" },
    { id: "rune_kiteshield_g", name: "Rune kiteshield (g)", icon: wikiIcon("Rune_kiteshield_(g).png"), category: "Clues - Hard" },
    { id: "bandos_dhide_body", name: "Bandos d'hide body", icon: wikiIcon("Bandos_d%27hide_body.png"), category: "Clues - Hard" },
    { id: "guthix_dhide_body", name: "Guthix d'hide body", icon: wikiIcon("Guthix_d%27hide_body.png"), category: "Clues - Hard" },
    { id: "saradomin_dhide_body", name: "Saradomin d'hide body", icon: wikiIcon("Saradomin_d%27hide_body.png"), category: "Clues - Hard" },
    { id: "zamorak_dhide_body", name: "Zamorak d'hide body", icon: wikiIcon("Zamorak_d%27hide_body.png"), category: "Clues - Hard" },

    { id: "clue_bottle_elite", name: "Clue bottle (elite)", icon: wikiIcon("Clue_bottle_(elite).png"), category: "Clues - Elite" },
    { id: "clue_casket_elite", name: "Clue casket (elite)", icon: wikiIcon("Clue_scroll_(elite).png"), category: "Clues - Elite" },
    { id: "gilded_armour_set_lg", name: "Gilded armour set (lg)", icon: wikiIcon("Gilded_armour_set_(lg).png"), category: "Clues - Elite" },
    { id: "gilded_full_helm", name: "Gilded full helm", icon: wikiIcon("Gilded_full_helm.png"), category: "Clues - Elite" },
    { id: "gilded_platebody", name: "Gilded platebody", icon: wikiIcon("Gilded_platebody.png"), category: "Clues - Elite" },
    { id: "gilded_platelegs", name: "Gilded platelegs", icon: wikiIcon("Gilded_platelegs.png"), category: "Clues - Elite" },
    { id: "gilded_kiteshield", name: "Gilded kiteshield", icon: wikiIcon("Gilded_kiteshield.png"), category: "Clues - Elite" },
    { id: "third_age_range_top", name: "3rd age range top", icon: wikiIcon("3rd_age_range_top.png"), category: "Clues - Elite" },
    { id: "third_age_range_legs", name: "3rd age range legs", icon: wikiIcon("3rd_age_range_legs.png"), category: "Clues - Elite" },
    { id: "third_age_robe_top", name: "3rd age robe top", icon: wikiIcon("3rd_age_robe_top.png"), category: "Clues - Elite" },
    { id: "third_age_robe", name: "3rd age robe", icon: wikiIcon("3rd_age_robe.png"), category: "Clues - Elite" },
    { id: "third_age_mage_hat", name: "3rd age mage hat", icon: wikiIcon("3rd_age_mage_hat.png"), category: "Clues - Elite" },

    { id: "clue_bottle_master", name: "Clue bottle (master)", icon: wikiIcon("Clue_bottle_(master).png"), category: "Clues - Master" },
    { id: "clue_casket_master", name: "Clue casket (master)", icon: wikiIcon("Clue_scroll_(master).png"), category: "Clues - Master" },
    { id: "third_age_pickaxe", name: "3rd age pickaxe", icon: wikiIcon("3rd_age_pickaxe.png"), category: "Clues - Master" },
    { id: "third_age_axe", name: "3rd age axe", icon: wikiIcon("3rd_age_axe.png"), category: "Clues - Master" },
    { id: "third_age_longsword", name: "3rd age longsword", icon: wikiIcon("3rd_age_longsword.png"), category: "Clues - Master" },
    { id: "third_age_wand", name: "3rd age wand", icon: wikiIcon("3rd_age_wand.png"), category: "Clues - Master" },
    { id: "third_age_bow", name: "3rd age bow", icon: wikiIcon("3rd_age_bow.png"), category: "Clues - Master" },
    { id: "samurai_kasa", name: "Samurai kasa", icon: wikiIcon("Samurai_kasa.png"), category: "Clues - Master" },
    { id: "samurai_shirt", name: "Samurai shirt", icon: wikiIcon("Samurai_shirt.png"), category: "Clues - Master" },
    { id: "samurai_gloves", name: "Samurai gloves", icon: wikiIcon("Samurai_gloves.png"), category: "Clues - Master" },
    { id: "samurai_greaves", name: "Samurai greaves", icon: wikiIcon("Samurai_greaves.png"), category: "Clues - Master" },

    // Boss Drops
    { id: "dragonbone_necklace",    name: "Dragonbone necklace",    icon: wikiIcon("Dragonbone_necklace.png"),          category: "Boss Drops" },
    { id: "primordial_crystal",     name: "Primordial crystal",     icon: wikiIcon("Primordial_crystal.png"),           category: "Boss Drops" },
    { id: "pegasian_crystal",       name: "Pegasian crystal",       icon: wikiIcon("Pegasian_crystal.png"),             category: "Boss Drops" },
    { id: "eternal_crystal",        name: "Eternal crystal",        icon: wikiIcon("Eternal_crystal.png"),              category: "Boss Drops" },
    { id: "smouldering_stone",      name: "Smouldering stone",      icon: wikiIcon("Smouldering_stone.png"),            category: "Boss Drops" },
    { id: "hydras_claw",            name: "Hydra's claw",           icon: wikiIcon("Hydra%27s_claw.png"),               category: "Boss Drops" },
    { id: "hydras_leather",         name: "Hydra leather",          icon: wikiIcon("Hydra_leather.png"),                category: "Boss Drops" },
    { id: "hydras_fang",            name: "Hydra's fang",           icon: wikiIcon("Hydra%27s_fang.png"),               category: "Boss Drops" },
    { id: "bandos_chestplate",      name: "Bandos chestplate",      icon: wikiIcon("Bandos_chestplate.png"),            category: "Boss Drops" },
    { id: "bandos_tassets",         name: "Bandos tassets",         icon: wikiIcon("Bandos_tassets.png"),               category: "Boss Drops" },
    { id: "bandos_hilt",            name: "Bandos hilt",            icon: wikiIcon("Bandos_hilt.png"),                  category: "Boss Drops" },
    { id: "armadyl_chestplate",     name: "Armadyl chestplate",     icon: wikiIcon("Armadyl_chestplate.png"),           category: "Boss Drops" },
    { id: "armadyl_chainskirt",     name: "Armadyl chainskirt",     icon: wikiIcon("Armadyl_chainskirt.png"),           category: "Boss Drops" },
    { id: "armadyl_hilt",           name: "Armadyl hilt",           icon: wikiIcon("Armadyl_hilt.png"),                 category: "Boss Drops" },
    { id: "zamorakian_spear",       name: "Zamorakian spear",       icon: wikiIcon("Zamorakian_spear.png"),             category: "Boss Drops" },
    { id: "staff_of_the_dead",      name: "Staff of the dead",      icon: wikiIcon("Staff_of_the_dead.png"),            category: "Boss Drops" },
    { id: "zamorak_hilt",           name: "Zamorak hilt",           icon: wikiIcon("Zamorak_hilt.png"),                 category: "Boss Drops" },
    { id: "inquisitors_great_helm", name: "Inquisitor's great helm", icon: wikiIcon("Inquisitor%27s_great_helm.png"), category: "Boss Drops" },
    { id: "inquisitors_hauberk",    name: "Inquisitor's hauberk",   icon: wikiIcon("Inquisitor%27s_hauberk.png"),       category: "Boss Drops" },
    { id: "inquisitors_plateskirt", name: "Inquisitor's plateskirt", icon: wikiIcon("Inquisitor%27s_plateskirt.png"), category: "Boss Drops" },
    { id: "inquisitors_mace",       name: "Inquisitor's mace",      icon: wikiIcon("Inquisitor%27s_mace.png"),          category: "Boss Drops" },
    { id: "inquisitors_armour_set", name: "Inquisitor's armour set", icon: wikiIcon("Inquisitor%27s_armour_set.png"), category: "Boss Drops" },
    { id: "nightmare_staff",        name: "Nightmare staff",        icon: wikiIcon("Nightmare_staff.png"),              category: "Boss Drops" },
    { id: "torva_full_helm",        name: "Torva full helm",        icon: wikiIcon("Torva_full_helm.png"),              category: "Boss Drops" },
    { id: "torva_platebody",        name: "Torva platebody",        icon: wikiIcon("Torva_platebody.png"),              category: "Boss Drops" },
    { id: "torva_platelegs",        name: "Torva platelegs",        icon: wikiIcon("Torva_platelegs.png"),              category: "Boss Drops" },
    { id: "torva_armour_set",       name: "Torva armour set",       icon: wikiIcon("Torva_armour_set.png"),             category: "Boss Drops" },
    { id: "zaryte_crossbow",        name: "Zaryte crossbow",        icon: wikiIcon("Zaryte_crossbow.png"),              category: "Boss Drops" },
    { id: "elysian_sigil",          name: "Elysian sigil",          icon: wikiIcon("Elysian_sigil.png"),                category: "Boss Drops" },
    { id: "spectral_sigil",         name: "Spectral sigil",         icon: wikiIcon("Spectral_sigil.png"),               category: "Boss Drops" },
    { id: "arcane_sigil",           name: "Arcane sigil",           icon: wikiIcon("Arcane_sigil.png"),                 category: "Boss Drops" },
    { id: "armadyl_crossbow",       name: "Armadyl crossbow",       icon: wikiIcon("Armadyl_crossbow.png"),             category: "Boss Drops" },
    { id: "saradomin_hilt",         name: "Saradomin hilt",         icon: wikiIcon("Saradomin_hilt.png"),               category: "Boss Drops" },
    { id: "saradomin_sword",        name: "Saradomin sword",        icon: wikiIcon("Saradomin_sword.png"),              category: "Boss Drops" },
    { id: "occult_necklace",        name: "Occult necklace",        icon: wikiIcon("Occult_necklace.png"),              category: "Boss Drops" },
    { id: "dragon_chainbody",       name: "Dragon chainbody",       icon: wikiIcon("Dragon_chainbody.png"),             category: "Boss Drops" },
    { id: "smoke_battlestaff",      name: "Smoke battlestaff",      icon: wikiIcon("Smoke_battlestaff.png"),            category: "Boss Drops" },
    { id: "voidwaker_blade",        name: "Voidwaker blade",        icon: wikiIcon("Voidwaker_blade.png"),              category: "Boss Drops" },
    { id: "voidwaker_hilt",         name: "Voidwaker hilt",         icon: wikiIcon("Voidwaker_hilt.png"),               category: "Boss Drops" },
    { id: "dragon_pickaxe",         name: "Dragon pickaxe",         icon: wikiIcon("Dragon_pickaxe.png"),               category: "Boss Drops" },
    { id: "scurrius_spine",         name: "Scurrius spine",         icon: wikiIcon("Scurrius_spine.png"),               category: "Boss Drops" },
    { id: "hueycoatl_hide",         name: "Hueycoatl hide",         icon: wikiIcon("Blue_dragonhide.png"),              category: "Boss Drops" },
    { id: "hueycoatl_spike",        name: "Hueycoatl spike",        icon: wikiIcon("Dragon_bones.png"),                 category: "Boss Drops" },
    { id: "3rd_age_amulet",         name: "3rd age amulet",         icon: wikiIcon("3rd_age_amulet.png"),               category: "Clues - Master" },
    { id: "ring_of_3rd_age",        name: "Ring of 3rd age",        icon: wikiIcon("Ring_of_3rd_age.png"),              category: "Clues - Master" }
  ];

  const CATALOG_BY_ID = Object.fromEntries(BANK_CATALOG.map((item) => [item.id, item]));
  const LOG_TRACK_CATEGORIES = new Set([
    "Clues - Easy", "Clues - Medium", "Clues - Hard", "Clues - Elite", "Clues - Master",
    "Boss Drops", "Combat Drops", "Raids", "Pest Control", "Barbarian Assault", "Minigames", "Pets"
  ]);
  const LOG_SECTIONS_DEF = [
    { title: "Bosses",         categories: ["Boss Drops", "Combat Drops"] },
    { title: "Raids",          categories: ["Raids"] },
    { title: "Clues - Easy",   categories: ["Clues - Easy"] },
    { title: "Clues - Medium", categories: ["Clues - Medium"] },
    { title: "Clues - Hard",   categories: ["Clues - Hard"] },
    { title: "Clues - Elite",  categories: ["Clues - Elite"] },
    { title: "Clues - Master", categories: ["Clues - Master"] },
    { title: "Minigames",      categories: ["Pest Control", "Barbarian Assault", "Minigames"] },
    { title: "Pets",           categories: ["Pets"] }
  ];
  const EQUIPPABLE_ITEM_META = {
    bronze_sword: {
      slot: "weapon",
      bonuses: {
        "Stab": 5,
        "Slash": 7,
        "Melee Strength": 4,
        "Stab Defence": 1,
        "Slash Defence": 2
      }
    }
  };
  const BANK_TAB_COUNT = 15;
  const FIRST_BANK_TAB = 1;
  const AUTOSORT_DEBOUNCE_MS = 300;
  const AUTOSORT_MIN_SCORE = 4;
  const ARMOR_SET_DEFS = [
    // Bronze
    {
      id: "bronze_armour_set_lg",
      name: "Bronze armour set (lg)",
      icon: wikiIcon("Bronze_armour_set_(lg).png"),
      category: "General",
      aliases: ["bronze_armour_set_lg", "bronze armour set (lg)"],
      components: ["bronze_full_helm", "bronze_platebody", "bronze_platelegs", "bronze_kiteshield"],
      componentNames: ["Bronze full helm", "Bronze platebody", "Bronze platelegs", "Bronze kiteshield"]
    },
    {
      id: "bronze_armour_set_sk",
      name: "Bronze armour set (sk)",
      icon: wikiIcon("Bronze_armour_set_(sk).png"),
      category: "General",
      aliases: ["bronze_armour_set_sk", "bronze armour set (sk)"],
      components: ["bronze_full_helm", "bronze_platebody", "bronze_plateskirt", "bronze_kiteshield"],
      componentNames: ["Bronze full helm", "Bronze platebody", "Bronze plateskirt", "Bronze kiteshield"]
    },
    // Iron
    {
      id: "iron_armour_set_lg",
      name: "Iron armour set (lg)",
      icon: wikiIcon("Iron_armour_set_(lg).png"),
      category: "General",
      aliases: ["iron_armour_set_lg", "iron armour set (lg)"],
      components: ["iron_full_helm", "iron_platebody", "iron_platelegs", "iron_kiteshield"],
      componentNames: ["Iron full helm", "Iron platebody", "Iron platelegs", "Iron kiteshield"]
    },
    {
      id: "iron_armour_set_sk",
      name: "Iron armour set (sk)",
      icon: wikiIcon("Iron_armour_set_(sk).png"),
      category: "General",
      aliases: ["iron_armour_set_sk", "iron armour set (sk)"],
      components: ["iron_full_helm", "iron_platebody", "iron_plateskirt", "iron_kiteshield"],
      componentNames: ["Iron full helm", "Iron platebody", "Iron plateskirt", "Iron kiteshield"]
    },
    // Steel
    {
      id: "steel_armour_set_lg",
      name: "Steel armour set (lg)",
      icon: wikiIcon("Steel_armour_set_(lg).png"),
      category: "General",
      aliases: ["steel_armour_set_lg", "steel armour set (lg)"],
      components: ["steel_full_helm", "steel_platebody", "steel_platelegs", "steel_kiteshield"],
      componentNames: ["Steel full helm", "Steel platebody", "Steel platelegs", "Steel kiteshield"]
    },
    {
      id: "steel_armour_set_sk",
      name: "Steel armour set (sk)",
      icon: wikiIcon("Steel_armour_set_(sk).png"),
      category: "General",
      aliases: ["steel_armour_set_sk", "steel armour set (sk)"],
      components: ["steel_full_helm", "steel_platebody", "steel_plateskirt", "steel_kiteshield"],
      componentNames: ["Steel full helm", "Steel platebody", "Steel plateskirt", "Steel kiteshield"]
    },
    // Black
    {
      id: "black_armour_set_lg",
      name: "Black armour set (lg)",
      icon: wikiIcon("Black_armour_set_(lg).png"),
      category: "Clues - Easy",
      aliases: ["black_armour_set_lg", "black armour set (lg)"],
      components: ["black_full_helm", "black_platebody", "black_platelegs", "black_kiteshield"],
      componentNames: ["Black full helm", "Black platebody", "Black platelegs", "Black kiteshield"]
    },
    {
      id: "black_armour_set_sk",
      name: "Black armour set (sk)",
      icon: wikiIcon("Black_armour_set_(sk).png"),
      category: "Clues - Easy",
      aliases: ["black_armour_set_sk", "black armour set (sk)"],
      components: ["black_full_helm", "black_platebody", "black_plateskirt", "black_kiteshield"],
      componentNames: ["Black full helm", "Black platebody", "Black plateskirt", "Black kiteshield"]
    },
    // Mithril
    {
      id: "mithril_armour_set_lg",
      name: "Mithril armour set (lg)",
      icon: wikiIcon("Mithril_armour_set_(lg).png"),
      category: "General",
      aliases: ["mithril_armour_set_lg", "mithril armour set (lg)"],
      components: ["mithril_full_helm", "mithril_platebody", "mithril_platelegs", "mithril_kiteshield"],
      componentNames: ["Mithril full helm", "Mithril platebody", "Mithril platelegs", "Mithril kiteshield"]
    },
    {
      id: "mithril_armour_set_sk",
      name: "Mithril armour set (sk)",
      icon: wikiIcon("Mithril_armour_set_(sk).png"),
      category: "General",
      aliases: ["mithril_armour_set_sk", "mithril armour set (sk)"],
      components: ["mithril_full_helm", "mithril_platebody", "mithril_plateskirt", "mithril_kiteshield"],
      componentNames: ["Mithril full helm", "Mithril platebody", "Mithril plateskirt", "Mithril kiteshield"]
    },
    // Adamant
    {
      id: "adamant_armour_set_lg",
      name: "Adamant armour set (lg)",
      icon: wikiIcon("Adamant_armour_set_(lg).png"),
      category: "Clues - Medium",
      aliases: ["adamant_armour_set_lg", "adamant armour set (lg)"],
      components: ["adamant_full_helm", "adamant_platebody", "adamant_platelegs", "adamant_kiteshield"],
      componentNames: ["Adamant full helm", "Adamant platebody", "Adamant platelegs", "Adamant kiteshield"]
    },
    {
      id: "adamant_armour_set_sk",
      name: "Adamant armour set (sk)",
      icon: wikiIcon("Adamant_armour_set_(sk).png"),
      category: "Clues - Medium",
      aliases: ["adamant_armour_set_sk", "adamant armour set (sk)"],
      components: ["adamant_full_helm", "adamant_platebody", "adamant_plateskirt", "adamant_kiteshield"],
      componentNames: ["Adamant full helm", "Adamant platebody", "Adamant plateskirt", "Adamant kiteshield"]
    },
    // Rune
    {
      id: "rune_armour_set_lg",
      name: "Rune armour set (lg)",
      icon: wikiIcon("Rune_armour_set_(lg).png"),
      category: "Clues - Hard",
      aliases: ["rune_armour_set_lg", "rune armour set (lg)"],
      components: ["rune_full_helm", "rune_platebody", "rune_platelegs", "rune_kiteshield"],
      componentNames: ["Rune full helm", "Rune platebody", "Rune platelegs", "Rune kiteshield"]
    },
    {
      id: "rune_armour_set_sk",
      name: "Rune armour set (sk)",
      icon: wikiIcon("Rune_armour_set_(sk).png"),
      category: "Clues - Hard",
      aliases: ["rune_armour_set_sk", "rune armour set (sk)"],
      components: ["rune_full_helm", "rune_platebody", "rune_plateskirt", "rune_kiteshield"],
      componentNames: ["Rune full helm", "Rune platebody", "Rune plateskirt", "Rune kiteshield"]
    },
    // Gilded
    {
      id: "gilded_armour_set_lg",
      name: "Gilded armour set (lg)",
      icon: wikiIcon("Gilded_armour_set_(lg).png"),
      category: "Clues - Elite",
      aliases: ["gilded_armour_set_lg", "gilded armour set (lg)"],
      components: ["gilded_full_helm", "gilded_platebody", "gilded_platelegs", "gilded_kiteshield"],
      componentNames: ["Gilded full helm", "Gilded platebody", "Gilded platelegs", "Gilded kiteshield"]
    },
    {
      id: "gilded_armour_set_sk",
      name: "Gilded armour set (sk)",
      icon: wikiIcon("Gilded_armour_set_(sk).png"),
      category: "Clues - Elite",
      aliases: ["gilded_armour_set_sk", "gilded armour set (sk)"],
      components: ["gilded_full_helm", "gilded_platebody", "gilded_plateskirt", "gilded_kiteshield"],
      componentNames: ["Gilded full helm", "Gilded platebody", "Gilded plateskirt", "Gilded kiteshield"]
    },
    // Dragon
    {
      id: "dragon_armour_set_lg",
      name: "Dragon armour set (lg)",
      icon: wikiIcon("Dragon_armour_set_(lg).png"),
      category: "General",
      aliases: ["dragon_armour_set_lg", "dragon armour set (lg)"],
      components: ["dragon_full_helm", "dragon_platebody", "dragon_platelegs", "dragon_kiteshield"],
      componentNames: ["Dragon full helm", "Dragon platebody", "Dragon platelegs", "Dragon kiteshield"]
    },
    {
      id: "dragon_armour_set_sk",
      name: "Dragon armour set (sk)",
      icon: wikiIcon("Dragon_armour_set_(sk).png"),
      category: "General",
      aliases: ["dragon_armour_set_sk", "dragon armour set (sk)"],
      components: ["dragon_full_helm", "dragon_platebody", "dragon_plateskirt", "dragon_kiteshield"],
      componentNames: ["Dragon full helm", "Dragon platebody", "Dragon plateskirt", "Dragon kiteshield"]
    },
    // Inquisitor's
    {
      id: "inquisitors_armour_set",
      name: "Inquisitor's armour set",
      icon: wikiIcon("Inquisitor%27s_armour_set.png"),
      category: "Boss Drops",
      aliases: ["inquisitors_armour_set", "inquisitor's armour set"],
      components: ["inquisitors_great_helm", "inquisitors_hauberk", "inquisitors_plateskirt"],
      componentNames: ["Inquisitor's great helm", "Inquisitor's hauberk", "Inquisitor's plateskirt"]
    },
    // Torva
    {
      id: "torva_armour_set",
      name: "Torva armour set",
      icon: wikiIcon("Torva_armour_set.png"),
      category: "Boss Drops",
      aliases: ["torva_armour_set", "torva armour set"],
      components: ["torva_full_helm", "torva_platebody", "torva_platelegs"],
      componentNames: ["Torva full helm", "Torva platebody", "Torva platelegs"]
    }
    ,
    // God sets (Saradomin, Guthix, Zamorak, Ancient, Armadyl, Bandos)
    {
      id: "saradomin_armour_set_lg",
      name: "Saradomin armour set (lg)",
      icon: wikiIcon("Saradomin_armour_set_(lg).png"),
      category: "Clues - Hard",
      aliases: ["saradomin_armour_set_lg", "saradomin armour set (lg)"],
      components: ["saradomin_full_helm", "saradomin_platebody", "saradomin_platelegs", "saradomin_kiteshield"],
      componentNames: ["Saradomin full helm", "Saradomin platebody", "Saradomin platelegs", "Saradomin kiteshield"]
    },
    {
      id: "saradomin_armour_set_sk",
      name: "Saradomin armour set (sk)",
      icon: wikiIcon("Saradomin_armour_set_(sk).png"),
      category: "Clues - Hard",
      aliases: ["saradomin_armour_set_sk", "saradomin armour set (sk)"],
      components: ["saradomin_full_helm", "saradomin_platebody", "saradomin_plateskirt", "saradomin_kiteshield"],
      componentNames: ["Saradomin full helm", "Saradomin platebody", "Saradomin plateskirt", "Saradomin kiteshield"]
    },
    {
      id: "guthix_armour_set_lg",
      name: "Guthix armour set (lg)",
      icon: wikiIcon("Guthix_armour_set_(lg).png"),
      category: "Clues - Hard",
      aliases: ["guthix_armour_set_lg", "guthix armour set (lg)"],
      components: ["guthix_full_helm", "guthix_platebody", "guthix_platelegs", "guthix_kiteshield"],
      componentNames: ["Guthix full helm", "Guthix platebody", "Guthix platelegs", "Guthix kiteshield"]
    },
    {
      id: "guthix_armour_set_sk",
      name: "Guthix armour set (sk)",
      icon: wikiIcon("Guthix_armour_set_(sk).png"),
      category: "Clues - Hard",
      aliases: ["guthix_armour_set_sk", "guthix armour set (sk)"],
      components: ["guthix_full_helm", "guthix_platebody", "guthix_plateskirt", "guthix_kiteshield"],
      componentNames: ["Guthix full helm", "Guthix platebody", "Guthix plateskirt", "Guthix kiteshield"]
    },
    {
      id: "zamorak_armour_set_lg",
      name: "Zamorak armour set (lg)",
      icon: wikiIcon("Zamorak_armour_set_(lg).png"),
      category: "Clues - Hard",
      aliases: ["zamorak_armour_set_lg", "zamorak armour set (lg)"],
      components: ["zamorak_full_helm", "zamorak_platebody", "zamorak_platelegs", "zamorak_kiteshield"],
      componentNames: ["Zamorak full helm", "Zamorak platebody", "Zamorak platelegs", "Zamorak kiteshield"]
    },
    {
      id: "zamorak_armour_set_sk",
      name: "Zamorak armour set (sk)",
      icon: wikiIcon("Zamorak_armour_set_(sk).png"),
      category: "Clues - Hard",
      aliases: ["zamorak_armour_set_sk", "zamorak armour set (sk)"],
      components: ["zamorak_full_helm", "zamorak_platebody", "zamorak_plateskirt", "zamorak_kiteshield"],
      componentNames: ["Zamorak full helm", "Zamorak platebody", "Zamorak plateskirt", "Zamorak kiteshield"]
    },
    {
      id: "ancient_armour_set_lg",
      name: "Ancient armour set (lg)",
      icon: wikiIcon("Ancient_armour_set_(lg).png"),
      category: "Clues - Hard",
      aliases: ["ancient_armour_set_lg", "ancient armour set (lg)"],
      components: ["ancient_full_helm", "ancient_platebody", "ancient_platelegs", "ancient_kiteshield"],
      componentNames: ["Ancient full helm", "Ancient platebody", "Ancient platelegs", "Ancient kiteshield"]
    },
    {
      id: "ancient_armour_set_sk",
      name: "Ancient armour set (sk)",
      icon: wikiIcon("Ancient_armour_set_(sk).png"),
      category: "Clues - Hard",
      aliases: ["ancient_armour_set_sk", "ancient armour set (sk)"],
      components: ["ancient_full_helm", "ancient_platebody", "ancient_plateskirt", "ancient_kiteshield"],
      componentNames: ["Ancient full helm", "Ancient platebody", "Ancient plateskirt", "Ancient kiteshield"]
    },
    {
      id: "armadyl_armour_set_lg",
      name: "Armadyl armour set (lg)",
      icon: wikiIcon("Armadyl_armour_set_(lg).png"),
      category: "Clues - Hard",
      aliases: ["armadyl_armour_set_lg", "armadyl armour set (lg)"],
      components: ["armadyl_helmet", "armadyl_platebody", "armadyl_platelegs", "armadyl_kiteshield"],
      componentNames: ["Armadyl helmet", "Armadyl platebody", "Armadyl platelegs", "Armadyl kiteshield"]
    },
    {
      id: "armadyl_armour_set_sk",
      name: "Armadyl armour set (sk)",
      icon: wikiIcon("Armadyl_armour_set_(sk).png"),
      category: "Clues - Hard",
      aliases: ["armadyl_armour_set_sk", "armadyl armour set (sk)"],
      components: ["armadyl_helmet", "armadyl_platebody", "armadyl_plateskirt", "armadyl_kiteshield"],
      componentNames: ["Armadyl helmet", "Armadyl platebody", "Armadyl plateskirt", "Armadyl kiteshield"]
    },
    {
      id: "bandos_armour_set_lg",
      name: "Bandos armour set (lg)",
      icon: wikiIcon("Bandos_armour_set_(lg).png"),
      category: "Clues - Hard",
      aliases: ["bandos_armour_set_lg", "bandos armour set (lg)"],
      components: ["bandos_full_helm", "bandos_platebody", "bandos_platelegs", "bandos_kiteshield"],
      componentNames: ["Bandos full helm", "Bandos platebody", "Bandos platelegs", "Bandos kiteshield"]
    },
    {
      id: "bandos_armour_set_sk",
      name: "Bandos armour set (sk)",
      icon: wikiIcon("Bandos_armour_set_(sk).png"),
      category: "Clues - Hard",
      aliases: ["bandos_armour_set_sk", "bandos armour set (sk)"],
      components: ["bandos_full_helm", "bandos_platebody", "bandos_plateskirt", "bandos_kiteshield"],
      componentNames: ["Bandos full helm", "Bandos platebody", "Bandos plateskirt", "Bandos kiteshield"]
    },
    // Barrows sets
    {
      id: "ahrims_armour_set",
      name: "Ahrim's armour set",
      icon: wikiIcon("Ahrim%27s_armour_set.png"),
      category: "Boss Drops",
      aliases: ["ahrims_armour_set", "ahrim's armour set"],
      components: ["ahrims_hood", "ahrims_robetop", "ahrims_robeskirt", "ahrims_staff"],
      componentNames: ["Ahrim's hood", "Ahrim's robetop", "Ahrim's robeskirt", "Ahrim's staff"]
    },
    {
      id: "dharoks_armour_set",
      name: "Dharok's armour set",
      icon: wikiIcon("Dharok%27s_armour_set.png"),
      category: "Boss Drops",
      aliases: ["dharoks_armour_set", "dharok's armour set"],
      components: ["dharoks_helm", "dharoks_platebody", "dharoks_platelegs", "dharoks_greataxe"],
      componentNames: ["Dharok's helm", "Dharok's platebody", "Dharok's platelegs", "Dharok's greataxe"]
    },
    {
      id: "guthans_armour_set",
      name: "Guthan's armour set",
      icon: wikiIcon("Guthan%27s_armour_set.png"),
      category: "Boss Drops",
      aliases: ["guthans_armour_set", "guthan's armour set"],
      components: ["guthans_helm", "guthans_platebody", "guthans_chainskirt", "guthans_warspear"],
      componentNames: ["Guthan's helm", "Guthan's platebody", "Guthan's chainskirt", "Guthan's warspear"]
    },
    {
      id: "karils_armour_set",
      name: "Karil's armour set",
      icon: wikiIcon("Karil%27s_armour_set.png"),
      category: "Boss Drops",
      aliases: ["karils_armour_set", "karil's armour set"],
      components: ["karils_coif", "karils_leathertop", "karils_leatherskirt", "karils_crossbow"],
      componentNames: ["Karil's coif", "Karil's leathertop", "Karil's leatherskirt", "Karil's crossbow"]
    },
    {
      id: "torags_armour_set",
      name: "Torag's armour set",
      icon: wikiIcon("Torag%27s_armour_set.png"),
      category: "Boss Drops",
      aliases: ["torags_armour_set", "torag's armour set"],
      components: ["torags_helm", "torags_platebody", "torags_platelegs", "torags_hammers"],
      componentNames: ["Torag's helm", "Torag's platebody", "Torag's platelegs", "Torag's hammers"]
    },
    {
      id: "veracs_armour_set",
      name: "Verac's armour set",
      icon: wikiIcon("Verac%27s_armour_set.png"),
      category: "Boss Drops",
      aliases: ["veracs_armour_set", "verac's armour set"],
      components: ["veracs_helm", "veracs_brassard", "veracs_plateskirt", "veracs_flail"],
      componentNames: ["Verac's helm", "Verac's brassard", "Verac's plateskirt", "Verac's flail"]
    },
    // Void sets
    {
      id: "void_knight_set",
      name: "Void knight set",
      icon: wikiIcon("Void_knight_top.png"),
      category: "Minigames",
      aliases: ["void_knight_set", "void knight set"],
      components: ["void_knight_top", "void_knight_robe", "void_knight_gloves", "void_knight_helm_melee"],
      componentNames: ["Void knight top", "Void knight robe", "Void knight gloves", "Void melee helm"]
    },
    {
      id: "elite_void_knight_set",
      name: "Elite void knight set",
      icon: wikiIcon("Elite_void_knight_top.png"),
      category: "Minigames",
      aliases: ["elite_void_knight_set", "elite void knight set"],
      components: ["elite_void_knight_top", "elite_void_knight_robe", "void_knight_gloves", "void_knight_helm_melee"],
      componentNames: ["Elite void knight top", "Elite void knight robe", "Void knight gloves", "Void melee helm"]
    },
    // Proselyte set
    {
      id: "proselyte_armour_set",
      name: "Proselyte armour set",
      icon: wikiIcon("Proselyte_hauberk.png"),
      category: "General",
      aliases: ["proselyte_armour_set", "proselyte armour set"],
      components: ["proselyte_sallet", "proselyte_hauberk", "proselyte_cuisse", "proselyte_tasset"],
      componentNames: ["Proselyte sallet", "Proselyte hauberk", "Proselyte cuisse", "Proselyte tasset"]
    }
    ,
    // Blessed d'hide sets
    {
      id: "saradomin_dhide_set",
      name: "Saradomin d'hide set",
      icon: wikiIcon("Saradomin_d%27hide_set.png"),
      category: "Clues - Hard",
      aliases: ["saradomin_dhide_set", "saradomin d'hide set"],
      components: ["saradomin_coif", "saradomin_dhide_body", "saradomin_dhide_chaps", "saradomin_bracers", "saradomin_dhide_boots"],
      componentNames: ["Saradomin coif", "Saradomin d'hide body", "Saradomin d'hide chaps", "Saradomin bracers", "Saradomin d'hide boots"]
    },
    {
      id: "guthix_dhide_set",
      name: "Guthix d'hide set",
      icon: wikiIcon("Guthix_d%27hide_set.png"),
      category: "Clues - Hard",
      aliases: ["guthix_dhide_set", "guthix d'hide set"],
      components: ["guthix_coif", "guthix_dhide_body", "guthix_dhide_chaps", "guthix_bracers", "guthix_dhide_boots"],
      componentNames: ["Guthix coif", "Guthix d'hide body", "Guthix d'hide chaps", "Guthix bracers", "Guthix d'hide boots"]
    },
    {
      id: "zamorak_dhide_set",
      name: "Zamorak d'hide set",
      icon: wikiIcon("Zamorak_d%27hide_set.png"),
      category: "Clues - Hard",
      aliases: ["zamorak_dhide_set", "zamorak d'hide set"],
      components: ["zamorak_coif", "zamorak_dhide_body", "zamorak_dhide_chaps", "zamorak_bracers", "zamorak_dhide_boots"],
      componentNames: ["Zamorak coif", "Zamorak d'hide body", "Zamorak d'hide chaps", "Zamorak bracers", "Zamorak d'hide boots"]
    },
    {
      id: "ancient_dhide_set",
      name: "Ancient d'hide set",
      icon: wikiIcon("Ancient_d%27hide_set.png"),
      category: "Clues - Hard",
      aliases: ["ancient_dhide_set", "ancient d'hide set"],
      components: ["ancient_coif", "ancient_dhide_body", "ancient_dhide_chaps", "ancient_bracers", "ancient_dhide_boots"],
      componentNames: ["Ancient coif", "Ancient d'hide body", "Ancient d'hide chaps", "Ancient bracers", "Ancient d'hide boots"]
    },
    {
      id: "armadyl_dhide_set",
      name: "Armadyl d'hide set",
      icon: wikiIcon("Armadyl_d%27hide_set.png"),
      category: "Clues - Hard",
      aliases: ["armadyl_dhide_set", "armadyl d'hide set"],
      components: ["armadyl_coif", "armadyl_dhide_body", "armadyl_dhide_chaps", "armadyl_bracers", "armadyl_dhide_boots"],
      componentNames: ["Armadyl coif", "Armadyl d'hide body", "Armadyl d'hide chaps", "Armadyl bracers", "Armadyl d'hide boots"]
    },
    {
      id: "bandos_dhide_set",
      name: "Bandos d'hide set",
      icon: wikiIcon("Bandos_d%27hide_set.png"),
      category: "Clues - Hard",
      aliases: ["bandos_dhide_set", "bandos d'hide set"],
      components: ["bandos_coif", "bandos_dhide_body", "bandos_dhide_chaps", "bandos_bracers", "bandos_dhide_boots"],
      componentNames: ["Bandos coif", "Bandos d'hide body", "Bandos d'hide chaps", "Bandos bracers", "Bandos d'hide boots"]
    },
    // Trimmed and gold-trimmed sets (example: rune)
    {
      id: "rune_trimmed_set_lg",
      name: "Rune trimmed set (lg)",
      icon: wikiIcon("Rune_trimmed_set_(lg).png"),
      category: "Clues - Hard",
      aliases: ["rune_trimmed_set_lg", "rune trimmed set (lg)"],
      components: ["rune_full_helm_t", "rune_platebody_t", "rune_platelegs_t", "rune_kiteshield_t"],
      componentNames: ["Rune full helm (t)", "Rune platebody (t)", "Rune platelegs (t)", "Rune kiteshield (t)"]
    },
    {
      id: "rune_gold_trimmed_set_lg",
      name: "Rune gold-trimmed set (lg)",
      icon: wikiIcon("Rune_gold-trimmed_set_(lg).png"),
      category: "Clues - Hard",
      aliases: ["rune_gold_trimmed_set_lg", "rune gold-trimmed set (lg)"],
      components: ["rune_full_helm_g", "rune_platebody_g", "rune_platelegs_g", "rune_kiteshield_g"],
      componentNames: ["Rune full helm (g)", "Rune platebody (g)", "Rune platelegs (g)", "Rune kiteshield (g)"]
    },
    // Crystal set
    {
      id: "crystal_armour_set",
      name: "Crystal armour set",
      icon: wikiIcon("Crystal_armour_set.png"),
      category: "General",
      aliases: ["crystal_armour_set", "crystal armour set"],
      components: ["crystal_helmet", "crystal_body", "crystal_legs"],
      componentNames: ["Crystal helmet", "Crystal body", "Crystal legs"]
    },
    // Justiciar set
    {
      id: "justiciar_armour_set",
      name: "Justiciar armour set",
      icon: wikiIcon("Justiciar_armour_set.png"),
      category: "Boss Drops",
      aliases: ["justiciar_armour_set", "justiciar armour set"],
      components: ["justiciar_faceguard", "justiciar_chestguard", "justiciar_legguards"],
      componentNames: ["Justiciar faceguard", "Justiciar chestguard", "Justiciar legguards"]
    }
    ,
    // Halloween mask set
    {
      id: "halloween_mask_set",
      name: "Halloween mask set",
      icon: wikiIcon("Halloween_mask_set.png"),
      category: "General",
      aliases: ["halloween_mask_set", "halloween mask set"],
      components: [
        "1055", // blue halloween mask
        "1053", // green halloween mask
        "1057"  // red halloween mask
      ],
      componentNames: [
        "Blue halloween mask",
        "Green halloween mask",
        "Red halloween mask"
      ]
    }
    // Add more as needed for full OSRS set coverage
    // Add more sets as needed (e.g., blessed d'hide, trimmed, gold-trimmed, crystal, justiciar, inquisitor, etc.)
  ];

  function ensureBankState(player) {
    if (!player.bank || typeof player.bank !== "object") player.bank = {};
    if (!player.bank.items || typeof player.bank.items !== "object") player.bank.items = {};
    if (!player.bank.log   || typeof player.bank.log   !== "object") player.bank.log   = {};
    if (!Array.isArray(player.bank.tabs) || player.bank.tabs.length !== BANK_TAB_COUNT) {
      const ex = Array.isArray(player.bank.tabs) ? player.bank.tabs : [];
      player.bank.tabs = ex.slice(0, BANK_TAB_COUNT).concat(Array(Math.max(0, BANK_TAB_COUNT - ex.length)).fill(""));
    }
    if (typeof player.bank.activeTab !== "number") player.bank.activeTab = FIRST_BANK_TAB;
    player.bank.activeTab = Math.max(FIRST_BANK_TAB, Math.min(BANK_TAB_COUNT, Number(player.bank.activeTab) || FIRST_BANK_TAB));
    player.bank.withdrawAsNote   = !!player.bank.withdrawAsNote;
    player.bank.showPlaceholders = !!player.bank.showPlaceholders;
    if (typeof player.bank.autoSortEnabled !== "boolean") player.bank.autoSortEnabled = true;
    if (player.bank.sortMode !== "stack-value" && player.bank.sortMode !== "name") player.bank.sortMode = "custom";
    if (!player.bank.autoSortProfiles || typeof player.bank.autoSortProfiles !== "object") {
      player.bank.autoSortProfiles = {};
    }
    if (!player.bank.manualTabItems || typeof player.bank.manualTabItems !== "object") {
      player.bank.manualTabItems = {};
    }
    for (let i = FIRST_BANK_TAB; i <= BANK_TAB_COUNT; i++) {
      const row = player.bank.autoSortProfiles[i];
      if (!row || typeof row !== "object") {
        player.bank.autoSortProfiles[i] = { weights: {}, movesIn: 0, movesOut: 0 };
      } else if (!row.weights || typeof row.weights !== "object") {
        row.weights = {};
      }
    }

    let nextSort = 0;
    BANK_CATALOG.forEach((item) => {
      const existing = player.bank.items[item.id] || {};
      let icon = existing.icon || item.icon;
      if (item.id === "platinum_token") icon = normalizePlatinumTokenIcon(icon);
      if (item.id.startsWith("clue_casket_") && String(icon || "").includes("Casket_(")) icon = item.icon;
      let tab = (typeof existing.tab === "number") ? existing.tab : FIRST_BANK_TAB;
      if (tab === 0) tab = FIRST_BANK_TAB;
      tab = Math.max(FIRST_BANK_TAB, Math.min(BANK_TAB_COUNT, Number(tab) || FIRST_BANK_TAB));
      const sortIdx = (typeof existing.sortIdx === "number") ? existing.sortIdx : (nextSort += 10);
      player.bank.items[item.id] = {
        id:         item.id,
        name:       existing.name     || item.name,
        icon,
        category:   existing.category || item.category,
        qty:        Math.max(0, Number(existing.qty) || 0),
        discovered: !!existing.discovered,
        trackInLog: shouldTrackInLog(item.id, existing.category || item.category),
        tab,
        sortIdx
      };
    });

    let maxSort = Object.values(player.bank.items).reduce((m, i) => Math.max(m, (i && typeof i.sortIdx === "number") ? i.sortIdx : 0), 0);
    Object.values(player.bank.items).forEach((entry) => {
      if (!entry || !entry.id) return;
      if (typeof entry.tab !== "number") entry.tab = FIRST_BANK_TAB;
      if (entry.tab === 0) entry.tab = FIRST_BANK_TAB;
      entry.tab = Math.max(FIRST_BANK_TAB, Math.min(BANK_TAB_COUNT, Number(entry.tab) || FIRST_BANK_TAB));
      if (typeof entry.sortIdx !== "number") entry.sortIdx = (maxSort += 10);
      entry.trackInLog = shouldTrackInLog(entry.id, entry.category);
      if (entry.id === "steel_arrow"   && String(entry.icon || "").includes("Steel_arrow.png"))   entry.icon = wikiIcon("Steel_arrow_5.png");
      if (entry.id === "adamant_arrow" && String(entry.icon || "").includes("Adamant_arrow.png")) entry.icon = wikiIcon("Adamant_arrow_5.png");
      if (entry.id === "rune_arrow"    && String(entry.icon || "").includes("Rune_arrow.png"))    entry.icon = wikiIcon("Rune_arrow_5.png");
      if (entry.id === "platinum_token") entry.icon = normalizePlatinumTokenIcon(entry.icon);
    });
  }

  function normalizeItemNameKey(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/armor/g, "armour")
      .replace(/[^a-z0-9]/g, "")
      .trim();
  }

  function normalizeItemIdKey(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/armor/g, "armour")
      .replace(/[^a-z0-9_]/g, "")
      .trim();
  }

  function resolveArmorSet(itemLike) {
    // Try id against aliases first (catalog items with snake_case ids)
    const idKey = normalizeItemIdKey(itemLike?.id || "");
    if (idKey) {
      const byId = ARMOR_SET_DEFS.find((def) =>
        def.aliases.some((alias) => normalizeItemIdKey(alias) === idKey)
      );
      if (byId) return byId;
    }
    // Fallback: match by item name (Drop Party / GE items carry numeric OSRS ids)
    const nameKey = normalizeItemNameKey(itemLike?.name || "");
    if (nameKey) {
      return ARMOR_SET_DEFS.find((def) => normalizeItemNameKey(def.name || "") === nameKey) || null;
    }
    return null;
  }

  function getBankKeyForSlot(slot) {
    if (!slot) return null;
    return getCatalogIdForSlot(slot) || slot.id || null;
  }

  function inferCategoryForItem(item) {
    const lowerName = String(item?.name || "").toLowerCase();
    const lowerId = String(item?.id || "").toLowerCase();

    if (lowerId.includes("clue") || lowerName.includes("clue") || lowerName.includes("casket")) {
      if (lowerId.includes("master") || lowerName.includes("master")) return "Clues - Master";
      if (lowerId.includes("elite") || lowerName.includes("elite")) return "Clues - Elite";
      if (lowerId.includes("hard") || lowerName.includes("hard")) return "Clues - Hard";
      if (lowerId.includes("medium") || lowerName.includes("medium")) return "Clues - Medium";
      return "Clues - Easy";
    }

    if (lowerId.includes("log") || lowerName.includes("log")) return "Woodcutting";
    if (lowerId.includes("ore") || lowerName.includes("ore") || lowerId.includes("amethyst")) return "Mining";
    if (lowerId.includes("raw_") || lowerName.includes("raw ") || lowerName.includes("fish")) return "Fishing";
    if (lowerId.includes("bow") || lowerName.includes("bow") || lowerName.includes("arrow") || lowerName.includes("fletch")) return "Fletching";
    if (lowerId.includes("sword") || lowerName.includes("helm") || lowerName.includes("plate") || lowerName.includes("shield") || lowerName.includes("boots")) return "Attack";
    return "General";
  }

  function shouldTrackInLog(itemId, category) {
    return LOG_TRACK_CATEGORIES.has(String(category || ""));
  }

  function getItemSortTags(itemLike) {
    const id = String(itemLike?.id || "").toLowerCase();
    const name = String(itemLike?.name || "").toLowerCase();
    const category = String(itemLike?.category || inferCategoryForItem(itemLike) || "General");
    const tags = new Set();

    tags.add("cat:" + category.toLowerCase());

    const melee = /(sword|scimitar|plate|helm|kiteshield|defender|warhammer|axe|mace|2h|boots|gauntlet|melee|attack|strength|defence)/;
    const magic = /(staff|wand|robe|magic|mystic|rune|wizard|ancient|occult|hat)/;
    const ranged = /(bow|arrow|bolt|dhide|ranging|crossbow|ava|quiver|ranger)/;

    if (melee.test(id) || melee.test(name)) tags.add("style:melee");
    if (magic.test(id) || magic.test(name)) tags.add("style:magic");
    if (ranged.test(id) || ranged.test(name)) tags.add("style:ranged");

    const idParts = id.split("_").filter(Boolean).slice(0, 2);
    idParts.forEach((part) => tags.add("id:" + part));
    return Array.from(tags);
  }

  function getAutoSortProfile(player, tabIndex) {
    ensureBankState(player);
    const tab = Math.max(FIRST_BANK_TAB, Math.min(BANK_TAB_COUNT, Number(tabIndex) || FIRST_BANK_TAB));
    if (!player.bank.autoSortProfiles[tab] || typeof player.bank.autoSortProfiles[tab] !== "object") {
      player.bank.autoSortProfiles[tab] = { weights: {}, movesIn: 0, movesOut: 0 };
    }
    const row = player.bank.autoSortProfiles[tab];
    if (!row.weights || typeof row.weights !== "object") row.weights = {};
    return row;
  }

  function learnFromManualMove(player, itemLike, fromTab, toTab) {
    ensureBankState(player);
    if (!player.bank.autoSortEnabled) return;
    const src = Math.max(FIRST_BANK_TAB, Math.min(BANK_TAB_COUNT, Number(fromTab) || FIRST_BANK_TAB));
    const dst = Math.max(FIRST_BANK_TAB, Math.min(BANK_TAB_COUNT, Number(toTab) || FIRST_BANK_TAB));
    if (src === dst) return;

    const tags = getItemSortTags(itemLike);
    const inProfile = getAutoSortProfile(player, dst);
    const outProfile = getAutoSortProfile(player, src);

    tags.forEach((tag) => {
      inProfile.weights[tag] = (Number(inProfile.weights[tag]) || 0) + 2;
      outProfile.weights[tag] = (Number(outProfile.weights[tag]) || 0) - 1;
    });

    inProfile.movesIn = (Number(inProfile.movesIn) || 0) + 1;
    outProfile.movesOut = (Number(outProfile.movesOut) || 0) + 1;
  }

  function getAutoSortScoreForTab(player, itemLike, tabIndex) {
    const profile = getAutoSortProfile(player, tabIndex);
    const tags = getItemSortTags(itemLike);
    return tags.reduce((sum, tag) => sum + (Number(profile.weights[tag]) || 0), 0);
  }

  function isManualTabItem(player, itemId) {
    ensureBankState(player);
    return !!player.bank.manualTabItems[String(itemId || "")];
  }

  function markManualTabItem(player, itemId, enabled) {
    ensureBankState(player);
    const key = String(itemId || "");
    if (!key) return;
    if (enabled) player.bank.manualTabItems[key] = true;
    else delete player.bank.manualTabItems[key];
  }

  function getStoredTabForItem(player, itemId, fallbackTab) {
    ensureBankState(player);
    const fallback = Math.max(FIRST_BANK_TAB, Math.min(BANK_TAB_COUNT, Number(fallbackTab) || FIRST_BANK_TAB));
    const entry = player.bank.items?.[itemId];
    if (!entry) return fallback;
    const hasStoredPlacement = !!entry.discovered || (Number(entry.qty) || 0) > 0 || !!player.bank.log?.[itemId]?.firstTime || isManualTabItem(player, itemId);
    if (!hasStoredPlacement) return fallback;
    return Math.max(FIRST_BANK_TAB, Math.min(BANK_TAB_COUNT, Number(entry.tab) || fallback));
  }

  function destroyAllInventoryItem(player, slotIndex) {
    const index = Number(slotIndex);
    const slot = player?.inventory?.slots?.[index];
    if (!slot) return { ok: false, message: "Nothing to destroy." };
    const key = getBankKeyForSlot(slot) || slot.id;
    const name = slot.name || key;
    const total = (player.inventory?.slots || []).reduce((sum, current) => {
      if (!current) return sum;
      const currentKey = getBankKeyForSlot(current) || current.id;
      if (currentKey !== key) return sum;
      return sum + Math.max(0, Number(current.qty) || 0);
    }, 0);
    if (total <= 0) return { ok: false, message: "Nothing to destroy." };
    const confirmed = window.confirm("Destroy all " + total.toLocaleString() + " x " + name + " from inventory?");
    if (!confirmed) return { ok: false, message: "Destroy cancelled." };

    const slots = player.inventory?.slots || [];
    for (let i = 0; i < slots.length; i++) {
      const current = slots[i];
      if (!current) continue;
      const currentKey = getBankKeyForSlot(current) || current.id;
      if (currentKey !== key) continue;
      slots[i] = null;
    }
    return { ok: true, message: "Destroyed " + total.toLocaleString() + " x " + name + " from inventory." };
  }

  function destroyAllBankItem(player, itemId) {
    ensureBankState(player);
    const entry = player.bank.items?.[itemId];
    if (!entry || (Number(entry.qty) || 0) <= 0) return { ok: false, message: "Nothing to destroy." };
    const total = Math.max(0, Number(entry.qty) || 0);
    const confirmed = window.confirm("Destroy all " + total.toLocaleString() + " x " + (entry.name || itemId) + " from bank?");
    if (!confirmed) return { ok: false, message: "Destroy cancelled." };
    entry.qty = 0;
    return { ok: true, message: "Destroyed " + total.toLocaleString() + " x " + (entry.name || itemId) + " from bank." };
  }

  function openArmorSetInBank(player, itemId) {
    ensureBankState(player);
    const entry = player.bank.items?.[itemId];
    const setDef = resolveArmorSet(entry || { id: itemId });
    if (!entry || !setDef || (Number(entry.qty) || 0) <= 0) return { ok: false, message: "This item is not an openable armour set." };

    const originTab = Math.max(FIRST_BANK_TAB, Math.min(BANK_TAB_COUNT, Number(entry.tab) || FIRST_BANK_TAB));
    removeFromBank(player, itemId, 1);

    setDef.components.forEach((componentId) => {
      const component = CATALOG_BY_ID[componentId];
      if (!component) return;
      const preferredTab = getStoredTabForItem(player, componentId, originTab);
      const addedId = addToBank(player, component, 1);
      moveItemToTab(player, addedId || componentId, preferredTab);
    });

    return {
      ok: true,
      message: "Opened " + (entry.name || itemId) + " in bank."
    };
  }

  function openArmorSetInInventory(player, slotIndex) {
    const index = Number(slotIndex);
    const slot = player?.inventory?.slots?.[index];
    const setDef = resolveArmorSet(slot);
    if (!slot || !setDef) return { ok: false, message: "This item is not an openable armour set." };

    const removed = removeFromInventorySlot(player, index, 1);
    if (!removed) return { ok: false, message: "Unable to open this armour set." };

    let banked = 0;
    setDef.components.forEach((componentId) => {
      const component = CATALOG_BY_ID[componentId];
      if (!component) return;
      const added = addToInventory(player, component, 1);
      if (added) return;
      const preferredTab = getStoredTabForItem(player, componentId, FIRST_BANK_TAB);
      addToBank(player, component, 1);
      moveItemToTab(player, componentId, preferredTab);
      banked += 1;
    });

    return {
      ok: true,
      message: "Opened " + (removed.name || removed.id) + "." + (banked > 0 ? " " + banked + " piece(s) sent to bank." : "")
    };
  }

  function resolveSetForComponent(itemLike) {
    const id   = normalizeItemIdKey(itemLike?.id || "");
    const name = normalizeItemNameKey(itemLike?.name || "");
    if (!id && !name) return null;
    return ARMOR_SET_DEFS.find((def) =>
      (id   && def.components.some((c) => normalizeItemIdKey(c) === id)) ||
      (name && (def.componentNames || []).some((cn) => normalizeItemNameKey(cn) === name))
    ) || null;
  }

  // Finds the actual bank item id for a component, matching by catalog id first then by name.
  function findComponentBankId(player, setDef, componentId) {
    if (player.bank.items?.[componentId] && (Number(player.bank.items[componentId].qty) || 0) >= 1) {
      return componentId;
    }
    const catName = normalizeItemNameKey(CATALOG_BY_ID[componentId]?.name || "");
    if (!catName) return null;
    const byName = Object.values(player.bank.items || {}).find(
      (e) => e && (Number(e.qty) || 0) >= 1 && normalizeItemNameKey(e.name || "") === catName
    );
    return byName ? byName.id : null;
  }

  // Finds the inventory slot index for a component, matching by catalog id first then by name.
  function findComponentInventorySlot(slots, setDef, componentId) {
    const byId = slots.findIndex((s) => s && s.id === componentId);
    if (byId >= 0) return byId;
    const catName = normalizeItemNameKey(CATALOG_BY_ID[componentId]?.name || "");
    if (!catName) return -1;
    return slots.findIndex(
      (s) => s && normalizeItemNameKey(s.name || "") === catName
    );
  }

  function packArmorSetInBank(player, componentItemId) {
    ensureBankState(player);
    const sourceEntry = player.bank.items?.[componentItemId] || { id: componentItemId };
    const setDef = resolveSetForComponent(sourceEntry);
    if (!setDef) return { ok: false, message: "This item cannot be packed into an armour set." };

    const missing = [];
    const componentBankIds = {};
    setDef.components.forEach((cId) => {
      const found = findComponentBankId(player, setDef, cId);
      if (!found) {
        missing.push(CATALOG_BY_ID[cId]?.name || cId);
      } else {
        componentBankIds[cId] = found;
      }
    });
    if (missing.length > 0) {
      return { ok: false, message: "Missing pieces: " + missing.join(", ") + "." };
    }

    const originTab = Math.max(FIRST_BANK_TAB, Math.min(BANK_TAB_COUNT,
      Number(player.bank.items[componentBankIds[setDef.components[0]]]?.tab) || FIRST_BANK_TAB));
    setDef.components.forEach((cId) => removeFromBank(player, componentBankIds[cId], 1));
    const packedId = addToBank(player, { id: setDef.id, name: setDef.name, icon: setDef.icon, category: setDef.category }, 1);
    moveItemToTab(player, packedId || setDef.id, originTab);
    return { ok: true, message: "Packed " + setDef.name + " in bank." };
  }

  function packArmorSetInInventory(player, slotIndex) {
    const index = Number(slotIndex);
    const slot = player?.inventory?.slots?.[index];
    const setDef = resolveSetForComponent(slot);
    if (!slot || !setDef) return { ok: false, message: "This item cannot be packed into an armour set." };

    const slots = player?.inventory?.slots || [];
    const componentSlotMap = {};
    const missing = [];
    setDef.components.forEach((cId) => {
      const foundIdx = findComponentInventorySlot(slots, setDef, cId);
      if (foundIdx < 0) {
        missing.push(CATALOG_BY_ID[cId]?.name || cId);
      } else {
        componentSlotMap[cId] = foundIdx;
      }
    });
    if (missing.length > 0) {
      return { ok: false, message: "Missing pieces: " + missing.join(", ") + "." };
    }

    setDef.components.forEach((cId) => removeFromInventorySlot(player, componentSlotMap[cId], 1));
    const added = addToInventory(player, { id: setDef.id, name: setDef.name, icon: setDef.icon, category: setDef.category }, 1);
    if (!added) {
      ensureBankState(player);
      addToBank(player, { id: setDef.id, name: setDef.name, icon: setDef.icon, category: setDef.category }, 1);
      return { ok: true, message: "Packed " + setDef.name + ". Inventory full — sent to bank." };
    }
    return { ok: true, message: "Packed " + setDef.name + "." };
  }

  function recordLegitimateObtain(player, item, qty) {
    ensureBankState(player);
    const itemId   = String(item.id || "");
    if (!itemId) return;
    const amount   = Math.max(1, Number(qty) || 1);
    const category = item.category || inferCategoryForItem(item);
    if (!player.bank.log[itemId]) {
      player.bank.log[itemId] = {
        id: itemId, name: item.name || itemId, icon: item.icon || null,
        category, totalObtained: 0, firstTime: false
      };
    } else {
      if (item.name && !player.bank.log[itemId].name)     player.bank.log[itemId].name     = item.name;
      if (item.icon && !player.bank.log[itemId].icon)     player.bank.log[itemId].icon     = item.icon;
      if (category  && !player.bank.log[itemId].category) player.bank.log[itemId].category = category;
    }
    player.bank.log[itemId].totalObtained += amount;
    player.bank.log[itemId].firstTime      = true;
    if (player.bank.items[itemId]) player.bank.items[itemId].discovered = true;
  }

  function getRenderableBankEntries(player) {
    ensureBankState(player);
    return Object.values(player.bank.items).filter(e => e && e.id && (e.qty || 0) > 0);
  }

  function getItemUnitValue(item) {
    const itemId = String(item?.id || "");
    if (!itemId) return 0;
    if (itemId === "coins") return 1;

    const byId = Number(window.RSGame?.GE?.getCachedPriceById?.(itemId)) || 0;
    if (byId > 0) return byId;

    return Number(window.RSGame?.GE?.getCachedPriceByName?.(item?.name || itemId)) || 0;
  }

  function getBankStackValue(item) {
    return Math.max(0, Number(item?.qty) || 0) * Math.max(0, getItemUnitValue(item));
  }

  function getInventoryTotal(player, itemId) {
    return (player.inventory?.slots || []).reduce((sum, slot) => {
      if (!slot || slot.id !== itemId) return sum;
      return sum + (Number(slot.qty) || 0);
    }, 0);
  }

  function getCatalogIdForSlot(slot) {
    if (!slot) return null;
    if (CATALOG_BY_ID[slot.id]) return slot.id;

    const name = String(slot.name || "").toLowerCase();
    if (name.includes("bow string") || name === "bowstring") {
      return "bow_string";
    }

    return null;
  }

  function getInventoryTotalByCatalogId(player, catalogId) {
    return (player.inventory?.slots || []).reduce((sum, slot) => {
      if (!slot) return sum;
      if (getCatalogIdForSlot(slot) !== catalogId) return sum;
      return sum + (Number(slot.qty) || 0);
    }, 0);
  }

  function resolveEquipMeta(slot, player) {
    if (!slot) return null;

    const equipSlot = String(slot.slot || "").toLowerCase();
    const validEquipSlots = player?.equipment?.slots || {};
    if (equipSlot && Object.prototype.hasOwnProperty.call(validEquipSlots, equipSlot)) {
      return {
        slot: equipSlot,
        bonuses: slot.bonuses || null
      };
    }

    const fallback = EQUIPPABLE_ITEM_META[slot.id];
    if (!fallback) return null;

    if (!Object.prototype.hasOwnProperty.call(validEquipSlots, fallback.slot)) {
      return null;
    }

    return {
      slot: fallback.slot,
      bonuses: slot.bonuses || fallback.bonuses || null
    };
  }

  function syncDiscoveredItems(player) {
    ensureBankState(player);

    (player.inventory?.slots || []).forEach((slot) => {
      const bankKey = getBankKeyForSlot(slot);
      if (!slot || !bankKey || !player.bank.items[bankKey]) return;
      player.bank.items[bankKey].discovered = true;
      if (!player.bank.items[bankKey].icon && slot.icon) {
        player.bank.items[bankKey].icon = slot.icon;
      }
      if (!player.bank.items[bankKey].name && slot.name) {
        player.bank.items[bankKey].name = slot.name;
      }
    });

    Object.values(player.equipment?.slots || {}).forEach((slot) => {
      const bankKey = getBankKeyForSlot(slot);
      if (!slot || !bankKey || !player.bank.items[bankKey]) return;
      player.bank.items[bankKey].discovered = true;
    });
  }

  function addToInventory(player, item, qty) {
    const amount = Math.max(1, Number(qty) || 1);
    const itemId = String(item.id || "");
    const noted = itemId === "coins" ? false : !!item.noted;
    return player.inventory.addItem({
      id: itemId,
      name: item.name,
      qty: amount,
      icon: item.icon,
      noted,
      slot: item.slot || null,
      bonuses: item.bonuses || null
    });
  }

  function removeFromInventorySlot(player, slotIndex, qty) {
    const index = Number(slotIndex);
    const slot = player.inventory?.slots?.[index];
    if (!slot) return null;

    const amount = Math.max(1, Math.min(Number(qty) || 1, Number(slot.qty) || 0));
    const removed = {
      id: slot.id,
      name: slot.name,
      icon: slot.icon,
      qty: amount,
      noted: !!slot.noted
    };

    slot.qty -= amount;
    if (slot.qty <= 0) {
      player.inventory.slots[index] = null;
    }

    return removed;
  }

  function addToBank(player, item, qty) {
    ensureBankState(player);
    const incomingId = String(item?.id || "");
    const catalogItem = CATALOG_BY_ID[incomingId] || item;
    const category    = catalogItem.category || inferCategoryForItem(item);
    const incomingName = item?.name || catalogItem?.name || incomingId;
    const incomingNameKey = normalizeItemNameKey(incomingName);

    let targetId = incomingId;
    if (incomingNameKey) {
      const existingByName = Object.values(player.bank.items || {}).find((entry) =>
        entry && normalizeItemNameKey(entry.name || "") === incomingNameKey
      );
      if (existingByName?.id) targetId = existingByName.id;
    }

    if (!player.bank.items[targetId]) {
      const maxSort = Object.values(player.bank.items).reduce((m, e) => Math.max(m, (e && typeof e.sortIdx === "number") ? e.sortIdx : 0), 0);
      player.bank.items[targetId] = {
        id:         targetId,
        name:       incomingName,
        icon:       item.icon || catalogItem.icon || null,
        category,
        qty:        0,
        discovered: false,
        trackInLog: shouldTrackInLog(targetId, category),
        tab:        FIRST_BANK_TAB,
        sortIdx:    maxSort + 10
      };
    }
    const entry = player.bank.items[targetId];
    const amount = Math.max(1, Number(qty) || 1);
    const currentQty = Math.max(0, Number(entry.qty) || 0);

    if (targetId === "coins") {
      const totalCoins = currentQty + amount;
      if (totalCoins <= MAX_STACK_QTY) {
        entry.qty = totalCoins;
      } else {
        let finalCoins = MAX_STACK_QTY;
        const overflow = totalCoins - MAX_STACK_QTY;
        let tokenQty = Math.floor(overflow / COINS_PER_PLAT_TOKEN);
        const remainder = overflow % COINS_PER_PLAT_TOKEN;

        // Preserve value by shaving from max-cash when overflow isn't divisible by 1,000.
        if (remainder > 0) {
          const shave = COINS_PER_PLAT_TOKEN - remainder;
          if (finalCoins - shave >= 0) {
            finalCoins -= shave;
            tokenQty += 1;
          }
        }

        entry.qty = finalCoins;
        if (tokenQty > 0) {
          addToBank(player, {
            id: "platinum_token",
            name: "Platinum token",
            icon: "https://oldschool.runescape.wiki/images/thumb/Platinum_token_detail.png/32px-Platinum_token_detail.png",
            category: "General"
          }, tokenQty);
        }
      }
    } else if (targetId === "platinum_token") {
      const totalTokens = currentQty + amount;
      if (totalTokens <= MAX_STACK_QTY) {
        entry.qty = totalTokens;
      } else {
        let finalTokens = MAX_STACK_QTY;
        const overflow = totalTokens - MAX_STACK_QTY;
        let divineQty = Math.floor(overflow / PLAT_TOKENS_PER_DIVINE_TOKEN);
        const remainder = overflow % PLAT_TOKENS_PER_DIVINE_TOKEN;

        // Preserve value by shaving from max-stack when overflow isn't divisible by 100,000.
        if (remainder > 0) {
          const shave = PLAT_TOKENS_PER_DIVINE_TOKEN - remainder;
          if (finalTokens - shave >= 0) {
            finalTokens -= shave;
            divineQty += 1;
          }
        }

        entry.qty = finalTokens;
        if (divineQty > 0) {
          addToBank(player, {
            id: "divine_token",
            name: "Divine token",
            icon: wikiIcon("Platinum_token_detail.png") + "#glowy-yellow",
            category: "General"
          }, divineQty);
        }
      }
    } else {
      entry.qty = isUnlimitedStackItem(targetId)
        ? (currentQty + amount)
        : Math.min(MAX_STACK_QTY, currentQty + amount);
    }

    entry.discovered = true;
    if (!entry.category) entry.category = category;
    if (!entry.icon && (item.icon || catalogItem.icon)) entry.icon = item.icon || catalogItem.icon;
    if (!entry.name)     entry.name     = incomingName;
    entry.trackInLog = shouldTrackInLog(targetId, entry.category);
    if (typeof entry.tab     !== "number") entry.tab     = 0;
    if (typeof entry.sortIdx !== "number") entry.sortIdx = Object.values(player.bank.items).reduce((m, e) => Math.max(m, (e && typeof e.sortIdx === "number") ? e.sortIdx : 0), 0) + 10;

    return targetId;
  }

  function parseAmountInput(value) {
    const raw = String(value || "").trim().replace(/,/g, "").toUpperCase();
    if (!raw) return 0;

    const exact = Number(raw);
    if (Number.isFinite(exact) && exact > 0) {
      return Math.floor(exact);
    }

    const match = raw.match(/^(\d+(?:\.\d+)?)([KMB])$/);
    if (!match) return 0;

    const amount = Number(match[1]);
    if (!Number.isFinite(amount) || amount <= 0) return 0;

    const multipliers = { K: 1e3, M: 1e6, B: 1e9 };
    return Math.floor(amount * multipliers[match[2]]);
  }

  function formatCompactQty(value) {
    const n = Math.max(0, Number(value) || 0);
    if (n >= 1e9) return (n / 1e9).toFixed(1).replace(/\.0$/, "") + "b";
    if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, "") + "m";
    if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, "") + "k";
    return String(n);
  }

  function promptForAmount(label, maxQty) {
    const value = window.prompt(label + " (max " + maxQty.toLocaleString() + ")");
    const parsed = parseAmountInput(value);
    if (!parsed) return 0;
    return Math.max(1, Math.min(parsed, maxQty));
  }

  function buildQuantityEntries(prefix, maxQty, action) {
    const entries = [];
    const presets = [1, 10, 100, 1000, 10000, 1000000];

    presets.forEach((amount) => {
      if (maxQty < amount) return;
      const short = amount >= 1000000
        ? "1M"
        : amount >= 1000
          ? (amount / 1000) + "K"
          : String(amount);
      entries.push({
        label: prefix + "-" + short,
        action: () => action(amount)
      });
    });

    entries.push({
      label: prefix + "-X",
      action: () => {
        const chosen = promptForAmount("How many? You can use 1k, 10k, 1m, 1b", maxQty);
        if (chosen > 0) action(chosen);
      }
    });

    entries.push({
      label: prefix + "-All",
      action: () => action(maxQty)
    });

    return entries;
  }

  function removeFromBank(player, itemId, qty) {
    ensureBankState(player);
    const entry = player.bank.items[itemId];
    if (!entry || entry.qty <= 0) return null;

    const amount = Math.max(1, Math.min(Number(qty) || 1, entry.qty));
    entry.qty -= amount;
    return {
      id: entry.id,
      name: entry.name,
      icon: entry.icon,
      qty: amount,
      category: entry.category
    };
  }

  function reorderBankItems(player, movedId, targetId) {
    ensureBankState(player);
    const movedItem  = player.bank.items[movedId];
    const targetItem = player.bank.items[targetId];
    if (!movedItem || !targetItem) return;
    const targetTab = Math.max(FIRST_BANK_TAB, Math.min(BANK_TAB_COUNT, Number(targetItem.tab) || FIRST_BANK_TAB));
    movedItem.tab   = targetTab;
    const tabItems  = Object.values(player.bank.items)
      .filter(i => i && i.tab === targetTab && i.id !== movedId)
      .sort((a, b) => (a.sortIdx || 0) - (b.sortIdx || 0));
    const insertPos = tabItems.findIndex(i => i.id === targetId);
    tabItems.splice(insertPos < 0 ? tabItems.length : insertPos, 0, movedItem);
    tabItems.forEach((item, idx) => {
      if (player.bank.items[item.id]) player.bank.items[item.id].sortIdx = (idx + 1) * 10;
    });
  }

  function moveItemToTab(player, itemId, tabIndex) {
    ensureBankState(player);
    const item = player.bank.items[itemId];
    if (!item) return;
    item.tab = Math.max(FIRST_BANK_TAB, Math.min(BANK_TAB_COUNT, Number(tabIndex) || FIRST_BANK_TAB));
    const tabMax = Object.values(player.bank.items)
      .filter(i => i && i.tab === item.tab && i.id !== itemId)
      .reduce((m, i) => Math.max(m, i.sortIdx || 0), 0);
    item.sortIdx = tabMax + 10;
  }

  function formatBankQty(n) {
    const v = Math.max(0, Number(n) || 0);
    if (v === 0)    return { text: "0",    cls: "" };
    if (v >= 1e9)   return { text: (v / 1e9).toFixed(1).replace(/\.0$/, "") + "b", cls: "qty-orange" };
    if (v >= 1e6)   return { text: (v / 1e6).toFixed(1).replace(/\.0$/, "") + "m", cls: "qty-cyan" };
    if (v >= 10000) return { text: Math.floor(v / 1000) + "k",                      cls: "qty-green" };
    return { text: String(v), cls: "" };
  }

  function createContextMenu() {
    let menu = document.getElementById("osrs-context-menu");
    if (menu) return menu;

    menu = document.createElement("div");
    menu.id = "osrs-context-menu";
    menu.className = "osrs-context-menu";
    menu.hidden = true;
    document.body.appendChild(menu);
    return menu;
  }

  RSGame.Game.registerMod({
    name: "Bank",

    onGameInit(game) {
      const tabBar = document.getElementById("tab-bar");
      const main = document.querySelector(".main-layout");
      const inventoryGrid = document.getElementById("inventory-grid");
      if (!tabBar || !main || !inventoryGrid) return;

      ensureBankState(game.player);
      syncDiscoveredItems(game.player);

      const bankPanel = document.createElement("section");
      bankPanel.className = "panel bank-panel";
      bankPanel.style.display = "none";
      bankPanel.innerHTML =
        '<h2>Bank</h2>' +
        '<div class="bank-layout">' +
          '<div class="bank-top-bar">' +
            '<div class="bank-tabs-row" id="bank-tabs-row"></div>' +
            '<div class="bank-tools">' +
              '<div id="bank-total-value" class="bank-total-value" title="Total value of all items currently in your bank">Total Value: 0 gp</div>' +
              '<input type="text" id="bank-search" class="bank-search" placeholder="Search items...">' +
              '<button type="button" id="bank-autosort-toggle-btn" class="bank-tool-btn">Auto-Sort Learning: ON</button>' +
              '<button type="button" id="bank-move-all-tab1-btn" class="bank-tool-btn">Move All To Tab 1</button>' +
              '<button type="button" id="bank-multi-select-btn" class="bank-tool-btn">Multi-Select: OFF</button>' +
              '<button type="button" id="bank-reset-autosort-btn" class="bank-tool-btn">Reset Auto-Sort Learning</button>' +
              '<button type="button" id="bank-placeholders-btn" class="bank-tool-btn">Placeholders: OFF</button>' +
              '<button type="button" id="bank-view-toggle" class="bank-tool-btn">Collection Log</button>' +
              '<label class="bank-note-label" title="Withdraw items as noted"><input type="checkbox" id="bank-withdraw-note-toggle"> Note</label>' +
              '<button type="button" id="bank-deposit-all-btn" class="bank-tool-btn bank-tool-btn-accent">Deposit All</button>' +
            '</div>' +
          '</div>' +
          '<div id="bank-grid-view"><div id="bank-grid" class="bank-grid-osrs"></div></div>' +
          '<div id="bank-log-view" hidden>' +
            '<div class="bank-log-header">' +
              '<span class="bank-log-pct" id="bank-log-pct">0%</span>' +
              '<span class="bank-log-count" id="bank-log-count">0 / 0 unique</span>' +
              '<small class="bank-log-note">Tracks items obtained legitimately (not from GE).</small>' +
            '</div>' +
            '<div id="bank-log-sections"></div>' +
          '</div>' +
          '<div id="bank-status" class="bank-status"></div>' +
        '</div>';
      main.appendChild(bankPanel);

      const bankBtn = document.createElement("button");
      bankBtn.className = "tab-btn";
      bankBtn.dataset.tab = "bank";
      bankBtn.innerHTML = '<img class="tab-icon" src="https://oldschool.runescape.wiki/images/Bank_icon.png" alt="Bank" onerror="this.onerror=null;this.src=\'https://oldschool.runescape.wiki/images/thumb/Coins_10000.png/32px-Coins_10000.png\';"><span class="tab-label">Bank</span>';
      tabBar.appendChild(bankBtn);

      const statusEl           = bankPanel.querySelector("#bank-status");
      const withdrawNoteToggle = bankPanel.querySelector("#bank-withdraw-note-toggle");
      const autoSortToggleBtn  = bankPanel.querySelector("#bank-autosort-toggle-btn");
      const moveAllTab1Btn     = bankPanel.querySelector("#bank-move-all-tab1-btn");
      const multiSelectBtn     = bankPanel.querySelector("#bank-multi-select-btn");
      const resetAutoSortBtn   = bankPanel.querySelector("#bank-reset-autosort-btn");
      const contextMenu        = createContextMenu();
      let activeTab = Math.max(FIRST_BANK_TAB, Math.min(BANK_TAB_COUNT, Number(game.player.bank?.activeTab) || FIRST_BANK_TAB));
      let logViewActive = false;
      let draggedItemIds = [];
      let multiSelectMode = false;
      const selectedItemIds = new Set();
      let autoSortTimer = null;

      const inventoryPanel = document.querySelector(".panel.inventory-panel");
      if (inventoryPanel && !inventoryPanel.querySelector("#inventory-deposit-all-btn")) {
        const controls = document.createElement("div");
        controls.className = "inventory-controls";
        controls.innerHTML = '<button type="button" id="inventory-deposit-all-btn" class="inventory-action-btn">Deposit All To Bank</button>';
        inventoryPanel.insertBefore(controls, inventoryGrid);
      }

      function setStatus(text, isError) {
        statusEl.textContent = text || "";
        statusEl.classList.toggle("error", !!isError);
      }

      function renderBankTotalValue() {
        const totalEl = bankPanel.querySelector("#bank-total-value");
        if (!totalEl) return;
        const totalValue = getRenderableBankEntries(game.player).reduce((sum, item) => sum + getBankStackValue(item), 0);
        totalEl.textContent = "Total Value: " + formatCompactQty(totalValue) + " gp (" + Math.floor(totalValue).toLocaleString() + ")";
        totalEl.title = "Total bank value: " + Math.floor(totalValue).toLocaleString() + " gp";
      }

      function clearSelection() {
        selectedItemIds.clear();
      }

      function animateItemsToTab(itemIds, tabBtn, onDone) {
        const ids = Array.isArray(itemIds) ? itemIds.slice(0, 14) : [];
        if (!ids.length || !tabBtn) {
          onDone();
          return;
        }

        const targetRect = tabBtn.getBoundingClientRect();
        const targetX = targetRect.left + (targetRect.width / 2);
        const targetY = targetRect.top + (targetRect.height / 2);
        const flyNodes = [];

        ids.forEach((id) => {
          const sourceTile = document.querySelector('#bank-grid .bank-tile[data-item-id="' + id + '"]');
          const sourceImg = sourceTile?.querySelector("img");
          if (!sourceTile || !sourceImg) return;

          const start = sourceTile.getBoundingClientRect();
          const fly = document.createElement("div");
          fly.className = "bank-fly-item";
          fly.style.left = (start.left + (start.width / 2) - 14) + "px";
          fly.style.top = (start.top + (start.height / 2) - 14) + "px";
          fly.innerHTML = '<img src="' + sourceImg.src + '" alt="">';
          document.body.appendChild(fly);

          const dx = targetX - (start.left + (start.width / 2));
          const dy = targetY - (start.top + (start.height / 2));
          flyNodes.push({ node: fly, dx, dy });
        });

        if (!flyNodes.length) {
          onDone();
          return;
        }

        let finished = 0;
        const total = flyNodes.length;
        const markDone = () => {
          finished += 1;
          if (finished >= total) onDone();
        };

        flyNodes.forEach((entry) => {
          const el = entry.node;
          const cleanup = () => {
            if (el.parentNode) el.parentNode.removeChild(el);
            markDone();
          };

          el.addEventListener("transitionend", cleanup, { once: true });
          setTimeout(cleanup, 260);

          requestAnimationFrame(() => {
            el.style.transform = "translate(" + entry.dx + "px, " + entry.dy + "px) scale(0.42)";
            el.style.opacity = "0.1";
          });
        });
      }

      function isDevMenuUnlocked() {
        return sessionStorage.getItem("rsgame.devUnlocked.v1") === "1";
      }

      function spawnItemForTesting(itemLike, qty) {
        const amount = Math.max(1, Math.floor(Number(qty) || 1));
        const bankKey = getBankKeyForSlot(itemLike) || String(itemLike?.id || "");
        if (!bankKey) {
          setStatus("Unable to spawn this item.", true);
          return;
        }

        const base = CATALOG_BY_ID[bankKey] || itemLike || {};
        addToBank(game.player, {
          id: bankKey,
          name: base.name || bankKey,
          icon: base.icon || itemLike?.icon || wikiIcon("Coins_10000.png")
        }, amount);

        refresh();
        setStatus("Spawned " + amount.toLocaleString() + " x " + (base.name || bankKey) + " to bank.", false);
        RSGame.Game?.saveNow?.();
      }

      function runAdaptiveAutoSort() {
        ensureBankState(game.player);
        if (!game.player.bank.autoSortEnabled) return;
        const logState = game.player.bank.log || {};

        const entries = Object.values(game.player.bank.items || {}).filter((entry) => {
          if (!entry || !entry.id) return false;
          if (isManualTabItem(game.player, entry.id)) return false;
          const hasQty = (Number(entry.qty) || 0) > 0;
          const isPlaceholderKnown = !!entry.discovered || !!logState[entry.id]?.firstTime;
          if (!hasQty && !isPlaceholderKnown) return false;
          return true;
        });

        let moved = 0;
        entries.forEach((entry) => {
          const currentTab = Math.max(FIRST_BANK_TAB, Math.min(BANK_TAB_COUNT, Number(entry.tab) || FIRST_BANK_TAB));
          let bestTab = currentTab;
          let bestScore = 0;

          for (let tab = FIRST_BANK_TAB; tab <= BANK_TAB_COUNT; tab++) {
            if (tab === currentTab) continue;
            const profile = getAutoSortProfile(game.player, tab);
            if ((Number(profile.movesIn) || 0) <= 0) continue;
            const score = getAutoSortScoreForTab(game.player, entry, tab);
            if (score > bestScore) {
              bestScore = score;
              bestTab = tab;
            }
          }

          if (bestTab !== currentTab && bestScore >= AUTOSORT_MIN_SCORE) {
            moveItemToTab(game.player, entry.id, bestTab);
            moved += 1;
          }
        });

        if (moved > 0) {
          setStatus("Auto-sorted " + moved + " item" + (moved === 1 ? "" : "s") + " based on your manual tab pattern.", false);
          renderTabs();
          renderGrid();
          RSGame.Game?.saveNow?.();
        }
      }

      function queueAdaptiveAutoSort() {
        if (!game.player.bank?.autoSortEnabled) return;
        if (autoSortTimer) {
          clearTimeout(autoSortTimer);
          autoSortTimer = null;
        }
        autoSortTimer = setTimeout(() => {
          autoSortTimer = null;
          runAdaptiveAutoSort();
        }, AUTOSORT_DEBOUNCE_MS);
      }

      function moveAllEntriesToTabOne() {
        ensureBankState(game.player);

        const ordered = Object.values(game.player.bank.items || {})
          .filter((entry) => entry && entry.id)
          .sort((a, b) => (a.sortIdx || 99999) - (b.sortIdx || 99999));

        ordered.forEach((entry, index) => {
          entry.tab = FIRST_BANK_TAB;
          entry.sortIdx = (index + 1) * 10;
        });

        game.player.bank.activeTab = FIRST_BANK_TAB;
        activeTab = FIRST_BANK_TAB;
        game.player.bank.manualTabItems = {};
        clearSelection();
        draggedItemIds = [];

        if (autoSortTimer) {
          clearTimeout(autoSortTimer);
          autoSortTimer = null;
        }

        refresh();
        setStatus("Moved all bank entries to Tab 1 and cleared manual locks.", false);
        RSGame.Game?.saveNow?.();
      }

      function getItemsForView(tabIndex, search, showPlaceholders) {
        ensureBankState(game.player);
        let items = Object.values(game.player.bank.items).filter(e => e && e.id);
        const active = Math.max(FIRST_BANK_TAB, Math.min(BANK_TAB_COUNT, Number(tabIndex) || FIRST_BANK_TAB));
        items = items.filter(e => e.tab === active);
        const logState = game.player.bank.log || {};
        if (!showPlaceholders) {
          items = items.filter(e => (e.qty || 0) > 0);
        } else {
          items = items.filter(e => (e.qty || 0) > 0 || e.discovered || !!logState[e.id]?.firstTime);
        }
        if (search) {
          const q = search.toLowerCase();
          items = items.filter(e => (e.name || e.id).toLowerCase().includes(q));
        }
        const mode = game.player.bank.sortMode || "custom";
        if (mode === "stack-value") items.sort((a, b) => getBankStackValue(b) - getBankStackValue(a));
        else if (mode === "name")   items.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        else                        items.sort((a, b) => (a.sortIdx || 99999) - (b.sortIdx || 99999));
        return items;
      }

      function renderTabs() {
        const row = document.getElementById("bank-tabs-row");
        if (!row) return;
        row.innerHTML = "";
        ensureBankState(game.player);
        const tabLabels = (game.player.bank.tabs || []).map((n, i) => n || "Tab " + (i + 1));

        const allItemsSorted = Object.values(game.player.bank.items)
          .filter((entry) => entry && entry.id && (entry.qty || 0) > 0)
          .sort((a, b) => (a.sortIdx || 99999) - (b.sortIdx || 99999));

        const tabFirstItemByIndex = {};
        for (let tabIdx = FIRST_BANK_TAB; tabIdx <= BANK_TAB_COUNT; tabIdx++) {
          tabFirstItemByIndex[tabIdx] = allItemsSorted.find((entry) => (entry.tab || FIRST_BANK_TAB) === tabIdx) || null;
        }

        tabLabels.forEach((label, i) => {
          const tabNumber = i + 1;
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "bank-tab-btn" + (activeTab === tabNumber && !logViewActive ? " active" : "");
          btn.dataset.tabIndex = String(tabNumber);

          const iconItem = tabFirstItemByIndex[tabNumber] || null;
          if (iconItem && iconItem.icon) {
            const iconEl = document.createElement("img");
            iconEl.className = "bank-tab-icon";
            iconEl.src = iconItem.icon;
            iconEl.alt = iconItem.name || label;
            iconEl.onerror = function () { this.style.display = "none"; };
            btn.appendChild(iconEl);
          }

          const textEl = document.createElement("span");
          textEl.className = "bank-tab-label";
          textEl.textContent = label;
          btn.appendChild(textEl);

          btn.addEventListener("click", () => {
            if (logViewActive) {
              logViewActive = false;
              document.getElementById("bank-log-view").hidden = true;
              document.getElementById("bank-grid-view").hidden = false;
              bankPanel.querySelector("#bank-view-toggle").textContent = "Collection Log";
            }
            activeTab = tabNumber;
            game.player.bank.activeTab = activeTab;
            renderTabs();
            renderGrid();
          });
          btn.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            const newName = window.prompt("Rename tab " + tabNumber + ":", game.player.bank.tabs[i] || "");
            if (newName !== null) {
              game.player.bank.tabs[i] = newName.trim().slice(0, 16);
              renderTabs();
              RSGame.Game?.saveNow?.();
            }
          });
          btn.addEventListener("dragover", (e) => { if (!draggedItemIds.length) return; e.preventDefault(); btn.classList.add("drag-over"); });
          btn.addEventListener("dragleave", () => btn.classList.remove("drag-over"));
          btn.addEventListener("drop", (e) => {
            e.preventDefault();
            btn.classList.remove("drag-over");
            const idsToMove = (draggedItemIds || []).filter((id) => !!game.player.bank.items[id]);
            if (!idsToMove.length) return;

            const commitMove = () => {
              idsToMove.forEach((id) => {
                const entry = game.player.bank.items[id];
                if (!entry) return;
                const fromTab = Math.max(FIRST_BANK_TAB, Math.min(BANK_TAB_COUNT, Number(entry.tab) || FIRST_BANK_TAB));
                const wasPlaceholder = (Number(entry.qty) || 0) <= 0;
                moveItemToTab(game.player, id, tabNumber);
                // Placeholder moves should train sorting behavior without hard-locking this item id.
                markManualTabItem(game.player, id, !wasPlaceholder);
                learnFromManualMove(game.player, entry, fromTab, tabNumber);
              });
              draggedItemIds = [];
              clearSelection();
              renderTabs();
              renderGrid();
              RSGame.Game?.saveNow?.();
              queueAdaptiveAutoSort();
            };

            animateItemsToTab(idsToMove, btn, commitMove);
          });
          row.appendChild(btn);
        });
      }

      function renderGrid() {
        const gridEl = document.getElementById("bank-grid");
        if (!gridEl) return;
        renderBankTotalValue();
        syncDiscoveredItems(game.player);
        const search = bankPanel.querySelector("#bank-search")?.value || "";
        const showPH = !!game.player.bank.showPlaceholders;
        const items  = getItemsForView(activeTab, search, showPH);
        gridEl.innerHTML = "";
        items.forEach((item) => {
          const isPlaceholder = (item.qty || 0) === 0;
          const tile = document.createElement("div");
          const isSelected = selectedItemIds.has(item.id);
          tile.className = "bank-tile"
            + (isPlaceholder ? " bank-tile-placeholder" : "")
            + (isSelected ? " bank-tile-selected" : "");
          tile.dataset.itemId = item.id;
          tile.draggable = true;
          tile.title = item.name + (item.qty > 0 ? " \u2014 " + Number(item.qty).toLocaleString() : " [placeholder]");
          const img = document.createElement("img");
          img.src = item.icon || wikiIcon("Coins_10000.png");
          img.alt = item.name;
          if (item.id === "divine_token") {
            img.classList.add("divine-glow");
          }
          img.onerror = function() {
            if (item.id === "platinum_token") {
              this.onerror = null;
              this.src = wikiIcon("Platinum_token_detail.png");
              return;
            }
            this.src = wikiIcon("Coins_10000.png");
          };
          tile.appendChild(img);
          const fmted = formatBankQty(item.qty);
          const qtyEl = document.createElement("span");
          qtyEl.className = "bank-qty" + (fmted.cls ? " " + fmted.cls : "");
          qtyEl.textContent = fmted.text;
          tile.appendChild(qtyEl);
          tile.addEventListener("dragstart", (e) => {
            let ids = [item.id];
            if (multiSelectMode && selectedItemIds.size > 1 && selectedItemIds.has(item.id)) {
              ids = Array.from(selectedItemIds).filter((id) => !!game.player.bank.items[id]);
            }
            draggedItemIds = ids;
            ids.forEach((id) => {
              const selectedTile = gridEl.querySelector('[data-item-id="' + id + '"]');
              if (selectedTile) selectedTile.classList.add("dragging");
            });
            e.dataTransfer.effectAllowed = "move";
            e.dataTransfer.setData("text/plain", ids.join(","));
          });
          tile.addEventListener("dragend", () => {
            draggedItemIds = [];
            gridEl.querySelectorAll(".bank-tile.dragging").forEach(el => el.classList.remove("dragging"));
            gridEl.querySelectorAll(".bank-drop-target").forEach(el => el.classList.remove("bank-drop-target"));
          });
          tile.addEventListener("click", () => {
            if (!multiSelectMode) return;
            if (selectedItemIds.has(item.id)) selectedItemIds.delete(item.id);
            else selectedItemIds.add(item.id);
            renderGrid();
          });
          tile.addEventListener("dragover", (e) => {
            if (!draggedItemIds.length || draggedItemIds.length > 1) return;
            if (draggedItemIds[0] === item.id) return;
            e.preventDefault();
            e.stopPropagation();
            gridEl.querySelectorAll(".bank-drop-target").forEach(el => el.classList.remove("bank-drop-target"));
            tile.classList.add("bank-drop-target");
          });
          tile.addEventListener("drop", (e) => {
            e.preventDefault();
            const srcId = (draggedItemIds.length === 1 ? draggedItemIds[0] : null) || e.dataTransfer.getData("text/plain");
            if (!srcId || srcId === item.id) return;
            tile.classList.remove("bank-drop-target");
            reorderBankItems(game.player, srcId, item.id);
            renderGrid();
            RSGame.Game?.saveNow?.();
          });
          gridEl.appendChild(tile);
        });
      }

      function renderCollectionLog() {
        const logPctEl      = document.getElementById("bank-log-pct");
        const logCountEl    = document.getElementById("bank-log-count");
        const logSectionsEl = document.getElementById("bank-log-sections");
        if (!logPctEl || !logSectionsEl) return;
        renderBankTotalValue();
        ensureBankState(game.player);
        const logData             = game.player.bank.log || {};
        const catalogTrackable    = BANK_CATALOG.filter(item => shouldTrackInLog(item.id, item.category));
        const catalogTrackableIds = new Set(catalogTrackable.map(i => i.id));
        const dynamicCount        = Object.values(logData).filter(e => !catalogTrackableIds.has(e.id)).length;
        const total               = catalogTrackable.length + dynamicCount;
        const obtained            = Object.values(logData).filter(e => e.firstTime).length;
        logPctEl.textContent      = (total > 0 ? ((obtained / total) * 100).toFixed(1) : "0.0") + "%";
        logCountEl.textContent    = obtained + " / " + total + " unique obtained";
        logSectionsEl.innerHTML   = "";

        const sectionByTitle = new Map();
        const categoryToTitle = new Map();
        const itemById = new Map();

        function ensureSection(title, category) {
          const safeTitle = String(title || "Other").trim() || "Other";
          if (!sectionByTitle.has(safeTitle)) {
            sectionByTitle.set(safeTitle, {
              title: safeTitle,
              categories: new Set(category ? [category] : []),
              items: [],
              ids: new Set(),
              dynamic: !LOG_SECTIONS_DEF.some((s) => s.title === safeTitle)
            });
          }
          const sec = sectionByTitle.get(safeTitle);
          if (category) sec.categories.add(category);
          return sec;
        }

        LOG_SECTIONS_DEF.forEach((section) => {
          const sec = ensureSection(section.title);
          section.categories.forEach((cat) => {
            sec.categories.add(cat);
            categoryToTitle.set(cat, section.title);
          });
        });

        function addItemToSection(sectionTitle, itemLike) {
          const sec = ensureSection(sectionTitle, itemLike.category);
          if (sec.ids.has(itemLike.id)) return sec;
          const logEntry = logData[itemLike.id] || {};
          const itemObj = {
            id: itemLike.id,
            name: itemLike.name || itemLike.id,
            icon: itemLike.icon || wikiIcon("Coins_10000.png"),
            totalObtained: Number(logEntry.totalObtained) || 0,
            firstTime: !!logEntry.firstTime
          };
          sec.ids.add(itemObj.id);
          sec.items.push(itemObj);
          itemById.set(itemObj.id, itemObj);
          return sec;
        }

        catalogTrackable.forEach((item) => {
          const sectionTitle = categoryToTitle.get(item.category) || item.category || "Other";
          addItemToSection(sectionTitle, item);
        });

        Object.values(logData).forEach((entry) => {
          if (!entry || !entry.id) return;
          if (itemById.has(entry.id)) {
            const existing = itemById.get(entry.id);
            existing.totalObtained = Number(entry.totalObtained) || 0;
            existing.firstTime = !!entry.firstTime;
            if ((!existing.name || existing.name === existing.id) && entry.name) existing.name = entry.name;
            if ((!existing.icon || String(existing.icon).includes("Coins_10000")) && entry.icon) existing.icon = entry.icon;
            return;
          }
          const sectionTitle = categoryToTitle.get(entry.category) || entry.category || "Other";
          addItemToSection(sectionTitle, entry);
        });

        const orderedTitles = [];
        LOG_SECTIONS_DEF.forEach((section) => {
          if (sectionByTitle.has(section.title)) orderedTitles.push(section.title);
        });
        Array.from(sectionByTitle.keys())
          .filter((title) => !orderedTitles.includes(title))
          .sort((a, b) => a.localeCompare(b))
          .forEach((title) => orderedTitles.push(title));

        orderedTitles.forEach((title) => {
          const section = sectionByTitle.get(title);
          const sectionItems = (section?.items || []).slice().sort((a, b) => a.name.localeCompare(b.name));
          if (!sectionItems.length) return;
          const secObtained   = sectionItems.filter(i => i.firstTime).length;
          const secEl         = document.createElement("div");
          secEl.className     = "bank-log-section";
          const secHeader     = document.createElement("div");
          secHeader.className = "bank-log-section-header";
          secHeader.innerHTML = "<span>" + section.title + "</span><span class=\"log-section-count\">" + secObtained + " / " + sectionItems.length + "</span>";
          const secBody       = document.createElement("div");
          secBody.className   = "bank-log-section-body";
          sectionItems.forEach((logItem) => {
            const itemEl      = document.createElement("div");
            itemEl.className  = "bank-log-item" + (logItem.firstTime ? " obtained" : " not-obtained");
            itemEl.title      = logItem.name + (logItem.totalObtained > 0 ? " \u2014 " + Number(logItem.totalObtained).toLocaleString() + "x total" : " \u2014 not yet obtained");
            const img         = document.createElement("img");
            img.src           = logItem.icon || wikiIcon("Coins_10000.png");
            img.alt           = logItem.name;
            img.onerror       = function() { this.src = wikiIcon("Coins_10000.png"); };
            const nameEl      = document.createElement("div");
            nameEl.className  = "bank-log-item-name";
            nameEl.textContent = logItem.name;
            const cntEl       = document.createElement("div");
            cntEl.className   = "bank-log-item-count";
            cntEl.textContent = logItem.totalObtained > 0 ? formatCompactQty(logItem.totalObtained) + "\xd7" : "\u2014";
            itemEl.appendChild(img);
            itemEl.appendChild(nameEl);
            itemEl.appendChild(cntEl);
            secBody.appendChild(itemEl);
          });
          secHeader.addEventListener("click", () => secEl.classList.toggle("collapsed"));
          secEl.appendChild(secHeader);
          secEl.appendChild(secBody);
          logSectionsEl.appendChild(secEl);
        });
      }

      function refresh() {
        ensureBankState(game.player);
        if (withdrawNoteToggle) withdrawNoteToggle.checked = !!game.player.bank?.withdrawAsNote;
        const phBtn = bankPanel.querySelector("#bank-placeholders-btn");
        if (phBtn) phBtn.textContent = "Placeholders: " + (game.player.bank.showPlaceholders ? "ON" : "OFF");
        if (autoSortToggleBtn) {
          autoSortToggleBtn.textContent = "Auto-Sort Learning: " + (game.player.bank.autoSortEnabled ? "ON" : "OFF");
          autoSortToggleBtn.classList.toggle("is-on", !!game.player.bank.autoSortEnabled);
        }
        if (multiSelectBtn) {
          multiSelectBtn.textContent = "Multi-Select: " + (multiSelectMode ? "ON" : "OFF");
          multiSelectBtn.classList.toggle("is-on", multiSelectMode);
        }
        renderTabs();
        if (logViewActive) renderCollectionLog(); else renderGrid();
      }

      function depositAllInventoryToBank() {
        const slots = game.player.inventory?.slots || [];
        let deposited = 0;

        for (let i = 0; i < slots.length; i++) {
          const slot = slots[i];
          const bankKey = getBankKeyForSlot(slot);
          if (!slot || !bankKey) continue;

          const qty = Math.max(0, Number(slot.qty) || 0);
          if (qty <= 0) continue;

          addToBank(game.player, {
            id: bankKey,
            name: CATALOG_BY_ID[bankKey]?.name || slot.name,
            icon: CATALOG_BY_ID[bankKey]?.icon || slot.icon
          }, qty);
          deposited += qty;
          slots[i] = null;
        }

        RSGame.UI.renderInventory(game.player);
        refresh();
        setStatus(deposited > 0 ? "Deposited all bankable inventory items." : "Nothing to deposit.", deposited === 0);
        RSGame.Game?.saveNow?.();
      }

      function hideContextMenu() {
        contextMenu.hidden = true;
        contextMenu.innerHTML = "";
      }

      function showContextMenu(title, entries, x, y) {
        contextMenu.innerHTML = '<div class="osrs-context-title">' + title + '</div>';
        entries.forEach((entry) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "osrs-context-option";
          btn.textContent = entry.label;
          btn.addEventListener("click", () => {
            hideContextMenu();
            entry.action();
          });
          contextMenu.appendChild(btn);
        });

        contextMenu.hidden = false;
        const maxX = window.innerWidth - 180;
        const maxY = window.innerHeight - 220;
        contextMenu.style.left = Math.max(8, Math.min(x, maxX)) + "px";
        contextMenu.style.top = Math.max(8, Math.min(y, maxY)) + "px";
      }

      function depositFromInventory(slotIndex, qty) {
        const slot = game.player.inventory?.slots?.[Number(slotIndex)];
        const bankKey = getBankKeyForSlot(slot);
        if (!slot || !bankKey) {
          setStatus("This item cannot be banked.", true);
          return;
        }

        const requested = Math.max(1, Number(qty) || 1);
        const slots = game.player.inventory?.slots || [];
        const itemId = bankKey;
        const itemName = CATALOG_BY_ID[itemId]?.name || slot.name;
        const itemIcon = CATALOG_BY_ID[itemId]?.icon || slot.icon;

        // Prioritize removing from the clicked slot first, then consume matching stacks.
        const indexes = [Number(slotIndex)].concat(
          slots
            .map((_, i) => i)
            .filter((i) => i !== Number(slotIndex))
        );

        let remaining = requested;
        let removedQty = 0;
        indexes.forEach((i) => {
          if (remaining <= 0) return;
          const current = slots[i];
          if (!current || getBankKeyForSlot(current) !== itemId) return;

          const take = Math.min(Number(current.qty) || 0, remaining);
          if (take <= 0) return;

          current.qty -= take;
          if (current.qty <= 0) {
            slots[i] = null;
          }

          removedQty += take;
          remaining -= take;
        });

        if (removedQty <= 0) {
          setStatus("Nothing to deposit.", true);
          return;
        }

        addToBank(game.player, { id: itemId, name: itemName, icon: itemIcon }, removedQty);
        RSGame.UI.renderInventory(game.player);
        refresh();
        setStatus("Deposited " + removedQty + " x " + itemName + ".", false);
        RSGame.Game?.saveNow?.();
      }

      function equipFromInventory(slotIndex) {
        const index = Number(slotIndex);
        const slot = game.player.inventory?.slots?.[index];
        if (!slot) return;

        const equipMeta = resolveEquipMeta(slot, game.player);
        if (!equipMeta) {
          setStatus("This item cannot be equipped.", true);
          return;
        }

        if (slot.noted) {
          setStatus("Unnote this item before equipping it.", true);
          return;
        }

        const equipSlot = equipMeta.slot;
        const currentlyEquipped = game.player.equipment.get(equipSlot);
        if (currentlyEquipped) {
          const returned = addToInventory(game.player, { ...currentlyEquipped, noted: false }, 1);
          if (!returned) {
            setStatus("Inventory is full. Free a slot to swap equipment.", true);
            return;
          }
        }

        const removed = removeFromInventorySlot(game.player, index, 1);
        if (!removed) {
          setStatus("Unable to equip this item.", true);
          return;
        }

        game.player.equipment.equip(equipSlot, {
          id: removed.id,
          name: removed.name,
          icon: removed.icon,
          slot: equipSlot,
          bonuses: equipMeta.bonuses || null
        });

        RSGame.UI.renderInventory(game.player);
        RSGame.UI.renderEquipment(game.player);
        RSGame.UI.renderStats?.(game.player);
        refresh();
        setStatus("Equipped " + removed.name + ".", false);
        RSGame.Game?.saveNow?.();
      }

      function withdrawFromBank(itemId, qty) {
        const item = removeFromBank(game.player, itemId, qty);
        if (!item) {
          setStatus("Nothing to withdraw.", true);
          return;
        }

        const withdrawAsNote = !!game.player.bank?.withdrawAsNote && item.id !== "coins";
        const added = addToInventory(game.player, { ...item, noted: withdrawAsNote }, item.qty);
        if (!added) {
          addToBank(game.player, item, item.qty);
          setStatus("Inventory is full.", true);
          return;
        }

        RSGame.UI.renderInventory(game.player);
        refresh();
        setStatus("Withdrew " + item.qty + " x " + item.name + (withdrawAsNote ? " as noted." : "."), false);
        RSGame.Game?.saveNow?.();
      }

      withdrawNoteToggle?.addEventListener("change", () => {
        ensureBankState(game.player);
        game.player.bank.withdrawAsNote = !!withdrawNoteToggle.checked;
        RSGame.Game?.saveNow?.();
      });

      bankPanel.querySelector("#bank-placeholders-btn")?.addEventListener("click", () => {
        ensureBankState(game.player);
        game.player.bank.showPlaceholders = !game.player.bank.showPlaceholders;
        refresh();
        RSGame.Game?.saveNow?.();
      });

      bankPanel.querySelector("#bank-view-toggle")?.addEventListener("click", () => {
        logViewActive = !logViewActive;
        document.getElementById("bank-grid-view").hidden = logViewActive;
        document.getElementById("bank-log-view").hidden  = !logViewActive;
        bankPanel.querySelector("#bank-view-toggle").textContent = logViewActive ? "Bank" : "Collection Log";
        if (logViewActive) renderCollectionLog(); else renderGrid();
      });

      bankPanel.querySelector("#bank-deposit-all-btn")?.addEventListener("click", depositAllInventoryToBank);

      autoSortToggleBtn?.addEventListener("click", () => {
        ensureBankState(game.player);
        game.player.bank.autoSortEnabled = !game.player.bank.autoSortEnabled;
        if (!game.player.bank.autoSortEnabled && autoSortTimer) {
          clearTimeout(autoSortTimer);
          autoSortTimer = null;
        }
        setStatus("Auto-sort learning " + (game.player.bank.autoSortEnabled ? "enabled." : "disabled."), false);
        refresh();
        RSGame.Game?.saveNow?.();
      });

      moveAllTab1Btn?.addEventListener("click", () => {
        const ok = window.confirm("Move all bank items and placeholders to Tab 1 and clear manual locks?");
        if (!ok) return;
        moveAllEntriesToTabOne();
      });

      multiSelectBtn?.addEventListener("click", () => {
        multiSelectMode = !multiSelectMode;
        if (!multiSelectMode) clearSelection();
        refresh();
      });

      resetAutoSortBtn?.addEventListener("click", () => {
        ensureBankState(game.player);
        const ok = window.confirm("Reset bank auto-sort learning and manual tab locks? This cannot be undone.");
        if (!ok) return;

        game.player.bank.autoSortProfiles = {};
        game.player.bank.manualTabItems = {};
        ensureBankState(game.player);

        if (autoSortTimer) {
          clearTimeout(autoSortTimer);
          autoSortTimer = null;
        }

        clearSelection();
        setStatus("Auto-sort learning reset. The system will relearn from your new manual moves.", false);
        refresh();
        RSGame.Game?.saveNow?.();
      });

      const invDepBtn = document.getElementById("inventory-deposit-all-btn");
      if (invDepBtn) invDepBtn.addEventListener("click", depositAllInventoryToBank);

      let searchDebounce = null;
      bankPanel.querySelector("#bank-search")?.addEventListener("input", () => {
        clearTimeout(searchDebounce);
        searchDebounce = setTimeout(renderGrid, 150);
      });

      inventoryGrid.addEventListener("contextmenu", (event) => {
        const slotEl = event.target.closest(".inventory-slot");
        if (!slotEl || !slotEl.dataset.itemId) return;
        event.preventDefault();

        const slotIndex = Number(slotEl.dataset.slotIndex);
        const slot = game.player.inventory?.slots?.[slotIndex];
        if (!slot) return;

        const entries = [];
        const armorSetDef = resolveArmorSet(slot);
        if (armorSetDef) {
          entries.push({
            label: "Open armour set",
            action: () => {
              const result = openArmorSetInInventory(game.player, slotIndex);
              setStatus(result.message, !result.ok);
              RSGame.UI.renderInventory(game.player);
              refresh();
              RSGame.Game?.saveNow?.();
            }
          });
        }
        const invPackSetDef = resolveSetForComponent(slot);
        if (invPackSetDef) {
          entries.push({
            label: "Pack armour set",
            action: () => {
              const result = packArmorSetInInventory(game.player, slotIndex);
              setStatus(result.message, !result.ok);
              RSGame.UI.renderInventory(game.player);
              refresh();
              RSGame.Game?.saveNow?.();
            }
          });
        }

        const bankKey = getBankKeyForSlot(slot);
        if (bankKey) {
          const totalQty = (game.player.inventory?.slots || []).reduce((sum, cur) => {
            if (!cur || getBankKeyForSlot(cur) !== bankKey) return sum;
            return sum + (Number(cur.qty) || 0);
          }, 0);
          entries.push(...buildQuantityEntries("Deposit", totalQty, (amount) => depositFromInventory(slotIndex, amount)));
        }

        const equipMeta = resolveEquipMeta(slot, game.player);
        if (equipMeta && !slot.noted) {
          const equipLabel = slot.leftClickAction || ((equipMeta.slot === "weapon" || equipMeta.slot === "ammo") ? "Wield" : "Wear");
          entries.unshift({
            label: equipLabel,
            action: () => equipFromInventory(slotIndex)
          });
        }

        const fletchingEntries = RSGame.Fletching?.getInventoryContextEntries?.({
          game,
          slot,
          slotIndex,
          setStatus,
          onChange: () => {
            RSGame.UI.renderInventory(game.player);
            refresh();
            RSGame.Game?.saveNow?.();
          }
        }) || [];
        entries.push(...fletchingEntries);

        const clueEntries = RSGame.Clues?.getInventoryContextEntries?.({
          game,
          slot,
          slotIndex,
          setStatus,
          onChange: () => {
            RSGame.UI.renderInventory(game.player);
            refresh();
            RSGame.Game?.saveNow?.();
          }
        }) || [];
        entries.push(...clueEntries);

        if (isDevMenuUnlocked()) {
          entries.push({
            label: "Duplicate",
            action: () => spawnItemForTesting(slot, 1)
          });
          entries.push({
            label: "Duplicate-X",
            action: () => {
              const chosen = promptForAmount("Spawn how many? You can use 1k, 10k, 1m, 1b", 2147483647);
              if (chosen > 0) spawnItemForTesting(slot, chosen);
            }
          });
        }

        entries.push({
          label: "Destroy-All",
          action: () => {
            const result = destroyAllInventoryItem(game.player, slotIndex);
            setStatus(result.message, !result.ok);
            RSGame.UI.renderInventory(game.player);
            refresh();
            RSGame.Game?.saveNow?.();
          }
        });

        entries.push({ label: "Examine", action: () => setStatus(slot.name + ": Qty " + slot.qty + ".", false) });

        showContextMenu(slot.name + (slot.noted ? " (noted)" : ""), entries, event.clientX, event.clientY);
      });

      inventoryGrid.addEventListener("click", (event) => {
        const slotEl = event.target.closest(".inventory-slot");
        if (!slotEl || !slotEl.dataset.itemId) return;

        const slotIndex = Number(slotEl.dataset.slotIndex);
        const slot = game.player.inventory?.slots?.[slotIndex];
        if (!slot) return;

        const clueHandled = RSGame.Clues?.handleInventoryClick?.({
          game,
          slotIndex,
          setStatus,
          onChange: () => {
            RSGame.UI.renderInventory(game.player);
            refresh();
            RSGame.Game?.saveNow?.();
          }
        });
        if (clueHandled) return;

        if (slot.noted) return;

        const equipMeta = resolveEquipMeta(slot, game.player);
        if (!equipMeta) return;

        equipFromInventory(slotIndex);
      });

      document.getElementById("bank-grid").addEventListener("contextmenu", (event) => {
        const tileEl = event.target.closest(".bank-tile");
        if (!tileEl) return;
        event.preventDefault();
        const itemId = tileEl.dataset.itemId;
        const entry  = game.player.bank.items[itemId];
        if (!entry) return;
        const menuEntries = [];
        const armorSetDef = resolveArmorSet(entry);
        if (armorSetDef && (Number(entry.qty) || 0) > 0) {
          menuEntries.push({
            label: "Open armour set",
            action: () => {
              const result = openArmorSetInBank(game.player, itemId);
              setStatus(result.message, !result.ok);
              refresh();
              RSGame.Game?.saveNow?.();
            }
          });
        }
        const packSetDef = resolveSetForComponent(entry);
        if (packSetDef) {
          menuEntries.push({
            label: "Pack armour set",
            action: () => {
              const result = packArmorSetInBank(game.player, itemId);
              setStatus(result.message, !result.ok);
              refresh();
              RSGame.Game?.saveNow?.();
            }
          });
        }
        if ((entry.qty || 0) > 0) {
          menuEntries.push(...buildQuantityEntries("Withdraw", Number(entry.qty) || 0, (amount) => withdrawFromBank(itemId, amount)));
        }
        if (isDevMenuUnlocked()) {
          menuEntries.push({ label: "Duplicate", action: () => spawnItemForTesting(entry, 1) });
          menuEntries.push({
            label: "Duplicate-X",
            action: () => {
              const chosen = promptForAmount("Spawn how many? You can use 1k, 10k, 1m, 1b", 2147483647);
              if (chosen > 0) spawnItemForTesting(entry, chosen);
            }
          });
        }
        menuEntries.push({
          label: "Destroy-All",
          action: () => {
            const result = destroyAllBankItem(game.player, itemId);
            setStatus(result.message, !result.ok);
            refresh();
            RSGame.Game?.saveNow?.();
          }
        });
        menuEntries.push({ label: "Examine", action: () => setStatus(entry.name + ": Banked " + (entry.qty || 0) + ".", false) });
        showContextMenu(entry.name, menuEntries, event.clientX, event.clientY);
      });

      document.addEventListener("click", hideContextMenu);
      document.addEventListener("scroll", hideContextMenu, true);
      document.addEventListener("contextmenu", (event) => {
        if (!event.target.closest("#inventory-grid") && !event.target.closest("#bank-grid")) {
          hideContextMenu();
        }
      });

      RSGame.Bank = {
        refresh,
        ensureBankState,
        syncDiscoveredItems,
        depositAllInventoryToBank,
        addToBank,
        recordLegitimateObtain
      };

      refresh();
    }
  });
})();