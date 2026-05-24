// ...existing code...

// ...existing code...

// ...existing code...

let currentEnemy = null;
let districts = {};
let districtsCleared = 0;
let healingItems = 0;
let combatLoopId = null;
let gameSpeed = 1;
let currentProfileName = null;
const PROFILE_CACHE_NAME = "kpopGameProfileCache";
const PROFILE_INDEX_URL = "/profiles/index.json";
const PROFILE_CURRENT_URL = "/profiles/current.json";

async function openProfileCache() {
    if (!window.caches) return null;
    try {
        return await caches.open(PROFILE_CACHE_NAME);
    } catch (e) {
        return null;
    }
}

async function readCacheJSON(url) {
    const cache = await openProfileCache();
    if (!cache) return null;
    const response = await cache.match(url);
    if (!response) return null;
    try {
        return await response.json();
    } catch (e) {
        return null;
    }
}

async function writeCacheJSON(url, data) {
    const cache = await openProfileCache();
    if (!cache) return false;
    const response = new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' }
    });
    await cache.put(url, response);
    return true;
}

async function deleteCacheEntry(url) {
    const cache = await openProfileCache();
    if (!cache) return false;
    return cache.delete(url);
}

async function getSavedProfiles() {
    const data = await readCacheJSON(PROFILE_INDEX_URL);
    return data || {};
}

async function saveProfiles(profiles) {
    await writeCacheJSON(PROFILE_INDEX_URL, profiles);
}

async function getCurrentProfileName() {
    const data = await readCacheJSON(PROFILE_CURRENT_URL);
    return data?.name || null;
}

async function setCurrentProfileName(name) {
    currentProfileName = name || null;
    if (currentProfileName) {
        await writeCacheJSON(PROFILE_CURRENT_URL, { name: currentProfileName });
    } else {
        await deleteCacheEntry(PROFILE_CURRENT_URL);
    }
    const label = $("current-profile-name");
    if (label) label.textContent = currentProfileName || "None";
    const saveButton = $("save-profile-btn");
    if (saveButton) {
        saveButton.classList.remove("hidden");
        saveButton.disabled = !currentProfileName;
        saveButton.title = currentProfileName ? `Save to "${currentProfileName}"` : "No profile selected";
    }
    await populateProfileSelect();
}

async function populateProfileSelect() {
    const select = $("profile-select");
    if (!select) return;
    const profiles = await getSavedProfiles();
    const current = currentProfileName || await getCurrentProfileName() || "";
    let html = `<option value="">Select profile</option>`;
    Object.keys(profiles).forEach(name => {
        html += `<option value="${name}" ${name === current ? 'selected' : ''}>${name}</option>`;
    });
    select.innerHTML = html;
    if (current && profiles[current]) {
        currentProfileName = current;
    }
}

async function createProfile(name) {
    if (!name || !name.trim()) {
        addToCombatLog("Enter a valid profile name.");
        return false;
    }
    if (!player.name) {
        addToCombatLog("Select a hunter before creating a profile.");
        return false;
    }
    const profiles = await getSavedProfiles();
    if (profiles[name]) {
        addToCombatLog("A profile with that name already exists.");
        return false;
    }
    currentProfileName = name;
    await saveCurrentProfile(false);
    await setCurrentProfileName(name);
    addToCombatLog(`Profile '${name}' created.`);
    return true;
}

async function saveCurrentProfile(showMessage = true) {
    const profileName = currentProfileName || $("profile-select")?.value;
    if (!profileName) {
        if (showMessage) addToCombatLog("Select or create a profile first.");
        return false;
    }
    const profiles = await getSavedProfiles();
    profiles[profileName] = {
        player,
        weapon,
        districts,
        healingItems,
        demonDrops,
        cookingInventory
    };
    await saveProfiles(profiles);
    await setCurrentProfileName(profileName);
    if (showMessage) addToCombatLog(`Profile '${profileName}' saved.`);
    return true;
}

function populateDevInventory() {
    const list = $("dev-inventory-list");
    if (!list) return;
    list.innerHTML = "";
    const allItems = { ...demonDrops, ...cookingInventory };
    Object.keys(allItems).forEach(key => {
        const row = document.createElement("div");
        row.className = "dev-inventory-item";
        const label = document.createElement("label");
        label.textContent = key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
        const input = document.createElement("input");
        input.type = "number";
        input.min = "0";
        input.value = allItems[key];
        input.dataset.key = key;
        row.appendChild(label);
        row.appendChild(input);
        list.appendChild(row);
    });
}

function refreshDevMenu() {
    $("dev-level").value = player.level;
    $("dev-xp").value = player.xp;
    $("dev-maxhp").value = player.maxHp;
    $("dev-hp").value = player.hp;
    $("dev-souls").value = player.souls;
    $("dev-prestige").value = player.prestige;
    $("dev-derpyfur").value = player.derpyFur;
    $("dev-perk-godmode").checked = !!player.godMode;
    $("dev-perk-infinite-souls").checked = !!player.infiniteSouls;
    $("dev-perk-max-weapon").checked = !!player.maxWeapon;
    $("dev-bonus-souls").value = 1000;
    populateDevInventory();
}

let devDragOffset = { x: 0, y: 0 };
let devDragging = false;
let devDragMoved = false;
let devCollapsed = false;

function openDevMenu() {
    const modal = $("dev-menu-modal");
    if (!modal) return;
    modal.classList.remove("hidden");
    if (devCollapsed) modal.classList.add("collapsed");
    refreshDevMenu();
}

function closeDevMenu() {
    const modal = $("dev-menu-modal");
    if (!modal) return;
    modal.classList.add("hidden");
}

function toggleDevMenuCollapse() {
    const modal = $("dev-menu-modal");
    if (!modal) return;
    const headerTitle = $("dev-menu-header")?.querySelector('div');
    devCollapsed = !devCollapsed;
    modal.classList.toggle("collapsed", devCollapsed);
    const button = $("dev-collapse-btn");
    if (button) button.textContent = devCollapsed ? "Expand" : "Minimize";
    if (headerTitle) headerTitle.textContent = devCollapsed ? "Dev Menu" : "Developer Console";
}

