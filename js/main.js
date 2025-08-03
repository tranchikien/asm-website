// ===== GLOBAL VARIABLES =====
let currentView = 'grid'; // 'grid' or 'list'
let currentPage = 1;
const itemsPerPage = 12;

// ===== GAMES DATA =====
const gamesData = [
    {
        id: 1,
        name: "Cyberpunk 2077",
        description: "An open-world action RPG developed by CD Projekt Red. Set in Night City, a futuristic city full of violence and ambition.",
        price: 1200000,
        image: "images/cyberpunk-2077-he-lo-su-kien-cro-3340512c-image-578665117.jpg.webp",
        category: "RPG",
        platform: "Steam",
        isFeatured: true,
        isSale: true,
        sale: 30,
        sold: 1200,
        developer: "CD Projekt Red",
        publisher: "CD Projekt",
        releaseDate: "2020-12-10",
        size: "63 GB",
        configuration: "Intel Core i5-3570K / AMD FX-8310",
        screenshots: [
            "images/Cyberpunk_2077_box_art.jpg",
            "images/Cyberpunk_2077_gameplay.png",
        ]
    },
    {
        id: 2,
        name: "The Witcher 3: Wild Hunt",
        description: "An action RPG developed by CD Projekt Red. Play as Geralt of Rivia, a monster hunter on an epic journey.",
        price: 800000,
        image: "images/the-witcher-3-the-wild-hunt-review_wvw4.1024.webp",
        category: "RPG",
        platform: "Steam",
        isFeatured: true,
        isSale: true,
        sale: 50,
        sold: 950,
        developer: "CD Projekt Red",
        publisher: "CD Projekt",
        releaseDate: "2015-05-19",
        size: "50 GB",
        configuration: "Intel Core i5-2500K / AMD Phenom II X4 940",
        screenshots: [
            "images/8bfad8ae-5a24-4617-988e-ccafee83324f-1020x612.webp",
            "images/MV5BMjg3OTc3MTcxNl5BMl5BanBnXkFtZTgwMDg0Njk1NTM@._V1_.jpg",
        ]
    },
    {
        id: 3,
        name: "Red Dead Redemption 2",
        description: "An action-adventure game developed by Rockstar Games. Set in the American Wild West at the end of the 19th century.",
        price: 1500000,
        image: "images/RDR2476298253_Epic_Games_Wishlist_RDR2_2560x1440_V01-2560x1440-2a9ebe1f7ee202102555be202d5632ec.jpg",
        category: "Action",
        platform: "Steam",
        isFeatured: true,
        isSale: false,
        sale: 0,
        sold: 2000,
        developer: "Rockstar Games",
        publisher: "Rockstar Games",
        releaseDate: "2019-12-05",
        size: "150 GB",
        configuration: "Intel Core i5-2500K / AMD FX-6300",
        screenshots: [
            "images/download.jpg",
            "images/download (1).jpg",
        ]
    },
    {
        id: 4,
        name: "Grand Theft Auto V",
        description: "An action-adventure game developed by Rockstar Games. Engage in criminal activities in Los Santos.",
        price: 1000000,
        image: "images/130916121147-grand-theft-auto-v.jpg",
        category: "Action",
        platform: "Steam",
        isFeatured: false,
        isSale: true,
        sale: 20,
        sold: 3000,
        developer: "Rockstar Games",
        publisher: "Rockstar Games",
        releaseDate: "2015-04-14",
        size: "72 GB",
        configuration: "Intel Core 2 Quad CPU Q6600 / AMD Phenom 9850",
        screenshots: [
            "images/download (2).jpg",
            "images/download (3).jpg",
        ]
    },
    {
        id: 5,
        name: "FIFA 24",
        description: "A football sports game developed by EA Sports. Experience realistic football with improved graphics and gameplay.",
        price: 1800000,
        image: "images/ea-sports-fc-24-truoc-ngay-ra-mat-bia.jpg",
        category: "Sports",
        platform: "Origin",
        isFeatured: false,
        isSale: false,
        sale: 0,
        sold: 800,
        developer: "EA Sports",
        publisher: "Electronic Arts",
        releaseDate: "2023-09-29",
        size: "100 GB",
        configuration: "Intel Core i5-6600K / AMD Ryzen 5 1600",
        screenshots: [
            "images/download (4).jpg",
            "images/download (5).jpg",
        ]
    },
    {
        id: 6,
        name: "Call of Duty: Warzone",
        description: "A free-to-play battle royale FPS developed by Infinity Ward and Raven Software.",
        price: 0,
        image: "images/images.jpg",
        category: "FPS",
        platform: "Battle.net",
        isFeatured: false,
        developer: "Infinity Ward, Raven Software",
        publisher: "Activision",
        releaseDate: "2020-03-10",
        size: "175 GB",
        configuration: "Intel Core i3-4340 / AMD FX-6300",
        screenshots: [
            "images/download (6).jpg",
            "images/download (7).jpg",
        ]
    },
    {
        id: 7,
        name: "League of Legends",
        description: "A free-to-play MOBA developed by Riot Games. Players compete in 5v5 matches.",
        price: 0,
        image: "images/league-of-legends.webp",
        category: "MOBA",
        platform: "Riot Games",
        isFeatured: false,
        developer: "Riot Games",
        publisher: "Riot Games",
        releaseDate: "2009-10-27",
        size: "8 GB",
        configuration: "Intel Core i3-530 / AMD A6-3650",
        screenshots: [
            "images/download (8).jpg",
            "images/download (9).jpg",
        ]
    },
    {
        id: 8,
        name: "Minecraft",
        description: "A sandbox game developed by Mojang Studios. Players can build and explore a 3D world.",
        price: 500000,
        image: "images/minecraft-16789786596172117060425-0-0-393-750-crop-16939052207281820601075.webp",
        category: "Adventure",
        platform: "Minecraft Launcher",
        isFeatured: false,
        developer: "Mojang Studios",
        publisher: "Mojang Studios",
        releaseDate: "2011-11-18",
        size: "1 GB",
        configuration: "Intel Core i3-3210 / AMD A8-7600 APU",
        screenshots: [
            "images/download (10).jpg",
            "images/download (11).jpg",
        ]
    },
    {
        id: 9,
        name: "Fortnite",
        description: "A free-to-play battle royale game developed by Epic Games. Players compete to be the last one standing.",
        price: 0,
        image: "images/FNECO_36-10_ForbiddenFruit_EGS_Launcher_KeyArt_Blade_2560x1440_2560x1440-abce17aa0386b48069aa42c1ebf7b864.jpg",
        category: "Battle Royale",
        platform: "Epic Games",
        isFeatured: false,
        developer: "Epic Games",
        publisher: "Epic Games",
        releaseDate: "2017-07-25",
        size: "30 GB",
        configuration: "Intel Core i3-3225 / AMD A8-7600",
        screenshots: [
            "images/download (12).jpg",
            "images/download (13).jpg",
        ]
    },
    {
        id: 10,
        name: "Valorant",
        description: "A tactical 5v5 FPS developed by Riot Games. Combines precise shooting with unique abilities.",
        price: 0,
        image: "images/EGS_VALORANT_RiotGames_S1_2560x1440-7d279548324d3a3cbef40e1dc7e84994.webp",
        category: "FPS",
        platform: "Riot Games",
        isFeatured: false,
        developer: "Riot Games",
        publisher: "Riot Games",
        releaseDate: "2020-06-02",
        size: "15 GB",
        configuration: "Intel Core i3-370M / AMD A6-3620",
        screenshots: [
            "images/download (15).jpg",
            "images/download (14).jpg",
        ]
    },
    {
        id: 11,
        name: "Among Us",
        description: "A social game developed by InnerSloth. Players participate in tasks or pretend to be a traitor.",
        price: 150000,
        image: "images/758ab0b61205081da2466386940752c70e0e5ea43bd39e8b9b13eaa455c69b7e.avif",
        category: "Puzzle",
        platform: "Steam",
        isFeatured: false,
        developer: "InnerSloth",
        publisher: "InnerSloth",
        releaseDate: "2018-06-15",
        size: "250 MB",
        configuration: "Intel Pentium 4 / AMD equivalent",
        screenshots: [
            "images/download (17).jpg",
            "images/download (16).jpg",
        ]
    },
    {
        id: 12,
        name: "Fall Guys",
        description: "A party battle royale game developed by Mediatonic. Players participate in fun challenges.",
        price: 0,
        image: "images/download (19).jpg",
        category: "Puzzle",
        platform: "Epic Games",
        isFeatured: false,
        developer: "Mediatonic",
        publisher: "Devolver Digital",
        releaseDate: "2020-08-04",
        size: "2 GB",
        configuration: "Intel Core i5-2300 / AMD FX-6300",
        screenshots: [
            "images/download (18).jpg",
            "images/download (20).jpg",
        ]
    },
    {
        id: 13,
        name: "Elden Ring",
        description: "Elden Ring is an open-world action RPG with a challenging gameplay and mysterious story.",
        price: 1450000,
        image: "images/download (21).jpg",
        banner: "images/download (23).jpg",
        category: "RPG",
        platform: "Steam",
        isFeatured: true,
        developer: "FromSoftware",
        publisher: "Bandai Namco",
        releaseDate: "2022-02-25",
        size: "60 GB",
        configuration: "Intel Core i5-8400 / AMD Ryzen 3 3300X",
        screenshots: [
            "images/download (22).jpg",
            "images/download (23).jpg",
        ]
    },
    {
        id: 14,
        name: "Horizon Forbidden West",
        description: "Horizon Forbidden West is an open-world action RPG with a large and dynamic world.",
        price: 1200000,
        image: "images/723406-horizon-forbidden-west-le-jeu-s-expose-dans-une-galerie-ephemere-dans-le-metro-parisien.jpg",
        banner: "images/download (24).jpg",
        category: "Adventure",
        platform: "Steam",
        isFeatured: true,
        developer: "Guerrilla Games",
        publisher: "Sony Interactive Entertainment",
        releaseDate: "2022-08-18",
        size: "90 GB",
        configuration: "Intel Core i7-4770K / AMD Ryzen 5 1500X",
        screenshots: [
            "images/capsule_616x353.jpg",
            "images/download (24).jpg",
        ]
    },
    {
        id: 15,
        name: "God of War Ragnarök",
        description: "God of War Ragnarök continues Kratos and Atreus' journey in Norse mythology.",
        price: 1350000,
        image: "images/capsule_616x353 (1).jpg",
        banner: "images/download (25).jpg",
        category: "Action",
        platform: "Steam",
        isFeatured: true,
        developer: "Santa Monica Studio",
        publisher: "Sony Interactive Entertainment",
        releaseDate: "2022-11-09",
        size: "80 GB",
        configuration: "Intel Core i5-6600K / AMD Ryzen 5 2400G",
        screenshots: [
            "images/download (25).jpg",
            "images/download (26).jpg",
        ]
    },
    {
        id: 16,
        name: "Diablo IV",
        description: "Diablo IV is an open-world action RPG with a dark and engaging combat system.",
        price: 1300000,
        image: "images/images (1).jpg",
        banner: "images/images (2).jpg",
        category: "RPG",
        platform: "Battle.net",
        isFeatured: false,
        developer: "Blizzard Entertainment",
        publisher: "Blizzard Entertainment",
        releaseDate: "2023-06-06",
        size: "90 GB",
        configuration: "Intel Core i5-2500K / AMD FX-8100",
        screenshots: [
            "images/images (2).jpg",
            "images/images (3).jpg",
        ]
    },
    {
        id: 17,
        name: "PUBG: Battlegrounds",
        description: "PUBG is a famous battle royale game with an engaging survival gameplay.",
        price: 0,
        image: "images/PUBG_BG_EGS@1920x1080.jpg",
        banner: "images/pubg_2_1280x720-800-resize.jpg",
        category: "Battle Royale",
        platform: "Steam",
        isFeatured: false,
        developer: "KRAFTON",
        publisher: "KRAFTON",
        releaseDate: "2017-12-20",
        size: "40 GB",
        configuration: "Intel Core i5-4430 / AMD FX-6300",
        screenshots: [
            "images/download (27).jpg",
            "images/pubg_2_1280x720-800-resize.jpg",
        ]
    },
    {
        id: 18,
        name: "Đấu Trường Chân Lý Mobile",
        description: "Đấu Trường Chân Lý là game chiến thuật theo lượt thuộc vũ trụ Liên Minh Huyền Thoại.",
        price: 50000,
        image: "images/dau-truong-chan-ly-mobile-1.jpg",
        banner: "images/download (29).jpg",
        category: "Strategy",
        platform: "Mobile",
        isFeatured: false,
        developer: "Riot Games",
        publisher: "Riot Games",
        releaseDate: "2020-03-19",
        size: "2 GB",
        configuration: "Android 5.0+, iOS 10+",
        screenshots: [
            "images/download (28).jpg",
            "images/download (29).jpg",
        ]
    },
    {
        id: 22,
        name: "Resident Evil Village",
        description: "Resident Evil Village is the next installment in the famous survival horror series with a rural setting.",
        price: 400000,
        image: "images/1605_ResidentEvilVillage.jpg",
        banner: "images/1605_ResidentEvilVillage.jpg",
        category: "Horror",
        platform: "Battle.net",
        isFeatured: false,
        developer: "Capcom",
        publisher: "Capcom",
        releaseDate: "2021-05-07",
        size: "35 GB",
        configuration: "Intel Core i5-7500 / AMD Ryzen 3 1200",
        screenshots: [
            "images/download (30).jpg",
            "images/download (31).jpg",
        ]
    },
    {
        id: 23,
        name: "Forza Horizon 5",
        description: "Forza Horizon 5 is an open-world racing game with stunning graphics and hundreds of cars.",
        price: 1200000,
        image: "images/apps.33953.13806078025361171.9723cf5e-1e29-4d9d-ad0a-cc37a95bb75d.jpg",
        banner: "images/apps.33953.13806078025361171.9723cf5e-1e29-4d9d-ad0a-cc37a95bb75d.jpg",
        category: "Racing",
        platform: "PC, Xbox",
        isFeatured: false,
        developer: "Playground Games",
        publisher: "Xbox Game Studios",
        releaseDate: "2021-11-09",
        size: "110 GB",
        configuration: "Intel i5-4460 / AMD Ryzen 3 1200",
        screenshots: [
            "images/forza-horizon-5-for-xbox-series-s_k5zc.1920.webp",
            "images/download (32).jpg",
        ]
    },
    {
        id: 24,
        name: "The Sims 4",
        description: "The Sims 4 is a famous life simulation game, where you can build and control the lives of Sims.",
        price: 600000,
        image: "images/capsule_616x353 (2).jpg",
        banner: "images/capsule_616x353 (2).jpg",
        category: "Simulation",
        platform: "PC",
        isFeatured: false,
        developer: "Maxis",
        publisher: "Electronic Arts",
        releaseDate: "2014-09-02",
        size: "18 GB",
        configuration: "Intel Core i3-3220 / AMD Athlon 64 X2 6400+",
        screenshots: [
            "images/ss_2fc938d99a1e87893852cb2d2113478190607941.1920x1080.jpg",
            "images/images (4).jpg",
        ]
    },
    {
        id: 25,
        name: "Candy Crush Saga",
        description: "Candy Crush Saga is a famous puzzle game with thousands of fun levels.",
        price: 0,
        image: "images/candy-crush-saga-1.jpg",
        banner: "images/candy-crush-saga-1.jpg",
        category: "Puzzle",
        platform: "Mobile",
        isFeatured: false,
        developer: "King",
        publisher: "King",
        releaseDate: "2012-04-12",
        size: "200 MB",
        configuration: "Android/iOS",
        screenshots: [
            "images/download (33).jpg",
            "images/images (5).jpg",
        ]
    },
    {
        id: 26,
        name: "Spider-Man Remastered",
        description: "An action-adventure game with Spider-Man, beautiful graphics, and an engaging story.",
        price: 990000,
        image: "images/header.jpg",
        category: "Action",
        platform: "Steam",
        isSale: true,
        sale: 30,
        developer: "Insomniac Games",
        publisher: "Sony",
        releaseDate: "2022-08-12",
        size: "70 GB",
        configuration: "Intel Core i5-4670 / AMD Ryzen 5 1600",
        screenshots: [
            "images/download (34).jpg",
            "images/download (35).jpg",
        ]
    },
    {
        id: 27,
        name: "Street Fighter 6",
        description: "A famous fighting game with new characters, improved graphics, and gameplay.",
        price: 850000,
        image: "images/download (36).jpg",
        category: "Fighting",
        platform: "Steam",
        isSale: true,
        sale: 20,
        developer: "Capcom",
        publisher: "Capcom",
        releaseDate: "2023-06-02",
        size: "60 GB",
        configuration: "Intel Core i5-7500 / AMD Ryzen 3 1200",
        screenshots: [
            "images/mv_edition_bg.jpg",
            "images/download (37).jpg",
        ]
    },
    {
        id: 28,
        name: "Final Fantasy XVI",
        description: "A Japanese RPG with a deep story, beautiful graphics, and a new combat system.",
        price: 1450000,
        image: "images/final-fantasy-xvi-3285.webp",
        category: "RPG",
        platform: "PlayStation",
        isHot: true,
        developer: "Square Enix",
        publisher: "Square Enix",
        releaseDate: "2023-06-22",
        size: "90 GB",
        configuration: "PS5",
        screenshots: [
            "images/download (39).jpg",
            "images/download (38).jpg",
        ]
    },
    {
        id: 29,
        name: "Forza Motorsport",
        description: "A realistic car racing simulation game with hundreds of cars and famous tracks.",
        price: 1200000,
        image: "images/download (40).jpg",
        category: "Racing",
        platform: "Xbox",
        isHot: true,
        hotDeal: true,
        developer: "Turn 10 Studios",
        publisher: "Xbox Game Studios",
        releaseDate: "2023-10-10",
        size: "100 GB",
        configuration: "Xbox Series X|S",
        screenshots: [
            "images/download (41).jpg",
            "images/Forza-Motorsport-7.avif",
        ]
    },
    {
        id: 30,
        name: "Alan Wake II",
        description: "A survival horror game with a mysterious story, excellent graphics, and sound.",
        price: 1100000,
        image: "images/download (42).jpg",
        category: "Horror",
        platform: "Epic Games",
        comingSoon: true,
        developer: "Remedy Entertainment",
        publisher: "Epic Games",
        releaseDate: "2024-10-17",
        size: "80 GB",
        configuration: "Intel Core i5-7600K / AMD Ryzen 5 1600X",
        screenshots: [
            "images/download (43).jpg",
            "images/download (44).jpg",
        ]
    },
    {
        id: 31,
        name: "Hollow Knight: Silksong",
        description: "A 2D action-adventure game with challenging gameplay and a large world.",
        price: 350000,
        image: "images/Hollow_Knight_Silksong_cover_art.jpg",
        category: "Adventure",
        platform: "Steam",
        comingSoon: true,
        developer: "Team Cherry",
        publisher: "Team Cherry",
        releaseDate: "2024-12-01",
        size: "10 GB",
        configuration: "Intel Core i3-2100 / AMD FX-4300",
        screenshots: [
            "images/download (45).jpg",
            "images/hornet-fighting-a-giant-robot-boss-in-hollow-knight-silksong.avif",
        ]
    },
    {
        id: 32,
        name: "Dead Space Remake",
        description: "A horror game with a modern and improved graphics and gameplay.",
        price: 1250000,
        image: "images/download (46).jpg",
        category: "Horror",
        platform: "Origin",
        hotDeal: true,
        sale: 40,
        developer: "Motive Studio",
        publisher: "Electronic Arts",
        releaseDate: "2023-01-27",
        size: "50 GB",
        configuration: "Intel Core i5-8600 / AMD Ryzen 5 2600X",
        screenshots: [
            "images/download (47).jpg",
            "images/dead-space-remake-review.jpg",
        ]
    },
    {
        id: 33,
        name: "The Legend of Zelda: Tears of the Kingdom",
        description: "An open-world adventure game with creative gameplay and an engaging story.",
        price: 1400000,
        image: "images/zelda-16800558113671797143763.webp",
        category: "Adventure",
        platform: "Nintendo Switch",
        isFeatured: true,
        developer: "Nintendo",
        publisher: "Nintendo",
        releaseDate: "2023-05-12",
        size: "18 GB",
        configuration: "Nintendo Switch",
        screenshots: [
            "images/2_527e7d29c26844f2815db56d5b1d7779.jpg",
            "images/download (48).jpg"
        ]
    }
];

