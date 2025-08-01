const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://tranchikienk39:chikien181025@cluster0.0ebmvej.mongodb.net/asm-website?retryWrites=true&w=majority';

// User Schema
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullname: String,
    phone: String,
    address: String,
    birthday: Date,
    location: String,
    isAdmin: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

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