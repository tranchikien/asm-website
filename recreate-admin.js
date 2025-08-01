const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://tranchikienk39:chikien181025@cluster0.0ebmvej.mongodb.net/test?retryWrites=true&w=majority';

// Import User Model
const User = require('./models/User');

async function recreateAdminUser() {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        console.log('✅ Connected to MongoDB');

        // Delete existing admin user
        const deleteResult = await User.deleteOne({ email: 'admin@asm.com' });
        console.log('🗑️ Deleted existing admin user:', deleteResult.deletedCount);

        // Hash password
        const hashedPassword = await bcrypt.hash('admin123', 10);

        // Create new admin user
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

        console.log('✅ New admin user created successfully!');
        console.log('📧 Email: admin@asm.com');
        console.log('🔑 Password: admin123');
        console.log('👑 isAdmin: true');
        
        // Verify the user was created correctly
        const verifyUser = await User.findOne({ email: 'admin@asm.com' });
        console.log('🔍 Verification:', {
            email: verifyUser.email,
            isAdmin: verifyUser.isAdmin,
            isAdminType: typeof verifyUser.isAdmin
        });

    } catch (error) {
        console.error('❌ Error recreating admin user:', error);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 MongoDB connection closed');
    }
}

// Run the script
recreateAdminUser(); 