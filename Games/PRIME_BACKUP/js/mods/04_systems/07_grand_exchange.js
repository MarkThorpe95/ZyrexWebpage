const GE_OFFERS_KEY = "rsgame.geOffers.v1";
  // Track last selected item ID for GE offer editor
  let lastSelectedItemId = null;
window.RSGame = window.RSGame || {};

(function () {
  const GE_CACHE_KEY = "rsgame.geCache.v1";
  const GE_CACHE_TTL_MS = 4 * 60 * 60 * 1000;
  const SEARCH_DEBOUNCE_MS = 600;
  const FILL_TICK_MS = 2000;
  const COINS_PER_PLAT_TOKEN = 1000;
  const PLAT_TOKENS_PER_DIVINE_TOKEN = 100_000;
  const COINS_PER_DIVINE_TOKEN = 1_000_000_000;

  const GE_MAPPING_URL = "https://prices.runescape.wiki/api/v1/osrs/mapping";
  const GE_LATEST_URL = "https://prices.runescape.wiki/api/v1/osrs/latest";

  function nowMs() {
    return Date.now();
  }

  function normalizeLookupName(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/[_-]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function safeParse(json, fallback) {
    try {
      return JSON.parse(json);
    } catch (_err) {
      return fallback;
    }
  }

  function getCachedGeData() {
    const raw = localStorage.getItem(GE_CACHE_KEY);
    const parsed = safeParse(raw, null);
    if (!parsed || !Array.isArray(parsed.items) || !parsed.fetchedAt) return null;
    return parsed;
  }

  function setCachedGeData(payload) {
    localStorage.setItem(GE_CACHE_KEY, JSON.stringify(payload));
  }

  function isCacheFresh(cache) {
    if (!cache || !cache.fetchedAt) return false;
    return nowMs() - Number(cache.fetchedAt) < GE_CACHE_TTL_MS;
  }

  function buildPriceMap(latestData) {
      // Price overrides for rares (values in gp)
      const RARE_PRICE_OVERRIDES = {
        "purple partyhat": 10_000_000_000,
        "yellow partyhat": 15_000_000_000,
        "green partyhat": 25_000_000_000,
        "red partyhat": 50_000_000_000,
        "white partyhat": 150_000_000_000,
        "blue partyhat": 500_000_000_000,
        "santa hat": 5_000_000_000,
        "green halloween mask": 1_500_000_000,
        "blue halloween mask": 3_000_000_000,
        "red halloween mask": 7_000_000_000,
        "easter egg": 1_000_000_000,
        "pumpkin": 1_000_000_000,
        "disk of returning": 2_000_000_000
      };

      // Calculate Christmas cracker price as sum of all above + 10%
      const crackerBase = Object.values(RARE_PRICE_OVERRIDES).reduce((a, b) => a + b, 0);
      RARE_PRICE_OVERRIDES["christmas cracker"] = Math.round(crackerBase * 1.10);
    const data = latestData && latestData.data ? latestData.data : {};
    const map = {};

    Object.keys(data).forEach((id) => {
      const entry = data[id] || {};
      const high = Number(entry.high) || 0;
      const low = Number(entry.low) || 0;
      let price = 0;

      if (high > 0 && low > 0) {
        price = Math.round((high + low) / 2);
      } else if (high > 0) {
        price = high;
      } else if (low > 0) {
        price = low;
      }

      // Apply price override by name if present
      const name = (entry.name || "").toLowerCase().trim();
      if (RARE_PRICE_OVERRIDES.hasOwnProperty(name)) {
        price = RARE_PRICE_OVERRIDES[name];
      }

      map[Number(id)] = { high, low, price };
    });

    return map;
  }

  function getIconCandidates(itemId, iconFile, explicitIcon) {
    const id = Number(itemId) || 0;
    const candidates = [];

    if (explicitIcon) {
      candidates.push(explicitIcon);
    }

    if (id > 0) {
      candidates.push("https://static.runelite.net/cache/item/icon/" + id + ".png");
    }

    if (iconFile) {
      if (iconFile.startsWith("http://") || iconFile.startsWith("https://")) {
        candidates.push(iconFile);
      } else {
        const fileName = iconFile.replace(/ /g, "_");
        candidates.push("https://oldschool.runescape.wiki/images/" + encodeURIComponent(fileName));
        candidates.push("https://oldschool.runescape.wiki/images/thumb/" + encodeURIComponent(fileName) + "/32px-" + encodeURIComponent(fileName));
      }
    }

    candidates.push("https://oldschool.runescape.wiki/images/thumb/Coins_1.png/32px-Coins_1.png");
    return Array.from(new Set(candidates));
  }

  function createIconMarkup(item, className) {
    const candidates = getIconCandidates(item.id, item.iconFile, item.icon);
    const first = candidates[0] || "";
    const fallbacks = encodeURIComponent(JSON.stringify(candidates.slice(1)));
    const cls = className ? " class=\"" + className + " ge-item-icon\"" : " class=\"ge-item-icon\"";
    return "<img" + cls + " src=\"" + first + "\" data-fallbacks=\"" + fallbacks + "\" alt=\"" + item.name + "\">";
  }

  function wireIconFallbacks(root) {
    if (!root) return;

    root.querySelectorAll("img.ge-item-icon").forEach((img) => {
      if (img.dataset.fallbackBound === "1") return;
      img.dataset.fallbackBound = "1";

      img.addEventListener("error", () => {
        const encoded = img.dataset.fallbacks || "";
        const list = safeParse(decodeURIComponent(encoded || "%5B%5D"), []);
        if (!Array.isArray(list) || !list.length) return;

        const next = list.shift();
        img.dataset.fallbacks = encodeURIComponent(JSON.stringify(list));
        if (next) img.src = next;
      });
    });
  }

  function formatPrice(value) {
    const n = Math.max(0, Number(value) || 0);
    return Math.round(n).toLocaleString() + " gp";
  }

  function formatCompactQty(value) {
    const n = Math.max(0, Number(value) || 0);
    if (n >= 1e12) return (n / 1e12).toFixed(2).replace(/\.00$/, "").replace(/(\.[1-9])0$/, "$1") + "T";
    if (n >= 1e9) return (n / 1e9).toFixed(2).replace(/\.00$/, "").replace(/(\.[1-9])0$/, "$1") + "b";
    if (n >= 1e6) return (n / 1e6).toFixed(2).replace(/\.00$/, "").replace(/(\.[1-9])0$/, "$1") + "m";
    if (n >= 1e3) return (n / 1e3).toFixed(2).replace(/\.00$/, "").replace(/(\.[1-9])0$/, "$1") + "k";
    return String(Math.floor(n));
  }

  function parseAmountInput(rawText, fallback) {
    const text = String(rawText || "").trim().toLowerCase();
    if (!text) return Math.max(1, Number(fallback) || 1);

    const match = text.match(/^(\d+(?:\.\d+)?)\s*([kmb])?$/i);
    if (!match) {
      return Math.max(1, Number(text.replace(/,/g, "")) || Math.max(1, Number(fallback) || 1));
    }

    const base = Number(match[1]) || 0;
    const suffix = (match[2] || "").toLowerCase();
    let multiplier = 1;

    if (suffix === "k") multiplier = 1e3;
    if (suffix === "m") multiplier = 1e6;
    if (suffix === "b") multiplier = 1e9;

    return Math.max(1, Math.floor(base * multiplier));
  }

  function findFirstSlotById(inventory, itemId) {
    return (inventory.slots || []).findIndex((slot) => slot && slot.id === itemId);
  }

  function addItemToInventory(inventory, item) {
    const existingIndex = findFirstSlotById(inventory, item.id);
    if (existingIndex >= 0) {
      inventory.slots[existingIndex].qty += item.qty;
      return true;
    }

    return inventory.addItem(item);
  }

  function removeItemFromInventory(inventory, itemId, qty) {
    let remaining = Math.max(1, Number(qty) || 1);

      const normalizedLookup = String(itemId).toLowerCase();
    for (let i = 0; i < inventory.slots.length; i++) {
      const slot = inventory.slots[i];
        if (!slot || !slot.id) continue;
        if (String(slot.id).toLowerCase() !== normalizedLookup) continue;

      const take = Math.min(slot.qty, remaining);
      slot.qty -= take;
      remaining -= take;

      if (slot.qty <= 0) {
        inventory.slots[i] = null;
      }

      if (remaining <= 0) {
        return true;
      }
    }

    return false;
  }

  function getTotalQty(inventory, itemId) {
      const normalizedLookup = String(itemId).toLowerCase();
      return (inventory.slots || []).reduce((sum, slot) => {
        if (!slot || !slot.id) return sum;
        if (String(slot.id).toLowerCase() !== normalizedLookup) return sum;
        return sum + (Number(slot.qty) || 0);
      }, 0);
  }

  function getCoins(inventory) {
    return getTotalQty(inventory, "coins");
  }

  function getWalletValue(inventory) {
    const coins = getCoins(inventory);
    const tokens = getTotalQty(inventory, "platinum_token");
    const divine = getTotalQty(inventory, "divine_token");
    return coins + tokens * COINS_PER_PLAT_TOKEN + divine * COINS_PER_DIVINE_TOKEN;
  }

  function addCoins(inventory, qty) {
    const amount = Math.max(0, Number(qty) || 0);
    if (!amount) return true;

    return addItemToInventory(inventory, {
      id: "coins",
      name: "Coins",
      qty: amount,
      icon: "https://oldschool.runescape.wiki/images/thumb/Coins_10000.png/32px-Coins_10000.png"
    });
  }

  function removeCoinsAndTokens(inventory, qty) {
    // Remove a combined amount from coins, platinum tokens, and divine tokens. Returns true if successful.
    let amount = Math.max(0, Number(qty) || 0);
    let coins = getTotalQty(inventory, "coins");
    let tokens = getTotalQty(inventory, "platinum_token");
    let divine = getTotalQty(inventory, "divine_token");
    const totalValue = coins + tokens * COINS_PER_PLAT_TOKEN + divine * COINS_PER_DIVINE_TOKEN;
    if (totalValue < amount) {
      if (window && window.console) {
        console.log('[GE DEBUG] Not enough funds. Needed:', amount, 'Available:', totalValue, {coins, tokens, divine});
      }
      return false;
    }

    if (window && window.console) {
      console.log('[GE DEBUG] Removing funds:', amount, {coins, tokens, divine});
    }

    // Remove divine tokens first if needed
    if (amount >= COINS_PER_DIVINE_TOKEN && divine > 0) {
      let neededDivine = Math.floor(amount / COINS_PER_DIVINE_TOKEN);
      let takeDivine = Math.min(divine, neededDivine);
      if (takeDivine > 0) {
        removeItemFromInventory(inventory, "divine_token", takeDivine);
        amount -= takeDivine * COINS_PER_DIVINE_TOKEN;
        divine -= takeDivine;
        if (window && window.console) {
          console.log('[GE DEBUG] Removed divine tokens:', takeDivine, 'Remaining amount:', amount);
        }
      }
    }

    // Remove platinum tokens next if needed
    if (amount >= COINS_PER_PLAT_TOKEN && tokens > 0) {
      let neededTokens = Math.floor(amount / COINS_PER_PLAT_TOKEN);
      let takeTokens = Math.min(tokens, neededTokens);
      if (takeTokens > 0) {
        removeItemFromInventory(inventory, "platinum_token", takeTokens);
        amount -= takeTokens * COINS_PER_PLAT_TOKEN;
        tokens -= takeTokens;
        if (window && window.console) {
          console.log('[GE DEBUG] Removed platinum tokens:', takeTokens, 'Remaining amount:', amount);
        }
      }
    }

    // Remove coins last
    if (amount > 0 && coins > 0) {
      let takeCoins = Math.min(coins, amount);
      if (takeCoins > 0) {
        removeItemFromInventory(inventory, "coins", takeCoins);
        amount -= takeCoins;
        coins -= takeCoins;
        if (window && window.console) {
          console.log('[GE DEBUG] Removed coins:', takeCoins, 'Remaining amount:', amount);
        }
      }
    }

    // If we removed enough, success
    if (amount <= 0) {
      if (window && window.console) {
        console.log('[GE DEBUG] Funds removed successfully.');
      }
      return true;
    } else {
      if (window && window.console) {
        console.log('[GE DEBUG] Failed to remove enough funds. Remaining:', amount);
      }
      return false;
    }
  }

  function ensureBankState(player) {
    if (!player.bank || typeof player.bank !== "object") {
      player.bank = { items: {}, withdrawAsNote: false };
    }
    if (!player.bank.items || typeof player.bank.items !== "object") {
      player.bank.items = {};
    }
  }

  function claimToBank(player, item, qty, noted) {
    const amount = Math.max(0, Number(qty) || 0);
    if (!amount) return;

    if (window.RSGame?.Bank?.addToBank) {
      window.RSGame.Bank.addToBank(player, {
        id: String(item.id),
        name: item.name || String(item.id),
        icon: item.icon || null,
        category: item.category || "General"
      }, amount);
      return;
    }

    ensureBankState(player);
    const id = String(item.id);
    const existing = player.bank.items[id] || {
      id,
      name: item.name || id,
      icon: item.icon || null,
      category: "General",
      qty: 0,
      discovered: false
    };

    existing.id = id;
    existing.name = existing.name || item.name || id;
    existing.icon = existing.icon || item.icon || null;
    existing.qty = Math.max(0, Number(existing.qty) || 0) + amount;
    existing.discovered = true;
    existing.lastClaimNoted = id === "coins" ? false : !!noted;

    player.bank.items[id] = existing;
  }

  function inferLocalItemIdFromName(name) {
    return String(name || "")
      .toLowerCase()
      .replace(/'/g, "")
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
  }

  function claimToInventoryOrBank(player, item, qty, noted) {
    const amount = Math.max(0, Number(qty) || 0);
    if (!amount) return "none";

    const itemId = String(item.id);
    const normalizedNoted = itemId === "coins" ? false : !!noted;
    const claimItem = {
      id: itemId,
      name: item.name || itemId,
      qty: amount,
      icon: item.icon || null,
      noted: normalizedNoted,
      stackable: !!item.stackable || normalizedNoted || itemId === "coins",
      slot: item.slot || null,
      bonuses: item.bonuses || null,
      itemType: item.itemType || null,
      leftClickAction: item.leftClickAction || null,
      rightClickActions: Array.isArray(item.rightClickActions) ? item.rightClickActions.slice() : null
    };

    if (player?.inventory?.addItem?.(claimItem)) {
      return "inventory";
    }

    claimToBank(player, claimItem, amount, normalizedNoted);
    return "bank";
  }

  function getClaimable(offer) {
    if (!offer) return { items: 0, coins: 0, returnedItems: 0 };

    // For buy offers, only allow claiming as many items as you have actually paid for
    let claimableItems = 0;
    if (offer.mode === "buy") {
      const paidFor = Math.floor((Number(offer.spentCoins) || 0) / Math.max(1, Number(offer.price) || 1));
      claimableItems = Math.max(0, paidFor - (offer.claimedQty || 0));
    } else {
      claimableItems = Math.max(0, (offer.filledQty || 0) - (offer.claimedQty || 0));
    }
    const filledQty = Math.max(0, Number(offer.filledQty) || 0);
    const offerPrice = Math.max(0, Number(offer.price) || 0);
    const receivedCoins = Math.max(0, Number(offer.receivedCoins) || 0);
    const claimedCoins = Math.max(0, Number(offer.claimedCoins) || 0);

    // Backward-compatible fallback for older offers that may not have tracked receivedCoins.
    const fallbackSellCoinsTotal = Math.round(filledQty * offerPrice);
    const sellCoinsTotal = Math.max(receivedCoins, fallbackSellCoinsTotal);
    const claimableSellCoins = Math.max(0, sellCoinsTotal - claimedCoins);

    let claimableBuyRefund = 0;
    if (offer.mode === "buy" && (offer.status === "completed" || offer.status === "aborted")) {
      // Always refund based on the player's original offer price, not market value
      const reservedCoins = Math.max(0, Number(offer.reservedCoins) || Math.round((Number(offer.qty) || 0) * offerPrice));
      const spentCoins = Math.max(0, Number(offer.spentCoins) || 0);
      const alreadyClaimed = Math.max(0, Number(offer.claimedCoins) || 0);
      // Strict cap: never refund more than you paid up front
      const maxRefund = Math.max(0, reservedCoins - spentCoins);
      claimableBuyRefund = Math.max(0, Math.min(maxRefund, reservedCoins - spentCoins - alreadyClaimed));
    }

    const claimableReturnedItems = Math.max(0, (offer.returnedQty || 0) - (offer.claimedReturnedQty || 0));

    return {
      items: offer.mode === "buy" ? claimableItems : claimableReturnedItems,
      coins: offer.mode === "buy" ? claimableBuyRefund : claimableSellCoins,
      filledItems: 0,
      returnedItems: claimableReturnedItems
    };
  }

  function isOfferSettled(offer) {
    if (!offer) return true;
    const claim = getClaimable(offer);
    if (claim.items > 0 || claim.coins > 0 || claim.returnedItems > 0) {
      return false;
    }

    if (offer.status === "active" || offer.status === "stalled") {
      return false;
    }

    if (offer.mode === "buy") {
      const allItemsClaimed = (offer.claimedQty || 0) >= (offer.filledQty || 0);
      const totalRefund = Math.max(0, (offer.reservedCoins || 0) - (offer.spentCoins || 0));
      const refundClaimed = (offer.claimedCoins || 0) >= totalRefund;
      return allItemsClaimed && refundClaimed;
    }

    const sellCoinsClaimed = (offer.claimedCoins || 0) >= (offer.receivedCoins || 0);
    const returnedClaimed = (offer.claimedReturnedQty || 0) >= (offer.returnedQty || 0);
    return sellCoinsClaimed && returnedClaimed;
  }

  function buildBuyFillRate(priceRatio) {
    if (priceRatio < 0.25) return 0;
    if (priceRatio >= 1.15) return Infinity;
    if (priceRatio >= 1) {
      return 0.025 + ((priceRatio - 1) / 0.15) * 0.06;
    }

    const normalized = (priceRatio - 0.25) / 0.75;
    return 0.0002 + Math.pow(Math.max(0, normalized), 2.25) * 0.012;
  }

  function buildSellFillRate(priceRatio) {
    if (priceRatio > 1.75) return 0;
    if (priceRatio <= 0.8) return Infinity;
    if (priceRatio <= 1) {
      return 0.02 + ((1 - priceRatio) / 0.2) * 0.05;
    }

    const normalized = (priceRatio - 1) / 0.75;
    return 0.009 - normalized * 0.008;
  }

  function calcDeltaFromRate(remaining, rate) {
    if (remaining <= 0) return 0;
    if (rate === Infinity) return remaining;
    if (rate <= 0) return 0;

    const chance = Math.min(1, rate * 2.5 + 0.015);
    if (Math.random() > chance) return 0;

    const expected = Math.max(1, Math.floor(remaining * rate * (0.35 + Math.random() * 0.45)));
    return Math.max(1, Math.min(remaining, expected));
  }

  async function fetchGeDatabase() {

    const [mappingResp, latestResp] = await Promise.all([
      fetch(GE_MAPPING_URL, { headers: { Accept: "application/json" } }),
      fetch(GE_LATEST_URL, { headers: { Accept: "application/json" } })
    ]);

    if (!mappingResp.ok) {
      throw new Error("Failed to fetch GE mapping: " + mappingResp.status);
    }

    if (!latestResp.ok) {
      throw new Error("Failed to fetch GE latest prices: " + latestResp.status);
    }

    const mapping = await mappingResp.json();
    const latest = await latestResp.json();
    const priceMap = buildPriceMap(latest);

    // Log every item name in the mapping for debugging (after mapping is defined)
    if (Array.isArray(mapping)) {
      mapping.forEach(m => {
        if (m && m.name) {
          console.log('[GE ITEM NAME]', JSON.stringify(m.name));
        }
      });
    }
    // Debug: Log all item names to verify override matching
    if (Array.isArray(mapping)) {
      console.log("GE Mapping item names:", mapping.map(m => m.name));
    }

    // Price overrides for rares (values in gp)

    // Use exact names as in UI
    const RARE_PRICE_OVERRIDES = {
      "Blue partyhat": 500_000_000_000,
      "Green partyhat": 25_000_000_000,
      "Red partyhat": 50_000_000_000,
      "White partyhat": 150_000_000_000,
      "Yellow partyhat": 15_000_000_000,
      "Purple partyhat": 10_000_000_000,
      "Santa hat": 5_000_000_000,
      "Green halloween mask": 1_500_000_000,
      "Blue halloween mask": 3_000_000_000,
      "Red halloween mask": 7_000_000_000,
      "Easter egg": 1_000_000_000,
      "Pumpkin": 1_000_000_000,
      "Disk of returning": 2_000_000_000
    };

    // Partyhat set = sum of all partyhats
    const partyhatSetPrice = RARE_PRICE_OVERRIDES["Blue partyhat"]
      + RARE_PRICE_OVERRIDES["Green partyhat"]
      + RARE_PRICE_OVERRIDES["Red partyhat"]
      + RARE_PRICE_OVERRIDES["White partyhat"]
      + RARE_PRICE_OVERRIDES["Yellow partyhat"]
      + RARE_PRICE_OVERRIDES["Purple partyhat"];
    RARE_PRICE_OVERRIDES["Partyhat set"] = partyhatSetPrice;

    // Christmas cracker = sum of all above + 10%
    const crackerBase = Object.values(RARE_PRICE_OVERRIDES).reduce((a, b) => a + b, 0);
    RARE_PRICE_OVERRIDES["Christmas cracker"] = Math.round(crackerBase * 1.00);

    const items = (Array.isArray(mapping) ? mapping : [])
      .map((m) => {
        const id = Number(m.id) || 0;
        const prices = priceMap[id] || {};
        const fallbackValue = Number(m.value) || 1;
        let marketPrice = prices.price > 0 ? prices.price : fallbackValue;
        // Apply override by name (case-insensitive)
        // Use exact name match for override
        if (RARE_PRICE_OVERRIDES.hasOwnProperty(m.name)) {
          console.log("[GE OVERRIDE] Name:", JSON.stringify(m.name), "Override:", RARE_PRICE_OVERRIDES[m.name]);
          marketPrice = RARE_PRICE_OVERRIDES[m.name];
        }
        return {
          id,
          name: m.name || "Unknown Item",
          iconFile: m.icon || "",
          icon: getIconCandidates(id, m.icon)[0],
          high: prices.high || 0,
          low: prices.low || 0,
          price: marketPrice,
          members: !!m.members,
          limit: Number(m.limit) || 0
        };
      })
      .filter((item) => item.id > 0 && item.name)
      .sort((a, b) => a.name.localeCompare(b.name));

    const payload = {
      fetchedAt: nowMs(),
      source: "prices.runescape.wiki",
      items
    };

    setCachedGeData(payload);
    return payload;
  }

  async function loadGeDatabase(forceRefresh) {
    const cache = getCachedGeData();
    if (!forceRefresh && isCacheFresh(cache)) {
      return { payload: cache, fromCache: true };
    }

    try {
      const payload = await fetchGeDatabase();
      return { payload, fromCache: false };
    } catch (err) {
      if (cache) {
        return { payload: cache, fromCache: true, fetchError: err };
      }
      throw err;
    }
  }

  RSGame.Game.registerMod({
    name: "Grand Exchange",

    onGameInit(game) {
      const tabBar = document.querySelector("#tab-bar");
      const main = document.querySelector(".main-layout");
      if (!tabBar || !main) return;

      const gePanel = document.createElement("section");
      gePanel.className = "panel ge-panel";
      gePanel.dataset.panel = "ge";
      gePanel.style.display = "none";
      gePanel.innerHTML = ""
        + "<h2>Grand Exchange</h2>"
        + "<div class=\"ge-osrs-wrap\">"
        + "  <section class=\"ge-board-wrap\">"
        + "    <div class=\"ge-board-head\">"
        + "      <div class=\"ge-board-title\">Grand Exchange Offers</div>"
        + "    </div>"
        + "    <div id=\"ge-slot-grid\" class=\"ge-slot-grid\"></div>"
        + "    <div id=\"ge-status\" class=\"ge-status\">Loading item database...</div>"
        + "    <div class=\"ge-wallet\">Coins: <span id=\"ge-coins\">0</span></div>"
        + "  </section>"
        + "  <section class=\"ge-editor-wrap\">"
        + "    <div id=\"ge-editor\" class=\"ge-editor\"></div>"
        + "  </section>"
        + "</div>";

      main.appendChild(gePanel);

      const geBtn = document.createElement("button");
      geBtn.className = "tab-btn";
      geBtn.dataset.tab = "ge";
      geBtn.innerHTML = "<img class=\"tab-icon\" src=\"https://oldschool.runescape.wiki/images/Grand_Exchange_logo.png\" alt=\"Grand Exchange\"><span class=\"tab-label\">Exchange</span>";
      tabBar.appendChild(geBtn);

      const slotGrid = gePanel.querySelector("#ge-slot-grid");
      const statusEl = gePanel.querySelector("#ge-status");
      const editorEl = gePanel.querySelector("#ge-editor");
      const coinsEl = gePanel.querySelector("#ge-coins");

      let geItems = [];
      // GE offers are now stored in the main save system
      // Restore original: slotOffers initialized to 8 nulls, no save system overwrite
      let slotOffers = Array.from({ length: 8 }, () => null);

      // Remove save system slotOffers getter/setter (restore original, no persistence)
      let activeSlotIndex = 0;
      let activeMode = null;
      let selectedItem = null;
      let searchResults = [];
      let searchQuery = "";
      let searchTimer = null;
      let fillTimer = null;

      function getSharedGeItems() {
        if (Array.isArray(geItems) && geItems.length > 0) return geItems;
        const cache = getCachedGeData();
        if (cache && Array.isArray(cache.items)) return cache.items;
        return [];
      }

      function getSharedGePriceById(id) {
        const key = String(id || "");
        if (!key) return 0;
        const match = getSharedGeItems().find((item) => String(item?.id) === key);
        return Math.max(0, Number(match?.price) || 0);
      }

      function getSharedGePriceByName(name) {
        const target = normalizeLookupName(name);
        if (!target) return 0;
        const match = getSharedGeItems().find((item) => normalizeLookupName(item?.name) === target);
        return Math.max(0, Number(match?.price) || 0);
      }

      function resolveSharedGeItem(idOrName) {
        const raw = String(idOrName || "").trim();
        if (!raw) return null;

        const byId = getSharedGeItems().find((item) => String(item?.id) === raw);
        if (byId) return byId;

        const normalized = normalizeLookupName(raw);
        if (!normalized) return null;
        return getSharedGeItems().find((item) => normalizeLookupName(item?.name) === normalized) || null;
      }

      function grantInstantBuyFill(player, idOrName, qty, options) {
        const geItem = resolveSharedGeItem(idOrName);
        if (!geItem) {
          return { ok: false, reason: "not_found" };
        }

        const amount = Math.max(1, Number(qty) || 1);
        const opts = options || {};
        const canonicalName = geItem.name || String(idOrName || "");
        const inventoryItemId = String(opts.inventoryItemId || inferLocalItemIdFromName(canonicalName) || geItem.id);

        const destination = claimToInventoryOrBank(player, {
          id: inventoryItemId,
          name: canonicalName,
          icon: geItem.icon || null,
          stackable: typeof opts.stackable === "boolean" ? opts.stackable : !!geItem.limit,
          slot: opts.slot || null,
          bonuses: opts.bonuses || null,
          itemType: opts.itemType || null,
          leftClickAction: opts.leftClickAction || null,
          rightClickActions: Array.isArray(opts.rightClickActions) ? opts.rightClickActions.slice() : null
        }, amount, !!opts.noted);

        return {
          ok: true,
          destination,
          item: {
            id: inventoryItemId,
            name: canonicalName,
            icon: geItem.icon || null,
            osrsId: geItem.id
          }
        };
      }

      function publishGeApi() {
        window.RSGame = window.RSGame || {};
        window.RSGame.GE = {
          ...(window.RSGame.GE || {}),
          getItems: () => getSharedGeItems().slice(),
          resolveItem: (idOrName) => {
            const item = resolveSharedGeItem(idOrName);
            return item ? { ...item } : null;
          },
          grantInstantBuyFill: (player, idOrName, qty, options) => grantInstantBuyFill(player, idOrName, qty, options),
          getCachedPriceById: (id) => getSharedGePriceById(id),
          getCachedPriceByName: (name) => getSharedGePriceByName(name),
          getCachedPrice: (idOrName, maybeName) => {
            const byId = getSharedGePriceById(idOrName);
            if (byId > 0) return byId;
            const byName = getSharedGePriceByName(maybeName || idOrName);
            return byName > 0 ? byName : 0;
          }
        };
      }

      publishGeApi();

      function getCachedGeDataAgeMs() {
        const cache = getCachedGeData();
        return cache && cache.fetchedAt ? Math.max(0, nowMs() - Number(cache.fetchedAt)) : Infinity;
      }

      function shouldAutoRefreshGeData() {
        return !isCacheFresh(getCachedGeData());
      }

      function applyMarketPriceToItem(item) {
        if (!item) return item;
        const market = getItemById(item.marketItemId || item.id || item.itemId);
        if (market && market.price > 0) {
          item.price = Math.max(1, Number(market.price) || 1);
          item.marketItemId = String(market.id);
        }
        return item;
      }

      async function refreshPricesIfStale() {
        if (!shouldAutoRefreshGeData()) {
          return false;
        }

        try {
          const result = await loadGeDatabase(true);
          geItems = result.payload.items || [];
          publishGeApi();
          if (searchQuery && searchQuery.trim()) {
            runSearch(searchQuery);
          } else {
            searchResults = geItems.slice(0, 80);
          }
          renderSlotGrid();
          renderEditor();
          updateCacheAgeStatus(result);
          return true;
        } catch (err) {
          console.warn('[GE] Failed to refresh stale prices:', err);
          return false;
        }
      }

      function saveNowSafe() {
        if (RSGame.Game && typeof RSGame.Game.saveNow === "function") {
          RSGame.Game.saveNow();
        }
      }

      function setStatus(text, isError) {
        statusEl.textContent = text;
        statusEl.classList.toggle("error", !!isError);
      }

      function updateCoinsLabel() {
        try {
          const totalValue = getWalletValue(game.player.inventory);
          if (!isFinite(totalValue) || isNaN(totalValue)) {
            coinsEl.textContent = "0 gp";
            return;
          }
          coinsEl.textContent = formatCompactQty(totalValue) + " gp";
          return;
        } catch (e) {
          coinsEl.textContent = "0 gp";
          return;
        }
      }

      function updateCacheAgeStatus(result) {
        const fetchedAt = result && result.payload ? Number(result.payload.fetchedAt) : 0;
        const ageMs = Math.max(0, nowMs() - fetchedAt);
        const ageMin = Math.floor(ageMs / 60000);

        if (result.fetchError) {
          setStatus("Using cached GE data (" + ageMin + "m old). Live refresh failed.", true);
          return;
        }

        if (result.fromCache) {
          const minutesLeft = Math.max(0, Math.ceil((GE_CACHE_TTL_MS - ageMs) / 60000));
          setStatus("Using cached GE data. Next live refresh in about " + minutesLeft + " minutes.");
        } else {
          setStatus("Live GE prices fetched. Cache updated (refreshes every 4 hours).");
        }
      }

      function getItemById(itemId) {
        const normalized = String(itemId);
        return geItems.find((item) => String(item.id) === normalized) || null;
      }

      function getMarketPriceForOffer(offer) {
        if (!offer) return 1;
        const live = getItemById(offer.marketItemId || offer.itemId);
        const market = Number(live?.price) || Number(offer.marketPrice) || Number(offer.price) || 1;
        return Math.max(1, market);
      }

      function runSearch(queryText) {
        const q = (queryText || "").trim().toLowerCase();
        searchQuery = queryText || "";
        if (!q) {
          searchResults = geItems.slice(0, 80);
        } else {
          searchResults = geItems.filter((item) => item.name.toLowerCase().includes(q)).slice(0, 80);
        }
        renderEditor();
      }

      function getSellableInventoryItems() {
        const grouped = new Map();

        (game.player.inventory.slots || []).forEach((slot) => {
          if (!slot || !slot.id || slot.id === "coins") return;

          const key = String(slot.id);
          const existing = grouped.get(key) || {
            id: key,
            name: slot.name || key,
            qty: 0,
            icon: slot.icon || "",
            iconFile: "",
            price: 1,
            noted: !!slot.noted,
            stackable: !!slot.stackable,
            slot: slot.slot || null,
            bonuses: slot.bonuses || null,
            itemType: slot.itemType || null,
            leftClickAction: slot.leftClickAction || null,
            rightClickActions: Array.isArray(slot.rightClickActions) ? slot.rightClickActions.slice() : null,
            marketItemId: key
          };

          existing.qty += Math.max(0, Number(slot.qty) || 0);
          if (!existing.icon && slot.icon) {
            existing.icon = slot.icon;
          }
          grouped.set(key, existing);
        });

        return Array.from(grouped.values())
          .map((entry) => {
            const geMatch = geItems.find((it) => String(it.id) === entry.id || it.name.toLowerCase() === entry.name.toLowerCase());
            if (geMatch) {
              return {
                id: entry.id,
                name: entry.name || geMatch.name,
                qty: entry.qty,
                icon: entry.icon || geMatch.icon,
                iconFile: geMatch.iconFile || "",
                price: Math.max(1, Number(geMatch.price) || 1),
                noted: !!entry.noted,
                stackable: !!entry.stackable,
                slot: entry.slot || null,
                bonuses: entry.bonuses || null,
                itemType: entry.itemType || null,
                leftClickAction: entry.leftClickAction || null,
                rightClickActions: Array.isArray(entry.rightClickActions) ? entry.rightClickActions.slice() : null,
                marketItemId: String(geMatch.id)
              };
            }

            return {
              id: entry.id,
              name: entry.name,
              qty: entry.qty,
              icon: entry.icon,
              iconFile: "",
              price: 1,
              noted: !!entry.noted,
              stackable: !!entry.stackable,
              slot: entry.slot || null,
              bonuses: entry.bonuses || null,
              itemType: entry.itemType || null,
              leftClickAction: entry.leftClickAction || null,
              rightClickActions: Array.isArray(entry.rightClickActions) ? entry.rightClickActions.slice() : null,
              marketItemId: entry.id
            };
          })
          .sort((a, b) => a.name.localeCompare(b.name));
      }

      function renderSellInventoryPicker() {
        const sellables = getSellableInventoryItems();
        if (!sellables.length) {
          return "<div class=\"ge-search-empty\">No sellable items in inventory.</div>";
        }

        return "<div class=\"ge-search-results\">"
          + sellables.map((item) => ""
            + "<button type=\"button\" class=\"ge-search-row" + (selectedItem && String(selectedItem.id) === String(item.id) ? " active" : "") + "\" data-sell-item-id=\"" + item.id + "\">"
            + "  " + createIconMarkup(item, "ge-search-icon")
            + "  <span class=\"ge-search-name\">" + item.name + "</span>"
            + "  <span class=\"ge-search-price\">Qty: " + formatCompactQty(item.qty) + "</span>"
            + "</button>").join("")
          + "</div>";
      }

      function resetEditorStateForSlot(index) {
        const offer = slotOffers[index];
        if (offer) {
          activeMode = offer.mode;
          selectedItem = getItemById(offer.marketItemId || offer.itemId) || {
            id: offer.inventoryItemId || offer.itemId,
            marketItemId: offer.marketItemId || offer.itemId,
            name: offer.itemName,
            iconFile: offer.iconFile,
            icon: offer.icon,
            price: offer.marketPrice || offer.price,
            noted: !!offer.noted,
            stackable: !!offer.stackable,
            slot: offer.slot || null,
            bonuses: offer.bonuses || null,
            itemType: offer.itemType || null,
            leftClickAction: offer.leftClickAction || null,
            rightClickActions: Array.isArray(offer.rightClickActions) ? offer.rightClickActions.slice() : null
          };
          return;
        }

        activeMode = null;
        selectedItem = null;
        searchQuery = "";
        searchResults = geItems.slice(0, 80);
      }

      function claimOffer(index) {
        const offer = slotOffers[index];
        if (!offer) return;

        const claim = getClaimable(offer);
        if (claim.items <= 0 && claim.coins <= 0 && claim.returnedItems <= 0) {
          return;
        }

        let claimedAny = false;
        let bankFallbackUsed = false;

        if (offer.mode === "buy") {
          const itemQty = Math.max(0, (offer.filledQty || 0) - (offer.claimedQty || 0));
          if (itemQty > 0) {
            // Always deliver unnoted, canonical essence for rune/pure essence
            let canonicalName = offer.itemName;
            let canonicalNoted = false;
            let canonicalId = String(offer.inventoryItemId || inferLocalItemIdFromName(canonicalName) || offer.itemId);
            if (canonicalId === "rune_essence" || canonicalName.toLowerCase() === "rune essence") {
              canonicalId = "rune_essence";
              canonicalName = "Rune essence";
              canonicalNoted = false;
            } else if (canonicalId === "pure_essence" || canonicalName.toLowerCase() === "pure essence") {
              canonicalId = "pure_essence";
              canonicalName = "Pure essence";
              canonicalNoted = false;
            }
            const destination = claimToInventoryOrBank(game.player, {
              id: canonicalId,
              name: canonicalName,
              icon: offer.icon,
              stackable: !!offer.stackable,
              slot: offer.slot || null,
              bonuses: offer.bonuses || null,
              itemType: offer.itemType || null,
              leftClickAction: offer.leftClickAction || null,
              rightClickActions: Array.isArray(offer.rightClickActions) ? offer.rightClickActions.slice() : null
            }, itemQty, canonicalNoted);
            offer.claimedQty = (offer.claimedQty || 0) + itemQty;
            claimedAny = true;
            bankFallbackUsed = bankFallbackUsed || destination === "bank";
          }

          const refund = (offer.status === "completed" || offer.status === "aborted")
            ? Math.max(0, ((offer.reservedCoins || 0) - (offer.spentCoins || 0)) - (offer.claimedCoins || 0))
            : 0;
          if (refund > 0) {
            // Pay out platinum tokens for every 1,000 coins, remainder as coins
            const COINS_PER_PLAT_TOKEN = 1000;
            const tokens = Math.floor(refund / COINS_PER_PLAT_TOKEN);
            const coins = refund - tokens * COINS_PER_PLAT_TOKEN;
            let paid = false;
            // Add platinum tokens first
            if (tokens > 0 && game.player?.inventory?.addItem) {
              paid = game.player.inventory.addItem({
                id: "platinum_token",
                name: "Platinum token",
                qty: tokens,
                icon: "https://oldschool.runescape.wiki/images/thumb/Platinum_token_detail.png/32px-Platinum_token_detail.png"
              });
            }
            // Add coins
            if (coins > 0 && game.player?.inventory?.addItem) {
              paid = game.player.inventory.addItem({
                id: "coins",
                name: "Coins",
                qty: coins,
                icon: "https://oldschool.runescape.wiki/images/thumb/Coins_10000.png/32px-Coins_10000.png"
              }) || paid;
            }
            offer.claimedCoins = (offer.claimedCoins || 0) + refund;
            claimedAny = true;
            // If inventory is full, fallback to bank
            if (!paid) {
              if (tokens > 0) claimToBank(game.player, { id: "platinum_token", name: "Platinum token", icon: "https://oldschool.runescape.wiki/images/thumb/Platinum_token_detail.png/32px-Platinum_token_detail.png" }, tokens, true);
              if (coins > 0) claimToBank(game.player, { id: "coins", name: "Coins", icon: "https://oldschool.runescape.wiki/images/thumb/Coins_10000.png/32px-Coins_10000.png" }, coins, true);
              bankFallbackUsed = true;
            }
          }
        } else {
          const coins = Math.max(0, claim.coins || 0);
          if (coins > 0) {
            // Pay out platinum tokens for every 1,000 coins, remainder as coins
            const COINS_PER_PLAT_TOKEN = 1000;
            const tokens = Math.floor(coins / COINS_PER_PLAT_TOKEN);
            const coinRemainder = coins - tokens * COINS_PER_PLAT_TOKEN;
            let paid = false;
            if (tokens > 0 && game.player?.inventory?.addItem) {
              paid = game.player.inventory.addItem({
                id: "platinum_token",
                name: "Platinum token",
                qty: tokens,
                icon: "https://oldschool.runescape.wiki/images/thumb/Platinum_token_detail.png/32px-Platinum_token_detail.png"
              });
            }
            if (coinRemainder > 0 && game.player?.inventory?.addItem) {
              paid = game.player.inventory.addItem({
                id: "coins",
                name: "Coins",
                qty: coinRemainder,
                icon: "https://oldschool.runescape.wiki/images/thumb/Coins_10000.png/32px-Coins_10000.png"
              }) || paid;
            }
            offer.claimedCoins = (offer.claimedCoins || 0) + coins;
            claimedAny = true;
            if (!paid) {
              if (tokens > 0) claimToBank(game.player, { id: "platinum_token", name: "Platinum token", icon: "https://oldschool.runescape.wiki/images/thumb/Platinum_token_detail.png/32px-Platinum_token_detail.png" }, tokens, true);
              if (coinRemainder > 0) claimToBank(game.player, { id: "coins", name: "Coins", icon: "https://oldschool.runescape.wiki/images/thumb/Coins_10000.png/32px-Coins_10000.png" }, coinRemainder, true);
              bankFallbackUsed = true;
            }
          }

          const returnedQty = Math.max(0, (offer.returnedQty || 0) - (offer.claimedReturnedQty || 0));
          if (returnedQty > 0) {
            const returnedItemId = String(offer.inventoryItemId || inferLocalItemIdFromName(offer.itemName) || offer.itemId);
            const destination = claimToInventoryOrBank(game.player, {
              id: returnedItemId,
              name: offer.itemName,
              icon: offer.icon,
              stackable: !!offer.stackable,
              slot: offer.slot || null,
              bonuses: offer.bonuses || null,
              itemType: offer.itemType || null,
              leftClickAction: offer.leftClickAction || null,
              rightClickActions: Array.isArray(offer.rightClickActions) ? offer.rightClickActions.slice() : null
            }, returnedQty, !!offer.noted);
            offer.claimedReturnedQty = (offer.claimedReturnedQty || 0) + returnedQty;
            claimedAny = true;
            bankFallbackUsed = bankFallbackUsed || destination === "bank";
          }
        }

        if (claimedAny) {
          if (isOfferSettled(offer)) {
            slotOffers[index] = null;
            if (activeSlotIndex === index) {
              resetEditorStateForSlot(index);
            }
          }

          if (RSGame.Events && typeof RSGame.Events.emit === "function") {
            RSGame.Events.emit("playerUpdated");
          }
          if (RSGame.UI && typeof RSGame.UI.renderInventory === "function") {
            RSGame.UI.renderInventory(game.player);
          }
          if (RSGame.UI && typeof RSGame.UI.renderSkills === "function") {
            RSGame.UI.renderSkills(game.player);
          }

          updateCoinsLabel();
          renderSlotGrid();
          renderEditor();
          saveNowSafe();
          setStatus(bankFallbackUsed ? "Claimed offer rewards. Inventory was full, so some items were sent to the bank." : "Claimed offer rewards to inventory.", false);
        }
      }

      function abortOffer(index) {
        const offer = slotOffers[index];
        if (!offer || offer.status === "completed" || offer.status === "aborted") {
          return;
        }

        offer.status = "aborted";
        offer.completedAt = nowMs();

        if (offer.mode === "sell") {
          const remaining = Math.max(0, (offer.qty || 0) - (offer.filledQty || 0));
          offer.returnedQty = remaining;
        }

        renderSlotGrid();
        renderEditor();
        setStatus("Offer aborted. Claim outstanding items/coins from the slot.", false);
      }

      function renderSlotGrid() {
        slotGrid.innerHTML = "";

        // Ensure slotOffers is always an array of 8 elements
        if (!Array.isArray(slotOffers) || slotOffers.length !== 8) {
          slotOffers = Array.from({ length: 8 }, () => null);
        }

        slotOffers.forEach((offer, index) => {
          const slotBtn = document.createElement("button");
          slotBtn.type = "button";

          const claim = getClaimable(offer);
          const hasClaimable = !!offer && (claim.items > 0 || claim.coins > 0 || claim.filledItems > 0 || claim.returnedItems > 0);
          const fillPct = offer ? Math.max(0, Math.min(100, ((offer.filledQty || 0) / Math.max(1, offer.qty || 1)) * 100)) : 0;
          const flashDone = !!offer && (offer.status === "completed" || offer.status === "aborted") && hasClaimable;

          slotBtn.className = "ge-slot"
            + (offer ? " has-offer" : "")
            + (index === activeSlotIndex ? " active" : "")
            + (flashDone ? " claim-ready" : "");

          if (!offer) {
            slotBtn.innerHTML = ""
              + "<div class=\"ge-slot-num\">Slot " + (index + 1) + "</div>"
              + "<div class=\"ge-slot-empty\">Empty</div>";
          } else {
            const modeLabel = offer.mode === "buy" ? "Buy Offer" : "Sell Offer";
            const statusLabel = offer.status === "stalled"
              ? "Waiting for better price"
              : offer.status === "completed"
                ? "Completed"
                : offer.status === "aborted"
                  ? "Aborted"
                  : "In progress";

            slotBtn.innerHTML = ""
              + "<div class=\"ge-slot-num\">Slot " + (index + 1) + "</div>"
              + "<div class=\"ge-slot-card\">"
              + "  " + createIconMarkup({ id: offer.marketItemId || offer.itemId, iconFile: offer.iconFile, icon: offer.icon, name: offer.itemName }, "ge-slot-icon")
              + "  <div class=\"ge-slot-lines\">"
              + "    <div class=\"ge-slot-item\">" + offer.itemName + "</div>"
              + "    <div class=\"ge-slot-meta\">" + modeLabel + "</div>"
              + "    <div class=\"ge-slot-meta\">" + formatCompactQty(offer.filledQty || 0) + " / " + formatCompactQty(offer.qty || 0) + "</div>"
              + "    <div class=\"ge-slot-meta\">" + statusLabel + "</div>"
              + "  </div>"
              + "</div>"
              + "<div class=\"ge-slot-progress\"><span style=\"width:" + fillPct.toFixed(1) + "%\"></span></div>"
              + (hasClaimable ? "<div class=\"ge-slot-claim\">Click to claim</div>" : "");
          }

          slotBtn.addEventListener("click", () => {
            if (slotOffers[index]) {
              const slotClaim = getClaimable(slotOffers[index]);
              const canClaim = slotClaim.items > 0 || slotClaim.coins > 0 || slotClaim.returnedItems > 0;
              if (canClaim) {
                claimOffer(index);
              }
            }

            // Only reset editor state if switching to a different slot
            if (activeSlotIndex !== index) {
              activeSlotIndex = index;
              resetEditorStateForSlot(index);
            } else {
              activeSlotIndex = index;
            }
            renderSlotGrid();
            renderEditor();
          });

          slotGrid.appendChild(slotBtn);
        });

        wireIconFallbacks(slotGrid);
      }

      function renderSearchResultsList() {
        if (!searchResults.length) {
          return "<div class=\"ge-search-empty\">No items found.</div>";
        }

        return "<div class=\"ge-search-results\">"
          + searchResults.map((item) => ""
            + "<button type=\"button\" class=\"ge-search-row" + (selectedItem && String(selectedItem.id) === String(item.id) ? " active" : "") + "\" data-item-id=\"" + item.id + "\">"
            + "  " + createIconMarkup(item, "ge-search-icon")
            + "  <span class=\"ge-search-name\">" + item.name + "</span>"
            + "  <span class=\"ge-search-price\">" + formatPrice(item.price) + "</span>"
            + "</button>").join("")
          + "</div>";
      }

      function wireSearchInteraction() {
        const searchInput = editorEl.querySelector("#ge-chat-search");
        if (searchInput) {
          searchInput.value = searchQuery;
          // Save cursor position and restore after rerender
          let lastSelectionStart = null, lastSelectionEnd = null;
          searchInput.addEventListener("input", () => {
            if (searchTimer) {
              clearTimeout(searchTimer);
              searchTimer = null;
            }
            // Save cursor position
            lastSelectionStart = searchInput.selectionStart;
            lastSelectionEnd = searchInput.selectionEnd;
            searchTimer = setTimeout(() => {
              runSearch(searchInput.value);
              // After rerender, restore focus and cursor
              setTimeout(() => {
                const newInput = editorEl.querySelector("#ge-chat-search");
                if (newInput) {
                  newInput.focus();
                  if (lastSelectionStart !== null && lastSelectionEnd !== null) {
                    newInput.setSelectionRange(lastSelectionStart, lastSelectionEnd);
                  }
                }
              }, 0);
            }, SEARCH_DEBOUNCE_MS);
          });
        }

        editorEl.querySelectorAll(".ge-search-row").forEach((row) => {
          row.addEventListener("click", async () => {
            await refreshPricesIfStale();
            const itemId = row.dataset.itemId;
            const item = getItemById(itemId);
            if (!item) return;
            selectedItem = Object.assign({}, item, { marketItemId: String(item.id) });
            const priceInput = editorEl.querySelector("#ge-offer-price");
            if (priceInput && item.price) {
              priceInput.value = Math.max(1, Number(item.price) || 1);
            }
            renderEditor();
          });
        });

        editorEl.querySelectorAll(".ge-search-row[data-sell-item-id]").forEach((row) => {
          row.addEventListener("click", async () => {
            await refreshPricesIfStale();
            const itemId = row.dataset.sellItemId;
            if (!itemId) return;

            const sellables = getSellableInventoryItems();
            const picked = sellables.find((it) => String(it.id) === String(itemId));
            if (!picked) return;

            selectedItem = {
              id: String(picked.id),
              name: picked.name,
              marketItemId: String(picked.marketItemId || picked.id),
              iconFile: picked.iconFile || "",
              icon: picked.icon || "",
              price: Math.max(1, Number(picked.price) || 1),
              noted: !!picked.noted,
              stackable: !!picked.stackable,
              slot: picked.slot || null,
              bonuses: picked.bonuses || null,
              itemType: picked.itemType || null,
              leftClickAction: picked.leftClickAction || null,
              rightClickActions: Array.isArray(picked.rightClickActions) ? picked.rightClickActions.slice() : null
            };

            renderEditor();
          });
        });

        wireIconFallbacks(editorEl);
      }

      function executeOffer() {
        if (!activeMode || !selectedItem) {
          setStatus("Select an item first.", true);
          return;
        }

        if (slotOffers[activeSlotIndex] && !isOfferSettled(slotOffers[activeSlotIndex])) {
          setStatus("Claim or abort the current offer before creating a new one in this slot.", true);
          return;
        }

        const qtyInput = editorEl.querySelector("#ge-offer-qty");
        const priceInput = editorEl.querySelector("#ge-offer-price");

        // Always require a valid price input; never fall back to selectedItem.price
        if (!priceInput || !priceInput.value.trim()) {
          setStatus("Enter a valid price for your offer.", true);
          return;
        }
        // Force re-read of price input at the moment of offer creation
        const priceFieldValue = priceInput.value;
        const qty = parseAmountInput(qtyInput ? qtyInput.value : "1", 1);
        const price = parseAmountInput(priceFieldValue, 1);
        if (!price || price < 1) {
          setStatus("Enter a valid price for your offer.", true);
          return;
        }

        // Defensive: never allow price to be overridden after confirmation
        const total = qty * price;
        const itemId = String(selectedItem.id);
        const ownedQty = getTotalQty(game.player.inventory, itemId);

        // DEBUG LOGGING: Show price and total coins being removed
        if (window && window.console) {
          console.log("[GE DEBUG] Placing offer:", {
            mode: activeMode,
            item: selectedItem.name,
            qty,
            price,
            total,
            coinsBefore: getCoins(game.player.inventory)
          });
        }

        if (activeMode === "buy") {
          if (!removeCoinsAndTokens(game.player.inventory, total)) {
            setStatus("Not enough coins or platinum tokens for this offer.", true);
            return;
          }
        } else {
          if (ownedQty < qty) {
            setStatus("You do not have enough items to sell.", true);
            return;
          }

          const removed = removeItemFromInventory(game.player.inventory, itemId, qty);
          if (!removed) {
            setStatus("Could not remove items from inventory.", true);
            return;
          }
        }

        // Always use the confirmed price for both price and marketPrice
        slotOffers[activeSlotIndex] = {
          mode: activeMode,
          itemId,
          inventoryItemId: activeMode === "sell" ? itemId : null,
          marketItemId: String(selectedItem.marketItemId || itemId),
          itemName: selectedItem.name,
          iconFile: selectedItem.iconFile,
          icon: selectedItem.icon,
          noted: !!selectedItem.noted,
          stackable: !!selectedItem.stackable,
          slot: selectedItem.slot || null,
          bonuses: selectedItem.bonuses || null,
          itemType: selectedItem.itemType || null,
          leftClickAction: selectedItem.leftClickAction || null,
          rightClickActions: Array.isArray(selectedItem.rightClickActions) ? selectedItem.rightClickActions.slice() : null,
          qty,
          price,
          marketPrice: Math.max(1, getSharedGePriceById(String(selectedItem.marketItemId || itemId)) || Number(selectedItem.price) || price),
          total,
          status: "active",
          createdAt: nowMs(),
          updatedAt: nowMs(),
          filledQty: 0,
          claimedQty: 0,
          reservedCoins: activeMode === "buy" ? qty * price : 0,
          spentCoins: 0,
          receivedCoins: 0,
          claimedCoins: 0,
          returnedQty: 0,
          claimedReturnedQty: 0
        };

        if (window && window.console) {
          console.log("[GE DEBUG] Offer placed. Coins after:", getCoins(game.player.inventory));
        }

        if (RSGame.UI && typeof RSGame.UI.renderInventory === "function") {
          RSGame.UI.renderInventory(game.player);
        }
        if (RSGame.UI && typeof RSGame.UI.renderSkills === "function") {
          RSGame.UI.renderSkills(game.player);
        }

        updateCoinsLabel();
        renderSlotGrid();
        // Only re-render the editor if the active slot's offer changed
        if (slotOffers[activeSlotIndex]) {
          renderEditor();
        }
        saveNowSafe();

        setStatus("Offer created. It will now fill over time based on your price.", false);
      }

      function clearOrAbortActiveSlot() {
        const offer = slotOffers[activeSlotIndex];
        if (!offer) return;

        if (offer.status === "active" || offer.status === "stalled") {
          abortOffer(activeSlotIndex);
          return;
        }

        if (isOfferSettled(offer)) {
          slotOffers[activeSlotIndex] = null;
          resetEditorStateForSlot(activeSlotIndex);
          renderSlotGrid();
          renderEditor();
          saveNowSafe();
          return;
        }

        claimOffer(activeSlotIndex);
      }

      function renderActiveOfferEditor(offer) {
        const market = getMarketPriceForOffer(offer);
        const fillPct = Math.max(0, Math.min(100, ((offer.filledQty || 0) / Math.max(1, offer.qty || 1)) * 100));
        const claim = getClaimable(offer);
        const hasClaim = claim.items > 0 || claim.coins > 0 || claim.filledItems > 0 || claim.returnedItems > 0;

        let claimLine = "Nothing to claim yet.";
        if (offer.mode === "buy") {
          const itemClaim = Math.max(0, (offer.filledQty || 0) - (offer.claimedQty || 0));
          const refundClaim = (offer.status === "completed" || offer.status === "aborted")
            ? Math.max(0, ((offer.reservedCoins || 0) - (offer.spentCoins || 0)) - (offer.claimedCoins || 0))
            : 0;
          claimLine = "Claimable: " + formatCompactQty(itemClaim) + " item(s)"
            + (refundClaim > 0 ? " + " + formatPrice(refundClaim) + " refund" : "");
        } else {
          const coinClaim = Math.max(0, (offer.receivedCoins || 0) - (offer.claimedCoins || 0));
          const returnedClaim = Math.max(0, (offer.returnedQty || 0) - (offer.claimedReturnedQty || 0));
          claimLine = "Claimable: " + formatPrice(coinClaim)
            + (returnedClaim > 0 ? " + " + formatCompactQty(returnedClaim) + " item(s)" : "");
        }

        editorEl.innerHTML = ""
          + "<div class=\"ge-editor-title\">" + (offer.mode === "buy" ? "Buy Offer" : "Sell Offer") + " - Slot " + (activeSlotIndex + 1) + "</div>"
          + "<div class=\"ge-item-preview\">"
          + createIconMarkup({ id: offer.marketItemId || offer.itemId, iconFile: offer.iconFile, icon: offer.icon, name: offer.itemName }, "ge-preview-icon")
          + "<div class=\"ge-preview-lines\">"
          + "  <div class=\"ge-preview-name\">" + offer.itemName + "</div>"
          + "  <div class=\"ge-preview-sub\">Offer: " + formatCompactQty(offer.qty) + " @ " + formatPrice(offer.price) + " each</div>"
          + "  <div class=\"ge-preview-sub\">Market: " + formatPrice(market) + " each</div>"
          + "</div>"
          + "</div>"
          + "<div class=\"ge-offer-progress-wrap\">"
          + "  <div class=\"ge-offer-progress-head\"><span>Progress</span><span>" + formatCompactQty(offer.filledQty || 0) + " / " + formatCompactQty(offer.qty || 0) + "</span></div>"
          + "  <div class=\"ge-offer-progress\"><span style=\"width:" + fillPct.toFixed(1) + "%\"></span></div>"
          + "  <div class=\"ge-offer-progress-sub\">" + (offer.status === "stalled" ? "Underpriced for current market. Offer is waiting." : offer.status === "active" ? "Offer is filling over time." : offer.status === "aborted" ? "Offer aborted. Claim outstanding items/coins." : "Offer completed. Claim from slot.") + "</div>"
          + "</div>"
          + "<div class=\"ge-claim-line\">" + claimLine + "</div>"
          + "<div class=\"ge-editor-actions\">"
          + "  <button id=\"ge-claim-offer\" type=\"button\" class=\"ge-mode-btn confirm\"" + (hasClaim ? "" : " disabled") + ">Claim Rewards</button>"
          + "  <button id=\"ge-abort-offer\" type=\"button\" class=\"ge-mode-btn clear\"" + ((offer.status === "active" || offer.status === "stalled") ? "" : " disabled") + ">Abort Offer</button>"
          + "  <button id=\"ge-clear-offer\" type=\"button\" class=\"ge-mode-btn switch\">" + (isOfferSettled(offer) ? "Clear Slot" : "Claim / Clear") + "</button>"
          + "</div>";

        editorEl.querySelector("#ge-claim-offer")?.addEventListener("click", () => claimOffer(activeSlotIndex));
        editorEl.querySelector("#ge-abort-offer")?.addEventListener("click", () => abortOffer(activeSlotIndex));
        editorEl.querySelector("#ge-clear-offer")?.addEventListener("click", clearOrAbortActiveSlot);

        wireIconFallbacks(editorEl);
      }

      function renderEditor() {
        const existingOffer = slotOffers[activeSlotIndex];

        if (existingOffer) {
          renderActiveOfferEditor(existingOffer);
          return;
        }


        // --- Preserve in-progress values for new offers ---
        let prevQty = "";
        let prevPrice = "";
        if (!existingOffer && activeMode) {
          const qtyInput = editorEl.querySelector("#ge-offer-qty");
          const priceInput = editorEl.querySelector("#ge-offer-price");
          if (qtyInput) prevQty = qtyInput.value;
          if (priceInput) prevPrice = priceInput.value;
        }

        if (!activeMode) {
          editorEl.innerHTML = ""
            + "<div class=\"ge-editor-landing\">"
            + "  <div class=\"ge-editor-title\">Set up offer in Slot " + (activeSlotIndex + 1) + "</div>"
            + "  <div class=\"ge-editor-actions\">"
            + "    <button id=\"ge-open-buy\" type=\"button\" class=\"ge-mode-btn buy\">Create Buy Offer</button>"
            + "    <button id=\"ge-open-sell\" type=\"button\" class=\"ge-mode-btn sell\">Create Sell Offer</button>"
            + "  </div>"
            + "</div>";

          const buyBtn = editorEl.querySelector("#ge-open-buy");
          const sellBtn = editorEl.querySelector("#ge-open-sell");

          buyBtn.addEventListener("click", () => {
            activeMode = "buy";
            searchQuery = "";
            searchResults = geItems.slice(0, 80);
            renderEditor();
          });

          sellBtn.addEventListener("click", () => {
            activeMode = "sell";
            searchQuery = "";
            searchResults = geItems.slice(0, 80);
            renderEditor();
          });

          return;
        }

        const mode = activeMode;
        const isBuyMode = mode === "buy";
        const modeLabel = isBuyMode ? "Buy Offer" : "Sell Offer";
        const preview = selectedItem;
        const priceDefault = preview ? Math.max(1, Number(preview.price) || 1) : 1;
        const ownQty = preview ? getTotalQty(game.player.inventory, String(preview.id)).toLocaleString() : "0";


        editorEl.innerHTML = ""
          + "<div class=\"ge-editor-title\">" + modeLabel + " - Slot " + (activeSlotIndex + 1) + "</div>"
          + "<div class=\"ge-item-preview\">"
          + (preview
            ? ""
              + createIconMarkup(preview, "ge-preview-icon")
              + "<div class=\"ge-preview-lines\">"
              + "  <div class=\"ge-preview-name\">" + preview.name + "</div>"
              + "  <div class=\"ge-preview-sub\">Market: " + formatPrice(preview.price) + "</div>"
              + "  <div class=\"ge-preview-sub\">You own: " + ownQty + "</div>"
              + "</div>"
            : "<div class=\"ge-preview-empty\">No item selected.</div>")
          + "</div>"
          + "<div class=\"ge-form-row\">"
          + "  <label>Quantity</label>"
          + "  <input id=\"ge-offer-qty\" type=\"text\" value=\"1\" placeholder=\"1 / 10 / 100 / 1k\">"
          + "  <button id=\"ge-max-qty\" type=\"button\" class=\"ge-max-btn\">Max</button>"
          + "</div>"
          + "<div class=\"ge-form-row\">"
          + "  <label>Price each</label>"
          + "  <input id=\"ge-offer-price\" type=\"text\" value=\"" + priceDefault + "\" placeholder=\"1 / 1k / 1m / 1b\">"
          + "  <span class=\"ge-price-adjust-wrap\">"
          + [5,10,15].map(function(p){return '<button type=\"button\" class=\"ge-price-adjust-btn plus\" data-adj=\"'+p+'\">+'+p+'%</button>'}).join('')
          + '<button type="button" class="ge-price-default-btn">Default</button>'
          + [5,10,15].map(function(p){return '<button type=\"button\" class=\"ge-price-adjust-btn minus\" data-adj=\"-'+p+'\">-'+p+'%</button>'}).join('')
          + "  </span>"
          + "</div>"
          + "<div class=\"ge-chatbox\">"
          + "  <div class=\"ge-chat-title\">" + (isBuyMode ? "What would you like to buy?" : "Click an inventory item to sell") + "</div>"
          + (isBuyMode
            ? "  <input id=\"ge-chat-search\" type=\"text\" placeholder=\"Type item name...\" autocomplete=\"off\">" + renderSearchResultsList()
            : renderSellInventoryPicker())
          + "</div>"
          + "<div class=\"ge-editor-actions\">"
          + "  <button id=\"ge-confirm-offer\" type=\"button\" class=\"ge-mode-btn confirm\">Confirm Offer</button>"
          + "  <button id=\"ge-switch-mode\" type=\"button\" class=\"ge-mode-btn switch\">Switch to " + (mode === "buy" ? "Sell" : "Buy") + "</button>"
          + "</div>";

        // Restore preserved values if present, but only restore price if item did not change
        if (!existingOffer && activeMode) {
          const qtyInput = editorEl.querySelector("#ge-offer-qty");
          const priceInput = editorEl.querySelector("#ge-offer-price");
          if (qtyInput && prevQty) qtyInput.value = prevQty;
          // Only restore price if the item did not change
          if (priceInput && prevPrice && preview && lastSelectedItemId === preview.id) priceInput.value = prevPrice;
        }
        // Update lastSelectedItemId for next render
        if (preview && preview.id) lastSelectedItemId = preview.id;

        // Max button logic
        const maxBtn = editorEl.querySelector("#ge-max-qty");
        if (maxBtn) {
          maxBtn.addEventListener("click", () => {
            const qtyInput = editorEl.querySelector("#ge-offer-qty");
            if (!qtyInput) return;
            if (activeMode === "sell" && preview && preview.id) {
              // For sell, set to amount owned
              const ownedQty = getTotalQty(game.player.inventory, String(preview.id));
              qtyInput.value = ownedQty > 0 ? ownedQty : 1;
            } else {
              // For buy, set to max affordable
              const priceInput = editorEl.querySelector("#ge-offer-price");
              let price = 1;
              if (priceInput && priceInput.value) {
                price = parseAmountInput(priceInput.value, 1);
              } else if (preview && preview.price) {
                price = Math.max(1, Number(preview.price) || 1);
              }
              // Calculate total gp (coins + platinum tokens + divine tokens)
              const totalValue = getWalletValue(game.player.inventory);
              const maxQty = price > 0 ? Math.floor(totalValue / price) : 0;
              qtyInput.value = maxQty > 0 ? maxQty : 1;
            }
          });
        }

        // Price adjust buttons logic
        editorEl.querySelectorAll('.ge-price-adjust-btn').forEach(function(btn){
          btn.addEventListener('click', function(){
            const priceInput = editorEl.querySelector('#ge-offer-price');
            if (!priceInput) return;
            let val = parseAmountInput(priceInput.value, 1);
            let pct = Number(btn.getAttribute('data-adj'));
            if (isNaN(pct)) return;
            let newVal = Math.max(1, Math.round(val * (1 + pct/100)));
            priceInput.value = newVal;
          });
        });
        // Default button logic
        const defaultBtn = editorEl.querySelector('.ge-price-default-btn');
        if (defaultBtn) {
          defaultBtn.addEventListener('click', function() {
            const priceInput = editorEl.querySelector('#ge-offer-price');
            if (!priceInput) return;
            let market = 1;
            if (preview && preview.price) {
              market = Math.max(1, Number(preview.price) || 1);
            }
            priceInput.value = market;
          });
        }

        wireSearchInteraction();

        editorEl.querySelector("#ge-confirm-offer")?.addEventListener("click", executeOffer);
        editorEl.querySelector("#ge-switch-mode")?.addEventListener("click", () => {
          activeMode = mode === "buy" ? "sell" : "buy";
          searchQuery = "";
          searchResults = geItems.slice(0, 80);
          selectedItem = null;
          renderEditor();
        });
      }

      function tickOffers() {
        let changed = false;

        for (let i = 0; i < slotOffers.length; i++) {
          const offer = slotOffers[i];
          if (!offer) continue;
          if (offer.status !== "active" && offer.status !== "stalled") continue;

          const remaining = Math.max(0, (offer.qty || 0) - (offer.filledQty || 0));
          if (remaining <= 0) {
            offer.status = "completed";
            offer.completedAt = nowMs();
            changed = true;
            continue;
          }

          // Use marketPrice only for fill rate, never for transactional math
          const market = getMarketPriceForOffer(offer);
          const ratio = (Number(offer.price) || 0) / Math.max(1, market);

          let rate = 0;
          if (offer.mode === "buy") {
            rate = buildBuyFillRate(ratio);
          } else {
            rate = buildSellFillRate(ratio);
          }
          rate *= Math.max(1, Number(window.RSGame?.MagicPerks?.getGeFillRateMultiplier?.(game.player) || 1));
          rate *= Math.max(1, Number(window.RSGame?.PetsPerks?.getGeFillRateMultiplier?.(game.player) || 1));

          const delta = calcDeltaFromRate(remaining, rate);

          if (delta <= 0) {
            offer.status = (rate <= 0) ? "stalled" : "active";
            continue;
          }

          offer.status = "active";
          offer.filledQty = Math.min(offer.qty, (offer.filledQty || 0) + delta);

          if (offer.mode === "buy") {
            // Always use the player's offer price for spentCoins, not the market price or override
            const unitCost = offer.price;
            offer.spentCoins = Math.min(offer.reservedCoins, (offer.spentCoins || 0) + Math.round(delta * unitCost));
          } else {
            // Always credit coins at the player's sell price, not the market price or override
            offer.receivedCoins = (offer.receivedCoins || 0) + Math.round(delta * offer.price);
          }

          if (offer.filledQty >= offer.qty) {
            offer.status = "completed";
            offer.completedAt = nowMs();
          }

          offer.updatedAt = nowMs();
          changed = true;
        }

        if (!changed) return;

        renderSlotGrid();
        renderEditor();
        saveNowSafe();
      }

      async function loadAndRender(forceRefresh) {
        setStatus("Loading GE data...");
        try {
          const result = await loadGeDatabase(!!forceRefresh);
          geItems = result.payload.items || [];
          publishGeApi();

          if (!searchResults.length) {
            searchResults = geItems.slice(0, 80);
          }

          resetEditorStateForSlot(activeSlotIndex);
          renderSlotGrid();
          renderEditor();
          updateCoinsLabel();
          updateCacheAgeStatus(result);
        } catch (_err) {
          geItems = [];
          searchResults = [];
          publishGeApi();
          renderSlotGrid();
          renderEditor();
          setStatus("Could not load GE data right now.", true);
        }
      }

      // We auto-refresh prices when stale, so the manual refresh button is no longer needed.

      if (RSGame.Events && typeof RSGame.Events.on === "function") {
        RSGame.Events.on("playerUpdated", () => {
          updateCoinsLabel();
          renderEditor();
          renderSlotGrid();
        });
      }

      updateCoinsLabel();
      renderSlotGrid();
      renderEditor();
      loadAndRender(false);

      if (fillTimer) {
        clearInterval(fillTimer);
      }
      fillTimer = setInterval(tickOffers, FILL_TICK_MS);
    }
  });
})();
