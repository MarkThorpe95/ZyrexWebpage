window.RSGame = window.RSGame || {};

(function () {
  function wikiIcon(file) {
    return "https://oldschool.runescape.wiki/images/thumb/" + file + "/32px-" + file;
  }

  function clueCasketIcon(tier) {
    return wikiIcon("Clue_scroll_(" + tier + ").png");
  }

  const TIERS = {
    easy: {
      label: "Easy",
      dropChance: 1 / 50,
      bottle: { id: "clue_bottle_easy", name: "Clue bottle (easy)", icon: wikiIcon("Clue_bottle_(easy).png") },
      casket: { id: "clue_casket_easy", name: "Clue casket (easy)", icon: clueCasketIcon("easy") },
      coinMin: 2500,
      coinMax: 22000,
      rollsMin: 2,
      rollsMax: 4,
      uniqueChance: 0.02,
      commonRewards: [
        { id: "law_rune", name: "Law rune", icon: wikiIcon("Law_rune.png"), qtyMin: 8, qtyMax: 32, weight: 20, category: "Clues - Easy" },
        { id: "nature_rune", name: "Nature rune", icon: wikiIcon("Nature_rune.png"), qtyMin: 6, qtyMax: 24, weight: 18, category: "Clues - Easy" },
        { id: "fire_rune", name: "Fire rune", icon: wikiIcon("Fire_rune.png"), qtyMin: 80, qtyMax: 320, weight: 15, category: "Clues - Easy" },
        { id: "steel_arrow", name: "Steel arrow", icon: wikiIcon("Steel_arrow_5.png"), qtyMin: 25, qtyMax: 110, weight: 15, category: "Clues - Easy" },
        { id: "purple_firelighter", name: "Purple firelighter", icon: wikiIcon("Purple_firelighter.png"), qtyMin: 3, qtyMax: 12, weight: 12, category: "Clues - Easy" },
        { id: "coal", name: "Coal", icon: wikiIcon("Coal.png"), qtyMin: 6, qtyMax: 24, weight: 10, category: "Clues - Easy" },
        { id: "willow_log", name: "Willow Logs", icon: wikiIcon("Willow_logs.png"), qtyMin: 8, qtyMax: 30, weight: 10, category: "Clues - Easy" }
      ],
      rewards: [
        { id: "black_full_helm_g", name: "Black full helm (g)", icon: wikiIcon("Black_full_helm_(g).png"), weight: 4 },
        { id: "black_platebody_g", name: "Black platebody (g)", icon: wikiIcon("Black_platebody_(g).png"), weight: 4 },
        { id: "black_platelegs_g", name: "Black platelegs (g)", icon: wikiIcon("Black_platelegs_(g).png"), weight: 4 },
        { id: "black_kiteshield_g", name: "Black kiteshield (g)", icon: wikiIcon("Black_kiteshield_(g).png"), weight: 4 },
        { id: "wizard_robe_g", name: "Wizard robe (g)", icon: wikiIcon("Wizard_robe_(g).png"), weight: 5 },
        { id: "wizard_hat_g", name: "Wizard hat (g)", icon: wikiIcon("Wizard_hat_(g).png"), weight: 5 },
        { id: "monk_robe_top_g", name: "Monk robe top (g)", icon: wikiIcon("Monk%27s_robe_top_(g).png"), weight: 3 },
        { id: "monk_robe_g", name: "Monk robe (g)", icon: wikiIcon("Monk%27s_robe_(g).png"), weight: 3 },
        { id: "amulet_of_power_t", name: "Amulet of power (t)", icon: wikiIcon("Amulet_of_power_(t).png"), weight: 2 }
      ]
    },
    medium: {
      label: "Medium",
      dropChance: 1 / 150,
      bottle: { id: "clue_bottle_medium", name: "Clue bottle (medium)", icon: wikiIcon("Clue_bottle_(medium).png") },
      casket: { id: "clue_casket_medium", name: "Clue casket (medium)", icon: clueCasketIcon("medium") },
      coinMin: 15000,
      coinMax: 75000,
      rollsMin: 3,
      rollsMax: 5,
      uniqueChance: 0.035,
      commonRewards: [
        { id: "law_rune", name: "Law rune", icon: wikiIcon("Law_rune.png"), qtyMin: 25, qtyMax: 95, weight: 18, category: "Clues - Medium" },
        { id: "nature_rune", name: "Nature rune", icon: wikiIcon("Nature_rune.png"), qtyMin: 20, qtyMax: 80, weight: 16, category: "Clues - Medium" },
        { id: "death_rune", name: "Death rune", icon: wikiIcon("Death_rune.png"), qtyMin: 18, qtyMax: 70, weight: 14, category: "Clues - Medium" },
        { id: "adamant_arrow", name: "Adamant arrow", icon: wikiIcon("Adamant_arrow_5.png"), qtyMin: 40, qtyMax: 180, weight: 14, category: "Clues - Medium" },
        { id: "red_firelighter", name: "Red firelighter", icon: wikiIcon("Red_firelighter.png"), qtyMin: 5, qtyMax: 20, weight: 12, category: "Clues - Medium" },
        { id: "mithril_ore", name: "Mithril Ore", icon: wikiIcon("Mithril_ore.png"), qtyMin: 4, qtyMax: 14, weight: 12, category: "Clues - Medium" },
        { id: "yew_log", name: "Yew Logs", icon: wikiIcon("Yew_logs.png"), qtyMin: 8, qtyMax: 30, weight: 10, category: "Clues - Medium" }
      ],
      rewards: [
        { id: "ranger_boots", name: "Ranger boots", icon: wikiIcon("Ranger_boots.png"), weight: 1 },
        { id: "wizard_boots", name: "Wizard boots", icon: wikiIcon("Wizard_boots.png"), weight: 1 },
        { id: "holy_sandals", name: "Holy sandals", icon: wikiIcon("Holy_sandals.png"), weight: 1 },
        { id: "adamant_full_helm_g", name: "Adamant full helm (g)", icon: wikiIcon("Adamant_full_helm_(g).png"), weight: 4 },
        { id: "adamant_platebody_g", name: "Adamant platebody (g)", icon: wikiIcon("Adamant_platebody_(g).png"), weight: 4 },
        { id: "adamant_platelegs_g", name: "Adamant platelegs (g)", icon: wikiIcon("Adamant_platelegs_(g).png"), weight: 4 },
        { id: "adamant_kiteshield_g", name: "Adamant kiteshield (g)", icon: wikiIcon("Adamant_kiteshield_(g).png"), weight: 4 },
        { id: "mithril_full_helm_t", name: "Mithril full helm (t)", icon: wikiIcon("Mithril_full_helm_(t).png"), weight: 4 },
        { id: "mithril_platebody_t", name: "Mithril platebody (t)", icon: wikiIcon("Mithril_platebody_(t).png"), weight: 4 }
      ]
    },
    hard: {
      label: "Hard",
      dropChance: 1 / 200,
      bottle: { id: "clue_bottle_hard", name: "Clue bottle (hard)", icon: wikiIcon("Clue_bottle_(hard).png") },
      casket: { id: "clue_casket_hard", name: "Clue casket (hard)", icon: clueCasketIcon("hard") },
      coinMin: 45000,
      coinMax: 210000,
      rollsMin: 4,
      rollsMax: 6,
      uniqueChance: 0.06,
      commonRewards: [
        { id: "law_rune", name: "Law rune", icon: wikiIcon("Law_rune.png"), qtyMin: 45, qtyMax: 170, weight: 16, category: "Clues - Hard" },
        { id: "nature_rune", name: "Nature rune", icon: wikiIcon("Nature_rune.png"), qtyMin: 35, qtyMax: 130, weight: 14, category: "Clues - Hard" },
        { id: "death_rune", name: "Death rune", icon: wikiIcon("Death_rune.png"), qtyMin: 30, qtyMax: 120, weight: 14, category: "Clues - Hard" },
        { id: "blood_rune", name: "Blood rune", icon: wikiIcon("Blood_rune.png"), qtyMin: 15, qtyMax: 70, weight: 12, category: "Clues - Hard" },
        { id: "rune_arrow", name: "Rune arrow", icon: wikiIcon("Rune_arrow_5.png"), qtyMin: 35, qtyMax: 140, weight: 14, category: "Clues - Hard" },
        { id: "adamantite_ore", name: "Adamantite Ore", icon: wikiIcon("Adamantite_ore.png"), qtyMin: 3, qtyMax: 10, weight: 10, category: "Clues - Hard" },
        { id: "magic_log", name: "Magic Logs", icon: wikiIcon("Magic_logs.png"), qtyMin: 6, qtyMax: 22, weight: 10, category: "Clues - Hard" },
        { id: "white_firelighter", name: "White firelighter", icon: wikiIcon("White_firelighter.png"), qtyMin: 8, qtyMax: 25, weight: 10, category: "Clues - Hard" }
      ],
      rewards: [
        { id: "robin_hood_hat", name: "Robin hood hat", icon: wikiIcon("Robin_hood_hat.png"), weight: 1 },
        { id: "rune_full_helm_g", name: "Rune full helm (g)", icon: wikiIcon("Rune_full_helm_(g).png"), weight: 3 },
        { id: "rune_platebody_g", name: "Rune platebody (g)", icon: wikiIcon("Rune_platebody_(g).png"), weight: 3 },
        { id: "rune_platelegs_g", name: "Rune platelegs (g)", icon: wikiIcon("Rune_platelegs_(g).png"), weight: 3 },
        { id: "rune_kiteshield_g", name: "Rune kiteshield (g)", icon: wikiIcon("Rune_kiteshield_(g).png"), weight: 3 },
        { id: "bandos_dhide_body", name: "Bandos d'hide body", icon: wikiIcon("Bandos_d%27hide_body.png"), weight: 2 },
        { id: "guthix_dhide_body", name: "Guthix d'hide body", icon: wikiIcon("Guthix_d%27hide_body.png"), weight: 2 },
        { id: "saradomin_dhide_body", name: "Saradomin d'hide body", icon: wikiIcon("Saradomin_d%27hide_body.png"), weight: 2 },
        { id: "zamorak_dhide_body", name: "Zamorak d'hide body", icon: wikiIcon("Zamorak_d%27hide_body.png"), weight: 2 }
      ]
    },
    elite: {
      label: "Elite",
      dropChance: 1 / 300,
      bottle: { id: "clue_bottle_elite", name: "Clue bottle (elite)", icon: wikiIcon("Clue_bottle_(elite).png") },
      casket: { id: "clue_casket_elite", name: "Clue casket (elite)", icon: clueCasketIcon("elite") },
      coinMin: 110000,
      coinMax: 650000,
      rollsMin: 4,
      rollsMax: 7,
      uniqueChance: 0.1,
      commonRewards: [
        { id: "law_rune", name: "Law rune", icon: wikiIcon("Law_rune.png"), qtyMin: 70, qtyMax: 240, weight: 14, category: "Clues - Elite" },
        { id: "blood_rune", name: "Blood rune", icon: wikiIcon("Blood_rune.png"), qtyMin: 40, qtyMax: 160, weight: 13, category: "Clues - Elite" },
        { id: "soul_rune", name: "Soul rune", icon: wikiIcon("Soul_rune.png"), qtyMin: 35, qtyMax: 130, weight: 13, category: "Clues - Elite" },
        { id: "rune_arrow", name: "Rune arrow", icon: wikiIcon("Rune_arrow_5.png"), qtyMin: 80, qtyMax: 280, weight: 14, category: "Clues - Elite" },
        { id: "runite_ore", name: "Runite Ore", icon: wikiIcon("Runite_ore.png"), qtyMin: 1, qtyMax: 4, weight: 10, category: "Clues - Elite" },
        { id: "magic_log", name: "Magic Logs", icon: wikiIcon("Magic_logs.png"), qtyMin: 15, qtyMax: 50, weight: 12, category: "Clues - Elite" },
        { id: "amethyst", name: "Amethyst", icon: wikiIcon("Amethyst.png"), qtyMin: 8, qtyMax: 32, weight: 10, category: "Clues - Elite" },
        { id: "yew_log", name: "Yew Logs", icon: wikiIcon("Yew_logs.png"), qtyMin: 20, qtyMax: 75, weight: 14, category: "Clues - Elite" }
      ],
      rewards: [
        { id: "gilded_full_helm", name: "Gilded full helm", icon: wikiIcon("Gilded_full_helm.png"), weight: 2 },
        { id: "gilded_platebody", name: "Gilded platebody", icon: wikiIcon("Gilded_platebody.png"), weight: 2 },
        { id: "gilded_platelegs", name: "Gilded platelegs", icon: wikiIcon("Gilded_platelegs.png"), weight: 2 },
        { id: "gilded_kiteshield", name: "Gilded kiteshield", icon: wikiIcon("Gilded_kiteshield.png"), weight: 2 },
        { id: "third_age_range_top", name: "3rd age range top", icon: wikiIcon("3rd_age_range_top.png"), weight: 1 },
        { id: "third_age_range_legs", name: "3rd age range legs", icon: wikiIcon("3rd_age_range_legs.png"), weight: 1 },
        { id: "third_age_robe_top", name: "3rd age robe top", icon: wikiIcon("3rd_age_robe_top.png"), weight: 1 },
        { id: "third_age_robe", name: "3rd age robe", icon: wikiIcon("3rd_age_robe.png"), weight: 1 },
        { id: "third_age_mage_hat", name: "3rd age mage hat", icon: wikiIcon("3rd_age_mage_hat.png"), weight: 1 }
      ]
    },
    master: {
      label: "Master",
      dropChance: 0,
      bottle: { id: "clue_bottle_master", name: "Clue bottle (master)", icon: wikiIcon("Clue_bottle_(master).png") },
      casket: { id: "clue_casket_master", name: "Clue casket (master)", icon: clueCasketIcon("master") },
      coinMin: 300000,
      coinMax: 1600000,
      rollsMin: 5,
      rollsMax: 8,
      uniqueChance: 0.2,
      commonRewards: [
        { id: "law_rune", name: "Law rune", icon: wikiIcon("Law_rune.png"), qtyMin: 120, qtyMax: 360, weight: 12, category: "Clues - Master" },
        { id: "blood_rune", name: "Blood rune", icon: wikiIcon("Blood_rune.png"), qtyMin: 80, qtyMax: 260, weight: 12, category: "Clues - Master" },
        { id: "soul_rune", name: "Soul rune", icon: wikiIcon("Soul_rune.png"), qtyMin: 80, qtyMax: 250, weight: 12, category: "Clues - Master" },
        { id: "rune_arrow", name: "Rune arrow", icon: wikiIcon("Rune_arrow_5.png"), qtyMin: 150, qtyMax: 500, weight: 12, category: "Clues - Master" },
        { id: "runite_ore", name: "Runite Ore", icon: wikiIcon("Runite_ore.png"), qtyMin: 3, qtyMax: 10, weight: 10, category: "Clues - Master" },
        { id: "redwood_log", name: "Redwood Logs", icon: wikiIcon("Redwood_logs.png"), qtyMin: 15, qtyMax: 55, weight: 12, category: "Clues - Master" },
        { id: "amethyst", name: "Amethyst", icon: wikiIcon("Amethyst.png"), qtyMin: 20, qtyMax: 70, weight: 10, category: "Clues - Master" },
        { id: "magic_log", name: "Magic Logs", icon: wikiIcon("Magic_logs.png"), qtyMin: 25, qtyMax: 85, weight: 20, category: "Clues - Master" }
      ],
      rewards: [
        { id: "bloodhound", name: "Bloodhound", icon: wikiIcon("Bloodhound.png"), weight: 1 },
        { id: "third_age_pickaxe", name: "3rd age pickaxe", icon: wikiIcon("3rd_age_pickaxe.png"), weight: 1 },
        { id: "third_age_axe", name: "3rd age axe", icon: wikiIcon("3rd_age_axe.png"), weight: 1 },
        { id: "third_age_longsword", name: "3rd age longsword", icon: wikiIcon("3rd_age_longsword.png"), weight: 1 },
        { id: "third_age_wand", name: "3rd age wand", icon: wikiIcon("3rd_age_wand.png"), weight: 1 },
        { id: "third_age_bow", name: "3rd age bow", icon: wikiIcon("3rd_age_bow.png"), weight: 1 },
        { id: "samurai_kasa", name: "Samurai kasa", icon: wikiIcon("Samurai_kasa.png"), weight: 2 },
        { id: "samurai_shirt", name: "Samurai shirt", icon: wikiIcon("Samurai_shirt.png"), weight: 2 },
        { id: "samurai_gloves", name: "Samurai gloves", icon: wikiIcon("Samurai_gloves.png"), weight: 2 },
        { id: "samurai_greaves", name: "Samurai greaves", icon: wikiIcon("Samurai_greaves.png"), weight: 2 }
      ]
    }
  };

  const SKILL_TIER_WEIGHTS = {
    low: [
      { tier: "easy", weight: 80 },
      { tier: "medium", weight: 20 }
    ],
    mid: [
      { tier: "easy", weight: 45 },
      { tier: "medium", weight: 40 },
      { tier: "hard", weight: 15 }
    ],
    high: [
      { tier: "medium", weight: 40 },
      { tier: "hard", weight: 42 },
      { tier: "elite", weight: 18 }
    ],
    end: [
      { tier: "medium", weight: 18 },
      { tier: "hard", weight: 52 },
      { tier: "elite", weight: 30 }
    ]
  };

  function randomInt(min, max) {
    const lo = Math.floor(min);
    const hi = Math.floor(max);
    return lo + Math.floor(Math.random() * Math.max(1, hi - lo + 1));
  }

  function weightedPick(rows) {
    const total = rows.reduce((sum, row) => sum + (Number(row.weight) || 0), 0);
    if (total <= 0) return null;
    let roll = Math.random() * total;
    for (let i = 0; i < rows.length; i++) {
      roll -= Number(rows[i].weight) || 0;
      if (roll <= 0) return rows[i];
    }
    return rows[rows.length - 1] || null;
  }

  function normalizeSkillLevel(player, skillName) {
    const level = Number(player?.skills?.[skillName]?.level) || 1;
    return Math.max(1, Math.min(99, level));
  }

  function pickTierForSkill(player, skillName) {
    const level = normalizeSkillLevel(player, skillName);
    if (level < 40) return weightedPick(SKILL_TIER_WEIGHTS.low)?.tier || "easy";
    if (level < 70) return weightedPick(SKILL_TIER_WEIGHTS.mid)?.tier || "medium";
    if (level < 85) return weightedPick(SKILL_TIER_WEIGHTS.high)?.tier || "hard";
    return weightedPick(SKILL_TIER_WEIGHTS.end)?.tier || "hard";
  }

  function addToInventory(player, item, qty) {
    return player?.inventory?.addItem?.({
      id: item.id,
      name: item.name,
      qty: Math.max(1, Number(qty) || 1),
      icon: item.icon
    });
  }

  function addToBankIfPossible(player, item, qty) {
    if (!player || !RSGame.Bank?.addToBank) return false;
    RSGame.Bank.ensureBankState?.(player);
    RSGame.Bank.addToBank(player, item, qty);
    RSGame.Bank?.syncDiscoveredItems?.(player);
    RSGame.Bank?.refresh?.();
    return true;
  }

  function takeOneFromInventorySlot(player, slotIndex) {
    const idx = Number(slotIndex);
    const slot = player?.inventory?.slots?.[idx];
    if (!slot) return null;

    const taken = {
      id: slot.id,
      name: slot.name,
      icon: slot.icon,
      noted: !!slot.noted
    };

    slot.qty = (Number(slot.qty) || 0) - 1;
    if (slot.qty <= 0) {
      player.inventory.slots[idx] = null;
    }

    return taken;
  }

  function getTierByItemId(itemId) {
    const id = String(itemId || "").toLowerCase();
    if (id.endsWith("_easy")) return "easy";
    if (id.endsWith("_medium")) return "medium";
    if (id.endsWith("_hard")) return "hard";
    if (id.endsWith("_elite")) return "elite";
    if (id.endsWith("_master")) return "master";
    return null;
  }

  function openBottle(player, slotIndex) {
    const slot = player?.inventory?.slots?.[Number(slotIndex)];
    if (!slot) return { ok: false, message: "No clue bottle in that slot." };

    const tier = getTierByItemId(slot.id);
    const cfg = tier ? TIERS[tier] : null;
    if (!cfg || slot.id !== cfg.bottle.id) {
      return { ok: false, message: "This item is not a clue bottle." };
    }

    const consumed = takeOneFromInventorySlot(player, slotIndex);
    if (!consumed) return { ok: false, message: "Unable to open this clue bottle." };

    const added = addToInventory(player, cfg.casket, 1);
    if (!added) {
      addToBankIfPossible(player, cfg.casket, 1);
      return { ok: true, message: "Bottle opened. Casket sent to bank (inventory full)." };
    }

    return { ok: true, message: "Bottle opened: " + cfg.casket.name + ". Click the casket to open." };
  }

  function openCasket(player, slotIndex) {
    const slot = player?.inventory?.slots?.[Number(slotIndex)];
    if (!slot) return { ok: false, message: "No casket in that slot." };

    const tier = getTierByItemId(slot.id);
    const cfg = tier ? TIERS[tier] : null;
    if (!cfg || slot.id !== cfg.casket.id) {
      return { ok: false, message: "This item is not a clue casket." };
    }

    const consumed = takeOneFromInventorySlot(player, slotIndex);
    if (!consumed) return { ok: false, message: "Unable to open this casket." };

    const rewards = [];
    const rolls = randomInt(cfg.rollsMin, cfg.rollsMax);

    const baseCoinRoll = randomInt(cfg.coinMin, cfg.coinMax);
    const coinRoll = Math.max(0, Number(RSGame.MagicPerks?.applyCoinRewardMultiplier?.(baseCoinRoll, "clues", player) ?? baseCoinRoll) || 0);
    addToBankIfPossible(player, { id: "coins", name: "Coins", icon: wikiIcon("Coins_10000.png"), category: "Clues - " + cfg.label }, coinRoll);
    rewards.push(coinRoll.toLocaleString() + " coins (bank)");

    const uniqueAwarded = Math.random() < (Number(cfg.uniqueChance) || 0);
    if (uniqueAwarded) {
      const uniqueReward = weightedPick(cfg.rewards);
      if (uniqueReward) {
        if (uniqueReward.id === "bloodhound") {
          player.combat = player.combat || {};
          player.combat.pets = player.combat.pets || {};
          player.combat.pets.unlocked = player.combat.pets.unlocked || {};
          player.combat.pets.unlocked.bloodhound = true;
          rewards.push("Bloodhound unlocked (pet)");
        } else {
          addToBankIfPossible(player, uniqueReward, 1);
          rewards.push(uniqueReward.name + " (bank)");
          RSGame.Bank?.recordLegitimateObtain?.(player, uniqueReward, 1);
        }
      }
    }

    for (let i = 0; i < rolls; i++) {
      const reward = weightedPick(cfg.commonRewards || cfg.rewards || []);
      if (!reward) continue;

      const qty = randomInt(Number(reward.qtyMin) || 1, Number(reward.qtyMax) || 1);

      const rewardWithQty = {
        id: reward.id,
        name: reward.name,
        icon: reward.icon,
        category: reward.category
      };

      addToBankIfPossible(player, rewardWithQty, qty);
      RSGame.Bank?.recordLegitimateObtain?.(player, rewardWithQty, qty);
      rewards.push((qty > 1 ? qty.toLocaleString() + "x " : "") + reward.name + " (bank)");
    }

    RSGame.UI?.renderInventory?.(player);
    RSGame.UI?.renderSkills?.(player);
    RSGame.Bank?.refresh?.();
    RSGame.Game?.saveNow?.();

    return {
      ok: true,
      message: cfg.label + " casket opened: " + rewards.slice(0, 6).join(", ") + (rewards.length > 6 ? "..." : "")
    };
  }

  function trySkillingDrop(player, skillName, attempts) {
    if (!player || !player.inventory) return false;

    const rolls = Math.max(1, Number(attempts) || 1);
    const tierKey = pickTierForSkill(player, skillName);
    const tier = TIERS[tierKey];
    if (!tier || tier.dropChance <= 0) return false;

    let dropped = false;

    for (let i = 0; i < rolls; i++) {
      if (Math.random() > tier.dropChance) continue;

      const added = addToInventory(player, tier.bottle, 1);
      if (added) {
        if (window.console) console.log("[ClueDrop] Clue bottle added to inventory.");
        if (window.console && player) {
          console.log("[ClueDrop][DEBUG] Inventory after add:", JSON.stringify(player.inventory?.slots));
        }
        dropped = true;
        break;
      } else {
        const banked = addToBankIfPossible(player, tier.bottle, 1);
        if (banked) {
          if (window.console) console.log("[ClueDrop] Clue bottle sent to bank (inventory full).");
          if (window.console && player) {
            console.log("[ClueDrop][DEBUG] Bank after add:", JSON.stringify(player.bank?.items));
          }
          dropped = true;
          break;
        } else {
          if (window.console) console.log("[ClueDrop] Clue bottle roll hit, but failed to add to inventory or bank!");
          if (window.console && player) {
            console.log("[ClueDrop][DEBUG] Inventory:", JSON.stringify(player.inventory?.slots));
            console.log("[ClueDrop][DEBUG] Bank:", JSON.stringify(player.bank?.items));
          }
        }
      }
    }

    if (dropped) {
      RSGame.UI?.renderInventory?.(player);
      RSGame.Bank?.refresh?.();
      RSGame.Game?.saveNow?.();
    }

    return dropped;
  }

  function handleInventoryClick({ game, slotIndex, setStatus, onChange }) {
    const player = game?.player;
    const slot = player?.inventory?.slots?.[Number(slotIndex)];
    if (!slot) return false;

    if (String(slot.id || "").startsWith("clue_bottle_")) {
      const result = openBottle(player, slotIndex);
      setStatus?.(result.message, !result.ok);
      onChange?.();
      return true;
    }

    if (String(slot.id || "").startsWith("clue_casket_")) {
      const result = openCasket(player, slotIndex);
      setStatus?.(result.message, !result.ok);
      onChange?.();
      return true;
    }

    return false;
  }

  function getInventoryContextEntries({ game, slot, slotIndex, setStatus, onChange }) {
    if (!slot) return [];

    if (String(slot.id || "").startsWith("clue_bottle_")) {
      return [{
        label: "Open clue bottle",
        action: () => {
          const result = openBottle(game.player, slotIndex);
          setStatus?.(result.message, !result.ok);
          onChange?.();
        }
      }];
    }

    if (String(slot.id || "").startsWith("clue_casket_")) {
      return [{
        label: "Open casket",
        action: () => {
          const result = openCasket(game.player, slotIndex);
          setStatus?.(result.message, !result.ok);
          onChange?.();
        }
      }];
    }

    return [];
  }

  // Expose pickTierForSkill for direct clue bottle drops
  RSGame.Clues = {
    TIERS,
    trySkillingDrop,
    getInventoryContextEntries,
    handleInventoryClick,
    pickTierForSkill
  };

  RSGame.Game.registerMod({
    name: "Skilling Clues",
    onGameInit() {
      console.log("[Skilling Clues] Rare clue bottle drops enabled.");
    }
  });
})();
