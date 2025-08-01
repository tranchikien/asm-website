// ===== AUTH FUNCTIONS =====

/**
 * Check if email already exists via API
 */
async function isEmailExists(email) {
    try {
        // We'll check this during registration on the backend
        return false; // Let backend handle validation
    } catch (error) {
        console.error('Email check error:', error);
        return false;
    }
}

/**
 * Validate password strength
 */
function validatePasswordStrength(password) {
    const errors = [];
    
    if (password.length < 8) {
        errors.push('Mật khẩu phải có ít nhất 8 ký tự');
    }
    
    if (!/[A-Z]/.test(password)) {
        errors.push('Mật khẩu phải có ít nhất 1 ký tự viết hoa');
    }
    
    if (!/[a-z]/.test(password)) {
        errors.push('Mật khẩu phải có ít nhất 1 ký tự viết thường');
    }
    
    if (!/\d/.test(password)) {
        errors.push('Mật khẩu phải có ít nhất 1 số');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push('Mật khẩu phải có ít nhất 1 ký tự đặc biệt (!@#$%^&*)');
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

/**
 * Register new user via API
 */
async function registerUser(userData) {
    try {
        const response = await apiCall(API_ENDPOINTS.REGISTER, {
            method: 'POST',
            body: JSON.stringify({
                email: userData.email,
                password: userData.password,
                fullname: userData.fullname,
                phone: userData.phone || '',
                address: userData.address || '',
                birthday: userData.birthday || '',
                location: userData.location || ''
            })
        });
        
        return { success: true, message: 'Đăng ký thành công!', data: response };
    } catch (error) {
        return { success: false, message: error.message || 'Đăng ký thất bại!' };
    }
}

/**
 * Authenticate user login via API
 */
async function authenticateUser(email, password) {
    try {
        const response = await apiCall(API_ENDPOINTS.LOGIN, {
            method: 'POST',
            body: JSON.stringify({
                email: email,
                password: password
            })
        });
        
        return { success: true, user: response.user, token: response.token };
    } catch (error) {
        return { success: false, message: error.message || 'Email hoặc mật khẩu không đúng!' };
    }
}

function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        showToast('Vui lòng nhập đầy đủ thông tin', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showToast('Email không hợp lệ', 'error');
        return;
    }
    
    // Show loading
    const loginBtn = document.querySelector('#loginForm button[type="submit"]');
    const originalText = loginBtn.innerHTML;
    loginBtn.innerHTML = '<span class="loading"></span> Đang đăng nhập...';
    loginBtn.disabled = true;
    
    // Authenticate user (async)
    authenticateUser(email, password).then(result => {
        if (result.success) {
            // Login successful
            const user = result.user;
            const token = result.token;
            
            console.log('🔐 Login Response:', {
                user: user,
                hasIsAdmin: 'isAdmin' in user,
                isAdminValue: user.isAdmin,
                token: token ? 'Present' : 'Missing'
            });
            
            // Save current user session and token (temporary during session only)
            sessionStorage.setItem('user', JSON.stringify(user));
            sessionStorage.setItem('authToken', token);
            
            console.log('💾 Saved to localStorage:', {
                user: JSON.parse(localStorage.getItem('user')),
                token: localStorage.getItem('authToken') ? 'Present' : 'Missing'
            });
            
            showToast('Đăng nhập thành công!', 'success');
            
            // Update UI immediately
            updateUserDropdown();
            
            // Force update admin menu
            updateAdminMenu();
            
            // Update profile page
            const profileUsername = document.getElementById('profile-username');
            if (profileUsername) profileUsername.textContent = user.fullName || user.fullname;
            
            // Close modal
            const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
            if (loginModal) loginModal.hide();
        } else {
            // Login failed
            showToast(result.message, 'error');
        }
        
        // Reset button
        loginBtn.innerHTML = originalText;
        loginBtn.disabled = false;
    }).catch(error => {
        showToast('Đăng nhập thất bại: ' + error.message, 'error');
        loginBtn.innerHTML = originalText;
        loginBtn.disabled = false;
    });
}

function handleRegister() {
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const phone = document.getElementById('registerPhone').value;
    const birthday = document.getElementById('registerBirthday').value;
    const address = document.getElementById('registerAddress').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    
    if (!username || !email || !password || !confirmPassword) {
        showToast('Vui lòng nhập đầy đủ thông tin', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showToast('Email không hợp lệ', 'error');
        return;
    }
    
    // Kiểm tra độ mạnh mật khẩu
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
        showToast(passwordValidation.errors[0], 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showToast('Mật khẩu xác nhận không khớp', 'error');
        return;
    }
    
    if (!agreeTerms) {
        showToast('Vui lòng đồng ý với điều khoản sử dụng', 'error');
        return;
    }
    
    // Optional validation for phone number
    if (phone && phone.length < 10) {
        showToast('Số điện thoại phải có ít nhất 10 số', 'error');
        return;
    }
    
    // Show loading
    const registerBtn = document.querySelector('#registerForm button[type="submit"]');
    const originalText = registerBtn.innerHTML;
    registerBtn.innerHTML = '<span class="loading"></span> Đang đăng ký...';
    registerBtn.disabled = true;
    
    // Register new user (async)
    registerUser({
        email: email,
        password: password,
        fullname: username,
        phone: phone,
        birthday: birthday,
        address: address
    }).then(result => {
        if (result.success) {
            // Registration successful
            showToast(result.message, 'success');
            
            // Auto login after registration
            authenticateUser(email, password).then(loginResult => {
                if (loginResult.success) {
                    const user = loginResult.user;
                    const token = loginResult.token;
                    
                    // Save current user session and token
                    localStorage.setItem('user', JSON.stringify(user));
                    localStorage.setItem('authToken', token);
                    
                    // Update UI immediately
                    updateUserDropdown();
                }
            });
            
            // Close modal
            const registerModal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
            if (registerModal) registerModal.hide();
        } else {
            // Registration failed
            showToast(result.message, 'error');
        }
        
        // Reset button
        registerBtn.innerHTML = originalText;
        registerBtn.disabled = false;
    }).catch(error => {
        showToast('Đăng ký thất bại: ' + error.message, 'error');
        registerBtn.innerHTML = originalText;
        registerBtn.disabled = false;
    });
}

// ===== FORM EVENT LISTENERS =====

document.getElementById('loginForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    handleLogin();
});

document.getElementById('registerForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    handleRegister();
});

