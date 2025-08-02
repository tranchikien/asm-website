const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://tranchikienk39:chikien181025@cluster0.0ebmvej.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Import User Model
const User = require('./models/User');

async function fixAdminUser() {
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
            console.log('✅ Admin user found! Checking isAdmin field...');
            console.log('Current admin user:', {
                email: adminUser.email,
                isAdmin: adminUser.isAdmin,
                isAdminType: typeof adminUser.isAdmin
            });
            
            // Check if isAdmin field exists and is true
            if (!adminUser.isAdmin) {
                console.log('⚠️ isAdmin field is false or missing. Setting to true...');
                adminUser.isAdmin = true;
                await adminUser.save();
                console.log('✅ isAdmin field updated to true');
            } else {
                console.log('✅ isAdmin field is already true');
            }
        }

        // Verify the final state
        const finalUser = await User.findOne({ email: 'admin@asm.com' });
        console.log('🔍 Final admin user state:', {
            email: finalUser.email,
            isAdmin: finalUser.isAdmin,
            isAdminType: typeof finalUser.isAdmin
        });

    } catch (error) {
        console.error('❌ Error fixing admin user:', error);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 MongoDB connection closed');
    }
}

// Run the script
fixAdminUser(); 