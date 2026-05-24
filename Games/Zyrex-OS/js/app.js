// --- DOM refs ---
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const countActive = document.getElementById("countActive");
const countCompleted = document.getElementById("countCompleted");
const clearAllBtn = document.getElementById("clearAllBtn");
const appContainer = document.getElementById("appContainer");
const bootOverlay = document.getElementById("bootOverlay");
const bootLog = document.getElementById("bootLog");
const bootProgressBar = document.getElementById("bootProgressBar");
const bootHint = document.getElementById("bootHint");
const statusPill = document.getElementById("statusPill");
const systemLog = document.getElementById("systemLog");
const statusNodes = document.getElementById("statusNodes");
const statusCompleted = document.getElementById("statusCompleted");
const taskbarAppsContainer = document.getElementById("taskbarApps");
const taskbarClock = document.getElementById("taskbarClock");
const notesContent = document.getElementById("notesContent");
const saveNotesBtn = document.getElementById("saveNotesBtn");
const clearNotesBtn = document.getElementById("clearNotesBtn");
const calcDisplay = document.getElementById("calcDisplay");
const desktopContextMenu = document.getElementById("desktopContextMenu");
const windowContextMenu = document.getElementById("windowContextMenu");
const desktopIconsContainer = document.querySelector('.desktop-icons');

// --- Storage keys ---
const STORAGE_KEY = "zyrex_checklist_v1";
const NOTES_KEY = "zyrex_notes_v1";

// --- Audio ---
let audioCtx = null;
function initAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  audioCtx?.resume?.();
}

