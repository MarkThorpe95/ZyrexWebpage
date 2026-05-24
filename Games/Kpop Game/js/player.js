// Player stats, leveling, prestige
let player = {
    name: "",
    level: 1,
    xp: 0,
    maxHp: 100,
    hp: 100,
    souls: 0,
    prestige: 0,
    prestigeBonus: 0,
    derpyFur: 0,
    idleMode: false,
    deathCooldown: 0,
    cookingLevel: 1,
    cookingXP: 0
};

let weapon = {
    level: 1,
    prestige: 0,
    passives: [],
    aspects: {
        attack: 0,
        crit: 0,
        soulGain: 0
    }
};

function xpToNextLevel(level) {
    return Math.floor(100 * Math.pow(level, 1.5));
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
