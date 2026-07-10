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

  function inferLocalItemIdFromName(name) {
    return String(name || "")
      .toLowerCase()
      .replace(/'/g, "")
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
  }

  function normalizeLookupName(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/[_-]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function buildGeReward(name, qty, fallbackIcon, stackable = false, fallbackId) {
    return {
      geName: name,
      qty,
      fallbackIcon,
      stackable,
      fallbackId: fallbackId || inferLocalItemIdFromName(name)
    };
  }

  const SECRET_CODES = {
    juniper: {
      label: "Juniper",
      description: "1x Old School Bond + 50m coins",
      rewards: [
        buildGeReward("Old School Bond", 1, wikiIcon("Old_School_Bond.png"), false, "bond"),
        buildReward("coins", "Coins", 50_000_000, wikiIcon("Coins_10000.png"), true)
      ]
    },
    agedclue: {
      label: "AgedClue",
      description: "3a melee, range and mage sets, 3rd age weapons, ring, and druidic gear",
      rewards: [
        buildGeReward("3rd age full helmet", 1, wikiIcon("3rd_age_full_helmet.png"), false, "3rd_age_full_helmet"),
        buildGeReward("3rd age platebody", 1, wikiIcon("3rd_age_platebody.png"), false, "3rd_age_platebody"),
        buildGeReward("3rd age platelegs", 1, wikiIcon("3rd_age_platelegs.png"), false, "3rd_age_platelegs"),
        buildGeReward("3rd age longsword", 1, wikiIcon("3rd_age_longsword.png"), false, "third_age_longsword"),
        buildGeReward("3rd age range top", 1, wikiIcon("3rd_age_range_top.png"), false, "third_age_range_top"),
        buildGeReward("3rd age range legs", 1, wikiIcon("3rd_age_range_legs.png"), false, "third_age_range_legs"),
        buildGeReward("3rd age bow", 1, wikiIcon("3rd_age_bow.png"), false, "third_age_bow"),
        buildGeReward("3rd age robe top", 1, wikiIcon("3rd_age_robe_top.png"), false, "third_age_robe_top"),
        buildGeReward("3rd age robe", 1, wikiIcon("3rd_age_robe.png"), false, "third_age_robe"),
        buildGeReward("3rd age mage hat", 1, wikiIcon("3rd_age_mage_hat.png"), false, "third_age_mage_hat"),
        buildGeReward("3rd age wand", 1, wikiIcon("3rd_age_wand.png"), false, "third_age_wand"),
        buildGeReward("Ring of 3rd age", 1, wikiIcon("Ring_of_3rd_age.png"), false, "ring_of_3rd_age"),
        buildGeReward("Druidic wreath", 1, wikiIcon("Druidic_wreath.png"), false, "druidic_wreath"),
        buildGeReward("Druidic robe top", 1, wikiIcon("Druidic_robe_top.png"), false, "druidic_robe_top"),
        buildGeReward("Druidic robe bottoms", 1, wikiIcon("Druidic_robe_bottoms.png"), false, "druidic_robe_bottoms"),
        buildGeReward("Druidic cloak", 1, wikiIcon("Druidic_cloak.png"), false, "druidic_cloak"),
        buildGeReward("Druidic staff", 1, wikiIcon("Druidic_staff.png"), false, "druidic_staff")
      ]
    },
    dansisland: {
      label: "DansIsland",
      description: "All partyhats, all h'ween masks, Santa hat, Disk of returning, Easter egg, Pumpkin, and 1000m platinum tokens",
      rewards: [
        buildGeReward("Red partyhat", 1, wikiIcon("Partyhat_(red).png"), false, "partyhat_red"),
        buildGeReward("Blue partyhat", 1, wikiIcon("Partyhat_(blue).png"), false, "partyhat_blue"),
        buildGeReward("Green partyhat", 1, wikiIcon("Partyhat_(green).png"), false, "partyhat_green"),
        buildGeReward("Yellow partyhat", 1, wikiIcon("Partyhat_(yellow).png"), false, "partyhat_yellow"),
        buildGeReward("Purple partyhat", 1, wikiIcon("Partyhat_(purple).png"), false, "partyhat_purple"),
        buildGeReward("White partyhat", 1, wikiIcon("Partyhat_(white).png"), false, "partyhat_white"),
        buildGeReward("Red h'ween mask", 1, wikiIcon("H'ween_mask_(red).png"), false, "hween_mask_red"),
        buildGeReward("Blue h'ween mask", 1, wikiIcon("H'ween_mask_(blue).png"), false, "hween_mask_blue"),
        buildGeReward("Green h'ween mask", 1, wikiIcon("H'ween_mask_(green).png"), false, "hween_mask_green"),
        buildGeReward("Santa hat", 1, wikiIcon("Santa_hat.png"), false, "santa_hat"),
        buildGeReward("Disk of returning", 1, wikiIcon("Disk_of_returning.png"), false, "disk_of_returning"),
        buildGeReward("Easter egg", 1, wikiIcon("Easter_egg.png"), false, "easter_egg"),
        buildGeReward("Pumpkin", 1, wikiIcon("Pumpkin.png"), false, "pumpkin"),
        buildReward("platinum_token", "Platinum token", 1_000_000_000, wikiIcon("Platinum_token_detail.png"), true)
      ]
    }
  };

  function normalizeCode(value) {
    return String(value || "").replace(/\s+/g, "").trim().toLowerCase();
  }

  function grantRewards(player, rewards) {
    const geItems = window.RSGame?.GE?.getItems?.() || [];
    const byName = new Map((Array.isArray(geItems) ? geItems : []).map((item) => [normalizeLookupName(item?.name), item]));

    function resolveReward(reward) {
      if (!reward) return null;
      if (reward.geName) {
        const geMatch = byName.get(normalizeLookupName(reward.geName));
        const geName = geMatch?.name || reward.geName;
        const geId = geMatch?.id;
        const inferredId = reward.fallbackId || inferLocalItemIdFromName(geName);
        const geIcon = geMatch?.icon || null;
        const geIconFile = geMatch?.iconFile ? wikiIcon(geMatch.iconFile) : null;
        return {
          id: inferredId,
          name: geName,
          qty: reward.qty,
          icon: geIcon || geIconFile || reward.fallbackIcon || null,
          stackable: !!reward.stackable,
          osrsId: geId || null
        };
      }
      return reward;
    }

    let granted = 0;
    let failed = 0;

    (rewards || []).forEach((reward) => {
      const resolved = resolveReward(reward);
      if (!resolved || !resolved.id || !resolved.name) return;
      const qty = Math.max(1, Number(resolved.qty) || 1);
      const ok = player?.inventory?.addItem?.({
        id: resolved.id,
        name: resolved.name,
        qty,
        icon: resolved.icon,
        stackable: !!resolved.stackable,
        osrsId: resolved.osrsId
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
      const codesPanel = document.createElement("section");
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

      const gatheringPanel = document.createElement("section");
      gatheringPanel.className = "panel gathering-panel";
      gatheringPanel.style.display = "none";
      gatheringPanel.innerHTML = `<h2>Shop</h2>`;
      main.appendChild(gatheringPanel);

      /* ---------------------------------------------------
         TAB BUTTONS
      --------------------------------------------------- */
      const codesBtn = document.createElement("button");
      codesBtn.className = "tab-btn";
      codesBtn.dataset.tab = "codes";
      codesBtn.innerHTML = `
        <img class="tab-icon" src="https://oldschool.runescape.wiki/images/Key.png" alt="Codes" onerror="this.onerror=null;this.src='https://oldschool.runescape.wiki/images/Attack_icon_(detail).png';">
        <span class="tab-label">Codes</span>
      `;
      tabBar.appendChild(codesBtn);

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

      refreshCodesPanel(codesPanel, game);
    },

    onAfterRender(game) {
      const codesPanel = document.querySelector(".codes-panel");
      refreshCodesPanel(codesPanel, game);
    }
  });

})();