function playBeep(freq = 440, duration = 0.08, type = "square", volume = 0.15) {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.value = volume;
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

// --- Boot sequence ---
const bootLines = [
  "[BOOT] Mounting /dev/zyrex_core...",
  "[OK]  Syncing riff buffers...",
  "[OK]  Spawning Zyrex node controller...",
  "[OK]  Loading neon UI overlays...",
  "[OK]  Restoring saved objectives...",
  "[OK]  Linking to encrypted mesh...",
  "[READY] Zyrex Desktop online."
];

function runBootSequence() {
  let index = 0;
  let progress = 0;

  const interval = setInterval(() => {
    if (index < bootLines.length) {
      const line = document.createElement("div");
      line.className = "boot-line";
      line.textContent = bootLines[index];
      bootLog.appendChild(line);
      bootLog.scrollTop = bootLog.scrollHeight;
      index++;
      progress = Math.min(100, progress + (100 / bootLines.length));
      bootProgressBar.style.width = progress + "%";
      playBeep(220 + index * 40, 0.06);
    } else {
      clearInterval(interval);
      bootHint.textContent = "Press any key or click to enter Zyrex OS...";
      bootProgressBar.style.width = "100%";

      const unlock = () => {
        initAudio();
        playBeep(880, 0.12);
        bootOverlay.classList.add("fade-out");
        setTimeout(() => bootOverlay.style.display = "none", 350);
        window.removeEventListener("keydown", unlock);
        window.removeEventListener("click", unlock);
      };

      window.addEventListener("keydown", unlock);
      window.addEventListener("click", unlock);
    }
  }, 260);
}

// --- Checklist storage ---
function generateId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function loadNotes() {
  try {
    return localStorage.getItem(NOTES_KEY) || "";
  } catch {
    return "";
  }
}

function saveNotes(text) {
  try {
    localStorage.setItem(NOTES_KEY, text);
    logSystem("[NOTES] Notes saved.");
  } catch {
    logSystem("[NOTES] Unable to save notes.");
  }
}

function getCurrentTasksFromDOM() {
  return [...taskList.querySelectorAll(".item")].map(li => ({
    id: li.dataset.id,
    text: li.querySelector(".label").textContent,
    completed: li.classList.contains("completed"),
    timestamp: li.dataset.timestamp
  }));
}

function syncToStorage() {
  saveTasks(getCurrentTasksFromDOM());
}

// --- Checklist UI ---
function updateCounts() {
  const items = taskList.querySelectorAll(".item");
  const completed = taskList.querySelectorAll(".item.completed");
  const activeCount = items.length - completed.length;
  countActive.textContent = activeCount;
  countCompleted.textContent = completed.length;
  statusNodes.textContent = activeCount;
  statusCompleted.textContent = completed.length;
}

function logSystem(message) {
  const line = document.createElement("div");
  line.className = "log-line";
  line.textContent = message;
  systemLog.appendChild(line);
  systemLog.scrollTop = systemLog.scrollHeight;
}

function createTaskElement(task) {
  const li = document.createElement("li");
  li.className = "item";
  li.dataset.id = task.id;
  li.dataset.timestamp = task.timestamp;

  if (task.completed) li.classList.add("completed");

  li.innerHTML = `
    <div class="left">
      <div class="checkbox"><span>✓</span></div>
      <div class="label-wrap">
        <div class="label">${task.text}</div>
        <div class="tag">OBJECTIVE</div>
      </div>
    </div>
    <div class="right">
      <div class="timestamp">${task.timestamp}</div>
      <button class="remove-btn">✕</button>
    </div>
  `;

  li.querySelector(".checkbox").addEventListener("click", () => {
    li.classList.toggle("completed");
    playBeep(li.classList.contains("completed") ? 520 : 320);
    updateCounts();
    syncToStorage();
    logSystem(`[CHECKLIST] "${task.text}" updated.`);
  });

  li.querySelector(".remove-btn").addEventListener("click", () => {
    li.remove();
    playBeep(160);
    updateCounts();
    syncToStorage();
    logSystem(`[CHECKLIST] "${task.text}" removed.`);
  });

  return li;
}

function addTaskFromInput() {
  const text = taskInput.value.trim();
  if (!text) return;

  const now = new Date();
  const timestamp = `${now.getHours().toString().padStart(2,"0")}:${now.getMinutes().toString().padStart(2,"0")}`;

  const task = {
    id: Date.now().toString(36),
    text,
    completed: false,
    timestamp
  };

  taskList.prepend(createTaskElement(task));
  taskInput.value = "";
  updateCounts();
  syncToStorage();
  playBeep(640);
  logSystem(`[CHECKLIST] Added "${text}".`);
}

function clearAllTasks() {
  if (!confirm("Purge all Zyrex objectives?")) return;
  taskList.innerHTML = "";
  updateCounts();
  syncToStorage();
  playBeep(120);
  logSystem("[CHECKLIST] All objectives purged.");
}

// --- FIXED: Checklist initializes only when opened ---
let checklistInitialized = false;
let notesInitialized = false;
let calculatorInitialized = false;

function initChecklistApp() {
  if (checklistInitialized) return;
  checklistInitialized = true;

  // Load tasks
  const tasks = loadTasks();
  if (tasks.length === 0) {
    ["Tune guitar, break into network", "Roll one, scan perimeter", "Drop payload, crank volume"]
      .forEach(text => {
        const now = new Date();
        const timestamp = `${now.getHours().toString().padStart(2,"0")}:${now.getMinutes().toString().padStart(2,"0")}`;
        taskList.appendChild(createTaskElement({
          id: generateId(),
          text,
          completed: false,
          timestamp
        }));
      });
    syncToStorage();
  } else {
    tasks.forEach(t => taskList.appendChild(createTaskElement(t)));
  }

  updateCounts();

  // 🔥 FIX: Attach event listeners HERE
  addBtn.addEventListener("click", addTaskFromInput);

  taskInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addTaskFromInput();
  });

  clearAllBtn.addEventListener("click", clearAllTasks);

  // Animate container
  appContainer.classList.add("ready");

  logSystem("[SYSTEM] Checklist app initialized.");
}

function initNotesApp() {
  if (notesInitialized) return;
  if (!notesContent) return;
  notesInitialized = true;
  notesContent.value = loadNotes();
  saveNotesBtn?.addEventListener("click", () => {
    saveNotes(notesContent.value);
    playBeep(760);
  });
  clearNotesBtn?.addEventListener("click", () => {
    if (!confirm("Clear all notes?")) return;
    notesContent.value = "";
    saveNotes("");
    playBeep(180);
  });
  logSystem("[SYSTEM] Notes app initialized.");
}

