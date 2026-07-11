// content/02_codes_ui_mod.js

window.RSGame = window.RSGame || {};

(function () {
  function wikiIcon(file) {
    return `https://oldschool.runescape.wiki/images/thumb/${file}/32px-${file}`;
  }

  function isDevUnlocked() {
    if (typeof sessionStorage === "undefined") return false;
    return sessionStorage.getItem("rsgame.devUnlocked.v1") === "1";
  }

  function buildReward(id, name, qty, icon, stackable = false) {
    return { id, name, qty, icon, stackable };
  }

  function buildGeReward(name, qty, stackable = false, fallbackId) {
    return {
      geName: name,
      qty,
      stackable,
      fallbackId: fallbackId || null
    };
  }

  const SECRET_CODES = {
    juniper: {
      label: "Juniper",
      description: "1x Old School Bond + 50m coins",
      rewards: [
        buildGeReward("Old School Bond", 1, false, "bond"),
        buildReward("coins", "Coins", 50_000_000, wikiIcon("Coins_10000.png"), true)
      ]
    },
    agedclue: {
      label: "AgedClue",
      description: "3a melee, range and mage sets, 3rd age weapons, ring, and druidic gear",
      rewards: [
        buildGeReward("3rd age full helmet", 1, false, "3rd_age_full_helmet"),
        buildGeReward("3rd age platebody", 1, false, "3rd_age_platebody"),
        buildGeReward("3rd age platelegs", 1, false, "3rd_age_platelegs"),
        buildGeReward("3rd age longsword", 1, false, "third_age_longsword"),
        buildGeReward("3rd age range top", 1, false, "third_age_range_top"),
        buildGeReward("3rd age range legs", 1, false, "third_age_range_legs"),
        buildGeReward("3rd age bow", 1, false, "third_age_bow"),
        buildGeReward("3rd age robe top", 1, false, "third_age_robe_top"),
        buildGeReward("3rd age robe", 1, false, "third_age_robe"),
        buildGeReward("3rd age mage hat", 1, false, "third_age_mage_hat"),
        buildGeReward("3rd age wand", 1, false, "third_age_wand"),
        buildGeReward("Ring of 3rd age", 1, false, "ring_of_3rd_age"),
        buildGeReward("Druidic wreath", 1, false, "druidic_wreath"),
        buildGeReward("Druidic robe top", 1, false, "druidic_robe_top"),
        buildGeReward("Druidic robe bottoms", 1, false, "druidic_robe_bottoms"),
        buildGeReward("Druidic cloak", 1, false, "druidic_cloak"),
        buildGeReward("Druidic staff", 1, false, "druidic_staff")
      ]
    },
    dansisland: {
      label: "DansIsland",
      description: "All partyhats, all h'ween masks, Santa hat, Disk of returning, Easter egg, Pumpkin, and 1000m platinum tokens",
      rewards: [
        buildGeReward("Red partyhat", 1, false, "partyhat_red"),
        buildGeReward("Blue partyhat", 1, false, "partyhat_blue"),
        buildGeReward("Green partyhat", 1, false, "partyhat_green"),
        buildGeReward("Yellow partyhat", 1, false, "partyhat_yellow"),
        buildGeReward("Purple partyhat", 1, false, "partyhat_purple"),
        buildGeReward("White partyhat", 1, false, "partyhat_white"),
        buildGeReward("Red h'ween mask", 1, false, "hween_mask_red"),
        buildGeReward("Blue h'ween mask", 1, false, "hween_mask_blue"),
        buildGeReward("Green h'ween mask", 1, false, "hween_mask_green"),
        buildGeReward("Santa hat", 1, false, "santa_hat"),
        buildGeReward("Disk of returning", 1, false, "disk_of_returning"),
        buildGeReward("Easter egg", 1, false, "easter_egg"),
        buildGeReward("Pumpkin", 1, false, "pumpkin"),
        buildReward("platinum_token", "Platinum token", 1_000_000_000, wikiIcon("Platinum_token_detail.png"), true)
      ]
    }
  };

  function normalizeCode(value) {
    return String(value || "").replace(/\s+/g, "").trim().toLowerCase();
  }

  function grantRewards(player, rewards) {
    let granted = 0;
    let failed = 0;

    (rewards || []).forEach((reward) => {
      if (!reward) return;
      const qty = Math.max(1, Number(reward.qty) || 1);

      if (reward.geName && window.RSGame?.GE?.grantInstantBuyFill) {
        const geGrant = window.RSGame.GE.grantInstantBuyFill(player, reward.geName, qty, {
          inventoryItemId: reward.fallbackId || null,
          stackable: !!reward.stackable
        });
        if (geGrant?.ok) granted += 1;
        else failed += 1;
        return;
      }

      if (!reward.id || !reward.name) {
        failed += 1;
        return;
      }

      const ok = player?.inventory?.addItem?.({
        id: reward.id,
        name: reward.name,
        qty,
        icon: reward.icon,
        stackable: !!reward.stackable
      });
      if (ok) granted += 1;
      else failed += 1;
    });

    RSGame.UI?.renderInventory?.(player);
    RSGame.Game?.saveNow?.();
    return { granted, failed };
  }

  function renderCodeList() {
    return Object.values(SECRET_CODES).map((entry) => {
      return `<div class="codes-list-row"><strong>${entry.label}</strong><span>${entry.description}</span></div>`;
    }).join("");
  }

  function applyCode(player, rawCode) {
    const codeKey = normalizeCode(rawCode);
    const entry = SECRET_CODES[codeKey];
    if (!entry) {
      return { ok: false, message: "Unknown code." };
    }

    const result = grantRewards(player, entry.rewards);
    if (result.failed > 0) {
      return {
        ok: true,
        message: `Redeemed ${entry.label}, but ${result.failed} reward(s) could not be added because the inventory was full.`
      };
    }

    return {
      ok: true,
      message: `Redeemed ${entry.label}.`
    };
  }

  function getPlayerCoins(player) {
    const slots = player?.inventory?.getSlots?.() || player?.inventory?.slots || [];
    const coinSlot = slots.find((slot) => slot && slot.id === "coins");
    return Math.max(0, Number(coinSlot?.qty) || 0);
  }

  function renderUpgradeEffectText(row) {
    if (!row) return "";
    if (row.effectUnit === "percent") return `+${row.effectValue}%`;
    if (row.effectUnit === "tier") return `Tier ${row.effectValue}`;
    return `+${row.effectValue}`;
  }

  function refreshUpgradesPanel(panel, game, statusMessage = "") {
    if (!panel) return;
    const player = game?.player || window.Player;
    const combatApi = window.RSGame?.Combat;

    const statusEl = panel.querySelector("#upgrades-status");
    const coinsEl = panel.querySelector("#upgrades-coins");
    const listEl = panel.querySelector("#upgrades-list");

    if (coinsEl) {
      coinsEl.textContent = `Your gp: ${getPlayerCoins(player).toLocaleString()}`;
    }

    if (statusEl) {
      statusEl.textContent = statusMessage || "Spend gp for permanent combat upgrades. Failure consumes gp.";
      statusEl.classList.toggle("error", /failed|need|unknown|maxed|maxed\.|could not/i.test(statusEl.textContent));
    }

    if (!listEl) return;
    const rows = combatApi?.getUpgradeShopRows?.() || [];
    if (!rows.length) {
      listEl.innerHTML = '<div class="upgrade-row"><div class="upgrade-meta"><strong>Upgrades unavailable</strong><span>Combat module not ready.</span></div></div>';
      return;
    }

    listEl.innerHTML = rows.map((row) => {
      const chancePct = Math.max(0, Math.min(100, Math.round((Number(row.chance) || 0) * 1000) / 10));
      const atCap = Number(row.level) >= Number(row.maxLevel);
      return `
        <div class="upgrade-row" data-upgrade-key="${row.key}">
          <div class="upgrade-meta">
            <strong>${row.label} <span class="upgrade-level">Lv ${row.level}</span></strong>
            <span>${row.description}</span>
            <span class="upgrade-effect">Current bonus: ${renderUpgradeEffectText(row)}</span>
            <span class="upgrade-stats">Chance: ${chancePct}% | Cost: ${Number(row.cost || 0).toLocaleString()} gp</span>
          </div>
          <button class="upgrade-buy-btn" type="button" data-upgrade-key="${row.key}" ${atCap ? "disabled" : ""}>${atCap ? "Max" : "Upgrade"}</button>
        </div>
      `;
    }).join("");
  }

  function refreshCodesPanel(panel, game) {
    if (!panel) return;

    const statusEl = panel.querySelector("#codes-status");
    const listWrap = panel.querySelector("#codes-list-wrap");
    const listEl = panel.querySelector("#codes-list");
    const redeemBtn = panel.querySelector("#codes-redeem");
    const inputEl = panel.querySelector("#codes-input");
    const devUnlocked = isDevUnlocked();

    if (statusEl) {
      statusEl.textContent = devUnlocked
        ? "Developer menu unlocked. Available codes are listed below."
        : "Unlock the developer menu to reveal available codes.";
    }

    if (listWrap) listWrap.hidden = !devUnlocked;
    if (listEl) listEl.innerHTML = devUnlocked ? renderCodeList() : "";
    if (redeemBtn) redeemBtn.disabled = !game?.player;
    if (inputEl && !devUnlocked) {
      inputEl.placeholder = "Enter a secret code";
    }
  }

  RSGame.Game.registerMod({
    name: "Codes UI",

    onGameInit(game) {
      console.log("[Codes UI] Building UI after all mods registered...");

      const tabBar = document.querySelector("#tab-bar");
      const main = document.querySelector(".main-layout");

      if (!tabBar || !main) return;

      /* ---------------------------------------------------
         PANELS
      --------------------------------------------------- */
      let codesPanel = main.querySelector(".codes-panel");
      if (!codesPanel) {
        codesPanel = document.createElement("section");
        codesPanel.className = "panel codes-panel";
        codesPanel.style.display = "none";
        codesPanel.innerHTML = `
          <h2>Codes</h2>
          <div class="codes-panel-body">
            <div id="codes-status" class="codes-status"></div>
            <div id="codes-result" class="codes-result"></div>
            <div class="codes-redeem-row">
              <input id="codes-input" class="codes-input" type="text" maxlength="32" placeholder="Enter a secret code" autocomplete="off" />
              <button id="codes-redeem" type="button" class="codes-redeem-btn">Redeem</button>
            </div>
            <div id="codes-list-wrap" class="codes-list-wrap" hidden>
              <h3>Available Codes</h3>
              <div id="codes-list" class="codes-list"></div>
            </div>
          </div>`;
        main.appendChild(codesPanel);
      }

      let upgradesPanel = main.querySelector(".upgrades-panel");
      if (!upgradesPanel) {
        upgradesPanel = document.createElement("section");
        upgradesPanel.className = "panel upgrades-panel";
        upgradesPanel.style.display = "none";
        upgradesPanel.innerHTML = `
          <h2>Upgrades Shop</h2>
          <div class="upgrades-panel-body">
            <div id="upgrades-coins" class="upgrades-coins"></div>
            <div id="upgrades-status" class="codes-status"></div>
            <div id="upgrades-list" class="upgrades-list"></div>
          </div>
        `;
        main.appendChild(upgradesPanel);
      }

      let gatheringPanel = main.querySelector(".gathering-panel");
      if (!gatheringPanel) {
        gatheringPanel = document.createElement("section");
        gatheringPanel.className = "panel gathering-panel";
        gatheringPanel.style.display = "none";
        gatheringPanel.innerHTML = `<h2>Shop</h2>`;
        main.appendChild(gatheringPanel);
      }

      /* ---------------------------------------------------
         TAB BUTTONS
      --------------------------------------------------- */
      if (!tabBar.querySelector('.tab-btn[data-tab="upgrades"]')) {
        const upgradesBtn = document.createElement("button");
        upgradesBtn.className = "tab-btn";
        upgradesBtn.dataset.tab = "upgrades";
        upgradesBtn.innerHTML = `
          <img class="tab-icon" src="https://oldschool.runescape.wiki/images/thumb/Coins_10000.png/32px-Coins_10000.png" alt="Upgrades" onerror="this.onerror=null;this.src='https://oldschool.runescape.wiki/images/Attack_icon_(detail).png';">
          <span class="tab-label">Upgrades</span>
        `;
        tabBar.appendChild(upgradesBtn);
      }

      const redeemHandler = () => {
        const inputEl = codesPanel.querySelector("#codes-input");
        const resultEl = codesPanel.querySelector("#codes-result");
        const result = applyCode(game.player, inputEl?.value || "");
        if (resultEl) {
          resultEl.textContent = result.message;
          resultEl.classList.toggle("error", !result.ok);
        }
        if (result.ok && inputEl) inputEl.value = "";
        refreshCodesPanel(codesPanel, game);
      };

      codesPanel.querySelector("#codes-redeem")?.addEventListener("click", redeemHandler);
      codesPanel.querySelector("#codes-input")?.addEventListener("keydown", (e) => {
        if (e.key === "Enter") redeemHandler();
      });

      upgradesPanel.querySelector("#upgrades-list")?.addEventListener("click", (e) => {
        const btn = e.target.closest?.(".upgrade-buy-btn");
        if (!btn) return;
        const key = btn.getAttribute("data-upgrade-key");
        const result = window.RSGame?.Combat?.purchaseUpgrade?.(key);
        refreshUpgradesPanel(upgradesPanel, game, result?.message || "Upgrade unavailable.");
      });

      refreshCodesPanel(codesPanel, game);
      refreshUpgradesPanel(upgradesPanel, game);
    },

    onAfterRender(game) {
      const codesPanel = document.querySelector(".codes-panel");
      const upgradesPanel = document.querySelector(".upgrades-panel");
      refreshCodesPanel(codesPanel, game);
      refreshUpgradesPanel(upgradesPanel, game);
    }
  });

})();
