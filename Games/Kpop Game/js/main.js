// Entry point and main UI/game loop

document.addEventListener('DOMContentLoaded', () => {
    setupCharacterSelect();
    if ($('healing-items-count')) $('healing-items-count').textContent = typeof healingItems !== 'undefined' ? healingItems : 0;
    if (typeof loadDerpyImage === 'function') loadDerpyImage();
    if (typeof renderZones === 'function') renderZones();
    if (typeof renderCookingInventory === 'function') renderCookingInventory();
    if (typeof renderCookingRecipes === 'function') renderCookingRecipes();

    document.querySelectorAll('.storage-subtab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.storage-subtab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.storage-subtab').forEach(tab => tab.classList.remove('active'));
            btn.classList.add('active');
            const subtab = document.getElementById(btn.dataset.subtab);
            if (subtab) subtab.classList.add('active');
            renderStorageInventory();
        });
    });

    const sortSel = document.getElementById('storage-sort');
    const filterSel = document.getElementById('storage-filter');
    if (sortSel) sortSel.addEventListener('change', renderStorageInventory);
    if (filterSel) filterSel.addEventListener('change', renderStorageInventory);

    const storageTabBtn = document.querySelector('[data-tab="storage-tab"]');
    if (storageTabBtn) storageTabBtn.addEventListener('click', renderStorageInventory);

    renderStorageInventory();
    initDerpyCompanion();
});

function renderStorageInventory() {
    const sort = document.getElementById('storage-sort')?.value || 'name';
    const filter = document.getElementById('storage-filter')?.value || 'all';
    const invDiv = document.getElementById('storage-inventory');
    if (!invDiv) return;

    const items = [];
    if (typeof demonDrops === 'object' && (filter === 'all' || filter === 'ingredients')) {
        for (const key in demonDrops) {
            items.push({
                name: formatItemName(key),
                key,
                type: 'Ingredient',
                amount: demonDrops[key],
                icon: getItemEmoji(key)
            });
        }
    }

    if (typeof cookingInventory === 'object' && (filter === 'all' || filter === 'cooked')) {
        for (const key in cookingInventory) {
            items.push({
                name: formatItemName(key),
                key,
                type: 'Food',
                amount: cookingInventory[key],
                icon: getItemEmoji(key)
            });
        }
    }

    if (sort === 'name') {
        items.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'amount') {
        items.sort((a, b) => b.amount - a.amount);
    }

    if (items.length === 0) {
        invDiv.innerHTML = '<div class="storage-empty">No items found for this filter.</div>';
        return;
    }

    const cards = items.map(item => {
        const isEmpty = item.amount <= 0;
        return `
            <div class="storage-item-card ${isEmpty ? 'empty' : ''}">
                <div class="storage-item-icon">${item.icon}</div>
                <div class="storage-item-main">
                    <div class="storage-item-name">${item.name}</div>
                    <div class="storage-item-meta">${item.type}</div>
                </div>
                <div class="storage-item-amount">x${item.amount}</div>
            </div>
        `;
    }).join('');

    invDiv.innerHTML = cards;
}

