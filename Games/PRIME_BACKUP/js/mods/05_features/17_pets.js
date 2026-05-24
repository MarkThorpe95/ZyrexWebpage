window.RSGame = window.RSGame || {};

(function () {
  function wikiIcon(file, size = 32) {
    return "https://oldschool.runescape.wiki/images/thumb/" + file + "/" + size + "px-" + file;
  }

  const PET_DEFS = [
    { id: "beaver", name: "Beaver", icon: wikiIcon("Beaver.png") },
    { id: "rock_golem", name: "Rock golem", icon: wikiIcon("Rock_golem.png") },
    { id: "rift_guardian", name: "Rift guardian", icon: wikiIcon("Rift_guardian.png") },
    { id: "tangleroot", name: "Tangleroot", icon: wikiIcon("Tangleroot.png") },
    { id: "heron", name: "Heron", icon: wikiIcon("Heron.png") },
    { id: "phoenix", name: "Phoenix", icon: wikiIcon("Phoenix.png") },
    { id: "squirrel", name: "Squirrel", icon: wikiIcon("Squirrel.png") },
    { id: "raccoon", name: "Raccoon", icon: wikiIcon("Raccoon.png") },
    { id: "chinchompa", name: "Chinchompa", icon: wikiIcon("Chinchompa_(pet).png") },
    { id: "giant_squirrel", name: "Giant squirrel", icon: wikiIcon("Giant_squirrel.png") },
    { id: "bloodhound", name: "Bloodhound", icon: wikiIcon("Bloodhound.png") },
    { id: "pet_kraken", name: "Pet kraken", icon: wikiIcon("Pet_kraken.png") },
    { id: "pet_smoke_devil", name: "Pet smoke devil", icon: wikiIcon("Pet_smoke_devil.png") },
    { id: "pet_dark_core", name: "Pet dark core", icon: wikiIcon("Pet_dark_core.png") },
    { id: "prince_black_dragon", name: "Prince Black Dragon", icon: wikiIcon("Prince_Black_Dragon.png") },
    { id: "kalphite_princess", name: "Kalphite princess", icon: wikiIcon("Kalphite_princess.png") },
    { id: "pet_snakeling", name: "Pet snakeling", icon: wikiIcon("Pet_snakeling.png") },
    { id: "venenatis_spiderling", name: "Venenatis spiderling", icon: wikiIcon("Venenatis_spiderling.png") },
    { id: "vetion_jr", name: "Vet'ion jr.", icon: wikiIcon("Vet%27ion_jr..png") },
    { id: "callisto_cub", name: "Callisto cub", icon: wikiIcon("Callisto_cub.png") },
    { id: "scorpias_offspring", name: "Scorpia's offspring", icon: wikiIcon("Scorpia%27s_offspring.png") },
    { id: "venenatis_spindel", name: "Spindel pet", icon: wikiIcon("Venenatis_spiderling.png") },
    { id: "nexling", name: "Nexling", icon: wikiIcon("Nexling.png") },
    { id: "vorki", name: "Vorki", icon: wikiIcon("Vorki.png") },
    { id: "noon", name: "Noon", icon: wikiIcon("Noon.png") },
    { id: "pet_kree_arra", name: "Pet kree'arra", icon: wikiIcon("Pet_kree%27arra.png") },
    { id: "pet_general_graardor", name: "Pet general graardor", icon: wikiIcon("Pet_general_graardor.png") },
    { id: "pet_zilyana", name: "Pet zilyana", icon: wikiIcon("Pet_zilyana.png") },
    { id: "pet_kril_tsutsaroth", name: "Pet k'ril tsutsaroth", icon: wikiIcon("Pet_k%27ril_tsutsaroth.png") },
    { id: "pet_chaos_elemental", name: "Pet chaos elemental", icon: wikiIcon("Pet_chaos_elemental.png") },
    { id: "jad_pet", name: "Jal-nib-rek", icon: wikiIcon("Jal-nib-rek.png") },
    { id: "zuk_pet", name: "Tzrek-zuk", icon: wikiIcon("TzRek-Zuk.png") },
    { id: "lil_zik", name: "Lil' zik", icon: wikiIcon("Lil%27_zik.png") },
    { id: "olmlet", name: "Olmlet", icon: wikiIcon("Olmlet.png") },
    { id: "tumekens_guardian", name: "Tumeken's guardian", icon: wikiIcon("Tumeken%27s_guardian.png") },
    { id: "abyssal_orphan", name: "Abyssal orphan", icon: wikiIcon("Abyssal_orphan.png") },
    { id: "hellpuppy", name: "Hellpuppy", icon: wikiIcon("Hellpuppy.png") },
    { id: "mole", name: "Baby mole", icon: wikiIcon("Baby_mole.png") },
    { id: "pet_penance_queen", name: "Pet penance queen", icon: wikiIcon("Pet_penance_queen.png") },
    { id: "tiny_tempor", name: "Tiny tempor", icon: wikiIcon("Tiny_tempor.png") },
    { id: "youngllef", name: "Youngllef", icon: wikiIcon("Youngllef.png") },
    { id: "rift_pup", name: "Rift pup", icon: wikiIcon("Rift_pup.png") },
    { id: "smolcano", name: "Smolcano", icon: wikiIcon("Smolcano.png") },
    { id: "skotos", name: "Skotos", icon: wikiIcon("Skotos.png") },
    { id: "pet_dagannoth_prime", name: "Pet dagannoth prime", icon: wikiIcon("Pet_dagannoth_prime.png") },
    { id: "pet_dagannoth_rex", name: "Pet dagannoth rex", icon: wikiIcon("Pet_dagannoth_rex.png") },
    { id: "pet_dagannoth_supreme", name: "Pet dagannoth supreme", icon: wikiIcon("Pet_dagannoth_supreme.png") },
    { id: "i_kkle_hydra", name: "Ikkle hydra", icon: wikiIcon("Ikkle_hydra.png") },
    { id: "sraracha", name: "Sraracha", icon: wikiIcon("Sraracha.png") },
    { id: "baron", name: "Baron", icon: wikiIcon("Baron.png") },
    { id: "muphin", name: "Muphin", icon: wikiIcon("Muphin.png") },
    { id: "quetzin", name: "Quetzin", icon: wikiIcon("Quetzin.png") },
    { id: "butch", name: "Butch", icon: wikiIcon("Butch.png") },
    { id: "scarred_gem_maw", name: "Scarred gem maw", icon: wikiIcon("Scarred_gem_maw.png") }
  ];
  const PET_BY_ID = Object.fromEntries(PET_DEFS.map((pet) => [pet.id, pet]));
  const PET_ID_BY_NAME = Object.fromEntries(PET_DEFS.map((pet) => [String(pet.name || "").toLowerCase(), pet.id]));
  const PET_SOURCE_PERKS = {
    beaver: { skillMods: { Woodcutting: { xpMultiplier: 1.04, outputMultiplier: 1.06 } } },
    rock_golem: { skillMods: { Mining: { xpMultiplier: 1.04, outputMultiplier: 1.06 } } },
    heron: { skillMods: { Fishing: { xpMultiplier: 1.04, outputMultiplier: 1.05 } } },
    giant_squirrel: { skillMods: { Agility: { xpMultiplier: 1.05 } } },
    squirrel: { skillMods: { Agility: { xpMultiplier: 1.04 } } },
    rift_guardian: { skillMods: { Runecraft: { xpMultiplier: 1.04, outputMultiplier: 1.05 } } },
    tangleroot: { skillMods: { Farming: { xpMultiplier: 1.05, outputMultiplier: 1.05 } } },
    raccoon: { skillMods: { Thieving: { xpMultiplier: 1.05, successBonus: 0.02 } }, geFillRateMultiplier: 1.03 },
    phoenix: { skillMods: { Firemaking: { xpMultiplier: 1.05 } } },
    chinchompa: { skillMods: { Hunter: { xpMultiplier: 1.05, outputMultiplier: 1.05 } } },
    bloodhound: { coinMultiplierBySource: { clues: 1.08 } },
    pet_kraken: { coinMultiplierBySource: { combat: 1.03 } },
    pet_general_graardor: { coinMultiplierBySource: { combat: 1.03 } },
    lil_zik: { coinMultiplierBySource: { raids: 1.05 } },
    olmlet: { coinMultiplierBySource: { raids: 1.04 } },
    tiny_tempor: { coinMultiplierBySource: { minigames: 1.05 } },
    pet_penance_queen: { coinMultiplierBySource: { minigames: 1.04 } },
    rift_pup: { coinMultiplierBySource: { minigames: 1.03 } }
  };

  function getPetState() {
    if (!window.Player) return null;
    window.Player.combat = window.Player.combat || {};
    const st = window.Player.combat.pets || {};
    if (!st.unlocked || typeof st.unlocked !== "object") st.unlocked = {};
    window.Player.combat.pets = st;
    return st;
  }

  function hasItemAnywhere(itemId) {
    const id = String(itemId || "");
    const invSlots = window.Player?.inventory?.slots || [];
    const inInv = invSlots.some((slot) => slot && slot.id === id && (Number(slot.qty) || 0) > 0);
    if (inInv) return true;
    const bankQty = Number(window.Player?.bank?.items?.[id]?.qty) || 0;
    return bankQty > 0;
  }

  function syncAutoUnlocks() {
    const st = getPetState();
    if (!st) return;
    if (hasItemAnywhere("bloodhound")) st.unlocked.bloodhound = true;
  }

  function resolvePetId(itemLike) {
    if (!itemLike) return null;
    const byId = String(itemLike.id || "").toLowerCase();
    if (PET_BY_ID[byId]) return byId;

    const byName = String(itemLike.name || "").toLowerCase();
    if (PET_ID_BY_NAME[byName]) return PET_ID_BY_NAME[byName];
    return null;
  }

  function migratePetItemsToUnlocks() {
    if (!window.Player) return;
    const st = getPetState();
    if (!st) return;

    let converted = 0;

    const invSlots = window.Player.inventory?.slots || [];
    for (let i = 0; i < invSlots.length; i++) {
      const slot = invSlots[i];
      if (!slot) continue;
      const petId = resolvePetId(slot);
      if (!petId) continue;
      st.unlocked[petId] = true;
      invSlots[i] = null;
      converted += 1;
    }

    const bankItems = window.Player.bank?.items || {};
    Object.keys(bankItems).forEach((key) => {
      const entry = bankItems[key];
      if (!entry) return;
      const petId = resolvePetId({ id: key, name: entry.name });
      if (!petId) return;
      if ((Number(entry.qty) || 0) <= 0) {
        delete bankItems[key];
        if (window.Player.bank?.log) delete window.Player.bank.log[key];
        return;
      }
      st.unlocked[petId] = true;
      delete bankItems[key];
      if (window.Player.bank?.log) delete window.Player.bank.log[key];
      converted += 1;
    });

    if (converted > 0) {
      RSGame.UI?.renderInventory?.(window.Player);
      RSGame.Bank?.refresh?.();
      RSGame.Game?.saveNow?.();
      RSGame.Events?.emit?.("notification", {
        text: "Converted legacy pet items into pet unlocks.",
        source: "pets"
      });
    }
  }

  function getPetPerkModifiers(player = window.Player) {
    const unlocked = player?.combat?.pets?.unlocked || {};
    const out = {
      geFillRateMultiplier: 1,
      coinMultiplierBySource: {},
      skillMods: {}
    };

    Object.keys(unlocked).forEach((petId) => {
      if (!unlocked[petId]) return;
      const perk = PET_SOURCE_PERKS[petId];
      if (!perk) return;

      if (perk.geFillRateMultiplier) {
        out.geFillRateMultiplier *= Number(perk.geFillRateMultiplier) || 1;
      }

      if (perk.coinMultiplierBySource && typeof perk.coinMultiplierBySource === "object") {
        Object.keys(perk.coinMultiplierBySource).forEach((source) => {
          const mul = Math.max(1, Number(perk.coinMultiplierBySource[source]) || 1);
          out.coinMultiplierBySource[source] = Math.max(out.coinMultiplierBySource[source] || 1, mul);
        });
      }

      if (perk.skillMods && typeof perk.skillMods === "object") {
        Object.keys(perk.skillMods).forEach((skill) => {
          const def = perk.skillMods[skill] || {};
          const row = out.skillMods[skill] || { xpMultiplier: 1, outputMultiplier: 1, successBonus: 0 };
          if (def.xpMultiplier) row.xpMultiplier *= Number(def.xpMultiplier) || 1;
          if (def.outputMultiplier) row.outputMultiplier *= Number(def.outputMultiplier) || 1;
          if (def.successBonus) row.successBonus += Number(def.successBonus) || 0;
          out.skillMods[skill] = row;
        });
      }
    });

    return out;
  }

  function publishPetsPerksApi() {
    window.RSGame = window.RSGame || {};
    window.RSGame.PetsPerks = {
      getGeFillRateMultiplier(player) {
        return Number(getPetPerkModifiers(player || window.Player).geFillRateMultiplier) || 1;
      },
      applyCoinRewardMultiplier(amount, source, player) {
        const base = Math.max(0, Number(amount) || 0);
        if (base <= 0) return 0;
        const sourceKey = String(source || "").toLowerCase();
        if (sourceKey === "duel" || sourceKey === "ge") return Math.round(base);
        const mods = getPetPerkModifiers(player || window.Player);
        const mult = Number(mods.coinMultiplierBySource[sourceKey]) || 1;
        return Math.max(0, Math.round(base * mult));
      },
      getSkillModifier(skillName, key, fallback, player) {
        const mods = getPetPerkModifiers(player || window.Player).skillMods[String(skillName || "")] || {};
        if (key === "successBonus") return Number(mods.successBonus) || 0;
        return Number(mods[key]) || fallback;
      }
    };
  }

  function buildPetsPanel(main) {
    const panel = document.createElement("section");
    panel.className = "panel pets-panel";
    panel.dataset.panel = "pets";
    panel.style.display = "none";
    panel.innerHTML = `
      <h2>Pets</h2>
      <div class="pets-shell">
        <div id="pets-summary" class="pets-summary"></div>
        <div id="pets-grid" class="pets-grid"></div>
      </div>
    `;
    main.appendChild(panel);
    return panel;
  }

  function renderPetsPanel() {
    const summary = document.getElementById("pets-summary");
    const grid = document.getElementById("pets-grid");
    if (!summary || !grid) return;

    syncAutoUnlocks();
    const st = getPetState();
    const unlockedCount = PET_DEFS.filter((pet) => !!st.unlocked[pet.id]).length;
    summary.textContent = "Unlocked: " + unlockedCount + " / " + PET_DEFS.length;

    grid.innerHTML = "";
    PET_DEFS.forEach((pet) => {
      const unlocked = !!st.unlocked[pet.id];
      const card = document.createElement("div");
      card.className = "pet-card" + (unlocked ? " unlocked" : " locked");
      card.innerHTML = `
        <img class="pet-icon" src="${pet.icon}" alt="${pet.name}" onerror="this.onerror=null;this.src='https://oldschool.runescape.wiki/images/Minigames.png';" />
        <div class="pet-name">${pet.name}</div>
        <div class="pet-state">${unlocked ? "Unlocked" : "Locked"}</div>
      `;
      grid.appendChild(card);
    });
  }

  RSGame.Game.registerMod({
    name: "Pets",

    onGameInit() {
      const tabBar = document.getElementById("tab-bar");
      const main = document.querySelector(".main-layout");
      if (!tabBar || !main) return;

      if (!document.querySelector('.tab-btn[data-tab="pets"]')) {
        const btn = document.createElement("button");
        btn.className = "tab-btn";
        btn.dataset.tab = "pets";
        btn.innerHTML = '<img class="tab-icon" src="https://oldschool.runescape.wiki/images/Call_Pet.png" alt="Pets" onerror="this.onerror=null;this.src=\'https://oldschool.runescape.wiki/images/Minigames.png\';"><span class="tab-label">Pets</span>';
        tabBar.appendChild(btn);
      }

      if (!document.querySelector('.panel.pets-panel')) {
        buildPetsPanel(main);
      }

      getPetState();
      migratePetItemsToUnlocks();
      publishPetsPerksApi();
      renderPetsPanel();
      RSGame.Events?.on?.("playerUpdated", renderPetsPanel);
    },

    onAfterRender() {
      renderPetsPanel();
    }
  });
})();
