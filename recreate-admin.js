const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB Connection
const MONGODB_URI = 'mongodb+srv://tranchikienk39:chikien181025@cluster0.0ebmvej.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

console.log('🔗 Connecting to MongoDB...');

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(async () => {
    console.log('✅ Connected to MongoDB');
    
    try {
        // Import User model
        const User = require('./models/User');
        
        // Delete existing admin user
        const deleteResult = await User.deleteOne({ email: 'admin@asm.com' });
        console.log('🗑️ Deleted existing admin user:', deleteResult);
        
        // Create new admin user with correct password
        const hashedPassword = await bcrypt.hash('admin123', 10);
        
        const adminUser = new User({
            email: 'admin@asm.com',
            password: hashedPassword,
            fullname: 'Admin User',
            phone: '0123456789',
            address: 'Admin Address',
            isAdmin: true
        });
        
        await adminUser.save();
        console.log('✅ New admin user created successfully!');
        console.log('📧 Email: admin@asm.com');
        console.log('🔑 Password: admin123');
        console.log('👑 IsAdmin: true');
        
        // Verify the user was created correctly
        const verifyUser = await User.findOne({ email: 'admin@asm.com' });
        console.log('🔍 Verification:', {
            email: verifyUser.email,
            isAdmin: verifyUser.isAdmin,
            hasPassword: !!verifyUser.password
        });
        
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 MongoDB connection closed');
    }
})
.catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
}); 