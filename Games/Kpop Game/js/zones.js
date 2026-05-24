// Zones, districts, infinite dungeon

// Define zones and their enemies up to level 100
const zones = [
    { name: "Downtown", minLevel: 1, maxLevel: 20, enemies: [
        { name: "Street Thug", min: 1, max: 5 },
        { name: "Low Demon", min: 6, max: 10 },
        { name: "Possessed Idol", min: 11, max: 15 },
        { name: "Shadow Fan", min: 16, max: 20 }
    ]},
    { name: "Harajuku", minLevel: 21, maxLevel: 40, enemies: [
        { name: "Gothic Spirit", min: 21, max: 25 },
        { name: "Kawaii Oni", min: 26, max: 30 },
        { name: "Neon Specter", min: 31, max: 35 },
        { name: "Harajuku Boss", min: 36, max: 40 }
    ]},
    { name: "Gangnam", minLevel: 41, maxLevel: 60, enemies: [
        { name: "Club Bouncer", min: 41, max: 45 },
        { name: "Soul Eater", min: 46, max: 50 },
        { name: "K-Pop Shade", min: 51, max: 55 },
        { name: "Gangnam Boss", min: 56, max: 60 }
    ]},
    { name: "Seoul Tower", minLevel: 61, maxLevel: 80, enemies: [
        { name: "Tower Wraith", min: 61, max: 65 },
        { name: "Sky Demon", min: 66, max: 70 },
        { name: "Lightning Idol", min: 71, max: 75 },
        { name: "Seoul Tower Boss", min: 76, max: 80 }
    ]},
    { name: "Demon's Gate", minLevel: 81, maxLevel: 100, enemies: [
        { name: "Gatekeeper", min: 81, max: 85 },
        { name: "Abyss Idol", min: 86, max: 90 },
        { name: "Demon Lord", min: 91, max: 99 },
        { name: "Final Boss", min: 100, max: 100 }
    ]}
];

function getEnemyForZone(zone, playerLevel) {
    const enemyDef = zone.enemies.find(e => playerLevel >= e.min && playerLevel <= e.max) || zone.enemies[0];
    const level = Math.min(zone.maxLevel, Math.max(zone.minLevel, playerLevel));
    const hp = Math.floor(35 + level * 11 + Math.pow(level, 1.08) * 5);
    const damage = Math.max(3, Math.floor(4 + level * 1.9 + Math.pow(level, 1.03) * 0.7));
    return {
        name: enemyDef.name,
        level,
        maxHp: hp,
        hp: hp,
        damage,
        type: "normal"
    };
}

window.zones = zones;
window.getEnemyForZone = getEnemyForZone;
