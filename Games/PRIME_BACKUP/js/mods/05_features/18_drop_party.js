window.RSGame = window.RSGame || {};

(function () {
  const ROUND_INTERVAL_MS = 15 * 60 * 1000;
  const JOIN_WINDOW_MS = 60 * 1000; // 1 minute join window per round
  const JOIN_AFTER_PLAYER_MS = 10 * 1000;
  const PENDING_AUTO_DEPOSIT_MS = 5 * 60 * 1000;
  const TICK_MS = 1000;

  const VALUE_FLOOR_BY_TIER = {
    common: 5000,
    uncommon: 10000,
    rare: 50000,
    veryRare: 250000
  };

  let gameRef = null;
  let panel = null;
  let tickTimer = null;

  const state = {
    enabled: false,
    phase: "idle", // idle | join
    nextAt: 0,
    joinEndsAt: 0,
    event: null,
    collapsed: false,
    pendingReward: null,
    joinedThisRound: false
  };

  function now() {
    return Date.now();
  }

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function pickByWeight(rows) {
    const total = rows.reduce((s, r) => s + (Number(r.weight) || 0), 0);
    if (total <= 0) return rows[0] || null;
    let roll = Math.random() * total;
    for (let i = 0; i < rows.length; i++) {
      roll -= Number(rows[i].weight) || 0;
      if (roll <= 0) return rows[i];
    }
    return rows[rows.length - 1] || null;
  }

  function formatMs(ms) {
    const total = Math.max(0, Math.floor(ms / 1000));
    const m = Math.floor(total / 60);
    const s = total % 60;
    return String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
  }

  function compact(n) {
    const v = Math.max(0, Number(n) || 0);
    if (v >= 1e9) return (v / 1e9).toFixed(1).replace(/\.0$/, "") + "b";
    if (v >= 1e6) return (v / 1e6).toFixed(1).replace(/\.0$/, "") + "m";
    if (v >= 1e3) return (v / 1e3).toFixed(1).replace(/\.0$/, "") + "k";
    return String(Math.floor(v));
  }

  function notify(text) {
    if (!state.enabled) return;
    RSGame.Events?.emit?.("notification", { text, source: "dropParty" });
    if (RSGame.UI?.addToast) {
      RSGame.UI.addToast(text, "info");
    }
  }

  function getGePrice(itemId, name) {
    const byId = Number(window.RSGame?.GE?.getCachedPriceById?.(itemId)) || 0;
    if (byId > 0) return byId;
    return Number(window.RSGame?.GE?.getCachedPriceByName?.(name || itemId)) || 0;
  }

  function getPlayerTotalValue(player) {
    if (!player) return 0;
    let total = 0;

    (player.inventory?.slots || []).forEach((slot) => {
      if (!slot || !slot.id) return;
      const qty = Math.max(0, Number(slot.qty) || 0);
      if (qty <= 0) return;
      if (slot.id === "coins") {
        total += qty;
        return;
      }
      const price = Math.max(0, getGePrice(slot.id, slot.name));
      total += price * qty;
    });

    Object.values(player.bank?.items || {}).forEach((entry) => {
      if (!entry || !entry.id) return;
      const qty = Math.max(0, Number(entry.qty) || 0);
      if (qty <= 0) return;
      if (entry.id === "coins") {
        total += qty;
        return;
      }
      const price = Math.max(0, getGePrice(entry.id, entry.name));
      total += price * qty;
    });

    Object.values(player.equipment?.slots || {}).forEach((item) => {
      if (!item || !item.id) return;
      const price = Math.max(0, getGePrice(item.id, item.name));
      total += price;
    });

    return Math.floor(total);
  }

  function chooseTier(totalValue) {
    const cappedValue = Math.max(0, Number(totalValue) || 0);
    const weights = [
      { tier: "veryRare", weight: 1 },
      { tier: "rare", weight: 9 },
      { tier: "uncommon", weight: 70 },
      { tier: "common", weight: 920 }
    ];
    let tier = pickByWeight(weights)?.tier || "common";

    // Account-value guardrail: new saves cannot roll absurd pools.
    const maxAllowedPool = Math.max(750000, Math.floor(cappedValue * 3));
    if (tier === "veryRare" && maxAllowedPool < 100000000) tier = "rare";
    if (tier === "rare" && maxAllowedPool < 50000000) tier = "uncommon";
    if (tier === "uncommon" && maxAllowedPool < 1000000) tier = "common";

    return tier;
  }

  function rollTotalPoolValue(totalValue) {
    const tier = chooseTier(totalValue);
    // New cap: 10% of account value, no hard lower bound
    const maxAllowedPool = Math.floor((Number(totalValue) || 0) * 0.10);

    let min = Math.floor(maxAllowedPool * 0.4);
    let max = maxAllowedPool;

    // Keep tier-based minimums for flavor
    if (tier === "uncommon") {
      min = Math.max(min, 1000000);
      max = Math.max(max, 5000000);
    } else if (tier === "rare") {
      min = Math.max(min, 50000000);
      max = Math.max(max, 100000000);
    } else if (tier === "veryRare") {
      min = Math.max(min, 100000000);
      max = Math.max(max, 5000000000);
    }

    if (max < min) {
      min = Math.max(1, Math.floor(max * 0.6));
    }

    const rolled = randInt(Math.max(1, min), Math.max(min, max));
    return {
      tier,
      totalValue: rolled,
      maxAllowedPool
    };
  }

  function getLootPool(minValue) {
    const geItems = window.RSGame?.GE?.getItems?.() || [];
    return geItems
      .filter((item) => item && item.id && item.name)
      .map((item) => ({
        id: String(item.id),
        name: item.name,
        price: Math.max(0, Number(item.price) || 0),
        icon: item.icon || ""
      }))
      .filter((item) => item.price >= minValue)
      .sort((a, b) => a.price - b.price);
  }

  function resolveMinItemValueByTier(tier) {
    if (tier === "veryRare") return VALUE_FLOOR_BY_TIER.veryRare;
    if (tier === "rare") return VALUE_FLOOR_BY_TIER.rare;
    if (tier === "uncommon") return VALUE_FLOOR_BY_TIER.uncommon;
    return VALUE_FLOOR_BY_TIER.common;
  }

  // Ultra-rare pool for rare+ drop parties
  const ULTRA_RARE_ITEMS = [
    { id: "partyhat_red", name: "Red partyhat", icon: "https://oldschool.runescape.wiki/images/Partyhat_%28red%29.png", price: 2000000000 },
    { id: "partyhat_blue", name: "Blue partyhat", icon: "https://oldschool.runescape.wiki/images/Partyhat_%28blue%29.png", price: 2100000000 },
    { id: "partyhat_green", name: "Green partyhat", icon: "https://oldschool.runescape.wiki/images/Partyhat_%28green%29.png", price: 2100000000 },
    { id: "partyhat_yellow", name: "Yellow partyhat", icon: "https://oldschool.runescape.wiki/images/Partyhat_%28yellow%29.png", price: 2100000000 },
    { id: "partyhat_purple", name: "Purple partyhat", icon: "https://oldschool.runescape.wiki/images/Partyhat_%28purple%29.png", price: 2100000000 },
    { id: "partyhat_white", name: "White partyhat", icon: "https://oldschool.runescape.wiki/images/Partyhat_%28white%29.png", price: 2100000000 },
    { id: "hween_mask_red", name: "Red h'ween mask", icon: "https://oldschool.runescape.wiki/images/H%27ween_mask_%28red%29.png", price: 1200000000 },
    { id: "hween_mask_blue", name: "Blue h'ween mask", icon: "https://oldschool.runescape.wiki/images/H%27ween_mask_%28blue%29.png", price: 1200000000 },
    { id: "hween_mask_green", name: "Green h'ween mask", icon: "https://oldschool.runescape.wiki/images/H%27ween_mask_%28green%29.png", price: 1200000000 },
    { id: "santa_hat", name: "Santa hat", icon: "https://oldschool.runescape.wiki/images/Santa_hat.png", price: 1500000000 },
    { id: "easter_egg", name: "Easter egg", icon: "https://oldschool.runescape.wiki/images/Easter_egg.png", price: 1000000000 },
    { id: "disk_of_returning", name: "Disk of returning", icon: "https://oldschool.runescape.wiki/images/Disk_of_returning.png", price: 900000000 },
    { id: "pumpkin", name: "Pumpkin", icon: "https://oldschool.runescape.wiki/images/Pumpkin.png", price: 900000000 },
    { id: "christmas_cracker", name: "Christmas cracker", icon: "https://oldschool.runescape.wiki/images/Christmas_cracker.png", price: 3000000000 },
    { id: "platinum_tokens_10m", name: "Platinum tokens (10m)", icon: "https://oldschool.runescape.wiki/images/Platinum_token.png", price: 10000000, qty: 10000000 }
  ];

  // Dev flag for forced rare+ drop parties
  let devForceRareParty = false;

  function buildLootBundle(poolValue, tier) {
    const minItemValue = resolveMinItemValueByTier(tier);
    const pool = getLootPool(minItemValue);
    if (!pool.length) return { entries: [], preview: [], value: 0, minItemValue };

    // Boosted loot: more items
    const itemCount = randInt(40, 400);
    const entries = [];
    let valueSoFar = 0;

    for (let i = 0; i < itemCount; i++) {
      const remaining = Math.max(1, poolValue - valueSoFar);
      const maxPick = Math.max(minItemValue, Math.floor(remaining * 0.55));
      const candidates = pool.filter((it) => it.price <= maxPick);
      const use = candidates.length ? candidates : pool.slice(0, Math.min(pool.length, 80));
      const picked = use[randInt(0, use.length - 1)];
      if (!picked) continue;

      let qty = 1;
      if (picked.price < 100000) qty = randInt(1, 16);
      else if (picked.price < 1000000) qty = randInt(1, 8);
      else qty = randInt(1, 4);

      entries.push({
        id: picked.id,
        name: picked.name,
        icon: picked.icon,
        unitValue: picked.price,
        qty,
        total: picked.price * qty
      });
      valueSoFar += picked.price * qty;
      if (valueSoFar >= poolValue * 1.15) break;
    }

    // Ultra-rare logic for rare+ drop parties
    if ((tier === "rare" || tier === "veryRare") && (devForceRareParty || randInt(1, 1000) === 1)) {
      // Pick one ultra-rare at random
      const rare = ULTRA_RARE_ITEMS[randInt(0, ULTRA_RARE_ITEMS.length - 1)];
      entries.push({
        id: rare.id,
        name: rare.name,
        icon: rare.icon,
        unitValue: rare.price,
        qty: rare.qty || 1,
        total: rare.price * (rare.qty || 1)
      });
    }

    const merged = new Map();
    entries.forEach((entry) => {
      const key = entry.id;
      if (!merged.has(key)) {
        merged.set(key, { ...entry });
        return;
      }
      const m = merged.get(key);
      m.qty += entry.qty;
      m.total += entry.total;
    });

    const finalEntries = Array.from(merged.values()).sort((a, b) => b.total - a.total);
    const finalValue = finalEntries.reduce((s, e) => s + e.total, 0);
    return {
      entries: finalEntries,
      preview: finalEntries.slice(0, 14),
      value: finalValue,
      minItemValue
    };
  }

  function playersForTier(tier, value) {
    if (tier === "veryRare") {
      return clamp(randInt(50, 100) + Math.floor(value / 250000000), 60, 100);
    }
    if (tier === "rare") return randInt(25, 60);
    if (tier === "uncommon") return randInt(14, 30);
    return randInt(10, 15);
  }

  function buildEvent(player) {
    const accountValue = getPlayerTotalValue(player);
    let poolRoll = rollTotalPoolValue(accountValue);
    // Dev: force rare+ drop party and guarantee rare
    if (devForceRareParty) {
      poolRoll.tier = "rare";
      poolRoll.totalValue = Math.max(poolRoll.totalValue, 100000000);
    }
    const bundle = buildLootBundle(poolRoll.totalValue, poolRoll.tier);
    const players = playersForTier(poolRoll.tier, bundle.value || poolRoll.totalValue);

    return {
      tier: poolRoll.tier,
      accountValue,
      targetPoolValue: poolRoll.totalValue,
      maxAllowedPool: poolRoll.maxAllowedPool,
      minItemValue: bundle.minItemValue,
      players,
      totalEntries: bundle.entries.length,
      entries: bundle.entries,
      preview: bundle.preview
    };
  }

  function depositLootToBank(player, items) {
    let gainedItems = 0;
    let gainedValue = 0;

    items.forEach((entry) => {
      if (!entry || !entry.id || entry.qty <= 0) return;
      RSGame.Bank?.addToBank?.(player, {
        id: entry.id,
        name: entry.name,
        icon: entry.icon,
        category: "Drop Party"
      }, entry.qty);
      RSGame.Bank?.recordLegitimateObtain?.(player, {
        id: entry.id,
        name: entry.name,
        icon: entry.icon,
        category: "Drop Party"
      }, entry.qty);
      gainedItems += entry.qty;
      gainedValue += entry.total;
    });

    RSGame.Bank?.refresh?.();
    RSGame.UI?.renderInventory?.(player);
    RSGame.Game?.saveNow?.();

    return { gainedItems, gainedValue };
  }

  function simulateJoinOutcome(player, event, options) {
    const opts = options || {};
    const participants = Math.max(10, Number(event.players) || 10);
    const myIndex = 0;
    const won = [];

    const tinyPoolNoLootChance = event.totalEntries <= 10 ? 0.45 : 0;
    if (Math.random() < tinyPoolNoLootChance) {
      return { won: [], gainedItems: 0, gainedValue: 0 };
    }

    event.entries.forEach((entry) => {
      let picks = Math.max(1, Math.floor(entry.qty));
      while (picks > 0) {
        const winner = randInt(0, participants - 1);
        if (winner === myIndex) {
          won.push({
            id: entry.id,
            name: entry.name,
            icon: entry.icon,
            unitValue: entry.unitValue,
            qty: 1,
            total: entry.unitValue
          });
        }
        picks -= 1;
      }
    });

    const merged = new Map();
    won.forEach((entry) => {
      if (!merged.has(entry.id)) {
        merged.set(entry.id, { ...entry });
        return;
      }
      const m = merged.get(entry.id);
      m.qty += 1;
      m.total += entry.unitValue;
    });

    let finalWon = Array.from(merged.values()).sort((a, b) => b.total - a.total);

    // Limit to 0-8 items max (randomly chosen if more)
    const MAX_DROP_PARTY_ITEMS = 8;
    if (finalWon.length > MAX_DROP_PARTY_ITEMS) {
      // Shuffle and pick 8
      for (let i = finalWon.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [finalWon[i], finalWon[j]] = [finalWon[j], finalWon[i]];
      }
      finalWon = finalWon.slice(0, MAX_DROP_PARTY_ITEMS);
    }

    if (opts.forceReward && finalWon.length === 0) {
      const fallback = (event.entries || []).find((entry) => entry && entry.id && entry.unitValue > 0);
      if (fallback) {
        finalWon = [{
          id: fallback.id,
          name: fallback.name,
          icon: fallback.icon,
          unitValue: fallback.unitValue,
          qty: 1,
          total: fallback.unitValue
        }];
      }
    }

    const gainedItems = finalWon.reduce((sum, entry) => sum + (Number(entry.qty) || 0), 0);
    const gainedValue = finalWon.reduce((sum, entry) => sum + (Number(entry.total) || 0), 0);
    return {
      won: finalWon,
      gainedItems,
      gainedValue
    };
  }

  function renderResultRows(items) {
    return (items || []).slice(0, 20).map((entry) => {
      return ''
        + '<div class="drop-party-result-row">'
        + '  <img src="' + (entry.icon || "") + '" alt="' + entry.name + '">'
        + '  <span class="drop-party-result-name">' + entry.name + '</span>'
        + '  <span class="drop-party-result-qty">' + compact(entry.qty) + 'x</span>'
        + '  <span class="drop-party-result-val">~' + compact(entry.total) + ' gp</span>'
        + '</div>';
    }).join("");
  }

  function showResultPanel(result) {
    if (!panel) return;
    const wrap = panel.querySelector("#drop-party-result");
    const body = panel.querySelector("#drop-party-result-body");
    const depositBtn = panel.querySelector("#drop-party-result-deposit");
    const closeBtn = panel.querySelector("#drop-party-result-close");
    if (!wrap || !body || !depositBtn || !closeBtn) return;

    state.pendingReward = result;
    state.pendingRewardTime = now();

    if (!result || !result.won || result.won.length === 0) {
      body.innerHTML = '<div class="drop-party-result-empty">No loot this round. Better luck next time.</div>';
      depositBtn.disabled = true;
      // Auto-close the no-loot result toast without changing round cadence.
      setTimeout(() => {
        hideResultPanel();
        render();
      }, 2000);
    } else {
      body.innerHTML = ''
        + '<div class="drop-party-result-summary">'
        + 'Items: <strong>' + compact(result.gainedItems) + '</strong> | Value: <strong>~' + compact(result.gainedValue) + ' gp</strong>'
        + '</div>'
        + '<div class="drop-party-result-list">'
        + renderResultRows(result.won)
        + '</div>';
      depositBtn.disabled = false;
    }

    wrap.hidden = false;
  }

  function hideResultPanel() {
    if (!panel) return;
    const wrap = panel.querySelector("#drop-party-result");
    if (wrap) wrap.hidden = true;
    state.pendingReward = null;
    state.pendingRewardTime = 0;
  }

  function ensurePanel() {
    if (panel) return panel;

    const tabBar = document.querySelector("#tab-bar");
    const mainLayout = document.querySelector(".main-layout");
    if (!tabBar || !mainLayout) return null;

    const tabBtn = document.createElement("button");
    tabBtn.className = "tab-btn";
    tabBtn.dataset.tab = "drop-party";
    tabBtn.innerHTML = '<img class="tab-icon" src="https://oldschool.runescape.wiki/images/Partyhat_%28red%29.png" alt="Drop Party" onerror="this.onerror=null;this.src=\'https://oldschool.runescape.wiki/images/Coins_10000.png\';"><span class="tab-label">Drop Party</span>';
    tabBar.appendChild(tabBtn);

    panel = document.createElement("section");
    panel.id = "drop-party-panel";
    panel.className = "panel drop-party-panel drop-party-tab-panel";
    panel.dataset.panel = "drop-party";
    panel.style.display = "none";
    panel.innerHTML = ""
      + '<h2>Drop Party</h2>'
      + '<div class="drop-party-body" id="drop-party-body">'
      + '  <div id="drop-party-status" class="drop-party-status">INSTA DP is disabled in Dev Menu.</div>'
      + '  <div id="drop-party-meta" class="drop-party-meta"></div>'
      + '  <div id="drop-party-loot" class="drop-party-loot-grid"></div>'
      + '  <button type="button" id="drop-party-open-pending" class="drop-party-test-btn" hidden>Open Pending Loot</button>'
      + '  <button type="button" id="drop-party-start-now" class="drop-party-test-btn" hidden>Generate Drop Party!</button>'
      + '  <button type="button" id="drop-party-join" class="drop-party-join-btn" disabled>Join Drop Party</button>'
      + '  <div id="drop-party-result" class="drop-party-result" hidden>'
      + '    <div class="drop-party-result-head">Drop Party Results</div>'
      + '    <div id="drop-party-result-body" class="drop-party-result-body"></div>'
      + '    <div class="drop-party-result-actions">'
      + '      <button type="button" id="drop-party-result-deposit" class="drop-party-join-btn">Deposit to Bank</button>'
      + '      <button type="button" id="drop-party-result-close" class="drop-party-test-btn">Close</button>'
      + '    </div>'
      + '  </div>'
      + '</div>';

    mainLayout.appendChild(panel);

    panel.querySelector("#drop-party-join").addEventListener("click", () => {
      if (!state.enabled || state.phase !== "join" || !state.event || !gameRef?.player) return;
      state.joinedThisRound = true;
      state.joinEndsAt = now() + JOIN_AFTER_PLAYER_MS;
      notify("Drop Party: Joined. Loot will roll when the timer ends.");
      render();
    });

    panel.querySelector("#drop-party-start-now").addEventListener("click", () => {
      if (!state.enabled || !gameRef?.player || state.phase === "join") return;
      const t = now();
      state.event = buildEvent(gameRef.player);
      state.event.testMode = true;
      state.phase = "join";
      state.joinEndsAt = t + JOIN_WINDOW_MS;
      state.joinedThisRound = false;
      notify("Drop Party test round started instantly.");
      render();
    });

    panel.querySelector("#drop-party-open-pending").addEventListener("click", () => {
      if (!state.pendingReward) return;
      showResultPanel(state.pendingReward);
    });

    panel.querySelector("#drop-party-result-deposit").addEventListener("click", () => {
      if (!state.enabled || !gameRef?.player || !state.pendingReward) return;
      const pending = state.pendingReward;
      const outcome = depositLootToBank(gameRef.player, pending.won || []);
      if (outcome.gainedItems > 0) {
        notify("Drop Party: Deposited " + compact(outcome.gainedItems) + " items worth ~" + compact(outcome.gainedValue) + " gp to bank.");
      } else {
        notify("Drop Party: No loot to deposit from this round.");
      }
      hideResultPanel();
      state.phase = "idle";
      state.nextAt = now() + ROUND_INTERVAL_MS;
      state.joinedThisRound = false;
      render();
    });

    panel.querySelector("#drop-party-result-close").addEventListener("click", () => {
      hideResultPanel();
      render();
    });

    return panel;
  }

  function renderLootPreview(entries) {
    const lootEl = panel.querySelector("#drop-party-loot");
    if (!lootEl) return;
    lootEl.innerHTML = "";
    (entries || []).forEach((entry) => {
      const card = document.createElement("div");
      card.className = "drop-party-loot-item";
      card.innerHTML = ""
        + '<img src="' + (entry.icon || "") + '" alt="' + entry.name + '">'
        + '<div class="drop-party-loot-name">' + entry.name + '</div>'
        + '<div class="drop-party-loot-qty">' + compact(entry.qty) + 'x</div>'
        + '<div class="drop-party-loot-value">~' + compact(entry.total) + ' gp</div>';
      lootEl.appendChild(card);
    });
  }

  function render() {
    if (!panel) return;

    const statusEl = panel.querySelector("#drop-party-status");
    const metaEl = panel.querySelector("#drop-party-meta");
    const startNowBtn = panel.querySelector("#drop-party-start-now");
    const joinBtn = panel.querySelector("#drop-party-join");
    const openPendingBtn = panel.querySelector("#drop-party-open-pending");

    // Always enabled: remove dev menu dependency and messages

    // Remove the Generate Drop Party! button from UI
    if (startNowBtn) {
      startNowBtn.hidden = true;
    }

    if (openPendingBtn) {
      openPendingBtn.hidden = !state.pendingReward;
    }

    if (state.phase === "join" && state.event) {
      const left = Math.max(0, state.joinEndsAt - now());
      if (statusEl) statusEl.textContent = "Drop Party active. Loot rolls in: " + formatMs(left);
      if (metaEl) {
        metaEl.innerHTML = ""
          + '<div>Tier: <strong>' + state.event.tier + '</strong></div>'
          + '<div>Pool: <strong>~' + compact(state.event.targetPoolValue) + ' gp</strong></div>'
          + '<div>Players: <strong>' + state.event.players + '</strong></div>'
          + '<div>Min item value: <strong>' + compact(state.event.minItemValue) + ' gp</strong></div>'
          + '<div>You: <strong>' + (state.joinedThisRound ? "Joined" : "Not Joined") + '</strong></div>';
      }
      renderLootPreview(state.event.preview);
      if (joinBtn) {
        joinBtn.disabled = state.joinedThisRound;
        joinBtn.textContent = state.joinedThisRound ? "Joined" : "Join Drop Party";
      }
      return;
    }

    const untilNext = Math.max(0, state.nextAt - now());
    if (state.pendingReward) {
      if (statusEl) statusEl.textContent = "Claim pending. Next drop party in: " + formatMs(untilNext);
      if (metaEl) metaEl.innerHTML = "<div>Your loot can be deposited now or will auto-deposit in 5 minutes.</div>";
    } else {
      if (statusEl) statusEl.textContent = "Next drop party in: " + formatMs(untilNext);
      if (metaEl) metaEl.innerHTML = "<div>Drop parties run every 15 minutes.</div>";
    }
    renderLootPreview([]);
    if (joinBtn) {
      joinBtn.disabled = true;
      joinBtn.textContent = "Join Drop Party";
    }
  }

  function startRoundIfNeeded() {
    if (!state.enabled || !gameRef?.player) return;

    const t = now();

    if (state.phase === "idle" && t >= state.nextAt) {
      console.log('[DropParty DEBUG] Transition: idle → join', { t, nextAt: state.nextAt });
      state.event = buildEvent(gameRef.player);
      state.phase = "join";
      state.joinEndsAt = t + JOIN_WINDOW_MS;
      state.joinedThisRound = false;
      notify("Drop Party incoming! Join within 1 minute.");
      render();
      return;
    }

    if (state.phase === "join" && t >= state.joinEndsAt) {
      if (state.joinedThisRound) {
        const forceReward = !!state.event?.testMode;
        const result = simulateJoinOutcome(gameRef.player, state.event, { forceReward });
        showResultPanel(result);
        state.phase = "idle";
        state.nextAt = t + ROUND_INTERVAL_MS;
        state.event = null;
        console.log('[DropParty DEBUG] Transition: join → idle (joined)', { t, nextAt: state.nextAt });
        notify("Drop Party ended. Review loot and deposit to bank.");
        render();
        return;
      }

      state.phase = "idle";
      state.event = null;
      state.nextAt = t + ROUND_INTERVAL_MS;
      state.joinedThisRound = false;
      console.log('[DropParty DEBUG] Transition: join → idle (skipped)', { t, nextAt: state.nextAt });
      notify("Drop Party round skipped. Next round in 15 minutes.");
      render();
      return;
    }
  }

  // Always enabled: no-op
  function setEnabled(enabled) {
    state.enabled = true;
    state.phase = "idle";
    state.event = null;
    hideResultPanel();
    state.joinedThisRound = false;
    state.nextAt = now() + ROUND_INTERVAL_MS;
    console.log('[DropParty DEBUG] setEnabled called, phase set to idle, nextAt:', state.nextAt);
    render();
  }

  function onTick() {
    if (!panel) return;
    if (!state.enabled) {
      render();
      return;
    }
    // Auto-send loot to bank if unclaimed for 5 minutes.
    // This no longer blocks the 15-minute round schedule.
    if (state.pendingReward && state.pendingRewardTime) {
      const t = now();
      if (t - state.pendingRewardTime >= PENDING_AUTO_DEPOSIT_MS) {
        const outcome = depositLootToBank(gameRef.player, state.pendingReward.won || []);
        if (outcome.gainedItems > 0) {
          notify("Drop Party: Unclaimed loot auto-deposited (" + compact(outcome.gainedItems) + " items, ~" + compact(outcome.gainedValue) + " gp) to bank.");
        } else {
          notify("Drop Party: No loot to auto-deposit from this round.");
        }
        state.pendingReward = null;
        state.pendingRewardTime = 0;
        console.log('[DropParty DEBUG] Auto-deposit complete', { t, nextAt: state.nextAt });
        render();
      }
    }
    startRoundIfNeeded();
    render();
  }

  // Allow dev menu to set rare+ flag
  window.RSGame.FunModeDropPartySetRareFlag = (flag) => {
    devForceRareParty = !!flag;
  };

  RSGame.Game.registerMod({
    name: "Fun Mode Drop Party",

    onGameInit(game) {
      gameRef = game;
      ensurePanel();
      setEnabled(true);

      RSGame.Events?.on?.("funModeChanged", ({ enabled }) => {
        setEnabled(!!enabled);
      });

      if (tickTimer) clearInterval(tickTimer);
      tickTimer = setInterval(onTick, TICK_MS);
      onTick();

      // Keep first round on the same fixed 15-minute cadence as subsequent rounds.
    },

    onAfterRender() {
      onTick();
    }
  });
})();