function startDevDrag(e) {
    if (e.target.closest('.dev-menu-actions')) return;
    const modal = $("dev-menu-modal");
    if (!modal) return;
    devDragging = true;
    devDragMoved = false;
    const rect = modal.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    devDragOffset.x = clientX - rect.left;
    devDragOffset.y = clientY - rect.top;
    e.preventDefault();
}

function stopDevDrag() {
    devDragging = false;
    setTimeout(() => { devDragMoved = false; }, 0);
}

function moveDevDrag(e) {
    if (!devDragging) return;
    devDragMoved = true;
    const modal = $("dev-menu-modal");
    if (!modal) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const left = Math.max(0, Math.min(window.innerWidth - modal.offsetWidth, clientX - devDragOffset.x));
    const top  = Math.max(0, Math.min(window.innerHeight - modal.offsetHeight, clientY - devDragOffset.y));
    modal.style.left = `${left}px`;
    modal.style.top  = `${top}px`;
}

function applyDevStats() {
    player.level = Math.max(1, parseInt($("dev-level").value, 10) || player.level);
    player.xp = Math.max(0, parseInt($("dev-xp").value, 10) || player.xp);
    player.maxHp = Math.max(1, parseInt($("dev-maxhp").value, 10) || player.maxHp);
    player.hp = Math.min(player.maxHp, Math.max(0, parseInt($("dev-hp").value, 10) || player.hp));
    player.souls = Math.max(0, parseInt($("dev-souls").value, 10) || player.souls);
    player.prestige = Math.max(0, parseInt($("dev-prestige").value, 10) || player.prestige);
    player.derpyFur = Math.max(0, parseInt($("dev-derpyfur").value, 10) || player.derpyFur);
    levelCheck();
    updatePlayerUI();
    addToCombatLog("Developer stats applied.");
}

function applyDevInventory() {
    document.querySelectorAll(".dev-inventory-item input").forEach(input => {
        const key = input.dataset.key;
        const value = Math.max(0, parseInt(input.value, 10) || 0);
        if (key in demonDrops) {
            demonDrops[key] = value;
        } else if (key in cookingInventory) {
            cookingInventory[key] = value;
        }
    });
    renderCookingInventory();
    addToCombatLog("Developer inventory updated.");
}

function applyDevPerks() {
    player.godMode = $("dev-perk-godmode").checked;
    player.infiniteSouls = $("dev-perk-infinite-souls").checked;
    player.maxWeapon = $("dev-perk-max-weapon").checked;
    if (player.maxWeapon) {
        weapon.level = 99;
        weapon.aspects = weapon.aspects || { attack: 0, crit: 0, soulGain: 0 };
        Object.keys(weapon.aspects).forEach(k => weapon.aspects[k] = 5);
    }
    if (player.infiniteSouls) {
        player.souls = parseInt($("dev-bonus-souls").value, 10) || player.souls;
    }
    updatePlayerUI();
    addToCombatLog("Developer perks applied.");
}

window.ILoveSabrina = openDevMenu;
Object.defineProperty(window, 'ILoveSabrina', {
    get() {
        openDevMenu();
        return openDevMenu;
    },
    configurable: true
});

async function loadSelectedProfile() {
    const select = $("profile-select");
    const profileName = select?.value || currentProfileName;
    if (!profileName) {
        addToCombatLog("Select a profile to load.");
        return;
    }
    const profiles = await getSavedProfiles();
    const save = profiles[profileName];
    if (!save) {
        addToCombatLog("Profile not found.");
        return;
    }
    player = save.player;
    weapon = save.weapon || weapon;
    weapon.aspects = weapon.aspects || { attack: 0, crit: 0, soulGain: 0 };
    districts = save.districts || {};
    healingItems = save.healingItems || 0;
    demonDrops = save.demonDrops || demonDrops;
    cookingInventory = save.cookingInventory || cookingInventory;
    await setCurrentProfileName(profileName);
    if ($("player-portrait")) $("player-portrait").src = portraits[player.name] || portraits.mira;
    $("idle-toggle").checked = player.idleMode;
    $("character-select").classList.add("hidden");
    $("main-ui").classList.remove("hidden");
    updatePlayerUI();
    if (typeof renderDistricts === 'function') renderDistricts();
    if (typeof renderZones === 'function') renderZones();
    if (typeof renderCookingInventory === 'function') renderCookingInventory();
    if (typeof renderCookingRecipes === 'function') renderCookingRecipes();
    if (typeof renderStorageInventory === 'function') renderStorageInventory();
    if (typeof startCombatLoop === 'function') startCombatLoop();
    addToCombatLog(`Profile '${profileName}' loaded.`);
}

async function deleteCurrentProfile() {
    const profileName = $("profile-select")?.value || currentProfileName;
    if (!profileName) {
        addToCombatLog("Select a profile to delete.");
        return;
    }
    if (!confirm(`Delete profile '${profileName}'? This cannot be undone.`)) return;
    const profiles = await getSavedProfiles();
    delete profiles[profileName];
    await saveProfiles(profiles);
    await setCurrentProfileName(null);
    addToCombatLog(`Profile '${profileName}' deleted.`);
}

async function autoSaveProfile() {
    if (currentProfileName) {
        await saveCurrentProfile(false);
    }
}
// ===============================
//  Cooking System
// ===============================
// ...existing code...

// ...existing code...

// ...existing code...

function renderCookingInventory() {
    const inv = $("cooking-inventory");
    if (!inv) return;
    let html = `<h4>Ingredients</h4><ul style='padding-left:18px;'>`;
    for (const k in demonDrops) {
        html += `<li>${k.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}: <b>${demonDrops[k]}</b></li>`;
    }
    html += `</ul><h4>Cooked Food</h4><ul style='padding-left:18px;'>`;
    for (const k in cookingInventory) {
        html += `<li>${k.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}: <b>${cookingInventory[k]}</b></li>`;
    }
    html += `</ul>`;
    inv.innerHTML = html;
}

