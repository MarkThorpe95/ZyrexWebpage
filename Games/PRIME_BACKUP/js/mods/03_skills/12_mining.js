// content/12_mining_mod.js

(function () {

  const USE_ZONE_GATHERING = false;

  const ROCKS = {
    copper: { level: 1, xp: 17.5, interval: 2800 },
    tin: { level: 1, xp: 17.5, interval: 2800 },
    iron: { level: 15, xp: 35, interval: 3200 },
    silver: { level: 20, xp: 40, interval: 3400 },
    coal: { level: 30, xp: 50, interval: 3600 },
    gold: { level: 40, xp: 65, interval: 3900 },
    mithril: { level: 55, xp: 80, interval: 4200 },
    adamantite: { level: 70, xp: 95, interval: 5000 },
    runite: { level: 85, xp: 125, interval: 5800 },
    amethyst: { level: 92, xp: 240, interval: 6800 }
  };

  const ROCK_REWARDS = {
    copper: { id: "copper_ore", name: "Copper Ore", icon: "Copper_ore.png" },
    tin: { id: "tin_ore", name: "Tin Ore", icon: "Tin_ore.png" },
    iron: { id: "iron_ore", name: "Iron Ore", icon: "Iron_ore.png" },
    silver: { id: "silver_ore", name: "Silver Ore", icon: "Silver_ore.png" },
    coal: { id: "coal", name: "Coal", icon: "Coal.png" },
    gold: { id: "gold_ore", name: "Gold Ore", icon: "Gold_ore.png" },
    mithril: { id: "mithril_ore", name: "Mithril Ore", icon: "Mithril_ore.png" },
    adamantite: { id: "adamantite_ore", name: "Adamantite Ore", icon: "Adamantite_ore.png" },
    runite: { id: "runite_ore", name: "Runite Ore", icon: "Runite_ore.png" },
    amethyst: { id: "amethyst", name: "Amethyst", icon: "Amethyst.png" }
  };

  const PICKAXE_SPEED = {
    bronze_pickaxe: 1.0,
    iron_pickaxe: 1.08,
    steel_pickaxe: 1.16,
    black_pickaxe: 1.2,
    mithril_pickaxe: 1.28,
    adamant_pickaxe: 1.36,
    rune_pickaxe: 1.46,
    dragon_pickaxe: 1.58,
    crystal_pickaxe: 1.66,
    third_age_pickaxe: 1.7
  };

  const GEM_TABLE = [
    { id: "uncut_sapphire", name: "Uncut Sapphire", icon: "Uncut_sapphire.png", weight: 44 },
    { id: "uncut_emerald", name: "Uncut Emerald", icon: "Uncut_emerald.png", weight: 30 },
    { id: "uncut_ruby", name: "Uncut Ruby", icon: "Uncut_ruby.png", weight: 17 },
    { id: "uncut_diamond", name: "Uncut Diamond", icon: "Uncut_diamond.png", weight: 7 },
    { id: "uncut_dragonstone", name: "Uncut Dragonstone", icon: "Uncut_dragonstone.png", weight: 2 }
  ];

  let loop = null;
  let activePlayer = null;
  let activeRockId = null;
  let activePickaxeId = null;

  function getScaledInterval(interval, player) {
    const speed = Math.max(1, Number(RSGame.Game?.getTimeScale?.()) || 1);
    const pickaxeBoost = getPickaxeSpeedMultiplier(player);
    // Allow lower minimum interval only for devs
    const isDev = typeof sessionStorage !== 'undefined' && sessionStorage.getItem('rsgame.devUnlocked.v1') === '1';
    const minInterval = isDev ? 1 : 100;
    return Math.max(minInterval, Math.round(interval / (speed * pickaxeBoost)));
  }

  function getEquippedPickaxeId(player) {
    const weaponId = String(player?.equipment?.get?.("weapon")?.id || "");
    if (weaponId && (weaponId.includes("pickaxe") || PICKAXE_SPEED[weaponId])) {
      return weaponId;
    }
    return "";
  }

  function getPickaxeSpeedMultiplier(player) {
    const pickaxeId = getEquippedPickaxeId(player);
    return PICKAXE_SPEED[pickaxeId] || 1;
  }

  function rollGemDrop() {
    if (Math.random() > 0.025) return null;

    const totalWeight = GEM_TABLE.reduce((sum, gem) => sum + gem.weight, 0);
    let roll = Math.random() * totalWeight;

    for (let i = 0; i < GEM_TABLE.length; i++) {
      roll -= GEM_TABLE[i].weight;
      if (roll <= 0) return GEM_TABLE[i];
    }
    return GEM_TABLE[0];
  }

  function giveXP(skill, amount) {
    if (typeof skill.addXP === "function") skill.addXP(amount);
    else if (typeof skill.gainXP === "function") skill.gainXP(amount);
    else if (typeof skill.addExperience === "function") skill.addExperience(amount);
    else skill.xp = (skill.xp || 0) + amount;

    RSGame.Events.emit("xpGain", { amount });
  }

  function start(player, rockId) {
    if (!USE_ZONE_GATHERING) return;
    const rock = ROCKS[rockId];
    const reward = ROCK_REWARDS[rockId];
    if (!rock || !reward) return;

    const miningLevel = Math.max(1, Number(player?.skills?.Mining?.level) || 1);
    if (miningLevel < rock.level) {
      stop();
      return;
    }

    activePlayer = player;
    activeRockId = rockId;
    activePickaxeId = getEquippedPickaxeId(player);
    clearInterval(loop);

    loop = setInterval(() => {
      player.inventory.addItem({
        id: reward.id,
        name: reward.name,
        icon: RSGame.UI.getItemIcon(reward.icon),
        qty: 1
      });

      const gemDrop = rollGemDrop();
      if (gemDrop) {
        player.inventory.addItem({
          id: gemDrop.id,
          name: gemDrop.name,
          icon: RSGame.UI.getItemIcon(gemDrop.icon),
          qty: 1
        });
      }

      // Only roll for clue bottle on Amethyst
      if (rockId === 'amethyst') {
        if (Math.random() < 1/50) {
          // Directly award a clue bottle using the official tier logic
          if (RSGame.Clues && RSGame.Clues.TIERS && RSGame.Clues.pickTierForSkill) {
            const tierKey = RSGame.Clues.pickTierForSkill(player, "Mining");
            const tier = RSGame.Clues.TIERS[tierKey];
            if (tier && tier.bottle) {
              player.inventory.addItem({
                id: tier.bottle.id,
                name: tier.bottle.name,
                icon: tier.bottle.icon,
                qty: 1
              });
              RSGame.UI?.renderInventory?.(player);
              RSGame.Bank?.refresh?.();
              RSGame.Game?.saveNow?.();
              window.showNotification?.("You found a " + tier.bottle.name + "!");
            }
          }
        }
      }

      giveXP(player.skills.Mining, rock.xp);

      RSGame.UI.renderInventory(player);
      RSGame.UI.renderSkills(player);
    }, getScaledInterval(rock.interval, player));
  }

  function stop() {
    clearInterval(loop);
    loop = null;
    activePlayer = null;
    activeRockId = null;
    activePickaxeId = null;
  }

  if (USE_ZONE_GATHERING) {
    RSGame.Events.on("zoneActivityStart", ({ activity, player }) => {
      if (activity.type === "mining") {
        start(player, activity.rock);
      }
    });

    RSGame.Events.on("zoneLeave", () => stop());
    RSGame.Events.on("gameSpeedChange", () => {
      if (activePlayer && activeRockId) {
        start(activePlayer, activeRockId);
      }
    });
    RSGame.Events.on("playerUpdated", () => {
      if (!activePlayer || !activeRockId) return;
      const nextPickaxeId = getEquippedPickaxeId(activePlayer);
      if (nextPickaxeId !== activePickaxeId) {
        start(activePlayer, activeRockId);
      }
    });
  }

  RSGame.Game.registerMod({
    name: "Mining Skill",

    onGameInit(game) {
      const p = game.player;
      if (!p.skills.Mining) {
        p.skills.Mining = new RSGame.Skill("Mining");
      }

      console.log("[Mining Skill] Skills-tab mining is active.");
    }
  });

})();
