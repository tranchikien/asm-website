// ===== CART FUNCTIONS =====
let cart = [];
let cartRemovePendingId = null;

// Initialize cart when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔍 DOM Content Loaded - Initializing cart.js');
    loadCartFromStorage();
    console.log('✅ Cart.js initialization completed');
});

function addToCart(gameData) {
    console.log('🔍 addToCart() called with:', gameData); // Debug log
    
    if (!gameData) {
        console.log('❌ Invalid game data');
        return;
    }
    
    if (!gameData.name || gameData.name.trim() === '') {
        console.log('❌ Invalid game name');
        return;
    }
    
    if (gameData.price === undefined || gameData.price === null || gameData.price < 0) {
        console.log('❌ Invalid game price');
        return;
    }
    
    // Cho phép giá 0 (game miễn phí)
    if (gameData.price === 0) {
        gameData.price = 0; // Đảm bảo giá là 0
    }
    
    const existingItemIndex = cart.findIndex(item => item.id === gameData.id);
    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += 1;
        console.log('✅ Quantity updated for existing item');
    } else {
        // Tìm thông tin game từ gamesData để lấy thông tin sale
        const game = typeof gamesData !== 'undefined' ? gamesData.find(g => g.id === gameData.id) : null;
        const originalPrice = game && game.isSale && game.sale > 0 ? game.price : gameData.price;
        const salePrice = game && game.isSale && game.sale > 0 ? game.price * (1 - game.sale / 100) : gameData.price;
        
        cart.push({
            id: gameData.id,
            name: gameData.name,
            price: salePrice, // Giá sau khi giảm
            originalPrice: originalPrice, // Giá gốc
            sale: game ? game.sale : 0, // Phần trăm giảm giá
            quantity: 1,
            image: gameData.image || 'https://via.placeholder.com/60x60?text=Game'
        });
        console.log('✅ Added new item to cart');
    }
    
    console.log('✅ Cart updated:', cart);
    updateCartDisplay();
    saveCartToStorage();
}

function removeFromCart(gameId) {
    const itemIndex = cart.findIndex(item => item.id === gameId);
    if (itemIndex > -1) {
        const gameName = cart[itemIndex].name;
        // Hiệu ứng fade-out
        const itemEl = document.getElementById('cart-item-' + gameId);
        if (itemEl) {
            itemEl.classList.remove('cart-fade-in');
            itemEl.classList.add('cart-fade-out');
            setTimeout(() => {
                cart.splice(itemIndex, 1);
                updateCartDisplay();
                saveCartToStorage();
                updateCartModal();
                // Removed from cart
            }, 350);
        } else {
            cart.splice(itemIndex, 1);
            updateCartDisplay();
            saveCartToStorage();
            updateCartModal();
            // Removed from cart
        }
    }
}

function updateCartItemQuantity(gameId, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(gameId);
        return;
    }
    const itemIndex = cart.findIndex(item => item.id === gameId);
    if (itemIndex > -1) {
        cart[itemIndex].quantity = newQuantity;
        updateCartDisplay();
        saveCartToStorage();
        updateCartPage();
        updateCartModal();
        // Quantity updated
    }
}

function saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
            updateCartDisplay();
        } catch (error) {
            console.error('Error loading cart from storage:', error);
            cart = [];
        }
    }
}

function updateCartDisplay() {
    const cartCount = document.getElementById('cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (cartCount) {
        if (totalItems > 0) {
            cartCount.textContent = totalItems;
            cartCount.style.display = 'block';
        } else {
            cartCount.style.display = 'none';
        }
    }
}

