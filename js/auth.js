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
                isAdminType: typeof user.isAdmin,
                token: token ? 'Present' : 'Missing'
            });

            // Save current user session and token
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('authToken', token);

            console.log('💾 Saved to localStorage:', {
                user: JSON.parse(localStorage.getItem('user')),
                token: localStorage.getItem('authToken') ? 'Present' : 'Missing'
            });

            showToast('Đăng nhập thành công!', 'success');

            // Update UI immediately
            updateUserDropdown();

            // Force update admin menu with delay to ensure DOM is ready
            setTimeout(() => {
                console.log('🔄 Forcing admin menu update after login...');
                updateAdminMenu();
            }, 100);

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

    // Show loading
    const registerBtn = document.querySelector('#registerForm button[type="submit"]');
    const originalText = registerBtn.innerHTML;
    registerBtn.innerHTML = '<span class="loading"></span> Đang đăng ký...';
    registerBtn.disabled = true;

    // Register user (async)
    registerUser({
        email: email,
        password: password,
        fullname: username,
        phone: phone,
        birthday: birthday,
        address: address,
        location: ''
    }).then(result => {
        if (result.success) {
            // Registration successful
            showToast(result.message, 'success');

            // Clear form
            document.getElementById('registerForm').reset();

            // Close modal
            const registerModal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
            if (registerModal) registerModal.hide();

            // Show login modal
            const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
            loginModal.show();
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

function logout() {
    // Clear session data
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    localStorage.removeItem('cart');

    // Update UI
    updateUserDropdown();

    // Show logout message
    showToast('Đã đăng xuất thành công!', 'success');

    // Redirect to home page
    showHomePage();
}

function isLoggedIn() {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('authToken');
    return !!(user && token);
}

function getCurrentUser() {
    const user = localStorage.getItem('user');
    if (!user) return null;

    try {
        return JSON.parse(user);
    } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
    }
}

function updateUserProfile(userData) {
    // Update user data in localStorage
    const currentUser = getCurrentUser();
    if (currentUser) {
        const updatedUser = { ...currentUser, ...userData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        updateUserDropdown();
    }
}

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

        // Update admin menu
        updateAdminMenu();
    } else {
        // User is not logged in - show login/register, hide user dropdown
        if (loginBtn) loginBtn.style.display = 'inline-block';
        if (registerBtn) registerBtn.style.display = 'inline-block';
        if (userDropdown) userDropdown.style.display = 'none';

        // Clear any stale data
        if (!token) {
            localStorage.removeItem('user');
        }
    }
}

/**
 * Validate current session and refresh user data if needed
 */
async function validateSession() {
    const user = getCurrentUser();
    const token = localStorage.getItem('authToken');

    if (!user || !token) {
        // Clear any stale data
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
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
            localStorage.setItem('user', JSON.stringify(data.user));
            console.log('✅ Session validated successfully');
            return true;
        } else {
            // Token is invalid, clear session
            console.log('❌ Session validation failed, clearing data');
            localStorage.removeItem('user');
            localStorage.removeItem('authToken');
            updateUserDropdown();
            return false;
        }
    } catch (error) {
        console.error('Session validation error:', error);
        // On network error, clear session to be safe
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
        updateUserDropdown();
        return false;
    }
}

// ===== DEBUG FUNCTIONS =====

/**
 * Debug function to check localStorage
 */
function debugLocalStorage() {
    console.log('=== LOCAL STORAGE DEBUG ===');
    console.log('All localStorage:', localStorage);

    const user = getCurrentUser();
    const token = localStorage.getItem('authToken');

    console.log('🔍 Session Debug:', {
        user: user,
        token: token ? 'Present' : 'Missing',
        isLoggedIn: isLoggedIn()
    });
}

/**
 * Clear all data (for testing)
 */
function clearAllData() {
    localStorage.clear();
    console.log('🧹 All localStorage data cleared');
    updateUserDropdown();
}

/**
 * Cleanup session data
 */
function cleanupSessionData() {
    const user = getCurrentUser();
    const token = localStorage.getItem('authToken');

    if (!user || !token) {
        // Clear any stale data
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
        console.log('🧹 Cleaned up stale session data');
    }

    updateUserDropdown();
}

// ===== ADMIN FUNCTIONS =====

/**
 * Check if current user is admin
 */
function isAdmin() {
    const user = getCurrentUser();
    const token = localStorage.getItem('authToken');

    if (!user || !token) {
        console.log('🔍 Admin Check: No user or token');
        return false;
    }

    const isAdminUser = user.isAdmin === true;

    console.log('🔍 Admin Check:', {
        user: user.email,
        isAdmin: isAdminUser,
        hasToken: !!token,
        userIsAdminField: user.isAdmin,
        userIsAdminType: typeof user.isAdmin
    });

    return isAdminUser;
}

/**
 * Update admin menu visibility
 */
function updateAdminMenu() {
    const adminMenu = document.getElementById('admin-menu');
    const isAdminUser = isAdmin();

    console.log('🔧 Update Admin Menu:', {
        adminMenu: adminMenu ? 'Found' : 'Not found',
        isAdmin: isAdminUser,
        display: isAdminUser ? 'block' : 'none'
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
    if (!isAdmin()) {
        showToast('Access denied. Admin privileges required.', 'error');
        return;
    }

    const modal = new bootstrap.Modal(document.getElementById('adminPanelModal'));
    modal.show();

    // Load admin data
    loadAdminData();
}

/**
 * Load admin dashboard data
 */
async function loadAdminData() {
    if (!isAdmin()) {
        showToast('Access denied. Admin privileges required.', 'error');
        return;
    }

    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${API_BASE_URL}/api/admin/dashboard/stats`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            updateAdminStats(data);
            updateRecentOrders(data.recentOrders || []);
        } else {
            showToast('Failed to load admin data', 'error');
        }
    } catch (error) {
        console.error('Error loading admin data:', error);
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
    document.getElementById('admin-total-revenue').textContent = `${stats.totalRevenue || 0} VNĐ`;
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
            <td>${order.totalAmount} VNĐ</td>
            <td><span class="badge bg-${order.status === 'completed' ? 'success' : order.status === 'pending' ? 'warning' : 'secondary'}">${order.status}</span></td>
            <td>${new Date(order.createdAt).toLocaleDateString()}</td>
        `;
        tbody.appendChild(row);
    });
}

