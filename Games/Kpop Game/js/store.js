// Store and healing items

// ...existing code...

function buyItem(item) {
    if (item === "noodle" && player.souls >= 50) {
        player.souls -= 50;
        healingItems++;
        addToCombatLog("Bought Noodles. +1 Healing Item.");
    } else if (item === "soda" && player.souls >= 120) {
        player.souls -= 120;
        healingItems++;
        addToCombatLog("Bought Soda. +1 Healing Item.");
    } else {
        addToCombatLog("Not enough Souls!");
    }
    if ($("healing-items-count")) $("healing-items-count").textContent = healingItems;
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.buy-item-btn').forEach(btn => {
        btn.onclick = function() {
            const item = btn.closest('.store-item').dataset.item;
            buyItem(item);
        };
    });
    if ($("heal-btn")) {
        $("heal-btn").onclick = function() {
            if (healingItems > 0 && player.hp < player.maxHp) {
                healingItems--;
                player.hp = Math.min(player.maxHp, player.hp + Math.floor(player.maxHp * 0.4));
                addToCombatLog("Used a healing item!");
                if ($("healing-items-count")) $("healing-items-count").textContent = healingItems;
                updatePlayerUI();
            } else {
                addToCombatLog("No healing items or HP is full!");
            }
        };
    }
});
