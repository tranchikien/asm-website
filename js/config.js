// ===== API CONFIGURATION =====

// API Base URL - Thay đổi URL này khi deploy
const API_BASE_URL = 'https://asm-website-production.up.railway.app';

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
        
        const data = await response.json();
        console.log('📥 Response data:', data);
        
        if (!response.ok) {
            throw new Error(data.message || 'API call failed');
        }
        
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