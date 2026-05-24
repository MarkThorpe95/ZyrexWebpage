// content/01_zones_mod.js

(function () {
  console.log("[Zones System] Core loading...");

  window.RSGame = window.RSGame || {};
  const RS = window.RSGame;

  /* ---------------------------------------------------
     EVENT BUS
  --------------------------------------------------- */
  RS.Events = RS.Events || {
    _events: {},

    on(name, handler) {
      if (!this._events[name]) this._events[name] = [];
      this._events[name].push(handler);
    },

    emit(name, payload) {
      const list = this._events[name];
      if (!list) return;
      list.forEach(fn => {
        try { fn(payload); }
        catch (e) { console.error(`[Events] Error in ${name}`, e); }
      });
    }
  };

  /* ---------------------------------------------------
     ZONES REGISTRY
  --------------------------------------------------- */
  RS.Zones = RS.Zones || {
    _zones: [],

    registerZone(zone) {
      this._zones.push(zone);
    },

    getZonesByCategory(cat) {
      return this._zones.filter(z => z.category === cat);
    }
  };

  console.log("[Zones System] Core loaded (no UI yet).");
})();

