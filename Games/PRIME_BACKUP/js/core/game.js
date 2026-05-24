
// --- GLOBAL: setMenuStatus ---
function setMenuStatus(text, isError) {
  const devMenuStatus = document.getElementById("dev-menu-status");
  if (devMenuStatus) {
    devMenuStatus.textContent = text || "";
    devMenuStatus.classList.toggle("error", !!isError);
  }
}

// js/core/game.js
window.RSGame = window.RSGame || {};
RSGame.Game = RSGame.Game || {};

(function () {
  const SAVE_INDEX_KEY = "rsgame.saveIndex.v1";
  const SAVE_DATA_PREFIX = "rsgame.saveData.v1.";
  const AUTOSAVE_INTERVAL_MS = 15000;
  const DEV_UNLOCK_KEY = "rsgame.devUnlocked.v1";
  const DEV_SPEED_KEY = "rsgame.devSpeed.v1";
  const DEV_USER = "Zyrex";
  const DEV_PASS = "Mark";
  const HSR_ITEM_ID = "39814";
  const MENU_SAVE_ICON = "https://oldschool.runescape.wiki/images/Bank_icon.png";
  const MENU_SAVE_ICON_FALLBACK = "https://oldschool.runescape.wiki/images/Inventory.png?d4795";

  const MOD_PATHS = [
    "js/mods/00_infrastructure/01_zones.js",
    "js/mods/01_ui/02_zones_ui.js",
    "js/mods/01_ui/03_activity_ui.js",
    "js/mods/03_skills/04_woodcutting.js",
    "js/mods/02_data/06_equipment_table.js",
    "js/mods/02_data/bones_data.js",
    "js/mods/02_data/05_items_loader.js",
    "js/mods/03_skills/06_woodcutting_zones.js",
    "js/mods/04_systems/07_grand_exchange.js",
    "js/mods/04_systems/08_bank.js",
    "js/mods/04_systems/09_combat.js",
    "js/mods/03_skills/10_fletching.js",
    "js/mods/04_systems/11_clues.js",
    "js/mods/03_skills/12_mining.js",
    "js/mods/03_skills/13_mining_zones.js",
    "js/mods/03_skills/15_skills_suite.js",
    "js/mods/06_custom_items/HSR/hsr_item.js",
    "js/mods/05_features/16_raids_minigames.js",
    "js/mods/05_features/17_pets.js",
    "js/mods/05_features/18_drop_party.js"
  ];

  let modsLoaded = 0;
  let currentSaveId = null;
  let autosaveTimer = null;
  let devEventsBound = false;
  let gameSpeedMultiplier = Math.max(1, Number(sessionStorage.getItem(DEV_SPEED_KEY)) || 1);
  let devMenuDragState = null;

  RSGame.Game.getTimeScale = function () {
    return Math.max(1, Number(gameSpeedMultiplier) || 1);
  };

  RSGame.Game.setTimeScale = function (multiplier) {
    // Allow any positive integer speed, including 1000x
    const next = Math.max(1, Number(multiplier) || 1);
    gameSpeedMultiplier = next;
    sessionStorage.setItem(DEV_SPEED_KEY, String(next));
    RSGame.Events?.emit?.("gameSpeedChange", { multiplier: next });
    return next;
  };

  function isDevUnlocked() {
    return sessionStorage.getItem(DEV_UNLOCK_KEY) === "1";
  }

  function setDevUnlocked(unlocked) {
    if (unlocked) {
      sessionStorage.setItem(DEV_UNLOCK_KEY, "1");
    } else {
      sessionStorage.removeItem(DEV_UNLOCK_KEY);
    }
  }

  function addCoinsToInventory(inventory, qty) {
    const amount = Math.max(1, Number(qty) || 1);
    return inventory.addItem({
      id: "coins",
      name: "Coins",
      qty: amount,
      icon: "https://oldschool.runescape.wiki/images/thumb/Coins_10000.png/32px-Coins_10000.png"
    });
  }

  function addPlatinumToInventory(inventory, qty) {
    const amount = Math.max(1, Number(qty) || 1);
    return inventory.addItem({
      id: "platinum_token",
      name: "Platinum token",
      qty: amount,
      icon: "https://oldschool.runescape.wiki/images/thumb/Platinum_token_detail.png/32px-Platinum_token_detail.png",
      stackable: true
    });
  }

  function tryAddHsrToInventory(player) {
    if (!player || !player.inventory) return false;
    const hsr = RSGame.CustomItems?.[HSR_ITEM_ID];
    if (!hsr || !hsr.id || !hsr.name) return false;
    return player.inventory.addItem({
      id: hsr.id,
      name: hsr.name,
      qty: 1,
      icon: hsr.icon,
      stackable: !!hsr.stackable,
      slot: hsr.slot,
      itemType: hsr.itemType,
      bonuses: hsr.bonuses,
      leftClickAction: hsr.leftClickAction,
      rightClickActions: Array.isArray(hsr.rightClickActions) ? hsr.rightClickActions.slice() : null
    });
  }

  function repairSavedItemIcon(slot) {
    if (!slot) return null;
    if (slot.id === "normal_log") {
      return RSGame.UI?.repairInventoryIcon?.(slot)
        || RSGame.UI?.getItemIcon?.("Logs.png")
        || "https://oldschool.runescape.wiki/images/Logs.png";
    }
    if (slot.id === "steel_arrow") {
      return "https://oldschool.runescape.wiki/images/thumb/Steel_arrow_5.png/32px-Steel_arrow_5.png";
    }
    if (slot.id === "adamant_arrow") {
      return "https://oldschool.runescape.wiki/images/thumb/Adamant_arrow_5.png/32px-Adamant_arrow_5.png";
    }
    if (slot.id === "rune_arrow") {
      return "https://oldschool.runescape.wiki/images/thumb/Rune_arrow_5.png/32px-Rune_arrow_5.png";
    }
    return slot.icon || null;
  }

  function buildCombatSaveState(player, savedCombat) {
    const hitpointsLevel = Math.max(1, Number(player?.skills?.Hitpoints?.level) || 1);
    const maxHp = Math.max(10, hitpointsLevel + 9);
    const combat = savedCombat || player?.combat || {};
    const staking = combat.staking || {};
    const raids = combat.raids || {};
    const pestControl = combat.pestControl || {};
    const barbarianAssault = combat.barbarianAssault || {};
    const challengeFights = combat.challengeFights || {};
    const pets = combat.pets || {};

    return {
      style: ["Attack", "Strength", "Defence"].includes(combat.style) ? combat.style : "Attack",
      currentHp: Math.max(1, Math.min(maxHp, Number(combat.currentHp) || maxHp)),
      selectedMonster: typeof combat.selectedMonster === "string" && combat.selectedMonster ? combat.selectedMonster : "chicken",
      kills: Math.max(0, Number(combat.kills) || 0),
      deaths: Math.max(0, Number(combat.deaths) || 0),
      staking: {
        wins: Math.max(0, Number(staking.wins) || 0),
        losses: Math.max(0, Number(staking.losses) || 0),
        offer: staking.offer && typeof staking.offer === "object" ? { ...staking.offer } : null,
        history: Array.isArray(staking.history) ? staking.history.slice(0, 12).map((entry) => ({ ...entry })) : []
      },
      raids: {
        completionsById: raids.completionsById && typeof raids.completionsById === "object" ? { ...raids.completionsById } : {},
        failsById: raids.failsById && typeof raids.failsById === "object" ? { ...raids.failsById } : {},
        lastRuns: Array.isArray(raids.lastRuns) ? raids.lastRuns.slice(0, 20).map((entry) => ({ ...entry })) : []
      },
      pestControl: {
        points: Math.max(0, Number(pestControl.points) || 0),
        gamesWon: Math.max(0, Number(pestControl.gamesWon) || 0),
        gamesLost: Math.max(0, Number(pestControl.gamesLost) || 0),
        purchases: pestControl.purchases && typeof pestControl.purchases === "object" ? { ...pestControl.purchases } : {}
      },
      barbarianAssault: {
        honorPoints: Math.max(0, Number(barbarianAssault.honorPoints) || 0),
        wavesCleared: Math.max(0, Number(barbarianAssault.wavesCleared) || 0),
        gamesWon: Math.max(0, Number(barbarianAssault.gamesWon) || 0),
        gamesLost: Math.max(0, Number(barbarianAssault.gamesLost) || 0),
        fighterTorsoUnlocked: !!barbarianAssault.fighterTorsoUnlocked
      },
      challengeFights: {
        attempts: Math.max(0, Number(challengeFights.attempts) || 0),
        fails: Math.max(0, Number(challengeFights.fails) || 0),
        completions: challengeFights.completions && typeof challengeFights.completions === "object" ? { ...challengeFights.completions } : {},
        unlocks: challengeFights.unlocks && typeof challengeFights.unlocks === "object" ? { ...challengeFights.unlocks } : {}
      },
      pets: {
        unlocked: pets.unlocked && typeof pets.unlocked === "object" ? { ...pets.unlocked } : {}
      }
    };
  }

  function refreshAllUi() {
    if (!window.Player) return;
    window.Player.updateTotalLevel();
    RSGame.UI.renderPlayerSummary(window.Player);
    RSGame.UI.renderSkills(window.Player);
    RSGame.UI.renderInventory(window.Player);
    RSGame.UI.renderEquipment(window.Player);
    RSGame.UI.renderStats(window.Player);
    RSGame.Bank?.refresh?.();
  }

  function applyStackAllSetting(enabled) {
    if (!window.Player?.inventory) return false;

    const next = !!enabled;
    window.Player.stackAllItems = next;
    if (typeof window.Player.inventory.setStackAll === "function") {
      window.Player.inventory.setStackAll(next);
    } else {
      window.Player.inventory.stackAllItems = next;
    }

    refreshAllUi();
    saveGame();
    return next;
  }

  function applyWinEveryDuelSetting(enabled) {
    if (!window.Player) return false;

    const next = !!enabled;
    window.Player.winEveryDuel = next;
    saveGame();
    return next;
  }

  function applyFunModeSetting(enabled) {
    if (!window.Player) return false;

    const next = !!enabled;
    window.Player.funMode = next;
    RSGame.Events?.emit?.("funModeChanged", { enabled: next, player: window.Player });
    refreshAllUi();
    saveGame();
    return next;
  }

  function updateDevUiVisibility() {
    const devMenu = document.getElementById("dev-menu");
    if (!devMenu) return;

    devMenu.style.display = isDevUnlocked() ? "block" : "none";
  }

  function syncDevControlValues() {
    const speedSelect = document.getElementById("dev-speed-select");
    const stackToggle = document.getElementById("dev-stack-toggle");
    const winEveryDuelToggle = document.getElementById("dev-win-duels-toggle");
    const funModeToggle = document.getElementById("dev-fun-mode-toggle");
    const autoSkillProgToggle = document.getElementById("dev-auto-skill-prog-toggle");

    if (autoSkillProgToggle) {
      autoSkillProgToggle.checked = !!window.Player?.autoSkillProgression;
    }

    if (speedSelect) {
      // If current speed is not in the dropdown, add it (for x100)
      const current = String(RSGame.Game.getTimeScale());
      let found = false;
      for (let i = 0; i < speedSelect.options.length; i++) {
        if (speedSelect.options[i].value === current) {
          found = true;
          break;
        }
      }
      if (!found) {
        const opt = document.createElement('option');
        opt.value = current;
        opt.textContent = current + 'x';
        speedSelect.appendChild(opt);
      }
      speedSelect.value = current;
    }

    if (stackToggle) {
      stackToggle.checked = !!window.Player?.stackAllItems;
    }

    if (winEveryDuelToggle) {
      winEveryDuelToggle.checked = !!window.Player?.winEveryDuel;
    }

    if (funModeToggle) {
      funModeToggle.checked = !!window.Player?.funMode;
    }
  }

  function setupDevMenuChrome(devMenu) {
    if (!devMenu || devMenu.dataset.chromeReady === "1") return;

    const heading = devMenu.querySelector("h3");
    const titleText = heading?.textContent || "Developer Menu";
    if (heading) heading.remove();

    const head = document.createElement("div");
    head.className = "dev-menu-head";
    head.innerHTML = ""
      + '<strong class="dev-menu-title">' + titleText + '</strong>'
      + '<button type="button" id="dev-menu-collapse" class="dev-menu-mini-btn" aria-label="Collapse developer menu">_</button>';

    const body = document.createElement("div");
    body.className = "dev-menu-body";
    while (devMenu.firstChild) {
      body.appendChild(devMenu.firstChild);
    }

    devMenu.appendChild(head);
    devMenu.appendChild(body);
    devMenu.dataset.chromeReady = "1";

    // Auto skill progression apply button
    const autoSkillProgApplyBtn = document.getElementById("dev-auto-skill-prog-apply");
    const autoSkillProgToggle = document.getElementById("dev-auto-skill-prog-toggle");
    if (autoSkillProgApplyBtn && autoSkillProgToggle) {
      autoSkillProgApplyBtn.addEventListener("click", () => {
        if (!window.Player) return;
        window.Player.autoSkillProgression = !!autoSkillProgToggle.checked;
        setMenuStatus(
          window.Player.autoSkillProgression
            ? "Auto skill progression enabled."
            : "Auto skill progression disabled.",
          false
        );
        saveGame();
      });
    }

    const collapseBtn = head.querySelector("#dev-menu-collapse");
    const titleEl = head.querySelector(".dev-menu-title");
    collapseBtn?.addEventListener("click", () => {
      const collapsed = !devMenu.classList.contains("collapsed");
      devMenu.classList.toggle("collapsed", collapsed);
      collapseBtn.textContent = collapsed ? "+" : "_";
      if (titleEl) titleEl.textContent = collapsed ? "Dev" : titleText;
    });

    head.addEventListener("mousedown", (e) => {
      if (e.button !== 0) return;
      if (e.target.closest("button")) return;
      const rect = devMenu.getBoundingClientRect();
      devMenuDragState = {
        dx: e.clientX - rect.left,
        dy: e.clientY - rect.top
      };
      devMenu.classList.add("dragging");
      e.preventDefault();
    });

    document.addEventListener("mousemove", (e) => {
      if (!devMenuDragState) return;
      const left = Math.max(0, Math.min(e.clientX - devMenuDragState.dx, window.innerWidth - devMenu.offsetWidth));
      const top = Math.max(0, Math.min(e.clientY - devMenuDragState.dy, window.innerHeight - devMenu.offsetHeight));
      devMenu.style.left = left + "px";
      devMenu.style.top = top + "px";
      devMenu.style.right = "auto";
      devMenu.style.bottom = "auto";
    });

    document.addEventListener("mouseup", () => {
      if (!devMenuDragState) return;
      devMenuDragState = null;
      devMenu.classList.remove("dragging");
    });
  }

  function setupDevUi() {
    if (devEventsBound) {
      syncDevControlValues();
      updateDevUiVisibility();
      return;
    }

    const toggleBtn = document.getElementById("dev-login-toggle");
    const loginModal = document.getElementById("dev-login-modal");
    const loginForm = document.getElementById("dev-login-form");
    const usernameInput = document.getElementById("dev-username");
    const passwordInput = document.getElementById("dev-password");
    const loginStatus = document.getElementById("dev-login-status");
    const loginCancel = document.getElementById("dev-login-cancel");
    const devMenu = document.getElementById("dev-menu");
    const devMenuStatus = document.getElementById("dev-menu-status");
    const speedSelect = document.getElementById("dev-speed-select");
    const speedApplyBtn = document.getElementById("dev-speed-apply");
    const stackToggle = document.getElementById("dev-stack-toggle");
    const stackApplyBtn = document.getElementById("dev-stack-apply");
    const winEveryDuelToggle = document.getElementById("dev-win-duels-toggle");
    const winEveryDuelApplyBtn = document.getElementById("dev-win-duels-apply");
    const funModeToggle = document.getElementById("dev-fun-mode-toggle");
    const funModeApplyBtn = document.getElementById("dev-fun-mode-apply");
    // Add rare+ drop party dev toggle
    const rarePartyToggle = document.getElementById("dev-rare-party-toggle");
    const rarePartyApplyBtn = document.getElementById("dev-rare-party-apply");

    if (!toggleBtn || !loginModal || !loginForm || !usernameInput || !passwordInput || !loginStatus || !loginCancel || !devMenu || !devMenuStatus || !speedSelect || !speedApplyBtn || !stackToggle || !stackApplyBtn || !winEveryDuelToggle || !winEveryDuelApplyBtn || !funModeToggle || !funModeApplyBtn || !rarePartyToggle || !rarePartyApplyBtn) {
      return;
    }
    // Rare+ drop party dev toggle logic
    rarePartyApplyBtn.addEventListener("click", () => {
      window.RSGame = window.RSGame || {};
      window.RSGame.devForceRareParty = rarePartyToggle.checked;
      // Also set the flag in the drop party mod if loaded
      if (window.RSGame.FunModeDropPartySetRareFlag) {
        window.RSGame.FunModeDropPartySetRareFlag(rarePartyToggle.checked);
      }
      setMenuStatus(rarePartyToggle.checked ? "All drop parties will be rare+ with a guaranteed rare item." : "Normal drop party rarity restored.", false);
    });

    setupDevMenuChrome(devMenu);

    syncDevControlValues();

    function openLoginModal() {
      loginStatus.textContent = "";
      loginModal.style.display = "flex";
      usernameInput.focus();
    }

    function closeLoginModal() {
      loginModal.style.display = "none";
      usernameInput.value = "";
      passwordInput.value = "";
      loginStatus.textContent = "";
    }

    toggleBtn.addEventListener("click", () => {
      if (isDevUnlocked()) {
        devMenu.style.display = devMenu.style.display === "none" ? "block" : "none";
        return;
      }

      if (loginModal.style.display === "none") {
        openLoginModal();
      } else {
        closeLoginModal();
      }
    });

    loginCancel.addEventListener("click", closeLoginModal);

    loginModal.addEventListener("click", (e) => {
      if (e.target === loginModal) {
        closeLoginModal();
      }
    });

    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const user = usernameInput.value || "";
      const pass = passwordInput.value || "";

      if (user === DEV_USER && pass === DEV_PASS) {
        setDevUnlocked(true);
        closeLoginModal();
        updateDevUiVisibility();
        setMenuStatus("Developer menu unlocked.", false);
        return;
      }

      loginStatus.textContent = "Invalid dev login.";
      loginStatus.classList.add("error");
      passwordInput.value = "";
      passwordInput.focus();
    });

    speedApplyBtn.addEventListener("click", () => {
      const applied = RSGame.Game.setTimeScale(speedSelect.value);
      setMenuStatus("Game speed set to " + applied + "x.", false);
    });

    stackApplyBtn.addEventListener("click", () => {
      const applied = applyStackAllSetting(stackToggle.checked);
      setMenuStatus(applied ? "All items now stack for this save." : "Stack-all mode disabled for this save.", false);
    });

    winEveryDuelApplyBtn.addEventListener("click", () => {
      const applied = applyWinEveryDuelSetting(winEveryDuelToggle.checked);
      setMenuStatus(applied ? "All duel arena fights now resolve as wins for this save." : "Forced duel wins disabled for this save.", false);
    });

    funModeApplyBtn.addEventListener("click", () => {
      const applied = applyFunModeSetting(funModeToggle.checked);
      setMenuStatus(applied ? "INSTA DP enabled for this save." : "INSTA DP disabled for this save.", false);
    });

    devMenu.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-dev-action]");
      if (!btn || !window.Player) return;

      const action = btn.dataset.devAction;
      const player = window.Player;

      if (action === "addCoins") {
        const ok = addCoinsToInventory(player.inventory, 100000000);
        if (!ok) {
          setMenuStatus("Inventory is full. Could not add coins.", true);
          return;
        }
        refreshAllUi();
        setMenuStatus("Added 100,000,000 coins.", false);
        return;
      }

      if (action === "addPlatinum") {
        const ok = addPlatinumToInventory(player.inventory, 100000000);
        if (!ok) {
          setMenuStatus("Inventory is full. Could not add platinum tokens.", true);
          return;
        }
        refreshAllUi();
        setMenuStatus("Added 100,000,000 platinum tokens.", false);
        return;
      }

      if (action === "addCasketSet") {
        const stackToggleEl = document.getElementById("dev-stack-toggle");
        const shouldStack = !!player.stackAllItems || !!player.inventory?.stackAllItems || !!stackToggleEl?.checked;

        if (shouldStack && typeof player.inventory?.setStackAll === "function") {
          player.inventory.setStackAll(true);
          player.stackAllItems = true;
        }

        const casketSet = [
          { id: "clue_casket_easy", name: "Clue casket (easy)", icon: "https://oldschool.runescape.wiki/images/thumb/Clue_scroll_(easy).png/32px-Clue_scroll_(easy).png" },
          { id: "clue_casket_medium", name: "Clue casket (medium)", icon: "https://oldschool.runescape.wiki/images/thumb/Clue_scroll_(medium).png/32px-Clue_scroll_(medium).png" },
          { id: "clue_casket_hard", name: "Clue casket (hard)", icon: "https://oldschool.runescape.wiki/images/thumb/Clue_scroll_(hard).png/32px-Clue_scroll_(hard).png" },
          { id: "clue_casket_elite", name: "Clue casket (elite)", icon: "https://oldschool.runescape.wiki/images/thumb/Clue_scroll_(elite).png/32px-Clue_scroll_(elite).png" },
          { id: "clue_casket_master", name: "Clue casket (master)", icon: "https://oldschool.runescape.wiki/images/thumb/Clue_scroll_(master).png/32px-Clue_scroll_(master).png" }
        ];

        let added = 0;
        const perType = 10;
        const targetTotal = casketSet.length * perType;
        for (let i = 0; i < casketSet.length; i++) {
          for (let n = 0; n < perType; n++) {
            const ok = player.inventory.addItem({
              id: casketSet[i].id,
              name: casketSet[i].name,
              qty: 1,
              icon: casketSet[i].icon,
              stackable: shouldStack
            });
            if (!ok) break;
            added += 1;
          }
        }

        if (shouldStack && typeof player.inventory?.consolidateStacks === "function") {
          player.inventory.consolidateStacks();
        }

        refreshAllUi();
        if (added === targetTotal) {
          setMenuStatus("Added 10 of each clue casket to inventory.", false);
        } else if (added > 0) {
          setMenuStatus("Added " + added + "/" + targetTotal + " caskets (inventory full).", true);
        } else {
          setMenuStatus("Inventory is full. Could not add caskets.", true);
        }
        return;
      }

      if (action === "levelAll") {
        Object.keys(player.skills || {}).forEach((key) => {
          const skill = player.skills[key];
          skill.level = Math.min(99, (Number(skill.level) || 1) + 1);
        });
        refreshAllUi();
        setMenuStatus("Raised all skills by 1 level.", false);
        return;
      }

      if (action === "maxAll") {
        Object.keys(player.skills || {}).forEach((key) => {
          const skill = player.skills[key];
          skill.level = 99;
          skill.xp = 13034431;
          skill.totalXp = 13034431;
        });
        refreshAllUi();
        setMenuStatus("All skills set to level 99.", false);
        return;
      }

      if (action === "clearInv") {
        player.inventory.slots = new Array(player.inventory.size).fill(null);
        refreshAllUi();
        setMenuStatus("Inventory cleared.", false);
        return;
      }

      if (action === "spawnHsr") {
        const ok = tryAddHsrToInventory(player);
        if (!ok) {
          setMenuStatus("Inventory is full. Could not add Hazelmere's Signet Ring.", true);
          return;
        }
        refreshAllUi();
        setMenuStatus("Spawned Hazelmere's Signet Ring.", false);
        return;
      }

      if (action === "saveNow") {
        saveGame();
        setMenuStatus("Save completed.", false);
        return;
      }

      if (action === "lockDev") {
        setDevUnlocked(false);
        updateDevUiVisibility();
        devMenu.style.display = "none";
        setMenuStatus("", false);
      }
    });

    updateDevUiVisibility();
    devEventsBound = true;
  }

  function getNowIso() {
    return new Date().toISOString();
  }

  function generateSaveId() {
    return "save_" + Date.now() + "_" + Math.floor(Math.random() * 1000000);
  }

  function safeParse(json, fallback) {
    try {
      return JSON.parse(json);
    } catch (_err) {
      return fallback;
    }
  }

  function getSaveIndex() {
    const raw = localStorage.getItem(SAVE_INDEX_KEY);
    const parsed = safeParse(raw, []);
    return Array.isArray(parsed) ? parsed : [];
  }

  function setSaveIndex(index) {
    localStorage.setItem(SAVE_INDEX_KEY, JSON.stringify(index));
  }

  function getSaveData(saveId) {
    const raw = localStorage.getItem(SAVE_DATA_PREFIX + saveId);
    return safeParse(raw, null);
  }

  function setSaveData(saveId, data) {
    localStorage.setItem(SAVE_DATA_PREFIX + saveId, JSON.stringify(data));
  }

  function deleteSaveData(saveId) {
    localStorage.removeItem(SAVE_DATA_PREFIX + saveId);
  }

  function serializePlayer(player) {
    // Revert: do not save geOffers in player save
    const skillState = {};
    Object.keys(player.skills || {}).forEach((name) => {
      const s = player.skills[name];
      skillState[name] = {
        level: s?.level || 1,
        xp: s?.xp || 0,
        totalXp: s?.totalXp || 0
      };
    });

    const combatState = buildCombatSaveState(player);

    return {
      name: player.name || "Player",
      flags: {
        starterPackGranted: !!player.starterPackGranted,
        stackAllItems: !!player.stackAllItems,
        winEveryDuel: !!player.winEveryDuel,
        skillsSuiteStarterGranted: !!player.skillsSuiteStarterGranted,
        funMode: !!player.funMode
      },
      combat: combatState,
      bank: {
        withdrawAsNote: !!player.bank?.withdrawAsNote,
        showPlaceholders: !!player.bank?.showPlaceholders,
        autoSortEnabled: player.bank?.autoSortEnabled !== false,
        sortMode: player.bank?.sortMode || "custom",
        tabs: Array.isArray(player.bank?.tabs) ? [...player.bank.tabs] : ["","","","","","","","","","","","","",""],
        activeTab: Number(player.bank?.activeTab) || 1,
        items: { ...(player.bank?.items || {}) },
        log: { ...(player.bank?.log || {}) },
        autoSortProfiles: { ...(player.bank?.autoSortProfiles || {}) },
        manualTabItems: { ...(player.bank?.manualTabItems || {}) }
      },
      skills: skillState,
      inventory: {
        size: player.inventory?.size || 28,
        slots: (player.inventory?.slots || []).map((slot) => {
          if (!slot) return null;
          return {
            id: slot.id,
            name: slot.name,
            qty: slot.qty,
            icon: slot.icon,
            noted: !!slot.noted,
            stackable: !!slot.stackable,
            slot: slot.slot || null,
            bonuses: slot.bonuses || null,
            itemType: slot.itemType || null,
            leftClickAction: slot.leftClickAction || null,
            rightClickActions: Array.isArray(slot.rightClickActions) ? slot.rightClickActions : null
          };
        })
      },
      equipment: {
        slots: { ...(player.equipment?.slots || {}) }
      },
      farmingPatches: player.farmingPatches && typeof player.farmingPatches === "object"
        ? JSON.parse(JSON.stringify(player.farmingPatches))
        : {},
      // (no geOffers in save)
      _shopPurchased: { ...(player._shopPurchased || {}) },
    };
  }

  function applySaveToPlayer(saveData) {
    const player = window.Player;
    if (!player || !saveData) return;

    player.name = saveData.name || "Player";
    player.starterPackGranted = !!saveData.flags?.starterPackGranted;
    player.stackAllItems = !!saveData.flags?.stackAllItems;
    player.winEveryDuel = !!saveData.flags?.winEveryDuel;
    player.skillsSuiteStarterGranted = !!saveData.flags?.skillsSuiteStarterGranted;
    player.funMode = !!saveData.flags?.funMode;
    player.bank = {
      withdrawAsNote: !!saveData.bank?.withdrawAsNote,
      showPlaceholders: !!saveData.bank?.showPlaceholders,
      autoSortEnabled: saveData.bank?.autoSortEnabled !== false,
      sortMode: saveData.bank?.sortMode || "custom",
      tabs: Array.isArray(saveData.bank?.tabs) ? [...saveData.bank.tabs] : ["","","","","","","","","","","","","",""],
      activeTab: Number(saveData.bank?.activeTab) || 1,
      items: { ...(saveData.bank?.items || {}) },
      log: { ...(saveData.bank?.log || {}) },
      autoSortProfiles: { ...(saveData.bank?.autoSortProfiles || {}) },
      manualTabItems: { ...(saveData.bank?.manualTabItems || {}) }
    };

    const baseSkills = RSGame.createSkillState();
    const savedSkills = saveData.skills || {};
    Object.keys(baseSkills).forEach((skillName) => {
      const saved = savedSkills[skillName] || {};
      baseSkills[skillName].level = Math.max(1, Math.min(99, Number(saved.level) || 1));
      baseSkills[skillName].xp = Math.max(0, Number(saved.xp) || 0);
      baseSkills[skillName].totalXp = Math.max(0, Number(saved.totalXp) || 0);
    });
    player.skills = baseSkills;

    const invSize = Math.max(1, Number(saveData.inventory?.size) || 28);
    player.inventory = new RSGame.Inventory(invSize);
    const savedSlots = Array.isArray(saveData.inventory?.slots) ? saveData.inventory.slots : [];
    player.inventory.slots = new Array(invSize).fill(null).map((_, i) => {
      const slot = savedSlots[i];
      if (!slot) return null;
      return {
        id: slot.id,
        name: slot.name,
        qty: Number(slot.qty) || 1,
        icon: repairSavedItemIcon(slot),
        noted: slot.id === "coins" ? false : !!slot.noted,
        stackable: !!slot.stackable,
        slot: slot.slot || null,
        bonuses: slot.bonuses || null,
        itemType: slot.itemType || null,
        leftClickAction: slot.leftClickAction || null,
        rightClickActions: Array.isArray(slot.rightClickActions) ? slot.rightClickActions : null
      };
    });
    player.inventory.setStackAll?.(player.stackAllItems);
    player.inventory.enrichCurrentSlots?.();

    player.equipment = new RSGame.Equipment();
    if (saveData.equipment?.slots && typeof saveData.equipment.slots === "object") {
      Object.keys(player.equipment.slots).forEach((slotName) => {
        player.equipment.slots[slotName] = saveData.equipment.slots[slotName] || null;
      });
    }

    player.combat = buildCombatSaveState(player, saveData.combat);
    player.farmingPatches = saveData.farmingPatches && typeof saveData.farmingPatches === "object"
      ? JSON.parse(JSON.stringify(saveData.farmingPatches))
      : {};

    // Restore shop perks
    player._shopPurchased = (saveData._shopPurchased && typeof saveData._shopPurchased === 'object') ? { ...saveData._shopPurchased } : {};
    // (no G.E. offers restore)
  }

  function saveGame() {
    if (!currentSaveId || !window.Player) return;
    const payload = {
      version: 1,
      updatedAt: getNowIso(),
      player: serializePlayer(window.Player)
    };
    setSaveData(currentSaveId, payload);

    const index = getSaveIndex();
    const entry = index.find((x) => x.id === currentSaveId);
    if (entry) {
      entry.updatedAt = payload.updatedAt;
      entry.totalLevel = window.Player.totalLevel || 0;
      entry.playerName = window.Player.name || "Player";
      setSaveIndex(index);
    }
  }

  RSGame.Game.saveGame = saveGame;
  RSGame.Game.saveNow = saveGame;

  function setAutosaveEnabled(enabled) {
    if (autosaveTimer) {
      clearInterval(autosaveTimer);
      autosaveTimer = null;
    }
    if (enabled) {
      autosaveTimer = setInterval(saveGame, AUTOSAVE_INTERVAL_MS);
    }
  }

  function ensureSaveIndexConsistency() {
    const index = getSaveIndex();
    const filtered = index.filter((entry) => {
      if (!entry || !entry.id) return false;
      return !!localStorage.getItem(SAVE_DATA_PREFIX + entry.id);
    });
    if (filtered.length !== index.length) {
      setSaveIndex(filtered);
    }
  }

  function formatDate(iso) {
    if (!iso) return "Never";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "Never";
    return d.toLocaleString();
  }

  function renderSaveMenu() {
    const menuEl = document.getElementById("main-menu");
    const listEl = document.getElementById("save-list");
    const formEl = document.getElementById("new-save-form");
    const inputEl = document.getElementById("new-save-name");

    if (!menuEl || !listEl || !formEl || !inputEl) {
      startGame();
      return;
    }

    ensureSaveIndexConsistency();

    function refreshList() {
      const saves = getSaveIndex().sort((a, b) => {
        const ta = new Date(a.updatedAt || 0).getTime();
        const tb = new Date(b.updatedAt || 0).getTime();
        return tb - ta;
      });

      listEl.innerHTML = "";

      if (!saves.length) {
        const empty = document.createElement("div");
        empty.className = "save-empty";
        empty.textContent = "No local saves yet. Create your first save below.";
        listEl.appendChild(empty);
        return;
      }

      saves.forEach((save, index) => {
        const item = document.createElement("div");
        item.className = "save-item";

        const emblem = document.createElement("div");
        emblem.className = "save-item-emblem";

        const emblemImg = document.createElement("img");
        emblemImg.src = MENU_SAVE_ICON;
        emblemImg.onerror = function () {
          this.onerror = null;
          this.src = MENU_SAVE_ICON_FALLBACK;
        };
        emblemImg.alt = "Save";
        emblem.appendChild(emblemImg);

        const content = document.createElement("div");
        content.className = "save-item-content";

        const info = document.createElement("div");
        info.className = "save-item-info";

        const slotTag = document.createElement("div");
        slotTag.className = "save-slot-tag";
        slotTag.textContent = `Save Slot ${index + 1}`;

        const nameEl = document.createElement("div");
        nameEl.className = "save-item-name";
        nameEl.textContent = save.name || "Unnamed Save";

        const metaEl = document.createElement("div");
        metaEl.className = "save-item-meta-row";

        const playerMeta = document.createElement("span");
        playerMeta.className = "save-item-meta";
        playerMeta.textContent = save.playerName || "Player";

        const levelMeta = document.createElement("span");
        levelMeta.className = "save-item-meta save-item-meta-highlight";
        levelMeta.textContent = `Total Level ${save.totalLevel || 0}`;

        metaEl.appendChild(playerMeta);
        metaEl.appendChild(levelMeta);

        const lastPlayedEl = document.createElement("div");
        lastPlayedEl.className = "save-item-meta";
        lastPlayedEl.textContent = `Last played: ${formatDate(save.updatedAt)}`;

        info.appendChild(slotTag);
        info.appendChild(nameEl);
        info.appendChild(metaEl);
        info.appendChild(lastPlayedEl);

        const actions = document.createElement("div");
        actions.className = "save-item-actions";

        const playBtn = document.createElement("button");
        playBtn.type = "button";
        playBtn.className = "save-play-btn";
        playBtn.textContent = "Play";
        playBtn.addEventListener("click", () => selectSave(save.id));

        const delBtn = document.createElement("button");
        delBtn.type = "button";
        delBtn.className = "save-delete-btn";
        delBtn.textContent = "Delete";
        delBtn.addEventListener("click", () => {
          const ok = window.confirm(`Delete save \"${save.name || "Unnamed Save"}\"? This cannot be undone.`);
          if (!ok) return;
          const next = getSaveIndex().filter((entry) => entry.id !== save.id);
          setSaveIndex(next);
          deleteSaveData(save.id);
          refreshList();
        });

        actions.appendChild(playBtn);
        actions.appendChild(delBtn);
        content.appendChild(info);
        content.appendChild(actions);
        item.appendChild(emblem);
        item.appendChild(content);
        listEl.appendChild(item);
      });
    }

    function createSave(name) {
      const trimmed = (name || "").trim();
      if (!trimmed) return;

      const id = generateSaveId();
      const now = getNowIso();
      const index = getSaveIndex();
      index.push({
        id,
        name: trimmed,
        playerName: "Player",
        totalLevel: 0,
        createdAt: now,
        updatedAt: now
      });
      setSaveIndex(index);

      setSaveData(id, {
        version: 1,
        updatedAt: now,
        player: serializePlayer(window.Player)
      });

      selectSave(id);
    }

    function selectSave(id) {
      const saveData = getSaveData(id);
      if (!saveData || !saveData.player) {
        window.alert("This save could not be loaded.");
        refreshList();
        return;
      }

      currentSaveId = id;
      applySaveToPlayer(saveData.player);

      menuEl.style.display = "none";
      const gameContainer = document.getElementById("game-container");
      if (gameContainer) gameContainer.style.display = "block";

      startGame();
      saveGame();
      setAutosaveEnabled(true);
    }

    formEl.addEventListener("submit", (e) => {
      e.preventDefault();
      createSave(inputEl.value);
      inputEl.value = "";
    });

    refreshList();
  }

  function loadMods() {
    console.log("[Game] Loading mods...");

    MOD_PATHS.forEach((path) => {
      const script = document.createElement("script");
      script.src = path;
      script.async = false;

      script.onload = () => {
        console.log("[Mod Loaded]", path);
        modsLoaded++;

        if (modsLoaded === MOD_PATHS.length) {
          console.log("[Mod Loader] All mods loaded.");
          // (no G.E. offers restore)
          renderSaveMenu();
        }
      };

      script.onerror = () => {
        console.error("[Mod Loader] Failed to load mod:", path);
        modsLoaded++;
        if (modsLoaded === MOD_PATHS.length) {
          console.log("[Mod Loader] All mods loaded (with errors).");
          // After all mods are loaded, restore GE offers if a save is loaded
          try {
            const saveData = currentSaveId ? getSaveData(currentSaveId) : null;
            if (saveData && saveData.player && window.RSGame && window.RSGame.GE && typeof window.RSGame.GE.setSlotOffers === "function") {
              window.RSGame.GE.setSlotOffers(Array.isArray(saveData.player.geOffers) ? saveData.player.geOffers : []);
            }
          } catch (e) { /* ignore */ }
          renderSaveMenu();
        }
      };

      document.body.appendChild(script);
    });
  }

  function startGame() {
    console.log("[Game] Initializing...");

    // Attach the Player object so mods can access it
    RSGame.Game.player = window.Player;

    if (!(RSGame.Game.player.equipment instanceof RSGame.Equipment)) {
      RSGame.Game.player.equipment = new RSGame.Equipment();
    }

    // Run mod hooks before UI rendering so mods can add tabs and panels
    RSGame.Game.runHook("onGameInit", RSGame.Game);

    RSGame.Game.player.updateTotalLevel();

    RSGame.UI.applyInventorySlotFrame();
    RSGame.UI.initTabs();

    RSGame.UI.renderPlayerSummary(RSGame.Game.player);
    RSGame.UI.renderSkills(RSGame.Game.player);
    RSGame.UI.renderInventory(RSGame.Game.player);
    RSGame.UI.renderEquipment(RSGame.Game.player);
    RSGame.UI.renderStats(RSGame.Game.player);

    RSGame.Game.runHook("onAfterRender", RSGame.Game);

    setupDevUi();

    saveGame();

  }


  window.addEventListener("beforeunload", function () {
    // Auto-claim all GE offers to bank
    try {
      if (window.RSGame?.GE && typeof window.RSGame.GE.getItems === "function" && typeof window.RSGame.GE.getSlotOffers === "function") {
        const slotOffers = window.RSGame.GE.getSlotOffers?.() || [];
        if (Array.isArray(slotOffers)) {
          for (let i = 0; i < slotOffers.length; i++) {
            const offer = slotOffers[i];
            if (offer && typeof window.claimOffer === "function") {
              // Use the in-mod claimOffer if available
              window.claimOffer(i);
            } else if (window.RSGame.GE.claimOffer) {
              window.RSGame.GE.claimOffer(i);
            }
          }
        }
      }
    } catch (e) { /* ignore errors */ }

    // Auto-return duel stake offers to bank if pending
    try {
      if (window.stakeOffer && Array.isArray(window.stakeOffer) && window.stakeOffer.length > 0 && window.Player && window.RSGame?.Bank?.addToBank) {
        window.stakeOffer.forEach(entry => {
          window.RSGame.Bank.addToBank(window.Player, entry, entry.qty);
        });
        window.stakeOffer.length = 0;
      }
      if (typeof window.stakeCoins === "number" && window.stakeCoins > 0 && window.Player && window.RSGame?.Bank?.addToBank) {
        window.RSGame.Bank.addToBank(window.Player, { id: "coins", name: "Coins", icon: "https://oldschool.runescape.wiki/images/thumb/Coins_10000.png/32px-Coins_10000.png" }, window.stakeCoins);
        window.stakeCoins = 0;
      }
    } catch (e) { /* ignore errors */ }

    saveGame();
  });

  window.addEventListener("load", loadMods);
})();
