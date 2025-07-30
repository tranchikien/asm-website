// ===== AUTH FUNCTIONS =====

/**
 * Get registered users from localStorage
 */
function getRegisteredUsers() {
    const users = localStorage.getItem('registeredUsers');
    return users ? JSON.parse(users) : [];
}

/**
 * Save registered users to localStorage
 */
function saveRegisteredUsers(users) {
    localStorage.setItem('registeredUsers', JSON.stringify(users));
}

/**
 * Check if email already exists
 */
function isEmailExists(email) {
    const users = getRegisteredUsers();
    return users.find(user => user.email === email);
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
                fullName: userData.fullname,
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
            
            // Save current user session and token
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('authToken', token);
            
            showToast('Đăng nhập thành công!', 'success');
            
            // Update UI immediately
            updateUserDropdown();
            
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
    // Clear user data
    localStorage.removeItem('user');
    
    // Update UI immediately
    updateUserDropdown();
    
    // Clear cart
    cart = [];
    updateCartDisplay();
    saveCartToStorage();
    
    showToast('Đã đăng xuất thành công', 'success');
    
    // Ẩn modal tài khoản nếu đang mở
    const profileModal = bootstrap.Modal.getInstance(document.getElementById('profileModal'));
    if (profileModal) profileModal.hide();
}

/**
 * Check if user is logged in
 */
function isLoggedIn() {
    return localStorage.getItem('user') !== null;
}

/**
 * Get current user
 */
function getCurrentUser() {
    const userData = localStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;
    console.log('getCurrentUser() called, result:', user);
    return user;
}

/**
 * Update user profile
 */
function updateUserProfile(userData) {
    localStorage.setItem('user', JSON.stringify(userData));
    showToast('Cập nhật thông tin thành công!', 'success');
} 

function isAdmin() {
    const user = getCurrentUser();
    return user && user.email === 'admin@kienstore.com';
}
/**
 * Update user dropdown visibility
 */
function updateUserDropdown() {
    const user = getCurrentUser();
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const userDropdown = document.getElementById('user-dropdown');
    
    if (user) {
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
        
        // Hide admin button
        const adminBtn = document.getElementById('admin-btn');
        if (adminBtn) adminBtn.style.display = 'none';
    }
}

function updateAdminUI() {
    let adminBtn = document.getElementById('admin-btn');
    if (!adminBtn) {
        // Thêm nút vào navbar nếu chưa có
        const nav = document.querySelector('.navbar .d-flex.align-items-center');
        if (nav) {
            adminBtn = document.createElement('button');
            adminBtn.id = 'admin-btn';
            adminBtn.className = 'btn btn-outline-warning btn-sm me-2 hover-lift';
            adminBtn.innerHTML = '<i class="fas fa-cogs me-1"></i>Quản trị';
            adminBtn.style.display = 'none';
            adminBtn.onclick = function() { showProductAdminPage(); };
            nav.appendChild(adminBtn);
        }
    }
    if (isAdmin()) {
        adminBtn.style.display = 'inline-block';
    } else if (adminBtn) {
        adminBtn.style.display = 'none';
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
    if (user) {
        console.log('✅ User is logged in:');
        console.log('  - Email:', user.email);
        console.log('  - Name:', user.fullname);
        console.log('  - Phone:', user.phone);
        console.log('  - Address:', user.address);
        console.log('  - Birthday:', user.birthday);
    } else {
        console.log('❌ No user logged in');
    }
    
    // Check other stored data
    const cart = localStorage.getItem('cart');
    if (cart) {
        console.log('🛒 Cart data:', JSON.parse(cart));
    }
    
    const wishlist = localStorage.getItem('wishlist');
    if (wishlist) {
        console.log('❤️ Wishlist data:', JSON.parse(wishlist));
    }
    
    console.log('=== END DEBUG ===');
}

/**
 * Clear all localStorage data
 */
function clearAllData() {
    if (confirm('Bạn có chắc muốn xóa tất cả dữ liệu? (Đăng xuất, xóa giỏ hàng, wishlist...)')) {
        localStorage.clear();
        console.log('🗑️ All localStorage data cleared');
        location.reload(); // Reload trang để cập nhật UI
    }
}

// Thêm vào global scope để có thể gọi từ console
window.debugLocalStorage = debugLocalStorage;
window.debugUI = debugUI;
window.testProfileModal = testProfileModal;
window.testWishlist = testWishlist;
window.testOrderHistory = testOrderHistory;
window.testAddToWishlist = testAddToWishlist;
window.testCoupon = testCoupon;
window.clearAllData = clearAllData;

