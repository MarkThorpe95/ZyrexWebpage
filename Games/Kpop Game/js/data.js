// Constants, recipes, drops, etc.

// Portrait URLs (Stable Derpy)
const portraits = {
    mira: "https://static.wikia.nocookie.net/kpop-demon-hunters/images/9/90/Mira_Portrait.png",
    zoey: "https://static.wikia.nocookie.net/kpop-demon-hunters/images/9/98/Zoey_Portrait.png",
    rumi: "https://static.wikia.nocookie.net/kpop-demon-hunters/images/3/31/Rumi_Portrait.png",
    derpy: "https://static.wikia.nocookie.net/kpop-demon-hunters/images/7/73/Derpy_Portrait_temp.png"
};

const enemyPortraits = {
    training: "https://static.wikia.nocookie.net/kpop-demon-hunters/images/9/98/Zoey_Portrait.png",
    normal: [
        "https://static.wikia.nocookie.net/kpop-demon-hunters/images/9/90/Mira_Portrait.png",
        "https://static.wikia.nocookie.net/kpop-demon-hunters/images/3/31/Rumi_Portrait.png"
    ],
    infinite: "https://static.wikia.nocookie.net/kpop-demon-hunters/images/7/73/Derpy_Portrait_temp.png"
};

const weaponConfigs = {
    mira: {
        weaponName: "Neon Sakura",
        description: "Mira's signature neon katana glows brighter with every upgrade.",
        image: portraits.mira,
        aspects: [
            { key: "attack", title: "Neon Slash", desc: "Increase weapon damage by 6% per rank.", baseCost: 80, costStep: 30, maxRank: 5 },
            { key: "crit", title: "Pulse Edge", desc: "Raise critical hit chance by 3% per rank.", baseCost: 110, costStep: 35, maxRank: 5 },
            { key: "soulGain", title: "Spirit Resonance", desc: "Gain extra Souls from defeated enemies.", baseCost: 95, costStep: 28, maxRank: 5 }
        ]
    },
    zoey: {
        weaponName: "Pulse Baton",
        description: "Zoey's rhythm-infused baton harnesses beat energy for devastating strikes.",
        image: portraits.zoey,
        aspects: [
            { key: "attack", title: "Rhythm Burst", desc: "Increase weapon damage by 5% per rank.", baseCost: 75, costStep: 25, maxRank: 5 },
            { key: "crit", title: "Star Chorus", desc: "Gain a chance to deal enhanced burst damage.", baseCost: 120, costStep: 30, maxRank: 5 },
            { key: "soulGain", title: "Soul Sync", desc: "Collect more Souls after each kill.", baseCost: 90, costStep: 26, maxRank: 5 }
        ]
    },
    rumi: {
        weaponName: "Lunar Scythe",
        description: "Rumi's moonlit scythe carves through shadows with graceful power.",
        image: portraits.rumi,
        aspects: [
            { key: "attack", title: "Shadow Bloom", desc: "Increase weapon damage by 5% per rank.", baseCost: 85, costStep: 29, maxRank: 5 },
            { key: "crit", title: "Moon Requiem", desc: "Raise critical damage frequency.", baseCost: 115, costStep: 34, maxRank: 5 },
            { key: "soulGain", title: "Ghost Echo", desc: "Gain bonus Souls from spectral foes.", baseCost: 100, costStep: 30, maxRank: 5 }
        ]
    }
};

// Cooking system data
let demonDrops = {
    "demon_meat": 0,
    "spicy_pepper": 0,
    "rice": 0,
    "herbs": 0,
    "tea_leaves": 0,
    "boba": 0,
    "kimchi": 0,
    "seaweed": 0,
    "egg": 0,
    "soy_sauce": 0,
    "garlic": 0,
    "chicken": 0,
    "beef": 0,
    "shrimp": 0,
    "gochujang": 0,
    "sweet_potato": 0,
    "milk": 0,
    "honey": 0,
    "lemon": 0
};

let cookingInventory = {
    "ramen": 0,
    "spicy_bbq": 0,
    "herbal_tea": 0,
    "boba_tea": 0,
    "kimchi_stew": 0,
    "bulgogi": 0,
    "tteokbokki": 0,
    "bibimbap": 0,
    "soju": 0,
    "yakult": 0,
    "bubble_milk_tea": 0,
    "honey_lemon_tea": 0,
    "seaweed_soup": 0,
    "omurice": 0,
    "shrimp_tempura": 0,
    "sweet_potato_latte": 0
};

// Each recipe: name, key, ingredients, heal, requiredLevel, xp
const cookingRecipes = [
    // Level 1-10
    { name: "Ramen", key: "ramen", ingredients: { demon_meat: 2, rice: 1 }, heal: 60, requiredLevel: 1, xp: 5 },
    { name: "Herbal Tea", key: "herbal_tea", ingredients: { herbs: 2, tea_leaves: 1 }, heal: 40, requiredLevel: 1, xp: 3 },
    { name: "Boba Tea", key: "boba_tea", ingredients: { boba: 2, tea_leaves: 1 }, heal: 50, requiredLevel: 2, xp: 4 },
    { name: "Kimchi Stew", key: "kimchi_stew", ingredients: { kimchi: 2, beef: 1, garlic: 1 }, heal: 90, requiredLevel: 5, xp: 8 },
    { name: "Seaweed Soup", key: "seaweed_soup", ingredients: { seaweed: 2, beef: 1 }, heal: 70, requiredLevel: 7, xp: 7 },
    // Level 11-30
    { name: "Spicy BBQ", key: "spicy_bbq", ingredients: { demon_meat: 2, spicy_pepper: 2 }, heal: 80, requiredLevel: 12, xp: 10 },
    { name: "Bulgogi", key: "bulgogi", ingredients: { beef: 2, soy_sauce: 1, garlic: 1 }, heal: 120, requiredLevel: 15, xp: 12 },
    { name: "Tteokbokki", key: "tteokbokki", ingredients: { rice: 2, gochujang: 2 }, heal: 100, requiredLevel: 18, xp: 11 },
    { name: "Yakult", key: "yakult", ingredients: { milk: 1, honey: 1 }, heal: 30, requiredLevel: 20, xp: 5 },
    // Level 31-60
    { name: "Bibimbap", key: "bibimbap", ingredients: { rice: 2, egg: 1, beef: 1, seaweed: 1 }, heal: 150, requiredLevel: 35, xp: 18 },
    { name: "Omurice", key: "omurice", ingredients: { rice: 2, egg: 2, chicken: 1 }, heal: 110, requiredLevel: 40, xp: 15 },
    { name: "Shrimp Tempura", key: "shrimp_tempura", ingredients: { shrimp: 2, egg: 1 }, heal: 130, requiredLevel: 50, xp: 16 },
    // Level 61-100
    { name: "Soju", key: "soju", ingredients: { rice: 2 }, heal: 10, requiredLevel: 65, xp: 2 },
    { name: "Bubble Milk Tea", key: "bubble_milk_tea", ingredients: { boba: 2, milk: 1 }, heal: 60, requiredLevel: 70, xp: 8 },
    { name: "Honey Lemon Tea", key: "honey_lemon_tea", ingredients: { honey: 1, lemon: 1, tea_leaves: 1 }, heal: 80, requiredLevel: 80, xp: 10 },
    { name: "Sweet Potato Latte", key: "sweet_potato_latte", ingredients: { sweet_potato: 2, milk: 1 }, heal: 100, requiredLevel: 95, xp: 15 }
    // Add more from the movie as needed
];
