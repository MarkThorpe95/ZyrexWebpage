// Cooking system logic
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
    // Progress bar calculation
    const xpNeeded = cookingXpToNextLevel(player.cookingLevel);
    const percent = Math.min(100, Math.floor((player.cookingXP / xpNeeded) * 100));
    let html = `<h4>Recipes</h4>`;
    html += `<div style='margin-bottom:14px;'>
        <div style='font-size:1.1em;margin-bottom:4px;'>Cooking Level: <b>${player.cookingLevel}</b></div>
        <div style='background:#222;border-radius:8px;height:18px;width:100%;overflow:hidden;box-shadow:0 0 6px #4dd6ff inset;margin-bottom:2px;'>
            <div style='height:100%;width:${percent}%;background:linear-gradient(90deg,#4dd6ff,#ff2fd0);border-radius:8px;transition:width 0.3s;'></div>
        </div>
        <div style='font-size:0.95em;color:#4dd6ff;'>${player.cookingXP} / ${xpNeeded} XP (${percent}%)</div>
    </div>`;
    cookingRecipes.forEach(recipe => {
        const locked = player.cookingLevel < recipe.requiredLevel;
        html += `<div style='margin-bottom:10px;padding:8px;background:rgba(20,20,35,0.85);border-radius:8px;${locked ? 'opacity:0.5;' : ''}'>`;
        html += `<b>${recipe.name}</b> (Heals ${recipe.heal} HP)`;
        html += ` <span style='color:#4dd6ff;'>(Lv ${recipe.requiredLevel})</span><br>Ingredients: `;
        html += Object.entries(recipe.ingredients).map(([k,v]) => `${v} ${k.replace(/_/g,' ')}`).join(', ');
        if (locked) {
            html += `<br><span style='color:#ff4d4d;'>Locked: Cooking Lv ${recipe.requiredLevel}</span>`;
        } else {
            html += `<br><button class='cook-btn' data-key='${recipe.key}'>Cook</button>`;
        }
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
            addToCombatLog(`You cooked 1 ${recipe.name}! (+${recipe.xp} XP)`);
            // Award XP and level up
            player.cookingXP += recipe.xp;
            let leveled = false;
            while (player.cookingXP >= cookingXpToNextLevel(player.cookingLevel) && player.cookingLevel < 100) {
                player.cookingXP -= cookingXpToNextLevel(player.cookingLevel);
                player.cookingLevel++;
                leveled = true;
            }
            if (leveled) addToCombatLog(`Cooking Level Up! Now Lv ${player.cookingLevel}`);
            renderCookingInventory();
            renderCookingRecipes();
        };
    });
}

function cookingXpToNextLevel(level) {
    return Math.floor(20 * Math.pow(level, 1.2));
}

function addRandomDemonDrop() {
    // Called on enemy defeat, random drop
    const dropKeys = Object.keys(demonDrops);
    const drop = dropKeys[Math.floor(Math.random() * dropKeys.length)];
    demonDrops[drop]++;
    addToCombatLog(`You found 1 ${drop.replace(/_/g,' ')}!`);
    renderCookingInventory();
}
