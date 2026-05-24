// content/02_zones_ui_mod.js

window.RSGame = window.RSGame || {};

(function () {

  RSGame.Game.registerMod({
    name: "Zones UI",

    onGameInit(game) {
      console.log("[Zones UI] Building UI after all mods registered...");

      const tabBar = document.querySelector("#tab-bar");
      const main = document.querySelector(".main-layout");

      if (!tabBar || !main) return;

      /* ---------------------------------------------------
         PANELS
      --------------------------------------------------- */
      const zonesPanel = document.createElement("section");
      zonesPanel.className = "panel zones-panel";
      zonesPanel.style.display = "none";
      zonesPanel.innerHTML = `<h2>Zones</h2>`;
      main.appendChild(zonesPanel);

      const gatheringPanel = document.createElement("section");
      gatheringPanel.className = "panel gathering-panel";
      gatheringPanel.style.display = "none";
      gatheringPanel.innerHTML = `<h2>Shop</h2>`;
      main.appendChild(gatheringPanel);

      /* ---------------------------------------------------
         TAB BUTTONS
      --------------------------------------------------- */
      const gatheringBtn = document.createElement("button");
      gatheringBtn.className = "tab-btn";
      gatheringBtn.dataset.tab = "gathering";
      gatheringBtn.innerHTML = `
        <img class="tab-icon" src="https://oldschool.runescape.wiki/images/Woodcutting_icon_(detail).png" alt="Shop">
        <span class="tab-label">Shop</span>
      `;
      tabBar.appendChild(gatheringBtn);
    }
  });

})();