// ===== PAGE NAVIGATION FUNCTIONS =====

function showHomePage() {
    hideAllPages();
    document.getElementById('home').style.display = 'block';
    updateBreadcrumb('Home');
    renderParallaxHeroBanner();
    populateFeaturedGames();
}

function showAllGames() {
    hideAllPages();
    document.getElementById('games').style.display = 'block';
    updateBreadcrumb('All Games');
    loadGames();
}

function showSaleGames() {
    hideAllPages();
    document.getElementById('games').style.display = 'block';
    updateBreadcrumb('Sale Games');
    filterGamesBySale();
}

function showContactPage() {
    hideAllPages();
    document.getElementById('contact').style.display = 'block';
    updateBreadcrumb('Contact');
}

function showProfilePage() {
    if (!isLoggedIn()) {
        showToast('Please login to view profile', 'error');
        openModal('loginModal');
        return;
    }
    
    hideAllPages();
    document.getElementById('profile').style.display = 'block';
    updateBreadcrumb('Profile');
    loadUserProfile();
}

function showWishlist() {
    if (!isLoggedIn()) {
        showToast('Please login to view wishlist', 'error');
        openModal('loginModal');
        return;
    }
    
    hideAllPages();
    document.getElementById('wishlist').style.display = 'block';
    updateBreadcrumb('Wishlist');
    loadWishlist();
}

