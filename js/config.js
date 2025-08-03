// ===== API CONFIGURATION =====

// API Base URL - Tự động detect environment
const API_BASE_URL = (() => {
    const hostname = window.location.hostname;
    const port = window.location.port;
    
    // Local development
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return `http://localhost:${port || '3000'}`;
    }
    
    // Production - Railway backend
    return 'https://asm-website-production.up.railway.app';
})();

console.log('🌐 API Base URL:', API_BASE_URL);

// API Endpoints
const API_ENDPOINTS = {
    // Auth endpoints
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    
    // User endpoints
    GET_PROFILE: '/api/users/profile',
    UPDATE_PROFILE: '/api/users/profile',
    
    // Product endpoints
    GET_PRODUCTS: '/api/products',
    GET_PRODUCT: '/api/products',
    
    // Order endpoints
    CREATE_ORDER: '/api/orders',
    GET_ORDERS: '/api/orders'
};

// Helper function to get full API URL
function getApiUrl(endpoint) {
    return `${API_BASE_URL}${endpoint}`;
}

// Helper function for API calls
async function apiCall(endpoint, options = {}) {
    const url = getApiUrl(endpoint);
    
    console.log('🌐 API Call:', {
        url: url,
        method: options.method || 'GET',
        endpoint: endpoint,
        hasBody: !!options.body
    });
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
        ...options
    };
    
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
        defaultOptions.headers['Authorization'] = `Bearer ${token}`;
    }
    
    try {
        console.log('📤 Sending request to:', url);
        const response = await fetch(url, defaultOptions);
        console.log('📥 Response status:', response.status);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('📥 Response data:', data);
        
        return data;
    } catch (error) {
        console.error('❌ API Error:', error);
        console.error('❌ Error details:', {
            message: error.message,
            stack: error.stack
        });
        throw error;
    }
}