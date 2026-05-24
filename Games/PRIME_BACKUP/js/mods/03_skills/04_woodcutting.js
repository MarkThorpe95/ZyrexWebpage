  // Helper to check if woodcutting cape perk is purchased
  function hasWoodcuttingCapePerk() {
    if (window.Player && window.Player._shopPurchased && window.Player._shopPurchased['woodcutting_cape']) {
      return true;
    }
    return false;
  }

  // To double logs for the perk, mod authors should use:
  // if (hasWoodcuttingCapePerk()) { qty *= 2; }
// content/04_woodcutting_mod.js

(function () {

  const USE_ZONE_GATHERING = false;

  const TREES = {
    normal: { level: 1, xp: 25, interval: 300 },
    oak: { level: 15, xp: 37.5, interval: 300 },
    willow: { level: 30, xp: 67.5, interval: 300 },
    maple: { level: 45, xp: 100, interval: 300 },
    yew: { level: 60, xp: 175, interval: 300 },
    blisterwood: { level: 62, xp: 76, interval: 300 },
    magic: { level: 75, xp: 250, interval: 300 },
    redwood: { level: 90, xp: 380, interval: 300 }
  };

  const TREE_REWARDS = {
    normal: { id: "normal_log", name: "Logs", icon: "Logs.png" },
    oak: { id: "oak_log", name: "Oak Logs", icon: "Oak_logs.png" },
    willow: { id: "willow_log", name: "Willow Logs", icon: "Willow_logs.png" },
    maple: { id: "maple_log", name: "Maple Logs", icon: "Maple_logs.png" },
    yew: { id: "yew_log", name: "Yew Logs", icon: "Yew_logs.png" },
    blisterwood: { id: "blisterwood_log", name: "Blisterwood Logs", icon: "Blisterwood_logs.png" },
    magic: { id: "magic_log", name: "Magic Logs", icon: "Magic_logs.png" },
    redwood: { id: "redwood_log", name: "Redwood Logs", icon: "Redwood_logs.png" }
  };

  let loop = null;
  let activePlayer = null;
  let activeTreeId = null;

  function getScaledInterval(interval) {
    const speed = Math.max(1, Number(RSGame.Game?.getTimeScale?.()) || 1);
    // Allow lower minimum interval only for devs
    const isDev = typeof sessionStorage !== 'undefined' && sessionStorage.getItem('rsgame.devUnlocked.v1') === '1';
    const minInterval = isDev ? 1 : 100;
    return Math.max(minInterval, Math.round(interval / speed));
  }

  function giveXP(skill, amount) {
    if (typeof skill.addXP === "function") skill.addXP(amount);
    else if (typeof skill.gainXP === "function") skill.gainXP(amount);
    else if (typeof skill.addExperience === "function") skill.addExperience(amount);
    else skill.xp = (skill.xp || 0) + amount;

    RSGame.Events.emit("xpGain", { amount });
  }

  function start(player, treeId) {
    if (!USE_ZONE_GATHERING) return;
    const tree = TREES[treeId];
    const reward = TREE_REWARDS[treeId];
    if (!tree || !reward) return;

    const wcLevel = Math.max(1, Number(player?.skills?.Woodcutting?.level) || 1);
    if (wcLevel < tree.level) {
      stop();
      return;
    }

    activePlayer = player;
    activeTreeId = treeId;
    clearInterval(loop);

    loop = setInterval(() => {
      // Check for woodcutting cape perk and double logs if owned
      let qty = 1;
      if (typeof hasWoodcuttingCapePerk === 'function' && hasWoodcuttingCapePerk()) {
        qty = 2;
      }
      player.inventory.addItem({
        id: reward.id,
        name: reward.name,
        icon: RSGame.UI.getItemIcon(reward.icon),
        qty: qty
      });

      // Only roll for clue bottle on Redwood
      if (treeId === 'redwood') {
        if (Math.random() < 1/50) {
          // Directly award a clue bottle using the official tier logic
          if (RSGame.Clues && RSGame.Clues.TIERS && RSGame.Clues.pickTierForSkill) {
            const tierKey = RSGame.Clues.pickTierForSkill(player, "Woodcutting");
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

      giveXP(player.skills.Woodcutting, tree.xp);

      RSGame.UI.renderInventory(player);
      RSGame.UI.renderSkills(player);
    }, getScaledInterval(tree.interval));
  }

  function stop() {
    clearInterval(loop);
    loop = null;
    activePlayer = null;
    activeTreeId = null;
  }

  if (USE_ZONE_GATHERING) {
    RSGame.Events.on("zoneActivityStart", ({ activity, player }) => {
      if (activity.type === "woodcutting") {
        start(player, activity.tree);
      }
    });

    RSGame.Events.on("zoneLeave", () => stop());
    RSGame.Events.on("gameSpeedChange", () => {
      if (activePlayer && activeTreeId) {
        start(activePlayer, activeTreeId);
      }
    });
  }

  RSGame.Game.registerMod({
    name: "Woodcutting Skill",

    onGameInit(game) {
      const p = game.player;

      if (!p.skills.Woodcutting) {
        p.skills.Woodcutting = new RSGame.Skill("Woodcutting");
      }

      console.log("[Woodcutting Skill] Skills-tab woodcutting is active.");
    }
  });

})();

