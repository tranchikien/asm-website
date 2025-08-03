// ===== GAME FUNCTIONS =====

/**
 * Get games data from main.js or load from API
 */
function getGamesData() {
    // Try to get from main.js first
    if (typeof gamesData !== 'undefined' && gamesData && gamesData.length > 0) {
        console.log('🎮 Using gamesData from main.js:', gamesData.length, 'games');
        return gamesData;
    }
    
    // Fallback to default games data
    const defaultGames = [
        {
            id: 1,
            name: "Cyberpunk 2077",
            description: "An open-world action RPG developed by CD Projekt Red. Set in Night City, a futuristic city full of violence and ambition.",
            price: 1200000,
            originalPrice: 1200000,
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
            originalPrice: 800000,
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
            originalPrice: 1500000,
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
            originalPrice: 1000000,
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
            originalPrice: 1800000,
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
            originalPrice: 0,
            image: "images/images.jpg",
            category: "FPS",
            platform: "Battle.net",
            isFeatured: false,
            isSale: false,
            sale: 0,
            sold: 5000,
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
            originalPrice: 0,
            image: "images/league-of-legends.webp",
            category: "MOBA",
            platform: "Riot Games",
            isFeatured: false,
            isSale: false,
            sale: 0,
            sold: 10000,
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
            originalPrice: 500000,
            image: "images/minecraft-16789786596172117060425-0-0-393-750-crop-16939052207281820601075.webp",
            category: "Adventure",
            platform: "Minecraft Launcher",
            isFeatured: false,
            isSale: false,
            sale: 0,
            sold: 8000,
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
            originalPrice: 0,
            image: "images/FNECO_36-10_ForbiddenFruit_EGS_Launcher_KeyArt_Blade_2560x1440_2560x1440-abce17aa0386b48069aa42c1ebf7b864.jpg",
            category: "Battle Royale",
            platform: "Epic Games",
            isFeatured: false,
            isSale: false,
            sale: 0,
            sold: 15000,
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
            originalPrice: 0,
            image: "images/EGS_VALORANT_RiotGames_S1_2560x1440-7d279548324d3a3cbef40e1dc7e84994.webp",
            category: "FPS",
            platform: "Riot Games",
            isFeatured: false,
            isSale: false,
            sale: 0,
            sold: 12000,
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
            originalPrice: 150000,
            image: "images/758ab0b61205081da2466386940752c70e0e5ea43bd39e8b9b13eaa455c69b7e.avif",
            category: "Puzzle",
            platform: "Steam",
            isFeatured: false,
            isSale: false,
            sale: 0,
            sold: 3000,
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
            originalPrice: 0,
            image: "images/download (19).jpg",
            category: "Puzzle",
            platform: "Epic Games",
            isFeatured: false,
            isSale: false,
            sale: 0,
            sold: 5000,
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
            originalPrice: 1450000,
            image: "images/download (21).jpg",
            banner: "images/download (23).jpg",
            category: "RPG",
            platform: "Steam",
            isFeatured: true,
            isSale: false,
            sale: 0,
            sold: 2500,
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
            originalPrice: 1200000,
            image: "images/723406-horizon-forbidden-west-le-jeu-s-expose-dans-une-galerie-ephemere-dans-le-metro-parisien.jpg",
            banner: "images/download (24).jpg",
            category: "Adventure",
            platform: "Steam",
            isFeatured: true,
            isSale: false,
            sale: 0,
            sold: 1800,
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
            originalPrice: 1350000,
            image: "images/capsule_616x353 (1).jpg",
            banner: "images/download (25).jpg",
            category: "Action",
            platform: "Steam",
            isFeatured: true,
            isSale: false,
            sale: 0,
            sold: 2200,
            developer: "Santa Monica Studio",
            publisher: "Sony Interactive Entertainment",
            releaseDate: "2022-11-09",
            size: "120 GB",
            configuration: "Intel Core i5-6600K / AMD Ryzen 5 1600",
            screenshots: [
                "images/download (25).jpg",
                "images/download (26).jpg",
            ]
        },
        {
            id: 16,
            name: "Resident Evil Village",
            description: "A survival horror game developed by Capcom. Players navigate through a mysterious village.",
            price: 1100000,
            originalPrice: 1100000,
            image: "images/1605_ResidentEvilVillage.jpg",
            category: "Horror",
            platform: "Steam",
            isFeatured: false,
            isSale: true,
            sale: 25,
            sold: 1500,
            developer: "Capcom",
            publisher: "Capcom",
            releaseDate: "2021-05-07",
            size: "27 GB",
            configuration: "Intel Core i5-7500 / AMD Ryzen 3 1200",
            screenshots: [
                "images/download (27).jpg",
                "images/download (28).jpg",
            ]
        },
        {
            id: 17,
            name: "PUBG: Battlegrounds",
            description: "A battle royale game where 100 players fight to be the last one standing.",
            price: 0,
            originalPrice: 0,
            image: "images/pubg_2_1280x720-800-resize.jpg",
            category: "Battle Royale",
            platform: "Steam",
            isFeatured: false,
            isSale: false,
            sale: 0,
            sold: 20000,
            developer: "PUBG Studios",
            publisher: "Krafton",
            releaseDate: "2017-12-21",
            size: "40 GB",
            configuration: "Intel Core i5-4430 / AMD FX-6300",
            screenshots: [
                "images/PUBG_BG_EGS@1920x1080.jpg",
                "images/download (29).jpg",
            ]
        },
        {
            id: 18,
            name: "Candy Crush Saga",
            description: "A match-three puzzle game developed by King. Players match candies to progress through levels.",
            price: 0,
            originalPrice: 0,
            image: "images/candy-crush-saga-1.jpg",
            category: "Puzzle",
            platform: "Mobile",
            isFeatured: false,
            isSale: false,
            sale: 0,
            sold: 50000,
            developer: "King",
            publisher: "King",
            releaseDate: "2012-04-12",
            size: "100 MB",
            configuration: "Android 4.1+ / iOS 8.0+",
            screenshots: [
                "images/download (30).jpg",
                "images/download (31).jpg",
            ]
        }
    ];
    
    console.log('🎮 Using default games data:', defaultGames.length, 'games');
    return defaultGames;
}

