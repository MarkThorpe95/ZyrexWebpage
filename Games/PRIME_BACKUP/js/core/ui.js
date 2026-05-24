(function () {
  // --- Level 99 Notification ---
  function showLevel99Notification(skillName) {
    const n = document.getElementById('level99-notification');
    if (!n) return;
    n.textContent = `Congratulations! you achieved level 99 in ${skillName}!`;
    n.style.display = 'block';
    // Dismiss on click
    n.onclick = function () {
      n.style.display = 'none';
    };
    // Optional: auto-hide after 10 seconds
    clearTimeout(n._hideTimer);
    n._hideTimer = setTimeout(() => { n.style.display = 'none'; }, 10000);
  }
  // Expose the helper globally so level 99 notifications work even if the callback is executed outside the local closure.
  window.showLevel99Notification = showLevel99Notification;
  // --- Notification fallback ---
  if (!window.showNotification) {
    window.showNotification = function(msg) {
      let n = document.getElementById('copilot-notification');
      if (!n) {
        n = document.createElement('div');
        n.id = 'copilot-notification';
        n.style.position = 'fixed';
        n.style.bottom = '32px';
        n.style.left = '50%';
        n.style.transform = 'translateX(-50%)';
        n.style.background = 'rgba(0,0,0,0.85)';
        n.style.color = '#fff';
        n.style.padding = '12px 32px';
        n.style.borderRadius = '8px';
        n.style.fontSize = '18px';
        n.style.zIndex = 9999;
        n.style.boxShadow = '0 2px 12px #0008';
        document.body.appendChild(n);
      }
      n.textContent = msg;
      n.style.display = 'block';
      clearTimeout(n._hideTimer);
      n._hideTimer = setTimeout(() => { n.style.display = 'none'; }, 3000);
    };
  }
  // --- SHOP LOGIC: Woodcutting Skillcape ---
  const SHOP_SKILLCAPES = [
    {
      id: 'woodcutting_cape',
      skill: 'Woodcutting',
      name: 'Woodcutting Skillcape',
      icon: 'https://oldschool.runescape.wiki/images/thumb/Woodcutting_cape_detail.png/32px-Woodcutting_cape_detail.png',
      price: 10000000, // 10m coins
      requiredLevel: 99,
      description: 'Double logs from Woodcutting.'
    }
  ];

  function renderShop(player) {
    const grid = document.getElementById('shop-grid');
    if (!grid) return;
    grid.innerHTML = '';

    // Always use window.Player for safety
    player = window.Player || player;
    if (!player || !player.skills) {
      grid.innerHTML = '<div style="color:red">ERROR: Player or skills not loaded.</div>';
      return;
    }

    SHOP_SKILLCAPES.forEach((cape) => {
      player._shopPurchased = player._shopPurchased || {};
      const skill = player.skills && player.skills[cape.skill];
      const purchased = !!player._shopPurchased[cape.id];
      // Only show if skill is 99+
      if (!skill || skill.level < cape.requiredLevel) return;

      const item = document.createElement('div');
      item.className = 'shop-item' + (purchased ? ' purchased trimmed' : '');

      // Icon
      const icon = document.createElement('img');
      icon.className = 'shop-item-icon';
      icon.src = cape.icon;
      icon.alt = cape.name;
      item.appendChild(icon);

      // Tooltip logic (copied from skills hover menu)
      item.addEventListener('mouseenter', function (e) {
        showShopTooltip(cape, e.clientX, e.clientY);
      });
      item.addEventListener('mousemove', function (e) {
        placeShopTooltip(getShopTooltipEl(), e.clientX, e.clientY);
      });
      item.addEventListener('mouseleave', function () {
        hideShopTooltip();
      });
// --- SHOP TOOLTIP (copied from skills hover logic) ---
let shopTooltipEl = null;
function getShopTooltipEl() {
  if (!shopTooltipEl) {
    shopTooltipEl = document.createElement('div');
    shopTooltipEl.className = 'shop-tooltip';
    document.body.appendChild(shopTooltipEl);
  }
  return shopTooltipEl;
}

function placeShopTooltip(tt, x, y) {
  const margin = 14;
  const w = tt.offsetWidth  || 210;
  const h = tt.offsetHeight || 60;
  let left = x + margin;
  let top  = y + margin;
  if (left + w > window.innerWidth  - 8) left = x - w - margin;
  if (top  + h > window.innerHeight - 8) top  = y - h - margin;
  tt.style.left = left + 'px';
  tt.style.top  = top  + 'px';
}

function showShopTooltip(cape, x, y) {
  const tt = getShopTooltipEl();
  tt.innerHTML = `<div class="stt-header">${cape.name}</div><div class="stt-divider"></div><div>${cape.description}</div>`;
  tt.style.display = 'block';
  placeShopTooltip(tt, x, y);
}

function hideShopTooltip() {
  getShopTooltipEl().style.display = 'none';
}

      // Name
      const name = document.createElement('div');
      name.className = 'shop-item-name';
      name.textContent = cape.name;
      item.appendChild(name);

      // Price
      const price = document.createElement('div');
      price.className = 'shop-item-price';
      price.textContent = '10,000,000 coins';
      item.appendChild(price);

      // Buy button
      const buyBtn = document.createElement('button');
      buyBtn.className = 'shop-item-buy';
      buyBtn.textContent = purchased ? 'Purchased' : 'Buy';
      buyBtn.disabled = purchased ? true : false;
      buyBtn.onclick = function (e) {
        e.stopPropagation();
        hideShopTooltip();
        // Calculate total currency (coins, platinum, divine)
        const slots = player.inventory.getSlots();
        const coins = slots.find(s => s && s.id === 'coins');
        const plat = slots.find(s => s && s.id === 'platinum_token');
        const divine = slots.find(s => s && s.id === 'divine_token');
        const coinsQty = coins ? coins.qty : 0;
        const platQty = plat ? plat.qty : 0;
        const divineQty = divine ? divine.qty : 0;
        // Conversion rates
        const COIN = 1;
        const PLAT = 1000;
        const DIVINE = 1_000_000_000;
        const totalValue = coinsQty * COIN + platQty * PLAT + divineQty * DIVINE;
        window.showNotification?.(
          `DEBUG: skill.level=${skill && skill.level}, purchased=${purchased}, coins=${coinsQty}, plat=${platQty}, divine=${divineQty}, totalValue=${totalValue}`
        );
        if (purchased) return;
        if (!skill || skill.level < cape.requiredLevel) {
          window.showNotification?.('You need 99+ in ' + cape.skill + ' to buy this!');
          return;
        }
        if (totalValue < cape.price) {
          window.showNotification?.('Not enough coins/tokens!');
          return;
        }
        // Deduct in order: coins, then platinum, then divine
        let remaining = cape.price;
        if (coins && coins.qty > 0) {
          const use = Math.min(coins.qty * COIN, remaining);
          const take = Math.floor(use / COIN);
          coins.qty -= take;
          remaining -= take * COIN;
        }
        if (remaining > 0 && plat && plat.qty > 0) {
          const use = Math.min(plat.qty * PLAT, remaining);
          const take = Math.floor(use / PLAT);
          plat.qty -= take;
          remaining -= take * PLAT;
        }
        if (remaining > 0 && divine && divine.qty > 0) {
          const use = Math.min(divine.qty * DIVINE, remaining);
          const take = Math.floor(use / DIVINE);
          divine.qty -= take;
          remaining -= take * DIVINE;
        }
        player._shopPurchased[cape.id] = true;
        window.showNotification?.('Purchased ' + cape.name + '!');
        renderShop(player);
        window.RSGame?.UI?.renderInventory?.(player);
      };
      item.appendChild(buyBtn);

      grid.appendChild(item);
    });
  }

  // --- SHOP TAB HANDLER ---
  function setupShopTab() {
    const shopTab = document.querySelector('.tab-btn[data-tab="shop"]');
    if (!shopTab) return;
    shopTab.addEventListener('click', () => {
      document.querySelectorAll('.panel').forEach(p => p.style.display = 'none');
      document.querySelector('.shop-panel').style.display = '';
      // Always use window.Player for shop
      renderShop(window.Player);
    });
  }
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setupShopTab();
  } else {
    document.addEventListener('DOMContentLoaded', setupShopTab);
  }

  // Expose for debugging
  window.RSGame = window.RSGame || {};
  window.RSGame.UI = window.RSGame.UI || {};
  window.RSGame.UI.renderShop = renderShop;

})();

