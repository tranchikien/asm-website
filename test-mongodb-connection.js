const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://kienstore:kienstore123@cluster0.mongodb.net/kienstore?retryWrites=true&w=majority';

console.log('🔗 Testing MongoDB Connection...');
console.log('📋 Connection string:', MONGODB_URI);

// User Schema
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullname: String,
    phone: String,
    address: String,
    birthday: Date,
    location: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

async function testMongoDB() {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        
        console.log('✅ MongoDB connected successfully!');
        console.log('📊 Database:', mongoose.connection.name);
        console.log('🌐 Host:', mongoose.connection.host);
        
        // Test creating a user
        const testUser = new User({
            email: `test${Date.now()}@example.com`,
            password: 'hashedpassword123',
            fullname: 'Test User',
            phone: '0123456789',
            address: 'Test Address',
            location: 'Test Location'
        });
        
        console.log('📝 Attempting to save test user...');
        const savedUser = await testUser.save();
        console.log('✅ User saved successfully!');
        console.log('👤 User ID:', savedUser._id);
        console.log('📧 Email:', savedUser.email);
        
        // Test finding users
        const users = await User.find({});
        console.log('📊 Total users in database:', users.length);
        
        // Clean up - delete test user
        await User.findByIdAndDelete(savedUser._id);
        console.log('🧹 Test user cleaned up');
        
    } catch (error) {
        console.error('❌ MongoDB test failed:', error.message);
        console.error('🔍 Error details:', {
            name: error.name,
            code: error.code,
            message: error.message
        });
    } finally {
        await mongoose.disconnect();
        console.log('🔌 MongoDB disconnected');
    }
}

testMongoDB(); 