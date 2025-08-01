const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const adminRoutes = require('./admin');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: [
        'https://asm-website-nine.vercel.app',
        'https://asm-website-git-main-tranchikiens-projects.vercel.app',
        'https://asm-website-gi84065aw-tranchikiens-projects.vercel.app',
        'http://localhost:3000'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.static('.')); // Serve static files

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://tranchikienk39:chikien181025@cluster0.0ebmvej.mongodb.net/test?retryWrites=true&w=majority';

console.log('🔗 Attempting to connect to MongoDB...');
console.log('📋 Environment variables:');
console.log('   - MONGODB_URI from env:', process.env.MONGODB_URI ? 'SET' : 'NOT SET');
console.log('   - NODE_ENV:', process.env.NODE_ENV);

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000
})
.then(() => {
    console.log('✅ Successfully connected to MongoDB Atlas');
    console.log('📊 Database:', mongoose.connection.name);
    console.log('🌐 Host:', mongoose.connection.host);
})
.catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.error('🔍 Error details:', {
        name: err.name,
        code: err.code,
        message: err.message
    });
    
    if (err.name === 'MongoServerSelectionError') {
        console.error('💡 Possible solutions:');
        console.error('   1. Check if MONGODB_URI is correct');
        console.error('   2. Ensure IP whitelist includes 0.0.0.0/0');
        console.error('   3. Verify username/password in connection string');
    }
    
    process.exit(1);
});

// Keep MongoDB connection alive
mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
    console.log('⚠️ MongoDB disconnected');
});

mongoose.connection.on('connected', () => {
    console.log('✅ MongoDB connected');
});

mongoose.connection.on('reconnected', () => {
    console.log('🔄 MongoDB reconnected');
});

// Import Models
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

// JWT Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access token required' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

// Routes

// Handle preflight requests
app.options('*', cors());

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        cors: {
            allowedOrigins: [
                'https://asm-website-nine.vercel.app',
                'https://asm-website-git-main-tranchikiens-projects.vercel.app',
                'https://asm-website-gi84065aw-tranchikiens-projects.vercel.app',
                'http://localhost:3000'
            ]
        }
    });
});

