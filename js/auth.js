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

