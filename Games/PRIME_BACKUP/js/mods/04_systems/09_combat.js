// js/mods/09_combat_mod.js
window.RSGame = window.RSGame || {};

(function () {

  function wikiMonsterIcon(file, size = 40) {
    const safeFile = String(file || "Coins_10000.png").replace(/^\/+/, "");
    return `https://oldschool.runescape.wiki/images/thumb/${encodeURIComponent(safeFile)}/${size}px-${encodeURIComponent(safeFile)}`;
  }

  function createMonster(def) {
    const level = Math.max(1, Number(def.lvl) || 1);
    const hp = Math.max(3, Number(def.hp) || Math.round(level * 1.55));
    const maxHit = Math.max(1, Number(def.maxHit) || Math.max(1, Math.round(level / 8)));
    const xpPerHit = Math.max(4, Number(def.xpPerHit) || Math.round(hp * 0.75));
    const iconFile = def.iconFile || `${String(def.name || def.id || "Monster").replace(/[^A-Za-z0-9]+/g, "_")}.png`;
    const slayerLevel = Math.max(0, Number(def.slayerLevel) || 0);
    const slayerXp = Number.isFinite(Number(def.slayerXp)) && Number(def.slayerXp) > 0
      ? Number(def.slayerXp)
      : Math.round(hp * 10) / 10;

    return {
      id: String(def.id),
      name: def.name,
      lvl: level,
      hp,
      maxHit,
      xpPerHit,
      coinMin: Math.max(0, Number(def.coinMin) || Math.max(0, Math.floor(level * 0.4))),
      coinMax: Math.max(0, Number(def.coinMax) || Math.max(3, Math.round(level * 3.2))),
      icon: def.icon || wikiMonsterIcon(iconFile),
      iconFile,
      slayerLevel,
      slayerXp,
      slayerMasters: Array.isArray(def.slayerMasters) ? def.slayerMasters.slice() : [],
      taskName: def.taskName || def.name,
      taskCountScale: Math.max(0.35, Number(def.taskCountScale) || 1)
    };
  }

  /* ==========================================================
     MONSTER TABLE
  ========================================================== */
  const MONSTER_DEFS = [
    { id: "chicken", name: "Chicken", lvl: 1, hp: 3, maxHit: 1, xpPerHit: 4, coinMin: 0, coinMax: 3, iconFile: "Chicken.png" },
    { id: "rat", name: "Giant Rat", lvl: 3, hp: 5, maxHit: 1, xpPerHit: 5, coinMin: 0, coinMax: 5, iconFile: "Giant_rat.png", slayerLevel: 1, slayerMasters: ["Turael", "Spria"], taskName: "Rats" },
    { id: "goblin", name: "Goblin", lvl: 2, hp: 5, maxHit: 1, xpPerHit: 5, coinMin: 1, coinMax: 10, iconFile: "Goblin.png", slayerLevel: 1, slayerMasters: ["Turael", "Spria"], taskName: "Goblins" },
    { id: "cow", name: "Cow", lvl: 2, hp: 8, maxHit: 1, xpPerHit: 8, coinMin: 0, coinMax: 5, iconFile: "Cow.png", slayerLevel: 1, slayerMasters: ["Turael", "Spria"], taskName: "Cows" },
    { id: "barbarian", name: "Barbarian", lvl: 10, hp: 20, maxHit: 4, xpPerHit: 16, coinMin: 3, coinMax: 18, iconFile: "Barbarian.png" },
    { id: "guard", name: "Guard", lvl: 21, hp: 22, maxHit: 3, xpPerHit: 19.7, coinMin: 5, coinMax: 30, iconFile: "Guard.png" },
    { id: "al_kharid", name: "Al-Kharid Warrior", lvl: 9, hp: 19, maxHit: 2, xpPerHit: 16.5, coinMin: 8, coinMax: 40, iconFile: "Al-Kharid_warrior.png" },
    { id: "dark_wizard", name: "Dark Wizard", lvl: 7, hp: 12, maxHit: 1, xpPerHit: 10.8, coinMin: 10, coinMax: 50, iconFile: "Dark_wizard_(level_20).png" },
    { id: "hill_giant", name: "Hill Giant", lvl: 28, hp: 35, maxHit: 3, xpPerHit: 35, coinMin: 15, coinMax: 80, iconFile: "Hill_Giant.png", slayerLevel: 1, slayerMasters: ["Krystilia", "Mazchna", "Vannaka"], taskName: "Hill Giants" },
    { id: "moss_giant", name: "Moss Giant", lvl: 42, hp: 60, maxHit: 6, xpPerHit: 60, coinMin: 20, coinMax: 100, iconFile: "Moss_giant.png", slayerLevel: 1, slayerMasters: ["Krystilia", "Vannaka"], taskName: "Moss giants" },
    { id: "ogre", name: "Ogre", lvl: 53, hp: 60, maxHit: 7, xpPerHit: 60, coinMin: 30, coinMax: 150, iconFile: "Ogre.png", slayerLevel: 1, slayerMasters: ["Vannaka"], taskName: "Ogres" },
    { id: "lesser_demon", name: "Lesser Demon", lvl: 59, hp: 79, maxHit: 8, xpPerHit: 79, coinMin: 40, coinMax: 250, iconFile: "Lesser_demon.png", slayerLevel: 1, slayerMasters: ["Krystilia", "Vannaka", "Chaeldar"], taskName: "Lesser demons" },
    { id: "greater_demon", name: "Greater Demon", lvl: 92, hp: 87, maxHit: 11, xpPerHit: 87, coinMin: 80, coinMax: 400, iconFile: "Greater_demon.png", slayerLevel: 1, slayerMasters: ["Krystilia", "Chaeldar", "Konar quo Maten", "Nieve", "Duradel"], taskName: "Greater demons" },
    { id: "black_demon", name: "Black Demon", lvl: 172, hp: 157, maxHit: 19, xpPerHit: 157, coinMin: 150, coinMax: 600, iconFile: "Black_demon.png", slayerLevel: 1, slayerMasters: ["Krystilia", "Chaeldar", "Konar quo Maten", "Nieve", "Duradel"], taskName: "Black demons" },
    { id: "kbd", name: "King Black Dragon", lvl: 276, hp: 240, maxHit: 25, xpPerHit: 258, coinMin: 500, coinMax: 2000, iconFile: "King_Black_Dragon.png" },
    { id: "aberrant_spectre", name: "Aberrant Spectre", lvl: 96, hp: 90, maxHit: 11, slayerLevel: 60, slayerXp: 90, slayerMasters: ["Vannaka", "Chaeldar", "Konar quo Maten", "Nieve", "Duradel"], taskName: "Aberrant spectres" },
    { id: "abyssal_demon", name: "Abyssal Demon", lvl: 124, hp: 150, maxHit: 18, slayerLevel: 85, slayerXp: 150, coinMin: 180, coinMax: 950, slayerMasters: ["Vannaka", "Chaeldar", "Konar quo Maten", "Nieve", "Duradel"], taskName: "Abyssal demons" },
    { id: "ankou", name: "Ankou", lvl: 75, hp: 60, maxHit: 8, slayerLevel: 1, slayerMasters: ["Krystilia", "Vannaka", "Konar quo Maten", "Nieve", "Duradel"], taskName: "Ankous" },
    { id: "araxyte", name: "Araxyte", lvl: 96, hp: 60, maxHit: 13, slayerLevel: 92, slayerXp: 60, coinMin: 150, coinMax: 700, slayerMasters: ["Nieve", "Duradel"], taskName: "Araxytes" },
    { id: "banshee", name: "Banshee", lvl: 23, hp: 22, maxHit: 3, slayerLevel: 15, slayerXp: 22, slayerMasters: ["Turael", "Spria", "Mazchna", "Vannaka", "Chaeldar"], taskName: "Banshees" },
    { id: "basilisk", name: "Basilisk", lvl: 61, hp: 75, maxHit: 8, slayerLevel: 40, slayerXp: 75, slayerMasters: ["Vannaka", "Chaeldar", "Konar quo Maten", "Nieve", "Duradel"], taskName: "Basilisks" },
    { id: "bat", name: "Bat", lvl: 6, hp: 8, maxHit: 1, slayerLevel: 1, coinMin: 0, coinMax: 4, iconFile: "Giant_bat.png", slayerMasters: ["Turael", "Spria", "Mazchna"], taskName: "Bats" },
    { id: "bear", name: "Bear", lvl: 21, hp: 25, maxHit: 4, slayerLevel: 1, iconFile: "Grizzly_bear.png", slayerMasters: ["Krystilia", "Turael", "Spria", "Mazchna"], taskName: "Bears" },
    { id: "bird", name: "Bird", lvl: 2, hp: 5, maxHit: 1, slayerLevel: 1, iconFile: "Terrorbird.png", slayerMasters: ["Turael", "Spria"], taskName: "Birds", taskCountScale: 1.1 },
    { id: "black_dragon", name: "Black Dragon", lvl: 227, hp: 190, maxHit: 20, slayerLevel: 1, coinMin: 250, coinMax: 1400, slayerMasters: ["Krystilia", "Konar quo Maten", "Nieve", "Duradel"], taskName: "Black dragons" },
    { id: "bloodveld", name: "Bloodveld", lvl: 81, hp: 120, maxHit: 9, slayerLevel: 50, slayerXp: 120, slayerMasters: ["Krystilia", "Vannaka", "Chaeldar", "Konar quo Maten", "Nieve", "Duradel"], taskName: "Bloodvelds" },
    { id: "blue_dragon", name: "Blue Dragon", lvl: 111, hp: 105, maxHit: 12, slayerLevel: 1, coinMin: 120, coinMax: 700, slayerMasters: ["Vannaka", "Chaeldar", "Konar quo Maten", "Nieve", "Duradel"], taskName: "Blue dragons" },
    { id: "brine_rat", name: "Brine Rat", lvl: 70, hp: 47, maxHit: 7, slayerLevel: 47, slayerXp: 47, slayerMasters: ["Turael", "Spria", "Vannaka", "Chaeldar", "Konar quo Maten", "Nieve"], taskName: "Brine rats" },
    { id: "bronze_dragon", name: "Bronze Dragon", lvl: 131, hp: 110, maxHit: 14, slayerLevel: 1, coinMin: 130, coinMax: 760, slayerMasters: ["Vannaka", "Chaeldar", "Konar quo Maten"], taskName: "Bronze dragons" },
    { id: "catablepon", name: "Catablepon", lvl: 49, hp: 42, maxHit: 6, slayerLevel: 1, slayerMasters: ["Mazchna"] },
    { id: "cave_bug", name: "Cave Bug", lvl: 6, hp: 5, maxHit: 1, slayerLevel: 7, slayerXp: 5, slayerMasters: ["Turael", "Spria", "Mazchna", "Vannaka"], taskName: "Cave bugs" },
    { id: "cave_kraken", name: "Cave Kraken", lvl: 127, hp: 125, maxHit: 14, slayerLevel: 87, slayerXp: 125, coinMin: 240, coinMax: 1300, slayerMasters: ["Chaeldar", "Konar quo Maten", "Nieve", "Duradel"], taskName: "Cave krakens" },
    { id: "cave_crawler", name: "Cave Crawler", lvl: 23, hp: 22, maxHit: 3, slayerLevel: 10, slayerXp: 22, slayerMasters: ["Turael", "Spria", "Mazchna", "Vannaka", "Chaeldar"], taskName: "Cave crawlers" },
    { id: "cave_horror", name: "Cave Horror", lvl: 80, hp: 55, maxHit: 10, slayerLevel: 58, slayerXp: 55, slayerMasters: ["Chaeldar", "Nieve", "Duradel"], taskName: "Cave horrors" },
    { id: "cave_slime", name: "Cave Slime", lvl: 23, hp: 25, maxHit: 3, slayerLevel: 17, slayerXp: 25, slayerMasters: ["Turael", "Spria", "Mazchna", "Vannaka", "Chaeldar"], taskName: "Cave slimes" },
    { id: "cockatrice", name: "Cockatrice", lvl: 37, hp: 37, maxHit: 5, slayerLevel: 25, slayerXp: 37, slayerMasters: ["Mazchna", "Vannaka", "Chaeldar"], taskName: "Cockatrices" },
    { id: "crawling_hand", name: "Crawling Hand", lvl: 12, hp: 16, maxHit: 2, slayerLevel: 5, slayerXp: 16, slayerMasters: ["Turael", "Spria", "Mazchna", "Vannaka"], taskName: "Crawling Hands" },
    { id: "crocodile", name: "Crocodile", lvl: 53, hp: 45, maxHit: 6, slayerLevel: 1, slayerMasters: ["Vannaka"], taskName: "Crocodiles" },
    { id: "cyclops", name: "Cyclops", lvl: 56, hp: 75, maxHit: 7, slayerLevel: 1, slayerMasters: ["Mazchna", "Vannaka"], taskName: "Cyclopes" },
    { id: "dagannoth", name: "Dagannoth", lvl: 74, hp: 70, maxHit: 8, slayerLevel: 1, slayerMasters: ["Vannaka", "Chaeldar", "Konar quo Maten", "Nieve", "Duradel"], taskName: "Dagannoths" },
    { id: "dark_beast", name: "Dark Beast", lvl: 182, hp: 220, maxHit: 18, slayerLevel: 90, slayerXp: 225.4, coinMin: 240, coinMax: 1400, slayerMasters: ["Konar quo Maten", "Nieve", "Duradel"], taskName: "Dark beasts" },
    { id: "desert_lizard", name: "Desert Lizard", lvl: 24, hp: 25, maxHit: 3, slayerLevel: 22, slayerXp: 25, slayerMasters: ["Turael", "Spria", "Mazchna", "Vannaka", "Chaeldar"], taskName: "Desert Lizards" },
    { id: "dog", name: "Dog", lvl: 28, hp: 18, maxHit: 3, slayerLevel: 1, iconFile: "Guard_dog.png", slayerMasters: ["Turael", "Spria", "Mazchna"], taskName: "Dogs" },
    { id: "dust_devil", name: "Dust Devil", lvl: 93, hp: 105, maxHit: 11, slayerLevel: 65, slayerXp: 105, slayerMasters: ["Vannaka", "Chaeldar", "Konar quo Maten", "Nieve", "Duradel"], taskName: "Dust devils" },
    { id: "dwarf", name: "Dwarf", lvl: 20, hp: 18, maxHit: 3, slayerLevel: 1, slayerMasters: ["Turael", "Spria"], taskName: "Dwarfs" },
    { id: "earth_warrior", name: "Earth Warrior", lvl: 51, hp: 54, maxHit: 6, slayerLevel: 1, slayerMasters: ["Krystilia"], taskName: "Earth warriors" },
    { id: "elf", name: "Elf", lvl: 90, hp: 85, maxHit: 9, slayerLevel: 1, slayerMasters: ["Vannaka", "Chaeldar", "Nieve", "Duradel"], taskName: "Elves" },
    { id: "fever_spider", name: "Fever Spider", lvl: 49, hp: 40, maxHit: 6, slayerLevel: 42, slayerXp: 40, slayerMasters: ["Vannaka", "Chaeldar"], taskName: "Fever spiders" },
    { id: "fire_giant", name: "Fire Giant", lvl: 86, hp: 111, maxHit: 11, slayerLevel: 1, coinMin: 100, coinMax: 520, slayerMasters: ["Krystilia", "Vannaka", "Chaeldar", "Konar quo Maten", "Nieve", "Duradel"], taskName: "Fire giants" },
    { id: "flesh_crawler", name: "Flesh Crawler", lvl: 41, hp: 35, maxHit: 4, slayerLevel: 1, slayerMasters: ["Mazchna"], taskName: "Flesh Crawlers" },
    { id: "gargoyle", name: "Gargoyle", lvl: 111, hp: 105, maxHit: 12, slayerLevel: 75, slayerXp: 105, slayerMasters: ["Vannaka", "Chaeldar", "Konar quo Maten", "Nieve", "Duradel"], taskName: "Gargoyles" },
    { id: "ghost", name: "Ghost", lvl: 25, hp: 20, maxHit: 3, slayerLevel: 1, slayerMasters: ["Turael", "Spria", "Mazchna"], taskName: "Ghosts" },
    { id: "ghoul", name: "Ghoul", lvl: 42, hp: 35, maxHit: 5, slayerLevel: 1, slayerMasters: ["Mazchna", "Vannaka"], taskName: "Ghouls" },
    { id: "green_dragon", name: "Green Dragon", lvl: 79, hp: 75, maxHit: 10, slayerLevel: 1, coinMin: 80, coinMax: 420, slayerMasters: ["Krystilia", "Vannaka"], taskName: "Green dragons" },
    { id: "harpie_bug_swarm", name: "Harpie Bug Swarm", lvl: 46, hp: 25, maxHit: 4, slayerLevel: 33, slayerXp: 25, slayerMasters: ["Vannaka", "Chaeldar"], taskName: "Harpie Bug Swarms" },
    { id: "hellhound", name: "Hellhound", lvl: 122, hp: 116, maxHit: 13, slayerLevel: 1, coinMin: 120, coinMax: 640, slayerMasters: ["Krystilia", "Vannaka", "Chaeldar", "Konar quo Maten", "Nieve", "Duradel"], taskName: "Hellhounds" },
    { id: "hobgoblin", name: "Hobgoblin", lvl: 28, hp: 32, maxHit: 4, slayerLevel: 1, slayerMasters: ["Mazchna", "Vannaka"], taskName: "Hobgoblins" },
    { id: "icefiend", name: "Icefiend", lvl: 13, hp: 10, maxHit: 2, slayerLevel: 1, slayerMasters: ["Turael", "Spria"], taskName: "Icefiends" },
    { id: "ice_giant", name: "Ice Giant", lvl: 53, hp: 60, maxHit: 7, slayerLevel: 1, slayerMasters: ["Krystilia", "Vannaka"], taskName: "Ice giants" },
    { id: "ice_warrior", name: "Ice Warrior", lvl: 57, hp: 58, maxHit: 7, slayerLevel: 1, slayerMasters: ["Krystilia", "Mazchna", "Vannaka"], taskName: "Ice warriors" },
    { id: "infernal_mage", name: "Infernal Mage", lvl: 66, hp: 60, maxHit: 8, slayerLevel: 45, slayerXp: 60, slayerMasters: ["Vannaka", "Chaeldar"], taskName: "Infernal Mages" },
    { id: "iron_dragon", name: "Iron Dragon", lvl: 189, hp: 170, maxHit: 17, slayerLevel: 1, coinMin: 160, coinMax: 920, slayerMasters: ["Chaeldar", "Konar quo Maten", "Nieve", "Duradel"], taskName: "Iron dragons" },
    { id: "jelly", name: "Jelly", lvl: 78, hp: 75, maxHit: 8, slayerLevel: 52, slayerXp: 75, slayerMasters: ["Vannaka", "Chaeldar", "Konar quo Maten"], taskName: "Jellies" },
    { id: "jungle_horror", name: "Jungle Horror", lvl: 79, hp: 65, maxHit: 7, slayerLevel: 1, slayerMasters: ["Vannaka", "Chaeldar"], taskName: "Jungle horrors" },
    { id: "kalphite", name: "Kalphite", lvl: 28, hp: 40, maxHit: 5, slayerLevel: 1, slayerMasters: ["Turael", "Spria", "Mazchna", "Vannaka", "Chaeldar", "Konar quo Maten", "Nieve", "Duradel"], taskName: "Kalphites" },
    { id: "killerwatt", name: "Killerwatt", lvl: 55, hp: 51, maxHit: 7, slayerLevel: 37, slayerXp: 51, slayerMasters: ["Mazchna", "Vannaka"], taskName: "Killerwatts" },
    { id: "kurask", name: "Kurask", lvl: 106, hp: 97, maxHit: 12, slayerLevel: 70, slayerXp: 97, slayerMasters: ["Vannaka", "Chaeldar", "Konar quo Maten", "Nieve", "Duradel"], taskName: "Kurasks" },
    { id: "mithril_dragon", name: "Mithril Dragon", lvl: 304, hp: 220, maxHit: 22, slayerLevel: 1, coinMin: 220, coinMax: 1200, slayerMasters: ["Konar quo Maten", "Nieve", "Duradel"], taskName: "Mithril dragons" },
    { id: "minotaur", name: "Minotaur", lvl: 27, hp: 26, maxHit: 3, slayerLevel: 1, slayerMasters: ["Turael", "Spria"], taskName: "Minotaurs" },
    { id: "mogre", name: "Mogre", lvl: 60, hp: 48, maxHit: 7, slayerLevel: 32, slayerXp: 48, slayerMasters: ["Mazchna", "Vannaka", "Chaeldar"], taskName: "Mogres" },
    { id: "molanisk", name: "Molanisk", lvl: 51, hp: 52, maxHit: 6, slayerLevel: 39, slayerXp: 52, slayerMasters: ["Vannaka", "Chaeldar"], taskName: "Molanisks" },
    { id: "monkey", name: "Monkey", lvl: 25, hp: 18, maxHit: 3, slayerLevel: 1, slayerMasters: ["Turael", "Spria"], taskName: "Monkeys" },
    { id: "nechryael", name: "Nechryael", lvl: 115, hp: 105, maxHit: 13, slayerLevel: 80, slayerXp: 105, slayerMasters: ["Vannaka", "Chaeldar", "Konar quo Maten", "Nieve", "Duradel"] },
    { id: "otherworldly_being", name: "Otherworldly Being", lvl: 64, hp: 66, maxHit: 8, slayerLevel: 1, slayerMasters: ["Vannaka"], taskName: "Otherworldly beings" },
    { id: "pyrefiend", name: "Pyrefiend", lvl: 48, hp: 45, maxHit: 6, slayerLevel: 30, slayerXp: 45, slayerMasters: ["Mazchna", "Vannaka", "Chaeldar"], taskName: "Pyrefiends" },
    { id: "red_dragon", name: "Red Dragon", lvl: 152, hp: 140, maxHit: 16, slayerLevel: 1, coinMin: 170, coinMax: 950, slayerMasters: ["Konar quo Maten", "Nieve", "Duradel"], taskName: "Red dragons" },
    { id: "rockslug", name: "Rockslug", lvl: 29, hp: 27, maxHit: 4, slayerLevel: 20, slayerXp: 27, slayerMasters: ["Mazchna", "Vannaka", "Chaeldar"], taskName: "Rockslugs" },
    { id: "scabarite", name: "Scabarite", lvl: 60, hp: 58, maxHit: 7, slayerLevel: 1, slayerMasters: ["Nieve"], taskName: "Scabarites" },
    { id: "scorpion", name: "Scorpion", lvl: 14, hp: 17, maxHit: 2, slayerLevel: 1, slayerMasters: ["Krystilia", "Turael", "Spria", "Mazchna"], taskName: "Scorpions" },
    { id: "sea_snake", name: "Sea Snake", lvl: 90, hp: 85, maxHit: 9, slayerLevel: 1, slayerMasters: ["Vannaka"], taskName: "Sea snakes" },
    { id: "shade", name: "Shade", lvl: 40, hp: 38, maxHit: 5, slayerLevel: 1, slayerMasters: ["Mazchna", "Vannaka"], taskName: "Shades" },
    { id: "shadow_warrior", name: "Shadow Warrior", lvl: 67, hp: 70, maxHit: 8, slayerLevel: 1, slayerMasters: ["Vannaka", "Chaeldar"], taskName: "Shadow warriors" },
    { id: "skeletal_wyvern", name: "Skeletal Wyvern", lvl: 140, hp: 210, maxHit: 16, slayerLevel: 72, slayerXp: 210, coinMin: 220, coinMax: 1100, slayerMasters: ["Chaeldar", "Konar quo Maten", "Nieve", "Duradel"], taskName: "Skeletal Wyverns" },
    { id: "spiritual_mage", name: "Spiritual Mage", lvl: 120, hp: 85, maxHit: 12, slayerLevel: 83, slayerXp: 85, slayerMasters: ["Krystilia", "Vannaka", "Chaeldar", "Nieve", "Duradel"], taskName: "Spiritual mage" },
    { id: "spiritual_ranger", name: "Spiritual Ranger", lvl: 115, hp: 100, maxHit: 11, slayerLevel: 63, slayerXp: 100, slayerMasters: ["Krystilia", "Vannaka", "Chaeldar", "Nieve", "Duradel"], taskName: "Spiritual ranger" },
    { id: "spiritual_warrior", name: "Spiritual Warrior", lvl: 115, hp: 100, maxHit: 11, slayerLevel: 68, slayerXp: 100, slayerMasters: ["Krystilia", "Vannaka", "Chaeldar", "Nieve", "Duradel"], taskName: "Spiritual warrior" },
    { id: "skeleton", name: "Skeleton", lvl: 25, hp: 22, maxHit: 3, slayerLevel: 1, slayerMasters: ["Krystilia", "Turael", "Spria", "Mazchna"], taskName: "Skeletons" },
    { id: "spider", name: "Spider", lvl: 24, hp: 20, maxHit: 3, slayerLevel: 1, slayerMasters: ["Krystilia", "Turael", "Spria"], taskName: "Spiders" },
    { id: "steel_dragon", name: "Steel Dragon", lvl: 246, hp: 210, maxHit: 21, slayerLevel: 1, coinMin: 210, coinMax: 1100, slayerMasters: ["Chaeldar", "Konar quo Maten", "Nieve", "Duradel"], taskName: "Steel dragons" },
    { id: "suqah", name: "Suqah", lvl: 111, hp: 110, maxHit: 12, slayerLevel: 1, slayerMasters: ["Nieve", "Duradel"], taskName: "Suqahs" },
    { id: "terror_dog", name: "Terror Dog", lvl: 110, hp: 87, maxHit: 11, slayerLevel: 40, slayerXp: 87, slayerMasters: ["Vannaka"], taskName: "Terror Dogs" },
    { id: "troll", name: "Troll", lvl: 69, hp: 80, maxHit: 9, slayerLevel: 1, slayerMasters: ["Vannaka", "Chaeldar", "Konar quo Maten", "Nieve", "Duradel"], taskName: "Trolls" },
    { id: "turoth", name: "Turoth", lvl: 83, hp: 76, maxHit: 9, slayerLevel: 55, slayerXp: 76, slayerMasters: ["Vannaka", "Chaeldar", "Konar quo Maten", "Nieve"], taskName: "Turoths" },
    { id: "vampyre", name: "Vampyre", lvl: 87, hp: 78, maxHit: 9, slayerLevel: 1, slayerMasters: ["Mazchna", "Vannaka", "Chaeldar", "Konar quo Maten", "Nieve", "Duradel"], taskName: "Vampyres" },
    { id: "wall_beast", name: "Wall Beast", lvl: 49, hp: 105, maxHit: 7, slayerLevel: 35, slayerXp: 105, slayerMasters: ["Mazchna", "Vannaka", "Chaeldar"], taskName: "Wall beasts", taskCountScale: 0.8 },
    { id: "warped_creature", name: "Warped Creature", lvl: 112, hp: 140, maxHit: 12, slayerLevel: 56, slayerXp: 140, iconFile: "Warped_Terrorbird.png", slayerMasters: ["Chaeldar", "Konar quo Maten", "Nieve", "Duradel"], taskName: "Warped creatures" },
    { id: "waterfiend", name: "Waterfiend", lvl: 115, hp: 128, maxHit: 12, slayerLevel: 1, slayerMasters: ["Nieve", "Duradel"], taskName: "Waterfiends" },
    { id: "werewolf", name: "Werewolf", lvl: 64, hp: 60, maxHit: 8, slayerLevel: 1, slayerMasters: ["Vannaka"], taskName: "Werewolves" },
    { id: "wolf", name: "Wolf", lvl: 14, hp: 12, maxHit: 2, slayerLevel: 1, slayerMasters: ["Turael", "Spria", "Mazchna"], taskName: "Wolves" },
    { id: "zombie", name: "Zombie", lvl: 24, hp: 22, maxHit: 3, slayerLevel: 1, slayerMasters: ["Krystilia", "Turael", "Spria", "Mazchna"], taskName: "Zombies" },
    { id: "zygomite", name: "Zygomite", lvl: 74, hp: 65, maxHit: 8, slayerLevel: 57, slayerXp: 65, slayerMasters: ["Chaeldar", "Konar quo Maten", "Nieve", "Duradel"], taskName: "Zygomites" }
  ];

  const BOSS_DEFS = [
    { id: "abyssal_sire", name: "Abyssal Sire", lvl: 350, hp: 400, maxHit: 36, coinMin: 1200, coinMax: 5200 },
    { id: "alchemical_hydra", name: "Alchemical Hydra", lvl: 426, hp: 1100, maxHit: 42, slayerLevel: 95, slayerXp: 1100, coinMin: 1800, coinMax: 7800 },
    { id: "bryophyta", name: "Bryophyta", lvl: 128, hp: 115, maxHit: 16, coinMin: 180, coinMax: 1200 },
    { id: "callisto", name: "Callisto", lvl: 470, hp: 255, maxHit: 38, coinMin: 1500, coinMax: 6500 },
    { id: "cerberus", name: "Cerberus", lvl: 318, hp: 600, maxHit: 28, slayerLevel: 91, slayerXp: 690, coinMin: 1100, coinMax: 5500 },
    { id: "chaos_elemental", name: "Chaos Elemental", lvl: 305, hp: 250, maxHit: 32, coinMin: 900, coinMax: 4200 },
    { id: "chaos_fanatic", name: "Chaos Fanatic", lvl: 202, hp: 225, maxHit: 21, coinMin: 500, coinMax: 2600 },
    { id: "crazy_archaeologist", name: "Crazy Archaeologist", lvl: 204, hp: 225, maxHit: 24, coinMin: 520, coinMax: 2600 },
    { id: "dagannoth_prime", name: "Dagannoth Prime", lvl: 303, hp: 255, maxHit: 24, coinMin: 760, coinMax: 3600 },
    { id: "dagannoth_rex", name: "Dagannoth Rex", lvl: 303, hp: 255, maxHit: 27, coinMin: 760, coinMax: 3600 },
    { id: "dagannoth_supreme", name: "Dagannoth Supreme", lvl: 303, hp: 255, maxHit: 26, coinMin: 760, coinMax: 3600 },
    { id: "deranged_archaeologist", name: "Deranged Archaeologist", lvl: 284, hp: 225, maxHit: 26, coinMin: 700, coinMax: 3200 },
    { id: "general_graardor", name: "General Graardor", lvl: 624, hp: 255, maxHit: 60, coinMin: 1800, coinMax: 7600 },
    { id: "giant_mole", name: "Giant Mole", lvl: 230, hp: 200, maxHit: 21, coinMin: 400, coinMax: 2000 },
    { id: "grotesque_guardians", name: "Grotesque Guardians", lvl: 420, hp: 900, maxHit: 34, slayerLevel: 75, slayerXp: 900, coinMin: 1400, coinMax: 6500 },
    { id: "hespori", name: "Hespori", lvl: 284, hp: 300, maxHit: 18, coinMin: 650, coinMax: 2800 },
    { id: "kalphite_queen", name: "Kalphite Queen", lvl: 333, hp: 510, maxHit: 31, coinMin: 900, coinMax: 4300 },
    { id: "kraken_boss", name: "Kraken", lvl: 291, hp: 255, maxHit: 28, slayerLevel: 87, slayerXp: 255, coinMin: 900, coinMax: 4600 },
    { id: "kreearra", name: "Kree'arra", lvl: 580, hp: 255, maxHit: 69, coinMin: 1800, coinMax: 7600 },
    { id: "kril_tsutsaroth", name: "K'ril Tsutsaroth", lvl: 650, hp: 255, maxHit: 49, coinMin: 1800, coinMax: 7600 },
    { id: "nex", name: "Nex", lvl: 1001, hp: 3400, maxHit: 65, coinMin: 2600, coinMax: 12000 },
    { id: "nightmare", name: "Nightmare", lvl: 814, hp: 2400, maxHit: 80, coinMin: 2200, coinMax: 11000 },
    { id: "obor", name: "Obor", lvl: 106, hp: 120, maxHit: 14, coinMin: 180, coinMax: 1000 },
    { id: "phantom_muspah", name: "Phantom Muspah", lvl: 302, hp: 850, maxHit: 28, coinMin: 1200, coinMax: 5200 },
    { id: "sarachnis", name: "Sarachnis", lvl: 318, hp: 400, maxHit: 31, coinMin: 950, coinMax: 3900 },
    { id: "scorpia", name: "Scorpia", lvl: 225, hp: 200, maxHit: 20, coinMin: 500, coinMax: 2500 },
    { id: "skotizo", name: "Skotizo", lvl: 321, hp: 450, maxHit: 42, coinMin: 1100, coinMax: 5200 },
    { id: "spindel", name: "Spindel", lvl: 329, hp: 500, maxHit: 30, coinMin: 1100, coinMax: 4800 },
    { id: "venenatis", name: "Venenatis", lvl: 464, hp: 850, maxHit: 46, coinMin: 1500, coinMax: 7200 },
    { id: "vetion", name: "Vet'ion", lvl: 454, hp: 850, maxHit: 46, coinMin: 1500, coinMax: 7200 },
    { id: "vorkath", name: "Vorkath", lvl: 732, hp: 750, maxHit: 56, coinMin: 1700, coinMax: 8200 },
    { id: "whisperer", name: "The Whisperer", lvl: 381, hp: 900, maxHit: 34, coinMin: 1400, coinMax: 6200 },
    { id: "leviathan", name: "The Leviathan", lvl: 358, hp: 900, maxHit: 34, coinMin: 1400, coinMax: 6200 },
    { id: "vardorvis", name: "Vardorvis", lvl: 454, hp: 700, maxHit: 38, coinMin: 1500, coinMax: 7000 },
    { id: "duke_sucellus", name: "Duke Sucellus", lvl: 339, hp: 1100, maxHit: 34, coinMin: 1400, coinMax: 6200 },
    { id: "zulrah", name: "Zulrah", lvl: 725, hp: 500, maxHit: 41, coinMin: 1200, coinMax: 5600 },
    { id: "corporeal_beast", name: "Corporeal Beast", lvl: 785, hp: 2000, maxHit: 65, coinMin: 2200, coinMax: 9500 },
    { id: "commander_zilyana", name: "Commander Zilyana", lvl: 596, hp: 255, maxHit: 49, coinMin: 1800, coinMax: 7600 },
    { id: "thermonuclear_smoke_devil", name: "Thermonuclear Smoke Devil", lvl: 301, hp: 240, maxHit: 29, slayerLevel: 93, slayerXp: 240, coinMin: 900, coinMax: 4300 },
    { id: "artio", name: "Artio", lvl: 275, hp: 450, maxHit: 31, coinMin: 900, coinMax: 4200 },
    { id: "calvarion", name: "Calvar'ion", lvl: 149, hp: 300, maxHit: 28, coinMin: 700, coinMax: 3200 },
    { id: "scurrius", name: "Scurrius", lvl: 259, hp: 600, maxHit: 23, coinMin: 650, coinMax: 3000 },
    { id: "hueycoatl", name: "The Hueycoatl", lvl: 381, hp: 1200, maxHit: 38, coinMin: 1300, coinMax: 6200 },
    { id: "mimic", name: "The Mimic", lvl: 379, hp: 400, maxHit: 36, coinMin: 1200, coinMax: 5200 }
  ];

  const MONSTERS = MONSTER_DEFS.concat(BOSS_DEFS).map(createMonster);
  const MONSTERS_BY_ID = Object.fromEntries(MONSTERS.map((monster) => [monster.id, monster]));
  const MONSTER_DROP_COMMON = {
    low: [
      { id: "bones", name: "Bones", icon: "Bones.png", qtyMin: 1, qtyMax: 1, weight: 25 },
      { id: "feather", name: "Feather", icon: "Feather.png", qtyMin: 5, qtyMax: 15, weight: 20 },
      { id: "raw_chicken", name: "Raw chicken", icon: "Raw_chicken.png", qtyMin: 1, qtyMax: 1, weight: 15 },
      { id: "air_rune", name: "Air rune", icon: "Air_rune.png", qtyMin: 1, qtyMax: 5, weight: 10 },
      { id: "mind_rune", name: "Mind rune", icon: "Mind_rune.png", qtyMin: 1, qtyMax: 3, weight: 8 },
      { id: "iron_ore", name: "Iron ore", icon: "Iron_ore.png", qtyMin: 1, qtyMax: 1, weight: 5 },
      { id: "normal_log", name: "Logs", icon: "Logs.png", qtyMin: 1, qtyMax: 3, weight: 5 }
    ],
    mid: [
      { id: "big_bones", name: "Big bones", icon: "Big_bones.png", qtyMin: 1, qtyMax: 1, weight: 25 },
      { id: "death_rune", name: "Death rune", icon: "Death_rune.png", qtyMin: 2, qtyMax: 8, weight: 18 },
      { id: "nature_rune", name: "Nature rune", icon: "Nature_rune.png", qtyMin: 1, qtyMax: 4, weight: 15 },
      { id: "steel_arrow", name: "Steel arrow", icon: "Steel_arrow_5.png", qtyMin: 5, qtyMax: 15, weight: 12 },
      { id: "adamant_arrow", name: "Adamant arrow", icon: "Adamant_arrow_5.png", qtyMin: 1, qtyMax: 5, weight: 8 },
      { id: "coal", name: "Coal", icon: "Coal.png", qtyMin: 1, qtyMax: 3, weight: 10 },
      { id: "yew_log", name: "Yew Logs", icon: "Yew_logs.png", qtyMin: 1, qtyMax: 2, weight: 6 }
    ],
    high: [
      { id: "dragon_arrow", name: "Dragon arrow", icon: "Dragon_arrow_5.png", qtyMin: 2, qtyMax: 8, weight: 12 },
      { id: "dragon_dart", name: "Dragon dart", icon: "Dragon_dart.png", qtyMin: 2, qtyMax: 6, weight: 12 },
      { id: "blood_rune", name: "Blood rune", icon: "Blood_rune.png", qtyMin: 3, qtyMax: 12, weight: 15 },
      { id: "soul_rune", name: "Soul rune", icon: "Soul_rune.png", qtyMin: 2, qtyMax: 10, weight: 13 },
      { id: "runite_ore", name: "Runite ore", icon: "Runite_ore.png", qtyMin: 1, qtyMax: 2, weight: 8 },
      { id: "magic_log", name: "Magic Logs", icon: "Magic_logs.png", qtyMin: 1, qtyMax: 3, weight: 10 },
      { id: "raw_shark", name: "Raw shark", icon: "Raw_shark.png", qtyMin: 1, qtyMax: 3, weight: 8 },
      { id: "snapdragon_seed", name: "Snapdragon seed", icon: "Snapdragon_seed_5.png", qtyMin: 1, qtyMax: 1, weight: 6 }
    ]
  };

  const BOSS_UNIQUE_DROPS = {
    kbd: [
      { id: "draconic_visage", name: "Draconic visage", icon: "Draconic_visage.png", weight: 2 },
      { id: "dragon_pickaxe", name: "Dragon pickaxe", icon: "Dragon_pickaxe.png", weight: 3 }
    ],
    zulrah: [
      { id: "serpentine_helm", name: "Serpentine helm", icon: "Serpentine_helm.png", weight: 3 },
      { id: "magic_fang", name: "Magic fang", icon: "Magic_fang.png", weight: 3 },
      { id: "tanzanite_fang", name: "Tanzanite fang", icon: "Tanzanite_fang.png", weight: 2 }
    ],
    vorkath: [
      { id: "skeletal_visage", name: "Skeletal visage", icon: "Skeletal_visage.png", weight: 3 },
      { id: "dragonbone_necklace", name: "Dragonbone necklace", icon: "Dragonbone_necklace.png", weight: 3 },
      { id: "vorki", name: "Vorki", icon: "Vorki.png", weight: 1 }
    ],
    cerberus: [
      { id: "primordial_crystal", name: "Primordial crystal", icon: "Primordial_crystal.png", weight: 3 },
      { id: "pegasian_crystal", name: "Pegasian crystal", icon: "Pegasian_crystal.png", weight: 3 },
      { id: "eternal_crystal", name: "Eternal crystal", icon: "Eternal_crystal.png", weight: 3 },
      { id: "smouldering_stone", name: "Smouldering stone", icon: "Smouldering_stone.png", weight: 2 }
    ],
    alchemical_hydra: [
      { id: "hydras_claw", name: "Hydra's claw", icon: "Hydra%27s_claw.png", weight: 3 },
      { id: "hydras_leather", name: "Hydra leather", icon: "Hydra_leather.png", weight: 3 },
      { id: "hydras_fang", name: "Hydra's fang", icon: "Hydra%27s_fang.png", weight: 2 }
    ],
    general_graardor: [
      { id: "bandos_chestplate", name: "Bandos chestplate", icon: "Bandos_chestplate.png", weight: 2 },
      { id: "bandos_tassets", name: "Bandos tassets", icon: "Bandos_tassets.png", weight: 2 },
      { id: "bandos_hilt", name: "Bandos hilt", icon: "Bandos_hilt.png", weight: 1 }
    ],
    kreearra: [
      { id: "armadyl_chestplate", name: "Armadyl chestplate", icon: "Armadyl_chestplate.png", weight: 2 },
      { id: "armadyl_chainskirt", name: "Armadyl chainskirt", icon: "Armadyl_chainskirt.png", weight: 2 },
      { id: "armadyl_hilt", name: "Armadyl hilt", icon: "Armadyl_hilt.png", weight: 1 }
    ],
    kril_tsutsaroth: [
      { id: "zamorakian_spear", name: "Zamorakian spear", icon: "Zamorakian_spear.png", weight: 2 },
      { id: "staff_of_the_dead", name: "Staff of the dead", icon: "Staff_of_the_dead.png", weight: 2 },
      { id: "zamorak_hilt", name: "Zamorak hilt", icon: "Zamorak_hilt.png", weight: 1 }
    ],
    nightmare: [
      { id: "inquisitors_great_helm",  name: "Inquisitor's great helm",  icon: "Inquisitor%27s_great_helm.png",  weight: 2 },
      { id: "inquisitors_hauberk",     name: "Inquisitor's hauberk",     icon: "Inquisitor%27s_hauberk.png",     weight: 2 },
      { id: "inquisitors_plateskirt",  name: "Inquisitor's plateskirt",  icon: "Inquisitor%27s_plateskirt.png",  weight: 2 },
      { id: "inquisitors_mace",        name: "Inquisitor's mace",        icon: "Inquisitor%27s_mace.png",        weight: 1 },
      { id: "nightmare_staff",         name: "Nightmare staff",          icon: "Nightmare_staff.png",            weight: 2 }
    ],
    nex: [
      { id: "torva_full_helm", name: "Torva full helm", icon: "Torva_full_helm.png", weight: 2 },
      { id: "torva_platebody", name: "Torva platebody", icon: "Torva_platebody.png", weight: 2 },
      { id: "torva_platelegs", name: "Torva platelegs", icon: "Torva_platelegs.png", weight: 2 },
      { id: "zaryte_crossbow", name: "Zaryte crossbow", icon: "Zaryte_crossbow.png", weight: 1 }
    ],
    corporeal_beast: [
      { id: "elysian_sigil", name: "Elysian sigil", icon: "Elysian_sigil.png", weight: 1 },
      { id: "spectral_sigil", name: "Spectral sigil", icon: "Spectral_sigil.png", weight: 2 },
      { id: "arcane_sigil", name: "Arcane_sigil", icon: "Arcane_sigil.png", weight: 2 }
    ],
    commander_zilyana: [
      { id: "armadyl_crossbow", name: "Armadyl crossbow", icon: "Armadyl_crossbow.png", weight: 2 },
      { id: "saradomin_hilt", name: "Saradomin hilt", icon: "Saradomin_hilt.png", weight: 1 },
      { id: "saradomin_sword", name: "Saradomin sword", icon: "Saradomin_sword.png", weight: 2 }
    ],
    thermonuclear_smoke_devil: [
      { id: "occult_necklace", name: "Occult necklace", icon: "Occult_necklace.png", weight: 2 },
      { id: "dragon_chainbody", name: "Dragon chainbody", icon: "Dragon_chainbody.png", weight: 2 },
      { id: "smoke_battlestaff", name: "Smoke battlestaff", icon: "Smoke_battlestaff.png", weight: 2 }
    ],
    calvarion: [
      { id: "voidwaker_blade", name: "Voidwaker blade", icon: "Voidwaker_blade.png", weight: 2 },
      { id: "dragon_pickaxe", name: "Dragon pickaxe", icon: "Dragon_pickaxe.png", weight: 3 }
    ],
    artio: [
      { id: "voidwaker_hilt", name: "Voidwaker hilt", icon: "Voidwaker_hilt.png", weight: 2 },
      { id: "dragon_pickaxe", name: "Dragon pickaxe", icon: "Dragon_pickaxe.png", weight: 3 }
    ],
    scurrius: [
      { id: "spine", name: "Scurrius spine", icon: "Scurrius_spine.png", weight: 3 },
      { id: "scurrius_spine", name: "Scurrius spine", icon: "Scurrius_spine.png", weight: 3 }
    ],
    hueycoatl: [
      { id: "hueycoatl_hide", name: "Hueycoatl hide", icon: "Blue_dragonhide.png", weight: 3 },
      { id: "hueycoatl_spike", name: "Hueycoatl spike", icon: "Dragon_bones.png", weight: 2 }
    ],
    mimic: [
      { id: "3rd_age_amulet", name: "3rd age amulet", icon: "3rd_age_amulet.png", weight: 1 },
      { id: "ring_of_3rd_age", name: "Ring of 3rd age", icon: "Ring_of_3rd_age.png", weight: 1 },
      { id: "3rd_age_platebody", name: "3rd age platebody", icon: "3rd_age_platebody.png", weight: 1 },
      { id: "3rd_age_platelegs", name: "3rd age platelegs", icon: "3rd_age_platelegs.png", weight: 1 },
      { id: "3rd_age_full_helmet", name: "3rd age full helmet", icon: "3rd_age_full_helmet.png", weight: 1 }
    ]
  };

  const MONSTER_DROP_THEMES = {
    dragon: [
      { id: "dragon_bones", name: "Dragon bones", icon: "Dragon_bones.png", qtyMin: 1, qtyMax: 1, weight: 28 },
      { id: "black_dragonhide", name: "Black dragonhide", icon: "Black_dragonhide.png", qtyMin: 1, qtyMax: 2, weight: 24 },
      { id: "runite_ore", name: "Runite ore", icon: "Runite_ore.png", qtyMin: 1, qtyMax: 2, weight: 16 },
      { id: "dragonstone", name: "Dragonstone", icon: "Dragonstone.png", qtyMin: 1, qtyMax: 1, weight: 10 }
    ],
    demon: [
      { id: "ashes", name: "Ashes", icon: "Ashes.png", qtyMin: 1, qtyMax: 1, weight: 28 },
      { id: "death_rune", name: "Death rune", icon: "Death_rune.png", qtyMin: 5, qtyMax: 15, weight: 22 },
      { id: "blood_rune", name: "Blood rune", icon: "Blood_rune.png", qtyMin: 3, qtyMax: 10, weight: 18 },
      { id: "ancient_shard", name: "Ancient shard", icon: "Ancient_shard.png", qtyMin: 1, qtyMax: 1, weight: 10 }
    ],
    undead: [
      { id: "bones", name: "Bones", icon: "Bones.png", qtyMin: 1, qtyMax: 1, weight: 30 },
      { id: "big_bones", name: "Big bones", icon: "Big_bones.png", qtyMin: 1, qtyMax: 1, weight: 24 },
      { id: "death_rune", name: "Death rune", icon: "Death_rune.png", qtyMin: 2, qtyMax: 8, weight: 18 },
      { id: "ensouled_head", name: "Ensouled head", icon: "Ensouled_giant_head.png", qtyMin: 1, qtyMax: 1, weight: 8 }
    ],
    spider: [
      { id: "red_spiders_eggs", name: "Red spiders' eggs", icon: "Red_spiders%27_eggs.png", qtyMin: 1, qtyMax: 5, weight: 30 },
      { id: "spider_carcass", name: "Spider carcass", icon: "Spider_carcass.png", qtyMin: 1, qtyMax: 2, weight: 20 },
      { id: "grimy_ranarr", name: "Grimy ranarr", icon: "Grimy_ranarr_weed.png", qtyMin: 1, qtyMax: 1, weight: 12 }
    ],
    wilderness: [
      { id: "dark_crab", name: "Dark crab", icon: "Dark_crab.png", qtyMin: 1, qtyMax: 5, weight: 24 },
      { id: "blighted_anglerfish", name: "Blighted anglerfish", icon: "Blighted_anglerfish.png", qtyMin: 1, qtyMax: 3, weight: 20 },
      { id: "blighted_karambwan", name: "Blighted karambwan", icon: "Blighted_karambwan.png", qtyMin: 1, qtyMax: 3, weight: 20 },
      { id: "larrans_key", name: "Larran's key", icon: "Larran%27s_key.png", qtyMin: 1, qtyMax: 1, weight: 8 }
    ]
  };

  const GLOBAL_RARE_DROPS = [
    { id: "clue_casket_hard", name: "Clue casket (hard)", icon: "Clue_scroll_(hard).png", weight: 6 },
    { id: "clue_casket_elite", name: "Clue casket (elite)", icon: "Clue_scroll_(elite).png", weight: 3 },
    { id: "dragon_med_helm", name: "Dragon med helm", icon: "Dragon_med_helm.png", weight: 3 },
    { id: "dragon_spear", name: "Dragon spear", icon: "Dragon_spear.png", weight: 2 },
    { id: "shield_left_half", name: "Shield left half", icon: "Shield_left_half.png", weight: 2 },
    { id: "clue_casket_master", name: "Clue casket (master)", icon: "Clue_scroll_(master).png", weight: 1 }
  ];

  /* ==========================================================
     STAKING ITEM CATALOG (tradeable, real GP values)
  ========================================================== */
  const STAKE_ITEMS = [
    { id: "coins",           name: "Coins",              value:      1, icon: "https://oldschool.runescape.wiki/images/thumb/Coins_10000.png/32px-Coins_10000.png" },
    { id: "platinum_token",  name: "Platinum token",     value:   1000, icon: "https://oldschool.runescape.wiki/images/thumb/Platinum_token_detail.png/32px-Platinum_token_detail.png" },
    { id: "divine_token",    name: "Divine token",       value: 1000000000000, icon: "https://oldschool.runescape.wiki/images/thumb/Platinum_token_detail.png/32px-Platinum_token_detail.png#glowy-yellow" },
    { id: "bronze_sword",    name: "Bronze Sword",       value:     32, icon: "https://oldschool.runescape.wiki/images/thumb/Bronze_sword.png/32px-Bronze_sword.png" },
    { id: "iron_sword",      name: "Iron Sword",         value:    112, icon: "https://oldschool.runescape.wiki/images/thumb/Iron_sword.png/32px-Iron_sword.png" },
    { id: "steel_sword",     name: "Steel Sword",        value:    400, icon: "https://oldschool.runescape.wiki/images/thumb/Steel_sword.png/32px-Steel_sword.png" },
    { id: "mithril_sword",   name: "Mithril Sword",      value:   1000, icon: "https://oldschool.runescape.wiki/images/thumb/Mithril_sword.png/32px-Mithril_sword.png" },
    { id: "adamant_sword",   name: "Adamant Sword",      value:   2560, icon: "https://oldschool.runescape.wiki/images/thumb/Adamant_sword.png/32px-Adamant_sword.png" },
    { id: "rune_sword",      name: "Rune Sword",         value:  10240, icon: "https://oldschool.runescape.wiki/images/thumb/Rune_sword.png/32px-Rune_sword.png" },
    { id: "dragon_sword",    name: "Dragon Sword",       value:  61000, icon: "https://oldschool.runescape.wiki/images/thumb/Dragon_sword.png/32px-Dragon_sword.png" },
    { id: "abyssal_whip",    name: "Abyssal Whip",       value: 3100000, icon: "https://oldschool.runescape.wiki/images/thumb/Abyssal_whip.png/32px-Abyssal_whip.png" },
    { id: "normal_log",      name: "Logs",               value:     50, icon: "https://oldschool.runescape.wiki/images/thumb/Logs.png/32px-Logs.png" },
    { id: "oak_log",         name: "Oak Logs",           value:     60, icon: "https://oldschool.runescape.wiki/images/thumb/Oak_logs.png/32px-Oak_logs.png" },
    { id: "willow_log",      name: "Willow Logs",        value:     15, icon: "https://oldschool.runescape.wiki/images/thumb/Willow_logs.png/32px-Willow_logs.png" },
    { id: "yew_log",         name: "Yew Logs",           value:    350, icon: "https://oldschool.runescape.wiki/images/thumb/Yew_logs.png/32px-Yew_logs.png" },
    { id: "magic_log",       name: "Magic Logs",         value:   1100, icon: "https://oldschool.runescape.wiki/images/thumb/Magic_logs.png/32px-Magic_logs.png" },
    { id: "iron_ore",        name: "Iron Ore",           value:     90, icon: "https://oldschool.runescape.wiki/images/thumb/Iron_ore.png/32px-Iron_ore.png" },
    { id: "coal",            name: "Coal",               value:    175, icon: "https://oldschool.runescape.wiki/images/thumb/Coal.png/32px-Coal.png" },
    { id: "gold_ore",        name: "Gold Ore",           value:    300, icon: "https://oldschool.runescape.wiki/images/thumb/Gold_ore.png/32px-Gold_ore.png" },
    { id: "runite_ore",      name: "Runite Ore",         value:  11000, icon: "https://oldschool.runescape.wiki/images/thumb/Runite_ore.png/32px-Runite_ore.png" }
  ];

  const STAKE_BY_ID = Object.fromEntries(STAKE_ITEMS.map(i => [i.id, i]));
  const GE_CACHE_KEY = "rsgame.geCache.v1";
  const STAKE_MATCH_DELAY_MS = 120;
  const DUEL_DURATION_MS = 6000;
  const DUEL_ROUND_INTERVAL_MS = 300;
  const DUEL_MAX_HP = 99;
  const DUEL_OPPONENT_NAMES = [
    "Mysterious Duelist",
    "Arena Veteran",
    "Sand Challenger",
    "Kharidian Fighter",
    "Pit Specialist",
    "Stake Hunter",
    "Desert Wagerer",
    "Zyrex the Swift",
    "Sirocco the Bold",
    "Galestriker",
    "Dev Zyrex"
  ];

  const SLAYER_MASTERS = [
    { id: "turael", name: "Turael", combatReq: 1, slayerReq: 1, basePoints: 0, taskCount: [15, 50] },
    { id: "spria", name: "Spria", combatReq: 1, slayerReq: 1, basePoints: 0, taskCount: [15, 50] },
    { id: "mazchna", name: "Mazchna", combatReq: 20, slayerReq: 1, basePoints: 2, taskCount: [30, 90] },
    { id: "vannaka", name: "Vannaka", combatReq: 40, slayerReq: 1, basePoints: 4, taskCount: [40, 120] },
    { id: "chaeldar", name: "Chaeldar", combatReq: 70, slayerReq: 1, basePoints: 10, taskCount: [70, 170] },
    { id: "konar", name: "Konar quo Maten", combatReq: 75, slayerReq: 1, basePoints: 18, taskCount: [90, 190] },
    { id: "nieve", name: "Nieve", combatReq: 85, slayerReq: 1, basePoints: 12, taskCount: [100, 210] },
    { id: "duradel", name: "Duradel", combatReq: 100, slayerReq: 50, basePoints: 15, taskCount: [120, 230] },
    { id: "krystilia", name: "Krystilia", combatReq: 1, slayerReq: 1, basePoints: 0, taskCount: [30, 120] }
  ];
  const SLAYER_MASTER_BY_ID = Object.fromEntries(SLAYER_MASTERS.map((master) => [master.id, master]));
  const SLAYER_MASTER_BY_NAME = Object.fromEntries(SLAYER_MASTERS.map((master) => [master.name, master]));

  /* ==========================================================
     STATE
  ========================================================== */
  let combatState = null;   // bound after save load
  let fightTimer = null;
  let contextMenu = null;

  // Staking working state (session only, persisted separately)
  let stakeOffer = [];      // [{id, name, qty, value, icon}]
  let stakeCoins = 0;
  let oppOffer = [];        // [{id, name, qty, value, icon}]
  let oppCoins = 0;
  let duelPending = false;
  let duelGenerating = false;
  let stakeMatchTimer = null;
  let opponentOfferName = "Mysterious Duelist";
  let duelAnimationState = null;
  let duelRoundTimer = null;
  let duelCountdownTimer = null;

  /* ==========================================================
     HELPERS
  ========================================================== */
  function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function weightedPick(rows) {
    const total = rows.reduce((sum, row) => sum + (Number(row.weight) || 0), 0);
    if (total <= 0) return null;
    let roll = Math.random() * total;
    for (let i = 0; i < rows.length; i++) {
      roll -= Number(rows[i].weight) || 0;
      if (roll <= 0) return rows[i];
    }
    return rows[rows.length - 1] || null;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function formatNum(n) {
    if (n >= 1e12) return "1T";
    if (n >= 1e9) return (n / 1e9).toFixed(1).replace(/\.0$/, "") + "B";
    if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
    if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, "") + "K";
    return String(n);
  }

  function normalizeTaskName(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  }

  function safeJsonParse(raw, fallback) {
    try {
      return JSON.parse(raw);
    } catch (_err) {
      return fallback;
    }
  }

  const FOOD_HEAL_BY_ID = {
    shrimps: 3,
    sardine: 4,
    herring: 5,
    anchovies: 1,
    trout: 7,
    salmon: 9,
    tuna: 10,
    lobster: 12,
    swordfish: 14,
    monkfish: 16,
    karambwan: 18,
    shark: 20,
    anglerfish: 22,
    dark_crab: 22
  };

  function getFoodHeal(item) {
    if (!item) return 0;
    const id = String(item.id || "").toLowerCase();
    const name = String(item.name || "").toLowerCase();
    if (FOOD_HEAL_BY_ID[id]) return FOOD_HEAL_BY_ID[id];
    if (id.startsWith("raw_") || name.includes("raw ") || name.includes("burnt")) return 0;
    if (id.startsWith("cooked_")) {
      const core = id.replace(/^cooked_/, "");
      if (FOOD_HEAL_BY_ID[core]) return FOOD_HEAL_BY_ID[core];
    }
    return 0;
  }

  function autoEatBestFood() {
    if (!combatState || !window.Player?.inventory) return false;
    const maxHp = getMaxHp();
    const currentHp = Number(combatState.currentHp) || 0;
    if (currentHp <= 0 || currentHp >= maxHp) return false;
    const threshold = Math.max(8, Math.floor(maxHp * 0.45));
    if (currentHp > threshold) return false;

    const slots = window.Player.inventory.getSlots?.() || window.Player.inventory.slots || [];
    let best = null;

    for (const slot of slots) {
      if (!slot || !slot.id || (Number(slot.qty) || 0) <= 0 || slot.noted) continue;
      const heal = getFoodHeal(slot);
      if (heal <= 0) continue;
      if (!best || heal > best.heal) best = { item: slot, heal };
    }

    if (!best) return false;
    if (!removeInventoryItem(best.item.id, 1, false)) return false;

    const healed = Math.min(best.heal, maxHp - currentHp);
    combatState.currentHp = Math.min(maxHp, currentHp + best.heal);
    addLog("Auto-ate " + (best.item.name || best.item.id) + " for " + healed + " HP.");
    RSGame.UI?.renderInventory?.(window.Player);
    return true;
  }

  /* Parse coin amounts like "1k", "10m", "1b", etc. */
  function parseCoinAmount(input) {
    const str = String(input).trim().toUpperCase();
    if (!str) return 0;
    let mult = 1;
    let numPart = str;
    if (str.endsWith('B')) { mult = 1e9; numPart = str.slice(0, -1); }
    else if (str.endsWith('M')) { mult = 1e6; numPart = str.slice(0, -1); }
    else if (str.endsWith('K')) { mult = 1e3; numPart = str.slice(0, -1); }
    const num = parseFloat(numPart);
    return isNaN(num) ? 0 : Math.floor(num * mult);
  }

  function getAttackLevel()    { return Math.max(1, Number(window.Player?.skills?.Attack?.level) || 1); }
  function getStrengthLevel()  { return Math.max(1, Number(window.Player?.skills?.Strength?.level) || 1); }
  function getDefenceLevel()   { return Math.max(1, Number(window.Player?.skills?.Defence?.level) || 1); }
  function getRangedLevel()    { return Math.max(1, Number(window.Player?.skills?.Ranged?.level) || 1); }
  function getMagicLevel()     { return Math.max(1, Number(window.Player?.skills?.Magic?.level) || 1); }
  function getPrayerLevel()    { return Math.max(1, Number(window.Player?.skills?.Prayer?.level) || 1); }
  function getSlayerLevel()    { return Math.max(1, Number(window.Player?.skills?.Slayer?.level) || 1); }
  function getHpLevel()        { return Math.max(10, Number(window.Player?.skills?.Hitpoints?.level) || 10); }
  function getMaxHp()          { return getHpLevel() + 9; }

  function getEquippedCombatBonuses() {
    const total = {
      attack_stab: 0,
      attack_slash: 0,
      attack_crush: 0,
      defence_stab: 0,
      defence_slash: 0,
      defence_crush: 0,
      melee_strength: 0
    };
    const slots = window.Player?.equipment?.slots || {};
    Object.values(slots).forEach((item) => {
      if (!item?.bonuses) return;
      const bonuses = item.bonuses;
      Object.keys(total).forEach((key) => {
        const v = Number(bonuses[key]);
        if (Number.isFinite(v)) total[key] += v;
      });
    });
    return total;
  }

  function getPlayerCombatLevel(player = window.Player) {
    const attack = Math.max(1, Number(player?.skills?.Attack?.level) || 1);
    const strength = Math.max(1, Number(player?.skills?.Strength?.level) || 1);
    const defence = Math.max(1, Number(player?.skills?.Defence?.level) || 1);
    const hitpoints = Math.max(10, Number(player?.skills?.Hitpoints?.level) || 10);
    const prayer = Math.max(1, Number(player?.skills?.Prayer?.level) || 1);
    const ranged = Math.max(1, Number(player?.skills?.Ranged?.level) || 1);
    const magic = Math.max(1, Number(player?.skills?.Magic?.level) || 1);

    const base = 0.25 * (defence + hitpoints + Math.floor(prayer / 2));
    const melee = 0.325 * (attack + strength);
    const ranger = 0.325 * Math.floor(ranged * 1.5);
    const mage = 0.325 * Math.floor(magic * 1.5);
    return Math.max(3, Math.floor(base + Math.max(melee, ranger, mage)));
  }

  function canFightMonster(monster) {
    if (!monster) return false;
    if ((monster.slayerLevel || 0) > getSlayerLevel()) return false;
    return monster.lvl <= getPlayerCombatLevel() + 25;
  }

  function getMonsterById(monsterId) {
    return MONSTERS_BY_ID[String(monsterId)] || null;
  }

  function getSlayerEligibleMonsters(masterName, player = window.Player) {
    const playerCombat = getPlayerCombatLevel(player);
    const playerSlayer = Math.max(1, Number(player?.skills?.Slayer?.level) || 1);
    return MONSTERS.filter((monster) => {
      if (!monster.slayerMasters.length) return false;
      if (!monster.slayerMasters.includes(masterName)) return false;
      if ((monster.slayerLevel || 0) > playerSlayer) return false;
      return monster.lvl <= playerCombat + 35;
    });
  }

  function addInventoryCoins(amount, source) {
    if (!window.Player?.inventory) return;
    const finalAmount = Math.max(0, Number(window.RSGame?.MagicPerks?.applyCoinRewardMultiplier?.(amount, source || "combat", window.Player) ?? amount) || 0);
    if (finalAmount <= 0) return;
    window.Player.inventory.addItem?.({
      id: "coins", name: "Coins", qty: finalAmount,
      icon: "https://oldschool.runescape.wiki/images/thumb/Coins_10000.png/32px-Coins_10000.png"
    });
    RSGame.Events?.emit?.("playerUpdated");
  }

  function removeInventoryCoins(amount) {
    if (!window.Player?.inventory) return false;
    const slots = window.Player.inventory.getSlots?.() || window.Player.inventory.slots || [];
    const existing = slots.find(s => s && s.id === "coins");
    if (!existing || existing.qty < amount) return false;
    existing.qty -= amount;
    if (existing.qty <= 0) {
      const idx = slots.indexOf(existing);
      if (idx !== -1) slots[idx] = null;
    }
    RSGame.Events?.emit?.("playerUpdated");
    return true;
  }

  function getInventoryCoins() {
    const slots = window.Player?.inventory?.getSlots?.() || window.Player?.inventory?.slots || [];
    const c = slots.find(s => s && s.id === "coins");
    return c ? (Number(c.qty) || 0) : 0;
  }

  function getInventoryItem(id, noted = false) {
    const slots = window.Player?.inventory?.getSlots?.() || window.Player?.inventory?.slots || [];
    return slots.find(s => s && s.id === id && !!s.noted === !!noted) || null;
  }

  function removeInventoryItem(id, qty, noted = false) {
    const slots = window.Player?.inventory?.getSlots?.() || window.Player?.inventory?.slots || [];
      let remaining = qty;
    for (let i = 0; i < slots.length; i++) {
      if (!slots[i] || slots[i].id !== id || !!slots[i].noted !== !!noted) continue;
      const take = Math.min(slots[i].qty, remaining);
      slots[i].qty -= take;
      remaining -= take;
      if (slots[i].qty <= 0) slots[i] = null;
      if (remaining <= 0) break;
    }
    RSGame.Events?.emit?.("playerUpdated");
    return remaining === 0;
  }

  function addInventoryItem(item, qty) {
    if (!window.Player?.inventory) return;
    window.Player.inventory.addItem?.({ ...item, qty });
    RSGame.Events?.emit?.("playerUpdated");
  }

  function getItemValue(id) {
    const entry = STAKE_BY_ID[id];
    if (entry) return entry.value;
    const geCache = getGePriceById(id);
    if (geCache) return geCache;
    return 1;
  }

  function getGeCacheItems() {
    const shared = window.RSGame?.GE?.getItems?.();
    if (Array.isArray(shared) && shared.length) {
      return shared;
    }
    const parsed = safeJsonParse(localStorage.getItem(GE_CACHE_KEY), null);
    if (!parsed || !Array.isArray(parsed.items)) return [];
    return parsed.items;
  }

  function getGePriceById(id) {
    const sharedPrice = window.RSGame?.GE?.getCachedPriceById?.(id);
    if (Number(sharedPrice) > 0) return Number(sharedPrice);
    const normalized = String(id);
    const match = getGeCacheItems().find((item) => String(item.id) === normalized);
    return Math.max(0, Number(match?.price) || 0);
  }

  function normalizeForLookup(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/[_-]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function getGePriceByName(name) {
    const sharedPrice = window.RSGame?.GE?.getCachedPriceByName?.(name);
    if (Number(sharedPrice) > 0) return Number(sharedPrice);
    const target = normalizeForLookup(name);
    if (!target) return 0;
    const match = getGeCacheItems().find((item) => normalizeForLookup(item?.name) === target);
    return Math.max(0, Number(match?.price) || 0);
  }

  function resolveOfferItemValue(itemLike) {
    if (!itemLike) return 1;

    const explicit = Number(itemLike.price);
    if (Number.isFinite(explicit) && explicit > 0) return explicit;

    const osrsId = itemLike.osrsId || itemLike.osrsID || itemLike.geId;
    if (osrsId !== undefined && osrsId !== null) {
      const byOsrsId = getGePriceById(osrsId);
      if (byOsrsId > 0) return byOsrsId;
    }

    const byId = getGePriceById(itemLike.id);
    if (byId > 0) return byId;

    const byName = getGePriceByName(itemLike.name || itemLike.id);
    if (byName > 0) return byName;

    const info = STAKE_BY_ID[itemLike.id];
    if (info?.value) return info.value;

    return Math.max(1, getItemValue(itemLike.id));
  }

  function getStakeIcon(item) {
    if (item?.icon) return item.icon;
    if (item?.iconFile) {
      return item.iconFile.startsWith("http")
        ? item.iconFile
        : `https://oldschool.runescape.wiki/images/thumb/${encodeURIComponent(item.iconFile)}/32px-${encodeURIComponent(item.iconFile)}`;
    }
    return "https://oldschool.runescape.wiki/images/thumb/Coins_10000.png/32px-Coins_10000.png";
  }

  function getOpponentOfferPool() {
    const geItems = getGeCacheItems()
      .filter((item) => Number(item?.price) >= 5000 && item?.name)
      .map((item) => ({
        id: String(item.id),
        name: item.name,
        value: Math.max(1, Number(item.price) || 1),
        icon: getStakeIcon(item)
      }));

    const merged = new Map();
    [...geItems, ...STAKE_ITEMS.filter((item) => item.id !== "coins")].forEach((item) => {
      const key = String(item.id);
      if (!merged.has(key)) {
        merged.set(key, {
          id: key,
          name: item.name,
          value: Math.max(1, Number(item.value) || 1),
          icon: getStakeIcon(item)
        });
      }
    });

    return Array.from(merged.values()).sort((a, b) => a.value - b.value);
  }

  function stakeOfferTotal() {
    const itemsVal = stakeOffer.reduce((s, e) => s + e.value * e.qty, 0);
    return itemsVal + stakeCoins;
  }

  function isStakeFightActive() {
    return !!duelAnimationState?.active;
  }

  function clearResolvedDuelPreview() {
    if (duelAnimationState && !duelAnimationState.active) {
      duelAnimationState = null;
    }
  }

  function pickOpponentName() {
    return DUEL_OPPONENT_NAMES[rand(0, DUEL_OPPONENT_NAMES.length - 1)];
  }

  function getStakedQty(id, noted = false) {
    return stakeOffer.reduce((sum, entry) => {
      if (String(entry.id) !== String(id) || !!entry.noted !== !!noted) return sum;
      return sum + (Number(entry.qty) || 0);
    }, 0);
  }

  function getAvailableStakeQty(id, noted = false) {
    const live = getInventoryItem(id, noted);
    if (!live) return 0;
    // Staked items are moved out of inventory immediately, so availability
    // should reflect only what remains in inventory.
    return Math.max(0, Number(live.qty) || 0);
  }

  function clearStakeMatchTimer() {
    if (stakeMatchTimer) {
      clearTimeout(stakeMatchTimer);
      stakeMatchTimer = null;
    }
  }

  function clearDuelTimers() {
    if (duelRoundTimer) {
      clearInterval(duelRoundTimer);
      duelRoundTimer = null;
    }
    if (duelCountdownTimer) {
      clearInterval(duelCountdownTimer);
      duelCountdownTimer = null;
    }
  }

  function clearOpponentOfferState() {
    clearStakeMatchTimer();
    oppOffer = [];
    oppCoins = 0;
    duelPending = false;
    duelGenerating = false;
    opponentOfferName = pickOpponentName();
  }

  function mergeOfferEntries(entries) {
    const merged = new Map();
    entries.forEach((entry) => {
      const key = String(entry.id);
      if (!merged.has(key)) {
        merged.set(key, { ...entry });
        return;
      }
      merged.get(key).qty += entry.qty;
    });
    return Array.from(merged.values());
  }

  function setStakeCoins(amount) {
    if (isStakeFightActive()) return;
    clearResolvedDuelPreview();
    const maxCoins = getInventoryCoins();
    stakeCoins = Math.max(0, Math.min(Math.floor(Number(amount) || 0), maxCoins));
    queueOpponentOffer();
    refreshDuelPanel();
  }

  function syncStakeStateWithInventory() {
    if (isStakeFightActive()) return;

    let changed = false;

    // Staked entries are now the source of truth for items already moved
    // into the duel stake. Do not clamp them against live inventory.
    stakeOffer = stakeOffer
      .map((entry) => {
        const nextQty = Math.max(0, Number(entry.qty) || 0);
        if (nextQty !== entry.qty) changed = true;
        return nextQty > 0 ? { ...entry, qty: nextQty } : null;
      })
      .filter(Boolean);

    const liveCoins = getInventoryCoins();
    if (stakeCoins > liveCoins) {
      stakeCoins = liveCoins;
      changed = true;
    }

    if (changed) {
      clearResolvedDuelPreview();
      queueOpponentOffer();
    }
  }

  function syncStakeOfferValues() {
    let changed = false;
    stakeOffer = stakeOffer.map((entry) => {
      const nextValue = resolveOfferItemValue(entry);
      if (nextValue !== entry.value) {
        changed = true;
        return { ...entry, value: nextValue };
      }
      return entry;
    });
    return changed;
  }

  function queueOpponentOffer(immediate = false) {
    if (isStakeFightActive()) return;
    clearStakeMatchTimer();

    const total = stakeOfferTotal();
    if (total <= 0) {
      clearOpponentOfferState();
      refreshDuelPanel();
      return;
    }

    duelPending = false;
    duelGenerating = true;

    const statusEl = document.getElementById("stake-status");
    if (statusEl) statusEl.textContent = "Searching for a matching opponent offer...";

    const delay = immediate ? 0 : STAKE_MATCH_DELAY_MS;
    stakeMatchTimer = setTimeout(() => {
      const gen = generateOpponentOffer(stakeOfferTotal());
      oppOffer = gen.items;
      oppCoins = gen.coins;
      opponentOfferName = gen.name;
      duelGenerating = false;
      duelPending = stakeOfferTotal() > 0;
      const liveStatus = document.getElementById("stake-status");
      if (liveStatus) {
        liveStatus.textContent = duelPending
          ? "Opponent offer updated. Adjust your stake or fight when you are happy with the bet."
          : "Add items or coins to stake to start matching an opponent.";
      }
      refreshDuelPanel();
    }, delay);
  }

  /* ==========================================================
     CONTEXT MENU
  ========================================================== */
  function buildContextMenu() {
    if (document.getElementById("combat-ctx-menu")) return;
    const el = document.createElement("ul");
    el.id = "combat-ctx-menu";
    el.className = "osrs-ctx-menu";
    el.style.display = "none";
    document.body.appendChild(el);
    contextMenu = el;

    document.addEventListener("click", () => hideCtxMenu(), { capture: true });
    document.addEventListener("contextmenu", (e) => {
      if (!el.contains(e.target)) hideCtxMenu();
    }, { capture: true });
  }

  function hideCtxMenu() {
    if (contextMenu) contextMenu.style.display = "none";
  }

  function showCtxMenu(x, y, items) {
    if (!contextMenu) return;
    contextMenu.innerHTML = "";
    items.forEach(({ label, action }) => {
      const li = document.createElement("li");
      li.textContent = label;
      li.addEventListener("mousedown", (e) => {
        e.preventDefault();
        e.stopPropagation();
        hideCtxMenu();
        action();
      });
      contextMenu.appendChild(li);
    });
    // Viewport clamp
    contextMenu.style.display = "block";
    contextMenu.style.left = "0";
    contextMenu.style.top = "0";
    const rect = contextMenu.getBoundingClientRect();
    const vw = window.innerWidth, vh = window.innerHeight;
    contextMenu.style.left = Math.min(x, vw - rect.width - 4) + "px";
    contextMenu.style.top  = Math.min(y, vh - rect.height - 4) + "px";
  }

  /* ==========================================================
     DISPLAY — shared helpers
  ========================================================== */
  function pct(cur, max) { return max > 0 ? Math.round((cur / max) * 100) : 0; }

  /* ==========================================================
     COMBAT LOGIC
  ========================================================== */
  function getSelectedMonster() {
    const id = combatState?.selectedMonster || "chicken";
    return MONSTERS.find(m => m.id === id) || MONSTERS[0];
  }

  function initCombatState() {
    if (!combatState) {
      combatState = window.Player.combat || {};
    }
    if (typeof combatState.currentHp !== "number") combatState.currentHp = getMaxHp();
    if (typeof combatState.monsterHp !== "number") combatState.monsterHp = getSelectedMonster().hp;
    if (!combatState.style) combatState.style = "Attack";
    if (typeof combatState.kills !== "number") combatState.kills = 0;
    if (typeof combatState.deaths !== "number") combatState.deaths = 0;
    if (!combatState.log) combatState.log = [];
    if (!combatState.slayer || typeof combatState.slayer !== "object") {
      combatState.slayer = {
        streak: 0,
        points: 0,
        selectedMasterId: "vannaka",
        currentTask: null,
        history: []
      };
    }
    if (typeof combatState.slayer.streak !== "number") combatState.slayer.streak = 0;
    if (typeof combatState.slayer.points !== "number") combatState.slayer.points = 0;
    if (!combatState.slayer.selectedMasterId) combatState.slayer.selectedMasterId = "vannaka";
    if (!Array.isArray(combatState.slayer.history)) combatState.slayer.history = [];
    if (combatState.slayer.currentTask && typeof combatState.slayer.currentTask.remaining !== "number") {
      combatState.slayer.currentTask.remaining = Math.max(0, Number(combatState.slayer.currentTask.remaining) || 0);
    }
    if (!combatState.staking) combatState.staking = { wins: 0, losses: 0, history: [], offer: null };
    window.Player.combat = combatState;
  }

  function canUseSlayerMaster(master, player = window.Player) {
    const combatLevel = getPlayerCombatLevel(player);
    const slayerLevel = Math.max(1, Number(player?.skills?.Slayer?.level) || 1);
    return combatLevel >= master.combatReq && slayerLevel >= master.slayerReq;
  }

  function getSlayerPointMultiplier(streak) {
    if (streak % 1000 === 0) return 50;
    if (streak % 250 === 0) return 35;
    if (streak % 100 === 0) return 25;
    if (streak % 50 === 0) return 15;
    if (streak % 10 === 0) return 5;
    if (streak % 5 === 0) return 1;
    return 0;
  }

  function calcSlayerTaskCount(monster, master) {
    const min = Math.max(5, Number(master.taskCount?.[0]) || 25);
    const max = Math.max(min, Number(master.taskCount?.[1]) || min + 40);
    const rolled = rand(min, max);
    const scaled = Math.max(5, Math.round(rolled * (Number(monster.taskCountScale) || 1)));
    return scaled;
  }

  function assignSlayerTask(masterId) {
    if (!combatState) initCombatState();
    const slayerState = combatState.slayer;
    const master = SLAYER_MASTER_BY_ID[masterId];
    if (!master) return false;

    slayerState.selectedMasterId = master.id;
    if (!canUseSlayerMaster(master)) {
      renderSlayerPanel();
      addLog(master.name + " does not trust your levels yet.");
      return false;
    }

    const eligible = getSlayerEligibleMonsters(master.name, window.Player);
    if (!eligible.length) {
      renderSlayerPanel();
      addLog("No available Slayer tasks from " + master.name + " at your current levels.");
      return false;
    }

    const pick = eligible[rand(0, eligible.length - 1)];
    const count = calcSlayerTaskCount(pick, master);
    slayerState.currentTask = {
      masterId: master.id,
      masterName: master.name,
      monsterId: pick.id,
      monsterName: pick.name,
      taskName: pick.taskName || pick.name,
      remaining: count,
      initialCount: count,
      assignedAt: Date.now()
    };

    addLog(master.name + " assigned: " + (pick.taskName || pick.name) + " x" + count + ".");
    renderSlayerPanel();
    RSGame.Game?.saveNow?.();
    return true;
  }

  function clearSlayerTask() {
    if (!combatState?.slayer?.currentTask) return;
    const taskName = combatState.slayer.currentTask.taskName || combatState.slayer.currentTask.monsterName;
    combatState.slayer.currentTask = null;
    addLog("You cancelled your Slayer task (" + taskName + ").");
    renderSlayerPanel();
    RSGame.Game?.saveNow?.();
  }

  function completeSlayerTask(monster) {
    const slayerState = combatState?.slayer;
    const task = slayerState?.currentTask;
    if (!slayerState || !task) return;

    slayerState.streak = Math.max(0, Number(slayerState.streak) || 0) + 1;
    const master = SLAYER_MASTER_BY_ID[task.masterId] || SLAYER_MASTER_BY_NAME[task.masterName] || null;
    const basePoints = Math.max(0, Number(master?.basePoints) || 0);
    const mult = getSlayerPointMultiplier(slayerState.streak);
    const awardedPoints = basePoints * mult;
    if (awardedPoints > 0) slayerState.points += awardedPoints;

    slayerState.history.unshift({
      masterName: task.masterName,
      taskName: task.taskName || task.monsterName,
      kills: task.initialCount,
      completedAt: Date.now(),
      streak: slayerState.streak,
      points: awardedPoints
    });
    if (slayerState.history.length > 25) slayerState.history.pop();

    slayerState.currentTask = null;
    addLog("Slayer task complete: " + (task.taskName || task.monsterName) + "." + (awardedPoints > 0 ? " +" + awardedPoints + " Slayer points." : ""));
    renderSlayerPanel();
  }

  function onSlayerMonsterKilled(monster) {
    const slayerState = combatState?.slayer;
    const task = slayerState?.currentTask;
    if (!task) return;

    const killedTaskName = normalizeTaskName(monster.taskName || monster.name);
    const activeTaskName = normalizeTaskName(task.taskName || task.monsterName);
    if (killedTaskName !== activeTaskName) return;

    const xp = Math.max(0, Number(monster.slayerXp) || 0);
    if (xp > 0) window.Player?.skills?.Slayer?.addXP?.(xp);
    task.remaining = Math.max(0, Number(task.remaining) - 1);
    addLog("Slayer: " + (task.taskName || task.monsterName) + " " + (task.initialCount - task.remaining) + "/" + task.initialCount + ".");

    if (task.remaining <= 0) completeSlayerTask(monster);
    renderSlayerPanel();
  }

  function buildSlayerTaskStatus() {
    const slayerState = combatState?.slayer;
    if (!slayerState) return "";

    const task = slayerState.currentTask;
    if (!task) {
      return "No Slayer task active. Right-click a master and choose Get task.";
    }

    return task.masterName + " task: " + (task.taskName || task.monsterName) + " - " + task.remaining + " remaining.";
  }

  function renderSlayerPanel() {
    if (!combatState) initCombatState();

    const slayerState = combatState.slayer;
    const combatLevel = getPlayerCombatLevel();
    const slayerLevel = getSlayerLevel();
    const selectedMasterId = slayerState.selectedMasterId || "vannaka";

    const selectedMaster = SLAYER_MASTER_BY_ID[selectedMasterId] || SLAYER_MASTERS[0];
    const eligible = selectedMaster ? getSlayerEligibleMonsters(selectedMaster.name, window.Player) : [];
    const summaryRows = eligible
      .slice(0, 8)
      .map((monster) => `<div class="slayer-eligible-row"><span>${monster.taskName || monster.name}</span><span>Lvl ${monster.lvl} / Sly ${monster.slayerLevel || 1}</span></div>`)
      .join("");

    const wraps = Array.from(document.querySelectorAll(".slayer-panel-body"));
    if (!wraps.length) return;

    wraps.forEach((wrap, idx) => {
      const gridId = `slayer-master-grid-${idx}`;
      wrap.innerHTML = `
        <span class="combat-section-label">Slayer Masters</span>
        <div class="slayer-overview-row">
          <span>Combat ${combatLevel}</span>
          <span>Slayer ${slayerLevel}</span>
          <span>Streak ${slayerState.streak || 0}</span>
          <span>Points ${slayerState.points || 0}</span>
        </div>
        <div class="slayer-master-grid" id="${gridId}"></div>
        <div class="slayer-task-status">${buildSlayerTaskStatus()}</div>
        <div class="slayer-eligible-wrap">
          <div class="slayer-eligible-title">Eligible from ${selectedMaster?.name || "Selected master"}</div>
          <div class="slayer-eligible-list">${summaryRows || '<div class="slayer-eligible-empty">No eligible assignments yet.</div>'}</div>
        </div>
      `;

      const grid = wrap.querySelector(`#${gridId}`);
      if (!grid) return;

      SLAYER_MASTERS.forEach((master) => {
        const unlocked = canUseSlayerMaster(master);
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "slayer-master-btn"
          + (selectedMasterId === master.id ? " active" : "")
          + (unlocked ? "" : " locked");
        btn.innerHTML = `
          <span class="slayer-master-name">${master.name}</span>
          <span class="slayer-master-req">Req Cmb ${master.combatReq}${master.slayerReq > 1 ? " / Sly " + master.slayerReq : ""}</span>
        `;
        btn.title = unlocked
          ? (master.name + " - right click for options")
          : (master.name + " requires Combat " + master.combatReq + (master.slayerReq > 1 ? " and Slayer " + master.slayerReq : ""));

        btn.addEventListener("click", () => {
          slayerState.selectedMasterId = master.id;
          renderSlayerPanel();
        });

        btn.addEventListener("contextmenu", (e) => {
          e.preventDefault();
          slayerState.selectedMasterId = master.id;
          const menuItems = [];
          if (unlocked) {
            menuItems.push({ label: "Get task", action: () => assignSlayerTask(master.id) });
          }
          if (slayerState.currentTask) {
            menuItems.push({ label: "Cancel task", action: () => clearSlayerTask() });
          }
          if (!menuItems.length) {
            menuItems.push({ label: "Requirements not met", action: () => {} });
          }
          showCtxMenu(e.clientX, e.clientY, menuItems);
          renderSlayerPanel();
        });

        grid.appendChild(btn);
      });
    });
  }

  function addLog(msg) {
    if (!combatState) return;
    combatState.log = combatState.log || [];
    combatState.log.unshift(msg);
    if (combatState.log.length > 30) combatState.log.pop();
    const logEl = document.getElementById("combat-log-lines");
    if (logEl) {
      const li = document.createElement("li");
      li.textContent = msg;
      logEl.insertBefore(li, logEl.firstChild);
      while (logEl.children.length > 30) logEl.removeChild(logEl.lastChild);
    }
  }

  function refreshCombatHpBars() {
    const monster = getSelectedMonster();
    const maxHp = getMaxHp();
    const cHp = Math.max(0, combatState.currentHp);
    const mHp = Math.max(0, combatState.monsterHp);

    const pBar = document.getElementById("combat-player-hp-bar-fill");
    const pTxt = document.getElementById("combat-player-hp-text");
    const mBar = document.getElementById("combat-monster-hp-bar-fill");
    const mTxt = document.getElementById("combat-monster-hp-text");

    if (pBar) { pBar.style.width = pct(cHp, maxHp) + "%"; pBar.className = "hp-bar-fill " + (cHp < maxHp * 0.25 ? "hp-low" : cHp < maxHp * 0.5 ? "hp-mid" : ""); }
    if (pTxt) pTxt.textContent = cHp + " / " + maxHp;
    if (mBar) { mBar.style.width = pct(mHp, monster.hp) + "%"; mBar.className = "hp-bar-fill " + (mHp < monster.hp * 0.25 ? "hp-low" : mHp < monster.hp * 0.5 ? "hp-mid" : ""); }
    if (mTxt) mTxt.textContent = mHp + " / " + monster.hp;

    const killEl = document.getElementById("combat-kill-count");
    if (killEl) killEl.textContent = "Kills: " + (combatState.kills || 0) + "  Deaths: " + (combatState.deaths || 0);
  }

  function onMonsterKilled(monster) {
    combatState.kills = (combatState.kills || 0) + 1;
    onSlayerMonsterKilled(monster);
    const coins = rand(monster.coinMin, monster.coinMax);
    if (coins > 0) {
      addInventoryCoins(coins, "combat");
      addLog("You defeated " + monster.name + " and looted " + coins + " coins.");
    } else {
      addLog("You defeated " + monster.name + ".");
    }

    const drops = rollMonsterDrops(monster);
    if (drops.length) {
      addLog("Drops: " + drops.join(", ") + ".");
    }

    RSGame.Game?.saveNow?.();
    combatState.monsterHp = monster.hp;  // respawn
  }

  function getDropTier(monster) {
    if ((monster?.lvl || 1) >= 180) return "high";
    if ((monster?.lvl || 1) >= 70) return "mid";
    return "low";
  }

  function buildDropIcon(drop) {
    return "https://oldschool.runescape.wiki/images/thumb/" + drop.icon + "/32px-" + drop.icon;
  }

  function addDropToInventory(drop, qty) {
    const amount = Math.max(1, Number(qty) || 1);
    const icon = buildDropIcon(drop);
    const ok = window.Player?.inventory?.addItem?.({
      id: drop.id,
      name: drop.name,
      qty: amount,
      icon
    });
    if (!ok) return false;
    RSGame.Bank?.recordLegitimateObtain?.(window.Player, { id: drop.id, name: drop.name, icon, category: drop.category || "Combat Drops" }, amount);
    RSGame.Events?.emit?.("playerUpdated");
    return true;
  }

  function addDropToBank(player, drop, qty) {
    const amount = Math.max(1, Number(qty) || 1);
    if (!player || !window.RSGame?.Bank?.addToBank) return false;

    const icon = buildDropIcon(drop);
    const bankItem = {
      id: drop.id,
      name: drop.name,
      icon,
      category: drop.category || "Combat Drops"
    };

    window.RSGame.Bank.addToBank(player, bankItem, amount);
    RSGame.Bank?.recordLegitimateObtain?.(player, bankItem, amount);
    return true;
  }

  function getMonsterThemePool(monster) {
    const id = String(monster?.id || "").toLowerCase();
    const name = String(monster?.name || "").toLowerCase();
    if (id.includes("dragon") || name.includes("dragon") || id === "vorkath" || id === "zulrah") return MONSTER_DROP_THEMES.dragon;
    if (id.includes("demon") || name.includes("demon") || id.includes("sire") || id === "cerberus" || id === "skotizo") return MONSTER_DROP_THEMES.demon;
    if (id.includes("skeleton") || id.includes("ghost") || id.includes("zombie") || id.includes("vetion") || id.includes("calvar") || name.includes("undead")) return MONSTER_DROP_THEMES.undead;
    if (id.includes("spider") || id.includes("sarachnis") || id.includes("venenatis") || id.includes("spindel")) return MONSTER_DROP_THEMES.spider;
    if (id === "callisto" || id === "chaos_elemental" || id === "chaos_fanatic" || id === "crazy_archaeologist" || id === "scorpia" || id === "artio") return MONSTER_DROP_THEMES.wilderness;
    return [];
  }

  function rollMonsterDrops(monster) {
    const rewards = [];
    if (!monster) return rewards;

    const tier = getDropTier(monster);
    const pool = (MONSTER_DROP_COMMON[tier] || MONSTER_DROP_COMMON.low).concat(getMonsterThemePool(monster));
    const rollCount = monster.lvl >= 220 ? 2 : 1;

    for (let i = 0; i < rollCount; i++) {
      const picked = weightedPick(pool);
      if (!picked) continue;
      const qty = rand(picked.qtyMin || 1, picked.qtyMax || 1);
      if (addDropToInventory(picked, qty)) {
        rewards.push((qty > 1 ? qty + "x " : "") + picked.name);
      }
    }

    const uniques = BOSS_UNIQUE_DROPS[monster.id];
    if (Array.isArray(uniques) && uniques.length) {
      let uniqueChance = monster.lvl >= 500 ? 0.07 : 0.04;
      if (RSGame.CustomItems?.hasHazelmereSignetRing?.(window.Player)) {
        uniqueChance *= 10;
      }
      if (Math.random() < uniqueChance) {
        const unique = weightedPick(uniques);
        if (unique && addDropToInventory(unique, 1)) {
          rewards.push("UNIQUE: " + unique.name);
        }
      }
    }

    let globalRareChance = monster.lvl >= 300 ? 0.05 : monster.lvl >= 150 ? 0.03 : 0.015;
    if (RSGame.CustomItems?.hasHazelmereSignetRing?.(window.Player)) {
      globalRareChance *= 10;
    }
    if (Math.random() < globalRareChance) {
      const rare = weightedPick(GLOBAL_RARE_DROPS);
      if (rare && addDropToInventory(rare, 1)) {
        rewards.push("RARE: " + rare.name);
      }
    }

    return rewards;
  }

  function simulateBossKillsToBank(options = {}) {
    const player = options.player || window.Player;
    if (!player) {
      return { ok: false, message: "No player loaded for simulation." };
    }

    const kills = Math.max(1, Math.floor(Number(options.kills) || 1));
    const monsterId = String(options.monsterId || "nex");
    const monster = getMonsterById(monsterId);
    if (!monster) {
      return { ok: false, message: "Monster not found: " + monsterId + "." };
    }

    const rewardTotals = new Map();
    const pushReward = (id, name, qty) => {
      const amount = Math.max(1, Number(qty) || 1);
      const key = String(id || name || "unknown");
      const current = rewardTotals.get(key) || { name: name || key, qty: 0 };
      current.qty += amount;
      rewardTotals.set(key, current);
    };

    for (let kill = 0; kill < kills; kill++) {
      const baseCoins = rand(monster.coinMin, monster.coinMax);
      const finalCoins = Math.max(0, Number(window.RSGame?.MagicPerks?.applyCoinRewardMultiplier?.(baseCoins, "combat", player) ?? baseCoins) || 0);
      if (finalCoins > 0) {
        const coinDrop = {
          id: "coins",
          name: "Coins",
          icon: "Coins_10000.png",
          category: "Combat Drops"
        };
        addDropToBank(player, coinDrop, finalCoins);
        pushReward("coins", "Coins", finalCoins);
      }

      const tier = getDropTier(monster);
      const pool = (MONSTER_DROP_COMMON[tier] || MONSTER_DROP_COMMON.low).concat(getMonsterThemePool(monster));
      const rollCount = monster.lvl >= 220 ? 2 : 1;

      for (let i = 0; i < rollCount; i++) {
        const picked = weightedPick(pool);
        if (!picked) continue;
        const qty = rand(picked.qtyMin || 1, picked.qtyMax || 1);
        if (addDropToBank(player, picked, qty)) {
          pushReward(picked.id, picked.name, qty);
        }
      }

      const uniques = BOSS_UNIQUE_DROPS[monster.id];
      if (Array.isArray(uniques) && uniques.length) {
        let uniqueChance = monster.lvl >= 500 ? 0.07 : 0.04;
        if (RSGame.CustomItems?.hasHazelmereSignetRing?.(player)) {
          uniqueChance *= 10;
        }
        if (Math.random() < uniqueChance) {
          const unique = weightedPick(uniques);
          if (unique && addDropToBank(player, unique, 1)) {
            pushReward(unique.id, unique.name, 1);
          }
        }
      }

      let globalRareChance = monster.lvl >= 300 ? 0.05 : monster.lvl >= 150 ? 0.03 : 0.015;
      if (RSGame.CustomItems?.hasHazelmereSignetRing?.(player)) {
        globalRareChance *= 10;
      }
      if (Math.random() < globalRareChance) {
        const rare = weightedPick(GLOBAL_RARE_DROPS);
        if (rare && addDropToBank(player, rare, 1)) {
          pushReward(rare.id, rare.name, 1);
        }
      }
    }

    RSGame.Bank?.refresh?.();
    RSGame.Game?.saveNow?.();

    const summary = Array.from(rewardTotals.values())
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 6)
      .map((entry) => (entry.name === "Coins" ? entry.qty.toLocaleString() + " coins" : entry.qty.toLocaleString() + "x " + entry.name));

    return {
      ok: true,
      message: "Simulated " + kills + " " + monster.name + " kills. Loot sent to bank." + (summary.length ? " Top drops: " + summary.join(", ") + "." : "")
    };
  }

  function onPlayerDied() {
    combatState.deaths = (combatState.deaths || 0) + 1;
    combatState.currentHp = getMaxHp();
    addLog("You have been defeated and respawned at Lumbridge.");
    stopFight();
    const startBtn = document.getElementById("combat-start-btn");
    if (startBtn) { startBtn.textContent = "Attack"; startBtn.classList.remove("active"); }
  }

  function fightTick() {
    if (!combatState) return;
    const monster = getSelectedMonster();
    const scale  = RSGame.Game?.getTimeScale?.() || 1;

    autoEatBestFood();

    // Player hits monster
    const attackLvl   = getAttackLevel();
    const strengthLvl = getStrengthLevel();
    const defenceLvl  = getDefenceLevel();
    const gearBonuses = getEquippedCombatBonuses();
    const attackBonus = Math.max(
      gearBonuses.attack_stab,
      gearBonuses.attack_slash,
      gearBonuses.attack_crush
    );
    const defenceBonus = (
      gearBonuses.defence_stab +
      gearBonuses.defence_slash +
      gearBonuses.defence_crush
    ) / 3;

    // FURTHER NERF: Reduce player accuracy and damage scaling by ~10% more
    const playerAccuracy = (attackLvl * 2.7) + (attackBonus * 1.35) + Math.floor(strengthLvl * 0.54);
    const monsterDefence = (monster.lvl * 1.18) + Math.floor((monster.maxHit || 1) * 1.18);
    const hitChance = clamp(0.6 + (playerAccuracy - monsterDefence) * 0.0054, 0.20, 0.97);
    let playerDmg = 0;

    if (Math.random() < hitChance) {
      // FURTHER NERF: Reduce max damage from stats and gear by ~10% more
      const maxDmg = Math.max(
        2,
        Math.floor((strengthLvl * 0.99) + (attackLvl * 0.495) + (gearBonuses.melee_strength * 0.2025) + (attackBonus * 0.1125))
      );
      playerDmg = rand(1, maxDmg); // never 0 on hit
    }

    combatState.monsterHp = Math.max(0, combatState.monsterHp - playerDmg);

    if (playerDmg > 0) addLog("You hit " + monster.name + " for " + playerDmg + ".");
    else               addLog("You missed.");

    // XP
    const style = combatState.style;
    if (style === "Attack")   window.Player?.skills?.Attack?.addXP?.(monster.xpPerHit * scale);
    if (style === "Strength") window.Player?.skills?.Strength?.addXP?.(monster.xpPerHit * scale);
    if (style === "Defence")  window.Player?.skills?.Defence?.addXP?.(monster.xpPerHit * scale);
    if (style === "Shared") {
      const share = Math.floor(monster.xpPerHit * scale / 3);
      window.Player?.skills?.Attack?.addXP?.(share);
      window.Player?.skills?.Strength?.addXP?.(share);
      window.Player?.skills?.Defence?.addXP?.(share);
    }
    window.Player?.skills?.Hitpoints?.addXP?.((monster.xpPerHit * scale) / 3);
    RSGame.UI?.renderSkills?.(window.Player);

    if (combatState.monsterHp <= 0) {
      onMonsterKilled(monster);
    } else {
      // Monster hits player

      // FURTHER NERF: Slightly increase monster accuracy and damage compared to previous nerf
      const monsterAccuracy = (monster.lvl * 1.08) + Math.floor((monster.maxHit || 1) * 1.08);
      const playerTankiness = (defenceLvl * 3.15) + Math.floor(defenceBonus * 2.025);
      const monsterHitChance = clamp(0.20 + (monsterAccuracy - playerTankiness) * 0.00165, 0.012, 0.45);
      const gearReduction = clamp(defenceBonus / 264, 0, 0.65);
      const monsterMaxHit = Math.max(0, Math.floor((monster.maxHit || 0) * (1 - gearReduction)));
      const monsterHit = Math.random() < monsterHitChance ? rand(0, monsterMaxHit) : 0;
      combatState.currentHp = Math.max(0, combatState.currentHp - monsterHit);
      if (monsterHit > 0) addLog(monster.name + " hits you for " + monsterHit + ".");
      else                addLog(monster.name + " missed.");

      autoEatBestFood();

      if (combatState.currentHp <= 0) {
        onPlayerDied();
        refreshCombatHpBars();
        return;
      }
    }

    refreshCombatHpBars();

    const delay = Math.max(1, Math.round(2400 / scale));
    fightTimer = setTimeout(fightTick, delay);
  }

  function startFight() {
    if (fightTimer) return;
    initCombatState();
    if (combatState.currentHp <= 0) combatState.currentHp = getMaxHp();
    combatState.monsterHp = getSelectedMonster().hp;
    refreshCombatHpBars();
    const delay = Math.max(1, Math.round(2400 / (RSGame.Game?.getTimeScale?.() || 1)));
    fightTimer = setTimeout(fightTick, delay);
  }

  function stopFight() {
    if (fightTimer) { clearTimeout(fightTimer); fightTimer = null; }
  }

  /* ==========================================================
     COMBAT PANEL UI
  ========================================================== */
  function buildCombatPanel(main) {
    const panel = document.createElement("section");
    panel.className = "panel combat-panel";
    panel.style.display = "none";

    const monster = getSelectedMonster();
    const maxHp = getMaxHp();
    const hp = combatState?.currentHp ?? maxHp;

    panel.innerHTML = `
      <div class="combat-layout">

        <!-- Style selector -->
        <div class="combat-style-row">
          <span class="combat-section-label">Attack Style</span>
          <div class="combat-style-btns" id="combat-style-btns">
            <button class="combat-style-btn ${(combatState?.style||'Attack')==='Attack'?'active':''}" data-style="Attack">⚔ Attack</button>
            <button class="combat-style-btn ${(combatState?.style||'')==='Strength'?'active':''}" data-style="Strength">💪 Strength</button>
            <button class="combat-style-btn ${(combatState?.style||'')==='Defence'?'active':''}" data-style="Defence">🛡 Defence</button>
            <button class="combat-style-btn ${(combatState?.style||'')==='Shared'?'active':''}" data-style="Shared">⚖ Shared</button>
          </div>
        </div>

        <!-- Monster selector -->
        <div class="combat-monster-select-wrap">
          <span class="combat-section-label">Select Monster</span>
          <div class="combat-monster-list" id="combat-monster-list"></div>
        </div>

        <!-- Fight arena -->
        <div class="combat-arena">
          <div class="combat-fighter">
            <div class="combat-fighter-name">You</div>
            <div class="hp-bar-wrap"><div class="hp-bar-fill" id="combat-player-hp-bar-fill" style="width:${pct(hp,maxHp)}%"></div></div>
            <div class="hp-bar-text" id="combat-player-hp-text">${hp} / ${maxHp}</div>
          </div>

          <div class="combat-vs">VS</div>

          <div class="combat-fighter">
            <img id="combat-monster-icon" src="${monster.icon}" alt="${monster.name}" class="combat-monster-icon" onerror="this.style.display='none'" />
            <div class="combat-fighter-name" id="combat-monster-name">${monster.name}</div>
            <div class="hp-bar-wrap"><div class="hp-bar-fill" id="combat-monster-hp-bar-fill" style="width:100%"></div></div>
            <div class="hp-bar-text" id="combat-monster-hp-text">${monster.hp} / ${monster.hp}</div>
          </div>
        </div>

        <div class="combat-actions-row">
          <button id="combat-start-btn" class="combat-action-btn">Attack</button>
          <div id="combat-kill-count" class="combat-kill-count">Kills: 0  Deaths: 0</div>
        </div>

        <!-- Combat log -->
        <div class="combat-log-wrap">
          <div class="combat-section-label">Combat Log</div>
          <ul class="combat-log-lines" id="combat-log-lines"></ul>
        </div>

      </div>
    `;

    main.appendChild(panel);

    // Monster list
    buildMonsterList(panel.querySelector("#combat-monster-list"));

    // Style buttons
    panel.querySelector("#combat-style-btns").addEventListener("click", (e) => {
      const btn = e.target.closest(".combat-style-btn");
      if (!btn) return;
      if (!combatState) initCombatState();
      combatState.style = btn.dataset.style;
      panel.querySelectorAll(".combat-style-btn").forEach(b => b.classList.toggle("active", b === btn));
    });

    // Start / stop
    const startBtn = panel.querySelector("#combat-start-btn");
    startBtn.addEventListener("click", () => {
      if (fightTimer) {
        stopFight();
        startBtn.textContent = "Attack";
        startBtn.classList.remove("active");
      } else {
        initCombatState();
        startFight();
        startBtn.textContent = "Stop";
        startBtn.classList.add("active");
      }
    });

    // Listen for speed changes
    RSGame.Events?.on?.("gameSpeedChange", () => {
      if (fightTimer) { stopFight(); startFight(); }
    });

    if (combatState) {
      refreshCombatHpBars();
      const kEl = panel.querySelector("#combat-kill-count");
      if (kEl) kEl.textContent = "Kills: " + (combatState.kills || 0) + "  Deaths: " + (combatState.deaths || 0);
    }
  }

  function buildSlayerPanel(main) {
    const panel = document.createElement("section");
    panel.className = "panel slayer-panel";
    panel.style.display = "none";
    panel.innerHTML = `
      <div class="combat-layout">
        <div class="slayer-panel-body"></div>
      </div>
    `;
    main.appendChild(panel);
    renderSlayerPanel();
  }

  function buildMonsterList(container) {
    if (!container) return;
    container.innerHTML = "";
    const slayerLvl = Math.max(1, Number(window.Player?.skills?.Slayer?.level) || 1);
    MONSTERS.forEach(m => {
      // Only lock for Slayer if slayerLevel is defined and > 1
      const hasSlayerReq = typeof m.slayerLevel === 'number' && m.slayerLevel > 1;
      const slayerLocked = hasSlayerReq && Number(slayerLvl) < Number(m.slayerLevel);
      const locked = slayerLocked;
      const selected = (combatState?.selectedMonster || "chicken") === m.id;
      const card = document.createElement("div");
      card.className = "combat-monster-card" + (selected ? " selected" : "") + (locked ? " locked" : "");
      card.innerHTML = `
        <img src="${m.icon}" alt="${m.name}" onerror="this.style.display='none'" />
        <div class="cmc-name">${m.name}</div>
        <div class="cmc-lvl">Lvl ${m.lvl}${hasSlayerReq ? ' / Sly ' + m.slayerLevel : ''}</div>
        ${locked ? `<div class=\"cmc-locked\">🔒${slayerLocked ? ' Slayer ' + m.slayerLevel : ''}</div>` : ""}
      `;
      if (!locked) {
        card.addEventListener("click", () => {
          if (!combatState) initCombatState();
          combatState.selectedMonster = m.id;
          combatState.monsterHp = m.hp;
          container.querySelectorAll(".combat-monster-card").forEach(c => c.classList.remove("selected"));
          card.classList.add("selected");
          const nameEl = document.getElementById("combat-monster-name");
          const iconEl = document.getElementById("combat-monster-icon");
          if (nameEl) nameEl.textContent = m.name;
          if (iconEl) { iconEl.src = m.icon; iconEl.alt = m.name; }
          refreshCombatHpBars();
        });
      }
      container.appendChild(card);
    });
  }

  /* ==========================================================
     DUEL ARENA STAKING PANEL
  ========================================================== */
  function stakeItemValue(entry) { return entry.value * entry.qty; }

  function renderStakeOffer(containerId, offer, coins, isPlayer) {
    const el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = "";

    const duelActive = typeof isStakeFightActive === 'function' && isStakeFightActive();
    offer.forEach((entry, idx) => {
      const row = document.createElement("div");
      row.className = "stake-item-row";
      // Add .divine-glow to icon and .rainbow-animated to name if Divine token
      const isDivine = entry.id === "divine_token";
      row.innerHTML = `
        <div class="stake-item-icon-wrap">
          <img src="${entry.icon}" alt="${entry.name}" class="stake-item-icon${isDivine ? ' divine-glow' : ''}" onerror="this.onerror=null;this.src='https://oldschool.runescape.wiki/images/thumb/Coins_10000.png/32px-Coins_10000.png'" />
          ${entry.noted ? '<span class="stake-item-noted">N</span>' : ''}
        </div>
        <span class="stake-item-name${isDivine ? ' rainbow-animated' : ''}">${entry.name}</span>
        <span class="stake-item-qty" title="x${entry.qty}">x${formatNum(entry.qty)}</span>
        <span class="stake-item-val">(${formatNum(entry.value * entry.qty)} gp)</span>
        ${isPlayer && !duelActive ? `<button class="stake-remove-btn" data-idx="${idx}">✕</button>` : ""}
      `;
      el.appendChild(row);
    });

    if (coins > 0) {
      const row = document.createElement("div");
      row.className = "stake-item-row";
      row.innerHTML = `
        <div class="stake-item-icon-wrap">
          <img src="https://oldschool.runescape.wiki/images/thumb/Coins_10000.png/32px-Coins_10000.png" alt="Coins" class="stake-item-icon" />
        </div>
        <span class="stake-item-name">Coins</span>
        <span class="stake-item-qty" title="x${coins}">x${formatNum(coins)}</span>
        <span class="stake-item-val">(${formatNum(coins)} gp)</span>
        ${isPlayer && !duelActive ? `<button class="stake-remove-btn" data-coins="1">✕</button>` : ""}
      `;
      el.appendChild(row);
    }

    if (offer.length === 0 && coins === 0) {
      el.innerHTML = '<div class="stake-empty">Nothing offered yet.</div>';
    }

    if (isPlayer) {
      el.querySelectorAll(".stake-remove-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          clearResolvedDuelPreview();

          function returnStakedEntryToInventory(player, removedEntry) {
            if (!player?.inventory || !removedEntry) return;
            const slots = player.inventory.getSlots?.() || player.inventory.slots || [];
            let remaining = Math.max(0, Number(removedEntry.qty) || 0);

            const sourceSlots = removedEntry.sourceSlots && typeof removedEntry.sourceSlots === "object"
              ? removedEntry.sourceSlots
              : null;

            if (sourceSlots) {
              const ordered = Object.keys(sourceSlots)
                .map((k) => ({ index: Number(k), qty: Math.max(0, Number(sourceSlots[k]) || 0) }))
                .filter((row) => Number.isInteger(row.index) && row.index >= 0 && row.index < slots.length && row.qty > 0)
                .sort((a, b) => a.index - b.index);

              for (const row of ordered) {
                if (remaining <= 0) break;
                const placeQty = Math.min(remaining, row.qty);
                const existingSlot = slots[row.index];

                if (!existingSlot) {
                  slots[row.index] = {
                    id: removedEntry.id,
                    name: removedEntry.name,
                    qty: placeQty,
                    icon: removedEntry.icon,
                    noted: !!removedEntry.noted
                  };
                  remaining -= placeQty;
                  continue;
                }

                if (existingSlot.id === removedEntry.id && !!existingSlot.noted === !!removedEntry.noted) {
                  existingSlot.qty = (Number(existingSlot.qty) || 0) + placeQty;
                  remaining -= placeQty;
                }
              }
            }

            if (remaining > 0) {
              player.inventory.addItem({
                id: removedEntry.id,
                name: removedEntry.name,
                qty: remaining,
                icon: removedEntry.icon,
                noted: removedEntry.noted
              });
            }
          }

          if (btn.dataset.coins) {
            stakeCoins = 0;
          } else {
            const idx = Number(btn.dataset.idx);
            const removed = stakeOffer[idx];
            if (removed) {
              // Return items to inventory
              const player = window.Player;
              if (player && player.inventory) {
                returnStakedEntryToInventory(player, removed);
                RSGame.UI?.renderInventory?.(player);
              }
            }
            stakeOffer.splice(idx, 1);
          }
          queueOpponentOffer();
          refreshDuelPanel();
        });
      });
    }

    // Total row
    const total = offer.reduce((s, e) => s + e.value * e.qty, 0) + coins;
    const totalRow = document.createElement("div");
    totalRow.className = "stake-total-row";
    totalRow.innerHTML = `<span>Total:</span><span class="stake-total-val">${formatNum(total)} gp</span>`;
    el.appendChild(totalRow);
  }

  function generateOpponentOffer(targetValue) {
    const tolerance = 100000;
    // Exclude coins and platinum tokens from the main pool
    const pool = getOpponentOfferPool().filter(item => item.id !== "coins" && item.id !== "platinum_token");
    if (pool.length === 0) {
      return {
        name: pickOpponentName(),
        items: [],
        coins: 0,
        platinumTokens: Math.floor(Math.max(0, Math.round(targetValue)) / 1000)
      };
    }

    // Define price tiers
    const TIERS = [
      { name: "Extremely High", min: 5_000_000_000, max: Infinity },
      { name: "High", min: 1_000_000_000, max: 5_000_000_000 },
      { name: "Medium", min: 500_000_000, max: 1_000_000_000 },
      { name: "Low", min: 10_000, max: 500_000_000 }
    ];

    const desired = Math.max(1, Math.round(targetValue + rand(-tolerance, tolerance)));
    let runningTotal = 0;
    const results = [];

    // Only use items whose value is <= 105% of the player's bet value
    const maxAllowedValue = Math.floor(targetValue * 1.05);
    const minAllowedValue = Math.floor(targetValue * 0.95);
    // Only allow items worth at least 10k and not above the max allowed value
    const filteredPool = pool.filter(item => item.value >= 10000 && item.value <= maxAllowedValue);
    // Sort by value descending
    const sortedPool = filteredPool.sort((a, b) => b.value - a.value);
    let picks = 0;
    for (let i = 0; i < sortedPool.length && runningTotal < maxAllowedValue; i++) {
      const item = sortedPool[i];
      const remaining = maxAllowedValue - runningTotal;
      const maxQty = Math.max(1, Math.floor(remaining / item.value));
      const qty = Math.max(1, Math.min(maxQty, 3000));
      if (qty > 0 && (runningTotal + item.value * qty) <= maxAllowedValue) {
        results.push({
          id: String(item.id),
          name: item.name,
          qty: qty,
          value: item.value,
          icon: item.icon,
          noted: !!item.noted,
          stackable: !!item.stackable
        });
        runningTotal += item.value * qty;
        picks++;
      }
    }
    // If still under minAllowedValue, fill with platinum tokens/coins up to maxAllowedValue
    if (runningTotal < minAllowedValue) {
      let fillValue = Math.min(maxAllowedValue - runningTotal, desired - runningTotal);
      if (fillValue > 0) {
        // Prefer platinum tokens if available, else coins
        let pt = pool.find(item => item.name && item.name.toLowerCase().includes('platinum token'));
        let coin = pool.find(item => item.name && item.name.toLowerCase().includes('coin'));
        if (pt && fillValue >= pt.value) {
          let ptQty = Math.floor(fillValue / pt.value);
          if (ptQty > 0) {
            results.push({
              id: String(pt.id),
              name: pt.name,
              qty: ptQty,
              value: pt.value,
              icon: pt.icon,
              noted: !!pt.noted,
              stackable: !!pt.stackable
            });
            runningTotal += pt.value * ptQty;
            fillValue -= pt.value * ptQty;
          }
        }
        if (coin && fillValue > 0 && fillValue >= coin.value) {
          let coinQty = Math.floor(fillValue / coin.value);
          if (coinQty > 0) {
            results.push({
              id: String(coin.id),
              name: coin.name,
              qty: coinQty,
              value: coin.value,
              icon: coin.icon,
              noted: !!coin.noted,
              stackable: !!coin.stackable
            });
            runningTotal += coin.value * coinQty;
          }
        }
      }
    }

    // Prefer platinum tokens over coins for overflow
    const merged = mergeOfferEntries(results);
    const mergedValue = merged.reduce((sum, entry) => sum + entry.value * entry.qty, 0);
    let coins = 0;
    let platinumTokens = 0;

    if (mergedValue < desired) {
      let remaining = desired - mergedValue;
      platinumTokens = Math.floor(remaining / 1000);
      coins = remaining - platinumTokens * 1000;
    } else if (mergedValue > desired + tolerance) {
      const overflow = mergedValue - desired;
      const trimTarget = overflow - tolerance;
      if (trimTarget > 0 && merged.length) {
        const last = merged[merged.length - 1];
        const removableQty = Math.min(last.qty - 1, Math.ceil(trimTarget / last.value));
        if (removableQty > 0) {
          last.qty -= removableQty;
        }
      }
    }

    // Add platinum tokens to the offer if needed
    if (platinumTokens > 0) {
      merged.push({
        id: "platinum_token",
        name: "Platinum token",
        qty: platinumTokens,
        value: 1000,
        icon: "https://oldschool.runescape.wiki/images/thumb/Platinum_token_detail.png/32px-Platinum_token_detail.png",
        stackable: true
      });
    }

    // Add coins to the offer if needed
    if (coins > 0) {
      merged.push({
        id: "coins",
        name: "Coins",
        qty: coins,
        value: 1,
        icon: "https://oldschool.runescape.wiki/images/thumb/Coins_10000.png/32px-Coins_10000.png",
        stackable: true
      });
    }

    // Sort: items > platinum tokens > coins
    merged.sort((a, b) => {
      const order = (id) => id === "platinum_token" ? 1 : id === "coins" ? 2 : 0;
      return order(a.id) - order(b.id);
    });

    return {
      name: pickOpponentName(),
      items: merged.filter((entry) => entry.qty > 0),
      coins: 0 // coins are now included in items
    };
  }

  function addToStake(invSlot, qty) {
    if (isStakeFightActive()) return;
    clearResolvedDuelPreview();
    const available = getAvailableStakeQty(invSlot.id, invSlot.noted);
    const addQty = Math.max(0, Math.min(Number(qty) || 0, available));
    if (addQty <= 0) return;
    const info = STAKE_BY_ID[invSlot.id];
    const value = resolveOfferItemValue(invSlot);
    const existing = stakeOffer.find(e => e.id === invSlot.id && !!e.noted === !!invSlot.noted);

    function trackSource(entry, slotIndex, amount) {
      if (!Number.isInteger(slotIndex) || slotIndex < 0 || amount <= 0) return;
      entry.sourceSlots = entry.sourceSlots || {};
      const key = String(slotIndex);
      entry.sourceSlots[key] = (Number(entry.sourceSlots[key]) || 0) + amount;
    }

    if (existing) {
      existing.qty += addQty;
    } else {
      stakeOffer.push({
        id: invSlot.id,
        name: invSlot.name,
        qty: addQty,
        value,
        icon: invSlot.icon || info?.icon || "",
        noted: !!invSlot.noted,
        osrsId: invSlot.osrsId || invSlot.osrsID || invSlot.geId || null,
        originalSlotIndex: invSlot._slotIndex, // Track original slot for return
        sourceSlots: {}
      });
    }
    const offerEntry = existing || stakeOffer[stakeOffer.length - 1];

    // Remove from inventory
    const player = window.Player;
    if (player && player.inventory) {
      const slots = player.inventory.getSlots();
      let remaining = addQty;

      const preferredIndex = Number(invSlot._slotIndex);
      if (Number.isInteger(preferredIndex) && preferredIndex >= 0 && preferredIndex < slots.length && remaining > 0) {
        const preferredSlot = slots[preferredIndex];
        if (preferredSlot && preferredSlot.id === invSlot.id && !!preferredSlot.noted === !!invSlot.noted) {
          const removeQty = Math.min(remaining, preferredSlot.qty || 1);
          preferredSlot.qty -= removeQty;
          if (preferredSlot.qty <= 0) player.inventory.slots[preferredIndex] = null;
          trackSource(offerEntry, preferredIndex, removeQty);
          remaining -= removeQty;
        }
      }

      for (let i = 0; i < slots.length && remaining > 0; i++) {
        if (Number.isInteger(preferredIndex) && i === preferredIndex) continue;
        const slot = slots[i];
        if (!slot || slot.id !== invSlot.id || !!slot.noted !== !!invSlot.noted) continue;
        const removeQty = Math.min(remaining, slot.qty || 1);
        slot.qty -= removeQty;
        if (slot.qty <= 0) player.inventory.slots[i] = null;
        trackSource(offerEntry, i, removeQty);
        remaining -= removeQty;
      }
      RSGame.UI?.renderInventory?.(player);
    }
    queueOpponentOffer();
    refreshDuelPanel();
  }

  function formatDuelTimer(msRemaining) {
    const totalSeconds = Math.max(0, Math.ceil(msRemaining / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");
  }

  function generateDamagePlan(totalDamage, rounds, maxHit, forceFinalHit) {
    const plan = [];
    let remaining = Math.max(0, totalDamage);

    for (let i = 0; i < rounds; i++) {
      const remainingSlots = rounds - i - 1;
      if (i === rounds - 1) {
        plan.push(remaining);
        break;
      }

      let minThis = Math.max(0, remaining - (remainingSlots * maxHit));
      let maxThis = Math.min(maxHit, remaining);

      if (forceFinalHit && remainingSlots > 0 && remaining > 0) {
        maxThis = Math.min(maxThis, remaining - 1);
      }

      if (maxThis < minThis) maxThis = minThis;

      let damage;
      if (maxThis === minThis) {
        damage = minThis;
      } else if (minThis === 0 && Math.random() < 0.28) {
        damage = 0;
      } else {
        damage = rand(minThis, maxThis);
      }

      plan.push(damage);
      remaining -= damage;
    }

    if (forceFinalHit && plan.length) {
      const lastIdx = plan.length - 1;
      if (plan[lastIdx] <= 0) {
        for (let i = lastIdx - 1; i >= 0; i--) {
          if (plan[i] > 1) {
            plan[i] -= 1;
            plan[lastIdx] += 1;
            break;
          }
        }
      }
    }

    return plan;
  }

  function buildDuelRounds(playerWins) {
    const rounds = Math.max(10, Math.floor(DUEL_DURATION_MS / DUEL_ROUND_INTERVAL_MS));
    const playerDamageTaken = playerWins ? rand(25, 88) : DUEL_MAX_HP;
    const oppDamageTaken = playerWins ? DUEL_MAX_HP : rand(25, 88);
    const playerHits = generateDamagePlan(oppDamageTaken, rounds, 16, playerWins);
    const oppHits = generateDamagePlan(playerDamageTaken, rounds, 15, !playerWins);

    return Array.from({ length: rounds }, (_, index) => ({
      playerHit: playerHits[index] || 0,
      oppHit: oppHits[index] || 0
    }));
  }

  function buildDuelRoundMessage(round) {
    if (round.playerHit > 0 && round.oppHit > 0) {
      return `You trade heavy blows: ${round.playerHit} to ${opponentOfferName}, ${round.oppHit} back to you.`;
    }
    if (round.playerHit > 0) {
      return `You hit ${opponentOfferName} for ${round.playerHit}.`;
    }
    if (round.oppHit > 0) {
      return `${opponentOfferName} hits you for ${round.oppHit}.`;
    }
    return "Both duelists circle cautiously, looking for an opening.";
  }

  function refreshDuelSimulation() {
    const timerEl = document.getElementById("duel-sim-timer");
    const logEl = document.getElementById("duel-sim-log");
    const playerFill = document.getElementById("duel-player-hp-fill");
    const oppFill = document.getElementById("duel-opp-hp-fill");
    const playerText = document.getElementById("duel-player-hp-text");
    const oppText = document.getElementById("duel-opp-hp-text");
    const playerSplatEl = document.getElementById("duel-player-splats");
    const oppSplatEl = document.getElementById("duel-opp-splats");
    const oppNameEl = document.getElementById("duel-sim-opp-name");
    const panelEl = document.getElementById("duel-sim-panel");
    const playerFighter = document.getElementById("duel-player-fighter");
    const oppFighter = document.getElementById("duel-opp-fighter");

    if (!timerEl || !logEl || !playerFill || !oppFill || !playerText || !oppText || !playerSplatEl || !oppSplatEl || !oppNameEl || !panelEl || !playerFighter || !oppFighter) {
      return;
    }

    const active = duelAnimationState;
    panelEl.classList.toggle("active", !!active?.active);
    panelEl.classList.toggle("resolved", !!active?.resolved && !active?.active);

    if (!active) {
      oppNameEl.textContent = opponentOfferName;
      timerEl.textContent = formatDuelTimer(DUEL_DURATION_MS);
      playerFill.style.width = "100%";
      oppFill.style.width = "100%";
      playerText.textContent = `${DUEL_MAX_HP} / ${DUEL_MAX_HP}`;
      oppText.textContent = `${DUEL_MAX_HP} / ${DUEL_MAX_HP}`;
      playerSplatEl.innerHTML = "";
      oppSplatEl.innerHTML = "";
      logEl.textContent = "Stake an offer to prepare a duel preview.";
      playerFighter.classList.remove("winner", "loser");
      oppFighter.classList.remove("winner", "loser");
      return;
    }

    oppNameEl.textContent = active.opponentName;
    const msRemaining = active.active ? Math.max(0, active.endsAt - Date.now()) : 0;
    timerEl.textContent = active.active ? formatDuelTimer(msRemaining) : "00:00";

    const playerPct = clamp((active.playerHp / DUEL_MAX_HP) * 100, 0, 100);
    const oppPct = clamp((active.oppHp / DUEL_MAX_HP) * 100, 0, 100);
    playerFill.style.width = playerPct + "%";
    oppFill.style.width = oppPct + "%";
    playerFill.className = "duel-sim-hp-fill player" + (playerPct <= 25 ? " low" : playerPct <= 50 ? " mid" : "");
    oppFill.className = "duel-sim-hp-fill opponent" + (oppPct <= 25 ? " low" : oppPct <= 50 ? " mid" : "");
    playerText.textContent = `${active.playerHp} / ${DUEL_MAX_HP}`;
    oppText.textContent = `${active.oppHp} / ${DUEL_MAX_HP}`;

    playerSplatEl.innerHTML = active.lastOppHit
      ? `<span class="duel-hitsplat ${active.lastOppHit > 0 ? "damage" : "miss"}">${active.lastOppHit > 0 ? active.lastOppHit : "0"}</span>`
      : "";
    oppSplatEl.innerHTML = active.lastPlayerHit
      ? `<span class="duel-hitsplat ${active.lastPlayerHit > 0 ? "damage" : "miss"}">${active.lastPlayerHit > 0 ? active.lastPlayerHit : "0"}</span>`
      : "";

    logEl.textContent = active.message;
    playerFighter.classList.toggle("winner", !!active.resolved && active.won);
    playerFighter.classList.toggle("loser", !!active.resolved && !active.won);
    oppFighter.classList.toggle("winner", !!active.resolved && !active.won);
    oppFighter.classList.toggle("loser", !!active.resolved && active.won);
  }

  function finishStakeDuel(panel) {
    if (!duelAnimationState) return;

    clearDuelTimers();

    const state = duelAnimationState;
    const statusEl = panel.querySelector("#stake-status");
    const playerTotal = state.playerTotal;
    const oppTotal = state.oppTotal;
    const won = state.won;

    if (won) {
      // Helper to add to inventory or bank on overflow
      function addToInvOrBank(entry, qty) {
        const ok = window.Player?.inventory?.addItem?.({ ...entry, qty });
        if (!ok && window.RSGame?.Bank?.addToBank) {
          window.RSGame.Bank.addToBank(window.Player, entry, qty);
          return false;
        }
        return ok;
      }
      state.oppOffer.forEach((entry) => addToInvOrBank(entry, entry.qty));
      state.playerOffer.forEach((entry) => addToInvOrBank(entry, entry.qty));
      if (state.stakeCoins > 0) {
        const coinObj = {
          id: "coins",
          name: "Coins",
          qty: state.stakeCoins,
          icon: "https://oldschool.runescape.wiki/images/thumb/Coins_10000.png/32px-Coins_10000.png"
        };
        const ok = window.Player?.inventory?.addItem?.(coinObj);
        if (!ok && window.RSGame?.Bank?.addToBank) {
          window.RSGame.Bank.addToBank(window.Player, coinObj, state.stakeCoins);
        }
      }
      if (state.oppCoins > 0) {
        const coinObj = {
          id: "coins",
          name: "Coins",
          qty: state.oppCoins,
          icon: "https://oldschool.runescape.wiki/images/thumb/Coins_10000.png/32px-Coins_10000.png"
        };
        const ok = window.Player?.inventory?.addItem?.(coinObj);
        if (!ok && window.RSGame?.Bank?.addToBank) {
          window.RSGame.Bank.addToBank(window.Player, coinObj, state.oppCoins);
        }
      }
      if (statusEl) {
        statusEl.innerHTML = `<span class="duel-result-win">🏆 You won after a tense duel and claimed ${formatNum(oppTotal)} gp worth of loot.</span>`;
      }
      combatState.staking.wins = (combatState.staking.wins || 0) + 1;
    } else {
      if (statusEl) {
        statusEl.innerHTML = `<span class="duel-result-loss">💀 ${state.opponentName} defeated you after a tense duel. Your stake was taken.</span>`;
      }
      combatState.staking.losses = (combatState.staking.losses || 0) + 1;
    }

    const now = new Date();
    const dateStr = now.toLocaleDateString() + " " + now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    combatState.staking.history = combatState.staking.history || [];
    combatState.staking.history.unshift({ won, playerTotal, oppTotal, date: dateStr });
    if (combatState.staking.history.length > 12) combatState.staking.history.pop();

    duelAnimationState = {
      ...state,
      active: false,
      resolved: true,
      playerHp: won ? Math.max(1, state.playerHp) : 0,
      oppHp: won ? 0 : Math.max(1, state.oppHp),
      message: won
        ? `You outlasted ${state.opponentName} and took the pot.`
        : `${state.opponentName} wins the duel and claims your stake.`
    };

    const recEl = document.getElementById("duel-record");
    if (recEl) recEl.textContent = `W: ${combatState.staking.wins || 0}  L: ${combatState.staking.losses || 0}`;

    stakeOffer = [];
    stakeCoins = 0;
    clearOpponentOfferState();

    renderStakeOffer("stake-player-items", [], 0, true);
    renderStakeOffer("stake-opp-items", [], 0, false);
    renderDuelHistory(document.getElementById("duel-history-list"));
    refreshDuelPanel();
    RSGame.Game?.saveNow?.();
    RSGame.UI?.renderInventory?.(window.Player);
  }

  function startStakeDuel(panel, playerTotal, oppTotal) {
    clearDuelTimers();
    clearStakeMatchTimer();

    const won = !!window.Player?.winEveryDuel || Math.random() < 0.5;
    duelAnimationState = {
      active: true,
      resolved: false,
      won,
      startedAt: Date.now(),
      endsAt: Date.now() + DUEL_DURATION_MS,
      rounds: buildDuelRounds(won),
      roundIndex: 0,
      playerHp: DUEL_MAX_HP,
      oppHp: DUEL_MAX_HP,
      lastPlayerHit: null,
      lastOppHit: null,
      message: `${opponentOfferName} accepts the challenge. The duel begins...`,
      opponentName: opponentOfferName,
      playerOffer: stakeOffer.map((entry) => ({ ...entry })),
      stakeCoins,
      oppOffer: oppOffer.map((entry) => ({ ...entry })),
      oppCoins,
      playerTotal,
      oppTotal
    };

    const statusEl = panel.querySelector("#stake-status");
    if (statusEl) statusEl.textContent = "The duel is underway. Watch the fight play out before the stake resolves.";

    duelPending = false;
    duelGenerating = false;
    refreshDuelPanel();

    duelCountdownTimer = setInterval(() => {
      if (!duelAnimationState?.active) return;
      refreshDuelSimulation();
    }, 250);

    duelRoundTimer = setInterval(() => {
      if (!duelAnimationState?.active) return;

      const round = duelAnimationState.rounds[duelAnimationState.roundIndex];
      if (!round) {
        finishStakeDuel(panel);
        return;
      }

      duelAnimationState.roundIndex += 1;
      duelAnimationState.lastPlayerHit = round.playerHit;
      duelAnimationState.lastOppHit = round.oppHit;
      duelAnimationState.oppHp = clamp(duelAnimationState.oppHp - round.playerHit, 0, DUEL_MAX_HP);
      duelAnimationState.playerHp = clamp(duelAnimationState.playerHp - round.oppHit, 0, DUEL_MAX_HP);
      duelAnimationState.message = buildDuelRoundMessage(round);

      if (duelAnimationState.roundIndex >= duelAnimationState.rounds.length) {
        duelAnimationState.playerHp = duelAnimationState.won ? Math.max(1, duelAnimationState.playerHp) : 0;
        duelAnimationState.oppHp = duelAnimationState.won ? 0 : Math.max(1, duelAnimationState.oppHp);
        refreshDuelSimulation();
        finishStakeDuel(panel);
        return;
      }

      refreshDuelSimulation();
    }, DUEL_ROUND_INTERVAL_MS);

    refreshDuelSimulation();
  }

  function refreshDuelPanel() {
    syncStakeStateWithInventory();
    if (syncStakeOfferValues()) {
      clearResolvedDuelPreview();
      queueOpponentOffer();
    }

    renderStakeOffer("stake-player-items", stakeOffer, stakeCoins, true);
    renderStakeOffer("stake-opp-items", oppOffer, oppCoins, false);

    const invGrid = document.getElementById("stake-inv-grid");
    if (invGrid) renderStakeInventory(invGrid);

    const rejectBtn = document.getElementById("stake-reject-btn");
    const acceptBtn = document.getElementById("stake-accept-btn");
    const cancelBtn = document.getElementById("stake-cancel-btn");
    const total = stakeOfferTotal();
    const duelActive = isStakeFightActive();

    if (rejectBtn) rejectBtn.disabled = total === 0 || duelGenerating || duelActive;
    if (acceptBtn) acceptBtn.disabled = !duelPending || duelGenerating || duelActive;
    if (cancelBtn) cancelBtn.disabled = duelActive;

    const statusEl = document.getElementById("stake-status");
    if (statusEl && !duelPending && !duelGenerating && !duelActive) {
      statusEl.textContent = total > 0
        ? "Adjust your stake to generate a matched opponent offer."
        : "Add items or coins to stake to start matching an opponent.";
    }

    refreshDuelSimulation();
  }

  function renderStakeInventory(grid) {
    grid.innerHTML = "";
    const slots = window.Player?.inventory?.getSlots?.() || window.Player?.inventory?.slots || [];
    const duelActive = isStakeFightActive();
    slots.forEach((slot, i) => {
      const cell = document.createElement("div");
      cell.className = "stake-inv-slot" + (duelActive ? " duel-locked" : "");

      if (slot && slot.id !== "coins") {
        // Create the img element and add divine-glow if needed
        const img = document.createElement("img");
        img.src = slot.icon || '';
        img.alt = slot.name;
        img.onerror = function() { this.onerror = null; };
        if (slot.id === "divine_token") img.classList.add("divine-glow");

        cell.appendChild(img);
        if (slot.noted) {
          const noteTag = document.createElement("span");
          noteTag.className = "stake-slot-noted";
          noteTag.textContent = "N";
          cell.appendChild(noteTag);
        }
        if (slot.qty > 1) {
          const qtyTag = document.createElement("span");
          qtyTag.className = "item-qty";
          if (typeof window.formatCompactQty === "function") {
            qtyTag.textContent = window.formatCompactQty(slot.qty);
          } else {
            // fallback if not available
            const n = Math.max(0, Number(slot.qty) || 0);
            if (n >= 1e9) qtyTag.textContent = (n / 1e9).toFixed(1).replace(/\.0$/, "") + "b";
            else if (n >= 1e6) qtyTag.textContent = (n / 1e6).toFixed(1).replace(/\.0$/, "") + "m";
            else if (n >= 1e3) qtyTag.textContent = (n / 1e3).toFixed(1).replace(/\.0$/, "") + "k";
            else qtyTag.textContent = String(n);
          }
          cell.appendChild(qtyTag);
        }
        cell.title = slot.name + (slot.noted ? " (noted)" : "");

        // Left click: add 1
        if (!duelActive) cell.addEventListener("click", () => {
          const live = getInventoryItem(slot.id, slot.noted);
          if (!live || getAvailableStakeQty(slot.id, slot.noted) <= 0) return;
          addToStake({ ...live, _slotIndex: i }, 1);
        });

        // Right click: context menu
        if (!duelActive) cell.addEventListener("contextmenu", (e) => {
          e.preventDefault();
          const live = getInventoryItem(slot.id, slot.noted);
          const maxAvail = getAvailableStakeQty(slot.id, slot.noted);
          if (!live || maxAvail <= 0) return;
          const liveFromSlot = { ...live, _slotIndex: i };
          showCtxMenu(e.clientX, e.clientY, [
            { label: "Offer 1",   action: () => addToStake(liveFromSlot, 1) },
            { label: "Offer 10",  action: () => addToStake(liveFromSlot, Math.min(10, maxAvail)) },
            { label: "Offer 100", action: () => addToStake(liveFromSlot, Math.min(100, maxAvail)) },
            { label: "Offer X",   action: () => {
              const val = prompt("How many " + live.name + " to offer? (max " + maxAvail + ")");
              const n = parseInt(val, 10);
              if (!isNaN(n) && n > 0) addToStake(liveFromSlot, Math.min(n, maxAvail));
            }},
            { label: "Offer All", action: () => addToStake(liveFromSlot, maxAvail) }
          ]);
        });
      } else if (slot && slot.id === "coins") {
        cell.innerHTML = `
          <img src="https://oldschool.runescape.wiki/images/thumb/Coins_10000.png/32px-Coins_10000.png" alt="Coins" />
          <span class="stake-inv-qty">${formatNum(slot.qty)}</span>
        `;
        cell.title = "Coins";
        if (!duelActive) cell.addEventListener("click", () => {
          const val = prompt("How many coins to offer? (e.g., 1000, 1k, 1m, 1b) Max " + formatNum(slot.qty));
          const n = parseCoinAmount(val);
          if (n > 0) {
            setStakeCoins(Math.min(n, Number(slot.qty)));
          }
        });
        // Right click: context menu for quick coin amounts
        if (!duelActive) cell.addEventListener("contextmenu", (e) => {
          e.preventDefault();
          const maxCoins = Number(slot.qty) || 0;
          showCtxMenu(e.clientX, e.clientY, [
            { label: "Offer 1K",   action: () => setStakeCoins(Math.min(1000, maxCoins)) },
            { label: "Offer 10K",  action: () => setStakeCoins(Math.min(10000, maxCoins)) },
            { label: "Offer 100K", action: () => setStakeCoins(Math.min(100000, maxCoins)) },
            { label: "Offer 1M",   action: () => setStakeCoins(Math.min(1000000, maxCoins)) },
            { label: "Offer X",    action: () => {
              const val = prompt("How many coins to offer? (e.g., 1000, 1k, 1m) Max " + formatNum(maxCoins));
              const n = parseCoinAmount(val);
              if (n > 0) setStakeCoins(Math.min(n, maxCoins));
            }},
            { label: "Offer All",  action: () => setStakeCoins(maxCoins) }
          ]);
        });
      } else {
        cell.classList.add("empty");
      }
      grid.appendChild(cell);
    });
  }

  function renderDuelHistory(container) {
    container.innerHTML = "";
    const history = combatState?.staking?.history || [];
    if (history.length === 0) {
      container.innerHTML = '<div class="duel-history-empty">No duels yet.</div>';
      return;
    }
    history.forEach(entry => {
      const row = document.createElement("div");
      row.className = "duel-history-row " + (entry.won ? "duel-win" : "duel-loss");
      row.innerHTML = `
        <span class="duel-hist-result">${entry.won ? "🏆 WIN" : "💀 LOSS"}</span>
        <span class="duel-hist-stake">Your stake: ${formatNum(entry.playerTotal)} gp</span>
        <span class="duel-hist-opp">Opp stake: ${formatNum(entry.oppTotal)} gp</span>
        <span class="duel-hist-date">${entry.date || ""}</span>
      `;
      container.appendChild(row);
    });
  }

  function buildDuelPanel(main) {
    const panel = document.createElement("section");
    panel.className = "panel duel-arena-panel";
    panel.style.display = "none";

    panel.innerHTML = `
      <div class="duel-layout">
        <div class="duel-header">
          <img src="https://oldschool.runescape.wiki/images/thumb/Duel_Arena.png/40px-Duel_Arena.png"
               alt="Duel Arena"
               class="duel-header-icon"
               onerror="this.onerror=null;this.src='https://oldschool.runescape.wiki/images/thumb/Coins_10000.png/32px-Coins_10000.png'" />
          <span class="duel-header-title">Duel Arena</span>
          <span class="duel-header-record" id="duel-record"></span>
        </div>

        <div class="duel-sim-panel" id="duel-sim-panel">
          <div class="duel-sim-header">
            <span class="duel-col-label">Arena Fight</span>
            <span class="duel-sim-timer" id="duel-sim-timer">00:30</span>
          </div>

          <div class="duel-sim-arena">
            <div class="duel-sim-fighter player" id="duel-player-fighter">
              <div class="duel-sim-avatar-wrap">
                <img src="https://oldschool.runescape.wiki/images/Attack_icon_(detail).png" alt="You" class="duel-sim-avatar" onerror="this.onerror=null;this.src='https://oldschool.runescape.wiki/images/Inventory.png?d4795'" />
                <div class="duel-sim-splats" id="duel-player-splats"></div>
              </div>
              <div class="duel-sim-name">You</div>
              <div class="duel-sim-hp-bar"><div class="duel-sim-hp-fill player" id="duel-player-hp-fill"></div></div>
              <div class="duel-sim-hp-text" id="duel-player-hp-text">99 / 99</div>
            </div>

            <div class="duel-sim-versus">VS</div>

            <div class="duel-sim-fighter opponent" id="duel-opp-fighter">
              <div class="duel-sim-avatar-wrap">
                <img src="https://oldschool.runescape.wiki/images/thumb/PvP_Arena_icon.png/32px-PvP_Arena_icon.png" alt="Opponent" class="duel-sim-avatar" onerror="this.onerror=null;this.src='https://oldschool.runescape.wiki/images/thumb/Coins_10000.png/32px-Coins_10000.png'" />
                <div class="duel-sim-splats" id="duel-opp-splats"></div>
              </div>
              <div class="duel-sim-name" id="duel-sim-opp-name">${opponentOfferName}</div>
              <div class="duel-sim-hp-bar"><div class="duel-sim-hp-fill opponent" id="duel-opp-hp-fill"></div></div>
              <div class="duel-sim-hp-text" id="duel-opp-hp-text">99 / 99</div>
            </div>
          </div>

          <div class="duel-sim-log" id="duel-sim-log">Stake an offer to prepare a duel preview.</div>
        </div>

        <!-- Main staking area -->
        <div class="duel-stake-area">

          <!-- Inventory picker -->
          <div class="duel-col">
            <div class="duel-col-label">Your Inventory</div>
            <div class="stake-inv-grid" id="stake-inv-grid"></div>
            <div class="stake-help-text">Left click offers 1 item. Right click offers 1, 10, 100, X, or All. Use the coin stack for gp offers.</div>
          </div>

          <!-- Your offer -->
          <div class="duel-col">
            <div class="duel-col-label">Your Offer</div>
            <div class="stake-offer-list" id="stake-player-items"></div>
          </div>

          <!-- Opponent offer -->
          <div class="duel-col">
            <div class="duel-col-label">Opponent Offer</div>
            <div class="stake-offer-list" id="stake-opp-items"></div>
          </div>

        </div>

        <!-- Actions -->
        <div class="duel-actions">
          <button id="stake-reject-btn" class="duel-btn">Reject Offer</button>
          <button id="stake-accept-btn" class="duel-btn duel-btn-accept" disabled>Fight</button>
          <button id="stake-cancel-btn" class="duel-btn duel-btn-cancel">Clear</button>
        </div>

        <div id="stake-status" class="stake-status">Add items or coins to stake to start matching an opponent.</div>

        <!-- History -->
        <div class="duel-history-wrap">
          <div class="duel-col-label">Recent Duels</div>
          <div class="duel-history-list" id="duel-history-list"></div>
        </div>
      </div>
    `;

    main.appendChild(panel);

    panel.querySelector("#stake-reject-btn").addEventListener("click", () => {
      if (stakeOfferTotal() <= 0) return;
      clearResolvedDuelPreview();
      queueOpponentOffer(true);
      refreshDuelPanel();
    });

    // Accept duel
    panel.querySelector("#stake-accept-btn").addEventListener("click", () => {
      if (!duelPending || isStakeFightActive()) return;
      const playerTotal = stakeOfferTotal();
      const oppTotal = oppOffer.reduce((s, e) => s + e.value * e.qty, 0) + oppCoins;

      // Items are escrowed as soon as they are added to the stake. Only coins
      // remain in the live inventory until the duel actually begins.
      if (stakeCoins > 0 && getInventoryCoins() < stakeCoins) {
        const statusEl = panel.querySelector("#stake-status");
        if (statusEl) statusEl.textContent = "You no longer have the coins needed for this stake.";
        clearOpponentOfferState();
        refreshDuelPanel();
        return;
      }

      if (stakeCoins > 0) removeInventoryCoins(stakeCoins);

      startStakeDuel(panel, playerTotal, oppTotal);
    });

    // Clear
    panel.querySelector("#stake-cancel-btn").addEventListener("click", () => {
      if (isStakeFightActive()) return;
      clearResolvedDuelPreview();
      stakeOffer = [];
      stakeCoins = 0;
      clearOpponentOfferState();
      const statusEl = panel.querySelector("#stake-status");
      if (statusEl) statusEl.textContent = "Add items or coins to stake to start matching an opponent.";
      refreshDuelPanel();
    });
  }

  /* ==========================================================
     TAB BUTTONS
  ========================================================== */
  function buildTabs(tabBar) {
    // Combat tab
    const combatBtn = document.createElement("button");
    combatBtn.className = "tab-btn";
    combatBtn.dataset.tab = "combat";
    combatBtn.title = "Combat Training";
    combatBtn.innerHTML = `<img src="https://oldschool.runescape.wiki/images/Attack_icon_(detail).png" alt="Combat" class="tab-icon" onerror="this.onerror=null" /><span class="tab-label">Combat</span>`;
    tabBar.appendChild(combatBtn);

    // Duel Arena tab
    const duelBtn = document.createElement("button");
    duelBtn.className = "tab-btn";
    duelBtn.dataset.tab = "duel-arena";
    duelBtn.title = "Duel Arena";
    duelBtn.innerHTML = `<img src="https://oldschool.runescape.wiki/images/Duel_Arena.png" alt="Duel Arena" class="tab-icon" onerror="this.onerror=null;this.src='https://oldschool.runescape.wiki/images/thumb/Coins_10000.png/32px-Coins_10000.png'" /><span class="tab-label">Duel Arena</span>`;
    tabBar.appendChild(duelBtn);
  }

  /* ==========================================================
     MOD REGISTRATION
  ========================================================== */
  RSGame.Combat = {
    ...(RSGame.Combat || {}),
    getMonsterById,
    simulateBossKillsToBank
  };

  RSGame.Game.registerMod({
    name: "Combat & Duel Arena",

    onGameInit(game) {
      const tabBar = document.querySelector("#tab-bar");
      const main   = document.querySelector(".main-layout");
      if (!tabBar || !main) return;

      if (!tabBar.querySelector('.tab-btn[data-tab="slayer"]')) {
        const slayerBtn = document.createElement("button");
        slayerBtn.className = "tab-btn";
        slayerBtn.dataset.tab = "slayer";
        slayerBtn.title = "Slayer";
        slayerBtn.innerHTML = `<img class="tab-icon" src="https://oldschool.runescape.wiki/images/Slayer_icon_(detail).png" alt="Slayer" onerror="this.onerror=null;this.src='https://oldschool.runescape.wiki/images/Attack_icon_(detail).png'" /><span class="tab-label">Slayer</span>`;
        tabBar.appendChild(slayerBtn);
      }

      // Bind combat state from save
      combatState = window.Player?.combat || null;
      initCombatState();

      // Tab buttons are hard-coded in index.html — only build the panels
      buildCombatPanel(main);
      buildSlayerPanel(main);
      buildDuelPanel(main);
      buildContextMenu();

      // Init duel history + record
      const histEl = document.getElementById("duel-history-list");
      if (histEl) renderDuelHistory(histEl);
      const recEl = document.getElementById("duel-record");
      if (recEl && combatState?.staking) {
        recEl.textContent = `W: ${combatState.staking.wins || 0}  L: ${combatState.staking.losses || 0}`;
      }

      // Initial inventory render for stake panel (defer to after initTabs)
      setTimeout(() => refreshDuelPanel(), 100);

      // Keep duel inventory perfectly aligned with the same render/update cycle as the main inventory.
      const syncDuelInventory = () => refreshDuelPanel();
      RSGame.Events?.on?.("playerUpdated", syncDuelInventory);
      RSGame.Events?.on?.("inventoryRendered", syncDuelInventory);
    }
  });

})();