/**
 * Render danh sách game ra grid
 */
function renderGames(games = null) {
    const grid = document.getElementById('games-grid');
    if (!grid) {
        console.log('❌ Games grid element not found');
        return;
    }
    
    // Get games data if not provided
    if (!games) {
        games = getGamesData();
    }
    
    console.log('🎮 Rendering games:', games);
    
    grid.innerHTML = '';
    if (!games || games.length === 0) {
        grid.innerHTML = `<div class="col-12 text-center text-muted py-5">Không tìm thấy game phù hợp.</div>`;
        return;
    }
    
    games.forEach(game => {
        grid.innerHTML += createGameCard(game);
    });
    
    console.log('✅ Games rendered successfully');
}

/**
 * Hiển thị tất cả game
 */
function showAllGames() {
    console.log('🎮 Showing all games...');
    hideAllPages();
    
    const allGamesPage = document.getElementById('all-games');
    if (allGamesPage) {
        allGamesPage.style.display = 'block';
        console.log('✅ All games page displayed');
        
        const games = getGamesData();
        console.log('🎮 All Games Data:', games);
        renderGames(games);
        
        if (typeof updateBreadcrumb === 'function') {
            updateBreadcrumb('All Games');
        }
    } else {
        console.log('❌ All games page element not found');
    }
}

/**
 * Lọc game theo thể loại/nền tảng
 */
function applyFilters() {
    const category = document.getElementById('categoryFilter').value;
    const platform = document.getElementById('platformFilter').value;
    let filtered = gamesData;
    
    if (category) {
        filtered = filtered.filter(game => game.category === category);
    }
    if (platform) {
        filtered = filtered.filter(game => game.platform === platform);
    }
    
    renderGames(filtered);
}

/**
 * Tìm kiếm game
 */
