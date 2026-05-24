// ======================================================
//  RSGame.Skill class (required by Woodcutting mod)
// ======================================================

window.RSGame = window.RSGame || {};

RSGame.Skill = class {
  constructor(name) {
    this.name = name;
    this.level = 1;
    this.xp = 0;
  }


  xpForNextLevel() {
    // XP needed to reach next level from current XP
    if (typeof window !== 'undefined' && window.RSGame && RSGame.XP_TABLE) {
      if (this.level >= 99) return 0;
      return RSGame.XP_TABLE[this.level + 1] - this.xp;
    }
    return 0;
  }

  addXP(amount) {
    const gain = Number(amount) || 0;
    if (gain <= 0) return;
    this.xp = Math.max(0, Number(this.xp) || 0) + gain;
    // Use XP table for level calculation
    if (typeof window !== 'undefined' && window.RSGame && RSGame.getLevelForXP) {
      this.level = RSGame.getLevelForXP(this.xp);
    } else {
      this.level = Math.max(1, Math.min(99, Number(this.level) || 1));
    }
    if (this.level >= 99) {
      if (!this._was99) {
        this._was99 = true;
        if (window.RSGame?.Events?.emit) {
          RSGame.Events.emit("level99Achieved", { skillName: this.name });
        }
      }
      this.level = 99;
    } else {
      this._was99 = false;
    }
  }

  gainXP(amount) {
    this.xp += amount;
  }

  addExperience(amount) {
    this.xp += amount;
  }
};
