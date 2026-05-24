// content/woodcutting_zones.js

(function () {

  /* ---------------------------------------------------
     REGISTER WOODCUTTING ZONES
  --------------------------------------------------- */

  RSGame.Zones.registerZone({
    id: "forest",
    name: "Forest",
    category: "gathering",
    activities: [
      {
        id: "cut_normal",
        type: "woodcutting",
        name: "Cut Trees",
        tree: "normal"
      }
    ]
  });

  RSGame.Zones.registerZone({
    id: "oak_grove",
    name: "Oak Grove",
    category: "gathering",
    activities: [
      {
        id: "cut_oak",
        type: "woodcutting",
        name: "Cut Oak Trees",
        tree: "oak"
      }
    ]
  });

  RSGame.Zones.registerZone({
    id: "willow_marsh",
    name: "Willow Marsh",
    category: "gathering",
    activities: [
      {
        id: "cut_willow",
        type: "woodcutting",
        name: "Cut Willow Trees",
        tree: "willow"
      }
    ]
  });

  RSGame.Zones.registerZone({
    id: "maple_ridge",
    name: "Maple Ridge",
    category: "gathering",
    activities: [
      {
        id: "cut_maple",
        type: "woodcutting",
        name: "Cut Maple Trees",
        tree: "maple"
      }
    ]
  });

  RSGame.Zones.registerZone({
    id: "yew_grove",
    name: "Yew Grove",
    category: "gathering",
    activities: [
      {
        id: "cut_yew",
        type: "woodcutting",
        name: "Cut Yew Trees",
        tree: "yew"
      }
    ]
  });

  RSGame.Zones.registerZone({
    id: "blisterwood_grove",
    name: "Blisterwood Grove",
    category: "gathering",
    activities: [
      {
        id: "cut_blisterwood",
        type: "woodcutting",
        name: "Cut Blisterwood Trees",
        tree: "blisterwood"
      }
    ]
  });

  RSGame.Zones.registerZone({
    id: "magic_enclave",
    name: "Magic Enclave",
    category: "gathering",
    activities: [
      {
        id: "cut_magic",
        type: "woodcutting",
        name: "Cut Magic Trees",
        tree: "magic"
      }
    ]
  });

  RSGame.Zones.registerZone({
    id: "redwood_grove",
    name: "Redwood Grove",
    category: "gathering",
    activities: [
      {
        id: "cut_redwood",
        type: "woodcutting",
        name: "Cut Redwood Trees",
        tree: "redwood"
      }
    ]
  });

  console.log("[Woodcutting Zones] Registered.");



})();

