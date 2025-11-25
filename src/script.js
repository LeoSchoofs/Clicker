let gameData = {
    score: 0,
    clickValue: 1,
    items: [
        { id: 0, name: "Barrette de RAM 256Mo", cost: 15, bps: 1, count: 0, desc: "Une petite amélioration de mémoire." },
        { id: 1, name: "Ventilateur bruyant", cost: 100, bps: 3, count: 0, desc: "Ça souffle fort mais ça refroidit." },
        { id: 2, name: "Nouveau processeur", cost: 500, bps: 10, count: 0, desc: "Il était temps de changer" },
        { id: 3, name: "Carte Graphique RTX 7080", cost: 2000, bps: 40, count: 0, desc: "Pour faire tourner gta 6" },
        { id: 4, name: "La fibre", cost: 7500, bps: 100, count: 0, desc: "J'avoue même moi j'en rêve" },
        { id: 5, name: "Serveur Linux", cost: 25000, bps: 300, count: 0, desc: "Meilleur que windows?" },
        { id: 6, name: "Mineur de Bitcoin", cost: 100000, bps: 1200, count: 0, desc: "Ça chauffe énormément." },
        { id: 7, name: "Water-cooling", cost: 1000000, bps: 5000, count: 0, desc: "Encore plus de refroidissement!" },
        { id: 8, name: "Esprit de Steve Jobs", cost: 10000000, bps: 25000, count: 0, desc: "Le saint-graal" }
    ]
};

function formatNumber(num) {
    if (num >= 1000000000000) return (num / 1000000000000).toFixed(3) + ' Tb';
    if (num >= 1000000000) return (num / 1000000000).toFixed(3) + ' Gb';
    if (num >= 1000000) return (num / 1000000).toFixed(3) + ' Mb';
    if (num >= 1000) return (num / 1000).toFixed(3) + ' Kb';
    return Math.floor(num);
}

function bitsPerSecond() {
    let bps = 0;
    gameData.items.forEach(item => {
        bps += item.count * item.bps;
    });
    return bps;
}

function clickPC(e) {
    gameData.score += gameData.clickValue;
    
    createParticle(e.clientX, e.clientY, "+" + gameData.clickValue);
    
    updateUI();
}

function createParticle(x, y, text) {
    const particle = document.createElement('div');
    particle.classList.add('click-particle');
    particle.innerText = text;
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    document.body.appendChild(particle);
    
    setTimeout(() => {
        particle.remove();
    }, 1000);
}

function buyItem(index) {
    const item = gameData.items[index];
    if (gameData.score >= item.cost) {
        gameData.score -= item.cost;
        item.count++;
        item.cost = Math.round(item.cost * 1.15);
        
        renderUpgrades();
        updateUI();
    }
}


function updateUI() {
    document.getElementById('score').innerText = formatNumber(gameData.score);
    document.getElementById('bps').innerText = formatNumber(bitsPerSecond());

    gameData.items.forEach((item, index) => {
        const btn = document.getElementById(`btn-item-${index}`);
        if (btn) {
            if (gameData.score < item.cost) {
                btn.classList.add('disabled');
            } else {
                btn.classList.remove('disabled');
            }
        }
    });
}

function renderUpgrades() {
    const container = document.getElementById('upgrades-container');
    container.innerHTML = '';

    gameData.items.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'upgrade-item';
        div.id = `btn-item-${index}`;
        div.onclick = () => buyItem(index);

        div.innerHTML = `
            <div class="item-info">
                <h4>${item.name}</h4>
                <p>${item.desc} (+${item.bps} bps)</p>
                <span class="item-cost">Prix: ${formatNumber(item.cost)}</span>
            </div>
            <div class="item-count">${item.count}</div>
        `;
        container.appendChild(div);
    });
}

setInterval(() => {
    const bps = bitsPerSecond();
    if (bps > 0) {
        gameData.score += bps / 10;
        updateUI();
    }
}, 100);

renderUpgrades();
updateUI();