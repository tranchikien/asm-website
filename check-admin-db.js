const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://tranchikienk39:chikien181025@cluster0.0ebmvej.mongodb.net/test?retryWrites=true&w=majority';

// Import User Model
const User = require('./models/User');

async function checkAdminUser() {
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
            console.log('❌ Admin user not found!');
            return;
        }

        console.log('✅ Admin user found!');
        console.log('📧 Email:', adminUser.email);
        console.log('👤 Fullname:', adminUser.fullname);
        console.log('👑 isAdmin:', adminUser.isAdmin);
        console.log('🔍 isAdmin type:', typeof adminUser.isAdmin);
        console.log('📅 Created:', adminUser.createdAt);
        console.log('🔄 Updated:', adminUser.updatedAt);
        
        // Check all fields
        console.log('\n🔍 All user fields:');
        console.log(JSON.stringify(adminUser.toObject(), null, 2));

    } catch (error) {
        console.error('❌ Error checking admin user:', error);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 MongoDB connection closed');
    }
}

// Run the script
checkAdminUser(); 