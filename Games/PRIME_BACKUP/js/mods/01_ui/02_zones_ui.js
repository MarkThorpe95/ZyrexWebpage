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

  const SECRET_CODES = {
    juniper: {
      label: "Juniper",
      description: "1x Old School Bond + 50m coins",
      rewards: [
        buildReward("bond", "Old School Bond", 1, wikiIcon("Old_School_Bond.png")),
        buildReward("coins", "Coins", 50_000_000, wikiIcon("Coins_10000.png"), true)
      ]
    },
    agedclue: {
      label: "AgedClue",
      description: "3a melee, range and mage sets, 3rd age weapons, ring, and druidic gear",
      rewards: [
        buildReward("3rd_age_full_helmet", "3rd age full helmet", 1, wikiIcon("3rd_age_full_helmet.png")),
        buildReward("3rd_age_platebody", "3rd age platebody", 1, wikiIcon("3rd_age_platebody.png")),
        buildReward("3rd_age_platelegs", "3rd age platelegs", 1, wikiIcon("3rd_age_platelegs.png")),
        buildReward("3rd_age_longsword", "3rd age longsword", 1, wikiIcon("3rd_age_longsword.png")),
        buildReward("third_age_range_top", "3rd age range top", 1, wikiIcon("3rd_age_range_top.png")),
        buildReward("third_age_range_legs", "3rd age range legs", 1, wikiIcon("3rd_age_range_legs.png")),
        buildReward("third_age_bow", "3rd age bow", 1, wikiIcon("3rd_age_bow.png")),
        buildReward("third_age_robe_top", "3rd age robe top", 1, wikiIcon("3rd_age_robe_top.png")),
        buildReward("third_age_robe", "3rd age robe", 1, wikiIcon("3rd_age_robe.png")),
        buildReward("third_age_mage_hat", "3rd age mage hat", 1, wikiIcon("3rd_age_mage_hat.png")),
        buildReward("third_age_wand", "3rd age wand", 1, wikiIcon("3rd_age_wand.png")),
        buildReward("ring_of_3rd_age", "Ring of 3rd age", 1, wikiIcon("Ring_of_3rd_age.png")),
        buildReward("druidic_wreath", "Druidic wreath", 1, wikiIcon("Druidic_wreath.png")),
        buildReward("druidic_robe_top", "Druidic robe top", 1, wikiIcon("Druidic_robe_top.png")),
        buildReward("druidic_robe_bottom", "Druidic robe bottom", 1, wikiIcon("Druidic_robe_bottom.png")),
        buildReward("druidic_staff", "Druidic staff", 1, wikiIcon("Druidic_staff.png"))
      ]
    },
    dansisland: {
      label: "DansIsland",
      description: "All partyhats, all h'ween masks, Santa hat, Disk of returning, Easter egg, Pumpkin, and 1000m platinum tokens",
      rewards: [
        buildReward("partyhat_red", "Red partyhat", 1, wikiIcon("Partyhat_(red).png")),
        buildReward("partyhat_blue", "Blue partyhat", 1, wikiIcon("Partyhat_(blue).png")),
        buildReward("partyhat_green", "Green partyhat", 1, wikiIcon("Partyhat_(green).png")),
        buildReward("partyhat_yellow", "Yellow partyhat", 1, wikiIcon("Partyhat_(yellow).png")),
        buildReward("partyhat_purple", "Purple partyhat", 1, wikiIcon("Partyhat_(purple).png")),
        buildReward("partyhat_white", "White partyhat", 1, wikiIcon("Partyhat_(white).png")),
        buildReward("hween_mask_red", "Red h'ween mask", 1, wikiIcon("H%27ween_mask_(red).png")),
        buildReward("hween_mask_blue", "Blue h'ween mask", 1, wikiIcon("H%27ween_mask_(blue).png")),
        buildReward("hween_mask_green", "Green h'ween mask", 1, wikiIcon("H%27ween_mask_(green).png")),
        buildReward("santa_hat", "Santa hat", 1, wikiIcon("Santa_hat.png")),
        buildReward("disk_of_returning", "Disk of returning", 1, wikiIcon("Disk_of_returning.png")),
        buildReward("easter_egg", "Easter egg", 1, wikiIcon("Easter_egg.png")),
        buildReward("pumpkin", "Pumpkin", 1, wikiIcon("Pumpkin.png")),
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
      if (!reward || !reward.id || !reward.name) return;
      const qty = Math.max(1, Number(reward.qty) || 1);
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