function searchGames(event) {
    if (event) event.preventDefault();
    const keyword = document.getElementById('searchInput').value.trim().toLowerCase();
    if (!keyword) {
        renderGames();
        return;
    }
    const filtered = gamesData.filter(game =>
        game.name.toLowerCase().includes(keyword) ||
        game.description.toLowerCase().includes(keyword)
    );
    renderGames(filtered);
}

/**
 * Tạo card game
 */
function createGameCard(game, showFullCard = true) {
    const colClass = currentView === 'list' ? 'col-12' : 'col-lg-3 col-md-4 col-sm-6';
    
    // Tạo badges
    let badges = [];
    if (game.isSale && game.sale > 0) {
        badges.push(`<span class="card-badge badge-sale">-${game.sale}%</span>`);
    }
    badges.push(`<span class="badge bg-orange">${game.category}</span>`);
    
    // Hiển thị giá
    let priceDisplay = '';
    if (game.isSale && game.sale > 0) {
        const salePrice = game.price * (1 - game.sale / 100);
        priceDisplay = `
            <div class="price-section">
                <span class="price-old text-muted text-decoration-line-through" style="font-size: 0.9em;">${formatPrice(game.price)}</span>
                <span class="price text-orange fw-bold">${formatPrice(salePrice)}</span>
                <span class="badge bg-danger" style="font-size: 0.7em;">-${game.sale}%</span>
            </div>
        `;
    } else {
        priceDisplay = `
            <div class="price-section">
                <span class="price text-orange fw-bold">${formatPrice(game.price)}</span>
            </div>
        `;
    }

    return `
        <div class="${colClass} mb-4">
            <div class="game-card card-hover h-100">
                ${badges.join('')}
                <div class="card-image-container">
                    <img src="${game.image}" class="game-card-image" alt="${game.name}" onclick="showProductDetailPage(${game.id})">
                    <div class="card-overlay">
                        <div class="overlay-content">
                            <button class="btn btn-orange btn-sm mb-2" onclick="event.stopPropagation(); addToCart(${JSON.stringify(game).replace(/"/g, '&quot;')})">
                                <i class="fas fa-cart-plus me-1"></i>Add to Cart
                            </button>
                            <button class="btn btn-outline-light btn-sm" onclick="event.stopPropagation(); addToWishlist(${JSON.stringify(game).replace(/"/g, '&quot;')})">
                                <i class="fas fa-heart me-1"></i>Wishlist
                            </button>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <h5 class="card-title" onclick="showProductDetailPage(${game.id})" style="cursor: pointer;">${game.name}</h5>
                    <p class="card-text">${game.description.substring(0, 80)}...</p>
                    ${priceDisplay}
                </div>
            </div>
        </div>
    `;
}

/**
 * Hiển thị chi tiết sản phẩm
 */
