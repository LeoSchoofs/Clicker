let gameData = {
    score: 0,

    cpuTemp: 40,
    minTemp: 40,
    maxTemp: 100,
    fanRPM: 0,

    hardwareItems: [
        { id: 0, name: "RAM Stick", cost: 15, val: 0.5, count: 0, desc: "Mémoire de base" },
        { id: 1, name: "GPU Voodoo", cost: 150, val: 5, count: 0, desc: "Accélération 3D" },
        { id: 2, name: "Serveur Web", cost: 1000, val: 25, count: 0, desc: "Hébergement" },
        { id: 3, name: "Cluster de Calcul", cost: 5000, val: 100, count: 0, desc: "Traitement parallèle" },
        { id: 4, name: "Supercalculateur", cost: 50000, val: 500, count: 0, desc: "Puissance pure" }
    ],

    softwareItems: [
        { id: 0, name: "Souris Optique", cost: 50, val: 1, count: 0, desc: "+1/clic" },
        { id: 1, name: "Double Clic", cost: 400, val: 5, count: 0, desc: "+5/clic" },
        { id: 2, name: "Script Hack", cost: 2000, val: 25, count: 0, desc: "+25/clic" },
        { id: 3, name: "Faille Zero-Day", cost: 10000, val: 100, count: 0, desc: "+100/clic" }
    ]
};

function formatNumber(num) {
    if (num >= 1e6) return (num / 1e6).toFixed(2) + ' MB';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + ' KB';
    return Math.floor(num);
}

function log(msg) {
    const list = document.getElementById('log-list');
    const li = document.createElement('li');
    li.innerText = msg;
    list.prepend(li);
    if (list.children.length > 8) list.lastChild.remove();
}

function getBPS() {
    let bps = 0;
    gameData.hardwareItems.forEach(i => bps += i.count * i.val);
    return bps;
}

function getClickPower() {
    let power = 1;
    gameData.softwareItems.forEach(u => power += u.count * u.val);
    return power;
}

function clickCore(e) {
    if (gameData.cpuTemp >= gameData.maxTemp) return; // Bloqué si trop chaud

    const val = getClickPower();
    gameData.score += val;
    gameData.cpuTemp += 0.2; // Chauffe un peu au clic

    createParticle(e.clientX, e.clientY, `+${formatNumber(val)}`);
    updateUI();
}

function createParticle(x, y, text) {
    const el = document.createElement('div');
    el.className = 'click-particle';
    el.innerText = text;
    const offsetX = (Math.random() - 0.5) * 40;
    el.style.left = (x + offsetX) + 'px';
    el.style.top = (y - 20) + 'px';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 800);
}

function spinFan() {
    gameData.fanRPM += 300;
    if (gameData.fanRPM > 5000) gameData.fanRPM = 5000;
    updateFanVisuals();
}

function buy(category, index) {
    const list = category === 'software' ? gameData.softwareItems : gameData.hardwareItems;
    const item = list[index];

    if (gameData.score >= item.cost) {
        gameData.score -= item.cost;
        item.count++;
        item.cost = Math.ceil(item.cost * 1.2);
        log(`ACHAT: ${item.name}`);
        renderShop();
        updateUI();
    }
}

function spawnEvent() {
    // 20% de chance toutes les 5 secondes
    if (Math.random() > 0.8) {
        const isVirus = Math.random() > 0.5;
        const el = document.createElement('div');
        el.className = `event-popup ${isVirus ? 'event-virus' : 'event-bonus'}`;
        el.innerText = isVirus ? "⚠️ VIRUS DÉTECTÉ !" : "💾 DONNÉES TROUVÉES";

        // Position aléatoire (éviter les bords)
        el.style.left = (50 + Math.random() * (window.innerWidth - 300)) + 'px';
        el.style.top = (50 + Math.random() * (window.innerHeight - 200)) + 'px';

        el.onclick = () => {
            if (isVirus) {
                createParticle(parseInt(el.style.left), parseInt(el.style.top), "MENACE ÉLIMINÉE");
                log("VIRUS STOPPÉ.");
            } else {
                const bonus = getBPS() * 20 + 500;
                gameData.score += bonus;
                createParticle(parseInt(el.style.left), parseInt(el.style.top), `+${formatNumber(bonus)}`);
                log(`BONUS: +${formatNumber(bonus)}`);
            }
            el.remove();
        };

        // Si on ignore le virus -> Punition
        if (isVirus) {
            setTimeout(() => {
                if (document.body.contains(el)) {
                    el.remove();
                    triggerBSOD();
                }
            }, 4000); // 4 secondes pour réagir
        } else {
            // Le bonus disparait juste
            setTimeout(() => { if (document.body.contains(el)) el.remove(); }, 4000);
        }

        document.body.appendChild(el);
    }
}

let currentCaptcha = "";

