const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB Connection
const MONGODB_URI = 'mongodb+srv://tranchikienk39:chikien181025@cluster0.0ebmvej.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// User Schema
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullname: { type: String, required: true },
    phone: String,
    address: String,
    birthday: String,
    location: String,
    isAdmin: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
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
            console.log('⚠️ Admin user already exists, updating...');
            await User.deleteOne({ email: 'admin@kienstore.com' });
            console.log('🗑️ Old admin user deleted');
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash('admin123', saltRounds);

        // Create new admin user
        const adminUser = new User({
            email: 'admin@kienstore.com',
            password: hashedPassword,
            fullname: 'Admin User',
            phone: '0123456789',
            address: 'Admin Address',
            birthday: '1990-01-01',
            location: 'Admin City',
            isAdmin: true
        });

        await adminUser.save();
        console.log('✅ Admin user created successfully!');
        console.log('📋 Admin credentials:');
        console.log('   Email: admin@kienstore.com');
        console.log('   Password: admin123');
        console.log('   isAdmin: true');

        // Verify the user was created correctly
        const savedAdmin = await User.findOne({ email: 'admin@kienstore.com' });
        console.log('🔍 Verification:');
        console.log('   User found:', !!savedAdmin);
        console.log('   isAdmin field:', savedAdmin.isAdmin);
        console.log('   isAdmin type:', typeof savedAdmin.isAdmin);

        mongoose.connection.close();
        console.log('🔌 MongoDB connection closed');

    } catch (error) {
        console.error('❌ Error creating admin user:', error);
        process.exit(1);
    }
}

createAdminUser(); 