function showProductDetailPage(gameId) {
    const game = gamesData.find(g => g.id === gameId);
    if (!game) {
        showToast('Game not found', 'error');
        return;
    }
    
    // Tạo modal chi tiết game
    const modalHtml = `
        <div class="modal fade" id="gameDetailModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content bg-dark text-light">
                    <div class="modal-header border-secondary">
                        <h5 class="modal-title">${game.name}</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-6">
                                <img src="${game.image}" class="img-fluid rounded" alt="${game.name}">
                            </div>
                            <div class="col-md-6">
                                <h4>${game.name}</h4>
                                <p class="text-muted">${game.description}</p>
                                <div class="mb-3">
                                    <strong>Category:</strong> ${game.category}<br>
                                    <strong>Platform:</strong> ${game.platform}<br>
                                    <strong>Developer:</strong> ${game.developer}<br>
                                    <strong>Publisher:</strong> ${game.publisher}<br>
                                    <strong>Release Date:</strong> ${game.releaseDate}<br>
                                    <strong>Size:</strong> ${game.size}
                                </div>
                                <div class="mb-3">
                                    ${game.isSale && game.sale > 0 ? `
                                        <div class="text-decoration-line-through text-muted">${formatPrice(game.price)}</div>
                                        <div class="text-orange fw-bold fs-4">${formatPrice(game.price * (1 - game.sale / 100))}</div>
                                        <span class="badge bg-danger">-${game.sale}%</span>
                                    ` : `
                                        <div class="text-orange fw-bold fs-4">${formatPrice(game.price)}</div>
                                    `}
                                </div>
                                <div class="d-flex gap-2">
                                    <button class="btn btn-orange" onclick="addToCart(${JSON.stringify(game).replace(/"/g, '&quot;')})">
                                        <i class="fas fa-cart-plus me-2"></i>Add to Cart
                                    </button>
                                    <button class="btn btn-outline-danger" onclick="addToWishlist(${JSON.stringify(game).replace(/"/g, '&quot;')})">
                                        <i class="fas fa-heart me-2"></i>Add to Wishlist
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Xóa modal cũ nếu có
    const oldModal = document.getElementById('gameDetailModal');
    if (oldModal) oldModal.remove();
    
    // Thêm modal mới
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Hiển thị modal
    const modal = new bootstrap.Modal(document.getElementById('gameDetailModal'));
    modal.show();
}

/**
 * Lấy dữ liệu game từ backend hoặc local
 */
function getAllGamesData() {
    // Ưu tiên lấy từ gamesData gốc trước
    if (typeof gamesData !== 'undefined' && Array.isArray(gamesData) && gamesData.length > 0) {
        return gamesData;
    }
    
    // Nếu không có gamesData, thử lấy từ admin_products
    const adminProducts = JSON.parse(localStorage.getItem('admin_products') || '[]');
    if (adminProducts.length > 0) {
        return adminProducts;
    }
    
    return [];
}

/**
 * Lưu sản phẩm admin vào localStorage
 */
function saveAdminProducts(products) {
    localStorage.setItem('admin_products', JSON.stringify(products));
}

/**
 * Hiển thị trang quản lý sản phẩm admin
 */
function showProductAdminPage() {
    if (!isAdmin()) {
        showToast('Access denied. Admin privileges required.', 'error');
        return;
    }
    
    hideAllPages();
    document.getElementById('product-admin-page').style.display = 'block';
    updateBreadcrumb('Product Management');
    renderProductAdminList();
}

/**
 * Render danh sách sản phẩm admin
 */
function renderProductAdminList() {
    let products = getAllGamesData();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = products.slice(startIndex, endIndex);
    
    const container = document.getElementById('product-admin-list');
    if (!container) return;
    
    let html = '';
    paginatedProducts.forEach(product => {
        html += `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card bg-dark border-secondary h-100">
                    <img src="${product.image}" class="card-img-top" alt="${product.name}" style="height: 200px; object-fit: cover;">
                    <div class="card-body">
                        <h6 class="card-title">${product.name}</h6>
                        <p class="card-text text-muted">${product.category} - ${product.platform}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="price-info">
                                ${product.isSale ? `
                                    <div class="text-decoration-line-through text-muted">${formatPrice(product.price)}</div>
                                    <div class="text-orange fw-bold">${formatPrice(product.price * (1 - product.sale / 100))}</div>
                                ` : `
                                    <div class="fw-bold">${formatPrice(product.price)}</div>
                                `}
                            </div>
                            <div class="btn-group">
                                <button class="btn btn-sm btn-warning" onclick="openProductEdit(${product.id})">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn btn-sm btn-danger" onclick="openProductDeleteModal(${product.id})">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
    renderProductAdminPagination(Math.ceil(products.length / itemsPerPage));
}

/**
 * Render pagination cho admin products
 */
