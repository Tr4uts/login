document.addEventListener("DOMContentLoaded", () => {

    // --- BANCO DE DADOS (Simulado) ---
    const games = [
        {
            id: 1,
            title: "Pokémon Emerald",
            console: "GBA",
            cover: "https://cdn2.steamgriddb.com/thumb/052938e7b425df3acdd9dc4be44404ef.jpg",
            rom: "roms/pokemon-emerald.gba",
            description: "Pokémon Emerald é uma edição aprimorada de Pokémon Ruby e Sapphire. Viaje pela região de Hoenn, capture Pokémon e enfrente a Equipe Aqua e a Equipe Magma em sua busca para se tornar o campeão."
        },
        {
            id: 2,
            title: "Zelda: A Link to the Past",
            console: "SNES",
            cover: "https://cdn2.steamgriddb.com/thumb/7edaadde50012f0860952123564eb1ba.jpg",
            rom: "roms/zelda-link-to-the-past.sfc",
            description: "Um clássico atemporal. Viaje entre o Mundo da Luz e o Mundo das Trevas para resgatar a Princesa Zelda e os Sete Sábios do maligno feiticeiro Agahnim, frustrando os planos de Ganon."
        },
        {
            id: 3,
            title: "Sonic the Hedgehog 2",
            console: "Mega Drive",
            cover: "https://cdn2.steamgriddb.com/thumb/70e48fb761d61fad9ddcbc4a1b889e68.jpg",
            rom: "roms/sonic-2.md",
            description: "Mais rápido e com um novo amigo! Junte-se a Sonic e Tails em uma aventura veloz para impedir que o Dr. Robotnik domine o mundo com sua nova arma definitiva, o Death Egg."
        },
        {
            id: 4,
            title: "Metroid Fusion",
            console: "GBA",
            cover: "https://cdn2.steamgriddb.com/thumb/755f12c05f69fc1dbd113cf9599fbfd4.jpg",
            rom: "roms/metroid-fusion.gba",
            description: "Samus Aran enfrenta um novo terror. Infectada por um parasita X, ela deve navegar por uma estação espacial infestada, caçada por uma cópia implacável de si mesma, o SA-X."
        },
    ];

    // --- ELEMENTOS DO DOM ---
    const gameLibrary = document.getElementById("game-library");
    const filterButtons = document.querySelectorAll(".filter-btn");
    const detailsOverlay = document.getElementById("details-overlay");
    const closeDetailsBtn = document.getElementById("close-details-btn");
    const detailsCover = document.getElementById("details-cover");
    const detailsTitle = document.getElementById("details-title");
    const detailsDescription = document.getElementById("details-description");
    const emulatorOverlay = document.getElementById("emulator-overlay");
    const closeEmulatorBtn = document.getElementById("close-emulator-btn");
    const gameTitleSpan = document.getElementById("game-title");
    const premiumLink = document.getElementById("premium-link");
    const profileBtn = document.getElementById("profile-btn");
    const profileDropdown = document.getElementById("profile-dropdown");

    // --- FUNÇÕES ---

    function loadLibrary(filter = 'Todos') {
        gameLibrary.innerHTML = "";
        const filteredGames = (filter === 'Todos')
            ? games
            : games.filter(game => game.console === filter);

        filteredGames.forEach(game => {
            const gameCard = document.createElement("div");
            gameCard.className = "game-card";
            gameCard.innerHTML = `
                <div class="game-image" style="background-image: url('${game.cover}')"></div>
                <div class="card-title">${game.title}</div>
            `;
            gameCard.addEventListener("click", () => showGameDetails(game));
            gameLibrary.appendChild(gameCard);
        });

        attachHoverListeners();
    }

    function showGameDetails(game) {
        detailsCover.src = game.cover;
        detailsTitle.textContent = game.title;
        detailsDescription.innerHTML = `<span class="details-console-tag">${game.console}</span> ${game.description}`;

        const currentPlayBtn = document.getElementById("details-play-btn");
        const newPlayBtn = currentPlayBtn.cloneNode(true);
        currentPlayBtn.parentNode.replaceChild(newPlayBtn, currentPlayBtn);

        newPlayBtn.addEventListener("click", () => {
            hideGameDetails();
            launchGame(game);
        });

        detailsOverlay.classList.remove("hidden");
    }

    function hideGameDetails() {
        detailsOverlay.classList.add("hidden");
    }

    function launchGame(game) {
        console.log(`Iniciando ${game.console} jogo: ${game.title} de ${game.rom}`);
        gameTitleSpan.textContent = game.title;
        emulatorOverlay.classList.remove("hidden");
    }

    function closeEmulator() {
        emulatorOverlay.classList.add("hidden");
    }

    function attachHoverListeners() {
        const gameImages = document.querySelectorAll('.game-image');
        gameImages.forEach(image => {
            image.addEventListener('mouseenter', handleMouseEnter);
            image.addEventListener('mousemove', handleMouseMove);
            image.addEventListener('mouseleave', handleMouseLeave);
        });
    }

    function handleMouseEnter(e) {
        e.target.classList.add('zoomed');
    }

    function handleMouseLeave(e) {
        e.target.classList.remove('zoomed');
        e.target.style.backgroundPosition = 'center';
    }

    function handleMouseMove(e) {
        const rect = e.target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const percentX = (x / rect.width) * 100;
        const percentY = (y / rect.height) * 100;

        e.target.style.backgroundPosition = `${percentX}% ${percentY}%`;
    }

    // --- INICIALIZAÇÃO E EVENTOS ---
    premiumLink.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Em breve: Planos e Vantagens Premium!');
        profileDropdown.classList.add("hidden");
    });

    profileBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        profileDropdown.classList.toggle("hidden");
    });

    window.addEventListener("click", () => {
        if (!profileDropdown.classList.contains("hidden")) {
            profileDropdown.classList.add("hidden");
        }
    });

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            document.querySelector(".filter-btn.active").classList.remove("active");
            button.classList.add("active");
            loadLibrary(button.dataset.console);
        });
    });

    closeDetailsBtn.addEventListener("click", hideGameDetails);
    closeEmulatorBtn.addEventListener("click", closeEmulator);

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            if (!detailsOverlay.classList.contains("hidden")) {
                hideGameDetails();
            } else if (!emulatorOverlay.classList.contains("hidden")) {
                closeEmulator();
            }
        }
    });

    // Simulação de status premium do usuário

    // profileBtn.classList.remove('no-premium');
    // profileBtn.classList.add('premium-silver');

    // profileBtn.classList.remove('no-premium');
    // profileBtn.classList.add('premium-gold');

    loadLibrary();
});