// ===== INITIALIZATION =====

// Check login status when page loads
document.addEventListener('DOMContentLoaded', function() {
    updateUserDropdown();
});

// ===== ADDITIONAL AUTH FUNCTIONS =====

/**
 * Logout function
 */
function logout() {
    // Clear user data and token from session storage
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('authToken');
    
    // Update UI immediately
    updateUserDropdown();
    
    // Clear cart from session storage
    sessionStorage.removeItem('cart');
    cart = [];
    updateCartDisplay();
    
    showToast('Đã đăng xuất thành công', 'success');
    
    // Ẩn modal tài khoản nếu đang mở
    const profileModal = bootstrap.Modal.getInstance(document.getElementById('profileModal'));
    if (profileModal) profileModal.hide();
    
    // Ẩn admin panel modal nếu đang mở
    const adminModal = bootstrap.Modal.getInstance(document.getElementById('adminPanelModal'));
    if (adminModal) adminModal.hide();
}

/**
 * Check if user is logged in
 */
function isLoggedIn() {
    return sessionStorage.getItem('user') !== null;
}

/**
 * Get current user from session storage (temporary during session only)
 */
function getCurrentUser() {
    const userData = sessionStorage.getItem('user');
    const token = sessionStorage.getItem('authToken');
    
    // If no token, clear user data
    if (!token) {
        sessionStorage.removeItem('user');
        return null;
    }
    
    const user = userData ? JSON.parse(userData) : null;
    console.log('getCurrentUser() called, result:', user);
    return user;
}

/**
 * Update user profile
 */
function updateUserProfile(userData) {
    sessionStorage.setItem('user', JSON.stringify(userData));
    showToast('Cập nhật thông tin thành công!', 'success');
} 

/**
 * Update user dropdown visibility
 */
