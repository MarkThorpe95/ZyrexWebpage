// content/items_loader_mod.js

(function () {
  function osrsIcon(file) {
    return `https://oldschool.runescape.wiki/images/thumb/${file}/32px-${file}`;
  }

  RSGame.Game.registerMod({
    name: "OSRS Item Loader",

    onGameInit(game) {
      const inv = game.player.inventory;
      const eq = game.player.equipment;

      function hasItem(itemId) {
        return (inv.slots || []).some((slot) => slot && slot.id === itemId);
      }

      // New saves get this once; existing saves should never get duplicate starter gear.
      if (game.player.starterPackGranted) {
        return;
      }

      // Backward-compatibility for old saves created before the starter flag existed.
      const hasLegacyStarter =
        hasItem("bronze_sword") ||
        hasItem("bronze_pickaxe") ||
        hasItem("knife") ||
        hasItem("iron_pickaxe") ||
        hasItem("small_fishing_net") ||
        hasItem("tinderbox") ||
        hasItem("coins") ||
        hasItem("raw_shrimp") ||
        hasItem("leather_body") ||
        Object.values(eq.slots || {}).some((slot) => !!slot);

      if (hasLegacyStarter) {
        game.player.starterPackGranted = true;
        return;
      }

      // New saves now start with gp only.
      inv.addItem({
        id: "coins",
        name: "Coins",
        icon: osrsIcon("Coins_10000.png"),
        qty: 150000
      });

      game.player.starterPackGranted = true;

      console.log("[OSRS Item Loader] Items loaded.");
    }
  });
})();
