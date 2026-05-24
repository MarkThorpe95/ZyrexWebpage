window.RSGame = window.RSGame || {};


(function () {
  const MAX_SKILL_LEVEL = 99;

  // OSRS XP Table: index = level, value = cumulative XP required for that level
  // Level 1 = 0 XP, Level 2 = 83 XP, Level 3 = 174 XP, ... Level 99 = 13,034,431 XP
  const XP_TABLE = [
    0, 0, 83, 174, 276, 388, 512, 650, 801, 969, 1_154, 1_358, 1_584, 1_833, 2_107, 2_411, 2_746, 3_115, 3_523, 3_973, 4_470, 5_024, 5_624, 6_291, 7_028, 7_842, 8_740, 9_730, 10_824, 12_031, 13_363, 14_833, 16_456, 18_247, 20_224, 22_406, 24_816, 27_473, 30_408, 33_648, 37_224, 41_173, 45_529, 50_339, 55_649, 61_512, 68_013, 75_224, 83_014, 91_721, 101_333, 111_945, 123_660, 136_594, 150_872, 166_636, 184_040, 203_254, 224_466, 247_886, 273_742, 302_288, 333_804, 368_599, 407_015, 449_428, 496_254, 547_953, 604_032, 664_999, 731_399, 803_826, 882_927, 969_397, 1_063_985, 1_167_500, 1_280_820, 1_404_900, 1_540_772, 1_689_544, 1_852_420, 2_030_684, 2_225_705, 2_438_936, 2_671_942, 2_926_389, 3_204_058, 3_506_844, 3_836_760, 4_195_921, 4_586_557, 5_011_021, 5_471_789, 5_971_489, 6_512_753, 7_098_321, 7_731_658, 8_416_285, 9_155_792, 9_953_823, 10_814_073, 11_740_282, 12_746_232, 13_034_431
  ];

  RSGame.XP_TABLE = XP_TABLE;

  const SKILL_DEFS = [
    "Attack", "Strength", "Defence", "Hitpoints", "Ranged", "Prayer", "Magic",
    "Runecraft", "Construction", "Agility", "Herblore", "Thieving", "Crafting",
    "Fletching", "Slayer", "Hunter", "Mining", "Smithing", "Fishing",
    "Cooking", "Firemaking", "Woodcutting", "Farming"
  ];

  function getXPForLevel(level) {
    // Clamp level to valid range
    const lvl = Math.max(1, Math.min(MAX_SKILL_LEVEL, Math.floor(level)));
    return XP_TABLE[lvl] || 0;
  }

  function getLevelForXP(xp) {
    // Returns the highest level for which XP_TABLE[level] <= xp
    for (let lvl = XP_TABLE.length - 1; lvl >= 1; lvl--) {
      if (xp >= XP_TABLE[lvl]) return lvl;
    }
    return 1;
  }

  function createSkillState() {
    const skills = {};
    SKILL_DEFS.forEach((name) => {
      const skill = {
        name,
        level: 1,
        xp: 0,
        totalXp: 0
      };

      skill.addXP = function (amount) {
        if (typeof amount !== "number" || amount <= 0) return;
        this.xp += amount;
        this.totalXp += amount;
        // Use XP table for level calculation
        this.level = getLevelForXP(this.xp);
        if (this.level >= MAX_SKILL_LEVEL) {
          this.level = MAX_SKILL_LEVEL;
          // Only emit if just reached 99 (not if already 99)
          if (!this._was99) {
            this._was99 = true;
            if (window.RSGame?.Events?.emit) {
              RSGame.Events.emit("level99Achieved", { skillName: this.name });
            }
          }
        } else {
          this._was99 = false;
        }
      };
      skill.gainXP = skill.addXP;
      skill.addExperience = skill.addXP;

      skill.xpForNextLevel = function () {
        // XP needed to reach next level from current XP
        if (this.level >= MAX_SKILL_LEVEL) return 0;
        return XP_TABLE[this.level + 1] - this.xp;
      };
      skill.progressPercent = function () {
        if (this.level >= MAX_SKILL_LEVEL) return 100;
        const xpThisLevel = this.xp - XP_TABLE[this.level];
        const xpNeeded = XP_TABLE[this.level + 1] - XP_TABLE[this.level];
        return xpNeeded > 0 ? Math.min(100, (xpThisLevel / xpNeeded) * 100) : 100;
      };

      skills[name] = skill;
    });
    return skills;
  }

  RSGame.SKILL_DEFS = SKILL_DEFS;
  RSGame.createSkillState = createSkillState;
  RSGame.getXPForLevel = getXPForLevel;
  RSGame.getLevelForXP = getLevelForXP;
})();

