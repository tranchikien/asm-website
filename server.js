const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
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
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://tranchikienk39:chikien181025@cluster0.0ebmvej.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI environment variable is not set!');
    console.error('Please set MONGODB_URI in your Railway environment variables.');
    process.exit(1);
}

console.log('🔗 Attempting to connect to MongoDB...');
console.log('📋 Connection string format check:', MONGODB_URI.includes('mongodb+srv://') ? '✅ Atlas format' : '❌ Wrong format');

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
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

// User Schema
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullname: String,
    phone: String,
    address: String,
    birthday: Date,
    location: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Product Schema
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    originalPrice: Number,
    category: String,
    platform: String,
    imageUrl: String,
    isSale: { type: Boolean, default: false },
    salePercentage: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

// Order Schema
const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: Number,
        price: Number
    }],
    totalAmount: Number,
    paymentMethod: String,
    status: { type: String, default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);
const Order = mongoose.model('Order', orderSchema);

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
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error' });
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
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
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
        const products = await Product.find();
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

// Order Routes
app.post('/api/orders', authenticateToken, async (req, res) => {
    try {
        const { items, totalAmount, paymentMethod } = req.body;
        
        const order = new Order({
            userId: req.user.userId,
            items,
            totalAmount,
            paymentMethod
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

app.get('/api/orders', authenticateToken, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.userId })
            .populate('items.productId')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Serve frontend
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
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
    console.log(`Server running on port ${PORT}`);
    console.log(`Frontend: http://localhost:${PORT}`);
    console.log(`API: http://localhost:${PORT}/api`);
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