// js/core/ui.js
window.RSGame = window.RSGame || {};

(function () {
  // Render the current skill being trained in the header box
  // (moved inside IIFE and below getSkillIcon to ensure it is in scope)
  async function renderCurrentSkillBox(player) {
    const box = document.getElementById("current-skill-box");
    if (!box) return;
    // Get current skill from SkillsSuite mod
    const suite = window.RSGame?.SkillsSuite;
    const activeAction = suite?.activeAction;
    let skillName = activeAction?.skillName || null;
    let skill = skillName ? player.skills[skillName] : null;
    box.innerHTML = "";
    if (!skillName || !skill) {
      // Idle
      const idle = document.createElement("span");
      idle.className = "csb-idle";
      idle.textContent = "Idle";
      box.appendChild(idle);
      return;
    }
    // Icon
    const iconUrl = await getSkillIcon(skillName);
    const img = document.createElement("img");
    img.className = "csb-icon";
    img.alt = skillName;
    if (iconUrl) img.src = iconUrl;
    box.appendChild(img);
    // Level
    const lvl = document.createElement("span");
    lvl.className = "csb-level";
    lvl.textContent = skill.level;
    box.appendChild(lvl);
    // Skill name
    const name = document.createElement("span");
    name.className = "csb-skillname";
    name.textContent = skillName;
    box.appendChild(name);
    // Tooltip events (reuse skills grid logic)
    box.onmouseenter = (e) => showSkillTooltip(skill, e.clientX, e.clientY);
    box.onmousemove = (e) => placeSkillTooltip(getSkillTooltipEl(), e.clientX, e.clientY);
    box.onmouseleave = () => hideSkillTooltip();
  }

  /* ---------------------------------------------------
     SKILL ICON MAPPING (confirmed working URLs)
  --------------------------------------------------- */

  const SKILL_ICON_MAP = {
    "Attack": "Attack_icon_(detail).png",
    "Strength": "Strength_icon_(detail).png",
    "Defence": "Defence_icon_(detail).png",
    "Hitpoints": "Hitpoints_icon_(detail).png",
    "Ranged": "Ranged_icon_(detail).png",
    "Prayer": "Prayer_icon_(detail).png",
    "Magic": "Magic_icon_(detail).png",
    "Runecraft": "Runecraft_icon_(detail).png",
    "Construction": "Construction_icon_(detail).png",
    "Agility": "Agility_icon_(detail).png",
    "Herblore": "Herblore_icon_(detail).png",
    "Thieving": "Thieving_icon_(detail).png",
    "Crafting": "Crafting_icon_(detail).png",
    "Fletching": "Fletching_icon_(detail).png",
    "Slayer": "Slayer_icon_(detail).png",
    "Hunter": "Hunter_icon_(detail).png",
    "Mining": "Mining_icon_(detail).png",
    "Smithing": "Smithing_icon_(detail).png",
    "Fishing": "Fishing_icon_(detail).png",
    "Cooking": "Cooking_icon_(detail).png",
    "Firemaking": "Firemaking_icon_(detail).png",
    "Woodcutting": "Woodcutting_icon_(detail).png",
    "Farming": "Farming_icon_(detail).png"
  };

  /* ---------------------------------------------------
     STATIC ICON LOADERS
  --------------------------------------------------- */

  // Skill icons use flat PNGs under /images/
  async function getSkillIcon(skillName) {
    const file = SKILL_ICON_MAP[skillName];
    if (!file) return null;
    return `https://oldschool.runescape.wiki/images/${file}`;
  }

  // Inventory tab icon (confirmed working)
  const INVENTORY_TAB_ICON =
    "https://oldschool.runescape.wiki/images/Inventory.png?d4795";

  // Skills tab icon uses the same source pattern as skill icons.
  const SKILLS_TAB_ICON =
    "https://oldschool.runescape.wiki/images/Attack_icon_(detail).png";

  // Equipment tab icon (confirmed working)
  const EQUIPMENT_TAB_ICON =
    "https://oldschool.runescape.wiki/images/Worn_Equipment.png?124cf";

  // Inventory slot frame (OSRS UI element)
  async function getInventorySlotFrame() {
    return "https://oldschool.runescape.wiki/images/thumb/Inventory_slot.png/64px-Inventory_slot.png";
  }

  // Item icons (OSRS items use /thumb/)
  function getItemIcon(file) {
    return `https://oldschool.runescape.wiki/images/thumb/${file}/32px-${file}`;
  }

  const OSRS_GE_MAPPING_URL = "https://prices.runescape.wiki/api/v1/osrs/mapping";
  const OSRSBOX_ITEM_URL = "https://raw.githubusercontent.com/osrsbox/osrsbox-db/master/docs/items-json/";
  let osrsItemMappingPromise = null;
  const equipmentBonusCache = new Map();
  const equipmentBonusPending = new Map();
  let draggedInventoryIndex = null;
  let statsRenderVersion = 0;

  function getDirectItemIcon(file) {
    return `https://oldschool.runescape.wiki/images/${file}`;
  }

  function formatCompactQty(value) {
    const n = Math.max(0, Number(value) || 0);
    if (n >= 1e9) return (n / 1e9).toFixed(1).replace(/\.0$/, "") + "b";
    if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, "") + "m";
    if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, "") + "k";
    return String(n);
  }

  function repairInventoryIcon(slot) {
    if (!slot || !slot.id) return slot?.icon || null;

    if (slot.id === "platinum_token") {
      return "https://oldschool.runescape.wiki/images/thumb/Platinum_token_detail.png/32px-Platinum_token_detail.png";
    }

    if (slot.id === "normal_log") {
      return getDirectItemIcon("Logs.png");
    }

    if (slot.id === "steel_arrow") {
      return getItemIcon("Steel_arrow_5.png");
    }
    if (slot.id === "adamant_arrow") {
      return getItemIcon("Adamant_arrow_5.png");
    }
    if (slot.id === "rune_arrow") {
      return getItemIcon("Rune_arrow_5.png");
    }

    if (String(slot.icon || "").includes("Steel_arrow.png")) {
      return getItemIcon("Steel_arrow_5.png");
    }
    if (String(slot.icon || "").includes("Adamant_arrow.png")) {
      return getItemIcon("Adamant_arrow_5.png");
    }
    if (String(slot.icon || "").includes("Rune_arrow.png")) {
      return getItemIcon("Rune_arrow_5.png");
    }

    if (slot.id === "clue_casket_easy") {
      return getItemIcon("Clue_scroll_(easy).png");
    }
    if (slot.id === "clue_casket_medium") {
      return getItemIcon("Clue_scroll_(medium).png");
    }
    if (slot.id === "clue_casket_hard") {
      return getItemIcon("Clue_scroll_(hard).png");
    }
    if (slot.id === "clue_casket_elite") {
      return getItemIcon("Clue_scroll_(elite).png");
    }
    if (slot.id === "clue_casket_master") {
      return getItemIcon("Clue_scroll_(master).png");
    }

    return slot.icon || null;
  }

  function getZeroedBonuses() {
    return {
      "Melee Strength": 0,
      "Ranged Strength": 0,
      "Magic Damage": 0,
      "Stab": 0,
      "Slash": 0,
      "Crush": 0,
      "Ranged": 0,
      "Magic": 0,
      "Stab Defence": 0,
      "Slash Defence": 0,
      "Crush Defence": 0,
      "Ranged Defence": 0,
      "Magic Defence": 0,
      "Prayer": 0
    };
  }

  function toWikiLookupName(itemName) {
    return String(itemName || "")
      .replace(/\s*\(noted\)\s*$/i, "")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
  }

  async function getOsrsItemMappingByName() {
    if (!osrsItemMappingPromise) {
      osrsItemMappingPromise = fetch(OSRS_GE_MAPPING_URL)
        .then((res) => (res.ok ? res.json() : []))
        .then((rows) => {
          const byName = new Map();
          (Array.isArray(rows) ? rows : []).forEach((row) => {
            const key = toWikiLookupName(row?.name);
            if (!key || byName.has(key)) return;
            byName.set(key, Number(row.id) || null);
          });
          return byName;
        })
        .catch(() => new Map());
    }
    return osrsItemMappingPromise;
  }

  function convertOsrsboxEquipment(equipment) {
    if (!equipment || typeof equipment !== "object") return null;
    return {
      "Stab": Number(equipment.attack_stab) || 0,
      "Slash": Number(equipment.attack_slash) || 0,
      "Crush": Number(equipment.attack_crush) || 0,
      "Ranged": Number(equipment.attack_ranged) || 0,
      "Magic": Number(equipment.attack_magic) || 0,
      "Stab Defence": Number(equipment.defence_stab) || 0,
      "Slash Defence": Number(equipment.defence_slash) || 0,
      "Crush Defence": Number(equipment.defence_crush) || 0,
      "Ranged Defence": Number(equipment.defence_ranged) || 0,
      "Magic Defence": Number(equipment.defence_magic) || 0,
      "Melee Strength": Number(equipment.melee_strength) || 0,
      "Ranged Strength": Number(equipment.ranged_strength) || 0,
      "Magic Damage": Number(equipment.magic_damage) || 0,
      "Prayer": Number(equipment.prayer) || 0
    };
  }

  async function getEquipmentBonuses(item) {
    if (!item || !item.name) return getZeroedBonuses();

    // If item already has bonuses in the right format, return them immediately
    if (item.bonuses && typeof item.bonuses === "object" && item.bonuses.Stab !== undefined) {
      return item.bonuses;
    }

    const cacheKey = toWikiLookupName(item.name);
    if (!cacheKey) return item.bonuses || getZeroedBonuses();
    if (equipmentBonusCache.has(cacheKey)) {
      const cached = equipmentBonusCache.get(cacheKey);
      if (!item.bonuses) item.bonuses = cached;
      return cached;
    }
    if (equipmentBonusPending.has(cacheKey)) return equipmentBonusPending.get(cacheKey);

    const pending = (async () => {
      const fallback = item.bonuses || getZeroedBonuses();
      try {
        const byName = await getOsrsItemMappingByName();
        const itemId = byName.get(cacheKey);
        if (!itemId) {
          equipmentBonusCache.set(cacheKey, fallback);
          return fallback;
        }

        const res = await fetch(`${OSRSBOX_ITEM_URL}${itemId}.json`);
        if (!res.ok) {
          equipmentBonusCache.set(cacheKey, fallback);
          return fallback;
        }

        const data = await res.json();
        const parsed = convertOsrsboxEquipment(data?.equipment) || fallback;
        equipmentBonusCache.set(cacheKey, parsed);
        item.bonuses = parsed;
        return parsed;
      } catch {
        equipmentBonusCache.set(cacheKey, fallback);
        if (!item.bonuses) item.bonuses = fallback;
        return fallback;
      } finally {
        equipmentBonusPending.delete(cacheKey);
      }
    })();

    equipmentBonusPending.set(cacheKey, pending);
    return pending;
  }

  async function applyInventorySlotFrame() {
    const url = await getInventorySlotFrame();
    document.documentElement.style.setProperty("--inv-slot-frame", `url(${url})`);
  }

  /* ---------------------------------------------------
     RENDER FUNCTIONS
  --------------------------------------------------- */

  function renderPlayerSummary(player) {
    const el = document.getElementById("player-summary");
    if (el) el.textContent = `${player.name} – Total level: ${player.totalLevel}`;
    renderCurrentSkillBox(player);
  }

  /* ---------------------------------------------------
     OSRS SKILL ORDER (3-column canonical layout)
  --------------------------------------------------- */

  const OSRS_SKILL_ORDER = [
    "Attack",      "Hitpoints",  "Mining",
    "Strength",    "Agility",    "Smithing",
    "Defence",     "Herblore",   "Fishing",
    "Ranged",      "Thieving",   "Cooking",
    "Prayer",      "Crafting",   "Firemaking",
    "Magic",       "Fletching",  "Woodcutting",
    "Runecraft",   "Slayer",     "Farming",
    "Construction","Hunter"
  ];

  /* ---------------------------------------------------
     SKILL TOOLTIP
  --------------------------------------------------- */

  let skillTooltipEl = null;
  let activeTooltipSkill = null;
  let activeTooltipPosition = { x: 0, y: 0 };

  function getSkillTooltipEl() {
    if (!skillTooltipEl) {
      skillTooltipEl = document.createElement("div");
      skillTooltipEl.className = "skill-tooltip";
      document.body.appendChild(skillTooltipEl);
    }
    return skillTooltipEl;
  }

  function refreshSkillTooltip() {
    const tt = getSkillTooltipEl();
    if (!activeTooltipSkill || tt.style.display === "none") return;
    showSkillTooltip(activeTooltipSkill, activeTooltipPosition.x, activeTooltipPosition.y);
  }

  function placeSkillTooltip(tt, x, y) {
    activeTooltipPosition = { x, y };
    const margin = 14;
    const w = tt.offsetWidth  || 210;
    const h = tt.offsetHeight || 120;
    let left = x + margin;
    let top  = y + margin;
    if (left + w > window.innerWidth  - 8) left = x - w - margin;
    if (top  + h > window.innerHeight - 8) top  = y - h - margin;
    tt.style.left = left + "px";
    tt.style.top  = top  + "px";
  }

  function showSkillTooltip(skill, x, y) {
    activeTooltipSkill = skill;
    activeTooltipPosition = { x, y };
    const tt         = getSkillTooltipEl();
    const xpInLevel  = skill.xp       || 0;
    const totalXp    = skill.totalXp  || xpInLevel;
    const xpNeeded   = typeof skill.xpForNextLevel  === "function" ? skill.xpForNextLevel()  : 100;
    const pct        = typeof skill.progressPercent === "function" ? skill.progressPercent() : (xpInLevel / xpNeeded * 100);
    const xpRemaining = Math.max(0, xpNeeded - xpInLevel);
    const isMaxed    = skill.level >= 99;

    const progressRows = isMaxed
      ? `<div class="stt-maxed">✦ MAXED</div>`
      : `<div class="stt-row"><span>Next level in</span><span class="stt-val">${Math.ceil(xpRemaining).toLocaleString()} XP</span></div>
         <div class="stt-progress-wrap"><div class="stt-progress-fill" style="width:${pct.toFixed(1)}%"></div></div>
         <div class="stt-pct">${pct.toFixed(1)}%</div>`;

    tt.innerHTML = `
      <div class="stt-header">${skill.name}</div>
      <div class="stt-divider"></div>
      <div class="stt-row"><span>Level</span><span class="stt-val">${skill.level}</span></div>
      <div class="stt-row"><span>Total XP</span><span class="stt-val">${Math.floor(totalXp).toLocaleString()}</span></div>
      <div class="stt-row"><span>XP this level</span><span class="stt-val">${Math.floor(xpInLevel).toLocaleString()} / ${xpNeeded.toLocaleString()}</span></div>
      ${progressRows}
    `;
    tt.style.display = "block";
    placeSkillTooltip(tt, x, y);
  }

  function hideSkillTooltip() {
    activeTooltipSkill = null;
    getSkillTooltipEl().style.display = "none";
  }

  const TOP_LEVEL_TAB_ORDER = [
    "inventory",
    "bank",
    "skills",
    "equipment",
    "stats",
    "minigames",
    "duel-arena",
    "drop-party",
    "slayer",
    "combat",
    "zones",
    "gathering",
    "ge",
    "pets"
  ];

  function orderTopLevelTabs() {
    const tabBar = document.getElementById("tab-bar");
    if (!tabBar) return;

    const currentTabs = Array.from(tabBar.querySelectorAll(".tab-btn"));
    if (!currentTabs.length) return;

    const tabsByName = new Map(currentTabs.map((tab) => [String(tab.dataset.tab || ""), tab]));
    const orderedTabs = [];

    TOP_LEVEL_TAB_ORDER.forEach((tabName) => {
      const tab = tabsByName.get(tabName);
      if (tab) orderedTabs.push(tab);
    });

    currentTabs.forEach((tab) => {
      if (!orderedTabs.includes(tab)) orderedTabs.push(tab);
    });

    orderedTabs.forEach((tab) => tabBar.appendChild(tab));
  }

  /* ---------------------------------------------------
     RENDER SKILLS
  --------------------------------------------------- */

  async function renderSkills(player) {
    const container = document.getElementById("skills-grid");
    container.innerHTML = "";

    for (const skillName of OSRS_SKILL_ORDER) {
      const skill = player.skills[skillName];

      const cell = document.createElement("div");
      cell.className = "skill-cell";
      cell.dataset.skillName = skillName;

      const img = document.createElement("img");
      img.alt = skillName;
      const iconUrl = await getSkillIcon(skillName);
      if (iconUrl) img.src = iconUrl;
      cell.appendChild(img);

      const lvlSpan = document.createElement("span");
      lvlSpan.className = "skill-cell-levels";
      lvlSpan.textContent = skill ? `${skill.level} / ${skill.level}` : "1 / 1";
      cell.appendChild(lvlSpan);

      if (skill) {
        cell.addEventListener("mouseenter", (e) => showSkillTooltip(skill, e.clientX, e.clientY));
        cell.addEventListener("mousemove",  (e) => placeSkillTooltip(getSkillTooltipEl(), e.clientX, e.clientY));
        cell.addEventListener("mouseleave", ()    => hideSkillTooltip());
        cell.addEventListener("click", () => {
          RSGame.Events?.emit?.("skillMenuSelect", { skill: skillName, player });
        });
      }

      container.appendChild(cell);
    }

    // Total level cell
    const total = OSRS_SKILL_ORDER.reduce((sum, name) => sum + (player.skills[name]?.level || 1), 0);
    const totalCell = document.createElement("div");
    totalCell.className = "skill-cell skill-cell-total";
    totalCell.innerHTML = `<span class="sct-label">Total Level</span><span class="sct-value">${total}</span>`;
    container.appendChild(totalCell);
  }

  function renderInventory(player) {
    const container = document.getElementById("inventory-grid");
    container.innerHTML = "";

    player.inventory?.enrichCurrentSlots?.();
    player.inventory?.pruneItemIntel?.();

    player.inventory.getSlots().forEach((slot, index) => {
      const el = document.createElement("div");
      el.className = "inventory-slot";
      el.dataset.slotIndex = String(index);
      el.draggable = true;

      el.addEventListener("dragstart", (e) => {
        draggedInventoryIndex = index;
        el.classList.add("dragging");
        if (e.dataTransfer) {
          e.dataTransfer.effectAllowed = "move";
          e.dataTransfer.setData("text/plain", String(index));
        }
      });

      el.addEventListener("dragend", () => {
        draggedInventoryIndex = null;
        el.classList.remove("dragging");
        container.querySelectorAll(".inventory-slot.drag-over").forEach((n) => n.classList.remove("drag-over"));
      });

      el.addEventListener("dragover", (e) => {
        if (draggedInventoryIndex === null) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        el.classList.add("drag-over");
      });

      el.addEventListener("dragleave", () => {
        el.classList.remove("drag-over");
      });

      el.addEventListener("drop", (e) => {
        if (draggedInventoryIndex === null) return;
        e.preventDefault();
        el.classList.remove("drag-over");

        const toIndex = Number(el.dataset.slotIndex);
        const fromIndex = Number(draggedInventoryIndex);
        if (!Number.isInteger(fromIndex) || !Number.isInteger(toIndex) || fromIndex === toIndex) return;

        const moved = player.inventory?.swapSlots?.(fromIndex, toIndex);
        if (!moved) return;

        renderInventory(player);
        RSGame.Game?.saveNow?.();
      });

      el.addEventListener("click", () => {
        if (!slot || slot.itemType !== "Equipment" || !slot.slot) return;
        const slotName = String(slot.slot).toLowerCase();
        if (!player.equipment.slots.hasOwnProperty(slotName)) return;

        const requirements = slot.requirements || null;
        if (requirements) {
          const unmet = Object.entries(requirements).filter(([skillName, requiredLevel]) => {
            const currentLevel = Number(player?.skills?.[skillName]?.level || 0);
            return currentLevel < Number(requiredLevel || 0);
          });
          if (unmet.length) {
            const message = unmet.map(([skillName, requiredLevel]) => `${skillName} ${requiredLevel}`).join(", ");
            window.showNotification?.(`Requires ${message} to equip ${slot.name || "this item"}.`);
            return;
          }
        }

        // Unequip current if any
        const current = player.equipment.get(slotName);
        if (current) {
          player.equipment.equip(slotName, null);
          player.inventory.addItem(current);
        }

        // Equip new
        player.equipment.equip(slotName, slot);
        player.inventory.getSlots()[index] = null;

        renderInventory(player);
        renderEquipment(player);
        RSGame.Events?.emit?.("equipmentChanged", { player });
        RSGame.Game?.saveNow?.();
      });

      if (slot && slot.icon) {
        el.dataset.itemId = String(slot.id || "");
        el.dataset.itemName = String(slot.name || "");
        el.dataset.itemQty = String(Number(slot.qty) || 0);
        el.dataset.itemNoted = slot.noted ? "1" : "0";

        const img = document.createElement("img");
        slot.icon = repairInventoryIcon(slot);
        img.src = slot.icon;
        img.alt = slot.name;
        if (slot.id === "divine_token") img.classList.add("divine-glow");
        img.onerror = () => {
          if (slot.id === "platinum_token") {
            img.onerror = null;
            slot.icon = "https://oldschool.runescape.wiki/images/thumb/Platinum_token_detail.png/32px-Platinum_token_detail.png";
            img.src = slot.icon;
            return;
          }

          if (slot.id === "normal_log") {
            img.onerror = null;
            slot.icon = getItemIcon("Logs.png");
            img.src = slot.icon;
            return;
          }

          if (slot.id === "steel_arrow") {
            img.onerror = null;
            slot.icon = getItemIcon("Steel_arrow_5.png");
            img.src = slot.icon;
            return;
          }
          if (slot.id === "adamant_arrow") {
            img.onerror = null;
            slot.icon = getItemIcon("Adamant_arrow_5.png");
            img.src = slot.icon;
            return;
          }
          if (slot.id === "rune_arrow") {
            img.onerror = null;
            slot.icon = getItemIcon("Rune_arrow_5.png");
            img.src = slot.icon;
            return;
          }

          if (String(slot.id || "").startsWith("clue_casket_")) {
            img.onerror = null;
            slot.icon = repairInventoryIcon(slot);
            img.src = slot.icon;
          }
        };
        el.appendChild(img);

        if (slot.noted) {
          const noteTag = document.createElement("span");
          noteTag.className = "item-noted-badge";
          noteTag.textContent = "N";
          el.appendChild(noteTag);
        }
      }

      if (slot) {
        // Always show quantity for Divine tokens, coins, and platinum tokens
        const alwaysShowQty = slot.id === "divine_token" || slot.id === "platinum_token" || slot.id === "coins";
        if (alwaysShowQty || slot.qty > 1) {
          const qty = document.createElement("span");
          qty.className = "item-qty";
          qty.textContent = formatCompactQty(slot.qty);
          el.appendChild(qty);
        }
      }

      container.appendChild(el);
    });

    RSGame.Events?.emit?.("inventoryRendered", { player });
  }

  let equipCtxMenu = null;

  function buildEquipContextMenu() {
    if (document.getElementById("equip-ctx-menu")) return;
    const el = document.createElement("ul");
    el.id = "equip-ctx-menu";
    el.className = "osrs-ctx-menu";
    el.style.display = "none";
    document.body.appendChild(el);
    equipCtxMenu = el;
    document.addEventListener("click", () => hideEquipCtxMenu(), { capture: true });
    document.addEventListener("contextmenu", (e) => {
      if (!el.contains(e.target)) hideEquipCtxMenu();
    }, { capture: true });
  }

  function hideEquipCtxMenu() {
    if (equipCtxMenu) equipCtxMenu.style.display = "none";
  }

  function showEquipContextMenu(x, y, items) {
    if (!equipCtxMenu) return;
    equipCtxMenu.innerHTML = "";
    items.forEach(({ label, action }) => {
      const li = document.createElement("li");
      li.textContent = label;
      li.addEventListener("mousedown", (e) => {
        e.preventDefault();
        e.stopPropagation();
        hideEquipCtxMenu();
        action();
      });
      equipCtxMenu.appendChild(li);
    });
    equipCtxMenu.style.display = "block";
    equipCtxMenu.style.left = "0";
    equipCtxMenu.style.top = "0";
    const rect = equipCtxMenu.getBoundingClientRect();
    const vw = window.innerWidth, vh = window.innerHeight;
    equipCtxMenu.style.left = Math.min(x, vw - rect.width - 4) + "px";
    equipCtxMenu.style.top = Math.min(y, vh - rect.height - 4) + "px";
  }

  function renderEquipment(player) {
    const grid = document.getElementById("equipment-grid");
    buildEquipContextMenu();

    function notify(message) {
      window.alert(message);
    }

    function tryUnequipToInventoryOrBank(slotName, equippedItem) {
      if (!equippedItem) return;

      player.equipment.equip(slotName, null);
      const addedToInventory = player.inventory.addItem({ ...equippedItem, qty: 1 });

      if (!addedToInventory) {
        const bankApi = RSGame.Bank;
        bankApi?.ensureBankState?.(player);
        const canBank = !!(player.bank?.items && player.bank.items[equippedItem.id]);

        if (canBank) {
          const bankEntry = player.bank.items[equippedItem.id];
          bankEntry.qty = (Number(bankEntry.qty) || 0) + 1;
          bankEntry.discovered = true;
          bankEntry.name = bankEntry.name || equippedItem.name;
          bankEntry.icon = bankEntry.icon || equippedItem.icon;
          bankApi.syncDiscoveredItems?.(player);
          bankApi.refresh?.();
          notify(equippedItem.name + " sent to bank because inventory is full.");
        } else {
          player.equipment.equip(slotName, equippedItem);
          notify("Inventory is full.");
          return;
        }
      }

      renderEquipment(player);
      renderStats(player);
      RSGame.UI.renderInventory(player);
      RSGame.Game?.saveNow?.();
    }

    grid.querySelectorAll(".equip-slot").forEach((slotEl) => {
      slotEl.innerHTML = "";
      const slotName = slotEl.dataset.slot;
      const item = player.equipment.get(slotName);

      if (item && item.icon) {
        const img = document.createElement("img");
        img.src = item.icon;
        img.alt = item.name;
        slotEl.appendChild(img);

        // Left-click unequip
        slotEl.addEventListener("click", () => {
          tryUnequipToInventoryOrBank(slotName, item);
        });

        // Right-click unequip
        slotEl.addEventListener("contextmenu", (e) => {
          e.preventDefault();
          const items = [{ label: "Remove", action: () => {
            tryUnequipToInventoryOrBank(slotName, item);
          }}];
          showEquipContextMenu(e.clientX, e.clientY, items);
        });
      }
    });
  }


  function renderStats(player) {
    // Render stats in the new equipment tab location
    const display = document.getElementById("equipment-stats-display");
    if (!display) return;
    const eq = player.equipment;

    const renderVersion = ++statsRenderVersion;
    const equipped = Object.values(eq?.slots || {}).filter(Boolean);

    Promise.all(equipped.map((item) => getEquipmentBonuses(item))).then((bonusSets) => {
      if (renderVersion !== statsRenderVersion) return;

      const stats = getZeroedBonuses();
      bonusSets.forEach((bonuses) => {
        Object.keys(stats).forEach((key) => {
          stats[key] += Number(bonuses?.[key]) || 0;
        });
      });

      let html = '<div class="stats-grid">';
      html += '<div class="stats-section"><h3>Offensive Bonuses</h3>';
      html += `<div class="stat-row"><span>Stab:</span> <span class="stat-value">${stats["Stab"] > 0 ? '+' : ''}${stats["Stab"]}</span></div>`;
      html += `<div class="stat-row"><span>Slash:</span> <span class="stat-value">${stats["Slash"] > 0 ? '+' : ''}${stats["Slash"]}</span></div>`;
      html += `<div class="stat-row"><span>Crush:</span> <span class="stat-value">${stats["Crush"] > 0 ? '+' : ''}${stats["Crush"]}</span></div>`;
      html += `<div class="stat-row"><span>Ranged:</span> <span class="stat-value">${stats["Ranged"] > 0 ? '+' : ''}${stats["Ranged"]}</span></div>`;
      html += `<div class="stat-row"><span>Magic:</span> <span class="stat-value">${stats["Magic"] > 0 ? '+' : ''}${stats["Magic"]}</span></div>`;
      html += `<div class="stat-row"><span>Melee Strength:</span> <span class="stat-value">${stats["Melee Strength"] > 0 ? '+' : ''}${stats["Melee Strength"]}</span></div>`;
      html += `<div class="stat-row"><span>Ranged Strength:</span> <span class="stat-value">${stats["Ranged Strength"] > 0 ? '+' : ''}${stats["Ranged Strength"]}</span></div>`;
      html += `<div class="stat-row"><span>Magic Damage:</span> <span class="stat-value">${stats["Magic Damage"] > 0 ? '+' : ''}${stats["Magic Damage"]}%</span></div>`;
      html += '</div>';

      html += '<div class="stats-section"><h3>Defensive Bonuses</h3>';
      html += `<div class="stat-row"><span>Stab Defence:</span> <span class="stat-value">${stats["Stab Defence"] > 0 ? '+' : ''}${stats["Stab Defence"]}</span></div>`;
      html += `<div class="stat-row"><span>Slash Defence:</span> <span class="stat-value">${stats["Slash Defence"] > 0 ? '+' : ''}${stats["Slash Defence"]}</span></div>`;
      html += `<div class="stat-row"><span>Crush Defence:</span> <span class="stat-value">${stats["Crush Defence"] > 0 ? '+' : ''}${stats["Crush Defence"]}</span></div>`;
      html += `<div class="stat-row"><span>Ranged Defence:</span> <span class="stat-value">${stats["Ranged Defence"] > 0 ? '+' : ''}${stats["Ranged Defence"]}</span></div>`;
      html += `<div class="stat-row"><span>Magic Defence:</span> <span class="stat-value">${stats["Magic Defence"] > 0 ? '+' : ''}${stats["Magic Defence"]}</span></div>`;
      html += '</div>';

      html += '<div class="stats-section"><h3>Other</h3>';
      html += `<div class="stat-row"><span>Prayer:</span> <span class="stat-value">${stats["Prayer"] > 0 ? '+' : ''}${stats["Prayer"]}</span></div>`;
      html += '</div>';
      html += '</div>';

      display.innerHTML = html;
    });
  }

  /* ---------------------------------------------------
     TOOLTIP SYSTEM
  --------------------------------------------------- */

  let tooltipEl = null;

  function showTooltip(text) {
    if (!tooltipEl) {
      tooltipEl = document.createElement("div");
      tooltipEl.className = "tooltip";
      document.body.appendChild(tooltipEl);
    }
    tooltipEl.textContent = text;
    tooltipEl.style.display = "block";
    document.addEventListener("mousemove", moveTooltip);
  }

  function hideTooltip() {
    if (tooltipEl) tooltipEl.style.display = "none";
    document.removeEventListener("mousemove", moveTooltip);
  }

  function moveTooltip(e) {
    tooltipEl.style.left = e.pageX + 12 + "px";
    tooltipEl.style.top = e.pageY + 12 + "px";
  }

  /* ---------------------------------------------------
     TABS
  --------------------------------------------------- */

