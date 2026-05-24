// content/13_mining_zones.js

(function () {

  RSGame.Zones.registerZone({
    id: "copper_tin_mine",
    name: "Copper & Tin Mine",
    category: "gathering",
    activities: [
      {
        id: "mine_copper",
        type: "mining",
        name: "Mine Copper",
        rock: "copper"
      },
      {
        id: "mine_tin",
        type: "mining",
        name: "Mine Tin",
        rock: "tin"
      }
    ]
  });

  RSGame.Zones.registerZone({
    id: "iron_mine",
    name: "Iron Mine",
    category: "gathering",
    activities: [
      {
        id: "mine_iron",
        type: "mining",
        name: "Mine Iron",
        rock: "iron"
      }
    ]
  });

  RSGame.Zones.registerZone({
    id: "silver_mine",
    name: "Silver Mine",
    category: "gathering",
    activities: [
      {
        id: "mine_silver",
        type: "mining",
        name: "Mine Silver",
        rock: "silver"
      }
    ]
  });

  RSGame.Zones.registerZone({
    id: "coal_mine",
    name: "Coal Mine",
    category: "gathering",
    activities: [
      {
        id: "mine_coal",
        type: "mining",
        name: "Mine Coal",
        rock: "coal"
      }
    ]
  });

  RSGame.Zones.registerZone({
    id: "gold_mine",
    name: "Gold Mine",
    category: "gathering",
    activities: [
      {
        id: "mine_gold",
        type: "mining",
        name: "Mine Gold",
        rock: "gold"
      }
    ]
  });

  RSGame.Zones.registerZone({
    id: "mithril_mine",
    name: "Mithril Mine",
    category: "gathering",
    activities: [
      {
        id: "mine_mithril",
        type: "mining",
        name: "Mine Mithril",
        rock: "mithril"
      }
    ]
  });

  RSGame.Zones.registerZone({
    id: "adamantite_mine",
    name: "Adamantite Mine",
    category: "gathering",
    activities: [
      {
        id: "mine_adamantite",
        type: "mining",
        name: "Mine Adamantite",
        rock: "adamantite"
      }
    ]
  });

  RSGame.Zones.registerZone({
    id: "runite_mine",
    name: "Runite Mine",
    category: "gathering",
    activities: [
      {
        id: "mine_runite",
        type: "mining",
        name: "Mine Runite",
        rock: "runite"
      }
    ]
  });

  RSGame.Zones.registerZone({
    id: "amethyst_mine",
    name: "Amethyst Mine",
    category: "gathering",
    activities: [
      {
        id: "mine_amethyst",
        type: "mining",
        name: "Mine Amethyst",
        rock: "amethyst"
      }
    ]
  });

  console.log("[Mining Zones] Registered.");

})();