function triggerBSOD() {
    const bsod = document.getElementById('bsod');
    bsod.style.display = 'flex';

    // Punition immédiate
    gameData.score = Math.floor(gameData.score * 0.7);
    gameData.cpuTemp = 60;
    gameData.fanRPM = 0;

    generateCaptcha();
}

function generateCaptcha() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    currentCaptcha = result;

    // Affichage
    document.getElementById('captcha-code').innerText = result;
    const input = document.getElementById('captcha-input');
    input.value = "";
    input.focus(); // On met le curseur direct dedans
}

function checkCaptcha() {
    const input = document.getElementById('captcha-input');

    // On compare en majuscule
    if (input.value.toUpperCase() === currentCaptcha) {
        // SUCCÈS
        document.getElementById('bsod').style.display = 'none';
        log("SYSTEM REBOOTED.");
    } else {
        // ÉCHEC
        input.style.border = "3px solid red";
        input.classList.add('shake');

        generateCaptcha();

        setTimeout(() => {
            input.style.border = "2px solid white";
        }, 500);
    }
}


setInterval(() => {
    // 1. Production BPS
    const bps = getBPS();
    let multiplier = 1;
    if (gameData.cpuTemp >= gameData.maxTemp) multiplier = 0;
    else if (gameData.cpuTemp >= 80) multiplier = 0.5;

    if (bps > 0) gameData.score += (bps * multiplier) / 10;

    // 2. Température & Ventilo
    gameData.cpuTemp += 0.15; // Montée constante

    if (gameData.fanRPM > 0) {
        gameData.cpuTemp -= (gameData.fanRPM / 3000); // Refroidissement
        gameData.fanRPM -= 30; // Ralentissement du ventilo
        if (gameData.fanRPM < 0) gameData.fanRPM = 0;
    }

    if (gameData.cpuTemp < gameData.minTemp) gameData.cpuTemp = gameData.minTemp;
    if (gameData.cpuTemp >= gameData.maxTemp + 5) triggerBSOD();

    updateUI();
    updateFanVisuals();
}, 100);

// Check Events toutes les 5s
setInterval(spawnEvent, 5000);

// Sauvegarde 30s
setInterval(() => localStorage.setItem('cyberFinal', JSON.stringify(gameData)), 30000);

let fanRotation = 0;
function updateFanVisuals() {
    fanRotation += gameData.fanRPM / 20;
    document.getElementById('fan-blade').style.transform = `rotate(${fanRotation}deg)`;
    document.getElementById('fan-rpm').innerText = Math.floor(gameData.fanRPM);
}

function updateUI() {
    document.getElementById('score').innerText = formatNumber(gameData.score);
    document.getElementById('bps').innerText = formatNumber(getBPS());

    const tempDisp = document.getElementById('temp-display');
    tempDisp.innerText = gameData.cpuTemp.toFixed(1) + "°C";

    const pct = ((gameData.cpuTemp - gameData.minTemp) / (gameData.maxTemp - gameData.minTemp)) * 100;
    document.getElementById('temp-bar-fill').style.width = Math.max(0, Math.min(100, pct)) + "%";

    // Update Shop Buttons
    const updateButtons = (list, type) => {
        list.forEach((item, i) => {
            const btn = document.getElementById(`btn-${type}-${i}`);
            if (btn) {
                if (gameData.score < item.cost) btn.classList.add('disabled');
                else btn.classList.remove('disabled');
                // Mise à jour du prix et du count en temps réel
                btn.querySelector('.price').innerText = formatNumber(item.cost);
                btn.querySelector('.count-badge').innerText = item.count;
            }
        });
    };
    updateButtons(gameData.softwareItems, 'software');
    updateButtons(gameData.hardwareItems, 'hardware');
}

function renderShop() {
    const renderList = (list, containerId, type) => {
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        list.forEach((item, i) => {
            const div = document.createElement('div');
            div.className = 'item-card';
            div.id = `btn-${type}-${i}`;
            div.onclick = () => buy(type, i);
            div.innerHTML = `
                <div class="item-info">
                    <h4>${item.name}</h4>
                    <p>${item.desc} (+${item.val})</p>
                </div>
                <div style="text-align:right">
                    <div class="price">${formatNumber(item.cost)}</div>
                    <div class="count-badge" style="background:#333; padding:2px 6px; border-radius:10px; font-size:0.7rem; margin-top:2px">${item.count}</div>
                </div>
            `;
            container.appendChild(div);
        });
    };

    renderList(gameData.softwareItems, 'shop-software', 'software');
    renderList(gameData.hardwareItems, 'shop-hardware', 'hardware');
}


window.onload = () => {
    if(localStorage.getItem('cyberFinal')) {
        const saved = JSON.parse(localStorage.getItem('cyberFinal'));
        gameData = { ...gameData, ...saved };

        const input = document.getElementById('captcha-input');
        input.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                checkCaptcha();
            }
        });
    }
    renderShop();
    updateUI();
};