/**
 * Show admin products section
 */
function showAdminProducts() {
    switchAdminSection('products');
    loadAdminProducts();
}

/**
 * Show admin orders section
 */
function showAdminOrders() {
    switchAdminSection('orders');
    loadAdminOrders();
}

/**
 * Show admin users section
 */
function showAdminUsers() {
    switchAdminSection('users');
    loadAdminUsers();
}

/**
 * Switch admin section
 */
function switchAdminSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.tab-pane').forEach(section => {
        section.classList.remove('show', 'active');
    });

    // Show selected section
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.classList.add('show', 'active');
    }

    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });

    const activeNavLink = document.querySelector(`[data-bs-target="#${sectionId}"]`);
    if (activeNavLink) {
        activeNavLink.classList.add('active');
    }
}

/**
 * Load admin products
 */
async function loadAdminProducts() {
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
            const products = await response.json();
            displayAdminProducts(products);
        } else {
            showToast('Failed to load products', 'error');
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
            <td>${product.price} VNĐ</td>
            <td>${product.isSale ? `${product.salePercentage}%` : 'No'}</td>
            <td>
                <button class="btn btn-warning btn-sm me-1" onclick="editProduct('${product._id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteAdminProduct('${product._id}')">
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
            const orders = await response.json();
            displayAdminOrders(orders);
        } else {
            showToast('Failed to load orders', 'error');
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
            <td>${order.totalAmount} VNĐ</td>
            <td>
                <select class="form-select form-select-sm" onchange="updateAdminOrderStatus('${order._id}', this.value)">
                    <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                    <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Processing</option>
                    <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Shipped</option>
                    <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                    <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                </select>
            </td>
            <td>${new Date(order.createdAt).toLocaleDateString()}</td>
            <td>
                <button class="btn btn-danger btn-sm" onclick="deleteAdminOrder('${order._id}')">
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
    if (!isAdmin()) {
        showToast('Access denied. Admin privileges required.', 'error');
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
        } else {
            showToast('Failed to load users', 'error');
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
                <button class="btn btn-danger btn-sm" onclick="deleteAdminUser('${user._id}')">
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
 * Delete admin product
 */
async function deleteAdminProduct(productId) {
    if (!isAdmin()) {
        showToast('Access denied. Admin privileges required.', 'error');
        return;
    }

    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${API_BASE_URL}/api/admin/products/${productId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            showToast('Product deleted successfully', 'success');
            loadAdminProducts();
        } else {
            showToast('Failed to delete product', 'error');
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        showToast('Error deleting product', 'error');
    }
}

/**
 * Update admin order status
 */
async function updateAdminOrderStatus(orderId, status) {
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
            showToast('Order status updated successfully', 'success');
            loadAdminOrders();
        } else {
            showToast('Failed to update order status', 'error');
        }
    } catch (error) {
        console.error('Error updating order status:', error);
        showToast('Error updating order status', 'error');
    }
}

/**
 * Delete admin order
 */
async function deleteAdminOrder(orderId) {
    if (!isAdmin()) {
        showToast('Access denied. Admin privileges required.', 'error');
        return;
    }

    if (!confirm('Are you sure you want to delete this order?')) return;

    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${API_BASE_URL}/api/admin/orders/${orderId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            showToast('Order deleted successfully', 'success');
            loadAdminOrders();
        } else {
            showToast('Failed to delete order', 'error');
        }
    } catch (error) {
        console.error('Error deleting order:', error);
        showToast('Error deleting order', 'error');
    }
}

/**
 * Delete admin user
 */
async function deleteAdminUser(userId) {
    if (!isAdmin()) {
        showToast('Access denied. Admin privileges required.', 'error');
        return;
    }

    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            showToast('User deleted successfully', 'success');
            loadAdminUsers();
        } else {
            showToast('Failed to delete user', 'error');
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        showToast('Error deleting user', 'error');
    }
}

// Predefined admin credentials
const ADMIN_CREDENTIALS = {
    email: 'admin@kienstore.com',
    password: 'admin123', // In production, use proper hashing
    role: 'admin'
};

function login(email, password) {
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Lưu token và thông tin user
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            // Kiểm tra và hiển thị Admin Panel nếu là admin
            if (data.user.isAdmin) {
                document.getElementById('admin-menu').style.display = 'block';
            } else {
                document.getElementById('admin-menu').style.display = 'none';
            }

            return true;
        }
        return false;
    } catch (error) {
        console.error('Login error:', error);
        return false;
    }
}

// Thêm function kiểm tra quyền admin
function checkAdminStatus() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.isAdmin) {
        document.getElementById('admin-menu').style.display = 'block';
    } else {
        document.getElementById('admin-menu').style.display = 'none';
    }
}

// Thêm function này vào document ready
document.addEventListener('DOMContentLoaded', () => {
    checkAdminStatus();
});

// ===== FORM EVENT LISTENERS =====

document.getElementById('loginForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    handleLogin();
});

document.getElementById('registerForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    handleRegister();
});

// ===== INITIALIZATION =====

// Check login status when page loads
document.addEventListener('DOMContentLoaded', function () {
    updateUserDropdown();
});

