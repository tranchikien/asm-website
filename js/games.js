// ===== GAME FUNCTIONS =====

/**
 * Render danh sách game ra grid
 */
function renderGames(games = gamesData) {
    const grid = document.getElementById('games-grid');
    if (!grid) return;
    
    console.log('🎮 Rendering games:', games);
    
    grid.innerHTML = '';
    if (!games || games.length === 0) {
        grid.innerHTML = `<div class="col-12 text-center text-muted py-5">Không tìm thấy game phù hợp.</div>`;
        return;
    }
    
    games.forEach(game => {
        grid.innerHTML += createGameCard(game);
    });
}

/**
 * Hiển thị tất cả game
 */
function showAllGames() {
    hideAllPages();
    document.getElementById('all-games').style.display = 'block';
    console.log('🎮 All Games Data:', gamesData); // Debug log
    renderGames(gamesData); // Render tất cả game
    updateBreadcrumb('All Games');
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

/**
 * Hiển thị trang contact
 */
function showContactPage() {
    hideAllPages();
    document.getElementById('contact').style.display = 'block';
    updateBreadcrumb('Contact');
}