function updateUserDropdown() {
    const user = getCurrentUser();
    const token = localStorage.getItem('authToken');
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const userDropdown = document.getElementById('user-dropdown');
    
    if (user && token) {
        // User is logged in - show user dropdown, hide login/register
        if (loginBtn) loginBtn.style.display = 'none';
        if (registerBtn) registerBtn.style.display = 'none';
        if (userDropdown) userDropdown.style.display = 'block';
        
        // Update user name in dropdown
        const userNameEl = document.getElementById('user-name');
        if (userNameEl) userNameEl.textContent = user.fullname;
        
        // Update admin UI
        updateAdminUI();
    } else {
        // User is not logged in - show login/register, hide user dropdown
        if (loginBtn) loginBtn.style.display = 'inline-block';
        if (registerBtn) registerBtn.style.display = 'inline-block';
        if (userDropdown) userDropdown.style.display = 'none';
        
        // Clear any stale data
        if (!token) {
            localStorage.removeItem('user');
        }
        
        // Hide admin button
        const adminBtn = document.getElementById('admin-btn');
        if (adminBtn) adminBtn.style.display = 'none';
    }
}

function updateAdminUI() {
    // Update admin menu instead
    updateAdminMenu();
}

/**
 * Validate current session and refresh user data if needed
 */
async function validateSession() {
    const user = getCurrentUser();
    const token = sessionStorage.getItem('authToken');
    
    if (!user || !token) {
        // Clear any stale data
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('authToken');
        return false;
    }
    
    try {
        // Try to validate token with server
        const response = await fetch(`${API_BASE_URL}/api/auth/validate`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            // Update user data with fresh data from server
            sessionStorage.setItem('user', JSON.stringify(data.user));
            console.log('✅ Session validated successfully');
            return true;
        } else {
            // Token is invalid, clear session
            console.log('❌ Session validation failed, clearing data');
            sessionStorage.removeItem('user');
            sessionStorage.removeItem('authToken');
            updateUserDropdown();
            return false;
        }
    } catch (error) {
        console.error('Session validation error:', error);
        // On network error, clear session to be safe
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('authToken');
        updateUserDropdown();
        return false;
    }
} 

// ===== DEBUG FUNCTIONS =====

/**
 * Debug function to check session storage
 */
function debugLocalStorage() {
    console.log('=== SESSION STORAGE DEBUG ===');
    console.log('All sessionStorage:', sessionStorage);
    
    const user = getCurrentUser();
    const token = sessionStorage.getItem('authToken');
    
    console.log('🔍 Session Debug:', {
        hasUser: !!user,
        hasToken: !!token,
        userEmail: user ? user.email : 'N/A',
        userIsAdmin: user ? user.isAdmin : 'N/A'
    });
    
    if (user) {
        console.log('✅ User is logged in:');
        console.log('  - Email:', user.email);
        console.log('  - Name:', user.fullname);
        console.log('  - Phone:', user.phone);
        console.log('  - Address:', user.address);
        console.log('  - Birthday:', user.birthday);
        console.log('  - IsAdmin:', user.isAdmin);
    } else {
        console.log('❌ No user logged in');
    }
    
    // Check other stored data
    const cart = sessionStorage.getItem('cart');
    if (cart) {
        console.log('🛒 Cart data:', JSON.parse(cart));
    }
    
    const wishlist = sessionStorage.getItem('wishlist');
    if (wishlist) {
        console.log('❤️ Wishlist data:', JSON.parse(wishlist));
    }
    
    console.log('=== END DEBUG ===');
}

/**
 * Clear all session storage data
 */
function clearAllData() {
    if (confirm('Bạn có chắc muốn xóa tất cả dữ liệu? (Đăng xuất, xóa giỏ hàng, wishlist...)')) {
        sessionStorage.clear();
        console.log('🗑️ All session storage data cleared');
        location.reload(); // Reload trang để cập nhật UI
    }
}

/**
 * Clean up inconsistent session data
 */