function initCalculatorApp() {
  if (calculatorInitialized) return;
  if (!calcDisplay) return;
  calculatorInitialized = true;

  let current = "0";
  let storedValue = null;
  let pendingOperator = null;
  let waitingForOperand = false;

  function updateDisplay() {
    calcDisplay.textContent = current;
  }

  function inputDigit(digit) {
    if (waitingForOperand || current === "0") {
      current = digit;
      waitingForOperand = false;
    } else {
      current += digit;
    }
  }

  function inputDot() {
    if (!current.includes(".")) {
      current += ".";
      waitingForOperand = false;
    }
  }

  function clearCalculator() {
    current = "0";
    storedValue = null;
    pendingOperator = null;
    waitingForOperand = false;
  }

  function operate(a, b, operator) {
    const x = parseFloat(a);
    const y = parseFloat(b);
    if (Number.isNaN(x) || Number.isNaN(y)) return "0";
    switch (operator) {
      case "+": return String(x + y);
      case "-": return String(x - y);
      case "*": return String(x * y);
      case "/": return y === 0 ? "ERR" : String(x / y);
      default: return String(y);
    }
  }

  function handleOperator(operator) {
    if (pendingOperator && !waitingForOperand) {
      current = operate(storedValue, current, pendingOperator);
    }
    storedValue = current;
    pendingOperator = operator === "=" ? null : operator;
    waitingForOperand = true;
  }

  document.querySelectorAll(".calc-btn").forEach(button => {
    button.addEventListener("click", () => {
      const value = button.dataset.value;
      if (value === "C") {
        clearCalculator();
        playBeep(280);
      } else if (value === "=") {
        if (pendingOperator) {
          handleOperator("=");
          playBeep(560);
        }
      } else if ("+-*/".includes(value)) {
        handleOperator(value);
        playBeep(520);
      } else if (value === ".") {
        inputDot();
        playBeep(480);
      } else {
        inputDigit(value);
        playBeep(420);
      }
      updateDisplay();
    });
  });

  updateDisplay();
  logSystem("[SYSTEM] Calculator app initialized.");
}

// --- Context menu & OS helpers ---
function showContextMenu(menuEl, x, y) {
  if (!menuEl) return;
  menuEl.style.left = Math.max(8, x) + "px";
  menuEl.style.top = Math.max(8, y) + "px";
  menuEl.classList.remove('hidden');
}

function hideContextMenus() {
  desktopContextMenu?.classList.add('hidden');
  windowContextMenu?.classList.add('hidden');
  if (desktopContextMenu) desktopContextMenu.dataset.appId = "";
  if (windowContextMenu) windowContextMenu.dataset.appId = "";
}

function toggleMaximize(appId) {
  const win = document.querySelector(`.app-window[data-app="${appId}"]`);
  if (!win) return;
  const maximized = win.dataset.maximized === '1';
  if (!maximized) {
    // store current
    win.dataset.prevLeft = win.style.left || '';
    win.dataset.prevTop = win.style.top || '';
    win.dataset.prevWidth = win.style.width || '';
    win.dataset.prevHeight = win.style.height || '';
    win.style.left = '4%';
    win.style.top = '6%';
    win.style.width = '92%';
    win.style.height = '84%';
    win.dataset.maximized = '1';
  } else {
    win.style.left = win.dataset.prevLeft || '';
    win.style.top = win.dataset.prevTop || '';
    win.style.width = win.dataset.prevWidth || '';
    win.style.height = win.dataset.prevHeight || '';
    win.dataset.maximized = '0';
  }
  bringWindowToFront(win);
}

function arrangeIcons() {
  if (!desktopIconsContainer) return;
  desktopIconsContainer.classList.toggle('arranged');
  logSystem('[SYSTEM] Desktop icons arranged.');
}

// --- Window management ---
let dragState = null;
let resizeState = null;

function bringWindowToFront(win) {
  const windows = document.querySelectorAll(".app-window");
  let maxZ = 5;
  windows.forEach(w => {
    const z = parseInt(getComputedStyle(w).zIndex || "5");
    if (z > maxZ) maxZ = z;
    w.classList.remove("active");
  });
  win.style.zIndex = maxZ + 1;
  win.classList.add("active");
}

function openApp(appId) {
  const win = document.querySelector(`.app-window[data-app="${appId}"]`);
  if (!win) return;

  win.classList.add("visible");
  bringWindowToFront(win);
  ensureTaskbarApp(appId, true);

  if (appId === "checklist") initChecklistApp();
  if (appId === "notes") initNotesApp();
  if (appId === "calculator") initCalculatorApp();

  logSystem(`[SYSTEM] App "${appId}" opened.`);
}

function closeApp(appId) {
  const win = document.querySelector(`.app-window[data-app="${appId}"]`);
  if (!win) return;
  win.classList.remove("visible");
  ensureTaskbarApp(appId, false);
}

