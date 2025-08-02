const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://tranchikienk39:chikien181025@cluster0.0ebmvej.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Import User Model
const User = require('./models/User');

async function createAdminUser() {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        console.log('✅ Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@asm.com' });
        
        if (existingAdmin) {
            console.log('⚠️ Admin user already exists!');
            console.log('Email: admin@asm.com');
            console.log('Password: admin123');
            return;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash('admin123', 10);

        // Create admin user
        const adminUser = new User({
            email: 'admin@asm.com',
            password: hashedPassword,
            fullname: 'Admin User',
            phone: '0123456789',
            address: 'Admin Address',
            location: 'Admin Location',
            isAdmin: true
        });

        await adminUser.save();

        console.log('✅ Admin user created successfully!');
        console.log('📧 Email: admin@asm.com');
        console.log('🔑 Password: admin123');
        console.log('🔗 Admin Dashboard: http://localhost:3000/admin');
        console.log('🌐 Live Admin Dashboard: https://asm-website-production.up.railway.app/admin');

    } catch (error) {
        console.error('❌ Error creating admin user:', error);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 MongoDB connection closed');
    }
}

// Run the script
createAdminUser(); 