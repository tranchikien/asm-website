const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://tranchikienk39:chikien181025@cluster0.0ebmvej.mongodb.net/test?retryWrites=true&w=majority';

// Import User Model
const User = require('./models/User');

async function resetAdminPassword() {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        console.log('✅ Connected to MongoDB');

        // Find admin user
        const adminUser = await User.findOne({ email: 'admin@asm.com' });
        
        if (!adminUser) {
            console.log('❌ Admin user not found! Creating new admin...');
            
            // Hash password
            const hashedPassword = await bcrypt.hash('admin123', 10);

            // Create admin user
            const newAdminUser = new User({
                email: 'admin@asm.com',
                password: hashedPassword,
                fullname: 'Admin User',
                phone: '0123456789',
                address: 'Admin Address',
                location: 'Admin Location',
                isAdmin: true
            });

            await newAdminUser.save();
            console.log('✅ New admin user created successfully!');
        } else {
            console.log('✅ Admin user found! Resetting password...');
            
            // Hash new password
            const hashedPassword = await bcrypt.hash('admin123', 10);
            
            // Update password and ensure isAdmin is true
            adminUser.password = hashedPassword;
            adminUser.isAdmin = true;
            
            await adminUser.save();
            console.log('✅ Admin password reset successfully!');
        }

        console.log('📧 Email: admin@asm.com');
        console.log('🔑 Password: admin123');
        console.log('👑 isAdmin: true');

    } catch (error) {
        console.error('❌ Error resetting admin password:', error);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 MongoDB connection closed');
    }
}

// Run the script
resetAdminPassword(); 