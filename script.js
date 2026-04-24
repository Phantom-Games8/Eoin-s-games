let gamesData = [];

const gameGrid = document.getElementById("game-grid");
const searchBar = document.getElementById("search-bar");
const gameModal = document.getElementById("game-modal");
const iframeContainer = document.getElementById("iframe-container");
const closeBtn = document.getElementById("close-btn");
const modalTitle = document.getElementById("modal-title");
const gameCount = document.getElementById("game-count");

fetch("games.json")
    .then(r => r.json())
    .then(data => {
        gamesData = data;
        updateCount(data.length);
        renderGames(data);
    });

function updateCount(n) {
    gameCount.textContent = `${n} games`;
}

function renderGames(list) {
    gameGrid.innerHTML = "";

    list.forEach(game => {
        const card = document.createElement("div");
        card.className = "game-card";

        const img = document.createElement("img");
        img.src = game.thumbnail || "";
        img.onerror = () => img.remove();

        const overlay = document.createElement("div");
        overlay.className = "overlay";
        overlay.textContent = game.title;

        card.appendChild(img);
        card.appendChild(overlay);

        card.addEventListener("click", () => openGame(game));

        gameGrid.appendChild(card);
    });
}

searchBar.addEventListener("input", e => {
    const term = e.target.value.toLowerCase();
    const filtered = gamesData.filter(g =>
        g.title.toLowerCase().includes(term)
    );
    updateCount(filtered.length);
    renderGames(filtered);
});

document.querySelectorAll(".categories button").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".categories .active")?.classList.remove("active");
        btn.classList.add("active");

        const cat = btn.dataset.cat;

        if (cat === "all") {
            renderGames(gamesData);
            updateCount(gamesData.length);
            return;
        }

        const filtered = gamesData.filter(g =>
            g.title.toLowerCase().includes(cat)
        );

        updateCount(filtered.length);
        renderGames(filtered);
    });
});

function openGame(game) {
    modalTitle.textContent = game.title;
    iframeContainer.innerHTML = `
        <iframe src="${game.iframe_url}" allowfullscreen></iframe>
    `;
    gameModal.classList.remove("hidden");
}

closeBtn.addEventListener("click", () => {
    gameModal.classList.add("hidden");
    iframeContainer.innerHTML = "";
});

document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
        gameModal.classList.add("hidden");
        iframeContainer.innerHTML = "";
    }
});