function updateCartModal() {
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
            <div class="cart-dropdown-item d-flex align-items-center p-2" id="cart-dropdown-item-${item.id}">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image me-2" style="width: 40px; height: 40px; object-fit: cover;">
                <div class="flex-grow-1">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${formatPrice(item.price)} x ${item.quantity}</div>
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

function updateCartPage() {
    const cartItemsEl = document.getElementById('cart-items');
    const cartTotalEl = document.getElementById('cart-total');
    
    if (!cartItemsEl || !cartTotalEl) return;
    
    if (cart.length === 0) {
        cartItemsEl.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-shopping-cart text-muted fa-3x mb-3"></i>
                <h5 class="text-muted">Your cart is empty</h5>
                <p class="text-muted">Add some games to get started!</p>
                <button class="btn btn-orange" onclick="showAllGames()">
                    <i class="fas fa-gamepad me-2"></i>Browse Games
                </button>
            </div>
        `;
        cartTotalEl.textContent = formatPrice(0);
        return;
    }
    
    let html = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        html += `
            <div class="cart-item card mb-3 bg-dark border-secondary" id="cart-item-${item.id}">
                <div class="card-body">
                    <div class="row align-items-center">
                        <div class="col-md-2">
                            <img src="${item.image}" alt="${item.name}" class="img-fluid rounded">
                        </div>
                        <div class="col-md-4">
                            <h6 class="card-title mb-1">${item.name}</h6>
                            <p class="text-muted mb-0">Category: ${item.category || 'N/A'}</p>
                        </div>
                        <div class="col-md-2 text-center">
                            <div class="quantity-controls">
                                <button class="btn btn-sm btn-outline-secondary" onclick="updateCartItemQuantity('${item.id}', ${item.quantity - 1})">-</button>
                                <span class="mx-2">${item.quantity}</span>
                                <button class="btn btn-sm btn-outline-secondary" onclick="updateCartItemQuantity('${item.id}', ${item.quantity + 1})">+</button>
                            </div>
                        </div>
                        <div class="col-md-2 text-center">
                            <div class="price-info">
                                ${item.sale > 0 ? `<div class="text-muted text-decoration-line-through">${formatPrice(item.originalPrice)}</div>` : ''}
                                <div class="fw-bold">${formatPrice(item.price)}</div>
                            </div>
                        </div>
                        <div class="col-md-2 text-end">
                            <div class="fw-bold">${formatPrice(itemTotal)}</div>
                            <button class="btn btn-sm btn-outline-danger mt-1" onclick="removeFromCart('${item.id}')">
                                <i class="fas fa-trash"></i> Remove
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    cartItemsEl.innerHTML = html;
    cartTotalEl.textContent = formatPrice(total);
}

function clearCart() {
    cart = [];
    saveCartToStorage();
    updateCartDisplay();
    updateCartModal();
    updateCartPage();
    showToast('Cart cleared successfully', 'success');
}

/**
 * Handle checkout process
 */
async function handleCheckout() {
    if (!isLoggedIn()) {
        showToast('Please login to checkout', 'error');
        openModal('loginModal');
        return;
    }
    
    if (cart.length === 0) {
        showToast('Your cart is empty', 'error');
        return;
    }
    
    try {
        const token = localStorage.getItem('authToken');
        const orderData = {
            items: cart.map(item => ({
                productId: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity
            })),
            totalAmount: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            paymentMethod: 'online' // Default payment method
        };
        
        const response = await fetch(`${API_BASE_URL}/api/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(orderData)
        });
        
        if (response.ok) {
            const result = await response.json();
            showToast('Order placed successfully!', 'success');
            
            // Clear cart after successful order
            clearCart();
            
            // Close cart modal
            const cartModal = bootstrap.Modal.getInstance(document.getElementById('cartModal'));
            if (cartModal) cartModal.hide();
            
            // Show order confirmation
            showOrderConfirmation(result.order);
        } else {
            const error = await response.json();
            showToast(error.message || 'Failed to place order', 'error');
        }
    } catch (error) {
        console.error('Checkout error:', error);
        showToast('Error processing checkout', 'error');
    }
}

/**
 * Show order confirmation
 */
function showOrderConfirmation(order) {
    const modal = new bootstrap.Modal(document.getElementById('orderConfirmationModal'));
    modal.show();
    
    // Populate order details
    document.getElementById('order-id').textContent = order._id.slice(-8);
    document.getElementById('order-total').textContent = formatPrice(order.totalAmount);
    document.getElementById('order-status').textContent = order.status;
    document.getElementById('order-date').textContent = new Date(order.createdAt).toLocaleDateString();
    
    // Populate order items
    const orderItemsEl = document.getElementById('order-items');
    let itemsHtml = '';
    
    order.items.forEach(item => {
        itemsHtml += `
            <div class="d-flex justify-content-between align-items-center py-2">
                <div>
                    <strong>${item.name}</strong>
                    <br><small class="text-muted">Quantity: ${item.quantity}</small>
                </div>
                <div class="text-end">
                    <strong>${formatPrice(item.price * item.quantity)}</strong>
                </div>
            </div>
        `;
    });
    
    orderItemsEl.innerHTML = itemsHtml;
}

/**
 * Load user's order history
 */
async function loadOrderHistory() {
    if (!isLoggedIn()) {
        showToast('Please login to view order history', 'error');
        return;
    }
    
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${API_BASE_URL}/api/orders`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const orders = await response.json();
            displayOrderHistory(orders);
        } else {
            showToast('Failed to load order history', 'error');
        }
    } catch (error) {
        console.error('Error loading order history:', error);
        showToast('Error loading order history', 'error');
    }
}

/**
 * Display order history
 */
function displayOrderHistory(orders) {
    const orderHistoryEl = document.getElementById('order-history');
    
    if (!orderHistoryEl) return;
    
    if (orders.length === 0) {
        orderHistoryEl.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-box text-muted fa-3x mb-3"></i>
                <h5 class="text-muted">No orders yet</h5>
                <p class="text-muted">Start shopping to see your order history!</p>
                <button class="btn btn-orange" onclick="showAllGames()">
                    <i class="fas fa-gamepad me-2"></i>Browse Games
                </button>
            </div>
        `;
        return;
    }
    
    let html = '';
    
    orders.forEach(order => {
        const statusClass = {
            'pending': 'warning',
            'processing': 'info',
            'shipped': 'primary',
            'delivered': 'success',
            'cancelled': 'danger'
        }[order.status] || 'secondary';
        
        html += `
            <div class="card mb-3 bg-dark border-secondary">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <div>
                        <strong>Order #${order._id.slice(-8)}</strong>
                        <br><small class="text-muted">${new Date(order.createdAt).toLocaleDateString()}</small>
                    </div>
                    <div class="text-end">
                        <span class="badge bg-${statusClass}">${order.status}</span>
                        <br><strong>${formatPrice(order.totalAmount)}</strong>
                    </div>
                </div>
                <div class="card-body">
                    <div class="row">
                        ${order.items.map(item => `
                            <div class="col-md-6 mb-2">
                                <div class="d-flex align-items-center">
                                    <img src="${item.image || 'https://via.placeholder.com/40x40'}" 
                                         alt="${item.name}" 
                                         class="me-2" 
                                         style="width: 40px; height: 40px; object-fit: cover;">
                                    <div>
                                        <div><strong>${item.name}</strong></div>
                                        <small class="text-muted">Qty: ${item.quantity} | ${formatPrice(item.price)}</small>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    });
    
    orderHistoryEl.innerHTML = html;
}

// Call this after DOMContentLoaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderCartDropdown);
} else {
    renderCartDropdown();
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