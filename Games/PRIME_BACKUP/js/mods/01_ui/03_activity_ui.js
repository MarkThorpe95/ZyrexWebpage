// content/03_activity_ui_mod.js

(function () {

  RSGame.Game.registerMod({
    name: "Activity UI",

    onGameInit(game) {

      const SKILLS_TAB_IS_PRIMARY = true;

      if (SKILLS_TAB_IS_PRIMARY) {
        const gatheringPanel = document.querySelector(".panel.gathering-panel");
        if (!gatheringPanel) return;

        gatheringPanel.innerHTML = `
          <div class="skills-suite-note">
            Gathering and utility skilling has moved to the Skills tab.
            Click any skill icon in Skills to open its training menu.
          </div>
        `;
        return;
      }

      const gatheringPanel = document.querySelector(".panel.gathering-panel");
      if (!gatheringPanel) return;

      const SKILLS = {
        woodcutting: {
          label: "Woodcutting",
          icon: "Woodcutting_icon_(detail).png",
          key: "Woodcutting",
          functional: true,
          activities: [
            { id: "normal", name: "Cut Trees", level: 1, xp: 25, interval: 3000, icon: "Tree.png", output: "Logs", outputIcon: "Logs.png" },
            { id: "oak", name: "Cut Oak Trees", level: 15, xp: 37.5, interval: 3500, icon: "Oak_tree.png", output: "Oak Logs", outputIcon: "Oak_logs.png" },
            { id: "willow", name: "Cut Willow Trees", level: 30, xp: 67.5, interval: 4000, icon: "Willow_tree.png", output: "Willow Logs", outputIcon: "Willow_logs.png" },
            { id: "maple", name: "Cut Maple Trees", level: 45, xp: 100, interval: 4500, icon: "Maple_tree.png", output: "Maple Logs", outputIcon: "Maple_logs.png" },
            { id: "yew", name: "Cut Yew Trees", level: 60, xp: 175, interval: 5000, icon: "Yew_tree.png", output: "Yew Logs", outputIcon: "Yew_logs.png" },
            { id: "blisterwood", name: "Cut Blisterwood Trees", level: 62, xp: 76, interval: 4300, icon: "Blisterwood_tree.png", output: "Blisterwood Logs", outputIcon: "Blisterwood_logs.png" },
            { id: "magic", name: "Cut Magic Trees", level: 75, xp: 250, interval: 5500, icon: "Magic_tree.png", output: "Magic Logs", outputIcon: "Magic_logs.png" },
            { id: "redwood", name: "Cut Redwood Trees", level: 90, xp: 380, interval: 6200, icon: "Redwood_tree.png", output: "Redwood Logs", outputIcon: "Redwood_logs.png" }
          ]
        },
        mining: {
          label: "Mining",
          icon: "Mining_icon_(detail).png",
          key: "Mining",
          functional: true,
          activities: [
            { id: "copper", name: "Mine Copper", level: 1, xp: 17.5, interval: 1800, icon: "Copper_ore.png", output: "Copper Ore", outputIcon: "Copper_ore.png" },
            { id: "tin", name: "Mine Tin", level: 1, xp: 17.5, interval: 1800, icon: "Tin_ore.png", output: "Tin Ore", outputIcon: "Tin_ore.png" },
            { id: "iron", name: "Mine Iron", level: 15, xp: 35, interval: 2200, icon: "Iron_ore.png", output: "Iron Ore", outputIcon: "Iron_ore.png" },
            { id: "silver", name: "Mine Silver", level: 20, xp: 40, interval: 2400, icon: "Silver_ore.png", output: "Silver Ore", outputIcon: "Silver_ore.png" },
            { id: "coal", name: "Mine Coal", level: 30, xp: 50, interval: 2600, icon: "Coal.png", output: "Coal", outputIcon: "Coal.png" },
            { id: "gold", name: "Mine Gold", level: 40, xp: 65, interval: 2900, icon: "Gold_ore.png", output: "Gold Ore", outputIcon: "Gold_ore.png" },
            { id: "mithril", name: "Mine Mithril", level: 55, xp: 80, interval: 3200, icon: "Mithril_ore.png", output: "Mithril Ore", outputIcon: "Mithril_ore.png" },
            { id: "adamantite", name: "Mine Adamantite", level: 70, xp: 95, interval: 5000, icon: "Adamantite_ore.png", output: "Adamantite Ore", outputIcon: "Adamantite_ore.png" },
            { id: "runite", name: "Mine Runite", level: 85, xp: 125, interval: 4800, icon: "Runite_ore.png", output: "Runite Ore", outputIcon: "Runite_ore.png" },
            { id: "amethyst", name: "Mine Amethyst", level: 92, xp: 240, interval: 800, icon: "Amethyst.png", output: "Amethyst", outputIcon: "Amethyst.png" }
          ]
        },
        fishing: {
          label: "Fishing",
          icon: "Fishing_icon_(detail).png",
          key: "Fishing",
          functional: false,
          activities: [
            { id: "shrimp", name: "Net Shrimp", level: 1, xp: 10, interval: 1200, icon: "Raw_shrimps.png", output: "Raw Shrimps", outputIcon: "Raw_shrimps.png" },
            { id: "sardine", name: "Bait Sardine", level: 5, xp: 20, interval: 1500, icon: "Raw_sardine.png", output: "Raw Sardine", outputIcon: "Raw_sardine.png" },
            { id: "herring", name: "Bait Herring", level: 10, xp: 30, interval: 1700, icon: "Raw_herring.png", output: "Raw Herring", outputIcon: "Raw_herring.png" },
            { id: "anchovies", name: "Net Anchovies", level: 15, xp: 40, interval: 1900, icon: "Raw_anchovies.png", output: "Raw Anchovies", outputIcon: "Raw_anchovies.png" },
            { id: "trout", name: "Lure Trout", level: 20, xp: 50, interval: 2000, icon: "Raw_trout.png", output: "Raw Trout", outputIcon: "Raw_trout.png" },
            { id: "salmon", name: "Lure Salmon", level: 30, xp: 70, interval: 2400, icon: "Raw_salmon.png", output: "Raw Salmon", outputIcon: "Raw_salmon.png" },
            { id: "tuna", name: "Harpoon Tuna", level: 35, xp: 80, interval: 2700, icon: "Raw_tuna.png", output: "Raw Tuna", outputIcon: "Raw_tuna.png" },
            { id: "lobster", name: "Cage Lobster", level: 40, xp: 90, interval: 3200, icon: "Raw_lobster.png", output: "Raw Lobster", outputIcon: "Raw_lobster.png" },
            { id: "swordfish", name: "Harpoon Swordfish", level: 50, xp: 100, interval: 3500, icon: "Raw_swordfish.png", output: "Raw Swordfish", outputIcon: "Raw_swordfish.png" },
            { id: "monkfish", name: "Net Monkfish", level: 62, xp: 120, interval: 4000, icon: "Raw_monkfish.png", output: "Raw Monkfish", outputIcon: "Raw_monkfish.png" },
            { id: "karambwan", name: "Fish Karambwan", level: 65, xp: 50, interval: 2200, icon: "Raw_karambwan.png", output: "Raw Karambwan", outputIcon: "Raw_karambwan.png" },
            { id: "shark", name: "Harpoon Shark", level: 76, xp: 110, interval: 4600, icon: "Raw_shark.png", output: "Raw Shark", outputIcon: "Raw_shark.png" },
            { id: "anglerfish", name: "Catch Anglerfish", level: 82, xp: 120, interval: 4900, icon: "Raw_anglerfish.png", output: "Raw Anglerfish", outputIcon: "Raw_anglerfish.png" },
            { id: "dark_crab", name: "Cage Dark Crabs", level: 85, xp: 130, interval: 5200, icon: "Raw_dark_crab.png", output: "Raw Dark Crab", outputIcon: "Raw_dark_crab.png" },
            { id: "sacred_eel", name: "Fish Sacred Eels", level: 87, xp: 105, interval: 4200, icon: "Sacred_eel.png", output: "Sacred Eel", outputIcon: "Sacred_eel.png" }
          ]
        },
        fletching: {
          label: "Fletching",
          icon: "Fletching_icon_(detail).png",
          key: "Fletching",
          functional: true,
          mode: "fletching",
          activities: []
        }
      };

      const SKILL_KEYS = ["woodcutting", "mining", "fishing", "fletching"];

      // Auto-progression settings per skill
      const autoProgressionSettings = {
        woodcutting: false,
        mining: false,
        fishing: false,
        fletching: false
      };

      // Load auto-progression settings from localStorage
      function loadAutoProgressionSettings() {
        const saved = localStorage.getItem("activityUI_autoProgression");
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            Object.assign(autoProgressionSettings, parsed);
          } catch (e) {
            console.error("Failed to load auto-progression settings:", e);
          }
        }
      }

      // Save auto-progression settings to localStorage
      function saveAutoProgressionSettings() {
        localStorage.setItem("activityUI_autoProgression", JSON.stringify(autoProgressionSettings));
      }

      loadAutoProgressionSettings();

      /* ---------------------------------------------------
         BUILD PANEL
      --------------------------------------------------- */
      gatheringPanel.innerHTML = "";

      const switcher = document.createElement("div");
      switcher.className = "gathering-skill-switcher";
      gatheringPanel.appendChild(switcher);

      const header = document.createElement("div");
      header.className = "gathering-skill-header";
      header.innerHTML = `
        <img src="" alt="Skill" class="gathering-skill-icon" id="gathering-skill-icon">
        <div class="gathering-skill-info">
          <span class="gathering-skill-name" id="gathering-skill-name"></span>
          <span class="gathering-skill-level" id="gathering-skill-level"></span>
        </div>
        <label class="auto-progression-toggle" style="margin-left: auto; display: flex; align-items: center; gap: 8px; font-size: 12px;">
          <input type="checkbox" id="auto-progression-checkbox" style="cursor: pointer;">
          <span>Auto Progress</span>
        </label>
      `;
      gatheringPanel.appendChild(header);

      const info = document.createElement("div");
      info.className = "gathering-skill-note";
      gatheringPanel.appendChild(info);

      const grid = document.createElement("div");
      grid.className = "gathering-card-grid";
      gatheringPanel.appendChild(grid);

      const zones = RSGame.Zones.getZonesByCategory("gathering");
      const woodcuttingLookup = new Map();
      const miningLookup = new Map();
      zones.forEach((zone) => {
        zone.activities.forEach((activity) => {
          if (activity.type === "woodcutting") {
            woodcuttingLookup.set(activity.tree, { zone, activity });
          } else if (activity.type === "mining") {
            miningLookup.set(activity.rock, { zone, activity });
          }
        });
      });

      let selectedSkill = "woodcutting";
      let activeCard = null;
      let activeDuration = 0;
      let progressInterval = null;

      function getScaledDuration(duration) {
        const speed = Math.max(1, Number(RSGame.Game?.getTimeScale?.()) || 1);
        return Math.max(60, Math.round(duration / speed));
      }

      function renderSkillTabs() {
        switcher.innerHTML = "";
        SKILL_KEYS.forEach((key) => {
          const cfg = SKILLS[key];
          const btn = document.createElement("button");
          btn.className = "gathering-skill-tab" + (key === selectedSkill ? " active" : "");
          btn.type = "button";
          btn.innerHTML = `
            <img src="https://oldschool.runescape.wiki/images/${cfg.icon}" alt="${cfg.label}">
            <span>${cfg.label}</span>
          `;
          btn.addEventListener("click", () => {
            if (selectedSkill === key) return;
            RSGame.Events.emit("zoneLeave");
            selectedSkill = key;
            renderSelectedSkill();
          });
          switcher.appendChild(btn);
        });
      }

      function updateHeaderLevel() {
        const cfg = SKILLS[selectedSkill];
        const nameEl = document.getElementById("gathering-skill-name");
        const levelEl = document.getElementById("gathering-skill-level");
        const iconEl = document.getElementById("gathering-skill-icon");
        const checkboxEl = document.getElementById("auto-progression-checkbox");
        if (!cfg || !nameEl || !levelEl || !iconEl) return;

        nameEl.textContent = cfg.label;
        iconEl.src = `https://oldschool.runescape.wiki/images/${cfg.icon}`;

        const lvl = game.player?.skills?.[cfg.key]?.level || 1;
        levelEl.textContent = "Level " + lvl;

        // Update checkbox state
        if (checkboxEl) {
          checkboxEl.checked = autoProgressionSettings[selectedSkill] || false;
        }
      }

      function renderCards() {
        grid.innerHTML = "";
        const cfg = SKILLS[selectedSkill];
        if (!cfg) return;

        if (cfg.mode === "fletching") {
          grid.classList.add("gathering-card-grid--fletching");
          const host = document.createElement("div");
          host.className = "gathering-fletching-host";
          grid.appendChild(host);
          RSGame.Fletching?.mountInGathering?.(host, game);
          return;
        }

        grid.classList.remove("gathering-card-grid--fletching");
        const playerLevel = Math.max(1, Number(game.player?.skills?.[cfg.key]?.level) || 1);

        cfg.activities.forEach((activity) => {
          const locked = playerLevel < activity.level;
          const card = document.createElement("div");
          card.className = "gathering-card" + (locked ? " locked" : "");
          card.dataset.activityId = activity.id;
          if (locked) {
            card.dataset.requiredLevel = String(activity.level);
          }

          card.innerHTML = `
            <div class="gathering-card-xp-drop"></div>
            ${locked ? `<div class="gathering-card-lock" aria-hidden="true">Locked</div>` : ""}
            <div class="gathering-card-body">
              <div class="gathering-card-icon-wrap">
                <img src="https://oldschool.runescape.wiki/images/${activity.icon}"
                     alt="${activity.name}" class="gathering-card-img">
              </div>
              <div class="gathering-card-name">${activity.name}</div>
              <div class="gathering-card-meta">
                <span class="card-badge card-level-badge">Lv. ${activity.level}</span>
                <span class="card-badge card-xp-badge">${activity.xp} XP</span>
              </div>
              <div class="gathering-card-drop">
                <img src="https://oldschool.runescape.wiki/images/thumb/${activity.outputIcon}/24px-${activity.outputIcon}"
                     alt="${activity.output}" class="card-drop-icon">
                <span class="card-drop-name">${activity.output}</span>
              </div>
              ${locked ? `<div class="gathering-card-req">Requires Level ${activity.level}</div>` : ""}
            </div>
            <div class="gathering-card-progress-wrap">
              <div class="gathering-card-progress-bar"></div>
            </div>
          `;

          card.addEventListener("click", () => onCardClick(card, activity, cfg));
          grid.appendChild(card);
        });
      }

      function renderSelectedSkill() {
        deactivateCard();
        renderSkillTabs();
        updateHeaderLevel();
        renderCards();
        if (selectedSkill === "fletching") {
          info.textContent = "Use a knife on logs to fletch bows and string them with bow string.";
        } else {
          info.textContent = SKILLS[selectedSkill].functional
            ? "Click an activity card to start gathering."
            : "Layout is ready. Skill mechanics will be added next.";
        }
      }

      function onCardClick(card, activity, cfg) {
        const playerLevel = Math.max(1, Number(game.player?.skills?.[cfg.key]?.level) || 1);
        if (playerLevel < activity.level) {
          info.textContent = `You need ${cfg.label} level ${activity.level} to do ${activity.name}.`;
          return;
        }

        if (activeCard === card) {
          RSGame.Events.emit("zoneLeave");
          deactivateCard();
          info.textContent = SKILLS[selectedSkill].functional
            ? "Click an activity card to start gathering."
            : "Layout is ready. Skill mechanics will be added next.";
          return;
        }

        if (!cfg.functional) {
          activateCard(card, activity.interval);
          info.textContent = `${activity.name} selected.`;
          return;
        }

        const target = cfg.key === "Woodcutting"
          ? woodcuttingLookup.get(activity.id)
          : cfg.key === "Mining"
            ? miningLookup.get(activity.id)
            : null;
        if (!target) return;

        RSGame.Events.emit("zoneActivityStart", {
          zone: target.zone,
          activity: target.activity,
          player: game.player
        });
        activateCard(card, activity.interval);
        info.textContent = `${activity.name} in progress...`;
      }

      /* ---------------------------------------------------
         CARD ACTIVATION
      --------------------------------------------------- */
      // --- Clue Scroll Loot Table ---
      const CLUE_SCROLL_LOOT_TABLE = [
        {
          id: "clue_scroll",
          name: "Clue Scroll",
          qty: 1,
          icon: "https://oldschool.runescape.wiki/images/thumb/Clue_scroll_%28Beginner%29.png/32px-Clue_scroll_%28Beginner%29.png"
        }
      ];

      function rollClueScroll() {
        // 1/50 chance
        const roll = Math.random();
        const success = roll < 1/50;
        // Debug log for testing
        console.log(`[Clue Scroll Debug] Roll: ${roll.toFixed(4)} (${success ? 'SUCCESS' : 'fail'})`);
        return success ? CLUE_SCROLL_LOOT_TABLE[0] : null;
      }

      function activateCard(card, duration) {
        deactivateCard();
        activeCard = card;
        activeDuration = duration;
        card.classList.add("active");
        const bar = card.querySelector(".gathering-card-progress-bar");
        bar.style.transition = "none";
        bar.style.width = "0%";
        startProgress(bar, getScaledDuration(duration));

        // Only patch if skill is woodcutting or mining
        if (selectedSkill === "woodcutting" || selectedSkill === "mining") {
          // Clear any previous interval
          if (window._gatheringRewardInterval) clearInterval(window._gatheringRewardInterval);
          window._gatheringRewardInterval = setInterval(() => {
            if (!activeCard) return;
            // Find the selected activity
            const cfg = SKILLS[selectedSkill];
            const activityId = activeCard.dataset.activityId;
            const activity = cfg.activities.find(a => a.id === activityId);
            if (!activity) return;
            // Only reward if not locked
            const playerLevel = Math.max(1, Number(game.player?.skills?.[cfg.key]?.level) || 1);
            if (playerLevel < activity.level) return;
            // Determine reward qty
            let qty = 1;
            if (selectedSkill === "woodcutting" && window.Player && window.Player._shopPurchased && window.Player._shopPurchased['woodcutting_cape']) {
              qty = 2;
            }
            // Check for clue scroll drop (Redwood Trees or Amethyst)
            // 1/50 clue bottle drop using official system for Redwood/Amethyst
            if (
              (selectedSkill === "woodcutting" && activity.id === "redwood") ||
              (selectedSkill === "mining" && (
                activity.id === "amethyst" ||
                activity.id === "mine_amethyst" ||
                activity.rock === "amethyst"
              ))
            ) {
              const roll = Math.random();
              console.log(`[Clue Bottle Debug] ${selectedSkill} ${activity.id} roll: ${roll}`);
              if (roll < 1/50) {
                if (!window.RSGame) {
                  console.error('[Clue Bottle Debug] window.RSGame is missing');
                  return;
                }
                if (!RSGame.Clues) {
                  console.error('[Clue Bottle Debug] RSGame.Clues is missing');
                  return;
                }
                if (!RSGame.Clues.pickTierForSkill) {
                  console.error('[Clue Bottle Debug] RSGame.Clues.pickTierForSkill is missing');
                  return;
                }
                if (!RSGame.Clues.TIERS) {
                  console.error('[Clue Bottle Debug] RSGame.Clues.TIERS is missing');
                  return;
                }
                const skillName = selectedSkill.charAt(0).toUpperCase() + selectedSkill.slice(1);
                const tierKey = RSGame.Clues.pickTierForSkill(game.player, skillName);
                const tier = RSGame.Clues.TIERS[tierKey];
                if (tier && tier.bottle) {
                  game.player.inventory.addItem({
                    id: tier.bottle.id,
                    name: tier.bottle.name,
                    icon: tier.bottle.icon,
                    qty: 1
                  });
                  RSGame.UI?.renderInventory?.(game.player);
                  RSGame.Bank?.refresh?.();
                  RSGame.Game?.saveNow?.();
                  window.showNotification?.("You found a " + tier.bottle.name + "!");
                  console.log(`[Clue Bottle Debug] DROPPED: ${tier.bottle.name}`);
                } else {
                  console.error('[Clue Bottle Debug] No tier or bottle found for tierKey:', tierKey);
                }
              }
            }
            // Add resource
            game.player.inventory.addItem({
              id: getLogOrOreId(activity, selectedSkill),
              name: activity.output,
              qty: qty,
              icon: `https://oldschool.runescape.wiki/images/${activity.outputIcon}`
            });
            // If clue scroll, add it too
            if (clueScroll) {
              game.player.inventory.addItem(clueScroll);
              window.showNotification?.("You found a Clue Scroll!");
            }
            // XP
            game.player.skills[cfg.key].xp += activity.xp;
            RSGame.Events.emit("xpGain", { amount: activity.xp });
            RSGame.UI.renderInventory(game.player);
            RSGame.UI.renderSkills(game.player);
          }, getScaledDuration(duration));
        }

        function getLogOrOreId(activity, skill) {
          if (skill === "woodcutting") {
            switch (activity.id) {
              case "normal": return "normal_log";
              case "oak": return "oak_log";
              case "willow": return "willow_log";
              case "maple": return "maple_log";
              case "yew": return "yew_log";
              case "blisterwood": return "blisterwood_log";
              case "magic": return "magic_log";
              case "redwood": return "redwood_log";
            }
          } else if (skill === "mining") {
            switch (activity.id) {
              case "copper": return "copper_ore";
              case "tin": return "tin_ore";
              case "iron": return "iron_ore";
              case "silver": return "silver_ore";
              case "coal": return "coal";
              case "gold": return "gold_ore";
              case "mithril": return "mithril_ore";
              case "adamantite": return "adamantite_ore";
              case "runite": return "runite_ore";
              case "mine_amethyst":
              case "amethyst":
                return "amethyst";
            }
          }
          return activity.output.toLowerCase().replace(/ /g, "_");
        }
      }

      function deactivateCard() {
        if (activeCard) {
          activeCard.classList.remove("active");
          const bar = activeCard.querySelector(".gathering-card-progress-bar");
          if (bar) {
            bar.style.transition = "none";
            bar.style.width = "0%";
          }
          activeCard = null;
        }
        activeDuration = 0;
        stopProgress();
      }

      /* ---------------------------------------------------
         PROGRESS BAR
      --------------------------------------------------- */
      function startProgress(bar, duration) {
        clearInterval(progressInterval);
        let start = Date.now();

        progressInterval = setInterval(() => {
          const pct = Math.min(100, ((Date.now() - start) / duration) * 100);

          if (pct >= 100) {
            bar.style.transition = "none";
            bar.style.width = "0%";
            bar.offsetWidth; // force reflow
            bar.style.transition = "";
            start = Date.now();
          } else {
            bar.style.transition = "";
            bar.style.width = pct + "%";
          }
        }, 50);
      }

      function stopProgress() {
        clearInterval(progressInterval);
        progressInterval = null;
      }

      /* ---------------------------------------------------
         ZONE LEAVE
      --------------------------------------------------- */
      RSGame.Events.on("zoneLeave", () => deactivateCard());

      RSGame.Events.on("gameSpeedChange", () => {
        if (!activeCard || !activeDuration) return;
        const bar = activeCard.querySelector(".gathering-card-progress-bar");
        if (!bar) return;
        startProgress(bar, getScaledDuration(activeDuration));
      });

      RSGame.Events.on("gatheringSelectSkill", ({ skill } = {}) => {
        if (!skill || !SKILLS[skill]) return;
        selectedSkill = skill;
        renderSelectedSkill();
      });

      // Function to find the best activity for the current level
      function findBestActivityForCurrentLevel() {
        const cfg = SKILLS[selectedSkill];
        if (!cfg || !cfg.activities) return null;

        const playerLevel = Math.max(1, Number(game.player?.skills?.[cfg.key]?.level) || 1);

        // Find the highest-level activity that the player can do
        let bestActivity = null;
        for (let i = cfg.activities.length - 1; i >= 0; i--) {
          if (playerLevel >= cfg.activities[i].level) {
            bestActivity = cfg.activities[i];
            break;
          }
        }
        return bestActivity;
      }

      // Function to auto-switch to the next appropriate activity
      function autoProgressToNextActivity() {
        if (!autoProgressionSettings[selectedSkill]) return;
        if (!activeCard) return; // Only auto-progress if already training

        const cfg = SKILLS[selectedSkill];
        if (!cfg || !cfg.functional) return; // Only for functional skills

        const bestActivity = findBestActivityForCurrentLevel();
        if (!bestActivity) return;

        const currentActivityId = activeCard?.dataset?.activityId;
        if (bestActivity.id === currentActivityId) return; // Already training this

        // Find and click the card for the new activity
        const cards = grid.querySelectorAll(".gathering-card");
        for (const card of cards) {
          if (card.dataset.activityId === bestActivity.id) {
            onCardClick(card, bestActivity, cfg);
            window.showNotification?.(`Auto-progressed to ${bestActivity.name}!`);
            break;
          }
        }
      }

      // Listen for level-ups and auto-progress
      const prevLevels = {
        woodcutting: game.player?.skills?.Woodcutting?.level || 1,
        mining: game.player?.skills?.Mining?.level || 1,
        fishing: game.player?.skills?.Fishing?.level || 1,
        fletching: game.player?.skills?.Fletching?.level || 1
      };

      RSGame.Events.on("xpGain", ({ amount }) => {
        if (activeCard && (selectedSkill === "woodcutting" || selectedSkill === "mining")) {
          const xpDrop = activeCard.querySelector(".gathering-card-xp-drop");
          if (xpDrop) {
            xpDrop.textContent = `+${amount} xp`;
            xpDrop.classList.remove("show");
            xpDrop.offsetWidth; // restart animation
            xpDrop.classList.add("show");
            setTimeout(() => xpDrop.classList.remove("show"), 900);
          }
        }

        // Check for level-up and auto-progress
        const cfg = SKILLS[selectedSkill];
        if (cfg) {
          const currentLevel = game.player?.skills?.[cfg.key]?.level || 1;
          if (currentLevel > (prevLevels[selectedSkill] || 1)) {
            prevLevels[selectedSkill] = currentLevel;
            // Level-up detected, check if we should auto-progress
            setTimeout(() => autoProgressToNextActivity(), 100);
          }
        }

        updateSkillLevel();
        if (game.player) {
          game.player.updateTotalLevel?.();
          RSGame.UI.renderPlayerSummary(game.player);
        }
      });

      function updateSkillLevel() {
        updateHeaderLevel();
      }

      // Auto-progression checkbox handler
      setTimeout(() => {
        const checkboxEl = document.getElementById("auto-progression-checkbox");
        if (checkboxEl) {
          checkboxEl.addEventListener("change", (e) => {
            autoProgressionSettings[selectedSkill] = e.target.checked;
            saveAutoProgressionSettings();
            window.showNotification?.(
              autoProgressionSettings[selectedSkill]
                ? `Auto-progression enabled for ${SKILLS[selectedSkill].label}`
                : `Auto-progression disabled for ${SKILLS[selectedSkill].label}`
            );
          });
        }
      }, 100);

      renderSelectedSkill();

    }
  });

})();

