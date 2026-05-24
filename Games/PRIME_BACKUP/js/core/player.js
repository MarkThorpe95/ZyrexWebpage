// ======================================================
//  Player Object
// ======================================================

window.Player = {
  name: "Player",
  skills: RSGame.createSkillState(),
  inventory: new RSGame.Inventory(),
  equipment: null,
  stackAllItems: false,
  winEveryDuel: false,
  duelStackingInventory: [], // Array of item objects for duel stacking
  duelStackingEnabled: false, // Toggle for duel stacking

  updateTotalLevel() {
    let total = 0;
    for (const key in this.skills) {
      total += this.skills[key].level || 1;
    }
    this.totalLevel = total;
    return total;
  }
};
