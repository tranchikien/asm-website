const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

const router = express.Router();

// Admin authentication middleware
const authenticateAdmin = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        
        if (!user || !user.isAdmin) {
            return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
        }

        req.admin = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token.' });
    }
};

// Admin Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find admin user
        const admin = await User.findOne({ email, isAdmin: true });
        if (!admin) {
            return res.status(401).json({ message: 'Invalid admin credentials' });
        }

        // Check password
        const isValidPassword = await bcrypt.compare(password, admin.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid admin credentials' });
        }

        // Generate admin token
        const token = jwt.sign(
            { userId: admin._id, isAdmin: true },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Admin login successful',
            token,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                isAdmin: admin.isAdmin
            }
        });
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin Dashboard Stats
router.get('/dashboard/stats', authenticateAdmin, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ isAdmin: false });
        const totalProducts = await Product.countDocuments();
        const totalOrders = await Order.countDocuments();
        
        // Calculate total revenue
        const orders = await Order.find({ status: { $in: ['delivered', 'shipped'] } });
        const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
        
        // Recent orders
        const recentOrders = await Order.find()
            .populate('userId', 'name email')
            .populate('items.productId', 'name')
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            stats: {
                totalUsers,
                totalProducts,
                totalOrders,
                totalRevenue: totalRevenue.toFixed(2)
            },
            recentOrders
        });
    } catch (error) {
        console.error('Get dashboard stats error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin: Get all users
router.get('/users', authenticateAdmin, async (req, res) => {
    try {
        const { search, sort } = req.query;
        let query = { isAdmin: false };
        
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }
        
        let users = await User.find(query).select('-password');
        
        if (sort === 'name') {
            users = users.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sort === 'date') {
            users = users.sort((a, b) => b.createdAt - a.createdAt);
        }
        
        res.json(users);
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin: Delete user
router.delete('/users/:id', authenticateAdmin, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin: Get all products with enhanced features
router.get('/products', authenticateAdmin, async (req, res) => {
    try {
        const { category, platform, search, sort, page = 1, limit = 10 } = req.query;
        let query = {};
        
        if (category) query.category = category;
        if (platform) query.platform = platform;
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }
        
        const skip = (page - 1) * limit;
        
        let products = await Product.find(query)
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });
            
        if (sort === 'price-asc') {
            products = products.sort((a, b) => a.price - b.price);
        } else if (sort === 'price-desc') {
            products = products.sort((a, b) => b.price - a.price);
        } else if (sort === 'name') {
            products = products.sort((a, b) => a.name.localeCompare(b.name));
        }
        
        const total = await Product.countDocuments(query);
        
        res.json({
            products,
            pagination: {
                current: parseInt(page),
                total: Math.ceil(total / limit),
                totalItems: total
            }
        });
    } catch (error) {
        console.error('Get admin products error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin: Get all orders with enhanced features
router.get('/orders', authenticateAdmin, async (req, res) => {
    try {
        const { status, userId, search, sort, page = 1, limit = 10 } = req.query;
        let query = {};
        
        if (status) query.status = status;
        if (userId) query.userId = userId;
        if (search) {
            // Search by user name or email
            const users = await User.find({
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ]
            });
            const userIds = users.map(user => user._id);
            query.userId = { $in: userIds };
        }
        
        const skip = (page - 1) * limit;
        
        let orders = await Order.find(query)
            .populate('userId', 'name email')
            .populate('items.productId', 'name price')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });
            
        if (sort === 'amount-desc') {
            orders = orders.sort((a, b) => b.totalAmount - a.totalAmount);
        } else if (sort === 'amount-asc') {
            orders = orders.sort((a, b) => a.totalAmount - b.totalAmount);
        }
        
        const total = await Order.countDocuments(query);
        
        res.json({
            orders,
            pagination: {
                current: parseInt(page),
                total: Math.ceil(total / limit),
                totalItems: total
            }
        });
    } catch (error) {
        console.error('Get admin orders error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin: Update order status
router.put('/orders/:id/status', authenticateAdmin, async (req, res) => {
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
        ).populate('userId', 'name email')
         .populate('items.productId', 'name price');
        
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

// Admin: Delete order
router.delete('/orders/:id', authenticateAdmin, async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        console.error('Delete order error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 