function showOrderHistory() {
    if (!isLoggedIn()) {
        showToast('Please login to view order history', 'error');
        openModal('loginModal');
        return;
    }
    
    hideAllPages();
    document.getElementById('order-history-page').style.display = 'block';
    updateBreadcrumb('Order History');
    loadOrderHistory();
}

function showCartPage() {
    hideAllPages();
    document.getElementById('cart-page').style.display = 'block';
    updateBreadcrumb('Shopping Cart');
    updateCartPage();
}

function hideAllPages() {
    const pages = ['home', 'games', 'contact', 'profile', 'wishlist', 'order-history-page', 'cart-page'];
    pages.forEach(pageId => {
        const page = document.getElementById(pageId);
        if (page) page.style.display = 'none';
    });
}

function updateBreadcrumb(page) {
    const breadcrumb = document.getElementById('breadcrumb-nav');
    if (breadcrumb) {
        breadcrumb.innerHTML = `
            <li class="breadcrumb-item">
                <a href="#" class="text-orange text-decoration-none" onclick="showHomePage()">
                    <i class="fas fa-home me-1"></i>Home
                </a>
            </li>
            <li class="breadcrumb-item active" aria-current="page">${page}</li>
        `;
    }
}

// ===== UTILITY FUNCTIONS =====