function minimizeApp(appId) {
  const win = document.querySelector(`.app-window[data-app="${appId}"]`);
  if (!win) return;
  win.classList.remove("visible");
  ensureTaskbarApp(appId, true);
}

function toggleAppFromTaskbar(appId) {
  const win = document.querySelector(`.app-window[data-app="${appId}"]`);
  if (!win) return;
  win.classList.contains("visible") ? minimizeApp(appId) : openApp(appId);
}

function ensureTaskbarApp(appId, active) {
  let btn = taskbarAppsContainer.querySelector(`[data-app="${appId}"]`);
  if (!active) {
    if (btn) btn.remove();
    return;
  }
  if (!btn) {
    btn = document.createElement("div");
    btn.className = "taskbar-app";
    btn.dataset.app = appId;
    btn.textContent =
      appId === "checklist" ? "Todo Matrix" :
      appId === "log" ? "System Log" :
      "Status Panel";
    btn.addEventListener("click", () => toggleAppFromTaskbar(appId));
    taskbarAppsContainer.appendChild(btn);
  }
  [...taskbarAppsContainer.children].forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
}

// --- Dragging & resizing ---
function initWindowDraggingAndResizing() {
  document.querySelectorAll(".app-window").forEach(win => {
    const header = win.querySelector(".window-header");
    const handle = win.querySelector(".resize-handle");

    header.addEventListener("mousedown", e => {
      bringWindowToFront(win);
      const rect = win.getBoundingClientRect();
      dragState = {
        win,
        offsetX: e.clientX - rect.left,
        offsetY: e.clientY - rect.top
      };
      document.addEventListener("mousemove", onDragMove);
      document.addEventListener("mouseup", onDragEnd);
    });

    handle.addEventListener("mousedown", e => {
      e.stopPropagation();
      bringWindowToFront(win);
      const rect = win.getBoundingClientRect();
      resizeState = {
        win,
        startX: e.clientX,
        startY: e.clientY,
        startWidth: rect.width,
        startHeight: rect.height
      };
      document.addEventListener("mousemove", onResizeMove);
      document.addEventListener("mouseup", onResizeEnd);
    });

    win.addEventListener("mousedown", () => bringWindowToFront(win));

    const controls = win.querySelectorAll(".window-controls .dot");
    controls.forEach(dot => {
      const action = dot.dataset.action;
      dot.addEventListener("click", e => {
        e.stopPropagation();
        const appId = win.dataset.app;
        if (action === "close") closeApp(appId);
        if (action === "minimize") minimizeApp(appId);
        if (action === "focus") openApp(appId);
      });
    });
  });
}

function onDragMove(e) {
  if (!dragState) return;
  const { win, offsetX, offsetY } = dragState;
  win.style.left = (e.clientX - offsetX) + "px";
  win.style.top = (e.clientY - offsetY) + "px";
}

function onDragEnd() {
  document.removeEventListener("mousemove", onDragMove);
  document.removeEventListener("mouseup", onDragEnd);
  dragState = null;
}

function onResizeMove(e) {
  if (!resizeState) return;
  const { win, startX, startY, startWidth, startHeight } = resizeState;
  const dx = e.clientX - startX;
  const dy = e.clientY - startY;
  win.style.width = Math.max(260, startWidth + dx) + "px";
  win.style.height = Math.max(160, startHeight + dy) + "px";
}

function onResizeEnd() {
  document.removeEventListener("mousemove", onResizeMove);
  document.removeEventListener("mouseup", onResizeEnd);
  resizeState = null;
}

// --- Desktop icons ---
function initDesktopIcons() {
  document.querySelectorAll(".desktop-icon").forEach(icon => {
    const appId = icon.dataset.app;
    icon.addEventListener("dblclick", () => {
      openApp(appId);
      playBeep(720);
    });
  });
}

// --- Taskbar clock ---
function updateClock() {
  const now = new Date();
  const hh = now.getHours().toString().padStart(2,"0");
  const mm = now.getMinutes().toString().padStart(2,"0");
  taskbarClock.textContent = `${hh}:${mm}`;
}

// --- Cursor trails ---
let trailToggle = false;
function spawnCursorTrail(x, y) {
  const el = document.createElement("div");
  el.className = "cursor-trail";
  if (trailToggle) el.classList.add("alt");
  trailToggle = !trailToggle;
  el.style.left = x + "px";
  el.style.top = y + "px";
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 400);
}

