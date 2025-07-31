const mongoose = require('mongoose');
require('dotenv').config();

// Test MongoDB Connection
async function testMongoConnection() {
    const MONGODB_URI = process.env.MONGODB_URI;
    
    console.log('🔍 Testing MongoDB Connection...');
    console.log('📋 MONGODB_URI exists:', !!MONGODB_URI);
    
    if (!MONGODB_URI) {
        console.error('❌ MONGODB_URI is not set!');
        return;
    }
    
    // Check URI format
    if (!MONGODB_URI.includes('mongodb+srv://')) {
        console.error('❌ URI format is wrong! Should be mongodb+srv://...');
        return;
    }
    
    console.log('✅ URI format is correct');
    
    try {
        console.log('🔗 Attempting to connect...');
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 10000
        });
        
        console.log('✅ Successfully connected to MongoDB!');
        console.log('📊 Database:', mongoose.connection.name);
        console.log('🌐 Host:', mongoose.connection.host);
        
        // Test creating a collection
        const testCollection = mongoose.connection.collection('test');
        await testCollection.insertOne({ test: true, timestamp: new Date() });
        console.log('✅ Database write test successful');
        
        await mongoose.connection.close();
        console.log('✅ Connection closed successfully');
        
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        console.error('🔍 Error details:', {
            name: error.name,
            code: error.code
        });
        
        if (error.name === 'MongoServerSelectionError') {
            console.error('💡 This usually means:');
            console.error('   - Wrong username/password');
            console.error('   - IP not whitelisted');
            console.error('   - Cluster is down');
        }
    }
}

// Run test
testMongoConnection(); 