function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}

function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        // Create toast container if it doesn't exist
        const container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container position-fixed top-0 end-0 p-3';
        container.style.zIndex = '9999';
        document.body.appendChild(container);
    }

    const toastId = 'toast-' + Date.now();
    const toastHtml = `
        <div id="${toastId}" class="toast align-items-center text-white bg-${type} border-0" role="alert">
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>
    `;

    toastContainer.insertAdjacentHTML('beforeend', toastHtml);
    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement);
    toast.show();

    // Auto remove after 5 seconds
    setTimeout(() => {
        removeToast(toastId);
    }, 5000);
}

function removeToast(toastId) {
    const toast = document.getElementById(toastId);
    if (toast) {
        toast.remove();
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function openModal(modalId) {
    const modal = new bootstrap.Modal(document.getElementById(modalId));
    modal.show();
}

// ===== ANIMATION FUNCTIONS =====

function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function initializeAnimations() {
    // Intersection Observer for fade-in animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, {
        threshold: 0.1
    });

    // Observe elements with animation classes
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

// ===== INITIALIZATION FUNCTIONS =====

async function initializePage() {
    console.log('🚀 Initializing page...');
    
    // Initialize animations
    initializeSmoothScrolling();
    initializeAnimations();
    
    // Check login status
    await checkLoginStatus();
    
    // Load initial content
    showHomePage();
    
    console.log('✅ Page initialization completed');
}

async function checkLoginStatus() {
    const user = getCurrentUser();
    const token = localStorage.getItem('authToken');
    
    if (user && token) {
        try {
            // Validate session with server
            const isValid = await validateSession();
            if (!isValid) {
                console.log('❌ Session validation failed');
                return;
            }
        } catch (error) {
            console.error('Session validation error:', error);
        }
    }
    
    // Update UI based on login status
    updateUserDropdown();
}

// ===== PROFILE FUNCTIONS =====

async function loadUserProfile() {
    if (!isLoggedIn()) {
        showToast('Please login to view profile', 'error');
        return;
    }
    
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const user = await response.json();
            displayUserProfile(user);
        } else {
            showToast('Failed to load profile', 'error');
        }
    } catch (error) {
        console.error('Error loading profile:', error);
        showToast('Error loading profile', 'error');
    }
}

