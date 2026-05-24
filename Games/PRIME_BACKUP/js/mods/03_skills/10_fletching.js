window.RSGame = window.RSGame || {};

(function () {
  let mountedHost = null;
  let mountedRoot = null;
  let mountedApi = null;

  function wikiIcon(file) {
    return "https://oldschool.runescape.wiki/images/thumb/" + file + "/32px-" + file;
  }

  const FLETCH_RECIPES = {
    normal_log: {
      logName: "Logs",
      logIcon: wikiIcon("Logs.png"),
      short: { level: 5, xp: 5, outId: "normal_shortbow_u", outName: "Shortbow (u)", outIcon: wikiIcon("Shortbow_(u).png") },
      long: { level: 10, xp: 10, outId: "normal_longbow_u", outName: "Longbow (u)", outIcon: wikiIcon("Longbow_(u).png") }
    },
    oak_log: {
      logName: "Oak Logs",
      logIcon: wikiIcon("Oak_logs.png"),
      short: { level: 20, xp: 16.5, outId: "oak_shortbow_u", outName: "Oak shortbow (u)", outIcon: wikiIcon("Oak_shortbow_(u).png") },
      long: { level: 25, xp: 25, outId: "oak_longbow_u", outName: "Oak longbow (u)", outIcon: wikiIcon("Oak_longbow_(u).png") }
    },
    willow_log: {
      logName: "Willow Logs",
      logIcon: wikiIcon("Willow_logs.png"),
      short: { level: 35, xp: 33.3, outId: "willow_shortbow_u", outName: "Willow shortbow (u)", outIcon: wikiIcon("Willow_shortbow_(u).png") },
      long: { level: 40, xp: 41.5, outId: "willow_longbow_u", outName: "Willow longbow (u)", outIcon: wikiIcon("Willow_longbow_(u).png") }
    },
    maple_log: {
      logName: "Maple Logs",
      logIcon: wikiIcon("Maple_logs.png"),
      short: { level: 50, xp: 50, outId: "maple_shortbow_u", outName: "Maple shortbow (u)", outIcon: wikiIcon("Maple_shortbow_(u).png") },
      long: { level: 55, xp: 58.3, outId: "maple_longbow_u", outName: "Maple longbow (u)", outIcon: wikiIcon("Maple_longbow_(u).png") }
    },
    yew_log: {
      logName: "Yew Logs",
      logIcon: wikiIcon("Yew_logs.png"),
      short: { level: 65, xp: 67.5, outId: "yew_shortbow_u", outName: "Yew shortbow (u)", outIcon: wikiIcon("Yew_shortbow_(u).png") },
      long: { level: 70, xp: 75, outId: "yew_longbow_u", outName: "Yew longbow (u)", outIcon: wikiIcon("Yew_longbow_(u).png") }
    },
    magic_log: {
      logName: "Magic Logs",
      logIcon: wikiIcon("Magic_logs.png"),
      short: { level: 80, xp: 83.3, outId: "magic_shortbow_u", outName: "Magic shortbow (u)", outIcon: wikiIcon("Magic_shortbow_(u).png") },
      long: { level: 85, xp: 91.5, outId: "magic_longbow_u", outName: "Magic longbow (u)", outIcon: wikiIcon("Magic_longbow_(u).png") }
    }
  };

  const STRINGING_RECIPES = {
    normal_shortbow_u: { level: 5, xp: 5, outId: "normal_shortbow", outName: "Shortbow", outIcon: wikiIcon("Shortbow.png") },
    normal_longbow_u: { level: 10, xp: 10, outId: "normal_longbow", outName: "Longbow", outIcon: wikiIcon("Longbow.png") },
    oak_shortbow_u: { level: 20, xp: 16.5, outId: "oak_shortbow", outName: "Oak shortbow", outIcon: wikiIcon("Oak_shortbow.png") },
    oak_longbow_u: { level: 25, xp: 25, outId: "oak_longbow", outName: "Oak longbow", outIcon: wikiIcon("Oak_longbow.png") },
    willow_shortbow_u: { level: 35, xp: 33.3, outId: "willow_shortbow", outName: "Willow shortbow", outIcon: wikiIcon("Willow_shortbow.png") },
    willow_longbow_u: { level: 40, xp: 41.5, outId: "willow_longbow", outName: "Willow longbow", outIcon: wikiIcon("Willow_longbow.png") },
    maple_shortbow_u: { level: 50, xp: 50, outId: "maple_shortbow", outName: "Maple shortbow", outIcon: wikiIcon("Maple_shortbow.png") },
    maple_longbow_u: { level: 55, xp: 58.3, outId: "maple_longbow", outName: "Maple longbow", outIcon: wikiIcon("Maple_longbow.png") },
    yew_shortbow_u: { level: 65, xp: 67.5, outId: "yew_shortbow", outName: "Yew shortbow", outIcon: wikiIcon("Yew_shortbow.png") },
    yew_longbow_u: { level: 70, xp: 75, outId: "yew_longbow", outName: "Yew longbow", outIcon: wikiIcon("Yew_longbow.png") },
    magic_shortbow_u: { level: 80, xp: 83.3, outId: "magic_shortbow", outName: "Magic shortbow", outIcon: wikiIcon("Magic_shortbow.png") },
    magic_longbow_u: { level: 85, xp: 91.5, outId: "magic_longbow", outName: "Magic longbow", outIcon: wikiIcon("Magic_longbow.png") }
  };

  const BOWSTRING_IDS = ["bow_string", 1777, "1777"];

  function getPlayer() {
    return window.Player;
  }

  function getSkillLevel() {
    return Math.max(1, Number(getPlayer()?.skills?.Fletching?.level) || 1);
  }

  function hasKnife() {
    const slots = getPlayer()?.inventory?.slots || [];
    return slots.some((slot) => slot && slot.id === "knife" && !slot.noted);
  }


  function countItemByIdOrName(itemId, itemName) {
    const slots = getPlayer()?.inventory?.slots || [];
    return slots.reduce((sum, slot) => {
      if (!slot || slot.noted) return sum;
      if (slot.id === itemId || (itemName && String(slot.name || '').toLowerCase() === String(itemName).toLowerCase())) {
        return sum + (Number(slot.qty) || 0);
      }
      return sum;
    }, 0);
  }

  function countBowstring() {
    const slots = getPlayer()?.inventory?.slots || [];
    return slots.reduce((sum, slot) => {
      if (!slot || slot.noted) return sum;
      const idMatch = BOWSTRING_IDS.includes(slot.id);
      const name = String(slot.name || "").toLowerCase();
      const nameMatch = name.includes("bow string") || name === "bowstring";
      if (!idMatch && !nameMatch) return sum;
      return sum + (Number(slot.qty) || 0);
    }, 0);
  }

  function takeOneMatching(predicate) {
    const slots = getPlayer()?.inventory?.slots || [];
    for (let i = 0; i < slots.length; i++) {
      const slot = slots[i];
      if (!slot || slot.noted) continue;
      if (!predicate(slot)) continue;

      const taken = {
        id: slot.id,
        name: slot.name,
        icon: slot.icon,
        noted: !!slot.noted
      };

      slot.qty -= 1;
      if (slot.qty <= 0) slots[i] = null;
      return taken;
    }
    return null;
  }

  function addProduct(itemId, itemName, itemIcon, qty) {
    const inv = getPlayer()?.inventory;
    if (!inv) return false;

    for (let i = 0; i < qty; i++) {
      const ok = inv.addItem({
        id: itemId,
        name: itemName,
        qty: 1,
        icon: itemIcon
      });
      if (!ok) return i > 0;
    }
    return true;
  }

  function recordLegit(itemId, itemName, itemIcon, qty) {
    const player = getPlayer();
    if (!player) return;
    RSGame.Bank?.recordLegitimateObtain?.(player, {
      id: itemId,
      name: itemName,
      icon: itemIcon,
      category: "Fletching"
    }, qty);
  }

  function putBackOne(item) {
    if (!item) return false;
    return addProduct(item.id, item.name, item.icon, 1);
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

  function promptAmount(maxQty) {
    const input = window.prompt("How many? You can use 1k, 10k, 1m, 1b (max " + maxQty.toLocaleString() + ")");
    const value = parseAmountInput(input);
    if (!value) return 0;
    return Math.max(1, Math.min(value, maxQty));
  }

  function gainFletchingXp(amount) {
    const skill = getPlayer()?.skills?.Fletching;
    if (!skill || amount <= 0) return;
    skill.addXP(amount);
    RSGame.Events?.emit?.("xpGain", { skill: "Fletching", amount });
  }

  function refreshUi() {
    const p = getPlayer();
    if (!p) return;
    p.updateTotalLevel?.();
    RSGame.UI?.renderPlayerSummary?.(p);
    RSGame.UI?.renderSkills?.(p);
    RSGame.UI?.renderInventory?.(p);
    RSGame.Bank?.refresh?.();
    RSGame.Game?.saveNow?.();
  }

  function doFletch(logId, bowType, requestedQty) {
    const recipeSet = FLETCH_RECIPES[logId];
    if (!recipeSet) return { ok: false, message: "That log type cannot be fletched yet." };
    const recipe = recipeSet[bowType];
    if (!recipe) return { ok: false, message: "Invalid recipe." };

    if (!hasKnife()) {
      return { ok: false, message: "You need a knife to fletch logs." };
    }

    if (getSkillLevel() < recipe.level) {
      return { ok: false, message: "Requires Fletching level " + recipe.level + "." };
    }

    const logName = recipeSet?.logName;
    const availableLogs = countItemByIdOrName(logId, logName);
    if (availableLogs <= 0) {
      return { ok: false, message: "No logs available." };
    }

    const qty = Math.max(1, Math.min(requestedQty, availableLogs));
    let crafted = 0;

    for (let i = 0; i < qty; i++) {
      const consumedLog = takeOneMatching((slot) => slot.id === logId || (logName && String(slot.name || '').toLowerCase() === String(logName).toLowerCase()));
      if (!consumedLog) break;

      const added = addProduct(recipe.outId, recipe.outName, recipe.outIcon, 1);
      if (!added) {
        putBackOne(consumedLog);
        break;
      }
      crafted += 1;
    }

    if (!crafted) {
      return { ok: false, message: "Inventory is full." };
    }

    gainFletchingXp(recipe.xp * crafted);
    recordLegit(recipe.outId, recipe.outName, recipe.outIcon, crafted);
    RSGame.Clues?.trySkillingDrop?.(getPlayer(), "Fletching", crafted);
    refreshUi();
    return { ok: true, message: "Fletched " + crafted + " x " + recipe.outName + "." };
  }

  function doString(unstrungId, requestedQty) {
    const recipe = STRINGING_RECIPES[unstrungId];
    if (!recipe) return { ok: false, message: "That item cannot be strung." };

    if (getSkillLevel() < recipe.level) {
      return { ok: false, message: "Requires Fletching level " + recipe.level + "." };
    }

    const unstrungName = recipe?.outName;
    const availableBows = countItemByIdOrName(unstrungId, unstrungName);
    const availableString = countBowstring();
    const maxPossible = Math.min(availableBows, availableString);
    if (maxPossible <= 0) {
      return { ok: false, message: "You need an unstrung bow and bow string." };
    }

    const qty = Math.max(1, Math.min(requestedQty, maxPossible));
    let crafted = 0;

    for (let i = 0; i < qty; i++) {
      const consumedUnstrung = takeOneMatching((slot) => slot.id === unstrungId || (unstrungName && String(slot.name || '').toLowerCase() === String(unstrungName).toLowerCase()));
      if (!consumedUnstrung) break;

      const consumedString = takeOneMatching((slot) => {
        const idMatch = BOWSTRING_IDS.includes(slot.id);
        const name = String(slot.name || "").toLowerCase();
        const nameMatch = name.includes("bow string") || name === "bowstring";
        return idMatch || nameMatch;
      });

      if (!consumedString) {
        putBackOne(consumedUnstrung);
        break;
      }

      const added = addProduct(recipe.outId, recipe.outName, recipe.outIcon, 1);
      if (!added) {
        putBackOne(consumedUnstrung);
        putBackOne(consumedString);
        break;
      }
      crafted += 1;
    }

    if (!crafted) {
      return { ok: false, message: "Inventory is full." };
    }

    gainFletchingXp(recipe.xp * crafted);
    recordLegit(recipe.outId, recipe.outName, recipe.outIcon, crafted);
    RSGame.Clues?.trySkillingDrop?.(getPlayer(), "Fletching", crafted);
    refreshUi();
    return { ok: true, message: "Strung " + crafted + " x " + recipe.outName + "." };
  }

  function fletchWithPrompt(logId, bowType) {
    const recipeSet = FLETCH_RECIPES[logId];
    const logName = recipeSet?.logName;
    const maxQty = countItemByIdOrName(logId, logName);
    if (maxQty <= 0) return { ok: false, message: "No logs available." };
    const chosen = promptAmount(maxQty);
    if (!chosen) return { ok: false, message: "Cancelled." };
    return doFletch(logId, bowType, chosen);
  }

  function stringWithPrompt(unstrungId) {
    const recipe = STRINGING_RECIPES[unstrungId];
    const unstrungName = recipe?.outName;
    const maxQty = Math.min(countItemByIdOrName(unstrungId, unstrungName), countBowstring());
    if (maxQty <= 0) return { ok: false, message: "You need unstrung bows and bow string." };
    const chosen = promptAmount(maxQty);
    if (!chosen) return { ok: false, message: "Cancelled." };
    return doString(unstrungId, chosen);
  }

  function buildPanel(game, panel) {
    panel.innerHTML = ""
      + '<h2>Fletching</h2>'
      + '<div class="fletching-layout">'
      + '  <div class="fletching-summary">'
      + '    <div><strong>Knife:</strong> <span id="fletch-knife-state">No</span></div>'
      + '    <div><strong>Bow string:</strong> <span id="fletch-bowstring-count">0</span></div>'
      + '    <div class="fletching-summary-note">Buy bow string from the G.E for now, then string your bows here.</div>'
      + '  </div>'
      + '  <div id="fletching-grid" class="fletching-grid"></div>'
      + '  <div id="fletching-status" class="fletching-status"></div>'
      + '</div>';

    const gridEl = panel.querySelector("#fletching-grid");
    const knifeEl = panel.querySelector("#fletch-knife-state");
    const bowStringEl = panel.querySelector("#fletch-bowstring-count");
    const statusEl = panel.querySelector("#fletching-status");

    function setStatus(text, isError) {
      statusEl.textContent = text || "";
      statusEl.classList.toggle("error", !!isError);
    }

    function runAction(action) {
      const result = action();
      if (!result) return;
      if (result.message && result.message !== "Cancelled.") {
        setStatus(result.message, !result.ok);
      }
      render();
    }

    function render() {
      const fletchLevel = getSkillLevel();
      knifeEl.textContent = hasKnife() ? "Yes" : "No";
      bowStringEl.textContent = String(countBowstring());

      gridEl.innerHTML = "";
      Object.keys(FLETCH_RECIPES).forEach((logId) => {
        const recipeSet = FLETCH_RECIPES[logId];
        const shortRecipe = recipeSet.short;
        const longRecipe = recipeSet.long;

        const shortString = STRINGING_RECIPES[shortRecipe.outId];
        const longString = STRINGING_RECIPES[longRecipe.outId];

        const row = document.createElement("div");
        row.className = "fletching-row";
        row.innerHTML = ""
          + '<div class="fletching-log">'
          + '  <img src="' + recipeSet.logIcon + '" alt="' + recipeSet.logName + '">'
          + '  <div>'
          + '    <div class="fletching-log-name">' + recipeSet.logName + '</div>'
          + '    <div class="fletching-log-count">You have: ' + countItem(logId).toLocaleString() + '</div>'
          + '  </div>'
          + '</div>'
          + '<div class="fletching-actions">'
          + '  <button type="button" class="fletch-btn" data-action="short">Cut shortbow (u)</button>'
          + '  <button type="button" class="fletch-btn" data-action="long">Cut longbow (u)</button>'
          + '  <button type="button" class="fletch-btn" data-action="short-string">String shortbow</button>'
          + '  <button type="button" class="fletch-btn" data-action="long-string">String longbow</button>'
          + '</div>'
          + '<div class="fletching-req">'
          + '  <div>Short: Lv ' + shortRecipe.level + ' | ' + shortRecipe.xp + ' XP</div>'
          + '  <div>Long: Lv ' + longRecipe.level + ' | ' + longRecipe.xp + ' XP</div>'
          + '  <div>Stringing requires bow string.</div>'
          + '</div>';

        const shortBtn = row.querySelector('[data-action="short"]');
        const longBtn = row.querySelector('[data-action="long"]');
        const shortStringBtn = row.querySelector('[data-action="short-string"]');
        const longStringBtn = row.querySelector('[data-action="long-string"]');

        shortBtn.disabled = fletchLevel < shortRecipe.level || !hasKnife() || countItem(logId) <= 0;
        longBtn.disabled = fletchLevel < longRecipe.level || !hasKnife() || countItem(logId) <= 0;
        shortStringBtn.disabled = fletchLevel < shortString.level || countItem(shortRecipe.outId) <= 0 || countBowstring() <= 0;
        longStringBtn.disabled = fletchLevel < longString.level || countItem(longRecipe.outId) <= 0 || countBowstring() <= 0;

        shortBtn.addEventListener("click", () => runAction(() => fletchWithPrompt(logId, "short")));
        longBtn.addEventListener("click", () => runAction(() => fletchWithPrompt(logId, "long")));
        shortStringBtn.addEventListener("click", () => runAction(() => stringWithPrompt(shortRecipe.outId)));
        longStringBtn.addEventListener("click", () => runAction(() => stringWithPrompt(longRecipe.outId)));

        gridEl.appendChild(row);
      });
    }

    RSGame.Events?.on?.("playerUpdated", render);
    RSGame.Events?.on?.("inventoryRendered", render);
    render();

    return { render, setStatus };
  }

  function getInventoryContextEntries({ slot, setStatus, onChange }) {
    const entries = [];

    if (!slot || slot.noted) {
      return entries;
    }

    if (slot.id === "knife") {
      entries.push({
        label: "Use-Knife",
        action: () => {
          const tab = document.querySelector('.tab-btn[data-tab="gathering"]');
          tab?.click();
          RSGame.Events?.emit?.("gatheringSelectSkill", { skill: "fletching" });
          setStatus?.("Choose a log type to fletch.", false);
        }
      });
      return entries;
    }

    const logRecipes = FLETCH_RECIPES[slot.id];
    if (logRecipes && hasKnife()) {
      entries.push({
        label: "Fletch-Shortbow (u)",
        action: () => {
          const res = fletchWithPrompt(slot.id, "short");
          if (res.message && res.message !== "Cancelled.") setStatus?.(res.message, !res.ok);
          if (res.ok) onChange?.();
        }
      });
      entries.push({
        label: "Fletch-Longbow (u)",
        action: () => {
          const res = fletchWithPrompt(slot.id, "long");
          if (res.message && res.message !== "Cancelled.") setStatus?.(res.message, !res.ok);
          if (res.ok) onChange?.();
        }
      });
      return entries;
    }

    const stringRecipe = STRINGING_RECIPES[slot.id];
    if (stringRecipe) {
      entries.push({
        label: "String-Bow",
        action: () => {
          const res = stringWithPrompt(slot.id);
          if (res.message && res.message !== "Cancelled.") setStatus?.(res.message, !res.ok);
          if (res.ok) onChange?.();
        }
      });
    }

    return entries;
  }

  RSGame.Fletching = {
    getInventoryContextEntries,
    doFletch,
    doString,
    mountInGathering(host, game) {
      if (!host || !game) return;
      if (!mountedRoot) {
        mountedRoot = document.createElement("div");
        mountedApi = buildPanel(game, mountedRoot);
      }

      if (mountedHost === host) {
        mountedApi?.render?.();
        return;
      }

      host.innerHTML = "";
      host.appendChild(mountedRoot);
      mountedHost = host;
      mountedApi?.render?.();
    }
  };

  RSGame.Game.registerMod({
    name: "Fletching",

    onGameInit() {}
  });
})();