function initTabs() {
  orderTopLevelTabs();

  const tabs = document.querySelectorAll(".tab-btn");

  // Collect ALL panels dynamically — prefer data-panel attribute, fall back to class name
  const panels = {};
  document.querySelectorAll(".panel").forEach(panel => {
    let name = panel.dataset.panel;
    if (!name) {
      const cls = panel.classList[1];
      if (cls) name = cls.replace(/-panel$/, "");
    }
    if (name) panels[name] = panel;
  });

  // Patch icons for inventory/equipment
  const invTab = document.querySelector('.tab-btn[data-tab="inventory"] img');
  if (invTab) invTab.src = INVENTORY_TAB_ICON;

  const skillsTab = document.querySelector('.tab-btn[data-tab="skills"] img');
  if (skillsTab) {
    skillsTab.src = SKILLS_TAB_ICON;
  }

  const eqTab = document.querySelector('.tab-btn[data-tab="equipment"] img');
  if (eqTab) eqTab.src = EQUIPMENT_TAB_ICON;

  function setTab(tabName) {
    Object.values(panels).forEach(panel => {
      panel.style.display = "none";
    });

    if (panels[tabName]) {
      panels[tabName].style.display = "block";
    }
  }

  // Attach click handlers to ALL tabs (including mod-added)
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      setTab(tab.dataset.tab);
    });
  });

  // Default tab
  const defaultTab = document.querySelector('.tab-btn[data-tab="skills"]');
  if (defaultTab) {
    setTab("skills");
  }
}



  /* ---------------------------------------------------
     EXPORT
  --------------------------------------------------- */

  RSGame.UI = {
    renderPlayerSummary,
    renderSkills,
    renderInventory,
    renderEquipment,
    renderStats,
    renderCurrentSkillBox,
    initTabs,
    applyInventorySlotFrame,
    getItemIcon,
    repairInventoryIcon
  };
  // Listen for skill/action events to update the skill box and live skill tooltip
  if (window.RSGame?.Events) {
    RSGame.Events.on("xpGain", () => {
      RSGame.UI.renderCurrentSkillBox(window.Player);
      refreshSkillTooltip();
    });
    RSGame.Events.on("skillMenuSelect", () => RSGame.UI.renderCurrentSkillBox(window.Player));
    RSGame.Events.on("gatheringSelectSkill", () => RSGame.UI.renderCurrentSkillBox(window.Player));
    RSGame.Events.on("zoneActivityStart", () => RSGame.UI.renderCurrentSkillBox(window.Player));
    RSGame.Events.on("zoneLeave", () => RSGame.UI.renderCurrentSkillBox(window.Player));

    // Listen for level 99 achievement event
    RSGame.Events.on("level99Achieved", (data) => {
      if (data && data.skillName) {
        if (typeof showLevel99Notification === "function") {
          showLevel99Notification(data.skillName);
        } else if (typeof window.showLevel99Notification === "function") {
          window.showLevel99Notification(data.skillName);
        }
      }
    });
  }

})();

