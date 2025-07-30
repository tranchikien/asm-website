// ===== API CONFIGURATION =====

// API Base URL - Thay đổi URL này khi deploy
const API_BASE_URL = 'https://asm-website.railway.app';

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
        const response = await fetch(url, defaultOptions);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'API call failed');
        }
        
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
} 