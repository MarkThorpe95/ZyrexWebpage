(function () {
  const TRAINABLE_CORE_SKILLS = new Set([
    "Attack",
    "Strength",
    "Defence",
    "Hitpoints",
    "Woodcutting",
    "Mining",
    "Fletching"
  ]);

  let activeTimer = null;
  let activeSkill = null;
  let activePlayer = null;
  let uiRoot = null;
  let statusEl = null;

  function getUntrainableSkills() {
    const defs = Array.isArray(RSGame.SKILL_DEFS) ? RSGame.SKILL_DEFS : [];
    return defs.filter((name) => !TRAINABLE_CORE_SKILLS.has(name));
  }

  function getScaledInterval(baseMs) {
    const speed = Math.max(1, Number(RSGame.Game?.getTimeScale?.()) || 1);
    return Math.max(150, Math.round(baseMs / speed));
  }

  function getSkeletonXp(level) {
    const lvl = Math.max(1, Number(level) || 1);
    return Math.min(24, 8 + lvl * 0.2);
  }

  function stopTraining() {
    if (activeTimer) {
      clearInterval(activeTimer);
      activeTimer = null;
    }
    activeSkill = null;
    updateUiState();
  }

  function awardSkeletonXp() {
    if (!activePlayer || !activeSkill) return;
    const skill = activePlayer.skills?.[activeSkill];
    if (!skill) return;

    const xp = getSkeletonXp(skill.level);
    if (typeof skill.addXP === "function") skill.addXP(xp);
    else if (typeof skill.gainXP === "function") skill.gainXP(xp);
    else if (typeof skill.addExperience === "function") skill.addExperience(xp);

    RSGame.Events?.emit?.("xpGain", { amount: xp, skill: activeSkill, source: "skeleton" });

    activePlayer.updateTotalLevel?.();
    RSGame.UI?.renderPlayerSummary?.(activePlayer);
    RSGame.UI?.renderSkills?.(activePlayer);

    const level = Math.max(1, Number(skill.level) || 1);
    if (statusEl) {
      statusEl.textContent = "Training " + activeSkill + " (Lv " + level + ")...";
    }

    updateUiState();
  }

  function startTraining(skillName, player) {
    if (!player?.skills?.[skillName]) return;

    activePlayer = player;
    activeSkill = skillName;

    if (activeTimer) {
      clearInterval(activeTimer);
      activeTimer = null;
    }

    const baseInterval = 2400;
    activeTimer = setInterval(awardSkeletonXp, getScaledInterval(baseInterval));

    if (statusEl) {
      statusEl.textContent = "Training " + activeSkill + "...";
    }

    updateUiState();
  }

  function buildUi(player) {
    const panel = document.querySelector(".panel.skills-panel");
    if (!panel) return;

    let host = panel.querySelector(".skill-skeleton-panel");
    if (!host) {
      host = document.createElement("section");
      host.className = "skill-skeleton-panel";
      panel.appendChild(host);
    }

    const skills = getUntrainableSkills();

    host.innerHTML = `
      <div class="skill-skeleton-header">Skeleton Training (Quick Placeholder)</div>
      <div class="skill-skeleton-note">These skills use simple timed XP gains until full mechanics are added.</div>
      <div class="skill-skeleton-buttons"></div>
      <div class="skill-skeleton-status"></div>
    `;

    const buttonsWrap = host.querySelector(".skill-skeleton-buttons");
    statusEl = host.querySelector(".skill-skeleton-status");
    uiRoot = host;

    skills.forEach((skillName) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "skill-skeleton-btn";
      btn.dataset.skill = skillName;

      btn.addEventListener("click", () => {
        if (activeSkill === skillName) {
          stopTraining();
          if (statusEl) statusEl.textContent = "Training stopped.";
          return;
        }
        startTraining(skillName, player);
      });

      buttonsWrap.appendChild(btn);
    });

    updateUiState();
  }

  function updateUiState() {
    if (!uiRoot) return;

    const player = activePlayer || window.Player;

    uiRoot.querySelectorAll(".skill-skeleton-btn").forEach((btn) => {
      const skillName = btn.dataset.skill;
      const level = Math.max(1, Number(player?.skills?.[skillName]?.level) || 1);
      const running = activeSkill === skillName && !!activeTimer;
      btn.classList.toggle("active", running);
      btn.textContent = (running ? "Stop " : "Train ") + skillName + " (Lv " + level + ")";
    });
  }

  RSGame.Events?.on?.("gameSpeedChange", () => {
    if (!activeTimer || !activeSkill || !activePlayer) return;
    startTraining(activeSkill, activePlayer);
  });

  RSGame.Events?.on?.("zoneLeave", () => {
    updateUiState();
  });

  RSGame.Game.registerMod({
    name: "Skill Skeleton Training",

    onGameInit(game) {
      activePlayer = game.player;
      buildUi(game.player);
      updateUiState();
      console.log("[Skill Skeleton] Placeholder training enabled for non-implemented skills.");
    }
  });
})();