function renderCookingRecipes() {
    const recipes = $("cooking-recipes");
    if (!recipes) return;
    let html = `<h4>Recipes</h4>`;
    cookingRecipes.forEach(recipe => {
        html += `<div style='margin-bottom:10px;padding:8px;background:rgba(20,20,35,0.85);border-radius:8px;'>`;
        html += `<b>${recipe.name}</b> (Heals ${recipe.heal} HP)<br>Ingredients: `;
        html += Object.entries(recipe.ingredients).map(([k,v]) => `${v} ${k.replace(/_/g,' ')}`).join(', ');
        html += `<br><button class='cook-btn' data-key='${recipe.key}'>Cook</button>`;
        html += `</div>`;
    });
    recipes.innerHTML = html;
    // Attach listeners
    document.querySelectorAll('.cook-btn').forEach(btn => {
        btn.onclick = function() {
            const key = btn.dataset.key;
            const recipe = cookingRecipes.find(r => r.key === key);
            // Check ingredients
            let canCook = true;
            for (const ing in recipe.ingredients) {
                if (demonDrops[ing] < recipe.ingredients[ing]) canCook = false;
            }
            if (!canCook) {
                addToCombatLog("Not enough ingredients!");
                return;
            }
            // Deduct ingredients
            for (const ing in recipe.ingredients) {
                demonDrops[ing] -= recipe.ingredients[ing];
            }
            cookingInventory[recipe.key]++;
            addToCombatLog(`You cooked 1 ${recipe.name}!`);
            renderCookingInventory();
        };
    });
}

function addRandomDemonDrop() {
    // Called on enemy defeat, random drop
    const dropKeys = Object.keys(demonDrops);
    const drop = dropKeys[Math.floor(Math.random() * dropKeys.length)];
    demonDrops[drop]++;
    addToCombatLog(`You found 1 ${drop.replace(/_/g,' ')}!`);
    renderCookingInventory();
}

// ...existing code...

// ===============================
//  Derpy Fallback Loader
// ===============================
function loadDerpyImage() {
    const img = $("derpy-img");
    img.src = portraits.derpy;

    img.onerror = () => {
        console.warn("Derpy image failed, using fallback.");
        img.src = "fallbacks/derpy.png";
    };
}

// ===============================
//  Character Selection
// ===============================
function setupCharacterSelect() {
    const cards = document.querySelectorAll(".character-card");
    const createBtn = $("create-profile-btn");
    if (createBtn) createBtn.disabled = true;

    cards.forEach(card => {
        card.addEventListener("click", () => {
            cards.forEach(c => c.classList.remove("selected"));
            card.classList.add("selected");

            player.name = card.dataset.char;
            $("player-portrait").src = portraits[player.name] || portraits.mira;

            $("character-message-box").classList.remove("hidden");
            $("character-message-text").textContent =
                `${player.name.charAt(0).toUpperCase() + player.name.slice(1)} selected`;

            if (createBtn) createBtn.disabled = false;
        });
    });
}

// ===============================
//  Start Game
// ===============================
function startGame() {
    $("player-portrait").src = portraits[player.name] || portraits.mira;
    $("idle-toggle").checked = player.idleMode;

    player.hp = player.maxHp;

    updatePlayerUI();
    renderDistricts();
    startCombatLoop();
}

// ===============================
//  Enemy Generation
// ===============================
function generateEnemy(zoneLevel = player.level) {
    const level = Math.max(1, zoneLevel);

    return {
        name: "Demon",
        level,
        maxHp: 40 + level * 12,
        hp: 40 + level * 12,
        damage: 4 + level * 2,
        type: "normal"
    };
}

// Exponential training enemy (Zones 0–100)
function generateTrainingEnemy(level) {
    if (level === 0) {
        return {
            name: "Training Dummy",
            level: 0,
            maxHp: 50,
            hp: 50,
            damage: 0,
            type: "training",
            trainingXp: 5,
            trainingSouls: 0
        };
    }

    const hp = Math.floor(50 * Math.pow(1.15, level));
    const dmg = Math.floor(5 * Math.pow(1.12, level));
    const xp = Math.floor(20 * Math.pow(1.10, level));
    const souls = Math.floor(5 * Math.pow(1.08, level));

    return {
        name: `Demon Lv ${level}`,
        level,
        maxHp: hp,
        hp: hp,
        damage: dmg,
        type: "training",
        trainingXp: xp,
        trainingSouls: souls
    };
}

// Infinite Dungeon enemy (101+)
function generateInfiniteEnemy() {
    const level = 101 + Math.floor(Math.random() * 50);
    const hp = Math.floor(80 * Math.pow(1.18, level));
    const dmg = Math.floor(10 * Math.pow(1.14, level));
    const xp = Math.floor(40 * Math.pow(1.12, level));
    const souls = Math.floor(15 * Math.pow(1.10, level));

    return {
        name: `Abyssal Demon Lv ${level}`,
        level,
        maxHp: hp,
        hp: hp,
        damage: dmg,
        type: "infinite",
        infXp: xp,
        infSouls: souls
    };
}

// ===============================
//  Combat Loop
// ===============================
function startCombatLoop() {
    if (combatLoopId) return;
    if (!currentEnemy) {
        currentEnemy = generateEnemy();
        updateEnemyUI();
    }

    combatLoopId = setInterval(() => {
        if (player.hp > 0 && player.hp < player.maxHp && player.deathCooldown === 0) {
            let healAmount = 1 + Math.floor(Math.min(player.level, 100) / 20);
            player.hp = Math.min(player.maxHp, player.hp + healAmount);
            if (healAmount > 0) addToCombatLog(`You heal for ${healAmount} HP.`);
            updatePlayerUI();
        }
        if (player.idleMode && player.hp > 0 && player.deathCooldown === 0) {
            performCombatTick();
        }
    }, Math.max(100, Math.floor(1000 / gameSpeed)));
}

