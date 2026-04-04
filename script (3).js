let gamesData = [];

const gameGrid = document.getElementById('game-grid');
const searchBar = document.getElementById('search-bar');
const gameModal = document.getElementById('game-modal');
const iframeContainer = document.getElementById('iframe-container');
const closeBtn = document.getElementById('close-btn');
const modalTitle = document.getElementById('modal-title');
const gameCount = document.getElementById('game-count');

fetch('games.json')
    .then(r => r.json())
    .then(data => {
        // Deduplicate by iframe_url
        const seen = new Set();
        gamesData = data.filter(g => {
            if (seen.has(g.iframe_url)) return false;
            seen.add(g.iframe_url);
            return true;
        });
        updateCount(gamesData.length);
        renderGames(gamesData);
    })
    .catch(() => {
        gameGrid.innerHTML = '<p class="error-msg">Could not load games.json. Make sure you are running on GitHub Pages or a local server.</p>';
    });

function updateCount(n) {
    if (gameCount) gameCount.textContent = n + ' games';
}

function generateColor(title) {
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
        hash = title.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `hsl(${Math.abs(hash) % 360}, 55%, 42%)`;
}

function renderGames(games) {
    gameGrid.innerHTML = '';

    if (games.length === 0) {
        gameGrid.innerHTML = '<p class="no-results">No games found.</p>';
        return;
    }

    updateCount(games.length);

    games.forEach(game => {
        const card = document.createElement('div');
        card.className = 'game-card';

        if (game.thumbnail) {
            const img = document.createElement('img');
            img.alt = game.title;
            img.src = game.thumbnail;
            img.onerror = function () {
                this.remove();
                applyFallback(card, game.title);
            };
            card.appendChild(img);
        } else {
            applyFallback(card, game.title);
        }

        const overlay = document.createElement('div');
        overlay.className = 'overlay';
        overlay.textContent = game.title;
        card.appendChild(overlay);

        card.addEventListener('click', () => openGame(game));
        gameGrid.appendChild(card);
    });
}

function applyFallback(card, title) {
    card.style.background = generateColor(title);
    const fallback = document.createElement('div');
    fallback.className = 'thumb-fallback';
    fallback.textContent = title;
    card.insertBefore(fallback, card.firstChild);
}

searchBar.addEventListener('input', e => {
    const term = e.target.value.toLowerCase().trim();
    const filtered = term
        ? gamesData.filter(g => g.title.toLowerCase().includes(term))
        : gamesData;
    renderGames(filtered);
});

function openGame(game) {
    modalTitle.textContent = game.title;
    iframeContainer.innerHTML = `
        <iframe
            id="game-frame"
            src="${game.iframe_url}"
            allowfullscreen="true"
            scrolling="no"
            allow="autoplay; fullscreen; keyboard-map">
        </iframe>`;
    gameModal.classList.remove('hidden');
    setTimeout(() => {
        const f = document.getElementById('game-frame');
        if (f) f.focus();
    }, 400);
}

closeBtn.addEventListener('click', () => {
    gameModal.classList.add('hidden');
    iframeContainer.innerHTML = '';
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !gameModal.classList.contains('hidden')) {
        gameModal.classList.add('hidden');
        iframeContainer.innerHTML = '';
    }
});