function renderProductAdminPagination(totalPages) {
    const pagination = document.getElementById('product-admin-pagination');
    if (!pagination) return;
    
    let html = '';
    for (let i = 1; i <= totalPages; i++) {
        html += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" onclick="gotoProductAdminPage(${i})">${i}</a>
            </li>
        `;
    }
    
    pagination.innerHTML = html;
}

/**
 * Chuyển trang admin products
 */
function gotoProductAdminPage(page) {
    currentPage = page;
    renderProductAdminList();
}

/**
 * Mở modal form sản phẩm
 */
function openProductFormModal(editId = null) {
    const modalHtml = `
        <div class="modal fade" id="productFormModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content bg-dark text-light">
                    <div class="modal-header border-secondary">
                        <h5 class="modal-title">${editId ? 'Edit Product' : 'Add Product'}</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="productForm">
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Product Name</label>
                                    <input type="text" class="form-control bg-dark text-light border-secondary" id="productName" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Category</label>
                                    <select class="form-select bg-dark text-light border-secondary" id="productCategory" required>
                                        <option value="">Select Category</option>
                                        <option value="Action">Action</option>
                                        <option value="Adventure">Adventure</option>
                                        <option value="RPG">RPG</option>
                                        <option value="Strategy">Strategy</option>
                                        <option value="Sports">Sports</option>
                                        <option value="Racing">Racing</option>
                                        <option value="FPS">FPS</option>
                                        <option value="MOBA">MOBA</option>
                                        <option value="Horror">Horror</option>
                                        <option value="Puzzle">Puzzle</option>
                                        <option value="Simulation">Simulation</option>
                                        <option value="Battle Royale">Battle Royale</option>
                                    </select>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Platform</label>
                                    <select class="form-select bg-dark text-light border-secondary" id="productPlatform" required>
                                        <option value="">Select Platform</option>
                                        <option value="Steam">Steam</option>
                                        <option value="Epic Games">Epic Games</option>
                                        <option value="Origin">Origin</option>
                                        <option value="Uplay">Uplay</option>
                                        <option value="GOG">GOG</option>
                                        <option value="Battle.net">Battle.net</option>
                                        <option value="Riot Games">Riot Games</option>
                                        <option value="Minecraft Launcher">Minecraft Launcher</option>
                                        <option value="Mobile">Mobile</option>
                                    </select>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Price (VNĐ)</label>
                                    <input type="number" class="form-control bg-dark text-light border-secondary" id="productPrice" min="0" required>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Description</label>
                                <textarea class="form-control bg-dark text-light border-secondary" id="productDescription" rows="3" required></textarea>
                            </div>
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Image URL</label>
                                    <input type="url" class="form-control bg-dark text-light border-secondary" id="productImageUrl" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <div class="form-check mt-4">
                                        <input class="form-check-input" type="checkbox" id="productIsSale">
                                        <label class="form-check-label" for="productIsSale">
                                            On Sale
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div class="mb-3" id="salePercentageGroup" style="display: none;">
                                <label class="form-label">Sale Percentage (%)</label>
                                <input type="number" class="form-control bg-dark text-light border-secondary" id="productSalePercentage" min="0" max="100" value="0">
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer border-secondary">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-success" onclick="handleProductForm()">
                            <i class="fas fa-save me-2"></i>Save Product
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Xóa modal cũ nếu có
    const oldModal = document.getElementById('productFormModal');
    if (oldModal) oldModal.remove();
    
    // Thêm modal mới
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Hiển thị modal
    const modal = new bootstrap.Modal(document.getElementById('productFormModal'));
    modal.show();
    
    // Populate form if editing
    if (editId) {
        const products = getAllGamesData();
        const product = products.find(p => p.id === editId);
        if (product) {
            document.getElementById('productName').value = product.name;
            document.getElementById('productCategory').value = product.category;
            document.getElementById('productPlatform').value = product.platform;
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productDescription').value = product.description;
            document.getElementById('productImageUrl').value = product.image;
            document.getElementById('productIsSale').checked = product.isSale;
            document.getElementById('productSalePercentage').value = product.sale || 0;
            
            // Show/hide sale percentage group
            const salePercentageGroup = document.getElementById('salePercentageGroup');
            if (salePercentageGroup) {
                salePercentageGroup.style.display = product.isSale ? 'block' : 'none';
            }
        }
    }
    
    // Add event listener for sale checkbox
    const saleCheckbox = document.getElementById('productIsSale');
    const salePercentageGroup = document.getElementById('salePercentageGroup');
    if (saleCheckbox && salePercentageGroup) {
        saleCheckbox.addEventListener('change', function() {
            salePercentageGroup.style.display = this.checked ? 'block' : 'none';
        });
    }
}

/**
 * Xử lý form sản phẩm
 */
function handleProductForm() {
    const formData = {
        name: document.getElementById('productName').value,
        category: document.getElementById('productCategory').value,
        platform: document.getElementById('productPlatform').value,
        price: parseFloat(document.getElementById('productPrice').value),
        description: document.getElementById('productDescription').value,
        image: document.getElementById('productImageUrl').value,
        isSale: document.getElementById('productIsSale').checked,
        sale: document.getElementById('productIsSale').checked ? parseFloat(document.getElementById('productSalePercentage').value) : 0
    };
    
    // Validation
    if (!formData.name || !formData.category || !formData.platform || !formData.price || !formData.description || !formData.image) {
        showToast('Please fill in all required fields', 'error');
        return;
    }
    
    // Add to products
    const products = getAllGamesData();
    const newProduct = {
        ...formData,
        id: Date.now(), // Simple ID generation
        originalPrice: formData.price,
        sold: 0,
        developer: 'Unknown',
        publisher: 'Unknown',
        releaseDate: new Date().toISOString().split('T')[0],
        size: 'Unknown',
        configuration: 'Unknown',
        screenshots: []
    };
    
    products.push(newProduct);
    saveAdminProducts(products);
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('productFormModal'));
    if (modal) modal.hide();
    
    // Refresh list
    renderProductAdminList();
    
    showToast('Product saved successfully', 'success');
}

