const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://tranchikienk39:chikien181025@cluster0.0ebmvej.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// User Schema
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    fullname: String,
    phone: String,
    address: String,
    birthday: Date,
    location: String,
    isAdmin: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', userSchema);

async function createAdminUser() {
    try {
        console.log('🔗 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@kienstore.com' });
        if (existingAdmin) {
            console.log('❌ Admin user already exists');
            console.log('Email: admin@kienstore.com');
            console.log('Password: admin123');
            return;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash('admin123', 10);

        // Create admin user
        const adminUser = new User({
            email: 'admin@kienstore.com',
            password: hashedPassword,
            fullname: 'Admin User',
            phone: '0123456789',
            address: 'Admin Address',
            location: 'Admin Location',
            isAdmin: true
        });

        await adminUser.save();
        console.log('✅ Admin user created successfully!');
        console.log('Email: admin@kienstore.com');
        console.log('Password: admin123');
        console.log('isAdmin: true');

    } catch (error) {
        console.error('❌ Error creating admin user:', error);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');
    }
}

// Run the script
createAdminUser(); 