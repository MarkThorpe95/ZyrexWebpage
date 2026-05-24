// ======================================================
//  RSGame Event System (required by Activity UI + Skills)
// ======================================================

window.RSGame = window.RSGame || {};

RSGame.Events = {
  _events: {},

  on(event, handler) {
    if (!this._events[event]) {
      this._events[event] = [];
    }
    this._events[event].push(handler);
  },

  emit(event, data) {
    if (!this._events[event]) return;
    this._events[event].forEach(handler => handler(data));
  },

  off(event, handler) {
    if (!this._events[event]) return;
    this._events[event] = this._events[event].filter(h => h !== handler);
  }
};
