window.RSGame = window.RSGame || {};

(function () {
  class Equipment {
    constructor() {
      this.slots = {
        head: null, cape: null, neck: null, weapon: null, body: null,
        shield: null, legs: null, hands: null, feet: null, ring: null, ammo: null
      };
    }

    equip(slot, item) {
      if (!this.slots.hasOwnProperty(slot)) return;
      this.slots[slot] = item;
    }

    get(slot) {
      return this.slots[slot];
    }
  }

  RSGame.Equipment = Equipment;
})();

