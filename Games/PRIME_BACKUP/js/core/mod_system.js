// ======================================================
//  RSGame Mod System (Original API expected by your mods)
// ======================================================

window.RSGame = window.RSGame || {};

RSGame.Game = {
  mods: [],
  _hooks: {},

  registerMod(mod) {
    this.mods.push(mod);
    console.log(`[RSGame] Registered mod: ${mod.name}`);
    Object.keys(mod).forEach((key) => {
      if (typeof mod[key] !== "function") return;
      this._hooks[key] = this._hooks[key] || [];
      this._hooks[key].push(mod[key]);
    });
  },

  runHook(hookName, context) {
    const handlers = this._hooks[hookName];
    if (!handlers) return;
    handlers.forEach(fn => fn(context));
  }
};