function cleanupSessionData() {
    const user = sessionStorage.getItem('user');
    const token = sessionStorage.getItem('authToken');
    
    // If we have user data but no token, clear user data
    if (user && !token) {
        console.log('🧹 Cleaning up: User data without token');
        sessionStorage.removeItem('user');
    }
    
    // If we have token but no user data, clear token
    if (token && !user) {
        console.log('🧹 Cleaning up: Token without user data');
        sessionStorage.removeItem('authToken');
    }
    
    // If we have both, validate the data
    if (user && token) {
        try {
            const userData = JSON.parse(user);
            if (!userData.email || !userData.fullname) {
                console.log('🧹 Cleaning up: Invalid user data');
                sessionStorage.removeItem('user');
                sessionStorage.removeItem('authToken');
            }
        } catch (error) {
            console.log('🧹 Cleaning up: Corrupted user data');
            sessionStorage.removeItem('user');
            sessionStorage.removeItem('authToken');
        }
    }
}

// Thêm vào global scope để có thể gọi từ console
window.debugLocalStorage = debugLocalStorage;
window.debugUI = debugUI;
window.testProfileModal = testProfileModal;
window.testWishlist = testWishlist;
window.testOrderHistory = testOrderHistory;
window.testAddToWishlist = testAddToWishlist;
window.cleanupSessionData = cleanupSessionData;
window.testCoupon = testCoupon;
window.clearAllData = clearAllData;
window.validateSession = validateSession;
window.updateAdminMenu = updateAdminMenu;
window.isAdmin = isAdmin;

// Debug function to test admin panel
window.testAdminPanel = function() {
    console.log('🔍 Testing Admin Panel Access...');
    
    const user = getCurrentUser();
    const token = localStorage.getItem('authToken');
    const isAdminUser = isAdmin();
    const adminMenu = document.getElementById('admin-menu');
    
    console.log('Current Status:', {
        user: user ? user.email : 'None',
        isAdmin: isAdminUser,
        hasToken: !!token,
        adminMenuFound: !!adminMenu,
        adminMenuDisplay: adminMenu ? adminMenu.style.display : 'N/A'
    });
    
    if (isAdminUser) {
        console.log('✅ User is admin, should be able to access admin panel');
        if (adminMenu) {
            adminMenu.style.display = 'block';
            console.log('✅ Admin menu should now be visible');
        }
    } else {
        console.log('❌ User is not admin');
    }
};

// ===== ADMIN DASHBOARD FUNCTIONS =====

/**
 * Check if current user is admin
 */
function isAdmin() {
    // Get user from session storage instead of local storage
    const user = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')) : null;
    const token = sessionStorage.getItem('authToken');
    
    // Check if user exists and has valid token
    if (!user || !token) {
        console.log('🔍 Admin Check: No user or token');
        return false;
    }
    
    // Check if user has admin privileges
    const isAdminUser = user.isAdmin === true;
    
    // Debug log
    console.log('🔍 Admin Check:', {
        user: user.email,
        isAdmin: isAdminUser,
        hasToken: !!token,
        userData: user
    });
    
    return isAdminUser;
}

/**
 * Show admin menu in user dropdown
 */
function updateAdminMenu() {
    const adminMenu = document.getElementById('admin-menu');
    const isAdminUser = isAdmin();
    
    console.log('🔧 Update Admin Menu:', {
        adminMenu: adminMenu ? 'Found' : 'Not found',
        isAdmin: isAdminUser,
        display: isAdminUser ? 'block' : 'none',
        user: getCurrentUser()
    });
    
    if (adminMenu) {
        if (isAdminUser) {
            adminMenu.style.display = 'block';
            console.log('✅ Admin menu should be visible');
        } else {
            adminMenu.style.display = 'none';
            console.log('❌ Admin menu should be hidden');
        }
    } else {
        console.log('❌ Admin menu element not found');
    }
}

/**
 * Open admin panel modal
 */
async function openAdminPanel() {
    // Check if user is admin first
    if (!isAdmin()) {
        showToast('Access denied. Admin privileges required.', 'error');
        return;
    }
    
    const modal = new bootstrap.Modal(document.getElementById('adminPanelModal'));
    modal.show();
    
    // Load admin data when modal opens
    loadAdminData();
}

/**
 * Show admin dashboard (legacy function - now uses modal)
 */
function showAdminDashboard() {
    openAdminPanel();
}

/**
 * Load admin dashboard data
 */
