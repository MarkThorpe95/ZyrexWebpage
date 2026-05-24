// Combat logic

function generateEnemy(zoneLevel = player.level) {
    const level = Math.max(1, zoneLevel);
    const hp = Math.floor(35 + level * 11 + Math.pow(level, 1.08) * 5);
    const damage = Math.max(3, Math.floor(4 + level * 1.9 + Math.pow(level, 1.03) * 0.7));
    return {
        name: `Demon Lv ${level}`,
        level,
        maxHp: hp,
        hp: hp,
        damage,
        type: "normal"
    };
}

function generateTrainingEnemy(level) {
    if (level === 0) {
        return {
            name: "Training Dummy",
            level: 0,
            maxHp: 50,
            hp: 50,
            damage: 0,
            type: "training",
            trainingXp: 12,
            trainingSouls: 0
        };
    }
    const hp = Math.floor(45 + level * 10 + Math.pow(level, 1.07) * 5);
    const dmg = Math.floor(4 + level * 1.8 + Math.pow(level, 1.03) * 0.6);
    const xp = Math.floor(10 + level * 6 + Math.pow(level, 1.04) * 0.8);
    const souls = Math.floor(5 + level * 2);
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

function generateInfiniteEnemy() {
    const level = 101 + Math.floor(Math.random() * 50);
    const hp = Math.floor(80 + level * 18 + Math.pow(level, 1.08) * 8);
    const dmg = Math.floor(10 + level * 2.2 + Math.pow(level, 1.04) * 0.9);
    const xp = Math.floor(35 + level * 7 + Math.pow(level, 1.03) * 0.85);
    const souls = Math.floor(15 + level * 4 + Math.pow(level, 1.02) * 0.6);
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

function calculatePlayerDamage() {
    const baseDmg = 8 + player.level * 1.5 + weapon.level * 2;
    const prestigeBonus = 1 + player.prestige * 0.06;
    const attackRank = weapon.aspects?.attack || 0;
    const critRank = weapon.aspects?.crit || 0;
    const multiplier = 1 + attackRank * 0.06;
    const rawDamage = Math.max(1, Math.floor(baseDmg * prestigeBonus * multiplier));
    const critChance = Math.min(0.45, 0.05 + critRank * 0.03);
    const isCrit = Math.random() < critChance;
    const damage = isCrit ? Math.floor(rawDamage * 1.5) : rawDamage;
    return { damage, isCrit, critChance };
}

function triggerAttackAnimation() {
    const button = $("fight-btn");
    const sprite = $("player-sprite");
    if (button) {
        button.classList.add("attack-active");
        setTimeout(() => button.classList.remove("attack-active"), 220);
    }
    if (sprite) {
        sprite.classList.add("attack-swing");
        setTimeout(() => sprite.classList.remove("attack-swing"), 280);
    }
}

function triggerEnemyHitAnimation() {
    const enemySprite = $("enemy-sprite");
    if (!enemySprite) return;
    enemySprite.classList.add("enemy-hit");
    setTimeout(() => enemySprite.classList.remove("enemy-hit"), 240);
}

function triggerPlayerHitAnimation() {
    const sprite = $("player-sprite");
    if (!sprite) return;
    sprite.classList.add("player-hit");
    setTimeout(() => sprite.classList.remove("player-hit"), 240);
}

function startCombatLoop() {
    if (combatLoopId) return;
    if (!currentEnemy) {
        currentEnemy = generateEnemy();
        updateEnemyUI();
    }
    combatLoopId = setInterval(() => {
        const notInCombat = !currentEnemy || currentEnemy.type === 'training';
        if (notInCombat && player.hp > 0 && player.hp < player.maxHp && player.deathCooldown === 0) {
            let healAmount = 1 + Math.floor(Math.min(player.level, 100) / 15);
            player.hp = Math.min(player.maxHp, player.hp + healAmount);
            if (healAmount > 0) addToCombatLog(`You heal for ${healAmount} HP.`);
            updatePlayerUI();
        }
        if (player.idleMode && player.hp > 0 && player.deathCooldown === 0) {
            performCombatTick();
        }
    }, 1000);
}

function performCombatTick() {
    if (!currentEnemy) return;
    if (currentEnemy.defeated) {
        if (currentEnemy.type === "normal") {
            currentEnemy = generateEnemy(currentEnemy.level);
        } else if (currentEnemy.type === "training") {
            currentEnemy = generateTrainingEnemy(currentEnemy.level);
        } else if (currentEnemy.type === "infinite") {
            currentEnemy = generateInfiniteEnemy();
        }
        currentEnemy.defeated = false;
        updateEnemyUI();
        addToCombatLog(`A new ${currentEnemy.name} appears!`);
        return;
    }
    const result = calculatePlayerDamage();
    triggerAttackAnimation();
    currentEnemy.hp -= result.damage;
    addToCombatLog(`You hit the enemy for ${result.damage} damage.${result.isCrit ? ' Critical hit!' : ''}`);

    if (currentEnemy.hp <= 0) {
        handleEnemyDefeat();
        return;
    }

    if (currentEnemy.damage > 0) {
        if (player.godMode) {
            addToCombatLog("God Mode prevents all damage.");
        } else {
            player.hp -= currentEnemy.damage;
            addToCombatLog(`Enemy hits you for ${currentEnemy.damage}.`);
            triggerEnemyHitAnimation();
            triggerPlayerHitAnimation();
        }
    }

    if (player.hp <= 0) {
        handlePlayerDeath();
    }

    updatePlayerUI();
    updateEnemyUI();
}

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
        xpGain = 30 + currentEnemy.level * 8;
        soulGain = 15 + currentEnemy.level * 4;
    }
    const soulBonus = (weapon.aspects?.soulGain || 0) * 2;
    soulGain += soulBonus;
    player.xp += xpGain;
    player.souls += soulGain;
    addToCombatLog(`Enemy defeated! +${xpGain} XP, +${soulGain} Souls.${soulBonus ? ` (+${soulBonus} bonus from weapon)` : ''}`);
    addRandomDemonDrop();
    levelCheck();
    if (currentEnemy.type === "normal" || currentEnemy.type === "training" || currentEnemy.type === "infinite") {
        currentEnemy.defeated = true;
    } else {
        currentEnemy = null;
    }
    updateEnemyUI();
    updatePlayerUI();
}

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