function formatItemName(key) {
    return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function getItemEmoji(key) {
    if (key.includes('kimchi')) return '🥬';
    if (key.includes('boba')) return '🧋';
    if (key.includes('ramen')) return '🍜';
    if (key.includes('rice')) return '🍚';
    if (key.includes('soup')) return '🍲';
    if (key.includes('tea')) return '🍵';
    if (key.includes('fish')) return '🐟';
    if (key.includes('meat')) return '🍖';
    if (key.includes('spice')) return '🌶️';
    return '📦';
}

function initDerpyCompanion() {
    let zone = document.getElementById('derpy-zone');
    if (!zone) {
        zone = document.createElement('div');
        zone.id = 'derpy-zone';
        document.body.appendChild(zone);
    }

    if (document.getElementById('derpy-companion')) return;

    const derpyPortraitSrc = (typeof portraits !== 'undefined' && portraits.derpy)
        ? portraits.derpy
        : 'https://static.wikia.nocookie.net/kpop-demon-hunters/images/7/73/Derpy_Portrait_temp.png';

    const derpySprites = {
        idleRight: derpyPortraitSrc,
        idleLeft: derpyPortraitSrc,
        blinkRight: derpyPortraitSrc,
        blinkLeft: derpyPortraitSrc,
        runRight: [derpyPortraitSrc, derpyPortraitSrc, derpyPortraitSrc, derpyPortraitSrc],
        runLeft: [derpyPortraitSrc, derpyPortraitSrc, derpyPortraitSrc, derpyPortraitSrc],
        jumpRight: derpyPortraitSrc,
        jumpLeft: derpyPortraitSrc
    };

    const derpy = document.createElement('img');
    derpy.id = 'derpy-companion';
    derpy.alt = 'Derpy companion';
    derpy.src = derpySprites.idleRight;
    derpy.onerror = () => {
        const shrineImage = document.getElementById('derpy-img');
        if (shrineImage && shrineImage.currentSrc && derpy.src !== shrineImage.currentSrc) {
            derpy.src = shrineImage.currentSrc;
        }
    };

    const bubble = document.createElement('div');
    bubble.id = 'derpy-bubble';
    bubble.setAttribute('aria-live', 'polite');

    const shadow = document.createElement('div');
    shadow.id = 'derpy-shadow';

    const portal = document.createElement('div');
    portal.id = 'derpy-portal';

    zone.appendChild(bubble);
    zone.appendChild(portal);
    zone.appendChild(shadow);
    zone.appendChild(derpy);

    const derpyLines = [
        "Sabrina built this world, I am just here to zoom.",
        "Tiny mission update: keep Sabrina smiling.",
        "Sabrina buff detected. Cuteness plus one hundred.",
        "I train every jump for Sabrina.",
        "Cursor, behave. Sabrina is watching.",
        "For Sabrina: one dramatic side run, coming up.",
        "Sabrina's game, Derpy's runway.",
        "Note to self: impress Sabrina with flips next."
    ];

    const state = {
        x: Math.max(20, window.innerWidth * 0.12),
        y: 0,
        vx: 0,
        vy: 0,
        dir: 1,
        targetX: window.innerWidth * 0.5,
        groundY: 0,
        size: 168,
        grounded: true,
        jumpCooldown: 0,
        playfulTimer: 0,
        cursorX: window.innerWidth * 0.5,
        cursorY: window.innerHeight * 0.5,
        cursorSeen: false,
        raf: 0,
        lastTs: 0,
        focusUntil: 0,
        bubbleHideAt: 0,
        nextChatterAt: 0,
        lastLine: -1,
        currentSprite: '',
        runningFrame: 0,
        frameTimer: 0,
        blinkUntil: 0,
        nextBlinkAt: 0,
        isDragging: false,
        dragPointerId: null,
        dragOffsetX: 0,
        dragOffsetY: 0,
        throwVX: 0,
        throwVY: 0,
        lastDragX: 0,
        lastDragY: 0,
        lastDragTs: 0,
        portalUntil: 0,
        portalTeleportAt: 0,
        portalDidTeleport: false,
        portalX: window.innerWidth * 0.5,
        portalY: window.innerHeight * 0.5,
        portalPulse: 1
    };

    function clampX(value) {
        const minX = 14;
        const maxX = Math.max(minX + 10, window.innerWidth - 14);
        return Math.min(maxX, Math.max(minX, value));
    }

    function clampY(value) {
        return Math.min(state.groundY + 24, Math.max(8, value));
    }

    function setSprite(src) {
        if (state.currentSprite === src) return;
        state.currentSprite = src;
        derpy.src = src;
    }

    function sayRandomLine(now, force) {
        if (!force && now < state.nextChatterAt) return;
        let index = Math.floor(Math.random() * derpyLines.length);
        if (index === state.lastLine) index = (index + 1) % derpyLines.length;
        state.lastLine = index;
        bubble.textContent = derpyLines[index];
        bubble.classList.add('show');
        state.bubbleHideAt = now + 2600 + Math.random() * 1200;
        state.nextChatterAt = now + 12000 + Math.random() * 10000;
    }

    function setGround() {
        state.groundY = Math.max(40, window.innerHeight - state.size - 14);
        if (state.y === 0) state.y = state.groundY;
    }

    function maybeOpenPortal(now) {
        const throwSpeed = Math.hypot(state.throwVX, state.throwVY);
        if (throwSpeed < 340 || !state.cursorSeen) return;
        if (Math.random() > 0.33) return;

        const portalOffsetX = state.dir > 0 ? -22 : 22;
        state.portalX = Math.min(window.innerWidth - 38, Math.max(38, state.cursorX + portalOffsetX));
        state.portalY = Math.min(window.innerHeight - 72, Math.max(72, state.cursorY + 12));
        state.portalUntil = now + 850 + Math.random() * 500;
        state.portalTeleportAt = now + 140;
        state.portalDidTeleport = false;
        state.portalPulse = 0.88 + Math.random() * 0.25;
        portal.classList.add('show');
    }

    function performPortalTeleport() {
        const targetX = Math.min(window.innerWidth - 18, Math.max(18, state.cursorX));
        const targetY = Math.min(state.groundY - 24, Math.max(18, state.cursorY - state.size - 30));
        const travelX = state.cursorX - targetX;
        const travelY = state.cursorY - targetY;

        state.x = targetX;
        state.y = targetY;
        state.vx = Math.max(-240, Math.min(240, travelX * 0.35 + state.dir * 90));
        state.vy = Math.max(80, Math.min(320, travelY * 0.45));
        state.grounded = false;
        state.focusUntil = performance.now() + 1100;
        derpy.classList.add('is-jumping');
        state.portalDidTeleport = true;
    }

    function releaseDrag() {
        if (!state.isDragging) return;
        const now = performance.now();
        state.isDragging = false;
        state.dragPointerId = null;
        derpy.classList.remove('is-dragging');
        state.vx = Math.max(-520, Math.min(520, state.throwVX));
        state.vy = Math.max(-760, Math.min(700, state.throwVY));
        state.grounded = state.y >= state.groundY - 1;
        if (!state.grounded) derpy.classList.add('is-jumping');
        maybeOpenPortal(now);
    }

    function startDrag(event) {
        event.preventDefault();
        const now = performance.now();

        state.isDragging = true;
        state.dragPointerId = event.pointerId;
        state.dragOffsetX = event.clientX - state.x;
        state.dragOffsetY = event.clientY - state.y;
        state.throwVX = 0;
        state.throwVY = 0;
        state.lastDragX = event.clientX;
        state.lastDragY = event.clientY;
        state.lastDragTs = now;
        state.vx = 0;
        state.vy = 0;
        state.grounded = false;
        derpy.classList.add('is-dragging');
        derpy.classList.remove('is-jumping');
        if (derpy.setPointerCapture) derpy.setPointerCapture(event.pointerId);
        rememberCursor(event.clientX, event.clientY);
        sayRandomLine(now, true);
    }

    function dragMove(event) {
        if (!state.isDragging || state.dragPointerId !== event.pointerId) return;
        event.preventDefault();
        const now = performance.now();
        const nextX = clampX(event.clientX - state.dragOffsetX);
        const nextY = clampY(event.clientY - state.dragOffsetY);

        const dt = Math.max(0.001, (now - state.lastDragTs) / 1000);
        const instantVX = (event.clientX - state.lastDragX) / dt;
        const instantVY = (event.clientY - state.lastDragY) / dt;
        state.throwVX = state.throwVX * 0.55 + instantVX * 0.45;
        state.throwVY = state.throwVY * 0.55 + instantVY * 0.45;
        state.lastDragX = event.clientX;
        state.lastDragY = event.clientY;
        state.lastDragTs = now;

        state.x = nextX;
        state.y = nextY;
        state.dir = state.throwVX >= 0 ? 1 : -1;
        rememberCursor(event.clientX, event.clientY);
    }

    function rememberCursor(clientX, clientY) {
        state.cursorX = clientX;
        state.cursorY = clientY;
        state.cursorSeen = true;
        state.focusUntil = performance.now() + 1600;
    }

    function jump(power) {
        if (!state.grounded || state.jumpCooldown > 0) return;
        state.vy = -power;
        state.grounded = false;
        state.jumpCooldown = 0.7;
        derpy.classList.add('is-jumping');
    }

    function updateTarget(now) {
        const cursorNearFloor = state.cursorY > window.innerHeight - 220;
        const focused = now < state.focusUntil;

        if (state.cursorSeen && (focused || cursorNearFloor)) {
            state.targetX = Math.min(window.innerWidth - 40, Math.max(20, state.cursorX));
            return;
        }

        if (state.playfulTimer <= 0) {
            const min = 28;
            const max = Math.max(min + 20, window.innerWidth - 28);
            state.targetX = min + Math.random() * (max - min);
            state.playfulTimer = 1.6 + Math.random() * 2.1;
        }
    }

    function tick(ts) {
        if (!state.lastTs) state.lastTs = ts;
        const dt = Math.min(0.04, (ts - state.lastTs) / 1000);
        state.lastTs = ts;
        const now = ts;

        if (!state.isDragging && now < state.portalUntil && !state.portalDidTeleport && now >= state.portalTeleportAt) {
            performPortalTeleport();
        }

        if (state.isDragging) {
            setSprite(state.dir > 0 ? derpySprites.jumpRight : derpySprites.jumpLeft);
            derpy.style.left = `${state.x}px`;
            derpy.style.top = `${state.y}px`;
            derpy.style.transform = `translate(-50%, 0) scaleX(${state.dir > 0 ? 1 : -1})`;

            shadow.style.left = `${state.x}px`;
            shadow.style.transform = 'translateX(-50%) scale(0.72, 0.7)';

            if (now < state.portalUntil) {
                portal.classList.add('show');
                portal.style.left = `${state.portalX}px`;
                portal.style.top = `${state.portalY}px`;
                portal.style.transform = `translate(-50%, -50%) scale(${state.portalPulse})`;
            } else {
                portal.classList.remove('show');
            }

            bubble.style.left = `${state.x}px`;
            bubble.style.top = `${Math.max(10, state.y - 8)}px`;
            if (now >= state.bubbleHideAt) bubble.classList.remove('show');

            state.raf = requestAnimationFrame(tick);
            return;
        }

        state.playfulTimer -= dt;
        state.jumpCooldown = Math.max(0, state.jumpCooldown - dt);

        updateTarget(ts);

        const dist = state.targetX - state.x;
        const absDist = Math.abs(dist);
        const moving = absDist > 6;
        const maxSpeed = 180;

        if (moving) {
            state.dir = dist > 0 ? 1 : -1;
            const desired = state.dir * Math.min(maxSpeed, 70 + absDist * 1.5);
            state.vx += (desired - state.vx) * Math.min(1, dt * 8);
        } else {
            state.vx *= Math.max(0, 1 - dt * 10);
        }

        const derpyTopInViewport = state.y;

        if (state.cursorSeen && absDist < 44 && state.cursorY < derpyTopInViewport - 16 && state.grounded) {
            jump(410);
        } else if (state.grounded && state.jumpCooldown <= 0 && Math.random() < dt * 0.11) {
            jump(320 + Math.random() * 90);
        }

        state.vy += 980 * dt;
        state.x += state.vx * dt;
        state.y += state.vy * dt;

        const minX = 14;
        const maxX = Math.max(minX + 10, window.innerWidth - 14);
        if (state.x < minX) {
            state.x = minX;
            state.vx = Math.abs(state.vx) * 0.4;
            state.dir = 1;
        }
        if (state.x > maxX) {
            state.x = maxX;
            state.vx = -Math.abs(state.vx) * 0.4;
            state.dir = -1;
        }

        if (state.y >= state.groundY) {
            state.y = state.groundY;
            state.vy = 0;
            if (!state.grounded) derpy.classList.remove('is-jumping');
            state.grounded = true;
        }

        const runClass = Math.abs(state.vx) > 28 && state.grounded;
        derpy.classList.toggle('is-running', runClass);

        if (!state.grounded) {
            setSprite(state.dir > 0 ? derpySprites.jumpRight : derpySprites.jumpLeft);
        } else if (runClass) {
            state.frameTimer += dt;
            if (state.frameTimer > 0.095) {
                state.runningFrame = (state.runningFrame + 1) % 4;
                state.frameTimer = 0;
            }
            setSprite(state.dir > 0 ? derpySprites.runRight[state.runningFrame] : derpySprites.runLeft[state.runningFrame]);
        } else {
            state.runningFrame = 0;
            state.frameTimer = 0;
            if (now >= state.nextBlinkAt && state.blinkUntil <= now) {
                state.blinkUntil = now + 140;
                state.nextBlinkAt = now + 2200 + Math.random() * 3300;
            }

            const blinking = now < state.blinkUntil;
            if (blinking) {
                setSprite(state.dir > 0 ? derpySprites.blinkRight : derpySprites.blinkLeft);
            } else {
                setSprite(state.dir > 0 ? derpySprites.idleRight : derpySprites.idleLeft);
            }
        }

        derpy.style.left = `${state.x}px`;
        derpy.style.top = `${state.y}px`;
        derpy.style.transform = `translate(-50%, 0) scaleX(${state.dir > 0 ? 1 : -1})`;

        const stretch = state.grounded ? 1 : Math.max(0.7, 1 - Math.abs(state.vy) / 700);
        shadow.style.left = `${state.x}px`;
        shadow.style.transform = `translateX(-50%) scale(${stretch}, ${0.85 + stretch * 0.2})`;

        if (now < state.portalUntil) {
            const portalProgress = Math.max(0, (state.portalUntil - now) / 1350);
            const portalScale = state.portalPulse + (1 - portalProgress) * 0.2;
            portal.classList.add('show');
            portal.style.left = `${state.portalX}px`;
            portal.style.top = `${state.portalY}px`;
            portal.style.transform = `translate(-50%, -50%) scale(${portalScale})`;
            portal.style.opacity = `${Math.max(0.15, Math.min(0.95, portalProgress * 1.2))}`;
        } else {
            portal.classList.remove('show');
            portal.style.opacity = '';
        }

        bubble.style.left = `${state.x}px`;
        bubble.style.top = `${Math.max(10, state.y - 8)}px`;
        if (now >= state.bubbleHideAt) bubble.classList.remove('show');

        if (now >= state.nextChatterAt) sayRandomLine(now, false);
        if (state.cursorSeen && absDist < 34 && state.grounded && now >= state.nextChatterAt - 2000) {
            sayRandomLine(now, true);
        }

        state.raf = requestAnimationFrame(tick);
    }

    setGround();
    state.y = state.groundY;
    state.nextChatterAt = performance.now() + 1400;
    state.nextBlinkAt = performance.now() + 1200;

    window.addEventListener('resize', () => {
        setGround();
        state.x = Math.min(Math.max(state.x, 14), Math.max(24, window.innerWidth - 14));
        state.portalX = Math.min(window.innerWidth - 38, Math.max(38, state.portalX));
        state.portalY = Math.min(window.innerHeight - 72, Math.max(72, state.portalY));
    });

    window.addEventListener('mousemove', (event) => {
        rememberCursor(event.clientX, event.clientY);
    }, { passive: true });

    window.addEventListener('touchmove', (event) => {
        if (!event.touches || !event.touches.length) return;
        const touch = event.touches[0];
        rememberCursor(touch.clientX, touch.clientY);
    }, { passive: true });

    derpy.addEventListener('pointerdown', startDrag);

    window.addEventListener('pointermove', dragMove, { passive: false });
    window.addEventListener('pointerup', (event) => {
        if (state.dragPointerId !== event.pointerId) return;
        releaseDrag();
    });
    window.addEventListener('pointercancel', (event) => {
        if (state.dragPointerId !== event.pointerId) return;
        releaseDrag();
    });

    state.raf = requestAnimationFrame(tick);
}

function setupCharacterSelect() {
    const cards = document.querySelectorAll(".character-card");
    cards.forEach(card => {
        card.addEventListener("click", () => {
            cards.forEach(c => c.classList.remove("selected"));
            card.classList.add("selected");
            player.name = card.dataset.char;
            $("player-portrait").src = portraits[player.name] || portraits.mira;
            $("character-message-box").classList.remove("hidden");
            $("character-message-text").textContent = `${player.name.charAt(0).toUpperCase() + player.name.slice(1)} selected`;
            const createBtn = $("create-profile-btn");
            if (createBtn) createBtn.disabled = false;
        });
    });
}

function startGame() {
    $("player-portrait").src = portraits[player.name] || portraits.mira;
    if ($("idle-toggle")) $("idle-toggle").checked = player.idleMode;
    player.hp = player.maxHp;
    if (typeof updatePlayerUI === 'function') updatePlayerUI();
    if (typeof renderDistricts === 'function') renderDistricts();
    if (typeof startCombatLoop === 'function') startCombatLoop();
}