function enableCursorTrails() {
  window.addEventListener("mousemove", e => {
    spawnCursorTrail(e.clientX, e.clientY);
  });
}

// --- Demon cursor implementation ---
let demonCursorEl = null;
let demonEnabled = false;

function createDemonCursor() {
  if (demonCursorEl) return demonCursorEl;
  demonCursorEl = document.createElement('div');
  demonCursorEl.className = 'demon-cursor';
  document.body.appendChild(demonCursorEl);
  return demonCursorEl;
}

function enableDemonCursor(enable = true) {
  demonEnabled = !!enable;
  if (demonEnabled) {
    document.body.classList.add('demon-cursor-enabled');
    const el = createDemonCursor();
    // follow mouse
    const move = (e) => {
      el.style.left = e.clientX + 'px';
      el.style.top = e.clientY + 'px';
      // spawn bigger smoky puffs under cursor
      const puff = document.createElement('div');
      puff.className = 'cursor-trail';
      // randomize size
      const size = 14 + Math.round(Math.random() * 18);
      puff.style.width = size + 'px';
      puff.style.height = size + 'px';
      if (Math.random() > 0.5) puff.classList.add('alt');
      puff.style.left = (e.clientX + (Math.random() * 6 - 3)) + 'px';
      puff.style.top = (e.clientY + (Math.random() * 6 - 3)) + 'px';
      document.body.appendChild(puff);
      setTimeout(() => puff.remove(), 900 + Math.random() * 300);
    };
    window.addEventListener('mousemove', move);
    // store handler so we can remove later
    demonCursorEl._moveHandler = move;
  } else {
    document.body.classList.remove('demon-cursor-enabled');
    if (demonCursorEl) {
      window.removeEventListener('mousemove', demonCursorEl._moveHandler);
      demonCursorEl.remove();
      demonCursorEl = null;
    }
  }
}

// Expose quick toggle via global for debugging
window.toggleDemonCursor = () => enableDemonCursor(!demonEnabled);

// --- Startup ---
document.addEventListener("DOMContentLoaded", () => {
  runBootSequence();
  initWindowDraggingAndResizing();
  enableCursorTrails();
  initDesktopIcons();
  // Context menu handlers
  document.addEventListener('contextmenu', (e) => {
    // Allow native context for inputs
    if (e.target.closest('input, textarea, select')) return;
    const icon = e.target.closest('.desktop-icon');
    const win = e.target.closest('.app-window');
    e.preventDefault();
    hideContextMenus();
    if (icon) {
      // desktop icon menu (could be extended per-icon)
      desktopContextMenu.dataset.appId = icon.dataset.app || '';
      showContextMenu(desktopContextMenu, e.clientX, e.clientY);
    } else if (win) {
      const appId = win.dataset.app;
      windowContextMenu.dataset.appId = appId || '';
      showContextMenu(windowContextMenu, e.clientX, e.clientY);
    } else {
      showContextMenu(desktopContextMenu, e.clientX, e.clientY);
    }
  });

  // Menu click handlers
  desktopContextMenu?.addEventListener('click', (e) => {
    const action = e.target.dataset.action;
    hideContextMenus();
    if (!action) return;
    switch (action) {
      case 'refresh':
        initDesktopIcons();
        logSystem('[SYSTEM] Desktop refreshed.');
        break;
      case 'arrange':
        arrangeIcons();
        break;
      case 'new-note':
      case 'open-notes':
        openApp('notes');
        break;
    }
  });

  windowContextMenu?.addEventListener('click', (e) => {
    const action = e.target.dataset.action;
    const appId = windowContextMenu.dataset.appId;
    hideContextMenus();
    if (!action || !appId) return;
    switch (action) {
      case 'focus':
        openApp(appId);
        break;
      case 'minimize':
        minimizeApp(appId);
        break;
      case 'close':
        closeApp(appId);
        break;
      case 'toggle-max':
        toggleMaximize(appId);
        break;
      case 'properties':
        alert(`${appId} — properties not implemented.`);
        break;
    }
  });

  // hide on click or escape
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.context-menu')) hideContextMenus();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') hideContextMenus();
  });
  updateClock();
  setInterval(updateClock, 15000);
  logSystem("[SYSTEM] Zyrex OS desktop initialized.");
});