async function loadAdminData() {
    // Check if user is admin first
    if (!isAdmin()) {
        showToast('Access denied. Admin privileges required.', 'error');
        return;
    }
    
    try {
        const token = localStorage.getItem('authToken');
        
        console.log('🔐 Loading admin data:', {
            token: token ? 'Present' : 'Missing',
            tokenLength: token ? token.length : 0,
            apiUrl: `${API_BASE_URL}/api/admin/dashboard/stats`
        });
        
        const response = await fetch(`${API_BASE_URL}/api/admin/dashboard/stats`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        console.log('📥 Admin API Response:', {
            status: response.status,
            statusText: response.statusText,
            ok: response.ok
        });

        if (response.ok) {
            const data = await response.json();
            console.log('📊 Admin data received:', data);
            updateAdminStats(data.stats);
            updateRecentOrders(data.recentOrders);
        } else if (response.status === 403) {
            console.error('❌ Admin access denied - 403');
            showToast('Access denied. Admin privileges required.', 'error');
        } else {
            console.error('❌ Admin API error:', response.status, response.statusText);
            const errorData = await response.json().catch(() => ({}));
            console.error('❌ Error details:', errorData);
            showToast('Error loading admin data', 'error');
        }
    } catch (error) {
        console.error('❌ Error loading admin data:', error);
        showToast('Error loading admin data', 'error');
    }
}

/**
 * Update admin statistics
 */
function updateAdminStats(stats) {
    document.getElementById('admin-total-users').textContent = stats.totalUsers || 0;
    document.getElementById('admin-total-products').textContent = stats.totalProducts || 0;
    document.getElementById('admin-total-orders').textContent = stats.totalOrders || 0;
    document.getElementById('admin-total-revenue').textContent = `$${stats.totalRevenue || 0}`;
}

/**
 * Update recent orders table
 */
function updateRecentOrders(orders) {
    const tbody = document.getElementById('admin-recent-orders');
    tbody.innerHTML = '';

    orders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${order._id.slice(-8)}</td>
            <td>${order.userId?.fullname || 'N/A'}</td>
            <td>${order.items.length} items</td>
            <td>$${order.totalAmount}</td>
            <td><span class="status-badge ${order.status}">${order.status}</span></td>
            <td>${new Date(order.createdAt).toLocaleDateString()}</td>
        `;
        tbody.appendChild(row);
    });
}

/**
 * Show admin products section
 */
function showAdminProducts() {
    // Switch to products section
    switchAdminSection('admin-products');
    loadAdminProducts();
}

/**
 * Show admin orders section
 */
function showAdminOrders() {
    // Switch to orders section
    switchAdminSection('admin-orders');
    loadAdminOrders();
}

/**
 * Show admin users section
 */
function showAdminUsers() {
    // Switch to users section
    switchAdminSection('admin-users');
    loadAdminUsers();
}

/**
 * Switch admin section
 */
function switchAdminSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionId).classList.add('active');
    
    // Update nav links
    document.querySelectorAll('.admin-nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Find and activate the corresponding nav link
    const navLink = document.querySelector(`[data-section="${sectionId}"]`);
    if (navLink) {
        navLink.classList.add('active');
    }
}

/**
 * Load admin products
 */
async function loadAdminProducts() {
    // Validate session first
    const isValidSession = await validateSession();
    if (!isValidSession) {
        showToast('Session expired. Please login again.', 'error');
        return;
    }
    
    // Check if user is admin
    if (!isAdmin()) {
        showToast('Access denied. Admin privileges required.', 'error');
        return;
    }
    
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${API_BASE_URL}/api/admin/products`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            displayAdminProducts(data.products);
        } else if (response.status === 403) {
            showToast('Access denied. Admin privileges required.', 'error');
        }
    } catch (error) {
        console.error('Error loading products:', error);
        showToast('Error loading products', 'error');
    }
}

/**
 * Display admin products
 */
