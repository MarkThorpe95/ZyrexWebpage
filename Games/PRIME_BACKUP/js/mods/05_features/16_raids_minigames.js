window.RSGame = window.RSGame || {};

(function () {
  function wikiIcon(file) {
    return "https://oldschool.runescape.wiki/images/thumb/" + file + "/32px-" + file;
  }

  const RAID_DEFS = [
    {
      id: "cox",
      name: "Chambers of Xeric",
      icon: wikiIcon("Xeric%27s_guard.png"),
      requirements: { combat: 90, attack: 75, strength: 75, defence: 70, ranged: 1, magic: 1, prayer: 1 },
      tuning: { difficulty: 0.95, uniqueChance: 0.06 },
      successLoot: {
        coins: [180000, 620000],
        commonRolls: [2, 4],
        common: [
          { id: "dragon_arrow", name: "Dragon arrow", icon: wikiIcon("Dragon_arrow_5.png"), qtyMin: 35, qtyMax: 120, weight: 18 },
          { id: "dragon_dart", name: "Dragon dart", icon: wikiIcon("Dragon_dart.png"), qtyMin: 40, qtyMax: 140, weight: 18 },
          { id: "runite_ore", name: "Runite ore", icon: wikiIcon("Runite_ore.png"), qtyMin: 2, qtyMax: 8, weight: 14 },
          { id: "onyx_bolts_e", name: "Onyx bolts (e)", icon: wikiIcon("Onyx_bolts_(e)_5.png"), qtyMin: 25, qtyMax: 80, weight: 14 },
          { id: "death_rune", name: "Death rune", icon: wikiIcon("Death_rune.png"), qtyMin: 180, qtyMax: 520, weight: 16 },
          { id: "grimy_toadflax", name: "Grimy toadflax", icon: wikiIcon("Grimy_toadflax.png"), qtyMin: 18, qtyMax: 55, weight: 12 }
        ],
        uniques: [
          { id: "twisted_bow", name: "Twisted bow", icon: wikiIcon("Twisted_bow.png"), weight: 1 },
          { id: "ancestral_hat", name: "Ancestral hat", icon: wikiIcon("Ancestral_hat.png"), weight: 2 },
          { id: "ancestral_robe_top", name: "Ancestral robe top", icon: wikiIcon("Ancestral_robe_top.png"), weight: 2 },
          { id: "ancestral_robe_bottom", name: "Ancestral robe bottom", icon: wikiIcon("Ancestral_robe_bottom.png"), weight: 2 },
          { id: "dexterous_prayer_scroll", name: "Dexterous prayer scroll", icon: wikiIcon("Dexterous_prayer_scroll.png"), weight: 3 },
          { id: "arcane_prayer_scroll", name: "Arcane prayer scroll", icon: wikiIcon("Arcane_prayer_scroll.png"), weight: 3 },
          // 1/10 chance for bond
          { id: "bond", name: "Old School Bond", icon: wikiIcon("Old_School_Bond.png"), weight: 0.6 }
        ]
      },
      failLoot: {
        coins: [25000, 90000],
        rolls: [1, 2],
        common: [
          { id: "coal", name: "Coal", icon: wikiIcon("Coal.png"), qtyMin: 45, qtyMax: 140, weight: 20 },
          { id: "mithril_ore", name: "Mithril ore", icon: wikiIcon("Mithril_ore.png"), qtyMin: 8, qtyMax: 22, weight: 18 },
          { id: "nature_rune", name: "Nature rune", icon: wikiIcon("Nature_rune.png"), qtyMin: 50, qtyMax: 150, weight: 18 },
          { id: "shark", name: "Shark", icon: wikiIcon("Shark.png"), qtyMin: 6, qtyMax: 20, weight: 16 }
        ]
      }
    },
    {
      id: "cox_cm",
      name: "Chambers of Xeric: Challenge Mode",
      icon: wikiIcon("Ancient_tablet.png"),
      requirements: { combat: 110, attack: 85, strength: 85, defence: 80, ranged: 1, magic: 1, prayer: 1 },
      tuning: { difficulty: 0.8, uniqueChance: 0.09 },
      successLoot: {
        coins: [260000, 900000],
        commonRolls: [3, 5],
        common: [
          { id: "dragon_arrow", name: "Dragon arrow", icon: wikiIcon("Dragon_arrow_5.png"), qtyMin: 80, qtyMax: 220, weight: 18 },
          { id: "dragon_dart", name: "Dragon dart", icon: wikiIcon("Dragon_dart.png"), qtyMin: 90, qtyMax: 260, weight: 18 },
          { id: "runite_ore", name: "Runite ore", icon: wikiIcon("Runite_ore.png"), qtyMin: 4, qtyMax: 12, weight: 16 },
          { id: "onyx_bolts_e", name: "Onyx bolts (e)", icon: wikiIcon("Onyx_bolts_(e)_5.png"), qtyMin: 45, qtyMax: 120, weight: 15 },
          { id: "blood_rune", name: "Blood rune", icon: wikiIcon("Blood_rune.png"), qtyMin: 220, qtyMax: 680, weight: 18 },
          { id: "snapdragon_seed", name: "Snapdragon seed", icon: wikiIcon("Snapdragon_seed_5.png"), qtyMin: 4, qtyMax: 12, weight: 12 }
        ],
        uniques: [
          { id: "twisted_bow", name: "Twisted bow", icon: wikiIcon("Twisted_bow.png"), weight: 1 },
          { id: "dragon_hunter_crossbow", name: "Dragon hunter crossbow", icon: wikiIcon("Dragon_hunter_crossbow.png"), weight: 2 },
          { id: "kodai_insignia", name: "Kodai insignia", icon: wikiIcon("Kodai_insignia.png"), weight: 2 },
          { id: "elder_maul", name: "Elder maul", icon: wikiIcon("Elder_maul.png"), weight: 2 },
          { id: "ancestral_robe_top", name: "Ancestral robe top", icon: wikiIcon("Ancestral_robe_top.png"), weight: 2 },
          { id: "ancestral_robe_bottom", name: "Ancestral robe bottom", icon: wikiIcon("Ancestral_robe_bottom.png"), weight: 2 },
          // 1/10 chance for bond
          { id: "bond", name: "Old School Bond", icon: wikiIcon("Old_School_Bond.png"), weight: 0.6 }
        ]
      },
      failLoot: {
        coins: [38000, 130000],
        rolls: [1, 3],
        common: [
          { id: "adamantite_ore", name: "Adamantite ore", icon: wikiIcon("Adamantite_ore.png"), qtyMin: 8, qtyMax: 22, weight: 20 },
          { id: "death_rune", name: "Death rune", icon: wikiIcon("Death_rune.png"), qtyMin: 80, qtyMax: 220, weight: 20 },
          { id: "super_restore_4", name: "Super restore(4)", icon: wikiIcon("Super_restore(4).png"), qtyMin: 2, qtyMax: 6, weight: 12 },
          { id: "shark", name: "Shark", icon: wikiIcon("Shark.png"), qtyMin: 10, qtyMax: 24, weight: 16 }
        ]
      }
    },
    {
      id: "tob",
      name: "Theatre of Blood",
      icon: wikiIcon("Theatre_of_Blood.png"),
      requirements: { combat: 105, attack: 80, strength: 80, defence: 75, ranged: 1, magic: 1, prayer: 1 },
      tuning: { difficulty: 0.88, uniqueChance: 0.07 },
      successLoot: {
        coins: [220000, 760000],
        commonRolls: [2, 4],
        common: [
          { id: "blood_rune", name: "Blood rune", icon: wikiIcon("Blood_rune.png"), qtyMin: 180, qtyMax: 620, weight: 18 },
          { id: "soul_rune", name: "Soul rune", icon: wikiIcon("Soul_rune.png"), qtyMin: 140, qtyMax: 520, weight: 16 },
          { id: "rune_arrow", name: "Rune arrow", icon: wikiIcon("Rune_arrow_5.png"), qtyMin: 120, qtyMax: 380, weight: 18 },
          { id: "snapdragon", name: "Snapdragon", icon: wikiIcon("Snapdragon.png"), qtyMin: 25, qtyMax: 80, weight: 14 },
          { id: "raw_shark", name: "Raw shark", icon: wikiIcon("Raw_shark.png"), qtyMin: 30, qtyMax: 100, weight: 14 }
        ],
        uniques: [
          { id: "ghrazi_rapier", name: "Ghrazi rapier", icon: wikiIcon("Ghrazi_rapier.png"), weight: 2 },
          { id: "sanguinesti_staff_uncharged", name: "Sanguinesti staff (uncharged)", icon: wikiIcon("Sanguinesti_staff_(uncharged).png"), weight: 2 },
          { id: "scythe_of_vitur_uncharged", name: "Scythe of vitur (uncharged)", icon: wikiIcon("Scythe_of_vitur_(uncharged).png"), weight: 1 },
          { id: "justiciar_faceguard", name: "Justiciar faceguard", icon: wikiIcon("Justiciar_faceguard.png"), weight: 2 },
          { id: "justiciar_chestguard", name: "Justiciar chestguard", icon: wikiIcon("Justiciar_chestguard.png"), weight: 2 },
          { id: "justiciar_legguards", name: "Justiciar legguards", icon: wikiIcon("Justiciar_legguards.png"), weight: 2 },
          // 1/10 chance for bond
          { id: "bond", name: "Old School Bond", icon: wikiIcon("Old_School_Bond.png"), weight: 0.6 }
        ]
      },
      failLoot: {
        coins: [30000, 120000],
        rolls: [1, 2],
        common: [
          { id: "death_rune", name: "Death rune", icon: wikiIcon("Death_rune.png"), qtyMin: 70, qtyMax: 220, weight: 20 },
          { id: "dark_crab", name: "Dark crab", icon: wikiIcon("Dark_crab.png"), qtyMin: 6, qtyMax: 20, weight: 18 },
          { id: "coal", name: "Coal", icon: wikiIcon("Coal.png"), qtyMin: 50, qtyMax: 160, weight: 16 },
          { id: "adamantite_ore", name: "Adamantite ore", icon: wikiIcon("Adamantite_ore.png"), qtyMin: 6, qtyMax: 16, weight: 16 }
        ]
      }
    },
    {
      id: "toa",
      name: "Tombs of Amascut",
      icon: wikiIcon("Tombs_of_Amascut.png"),
      requirements: { combat: 95, attack: 75, strength: 75, defence: 70, ranged: 1, magic: 1, prayer: 1 },
      tuning: { difficulty: 0.92, uniqueChance: 0.065 },
      successLoot: {
        coins: [200000, 680000],
        commonRolls: [2, 4],
        common: [
          { id: "soul_rune", name: "Soul rune", icon: wikiIcon("Soul_rune.png"), qtyMin: 150, qtyMax: 500, weight: 16 },
          { id: "dragon_dart", name: "Dragon dart", icon: wikiIcon("Dragon_dart.png"), qtyMin: 60, qtyMax: 210, weight: 18 },
          { id: "dragon_arrow", name: "Dragon arrow", icon: wikiIcon("Dragon_arrow_5.png"), qtyMin: 45, qtyMax: 170, weight: 18 },
          { id: "magic_log", name: "Magic logs", icon: wikiIcon("Magic_logs.png"), qtyMin: 25, qtyMax: 75, weight: 14 },
          { id: "coconut_milk", name: "Coconut milk", icon: wikiIcon("Coconut_milk.png"), qtyMin: 18, qtyMax: 55, weight: 12 }
        ],
        uniques: [
          { id: "tumekens_shadow", name: "Tumeken's shadow", icon: wikiIcon("Tumeken%27s_shadow.png"), weight: 1 },
          { id: "masori_mask", name: "Masori mask", icon: wikiIcon("Masori_mask.png"), weight: 2 },
          { id: "masori_body", name: "Masori body", icon: wikiIcon("Masori_body.png"), weight: 2 },
          { id: "masori_chaps", name: "Masori chaps", icon: wikiIcon("Masori_chaps.png"), weight: 2 },
          { id: "fang", name: "Osmumten's fang", icon: wikiIcon("Osmumten%27s_fang.png"), weight: 2 },
          { id: "lightbearer", name: "Lightbearer", icon: wikiIcon("Lightbearer.png"), weight: 3 },
          // 1/10 chance for bond
          { id: "bond", name: "Old School Bond", icon: wikiIcon("Old_School_Bond.png"), weight: 0.6 }
        ]
      },
      failLoot: {
        coins: [28000, 110000],
        rolls: [1, 2],
        common: [
          { id: "law_rune", name: "Law rune", icon: wikiIcon("Law_rune.png"), qtyMin: 90, qtyMax: 260, weight: 18 },
          { id: "raw_lobster", name: "Raw lobster", icon: wikiIcon("Raw_lobster.png"), qtyMin: 18, qtyMax: 55, weight: 18 },
          { id: "granite_dust", name: "Granite dust", icon: wikiIcon("Granite_dust.png"), qtyMin: 70, qtyMax: 220, weight: 16 },
          { id: "gold_ore", name: "Gold ore", icon: wikiIcon("Gold_ore.png"), qtyMin: 18, qtyMax: 50, weight: 16 }
        ]
      }
    }
  ];

  const VOID_REWARD_DEFS = [
    {
      id: "void_knight_top",
      name: "Void knight top",
      icon: wikiIcon("Void_knight_top.png"),
      cost: 25,
      slot: "body",
      bonuses: { attack_stab: 18, attack_slash: 18, attack_crush: 18, attack_ranged: 12, attack_magic: 12, defence_stab: 42, defence_slash: 45, defence_crush: 48, defence_ranged: 45, defence_magic: 42 }
    },
    {
      id: "void_knight_robe",
      name: "Void knight robe",
      icon: wikiIcon("Void_knight_robe.png"),
      cost: 25,
      slot: "legs",
      bonuses: { attack_stab: 12, attack_slash: 12, attack_crush: 12, attack_ranged: 8, attack_magic: 8, defence_stab: 30, defence_slash: 32, defence_crush: 34, defence_ranged: 32, defence_magic: 30 }
    },
    {
      id: "void_melee_helm",
      name: "Void melee helm",
      icon: wikiIcon("Void_melee_helm.png"),
      cost: 25,
      slot: "head",
      bonuses: { attack_stab: 10, attack_slash: 10, attack_crush: 10, defence_stab: 8, defence_slash: 8, defence_crush: 8 }
    },
    {
      id: "void_ranger_helm",
      name: "Void ranger helm",
      icon: wikiIcon("Void_ranger_helm.png"),
      cost: 25,
      slot: "head",
      bonuses: { attack_ranged: 12, defence_stab: 8, defence_slash: 8, defence_crush: 8, defence_ranged: 8 }
    },
    {
      id: "void_mage_helm",
      name: "Void mage helm",
      icon: wikiIcon("Void_mage_helm.png"),
      cost: 25,
      slot: "head",
      bonuses: { attack_magic: 12, magic_damage: 3, defence_stab: 8, defence_slash: 8, defence_crush: 8, defence_magic: 8 }
    },
    {
      id: "void_knight_gloves",
      name: "Void knight gloves",
      icon: wikiIcon("Void_knight_gloves.png"),
      cost: 25,
      slot: "hands",
      bonuses: { attack_stab: 4, attack_slash: 4, attack_crush: 4, attack_ranged: 4, attack_magic: 4, melee_strength: 2, defence_stab: 8, defence_slash: 8, defence_crush: 8 }
    }
  ];

  const CHALLENGE_FIGHT_DEFS = [
    {
      id: "jad_trial",
      name: "TzTok-Jad Trial",
      icon: wikiIcon("TzTok-Jad.png"),
      reqCombat: 70,
      reqRanged: 1,
      reqPrayer: 1,
      gearScale: 190,
      reward: {
        id: "uncut_onyx",
        name: "Uncut onyx",
        icon: wikiIcon("Uncut_onyx.png"),
        slot: "inventory",
        bonuses: {}
      }
    },
    {
      id: "fight_caves",
      name: "Fight Caves (Full)",
      icon: wikiIcon("Fight_Caves.png"),
      reqCombat: 75,
      reqRanged: 1,
      reqPrayer: 1,
      gearScale: 205,
      reward: {
        id: "fire_cape",
        name: "Fire cape",
        icon: wikiIcon("Fire_cape.png"),
        slot: "cape",
        bonuses: { attack_stab: 1, attack_slash: 1, attack_crush: 1, attack_magic: 1, attack_ranged: 1, melee_strength: 4, defence_stab: 11, defence_slash: 11, defence_crush: 11, defence_magic: 11, defence_ranged: 11 }
      }
    },
    {
      id: "inferno",
      name: "Inferno (TzKal-Zuk)",
      icon: wikiIcon("TzKal-Zuk.png"),
      reqCombat: 110,
      reqRanged: 1,
      reqPrayer: 1,
      gearScale: 260,
      reward: {
        id: "infernal_cape",
        name: "Infernal cape",
        icon: wikiIcon("Infernal_cape.png"),
        slot: "cape",
        bonuses: { attack_stab: 800, attack_slash: 800, attack_crush: 800, attack_magic: 800, attack_ranged: 200, melee_strength: 1600, defence_stab: 2400, defence_slash: 2400, defence_crush: 2400, defence_magic: 2400, defence_ranged: 2400 }
      }
    }
  ];

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function randInt(min, max) {
    const lo = Math.floor(min);
    const hi = Math.floor(max);
    return lo + Math.floor(Math.random() * Math.max(1, hi - lo + 1));
  }

  function weightedPick(items) {
    const total = items.reduce((sum, entry) => sum + (Number(entry.weight) || 0), 0);
    if (total <= 0) return null;
    let roll = Math.random() * total;
    for (let i = 0; i < items.length; i++) {
      roll -= Number(items[i].weight) || 0;
      if (roll <= 0) return items[i];
    }
    return items[items.length - 1] || null;
  }

  function getSkillLevel(name) {
    return Math.max(1, Number(window.Player?.skills?.[name]?.level) || 1);
  }

  function getPlayerCombatLevel(player = window.Player) {
    const attack = Math.max(1, Number(player?.skills?.Attack?.level) || 1);
    const strength = Math.max(1, Number(player?.skills?.Strength?.level) || 1);
    const defence = Math.max(1, Number(player?.skills?.Defence?.level) || 1);
    const hitpoints = Math.max(10, Number(player?.skills?.Hitpoints?.level) || 10);
    const prayer = Math.max(1, Number(player?.skills?.Prayer?.level) || 1);
    const ranged = Math.max(1, Number(player?.skills?.Ranged?.level) || 1);
    const magic = Math.max(1, Number(player?.skills?.Magic?.level) || 1);

    const base = 0.25 * (defence + hitpoints + Math.floor(prayer / 2));
    const melee = 0.325 * (attack + strength);
    const ranger = 0.325 * Math.floor(ranged * 1.5);
    const mage = 0.325 * Math.floor(magic * 1.5);
    return Math.max(3, Math.floor(base + Math.max(melee, ranger, mage)));
  }

  function readBonus(item, snakeKey, displayKey) {
    if (!item?.bonuses) return 0;
    const bonuses = item.bonuses;
    const snakeVal = Number(bonuses[snakeKey]);
    if (Number.isFinite(snakeVal)) return snakeVal;
    const displayVal = Number(bonuses[displayKey]);
    return Number.isFinite(displayVal) ? displayVal : 0;
  }

  function getEquipmentPower() {
    const slots = window.Player?.equipment?.slots || {};
    const totals = {
      atk: 0,
      def: 0,
      meleeStr: 0,
      rangedAtk: 0,
      rangedStr: 0,
      magicAtk: 0,
      magicDmg: 0
    };

    Object.values(slots).forEach((item) => {
      if (!item) return;
      const stabAtk = readBonus(item, "attack_stab", "Stab");
      const slashAtk = readBonus(item, "attack_slash", "Slash");
      const crushAtk = readBonus(item, "attack_crush", "Crush");
      const stabDef = readBonus(item, "defence_stab", "Stab Defence");
      const slashDef = readBonus(item, "defence_slash", "Slash Defence");
      const crushDef = readBonus(item, "defence_crush", "Crush Defence");
      const rangedDef = readBonus(item, "defence_ranged", "Ranged Defence");
      const magicDef = readBonus(item, "defence_magic", "Magic Defence");

      totals.atk += Math.max(stabAtk, slashAtk, crushAtk);
      totals.def += (stabDef + slashDef + crushDef + rangedDef + magicDef) / 5;
      totals.meleeStr += readBonus(item, "melee_strength", "Melee Strength");
      totals.rangedAtk += readBonus(item, "attack_ranged", "Ranged");
      totals.rangedStr += readBonus(item, "ranged_strength", "Ranged Strength");
      totals.magicAtk += readBonus(item, "attack_magic", "Magic");
      totals.magicDmg += readBonus(item, "magic_damage", "Magic Damage");
    });

    return totals;
  }

  function getRaidState() {
    if (!window.Player) return null;
    window.Player.combat = window.Player.combat || {};
    const raids = window.Player.combat.raids || {};
    if (!raids.completionsById || typeof raids.completionsById !== "object") raids.completionsById = {};
    if (!raids.failsById || typeof raids.failsById !== "object") raids.failsById = {};
    if (!Array.isArray(raids.lastRuns)) raids.lastRuns = [];
    if (!raids.cooldownsById || typeof raids.cooldownsById !== "object") raids.cooldownsById = {};
    window.Player.combat.raids = raids;
    return raids;
  }

  function getPestControlState() {
    if (!window.Player) return null;
    window.Player.combat = window.Player.combat || {};
    const pest = window.Player.combat.pestControl || {};
    if (!pest.purchases || typeof pest.purchases !== "object") pest.purchases = {};
    pest.points = Math.max(0, Number(pest.points) || 0);
    pest.gamesWon = Math.max(0, Number(pest.gamesWon) || 0);
    pest.gamesLost = Math.max(0, Number(pest.gamesLost) || 0);
    window.Player.combat.pestControl = pest;
    return pest;
  }

  function evaluatePestControlChance() {
    const combat = getPlayerCombatLevel();
    if (combat < 40) return { chance: 0, blocked: true, reason: "Requires combat level 40" };

    const gear = getEquipmentPower();
    const gearPowerRaw =
      (gear.atk * 0.5) +
      (gear.meleeStr * 1.0) +
      (gear.def * 0.85) +
      (gear.rangedAtk * 0.55) +
      (gear.rangedStr * 0.9) +
      (gear.magicAtk * 0.3) +
      (gear.magicDmg * 4.0);
    const gearScore = clamp(gearPowerRaw / 210, 0, 1);

    if (gearScore < 0.04) return { chance: 0, blocked: true, reason: "Equip better gear to queue" };

    const combatScore = clamp((combat - 40) / 86, 0, 1);
    const chance = clamp(0.22 + (combatScore * 0.4) + (gearScore * 0.38), 0.2, 0.98);
    return { chance, blocked: false, reason: "" };
  }

  function runPestControl() {
    const state = getPestControlState();
    const evalResult = evaluatePestControlChance();
    if (evalResult.blocked || evalResult.chance <= 0) {
      return { ok: false, message: evalResult.reason || "Cannot start Pest Control." };
    }

    const win = Math.random() < evalResult.chance;
    if (win) {
      const points = 3 + Math.max(0, Math.floor(evalResult.chance * 3));
      state.points += points;
      state.gamesWon += 1;
      RSGame.Game?.saveNow?.();
      return { ok: true, message: "Pest Control won. +" + points + " points." };
    }

    state.gamesLost += 1;
    state.points += 1;
    RSGame.Game?.saveNow?.();
    return { ok: true, message: "Pest Control lost. +1 consolation point." };
  }

  function buyVoidReward(rewardId) {
    const state = getPestControlState();
    const reward = VOID_REWARD_DEFS.find((r) => r.id === rewardId);
    if (!reward) return { ok: false, message: "Unknown reward." };
    if (state.purchases[reward.id]) return { ok: false, message: reward.name + " already unlocked." };
    if (state.points < reward.cost) return { ok: false, message: "Not enough Pest points." };

    state.points -= reward.cost;
    state.purchases[reward.id] = true;

    const added = window.Player?.inventory?.addItem?.({
      id: reward.id,
      name: reward.name,
      qty: 1,
      icon: reward.icon,
      slot: reward.slot,
      bonuses: reward.bonuses
    });

    if (!added) {
      RSGame.Bank?.ensureBankState?.(window.Player);
      const bankItems = window.Player?.bank?.items;
      if (bankItems) {
        bankItems[reward.id] = bankItems[reward.id] || {
          id: reward.id,
          name: reward.name,
          icon: reward.icon,
          category: "Pest Control",
          qty: 0,
          discovered: true
        };
        bankItems[reward.id].qty = (Number(bankItems[reward.id].qty) || 0) + 1;
        bankItems[reward.id].discovered = true;
      }
    }

    RSGame.UI?.renderInventory?.(window.Player);
    RSGame.Bank?.refresh?.();
    RSGame.Game?.saveNow?.();
    RSGame.Bank?.recordLegitimateObtain?.(window.Player, { id: reward.id, name: reward.name, icon: reward.icon, category: "Pest Control" }, 1);
    return { ok: true, message: "Unlocked " + reward.name + "." + (added ? "" : " Sent to bank (inventory full).") };
  }

  function getBarbarianAssaultState() {
    if (!window.Player) return null;
    window.Player.combat = window.Player.combat || {};
    const ba = window.Player.combat.barbarianAssault || {};
    ba.honorPoints = Math.max(0, Number(ba.honorPoints) || 0);
    ba.wavesCleared = Math.max(0, Number(ba.wavesCleared) || 0);
    ba.gamesWon = Math.max(0, Number(ba.gamesWon) || 0);
    ba.gamesLost = Math.max(0, Number(ba.gamesLost) || 0);
    ba.fighterTorsoUnlocked = !!ba.fighterTorsoUnlocked;
    window.Player.combat.barbarianAssault = ba;
    return ba;
  }

  function evaluateBarbarianAssaultChance() {
    const combat = getPlayerCombatLevel();
    if (combat < 45) return { chance: 0, blocked: true, reason: "Requires combat level 45" };

    const gear = getEquipmentPower();
    const gearPowerRaw =
      (gear.atk * 0.6) +
      (gear.meleeStr * 1.2) +
      (gear.def * 0.9) +
      (gear.rangedAtk * 0.2) +
      (gear.magicAtk * 0.2);
    const gearScore = clamp(gearPowerRaw / 220, 0, 1);

    if (gearScore < 0.05) return { chance: 0, blocked: true, reason: "Equip combat gear to start" };

    const combatScore = clamp((combat - 45) / 80, 0, 1);
    const chance = clamp(0.28 + (combatScore * 0.42) + (gearScore * 0.35), 0.25, 0.96);
    return { chance, blocked: false, reason: "" };
  }

  function runBarbarianAssault() {
    const state = getBarbarianAssaultState();
    const evalResult = evaluateBarbarianAssaultChance();
    if (evalResult.blocked || evalResult.chance <= 0) {
      return { ok: false, message: evalResult.reason || "Cannot start Barbarian Assault." };
    }

    const win = Math.random() < evalResult.chance;
    const cleared = 5 + Math.max(1, Math.floor(evalResult.chance * 5));
    state.wavesCleared += cleared;

    if (win) {
      const points = 8 + Math.max(0, Math.floor(evalResult.chance * 7));
      state.honorPoints += points;
      state.gamesWon += 1;
      RSGame.Game?.saveNow?.();
      return { ok: true, message: "Barbarian Assault clear. +" + points + " honor points." };
    }

    state.honorPoints += 2;
    state.gamesLost += 1;
    RSGame.Game?.saveNow?.();
    return { ok: true, message: "Barbarian Assault failed. +2 honor points." };
  }

  function buyFighterTorso() {
    const state = getBarbarianAssaultState();
    const cost = 40;
    if (state.fighterTorsoUnlocked) return { ok: false, message: "Fighter torso already unlocked." };
    if (state.honorPoints < cost) return { ok: false, message: "Need " + cost + " honor points." };

    state.honorPoints -= cost;
    state.fighterTorsoUnlocked = true;

    const item = {
      id: "fighter_torso",
      name: "Fighter torso",
      qty: 1,
      icon: wikiIcon("Fighter_torso.png"),
      slot: "body",
      bonuses: {
        attack_stab: 4,
        attack_slash: 4,
        attack_crush: 4,
        melee_strength: 4,
        defence_stab: 85,
        defence_slash: 82,
        defence_crush: 80,
        defence_ranged: -40,
        defence_magic: -10
      }
    };

    const added = window.Player?.inventory?.addItem?.(item);
    if (!added) {
      RSGame.Bank?.ensureBankState?.(window.Player);
      const bankItems = window.Player?.bank?.items;
      if (bankItems) {
        bankItems[item.id] = bankItems[item.id] || {
          id: item.id,
          name: item.name,
          icon: item.icon,
          category: "Barbarian Assault",
          qty: 0,
          discovered: true
        };
        bankItems[item.id].qty = (Number(bankItems[item.id].qty) || 0) + 1;
        bankItems[item.id].discovered = true;
      }
    }

    RSGame.UI?.renderInventory?.(window.Player);
    RSGame.Bank?.refresh?.();
    RSGame.Game?.saveNow?.();
    RSGame.Bank?.recordLegitimateObtain?.(window.Player, { id: item.id, name: item.name, icon: item.icon, category: "Barbarian Assault" }, 1);
    return { ok: true, message: "Fighter torso unlocked." + (added ? "" : " Sent to bank (inventory full).") };
  }

  function getChallengeFightState() {
    if (!window.Player) return null;
    window.Player.combat = window.Player.combat || {};
    const st = window.Player.combat.challengeFights || {};
    if (!st.completions || typeof st.completions !== "object") st.completions = {};
    if (!st.unlocks || typeof st.unlocks !== "object") st.unlocks = {};
    st.attempts = Math.max(0, Number(st.attempts) || 0);
    st.fails = Math.max(0, Number(st.fails) || 0);
    window.Player.combat.challengeFights = st;
    return st;
  }

  function evaluateChallengeFightChance(def) {
    const combat = getPlayerCombatLevel();
    const ranged = getSkillLevel("Ranged");
    const prayer = getSkillLevel("Prayer");
    if (combat < def.reqCombat) return { chance: 0, blocked: true, reason: "Requires combat " + def.reqCombat };
    if (ranged < def.reqRanged) return { chance: 0, blocked: true, reason: "Requires Ranged " + def.reqRanged };
    if (prayer < def.reqPrayer) return { chance: 0, blocked: true, reason: "Requires Prayer " + def.reqPrayer };

    const gear = getEquipmentPower();
    const gearPowerRaw =
      (gear.atk * 0.3) +
      (gear.meleeStr * 0.5) +
      (gear.def * 0.9) +
      (gear.rangedAtk * 0.85) +
      (gear.rangedStr * 1.1) +
      (gear.magicAtk * 0.25) +
      (gear.magicDmg * 2.2);
    const gearScore = clamp(gearPowerRaw / Math.max(140, Number(def.gearScale) || 200), 0, 1);
    if (gearScore < 0.06) return { chance: 0, blocked: true, reason: "Gear is too weak" };

    const combatScore = clamp((combat - def.reqCombat + 20) / 80, 0, 1);
    const rangedScore = clamp((ranged - def.reqRanged + 15) / 60, 0, 1);
    const prayerScore = clamp((prayer - def.reqPrayer + 12) / 50, 0, 1);
    const chance = clamp(0.18 + (combatScore * 0.25) + (rangedScore * 0.22) + (prayerScore * 0.16) + (gearScore * 0.35), 0.08, 0.96);
    return { chance, blocked: false, reason: "" };
  }

  function runChallengeFight(def) {
    const state = getChallengeFightState();
    const evalResult = evaluateChallengeFightChance(def);
    if (evalResult.blocked || evalResult.chance <= 0) {
      return { ok: false, message: evalResult.reason || "Cannot start challenge." };
    }

    state.attempts += 1;
    const win = Math.random() < evalResult.chance;
    if (!win) {
      state.fails += 1;
      RSGame.Game?.saveNow?.();
      return { ok: true, message: def.name + " failed. Study rotations and try again." };
    }

    state.completions[def.id] = (Number(state.completions[def.id]) || 0) + 1;
    state.unlocks[def.reward.id] = true;

    const added = window.Player?.inventory?.addItem?.({
      id: def.reward.id,
      name: def.reward.name,
      qty: 1,
      icon: def.reward.icon,
      slot: def.reward.slot,
      bonuses: def.reward.bonuses
    });

    if (!added) {
      RSGame.Bank?.ensureBankState?.(window.Player);
      const bankItems = window.Player?.bank?.items;
      if (bankItems) {
        bankItems[def.reward.id] = bankItems[def.reward.id] || {
          id: def.reward.id,
          name: def.reward.name,
          icon: def.reward.icon,
          category: "Minigames",
          qty: 0,
          discovered: true
        };
        bankItems[def.reward.id].qty = (Number(bankItems[def.reward.id].qty) || 0) + 1;
        bankItems[def.reward.id].discovered = true;
      }
    }

    RSGame.UI?.renderInventory?.(window.Player);
    RSGame.Bank?.refresh?.();
    RSGame.Game?.saveNow?.();
    RSGame.Bank?.recordLegitimateObtain?.(window.Player, { id: def.reward.id, name: def.reward.name, icon: def.reward.icon, category: "Minigames" }, 1);
    return { ok: true, message: def.name + " clear. " + def.reward.name + " awarded" + (added ? "." : " to bank.") };
  }

  function evaluateRaidChance(raidDef) {
    const req = raidDef.requirements;
    const combat = getPlayerCombatLevel();

    if (combat < req.combat) {
      return { chance: 0, blocked: true, reason: "Combat level too low" };
    }

    const skillChecks = [
      { skill: "Attack", req: req.attack },
      { skill: "Strength", req: req.strength },
      { skill: "Defence", req: req.defence },
      { skill: "Ranged", req: req.ranged },
      { skill: "Magic", req: req.magic },
      { skill: "Prayer", req: req.prayer }
    ];

    let reqMet = true;
    let skillScore = 0;
    skillChecks.forEach((entry) => {
      const lvl = getSkillLevel(entry.skill);
      if (lvl < entry.req) reqMet = false;
      const ratio = entry.req <= 0 ? 1 : (lvl / entry.req);
      skillScore += clamp((ratio - 0.65) / 0.7, 0, 1.25);
    });
    skillScore = clamp(skillScore / skillChecks.length, 0, 1);

    if (!reqMet) {
      return { chance: 0, blocked: true, reason: "Skill requirements not met" };
    }

    const gear = getEquipmentPower();
    const gearPowerRaw =
      (gear.atk * 0.55) +
      (gear.meleeStr * 1.15) +
      (gear.def * 0.8) +
      (gear.rangedAtk * 0.4) +
      (gear.rangedStr * 0.9) +
      (gear.magicAtk * 0.25) +
      (gear.magicDmg * 5.2);

    const gearScore = clamp(gearPowerRaw / 230, 0, 1);

    if (gearScore < 0.08) {
      return { chance: 0, blocked: true, reason: "Gear too weak (naked/undergeared)" };
    }

    const combatHeadroom = clamp((combat - req.combat + 20) / 55, 0, 1);
    let chance = ((skillScore * 0.43) + (combatHeadroom * 0.17) + (gearScore * 0.4)) * (raidDef.tuning?.difficulty || 1);

    if (RSGame.CustomItems?.hasHazelmereSignetRing?.(window.Player)) {
      chance *= 10;
    }

    if (gearScore < 0.22) chance *= 0.72;
    if (gearScore > 0.92 && skillScore > 0.9) chance = 1;

    chance = clamp(chance, 0, 1);
    return { chance, blocked: false, reason: "" };
  }

  function addReward(item, qty, source) {
    if (!window.Player?.inventory || !item) return false;
    const sourceKey = source || "raids";
    const baseAmount = Math.max(1, Number(qty) || 1);
    const amount = item.id === "coins"
      ? Math.max(1, Number(RSGame.MagicPerks?.applyCoinRewardMultiplier?.(baseAmount, sourceKey, window.Player) ?? baseAmount) || 1)
      : baseAmount;
    const added = window.Player.inventory.addItem({
      id: item.id,
      name: item.name,
      qty: amount,
      icon: item.icon
    });

    if (added) return true;

    RSGame.Bank?.ensureBankState?.(window.Player);
    const bankItems = window.Player?.bank?.items;
    if (!bankItems) return false;

    if (!bankItems[item.id]) {
      bankItems[item.id] = {
        id: item.id,
        name: item.name,
        icon: item.icon,
        category: "Raids",
        qty: 0,
        discovered: true
      };
    }

    bankItems[item.id].qty = (Number(bankItems[item.id].qty) || 0) + amount;
    bankItems[item.id].discovered = true;
    return true;
  }

  function rollCommonLoot(table, rolls) {
    const rewards = [];
    for (let i = 0; i < rolls; i++) {
      const picked = weightedPick(table || []);
      if (!picked) continue;
      const qty = randInt(picked.qtyMin || 1, picked.qtyMax || 1);
      addReward(picked, qty, "raids");
      rewards.push((Number(qty) || 1) + "x " + picked.name);
    }
    return rewards;
  }

  function runRaid(raidDef) {
    const state = getRaidState();
    const evalResult = evaluateRaidChance(raidDef);
    // 30-minute cooldown logic for specific raids
    const COOLDOWN_RAIDS = ["cox", "cox_cm", "tob", "toa"];
    // const COOLDOWN_MS = 30 * 60 * 1000;
    const COOLDOWN_MS = 1000; // TEMP: 1 second cooldown for testing
    if (COOLDOWN_RAIDS.includes(raidDef.id)) {
      const now = Date.now();
      const cd = state.cooldownsById[raidDef.id] || 0;
      if (cd && now < cd) {
        const mins = Math.ceil((cd - now) / 60000);
        return {
          ok: false,
          message: raidDef.name + " cooldown active: " + mins + "m remaining."
        };
      }
      // Set new cooldown
      state.cooldownsById[raidDef.id] = now + COOLDOWN_MS;
    }

    if (evalResult.blocked || evalResult.chance <= 0) {
      return {
        ok: false,
        message: raidDef.name + " unavailable: " + (evalResult.reason || "requirements not met") + "."
      };
    }

    const batchSize = sessionStorage.getItem("rsgame.devUnlocked.v1") === "1" ? 100 : 1;
    const rewardLines = [];
    let totalCoinQty = 0;
    let totalClears = 0;
    let totalFails = 0;

    for (let batchIndex = 0; batchIndex < batchSize; batchIndex++) {
      const success = Math.random() < evalResult.chance;
      const lootInfo = success ? raidDef.successLoot : raidDef.failLoot;
      const coinQty = randInt(lootInfo.coins[0], lootInfo.coins[1]);
      totalCoinQty += coinQty;
      addReward({ id: "coins", name: "Coins", icon: wikiIcon("Coins_10000.png") }, coinQty, "raids");

      if (success) {
        totalClears += 1;
        const commonRolls = randInt(lootInfo.commonRolls[0], lootInfo.commonRolls[1]);
        rewardLines.push(...rollCommonLoot(lootInfo.common, commonRolls));

        const uniqueChance = clamp((raidDef.tuning?.uniqueChance || 0) * (0.75 + evalResult.chance * 0.55), 0, 0.35);
        if (Math.random() < uniqueChance) {
          const unique = weightedPick(lootInfo.uniques || []);
          if (unique) {
            addReward(unique, 1, "raids");
            rewardLines.push("UNIQUE: " + unique.name);
          }
        }

        state.completionsById[raidDef.id] = (Number(state.completionsById[raidDef.id]) || 0) + 1;
      } else {
        totalFails += 1;
        const failRolls = randInt(lootInfo.rolls[0], lootInfo.rolls[1]);
        rewardLines.push(...rollCommonLoot(lootInfo.common, failRolls));
        state.failsById[raidDef.id] = (Number(state.failsById[raidDef.id]) || 0) + 1;
      }
    }

    const finalCoinQty = Math.max(1, Number(RSGame.MagicPerks?.applyCoinRewardMultiplier?.(totalCoinQty, "raids", window.Player) ?? totalCoinQty) || 1);
    rewardLines.unshift(finalCoinQty.toLocaleString() + " coins");

    state.lastRuns.unshift({
      raidId: raidDef.id,
      raidName: raidDef.name,
      success: totalClears > 0,
      chance: evalResult.chance,
      rewards: rewardLines.slice(0, 5),
      at: Date.now(),
      batchSize,
      clears: totalClears,
      fails: totalFails
    });
    state.lastRuns = state.lastRuns.slice(0, 12);

    RSGame.UI?.renderInventory?.(window.Player);
    RSGame.Bank?.refresh?.();
    RSGame.Game?.saveNow?.();

    return {
      ok: true,
      message:
        (totalClears > 0 ? "Raid clear" : "Raid failed") +
        " - " + raidDef.name +
        (batchSize > 1 ? ` x${batchSize} batch` : "") +
        ". " + rewardLines.slice(0, 4).join(", ")
    };
  }

  function prettyReqs(req) {
    return [
      "CB " + req.combat,
      "Atk " + req.attack,
      "Str " + req.strength,
      "Def " + req.defence,
      "Rng " + req.ranged,
      "Mag " + req.magic,
      "Pray " + req.prayer
    ].join(" | ");
  }

  function buildMinigamesPanel(main) {
    const panel = document.createElement("section");
    panel.className = "panel minigames-panel";
    panel.dataset.panel = "minigames";
    panel.style.display = "none";
    panel.innerHTML = `
      <h2>Minigames</h2>
      <div class="raids-shell">
        <div class="raids-header-row">
          <div>
            <div class="raids-title">OSRS Raids Simulator</div>
            <div class="raids-sub">Completion chance scales with combat stats + equipped gear quality.</div>
          </div>
          <div id="raids-run-summary" class="raids-run-summary"></div>
        </div>
        <div id="raids-grid" class="raids-grid"></div>
        <div id="raids-status" class="raids-status"></div>
        <div id="raids-history" class="raids-history"></div>
      </div>
      <div class="pest-shell">
        <div class="raids-header-row">
          <div>
            <div class="raids-title">Pest Control Simulator</div>
            <div class="raids-sub">Earn Pest points and trade them for Void Knight gear.</div>
          </div>
          <div id="pest-summary" class="raids-run-summary"></div>
        </div>
        <div id="pest-status" class="raids-status"></div>
        <div class="pest-actions-row">
          <button id="pest-run-btn" class="raid-run-btn">Run Pest Control</button>
        </div>
        <div id="pest-rewards" class="pest-rewards-grid"></div>
      </div>
      <div class="pest-shell">
        <div class="raids-header-row">
          <div>
            <div class="raids-title">Barbarian Assault Simulator</div>
            <div class="raids-sub">Earn honor points and trade for Fighter torso.</div>
          </div>
          <div id="ba-summary" class="raids-run-summary"></div>
        </div>
        <div id="ba-status" class="raids-status"></div>
        <div class="pest-actions-row">
          <button id="ba-run-btn" class="raid-run-btn">Run Barbarian Assault</button>
          <button id="ba-buy-torso-btn" class="raid-run-btn">Buy Fighter Torso (40)</button>
        </div>
      </div>
      <div class="pest-shell">
        <div class="raids-header-row">
          <div>
            <div class="raids-title">Challenge Fights</div>
            <div class="raids-sub">Jad/Fire Cape and Inferno/Zuk simulation runs.</div>
          </div>
          <div id="challenge-summary" class="raids-run-summary"></div>
        </div>
        <div id="challenge-status" class="raids-status"></div>
        <div id="challenge-grid" class="pest-rewards-grid"></div>
      </div>
    `;
    main.appendChild(panel);
    return panel;
  }

  function renderPestControlPanel() {
    const summary = document.getElementById("pest-summary");
    const status = document.getElementById("pest-status");
    const runBtn = document.getElementById("pest-run-btn");
    const rewardsWrap = document.getElementById("pest-rewards");
    if (!summary || !runBtn || !rewardsWrap) return;

    const state = getPestControlState();
    const evalResult = evaluatePestControlChance();
    const pct = Math.round((evalResult.chance || 0) * 100);

    summary.textContent = "Points: " + state.points + " | Wins: " + state.gamesWon + " | Losses: " + state.gamesLost + " | Win chance: " + pct + "%";
    runBtn.disabled = !!evalResult.blocked;
    if (status && evalResult.blocked) {
      status.textContent = evalResult.reason;
      status.classList.add("error");
    }

    // 5 minute cooldown logic
    const pestCooldownKey = 'pestControlCooldown';
    const now = Date.now();
    const pestCd = window.Player.combat[pestCooldownKey] || 0;
    if (pestCd && now < pestCd) {
      runBtn.disabled = true;
      if (status) {
        const mins = Math.floor((pestCd - now) / 60000);
        const secs = Math.floor(((pestCd - now) % 60000) / 100);
        status.textContent = `Cooldown: ${mins}:${secs.toString().padStart(2, "0")}`;
        status.classList.add("error");
      }
    } else {
      runBtn.disabled = !!evalResult.blocked;
      runBtn.onclick = () => {
        const result = runPestControl();
        if (result.ok) {
          window.Player.combat[pestCooldownKey] = Date.now() + 15 * 60 * 1000;
        }
        if (status) {
          status.textContent = result.message;
          status.classList.toggle("error", !result.ok);
        }
        renderPestControlPanel();
      };
    }

    rewardsWrap.innerHTML = "";
    VOID_REWARD_DEFS.forEach((reward) => {
      const bought = !!state.purchases[reward.id];
      const card = document.createElement("div");
      card.className = "pest-reward-card" + (bought ? " bought" : "");
      card.innerHTML = `
        <div class="raid-top">
          <img class="raid-icon" src="${reward.icon}" alt="${reward.name}" onerror="this.onerror=null;this.src='https://oldschool.runescape.wiki/images/Combat_icon.png';" />
          <div>
            <div class="raid-name">${reward.name}</div>
            <div class="raid-reqs">Cost: ${reward.cost} points</div>
          </div>
        </div>
      `;
      const buyBtn = document.createElement("button");
      buyBtn.className = "raid-run-btn";
      buyBtn.textContent = bought ? "Unlocked" : "Buy";
      buyBtn.disabled = bought || state.points < reward.cost;
      buyBtn.addEventListener("click", () => {
        const result = buyVoidReward(reward.id);
        if (status) {
          status.textContent = result.message;
          status.classList.toggle("error", !result.ok);
        }
        renderPestControlPanel();
      });
      card.appendChild(buyBtn);
      rewardsWrap.appendChild(card);
    });
  }

  function renderBarbarianAssaultPanel() {
    const summary = document.getElementById("ba-summary");
    const status = document.getElementById("ba-status");
    const runBtn = document.getElementById("ba-run-btn");
    const buyBtn = document.getElementById("ba-buy-torso-btn");
    if (!summary || !runBtn || !buyBtn) return;

    const state = getBarbarianAssaultState();
    const evalResult = evaluateBarbarianAssaultChance();
    const pct = Math.round((evalResult.chance || 0) * 100);

    summary.textContent = "Honor: " + state.honorPoints + " | Waves: " + state.wavesCleared + " | Wins: " + state.gamesWon + " | Losses: " + state.gamesLost + " | Win chance: " + pct + "%";
    // 15 minute cooldown logic
    const baCooldownKey = 'barbarianAssaultCooldown';
    const now = Date.now();
    const baCd = window.Player.combat[baCooldownKey] || 0;
    if (baCd && now < baCd) {
      runBtn.disabled = true;
      if (status) {
        const mins = Math.floor((baCd - now) / 60000);
        const secs = Math.floor(((baCd - now) % 60000) / 1000);
        status.textContent = `Cooldown: ${mins}:${secs.toString().padStart(2, "0")}`;
        status.classList.add("error");
      }
    } else {
      runBtn.disabled = !!evalResult.blocked;
      runBtn.onclick = () => {
        const result = runBarbarianAssault();
        if (result.ok) {
          window.Player.combat[baCooldownKey] = Date.now() + 15 * 60 * 1000;
        }
        if (status) {
          status.textContent = result.message;
          status.classList.toggle("error", !result.ok);
        }
        renderBarbarianAssaultPanel();
      };
    }
    buyBtn.disabled = state.fighterTorsoUnlocked || state.honorPoints < 40;
    buyBtn.textContent = state.fighterTorsoUnlocked ? "Fighter Torso Unlocked" : "Buy Fighter Torso (40)";

    if (status && evalResult.blocked) {
      status.textContent = evalResult.reason;
      status.classList.add("error");
    }

    runBtn.onclick = () => {
      const result = runBarbarianAssault();
      if (status) {
        status.textContent = result.message;
        status.classList.toggle("error", !result.ok);
      }
      renderBarbarianAssaultPanel();
    };

    buyBtn.onclick = () => {
      const result = buyFighterTorso();
      if (status) {
        status.textContent = result.message;
        status.classList.toggle("error", !result.ok);
      }
      renderBarbarianAssaultPanel();
    };
  }

  function renderChallengeFightsPanel() {
    const summary = document.getElementById("challenge-summary");
    const status = document.getElementById("challenge-status");
    const grid = document.getElementById("challenge-grid");
    if (!summary || !grid) return;

    const st = getChallengeFightState();
    summary.textContent = "Attempts: " + st.attempts + " | Fails: " + st.fails;
    grid.innerHTML = "";

    // 1 hour cooldown for specific challenge fights
    const CHALLENGE_COOLDOWN_IDS = ["jad_trial", "fight_caves", "inferno"];
    const challengeCooldownKey = 'challengeFightCooldowns';
    const now = Date.now();
    window.Player.combat[challengeCooldownKey] = window.Player.combat[challengeCooldownKey] || {};
    CHALLENGE_FIGHT_DEFS.forEach((def) => {
      const evalResult = evaluateChallengeFightChance(def);
      const clears = Number(st.completions[def.id]) || 0;
      const unlocked = !!st.unlocks[def.reward.id];
      const card = document.createElement("div");
      card.className = "pest-reward-card" + (unlocked ? " bought" : "");
      card.innerHTML = `
        <div class="raid-top">
          <img class="raid-icon" src="${def.icon}" alt="${def.name}" onerror="this.onerror=null;this.src='https://oldschool.runescape.wiki/images/Combat_icon.png';" />
          <div>
            <div class="raid-name">${def.name}</div>
            <div class="raid-reqs">Req: CB ${def.reqCombat} | Rng ${def.reqRanged} | Pray ${def.reqPrayer}</div>
            <div class="raid-reqs">Clears: ${clears} | Reward: ${def.reward.name}</div>
          </div>
        </div>
      `;

      const runBtn = document.createElement("button");
      runBtn.className = "raid-run-btn";
      runBtn.textContent = evalResult.blocked ? "Locked" : ("Run (" + Math.round(evalResult.chance * 100) + "%)");
      let isCooldown = false;
      let cooldownMs = 0;
      if (CHALLENGE_COOLDOWN_IDS.includes(def.id)) {
        const cd = window.Player.combat[challengeCooldownKey][def.id] || 0;
        if (cd && now < cd) {
          isCooldown = true;
          cooldownMs = cd - now;
        }
      }
      if (evalResult.blocked || isCooldown) runBtn.disabled = true;
      if (isCooldown) {
        const mins = Math.floor(cooldownMs / 60000);
        const secs = Math.floor((cooldownMs % 60000) / 1000);
        card.innerHTML += `<div style='color:#c33;font-size:13px;margin-top:4px;'>Cooldown: ${mins}:${secs.toString().padStart(2, "0")}</div>`;
      }
      runBtn.addEventListener("click", () => {
        if (isCooldown) return;
        const result = runChallengeFight(def);
        if (result.ok && CHALLENGE_COOLDOWN_IDS.includes(def.id)) {
          window.Player.combat[challengeCooldownKey][def.id] = Date.now() + 15 * 60 * 1000;
        }
        if (status) {
          status.textContent = result.message;
          status.classList.toggle("error", !result.ok);
        }
        renderChallengeFightsPanel();
      });
      card.appendChild(runBtn);
      grid.appendChild(card);
    });
  }

  function renderRaidsPanel() {
    const grid = document.getElementById("raids-grid");
    const status = document.getElementById("raids-status");
    const summary = document.getElementById("raids-run-summary");
    const history = document.getElementById("raids-history");
    if (!grid || !summary || !history) return;

    const state = getRaidState();
    let totalClears = 0;
    let totalFails = 0;

    grid.innerHTML = "";
    const COOLDOWN_RAIDS = ["cox", "cox_cm", "tob", "toa"];
    const now = Date.now();
    RAID_DEFS.forEach((raid) => {
      const result = evaluateRaidChance(raid);
      const clears = Number(state.completionsById[raid.id]) || 0;
      const fails = Number(state.failsById[raid.id]) || 0;
      totalClears += clears;
      totalFails += fails;

      const card = document.createElement("article");
      card.className = "raid-card";
      const pct = Math.round(result.chance * 100);
      const blockedClass = result.blocked ? " raid-blocked" : "";

      // Cooldown logic
      let cooldownMs = 0;
      let cooldownText = "";
      let isCooldown = false;
      if (COOLDOWN_RAIDS.includes(raid.id)) {
        const cd = state.cooldownsById?.[raid.id] || 0;
        if (cd && now < cd) {
          cooldownMs = cd - now;
          isCooldown = true;
          const mins = Math.floor(cooldownMs / 60000);
          const secs = Math.floor((cooldownMs % 60000) / 1000);
          cooldownText = `Cooldown: ${mins}:${secs.toString().padStart(2, "0")}`;
        }
      }

      card.innerHTML = `
        <div class="raid-top">
          <img class="raid-icon" src="${raid.icon}" alt="${raid.name}" onerror="this.onerror=null;this.src='https://oldschool.runescape.wiki/images/Minigames.png';" />
          <div>
            <div class="raid-name">${raid.name}</div>
            <div class="raid-reqs">${prettyReqs(raid.requirements)}</div>
          </div>
        </div>
        <div class="raid-chance${blockedClass}">
          <span>Clear Chance</span>
          <strong>${result.blocked ? "0%" : (pct + "%")}</strong>
        </div>
        <div class="raid-tracker">Clears: ${clears} | Fails: ${fails}</div>
        <div class="raid-cooldown" style="color:#c33;font-size:13px;min-height:18px;">${cooldownText}</div>
        <button class="raid-run-btn" data-raid-id="${raid.id}" ${(result.blocked || isCooldown) ? "disabled" : ""}>Run Raid</button>
      `;

      const button = card.querySelector(".raid-run-btn");
      if (button) {
        button.addEventListener("click", () => {
          const runResult = runRaid(raid);
          if (status) {
            status.textContent = runResult.message;
            status.classList.toggle("error", !runResult.ok);
          }
          renderRaidsPanel();
        });
      }

      // Live countdown timer for cooldown
      if (isCooldown) {
        const cooldownDiv = card.querySelector(".raid-cooldown");
        let interval = setInterval(() => {
          const now2 = Date.now();
          const cd2 = state.cooldownsById?.[raid.id] || 0;
          if (!cd2 || now2 >= cd2) {
            clearInterval(interval);
            renderRaidsPanel();
            return;
          }
          const mins = Math.floor((cd2 - now2) / 60000);
          const secs = Math.floor(((cd2 - now2) % 60000) / 1000);
          if (cooldownDiv) cooldownDiv.textContent = `Cooldown: ${mins}:${secs.toString().padStart(2, "0")}`;
        }, 1000);
      }

      grid.appendChild(card);
    });

    summary.textContent = "Total clears: " + totalClears + " | Total fails: " + totalFails;

    const runs = state.lastRuns || [];
    history.innerHTML = "<div class='raids-history-title'>Recent Raid Runs</div>";
    if (!runs.length) {
      history.innerHTML += "<div class='raids-history-empty'>No raids run yet.</div>";
    } else {
      runs.slice(0, 8).forEach((entry) => {
        const row = document.createElement("div");
        row.className = "raids-history-row" + (entry.success ? " success" : " fail");
        const rewards = (entry.rewards || []).slice(0, 3).join(", ");
        row.innerHTML = `
          <span class="rh-name">${entry.raidName}</span>
          <span class="rh-outcome">${entry.success ? "Clear" : "Fail"} (${Math.round((entry.chance || 0) * 100)}%)</span>
          <span class="rh-loot">${rewards}</span>
        `;
        history.appendChild(row);
      });
    }
  }

  RSGame.Game.registerMod({
    name: "Raids Minigames",

    onGameInit() {
      const tabBar = document.getElementById("tab-bar");
      const main = document.querySelector(".main-layout");
      if (!tabBar || !main) return;

      if (!document.querySelector('.tab-btn[data-tab="minigames"]')) {
        const btn = document.createElement("button");
        btn.className = "tab-btn";
        btn.dataset.tab = "minigames";
        btn.innerHTML = '<img class="tab-icon" src="https://oldschool.runescape.wiki/images/Minigames.png" alt="Minigames" onerror="this.onerror=null;this.src=\'https://oldschool.runescape.wiki/images/Combat_icon.png\';"><span class="tab-label">Minigames</span>';
        tabBar.appendChild(btn);
      }

      if (!document.querySelector('.panel.minigames-panel')) {
        buildMinigamesPanel(main);
      }

      getRaidState();
      renderRaidsPanel();
      renderPestControlPanel();
      renderBarbarianAssaultPanel();
      renderChallengeFightsPanel();

      RSGame.Events?.on?.("playerUpdated", renderRaidsPanel);
      RSGame.Events?.on?.("equipmentChanged", renderRaidsPanel);
      RSGame.Events?.on?.("playerUpdated", renderPestControlPanel);
      RSGame.Events?.on?.("equipmentChanged", renderPestControlPanel);
      RSGame.Events?.on?.("playerUpdated", renderBarbarianAssaultPanel);
      RSGame.Events?.on?.("equipmentChanged", renderBarbarianAssaultPanel);
      RSGame.Events?.on?.("playerUpdated", renderChallengeFightsPanel);
      RSGame.Events?.on?.("equipmentChanged", renderChallengeFightsPanel);
    },

    onAfterRender() {
      renderRaidsPanel();
      renderPestControlPanel();
      renderBarbarianAssaultPanel();
      renderChallengeFightsPanel();
    }
  });
})();