function restartCombatLoop() {
    if (combatLoopId) {
        clearInterval(combatLoopId);
        combatLoopId = null;
    }
    startCombatLoop();
}

function setGameSpeed(factor) {
    gameSpeed = factor;
    if (combatLoopId) restartCombatLoop();
    updateSpeedButtons();
    addToCombatLog(`Game speed set to ${factor}x.`);
}

function updateSpeedButtons() {
    document.querySelectorAll('.dev-speed-btn').forEach(btn => {
        const speed = parseFloat(btn.dataset.speed);
        if (speed === gameSpeed) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

function performCombatTick() {
    if (!currentEnemy) return;

    const baseDmg = 5 + weapon.level * 2;
    const prestigeBonus = player.prestige * 0.05;
    const totalDmg = Math.floor(baseDmg * (1 + prestigeBonus));

    currentEnemy.hp -= totalDmg;
    addToCombatLog(`You hit the enemy for ${totalDmg} damage.`);

    if (currentEnemy.hp <= 0) {
        handleEnemyDefeat();
        return;
    }

    player.hp -= currentEnemy.damage;
    if (currentEnemy.damage > 0) {
        addToCombatLog(`Enemy hits you for ${currentEnemy.damage}.`);
    }

    if (player.hp <= 0) {
        handlePlayerDeath();
    }

    updatePlayerUI();
    updateEnemyUI();
}

// ===============================
//  Enemy Defeat
// ===============================
function handleEnemyDefeat() {
    let xpGain = 0;
    let soulGain = 0;

    if (currentEnemy.type === "training") {
        xpGain = currentEnemy.trainingXp;
        soulGain = currentEnemy.trainingSouls;
    } else if (currentEnemy.type === "infinite") {
        xpGain = currentEnemy.infXp;
        soulGain = currentEnemy.infSouls;
    } else {
        xpGain = 20 + currentEnemy.level * 5;
        soulGain = 10 + currentEnemy.level * 3;
    }

    player.xp += xpGain;
    player.souls += soulGain;

    addToCombatLog(`Enemy defeated! +${xpGain} XP, +${soulGain} Souls.`);
    // Demon drop
    addRandomDemonDrop();

    levelCheck();


    // Instead of auto-generating a new enemy, keep the defeated enemy object but mark as defeated
    // Only clear the enemy if it's not a normal/training/infinite type
    if (currentEnemy.type === "normal" || currentEnemy.type === "training" || currentEnemy.type === "infinite") {
        // Mark as defeated, but keep the object so the player can attack again to refight
        currentEnemy.defeated = true;
    } else {
        currentEnemy = null;
    }

    updateEnemyUI();
    updatePlayerUI();
}

// ===============================
//  Player Death
// ===============================
function handlePlayerDeath() {
    addToCombatLog("You died!");

    player.hp = 0;
    player.deathCooldown = 5;

    const interval = setInterval(() => {
        player.deathCooldown--;
        $("cooldown-info").classList.remove("hidden");
        $("cooldown-timer").textContent = player.deathCooldown;

        if (player.deathCooldown <= 0) {
            clearInterval(interval);
            $("cooldown-info").classList.add("hidden");

            player.hp = player.maxHp;
            currentEnemy = generateEnemy();
            updateEnemyUI();
            updatePlayerUI();
        }
    }, 1000);
}

// ===============================
//  XP + Leveling
// ===============================
function xpToNextLevel(level) {
    return Math.floor(80 * Math.pow(level, 1.45));
}

function levelCheck() {
    while (player.xp >= xpToNextLevel(player.level)) {
        player.xp -= xpToNextLevel(player.level);
        player.level++;
        player.maxHp += 10;
        player.hp = player.maxHp;

        addToCombatLog(`LEVEL UP! You are now level ${player.level}.`);
    }
}

// ===============================
//  UI Updates
// ===============================
function updatePlayerUI() {
    $("player-name").textContent = player.name;
    $("player-level").textContent = player.level;
    $("player-hp").textContent = player.hp;
    $("player-maxhp").textContent = player.maxHp;
    $("player-souls").textContent = player.souls;
    $("player-prestige").textContent = player.prestige;
    $("player-prestige-bonus").textContent = player.prestige * 5;
    $("player-derpyfur").textContent = player.derpyFur;
    $("weapon-level").textContent = weapon.level;
    $("weapon-prestige").textContent = weapon.prestige;

    const config = weaponConfigs[player.name] || weaponConfigs.mira;
    const passiveText = config.aspects.map(a => `${a.title}: ${weapon.aspects?.[a.key] || 0}`).join(" | ");
    $("weapon-passives").textContent = passiveText;

    const pct = (player.xp / xpToNextLevel(player.level)) * 100;
    $("xp-bar").style.width = pct + "%";
    $("xp-text").textContent = `${Math.floor(pct)}%`;
    updateCombatUI();
}

function updateEnemyUI() {
    if (!currentEnemy) {
        $("enemy-name").textContent = "-";
        $("enemy-level").textContent = "-";
        $("enemy-hp").textContent = "-";
        $("enemy-maxhp").textContent = "-";
        updateCombatUI();
        return;
    }

    $("enemy-name").textContent = currentEnemy.name;
    $("enemy-level").textContent = currentEnemy.level;
    $("enemy-hp").textContent = currentEnemy.hp;
    $("enemy-maxhp").textContent = currentEnemy.maxHp;
    updateCombatUI();
}

function updateCombatUI() {
    const playerSprite = $("player-sprite");
    const enemySprite = $("enemy-sprite");
    if (playerSprite) {
        playerSprite.style.backgroundImage = `url(${portraits[player.name] || portraits.mira})`;
    }
    if (!enemySprite) return;

    if (!currentEnemy) {
        enemySprite.style.backgroundImage = "linear-gradient(135deg, rgba(168,20,30,0.4), rgba(70,0,45,0.85))";
        return;
    }

    enemySprite.style.backgroundImage = getEnemySpriteBackground(currentEnemy);
}

function getEnemySpriteBackground(enemy) {
    const normalized = enemy.name.toLowerCase();
    let start = "#be1e2d";
    let end = "#53132b";
    let icon = "👾";
    let label = enemy.name.toUpperCase();

    if (enemy.type === "training") {
        start = "#5f6c7a";
        end = "#a0a8b8";
        icon = "🛡️";
        label = "TRAINING DUMMY";
    } else if (enemy.type === "infinite") {
        start = "#2b044d";
        end = "#000000";
        icon = "☠️";
        label = enemy.name.toUpperCase();
    } else {
        if (normalized.includes("boss") || normalized.includes("lord") || normalized.includes("gatekeeper") || normalized.includes("final")) {
            start = "#b32d53";
            end = "#2f071a";
            icon = "👑";
        } else if (normalized.includes("wraith") || normalized.includes("specter") || normalized.includes("spirit") || normalized.includes("shadow")) {
            start = "#39168f";
            end = "#0a041d";
            icon = "🌩️";
        } else if (normalized.includes("oni") || normalized.includes("demon") || normalized.includes("shade") || normalized.includes("eater") || normalized.includes("specter")) {
            start = "#a12335";
            end = "#2e0510";
            icon = "😈";
        } else if (normalized.includes("thug") || normalized.includes("fan") || normalized.includes("idol") || normalized.includes("bouncer")) {
            start = "#d5731f";
            end = "#3f1c04";
            icon = "👊";
        } else {
            start = "#be1e2d";
            end = "#53132b";
            icon = "👾";
        }
    }

    const detail = enemy.type === "training" ? "LV 0" : `LV ${enemy.level}`;
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256'>
        <defs>
            <linearGradient id='g' x1='0%' y1='0%' x2='100%' y2='100%'>
                <stop offset='0%' stop-color='${start}'/>
                <stop offset='100%' stop-color='${end}'/>
            </linearGradient>
        </defs>
        <rect width='256' height='256' rx='28' ry='28' fill='url(#g)' />
        <circle cx='128' cy='82' r='48' fill='rgba(255,255,255,0.18)' />
        <text x='128' y='94' font-size='60' text-anchor='middle' dominant-baseline='middle' fill='rgba(255,255,255,0.9)' font-family='Arial, sans-serif'>${icon}</text>
        <rect x='24' y='158' width='208' height='66' rx='16' ry='16' fill='rgba(0,0,0,0.38)' />
        <text x='128' y='186' font-size='18' text-anchor='middle' fill='#fff' font-family='Arial, sans-serif' font-weight='700'>${label}</text>
        <text x='128' y='210' font-size='14' text-anchor='middle' fill='#ddd' font-family='Arial, sans-serif'>${detail}</text>
    </svg>`;
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

function getAspectCost(aspect, rank) {
    return aspect.baseCost + rank * aspect.costStep + weapon.level * 10;
}

function openWeaponUpgradeMenu() {
    const modal = $("weapon-upgrade-modal");
    if (!modal) return;
    modal.classList.remove("hidden");
    renderWeaponUpgradeMenu();
}

function closeWeaponUpgradeMenu() {
    const modal = $("weapon-upgrade-modal");
    if (!modal) return;
    modal.classList.add("hidden");
}

function renderWeaponUpgradeMenu() {
    const config = weaponConfigs[player.name] || weaponConfigs.mira;
    const splash = $("weapon-splash");
    if (splash) {
        splash.style.backgroundImage = `url(${config.image})`;
    }
    $("weapon-name").textContent = config.weaponName;
    $("weapon-desc").textContent = config.description;
    $("modal-weapon-level").textContent = weapon.level;
    $("modal-weapon-souls").textContent = player.souls;

    if (!weapon.aspects) {
        weapon.aspects = { attack: 0, crit: 0, soulGain: 0 };
    }

    let html = "";
    config.aspects.forEach(aspect => {
        const rank = weapon.aspects[aspect.key] || 0;
        const cost = getAspectCost(aspect, rank);
        html += `
            <div class="weapon-option">
                <h4>${aspect.title}</h4>
                <p>${aspect.desc}</p>
                <div class="option-detail">Rank: ${rank}/${aspect.maxRank}</div>
                <button class="upgrade-aspect-btn" data-key="${aspect.key}" data-cost="${cost}" ${rank >= aspect.maxRank ? "disabled" : ""}>
                    ${rank >= aspect.maxRank ? "MAX" : `Upgrade for ${cost} Souls`}
                </button>
            </div>`;
    });
    $("weapon-upgrade-options").innerHTML = html;

    document.querySelectorAll(".upgrade-aspect-btn").forEach(btn => {
        btn.addEventListener("click", () => upgradeWeaponAspect(btn.dataset.key));
    });
}

function upgradeWeaponAspect(key) {
    const config = weaponConfigs[player.name] || weaponConfigs.mira;
    const aspect = config.aspects.find(a => a.key === key);
    if (!aspect) return;
    const rank = weapon.aspects[key] || 0;
    if (rank >= aspect.maxRank) return;
    const cost = getAspectCost(aspect, rank);
    if (player.souls < cost) {
        addToCombatLog("Not enough Souls to upgrade that aspect.");
        return;
    }
    player.souls -= cost;
    weapon.aspects[key] = rank + 1;
    addToCombatLog(`${aspect.title} upgraded to rank ${weapon.aspects[key]}!`);
    updatePlayerUI();
    renderWeaponUpgradeMenu();
}

// ===============================
//  Combat Log
// ===============================
function addToCombatLog(text) {
    const log = $("combat-log");
    log.innerHTML += text + "<br>";
    log.scrollTop = log.scrollHeight;
}

window.updateEnemyUI = updateEnemyUI;
window.addToCombatLog = addToCombatLog;

// ===============================
//  District System (City)
// ===============================
function renderDistricts() {
    const grid = $("district-grid");
    grid.innerHTML = "";

    for (let i = 1; i <= 20; i++) {
        if (!districts[i]) {
            districts[i] = {
                cleared: false,
                available: i === 1
            };
        }

        const tile = document.createElement("div");
        tile.classList.add("district-tile");

        if (districts[i].cleared) tile.classList.add("cleared");
        else if (districts[i].available) tile.classList.add("available");
        else tile.classList.add("locked");

        tile.textContent = "District " + i;

        tile.addEventListener("click", () => {
            if (!districts[i].available) return;

            currentEnemy = generateEnemy(i * 2);
            currentEnemy.type = "normal";
            updateEnemyUI();
            addToCombatLog(`Entering District ${i}...`);
        });

        grid.appendChild(tile);
    }

    updateDistrictUI();
}

function updateDistrictUI() {
    districtsCleared = Object.values(districts).filter(d => d.cleared).length;
    $("districts-cleared").textContent = districtsCleared;
}

function clearDistrict(num) {
    if (!districts[num]) return;

    districts[num].cleared = true;

    if (districts[num + 1]) {
        districts[num + 1].available = true;
    }

    updateDistrictUI();
    renderDistricts();
}

// ===============================
//  Zones System (Dropdowns)
// ===============================
function renderZones() {
    const list = $("zone-list");
    list.innerHTML = "";

    // Huntrix Gym
    const gymHeader = document.createElement("div");
    gymHeader.classList.add("zone-header");
    gymHeader.textContent = "Huntrix Gym";
    list.appendChild(gymHeader);

    const dummyBtn = document.createElement("button");
    dummyBtn.classList.add("zone-btn");
    dummyBtn.textContent = "Training Dummy (Lv 0)";
    dummyBtn.addEventListener("click", () => {
        currentEnemy = generateTrainingEnemy(0);
        updateEnemyUI();
        addToCombatLog("You start training with the dummy in Huntrix Gym.");
    });
    list.appendChild(dummyBtn);

    // Demon Training Tiers (1–100)
    const demonHeader = document.createElement("div");
    demonHeader.classList.add("zone-header");
    demonHeader.textContent = "Demon Training";
    list.appendChild(demonHeader);

    const levelsPerTier = 10;
    const maxLevel = 100;
    const tierCount = maxLevel / levelsPerTier;

    for (let tier = 1; tier <= tierCount; tier++) {
        const startLevel = (tier - 1) * levelsPerTier + 1;
        const endLevel = tier * levelsPerTier;

        const tierContainer = document.createElement("div");
        tierContainer.classList.add("zone-tier");

        // ⭐ Neon K‑Pop collapsible button
        const tierHeader = document.createElement("button");
        tierHeader.classList.add("zone-tier-header", "kpop-btn");
        tierHeader.textContent = `Tier ${tier} (Lv ${startLevel}–${endLevel})`;

        const tierBody = document.createElement("div");
        tierBody.classList.add("zone-tier-body");
        tierBody.style.display = "none";

        tierHeader.addEventListener("click", () => {
            const isOpen = tierBody.style.display === "block";
            tierBody.style.display = isOpen ? "none" : "block";
        });

        for (let lvl = startLevel; lvl <= endLevel; lvl++) {
            const btn = document.createElement("button");
            btn.classList.add("zone-btn");
            btn.textContent = `Demon Lv ${lvl}`;
            btn.addEventListener("click", () => {
                currentEnemy = generateTrainingEnemy(lvl);
                updateEnemyUI();
                addToCombatLog(`You enter Demon Training: Level ${lvl}.`);

                // Auto-collapse this tier
                tierBody.style.display = "none";
            });
            tierBody.appendChild(btn);
        }

        tierContainer.appendChild(tierHeader);
        tierContainer.appendChild(tierBody);
        list.appendChild(tierContainer);
    }
}

// ===============================
//  Infinite Dungeon
// ===============================
$("infinite-dungeon-btn").addEventListener("click", () => {
    currentEnemy = generateInfiniteEnemy();
    updateEnemyUI();
    addToCombatLog("You descend into the Infinite Dungeon (Lv 101+).");
});

// ===============================
//  Store System
// ===============================
document.querySelectorAll(".buy-item-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const item = btn.parentElement.dataset.item;

        if (item === "noodle") {
            if (player.souls >= 50) {
                player.souls -= 50;
                healingItems++;
                addToCombatLog("Bought Noodles (+1 healing item).");
            } else {
                addToCombatLog("Not enough Souls.");
            }
        }

        if (item === "soda") {
            if (player.souls >= 120) {
                player.souls -= 120;
                healingItems++;
                addToCombatLog("Bought Soda (+1 healing item).");
            } else {
                addToCombatLog("Not enough Souls.");
            }
        }

        $("healing-items-count").textContent = healingItems;
        updatePlayerUI();
    });
});

// ===============================
//  Healing Item Usage
// ===============================
$("heal-btn").addEventListener("click", () => {
    // Priority: cooked food > healingItems
    let used = false;
    // Try cooked food first
    for (const recipe of cookingRecipes) {
        if (cookingInventory[recipe.key] > 0) {
            cookingInventory[recipe.key]--;
            const healAmount = recipe.heal;
            player.hp = Math.min(player.maxHp, player.hp + healAmount);
            addToCombatLog(`You ate ${recipe.name} and healed for ${healAmount} HP.`);
            used = true;
            renderCookingInventory();
            break;
        }
    }
    // If no cooked food, use basic healing item
    if (!used) {
        if (healingItems <= 0) {
            addToCombatLog("You have no healing items.");
            return;
        }
        healingItems--;
        $("healing-items-count").textContent = healingItems;
        const healAmount = Math.floor(player.maxHp * 0.4);
        player.hp = Math.min(player.maxHp, player.hp + healAmount);
        addToCombatLog(`You healed for ${healAmount} HP.`);
    }
    updatePlayerUI();
});

// ===============================
// ===============================
// ⭐ Manual Attack Button (FIXED)
// ===============================
$("fight-btn").addEventListener("click", () => {
    if (!currentEnemy || player.hp <= 0 || player.deathCooldown > 0) return;
    // If enemy is defeated, respawn the same type/level
    if (currentEnemy.defeated) {
        if (currentEnemy.type === "normal") {
            currentEnemy = generateEnemy(currentEnemy.level);
        } else if (currentEnemy.type === "training") {
            currentEnemy = generateTrainingEnemy(currentEnemy.level);
        } else if (currentEnemy.type === "infinite") {
            currentEnemy = generateInfiniteEnemy();
        }
        updateEnemyUI();
        addToCombatLog(`A new ${currentEnemy.name} appears!`);
        return;
    }
    performCombatTick();
});

// ===============================
//  Derpy Prestige System
// ===============================
$("derpy-prestige-btn").addEventListener("click", () => {
    if (player.level < 50) {
        addToCombatLog("You must reach level 50 to prestige your character.");
        return;
    }

    player.prestige++;
    player.prestigeBonus = player.prestige * 5;
    player.level = 1;
    player.xp = 0;
    player.maxHp = 100;
    player.hp = 100;

    addToCombatLog("Character Prestige! +5% permanent damage bonus.");
    updatePlayerUI();
});

// ===============================
//  Weapon Prestige System
// ===============================
$("derpy-weapon-prestige-btn").addEventListener("click", () => {
    if (player.derpyFur < 10) {
        addToCombatLog("You need 10 Derpy Fur to prestige your weapon.");
        return;
    }

    player.derpyFur -= 10;
    weapon.prestige++;
    weapon.level = 1;
    weapon.passives = [];

    addToCombatLog("Weapon Prestige! Weapon reset but gains a permanent bonus.");
    updatePlayerUI();
});

// ===============================
//  Save / Load / Reset
// ===============================
// Event bindings are initialized in window.onload.

$("reset-save-btn").addEventListener("click", async () => {
    if (!confirm("Reset all saved profiles? This will clear all profiles and reload the game.")) return;
    const cache = await openProfileCache();
    if (cache) {
        await cache.delete(PROFILE_INDEX_URL);
        await cache.delete(PROFILE_CURRENT_URL);
    }
    location.reload();
});

// ===============================
//  Tutorial
// ===============================
const TUTORIAL_STEPS = [
    {
        icon: "🎤",
        title: "Welcome to Neon K‑Pop Demon Hunters!",
        desc: "You're about to step into a neon-lit city overrun by demons. This quick guide will show you everything you need to get started!",
        highlight: null
    },
    {
        icon: "🧬",
        title: "Your Hunter",
        desc: "Up here is your Hunter's profile — HP, level, XP bar and Souls. Keep your HP up and level up by fighting enemies to grow stronger!",
        highlight: "player-info"
    },
    {
        icon: "⚔️",
        title: "Combat",
        desc: "Click Attack to fight demons one swing at a time. Toggle Idle Mode (the switch on the button) to fight automatically while you browse the game!",
        highlight: "combat-panel"
    },
    {
        icon: "🗺️",
        title: "Zones",
        desc: "The Zones tab lists every area in the city to explore. As your level climbs, harder zones unlock with better XP and Soul rewards.",
        highlight: "side-panel"
    },
    {
        icon: "🛒",
        title: "Store",
        desc: "Spend Souls in the Store tab to buy healing items. Use them in battle with the Use Item button to quickly recover HP.",
        highlight: "side-panel"
    },
    {
        icon: "🍜",
        title: "Cooking",
        desc: "Demons drop ingredients when defeated. Open the Cooking tab to craft powerful meals that restore large amounts of HP!",
        highlight: "side-panel"
    },
    {
        icon: "🗡️",
        title: "Weapon Upgrades",
        desc: "Spend Souls to upgrade your weapon. Unlock unique aspects that boost your damage, increase crits, and earn more Souls per kill.",
        highlight: "weapon-info"
    },
    {
        icon: "💾",
        title: "Saving Your Game",
        desc: "Your progress auto-saves every 30 seconds. Hit Save to save manually at any time, and use Load if you ever need to roll back.",
        highlight: "save-load-controls"
    },
    {
        icon: "✨",
        title: "You're Ready!",
        desc: "That's everything, Hunter! Head out, fight demons, and let the K-Pop power carry you. Good luck — the city is counting on you!",
        highlight: null
    }
];

let tutorialStep = 0;

function startTutorial() {
    tutorialStep = 0;
    const overlay = $("tutorial-overlay");
    if (!overlay) return;
    overlay.classList.remove("hidden");
    renderTutorialStep();
}

function closeTutorial() {
    const overlay = $("tutorial-overlay");
    if (overlay) overlay.classList.add("hidden");
    const spotlight = $("tutorial-spotlight");
    if (spotlight) { spotlight.style.opacity = "0"; spotlight.style.width = "0"; spotlight.style.height = "0"; }
}

function renderTutorialStep() {
    const step = TUTORIAL_STEPS[tutorialStep];
    if (!step) { closeTutorial(); return; }

    $("tutorial-step-icon").textContent = step.icon;
    $("tutorial-title").textContent = step.title;
    $("tutorial-desc").textContent = step.desc;
    $("tutorial-progress").textContent = `${tutorialStep + 1} / ${TUTORIAL_STEPS.length}`;

    const nextBtn = $("tutorial-next-btn");
    if (nextBtn) nextBtn.textContent = tutorialStep === TUTORIAL_STEPS.length - 1 ? "Let's Go! ✦" : "Next ›";

    const card = $("tutorial-card");
    if (card) { card.style.animation = "none"; void card.offsetWidth; card.style.animation = "tutorialSlideUp 0.35s cubic-bezier(0.22, 1, 0.36, 1) both"; }

    const spotlight = $("tutorial-spotlight");
    if (spotlight) {
        if (step.highlight) {
            const el = $(step.highlight);
            if (el) {
                const r = el.getBoundingClientRect();
                const pad = 8;
                spotlight.style.left   = `${r.left   - pad}px`;
                spotlight.style.top    = `${r.top    - pad}px`;
                spotlight.style.width  = `${r.width  + pad * 2}px`;
                spotlight.style.height = `${r.height + pad * 2}px`;
                spotlight.style.opacity = "1";
                el.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }
        } else {
            spotlight.style.opacity = "0";
            spotlight.style.width = "0";
            spotlight.style.height = "0";
        }
    }
}

function tutorialNext() {
    tutorialStep++;
    if (tutorialStep >= TUTORIAL_STEPS.length) { closeTutorial(); } else { renderTutorialStep(); }
}

// ===============================
//  Idle Mode Toggle
// ===============================
$("idle-toggle").addEventListener("change", e => {
    player.idleMode = e.target.checked;
    addToCombatLog(player.idleMode ? "Idle Mode ON" : "Idle Mode OFF");
});

// ===============================
//  Tab Switching
// ===============================
document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
        document.querySelectorAll(".tab-content").forEach(tab => tab.classList.remove("active"));

        btn.classList.add("active");
        const tabId = btn.dataset.tab;
        const tabContent = document.getElementById(tabId);
        if (tabContent) tabContent.classList.add("active");
    });
});

// ===============================
//  Jenu Hologram System
// ===============================
let jenuTimeout = null;

function showJenuMessage(text) {
    const box = $("jenu-avatar");
    const msg = box.querySelector(".jenu-text");

    msg.textContent = text;
    box.classList.add("visible");

    if (jenuTimeout) clearTimeout(jenuTimeout);

    jenuTimeout = setTimeout(() => {
        box.classList.remove("visible");
    }, 4000);
}

function jenuOnLevelUp() {
    showJenuMessage("Jenu: “You’re getting stronger… interesting.”");
}

function jenuOnDistrictClear() {
    showJenuMessage("Jenu: “Another district purified? Don’t get cocky.”");
}

// ===============================
//  Override AFTER real functions exist
// ===============================
const originalLevelCheck = levelCheck;
levelCheck = function () {
    const oldLevel = player.level;
    originalLevelCheck();
    if (player.level > oldLevel) jenuOnLevelUp();
};

const originalClearDistrict = clearDistrict;
clearDistrict = function (num) {
    originalClearDistrict(num);
    jenuOnDistrictClear();
};

// ===============================
//  Initialization
// ===============================
window.onload = async () => {
    $("healing-items-count").textContent = healingItems;
    loadDerpyImage();
    renderZones();
    await populateProfileSelect();
    const defaultProfile = await getCurrentProfileName();
    await setCurrentProfileName(defaultProfile);
    const profileSelect = $("profile-select");
    if (profileSelect) {
        profileSelect.addEventListener("change", e => setCurrentProfileName(e.target.value));
    }
    $("create-profile-btn")?.addEventListener("click", async () => {
        const name = $("profile-name-input").value.trim();
        const success = await createProfile(name);
        if (!success) return;
        populateProfileSelect();
        $("character-select").classList.add("hidden");
        $("main-ui").classList.remove("hidden");
        startGame();
        startTutorial();
    });
    $("save-btn")?.addEventListener("click", () => {
        saveCurrentProfile();
    });
    $("load-btn")?.addEventListener("click", () => {
        loadSelectedProfile();
    });
    $("delete-profile-btn")?.addEventListener("click", deleteCurrentProfile);
    $("save-profile-btn")?.addEventListener("click", () => saveCurrentProfile());
    $("dev-menu-close")?.addEventListener("click", closeDevMenu);
    $("dev-collapse-btn")?.addEventListener("click", e => {
        e.stopPropagation();
        toggleDevMenuCollapse();
    });
    $("dev-menu-header")?.addEventListener("mousedown", startDevDrag);
    $("dev-menu-header")?.addEventListener("touchstart", startDevDrag, { passive: false });
    $("dev-menu-header")?.addEventListener("click", e => {
        if (e.target.closest('.dev-menu-actions')) return;
        if (devCollapsed && !devDragMoved) {
            toggleDevMenuCollapse();
        }
    });
    $("dev-menu-modal")?.addEventListener("click", e => {
        if (e.target.id === "dev-menu-modal") closeDevMenu();
    });
    window.addEventListener("keydown", e => {
        if (e.key === "Escape") closeDevMenu();
    });
    window.addEventListener("mousemove", moveDevDrag);
    window.addEventListener("touchmove", moveDevDrag, { passive: false });
    window.addEventListener("mouseup", stopDevDrag);
    window.addEventListener("touchend", stopDevDrag);
    $("dev-apply-stats")?.addEventListener("click", applyDevStats);
    $("dev-apply-inventory")?.addEventListener("click", applyDevInventory);
    $("dev-apply-perks")?.addEventListener("click", applyDevPerks);
    document.querySelectorAll('.dev-speed-btn').forEach(btn => {
        btn.addEventListener('click', () => setGameSpeed(parseFloat(btn.dataset.speed)));
    });
    updateSpeedButtons();
    $("tutorial-next-btn")?.addEventListener("click", tutorialNext);
    $("tutorial-skip-btn")?.addEventListener("click", closeTutorial);
    $("tutorial-overlay")?.addEventListener("click", e => { if (e.target.id === "tutorial-overlay") closeTutorial(); });
    setInterval(() => {
        autoSaveProfile().catch(err => console.error('Auto-save failed:', err));
    }, 30000);
    $("upgrade-weapon-btn").addEventListener("click", openWeaponUpgradeMenu);
    $("weapon-upgrade-close").addEventListener("click", closeWeaponUpgradeMenu);
    $("weapon-upgrade-modal").addEventListener("click", e => {
        if (e.target.id === "weapon-upgrade-modal") closeWeaponUpgradeMenu();
    });
};