function displayAdminProducts(products) {
    const tbody = document.getElementById('admin-products-table');
    tbody.innerHTML = '';

    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>${product.platform}</td>
            <td>$${product.price}</td>
            <td>${product.isSale ? `${product.salePercentage}%` : 'No'}</td>
            <td>
                <button class="admin-action-btn edit" onclick="editAdminProduct('${product._id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="admin-action-btn delete" onclick="deleteAdminProduct('${product._id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

/**
 * Load admin orders
 */
async function loadAdminOrders() {
    // Validate session first
    const isValidSession = await validateSession();
    if (!isValidSession) {
        showToast('Session expired. Please login again.', 'error');
        return;
    }
    
    // Check if user is admin
    if (!isAdmin()) {
        showToast('Access denied. Admin privileges required.', 'error');
        return;
    }
    
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${API_BASE_URL}/api/admin/orders`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            displayAdminOrders(data.orders);
        } else if (response.status === 403) {
            showToast('Access denied. Admin privileges required.', 'error');
        }
    } catch (error) {
        console.error('Error loading orders:', error);
        showToast('Error loading orders', 'error');
    }
}

/**
 * Display admin orders
 */
function displayAdminOrders(orders) {
    const tbody = document.getElementById('admin-orders-table');
    tbody.innerHTML = '';

    orders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${order._id.slice(-8)}</td>
            <td>${order.userId?.fullname || 'N/A'}</td>
            <td>${order.items.length} items</td>
            <td>$${order.totalAmount}</td>
            <td>
                <select onchange="updateAdminOrderStatus('${order._id}', this.value)">
                    <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                    <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Processing</option>
                    <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Shipped</option>
                    <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                    <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                </select>
            </td>
            <td>${new Date(order.createdAt).toLocaleDateString()}</td>
            <td>
                <button class="admin-action-btn delete" onclick="deleteAdminOrder('${order._id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

/**
 * Load admin users
 */
async function loadAdminUsers() {
    // Validate session first
    const isValidSession = await validateSession();
    if (!isValidSession) {
        showToast('Session expired. Please login again.', 'error');
        return;
    }
    
    // Check if user is admin
    if (!isAdmin()) {
        showToast('Session expired. Please login again.', 'error');
        return;
    }
    
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const users = await response.json();
            displayAdminUsers(users);
        } else if (response.status === 403) {
            showToast('Access denied. Admin privileges required.', 'error');
        }
    } catch (error) {
        console.error('Error loading users:', error);
        showToast('Error loading users', 'error');
    }
}

/**
 * Display admin users
 */
function displayAdminUsers(users) {
    const tbody = document.getElementById('admin-users-table');
    tbody.innerHTML = '';

    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.fullname || 'N/A'}</td>
            <td>${user.email}</td>
            <td>${user.phone || 'N/A'}</td>
            <td>${user.location || 'N/A'}</td>
            <td>${new Date(user.createdAt).toLocaleDateString()}</td>
            <td>
                <button class="admin-action-btn delete" onclick="deleteAdminUser('${user._id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

/**
 * Show add product modal
 */
function showAddProductModal() {
    // Check if user is admin
    if (!isAdmin()) {
        showToast('Access denied. Admin privileges required.', 'error');
        return;
    }
    
    document.getElementById('productModalTitle').textContent = 'Add Product';
    document.getElementById('addProductForm').reset();
    const modal = new bootstrap.Modal(document.getElementById('addProductModal'));
    modal.show();
}

/**
 * Add product form submit
 */
document.addEventListener('DOMContentLoaded', function() {
    const addProductForm = document.getElementById('addProductForm');
    if (addProductForm) {
        addProductForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Check if user is admin
            if (!isAdmin()) {
                showToast('Access denied. Admin privileges required.', 'error');
                return;
            }
            
            const productData = {
                name: document.getElementById('addProductName').value,
                description: document.getElementById('addProductDescription').value,
                price: parseFloat(document.getElementById('addProductPrice').value),
                originalPrice: parseFloat(document.getElementById('addProductOriginalPrice').value) || parseFloat(document.getElementById('addProductPrice').value),
                category: document.getElementById('addProductCategory').value,
                platform: document.getElementById('addProductPlatform').value,
                imageUrl: document.getElementById('addProductImageUrl').value,
                isSale: document.getElementById('addProductIsSale').checked,
                salePercentage: parseInt(document.getElementById('addProductSalePercentage').value) || 0
            };

            try {
                const token = localStorage.getItem('authToken');
                const response = await fetch(`${API_BASE_URL}/api/products`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(productData)
                });

                if (response.ok) {
                    const modal = bootstrap.Modal.getInstance(document.getElementById('addProductModal'));
                    modal.hide();
                    loadAdminProducts();
                    showToast('Product added successfully!', 'success');
                } else if (response.status === 403) {
                    showToast('Access denied. Admin privileges required.', 'error');
                } else {
                    const data = await response.json();
                    showToast(data.message || 'Failed to add product', 'error');
                }
            } catch (error) {
                console.error('Error adding product:', error);
                showToast('Failed to add product', 'error');
            }
        });
    }
});

/**
 * Delete admin product
 */
async function deleteAdminProduct(productId) {
    // Validate session first
    const isValidSession = await validateSession();
    if (!isValidSession) {
        showToast('Session expired. Please login again.', 'error');
        return;
    }
    
    // Check if user is admin
    if (!isAdmin()) {
        showToast('Access denied. Admin privileges required.', 'error');
        return;
    }
    
    if (confirm('Are you sure you want to delete this product?')) {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                loadAdminProducts();
                showToast('Product deleted successfully!', 'success');
            } else if (response.status === 403) {
                showToast('Access denied. Admin privileges required.', 'error');
            } else {
                showToast('Failed to delete product', 'error');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            showToast('Failed to delete product', 'error');
        }
    }
}

/**
 * Update admin order status
 */
async function updateAdminOrderStatus(orderId, status) {
    // Validate session first
    const isValidSession = await validateSession();
    if (!isValidSession) {
        showToast('Session expired. Please login again.', 'error');
        return;
    }
    
    // Check if user is admin
    if (!isAdmin()) {
        showToast('Access denied. Admin privileges required.', 'error');
        return;
    }
    
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${API_BASE_URL}/api/admin/orders/${orderId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status })
        });

        if (response.ok) {
            showToast('Order status updated successfully!', 'success');
        } else if (response.status === 403) {
            showToast('Access denied. Admin privileges required.', 'error');
        } else {
            showToast('Failed to update order status', 'error');
        }
    } catch (error) {
        console.error('Error updating order status:', error);
        showToast('Failed to update order status', 'error');
    }
}

/**
 * Delete admin order
 */
async function deleteAdminOrder(orderId) {
    // Validate session first
    const isValidSession = await validateSession();
    if (!isValidSession) {
        showToast('Session expired. Please login again.', 'error');
        return;
    }
    
    // Check if user is admin
    if (!isAdmin()) {
        showToast('Access denied. Admin privileges required.', 'error');
        return;
    }
    
    if (confirm('Are you sure you want to delete this order?')) {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/api/admin/orders/${orderId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                loadAdminOrders();
                showToast('Order deleted successfully!', 'success');
            } else if (response.status === 403) {
                showToast('Access denied. Admin privileges required.', 'error');
            } else {
                showToast('Failed to delete order', 'error');
            }
        } catch (error) {
            console.error('Error deleting order:', error);
            showToast('Failed to delete order', 'error');
        }
    }
}

/**
 * Delete admin user
 */
async function deleteAdminUser(userId) {
    // Validate session first
    const isValidSession = await validateSession();
    if (!isValidSession) {
        showToast('Session expired. Please login again.', 'error');
        return;
    }
    
    // Check if user is admin
    if (!isAdmin()) {
        showToast('Access denied. Admin privileges required.', 'error');
        return;
    }
    
    if (confirm('Are you sure you want to delete this user?')) {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                loadAdminUsers();
                showToast('User deleted successfully!', 'success');
            } else if (response.status === 403) {
                showToast('Access denied. Admin privileges required.', 'error');
            } else {
                showToast('Failed to delete user', 'error');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            showToast('Failed to delete user', 'error');
        }
    }
}

// Add admin tab event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Admin tab clicks
    const adminTabs = document.querySelectorAll('#adminTabs .nav-link');
    adminTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetId = this.getAttribute('data-bs-target').substring(1);
            
            // Load data based on tab
            switch(targetId) {
                case 'dashboard':
                    loadAdminData();
                    break;
                case 'products':
                    loadAdminProducts();
                    break;
                case 'orders':
                    loadAdminOrders();
                    break;
                case 'users':
                    loadAdminUsers();
                    break;
            }
        });
    });
});

