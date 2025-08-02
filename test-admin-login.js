const fetch = require('node-fetch');

async function testAdminLogin() {
    try {
        console.log('🧪 Testing Admin Login API...');
        
        const response = await fetch('https://asm-website-production.up.railway.app/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'admin@asm.com',
                password: 'admin123'
            })
        });
        
        console.log('📡 Response Status:', response.status);
        console.log('📡 Response Headers:', response.headers.raw());
        
        const data = await response.json();
        console.log('📦 Response Data:', JSON.stringify(data, null, 2));
        
        if (data.user) {
            console.log('🔍 User Object Analysis:');
            console.log('  - hasIsAdmin:', 'isAdmin' in data.user);
            console.log('  - isAdmin value:', data.user.isAdmin);
            console.log('  - isAdmin type:', typeof data.user.isAdmin);
            console.log('  - All user fields:', Object.keys(data.user));
        }
        
    } catch (error) {
        console.error('❌ Error testing admin login:', error);
    }
}

testAdminLogin(); 