function displayUserProfile(user) {
    const profileEl = document.getElementById('profile');
    if (!profileEl) return;
    
    profileEl.innerHTML = `
        <div class="container py-5">
            <div class="row">
                <div class="col-md-8 mx-auto">
                    <div class="card bg-dark border-secondary">
                        <div class="card-header">
                            <h4><i class="fas fa-user me-2"></i>User Profile</h4>
                        </div>
                        <div class="card-body">
                            <form id="profileForm">
                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label for="profileFullname" class="form-label">Full Name</label>
                                        <input type="text" class="form-control bg-dark text-light border-secondary" 
                                               id="profileFullname" value="${user.fullname || ''}" required>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label for="profileEmail" class="form-label">Email</label>
                                        <input type="email" class="form-control bg-dark text-light border-secondary" 
                                               id="profileEmail" value="${user.email || ''}" readonly>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label for="profilePhone" class="form-label">Phone</label>
                                        <input type="tel" class="form-control bg-dark text-light border-secondary" 
                                               id="profilePhone" value="${user.phone || ''}">
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label for="profileBirthday" class="form-label">Birthday</label>
                                        <input type="date" class="form-control bg-dark text-light border-secondary" 
                                               id="profileBirthday" value="${user.birthday ? user.birthday.split('T')[0] : ''}">
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label for="profileAddress" class="form-label">Address</label>
                                    <textarea class="form-control bg-dark text-light border-secondary" 
                                              id="profileAddress" rows="3">${user.address || ''}</textarea>
                                </div>
                                <div class="mb-3">
                                    <label for="profileLocation" class="form-label">Location</label>
                                    <input type="text" class="form-control bg-dark text-light border-secondary" 
                                           id="profileLocation" value="${user.location || ''}">
                                </div>
                                <div class="text-end">
                                    <button type="button" class="btn btn-orange" onclick="updateProfile()">
                                        <i class="fas fa-save me-2"></i>Update Profile
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

async function updateProfile() {
    if (!isLoggedIn()) {
        showToast('Please login to update profile', 'error');
        return;
    }
    
    const profileData = {
        fullname: document.getElementById('profileFullname').value,
        phone: document.getElementById('profilePhone').value,
        birthday: document.getElementById('profileBirthday').value,
        address: document.getElementById('profileAddress').value,
        location: document.getElementById('profileLocation').value
    };
    
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(profileData)
        });
        
        if (response.ok) {
            const result = await response.json();
            showToast('Profile updated successfully', 'success');
            
            // Update local storage
            updateUserProfile(result.user);
        } else {
            showToast('Failed to update profile', 'error');
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        showToast('Error updating profile', 'error');
    }
}

// ===== WISHLIST FUNCTIONS =====

function loadWishlist() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    displayWishlist(wishlist);
}

function displayWishlist(wishlist) {
    const wishlistEl = document.getElementById('wishlist');
    if (!wishlistEl) return;
    
    if (wishlist.length === 0) {
        wishlistEl.innerHTML = `
            <div class="container py-5">
                <div class="text-center">
                    <i class="fas fa-heart text-muted fa-3x mb-3"></i>
                    <h5 class="text-muted">Your wishlist is empty</h5>
                    <p class="text-muted">Add some games to your wishlist!</p>
                    <button class="btn btn-orange" onclick="showAllGames()">
                        <i class="fas fa-gamepad me-2"></i>Browse Games
                    </button>
                </div>
            </div>
        `;
        return;
    }
    
    let html = `
        <div class="container py-5">
            <h3 class="mb-4"><i class="fas fa-heart text-danger me-2"></i>My Wishlist</h3>
            <div class="row">
    `;
    
    wishlist.forEach(game => {
        html += `
            <div class="col-md-4 mb-4">
                <div class="card bg-dark border-secondary h-100">
                    <img src="${game.image}" class="card-img-top" alt="${game.name}" style="height: 200px; object-fit: cover;">
                    <div class="card-body">
                        <h6 class="card-title">${game.name}</h6>
                        <p class="card-text text-muted">${game.category || 'N/A'}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="price-info">
                                ${game.isSale ? `
                                    <div class="text-decoration-line-through text-muted">${formatPrice(game.originalPrice)}</div>
                                    <div class="text-orange fw-bold">${formatPrice(game.price)}</div>
                                    <span class="badge bg-danger">-${game.sale}%</span>
                                ` : `
                                    <div class="fw-bold">${formatPrice(game.price)}</div>
                                `}
                            </div>
                            <div class="btn-group">
                                <button class="btn btn-sm btn-orange" onclick="addToCart(${JSON.stringify(game).replace(/"/g, '&quot;')})">
                                    <i class="fas fa-cart-plus"></i>
                                </button>
                                <button class="btn btn-sm btn-outline-danger" onclick="removeFromWishlist('${game.id}')">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += `
            </div>
        </div>
    `;
    
    wishlistEl.innerHTML = html;
}