/**
 * Mở edit sản phẩm
 */
function openProductEdit(id) {
    openProductFormModal(id);
}

/**
 * Mở modal xác nhận xóa sản phẩm
 */
function openProductDeleteModal(id) {
    const modalHtml = `
        <div class="modal fade" id="deleteConfirmModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content bg-dark text-light">
                    <div class="modal-header border-secondary">
                        <h5 class="modal-title">Confirm Delete</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        Are you sure you want to delete this product?
                    </div>
                    <div class="modal-footer border-secondary">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-danger" onclick="handleProductDelete(${id})">
                            <i class="fas fa-trash me-2"></i>Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Xóa modal cũ nếu có
    const oldModal = document.getElementById('deleteConfirmModal');
    if (oldModal) oldModal.remove();
    
    // Thêm modal mới
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Hiển thị modal
    const modal = new bootstrap.Modal(document.getElementById('deleteConfirmModal'));
    modal.show();
}

/**
 * Xử lý xóa sản phẩm
 */
function handleProductDelete(id) {
    const products = getAllGamesData();
    const updatedProducts = products.filter(p => p.id !== id);
    saveAdminProducts(updatedProducts);
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('deleteConfirmModal'));
    if (modal) modal.hide();
    
    // Refresh list
    renderProductAdminList();
    
    showToast('Product deleted successfully', 'success');
}

/**
 * Hiển thị game sale
 */
function showSaleGames() {
    hideAllPages();
    document.getElementById('all-games').style.display = 'block';
    const games = getAllGamesData().filter(g => g.isSale || (g.sale && g.sale > 0));
    renderGames(games);
    updateBreadcrumb('Sale Games');
}

/**
 * Hiển thị hot deals
 */
function showHotDeals() {
    hideAllPages();
    document.getElementById('all-games').style.display = 'block';
    const games = getAllGamesData().filter(g => g.isHot || g.hotDeal === true);
    renderGames(games);
    updateBreadcrumb('Hot Deals');
}

/**
 * Hiển thị coming soon games
 */
function showComingSoonGames() {
    hideAllPages();
    document.getElementById('all-games').style.display = 'block';
    const games = getAllGamesData().filter(g => g.comingSoon === true);
    renderGames(games);
    updateBreadcrumb('Coming Soon');
}

/**
 * Set active menu
 */
function setActiveMenu(menu) {
    // Remove active class from all menu items
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to current menu
    const activeLink = document.querySelector(`[data-menu="${menu}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}