// Authentication Routes
app.post('/api/auth/register', async (req, res) => {
    console.log('📝 Registration request received:', { email: req.body.email, fullname: req.body.fullname });
    try {
        const { email, password, fullname, phone, address, birthday, location } = req.body;

        // Validation
        if (!email || !password || !fullname) {
            console.log('❌ Validation failed: missing required fields');
            return res.status(400).json({ message: 'Email, password, and fullname are required' });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.log('❌ Invalid email format:', email);
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // Password validation
        if (password.length < 8) {
            console.log('❌ Password too short');
            return res.status(400).json({ message: 'Password must be at least 8 characters' });
        }

        console.log('🔍 Checking if user exists...');
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('❌ User already exists:', email);
            return res.status(400).json({ message: 'Email already exists' });
        }

        console.log('🔐 Hashing password...');
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        console.log('👤 Creating new user...');
        // Create new user
        const user = new User({
            email,
            password: hashedPassword,
            fullname,
            phone: phone || '',
            address: address || '',
            birthday: birthday || null,
            location: location || ''
        });

        console.log('💾 Saving user to database...');
        await user.save();
        console.log('✅ User saved successfully! ID:', user._id);

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                email: user.email,
                fullname: user.fullname,
                phone: user.phone,
                address: user.address,
                birthday: user.birthday,
                location: user.location
            }
        });
    } catch (error) {
        console.error('❌ Registration error:', error);
        console.error('🔍 Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
        res.status(500).json({ 
            message: 'Server error',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

app.post('/api/auth/login', async (req, res) => {
    console.log('🔐 Login request received:', { email: req.body.email });
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            console.log('❌ Validation failed: missing email or password');
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.log('❌ Invalid email format:', email);
            return res.status(400).json({ message: 'Invalid email format' });
        }

        console.log('🔍 Finding user in database...');
        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            console.log('❌ User not found:', email);
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        console.log('✅ User found, checking password...');
        // Check password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            console.log('❌ Invalid password for user:', email);
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        console.log('✅ Password valid, generating token...');

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                email: user.email,
                fullname: user.fullname,
                phone: user.phone,
                address: user.address,
                birthday: user.birthday,
                location: user.location
            }
        });
    } catch (error) {
        console.error('❌ Login error:', error);
        console.error('🔍 Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
        res.status(500).json({ 
            message: 'Server error',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// User Routes
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        console.error('Error getting users:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/api/users/profile', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.put('/api/users/profile', authenticateToken, async (req, res) => {
    try {
        const { fullname, phone, address, birthday, location } = req.body;
        
        const updatedUser = await User.findByIdAndUpdate(
            req.user.userId,
            {
                fullname,
                phone,
                address,
                birthday,
                location,
                updatedAt: Date.now()
            },
            { new: true }
        ).select('-password');

        res.json({
            message: 'Profile updated successfully',
            user: updatedUser
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Product Routes
app.get('/api/products', async (req, res) => {
    try {
        const { category, platform, search, sort } = req.query;
        let query = {};
        
        // Filter by category
        if (category) {
            query.category = category;
        }
        
        // Filter by platform
        if (platform) {
            query.platform = platform;
        }
        
        // Search by name
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }
        
        let products = await Product.find(query);
        
        // Sort products
        if (sort === 'price-asc') {
            products = products.sort((a, b) => a.price - b.price);
        } else if (sort === 'price-desc') {
            products = products.sort((a, b) => b.price - a.price);
        } else if (sort === 'name') {
            products = products.sort((a, b) => a.name.localeCompare(b.name));
        }
        
        res.json(products);
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin: Create product
app.post('/api/products', authenticateToken, async (req, res) => {
    try {
        const { name, description, price, originalPrice, category, platform, imageUrl, isSale, salePercentage } = req.body;
        
        const product = new Product({
            name,
            description,
            price,
            originalPrice: originalPrice || price,
            category,
            platform,
            imageUrl,
            isSale: isSale || false,
            salePercentage: salePercentage || 0
        });
        
        await product.save();
        
        res.status(201).json({
            message: 'Product created successfully',
            product
        });
    } catch (error) {
        console.error('Create product error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin: Update product
app.put('/api/products/:id', authenticateToken, async (req, res) => {
    try {
        const { name, description, price, originalPrice, category, platform, imageUrl, isSale, salePercentage } = req.body;
        
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                name,
                description,
                price,
                originalPrice: originalPrice || price,
                category,
                platform,
                imageUrl,
                isSale: isSale || false,
                salePercentage: salePercentage || 0
            },
            { new: true }
        );
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        res.json({
            message: 'Product updated successfully',
            product
        });
    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin: Delete product
app.delete('/api/products/:id', authenticateToken, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        res.json({
            message: 'Product deleted successfully',
            product
        });
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Order Routes
app.post('/api/orders', authenticateToken, async (req, res) => {
    try {
        const { items, totalAmount, paymentMethod } = req.body;
        
        // Validate items
        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'Order must contain at least one item' });
        }
        
        // Validate payment method
        if (!paymentMethod) {
            return res.status(400).json({ message: 'Payment method is required' });
        }
        
        const order = new Order({
            userId: req.user.userId,
            items,
            totalAmount,
            paymentMethod,
            status: 'pending'
        });

        await order.save();

        res.status(201).json({
            message: 'Order created successfully',
            order
        });
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user orders
app.get('/api/orders', authenticateToken, async (req, res) => {
    try {
        const { status, sort } = req.query;
        let query = { userId: req.user.userId };
        
        // Filter by status
        if (status) {
            query.status = status;
        }
        
        let orders = await Order.find(query)
            .populate('items.productId')
            .sort({ createdAt: -1 });
            
        // Sort orders
        if (sort === 'date-asc') {
            orders = orders.sort((a, b) => a.createdAt - b.createdAt);
        } else if (sort === 'amount-desc') {
            orders = orders.sort((a, b) => b.totalAmount - a.totalAmount);
        }
        
        res.json(orders);
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get specific order
app.get('/api/orders/:id', authenticateToken, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('items.productId')
            .populate('userId', '-password');
            
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        // Check if user owns this order
        if (order.userId.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Access denied' });
        }
        
        res.json(order);
    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin: Get all orders
app.get('/api/admin/orders', authenticateToken, async (req, res) => {
    try {
        const { status, userId, sort } = req.query;
        let query = {};
        
        // Filter by status
        if (status) {
            query.status = status;
        }
        
        // Filter by user
        if (userId) {
            query.userId = userId;
        }
        
        let orders = await Order.find(query)
            .populate('items.productId')
            .populate('userId', '-password')
            .sort({ createdAt: -1 });
            
        // Sort orders
        if (sort === 'date-asc') {
            orders = orders.sort((a, b) => a.createdAt - b.createdAt);
        } else if (sort === 'amount-desc') {
            orders = orders.sort((a, b) => b.totalAmount - a.totalAmount);
        }
        
        res.json(orders);
    } catch (error) {
        console.error('Get all orders error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin: Update order status
app.put('/api/admin/orders/:id/status', authenticateToken, async (req, res) => {
    try {
        const { status } = req.body;
        
        const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }
        
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        ).populate('items.productId')
         .populate('userId', '-password');
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        res.json({
            message: 'Order status updated successfully',
            order
        });
    } catch (error) {
        console.error('Update order status error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin routes
app.use('/api/admin', adminRoutes);

// Serve frontend
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Serve admin dashboard
app.get('/admin', (req, res) => {
    res.sendFile(__dirname + '/admin.html');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ message: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Start server
const server = app.listen(PORT, () => {
    console.log(`Server running on port 3000`);
    console.log(`Frontend: http://localhost:3000`);
    console.log(`API: http://localhost:3000/api`);
});

// Handle server errors
server.on('error', (error) => {
    console.error('Server error:', error);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
        console.log('Server closed');
        mongoose.connection.close(() => {
            console.log('MongoDB connection closed');
            process.exit(0);
        });
    });
}); 