function addToWishlist(game) {
    if (!isLoggedIn()) {
        showToast('Please login to add to wishlist', 'error');
        openModal('loginModal');
        return;
    }
    
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const existingIndex = wishlist.findIndex(item => item.id === game.id);
    
    if (existingIndex === -1) {
        wishlist.push(game);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        showToast('Added to wishlist', 'success');
    } else {
        showToast('Already in wishlist', 'info');
    }
}

function removeFromWishlist(gameId) {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const updatedWishlist = wishlist.filter(item => item.id !== gameId);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    showToast('Removed from wishlist', 'success');
    loadWishlist();
}

// ===== PARALLAX HERO BANNER =====

function renderParallaxHeroBanner() {
    const bannerEl = document.getElementById('parallaxHeroBanner');
    if (!bannerEl) return;

    const slides = [
        {
            image: 'images/header.jpg',
            title: 'Welcome to KIENSTORE',
            subtitle: 'Your Ultimate Gaming Destination',
            description: 'Discover the latest and greatest games across all platforms'
        },
        {
            image: 'images/cyberpunk-2077-he-lo-su-kien-cro-3340512c-image-578665117.jpg.webp',
            title: 'Cyberpunk 2077',
            subtitle: 'Experience the Future',
            description: 'Immerse yourself in the neon-lit world of Night City'
        },
        {
            image: 'images/zelda-16800558113671797143763.webp',
            title: 'The Legend of Zelda',
            subtitle: 'Adventure Awaits',
            description: 'Embark on an epic journey through Hyrule'
        }
    ];

    let current = 0;
    let autoPlayInterval;

    function renderSlide(idx) {
        const slide = slides[idx];
        bannerEl.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('${slide.image}')`;
        
        const content = bannerEl.querySelector('.hero-content') || document.createElement('div');
        content.className = 'hero-content text-center text-white position-absolute top-50 start-50 translate-middle w-100';
        content.innerHTML = `
            <div class="container">
                <h1 class="display-4 fw-bold mb-3 animate__animated animate__fadeInDown">${slide.title}</h1>
                <h3 class="mb-3 animate__animated animate__fadeInUp animate__delay-1s">${slide.subtitle}</h3>
                <p class="lead mb-4 animate__animated animate__fadeInUp animate__delay-2s">${slide.description}</p>
                <button class="btn btn-orange btn-lg animate__animated animate__fadeInUp animate__delay-3s" onclick="showAllGames()">
                    <i class="fas fa-gamepad me-2"></i>Explore Games
                </button>
            </div>
        `;
        
        if (!bannerEl.querySelector('.hero-content')) {
            bannerEl.appendChild(content);
        }
    }

    function goTo(idx) {
        current = (idx + slides.length) % slides.length;
        renderSlide(current);
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    function startAuto() {
        autoPlayInterval = setInterval(next, 5000);
    }

    function stopAuto() {
        clearInterval(autoPlayInterval);
    }

    function handleParallax(e) {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        bannerEl.style.transform = `translateY(${rate}px)`;
    }

    // Initialize
    renderSlide(0);
    startAuto();

    // Event listeners
    bannerEl.addEventListener('mouseenter', stopAuto);
    bannerEl.addEventListener('mouseleave', startAuto);

    // Touch events for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    bannerEl.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });

    bannerEl.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                next();
            } else {
                prev();
            }
        }
    }

    // Parallax effect
    window.addEventListener('scroll', handleParallax);
}

// ===== FEATURED GAMES =====

function populateFeaturedGames() {
    const featuredContainer = document.getElementById('featured-games');
    if (!featuredContainer) return;

    const featuredGames = gamesData.slice(0, 6); // Show first 6 games
    let html = '';

    featuredGames.forEach(game => {
        html += createEnhancedGameCard(game);
    });

    featuredContainer.innerHTML = html;
}

function createEnhancedGameCard(game) {
    const saleBadge = game.isSale ? `<span class="badge bg-danger position-absolute top-0 start-0 m-2">-${game.sale}%</span>` : '';
    const priceDisplay = game.isSale ? 
        `<div class="text-decoration-line-through text-muted">${formatPrice(game.originalPrice)}</div>
         <div class="text-orange fw-bold">${formatPrice(game.price)}</div>` : 
        `<div class="fw-bold">${formatPrice(game.price)}</div>`;

    return `
        <div class="col-md-4 mb-4">
            <div class="card bg-dark border-secondary h-100 game-card animate-on-scroll">
                ${saleBadge}
                <img src="${game.image}" class="card-img-top" alt="${game.name}" style="height: 200px; object-fit: cover;">
                <div class="card-body d-flex flex-column">
                    <h6 class="card-title">${game.name}</h6>
                    <p class="card-text text-muted flex-grow-1">${game.category || 'N/A'}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="price-info">
                            ${priceDisplay}
                        </div>
                        <div class="btn-group">
                            <button class="btn btn-sm btn-orange" onclick="addToCart(${JSON.stringify(game).replace(/"/g, '&quot;')})">
                                <i class="fas fa-cart-plus"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger" onclick="addToWishlist(${JSON.stringify(game).replace(/"/g, '&quot;')})">
                                <i class="fas fa-heart"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ===== CART DROPDOWN =====

function renderCartDropdown() {
    const cartItems = document.getElementById('cart-dropdown-items');
    const cartTotal = document.getElementById('cart-dropdown-total');
    
    if (!cartItems || !cartTotal) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="text-center py-3"><i class="fas fa-shopping-cart text-muted"></i><p class="text-muted mb-0">Cart is empty</p></div>';
        cartTotal.textContent = '0 VNĐ';
        return;
    }
    
    let html = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        html += `
            <div class="cart-dropdown-item d-flex align-items-center p-2">
                <img src="${item.image}" alt="${item.name}" class="me-2" style="width: 40px; height: 40px; object-fit: cover;">
                <div class="flex-grow-1">
                    <div class="fw-bold">${item.name}</div>
                    <div class="text-muted">${formatPrice(item.price)} x ${item.quantity}</div>
                </div>
                <button class="btn btn-sm btn-outline-danger" onclick="removeFromCart('${item.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    });
    
    cartItems.innerHTML = html;
    cartTotal.textContent = formatPrice(total);
}

// ===== INITIALIZATION =====

// Call this after DOMContentLoaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderParallaxHeroBanner);
} else {
    renderParallaxHeroBanner();
}

// Initialize page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    
    // Force update admin menu after a short delay to ensure DOM is ready
    setTimeout(() => {
        if (typeof updateAdminMenu === 'function') {
            updateAdminMenu();
        }
    }, 1000);
}); 

// Hiển thị dropdown tài khoản khi đăng nhập
function updateAccountDropdown() {
    const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
    const accountGroup = document.getElementById('account-dropdown-group');
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    if (user) {
        if (accountGroup) accountGroup.style.display = '';
        if (loginBtn) loginBtn.style.display = 'none';
        if (registerBtn) registerBtn.style.display = 'none';
    } else {
        if (accountGroup) accountGroup.style.display = 'none';
        if (loginBtn) loginBtn.style.display = '';
        if (registerBtn) registerBtn.style.display = '';
    }
}

// Gọi sau khi đăng nhập/đăng xuất
if (typeof updateAccountDropdown === 'function') {
    document.addEventListener('DOMContentLoaded', updateAccountDropdown);
}

// Call when cart dropdown is opened
const cartDropdownBtn = document.getElementById('cartDropdown');
if (cartDropdownBtn) {
    cartDropdownBtn.addEventListener('click', renderCartDropdown);
}

// Ensure cart dropdown is updated when items are added/removed
const oldAddToCart = typeof addToCart === 'function' ? addToCart : null;
window.addToCart = function() {
    if (oldAddToCart) oldAddToCart.apply(this, arguments);
    renderCartDropdown();
};

const oldRemoveFromCart = typeof removeFromCart === 'function' ? removeFromCart : null;
window.removeFromCart = function() {
    if (oldRemoveFromCart) oldRemoveFromCart.apply(this, arguments);
    renderCartDropdown();
};

const oldUpdateCartItemQuantity = typeof updateCartItemQuantity === 'function' ? updateCartItemQuantity : null;
window.updateCartItemQuantity = function() {
    if (oldUpdateCartItemQuantity) oldUpdateCartItemQuantity.apply(this, arguments);
    renderCartDropdown();
};

// Thêm function để mở Admin Panel
function openAdminPanel() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.isAdmin) {
        showToast('Access denied. Admin privileges required.', 'error');
        return;
    }
    
    const adminPanelModal = new bootstrap.Modal(document.getElementById('adminPanelModal'));
    adminPanelModal.show();
    loadAdminDashboard(); // Load dữ liệu dashboard
}

// Thêm function kiểm tra và hiển thị Admin Menu khi load page
function checkAndShowAdminMenu() {
    const user = JSON.parse(localStorage.getItem('user'));
    const adminMenu = document.getElementById('admin-menu');
    
    if (user && user.isAdmin && adminMenu) {
        adminMenu.style.display = 'block';
    } else if (adminMenu) {
        adminMenu.style.display = 'none';
    }
}

// Thêm vào initialization code
document.addEventListener('DOMContentLoaded', () => {
    checkAndShowAdminMenu();
});