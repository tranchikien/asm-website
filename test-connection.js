const mongoose = require('mongoose');
require('dotenv').config();

// Test different connection strings
const connectionStrings = [
    // Current one
    'mongodb+srv://tranchikienk39:chikien181025@cluster0.0ebmvej.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    
    // With test database
    'mongodb+srv://tranchikienk39:chikien181025@cluster0.0ebmvej.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0',
    
    // Without appName
    'mongodb+srv://tranchikienk39:chikien181025@cluster0.0ebmvej.mongodb.net/?retryWrites=true&w=majority',
    
    // From environment variable
    process.env.MONGODB_URI
];

async function testConnections() {
    console.log('🔍 Testing MongoDB connections...\n');
    
    for (let i = 0; i < connectionStrings.length; i++) {
        const uri = connectionStrings[i];
        if (!uri) continue;
        
        console.log(`📋 Test ${i + 1}: ${uri.substring(0, 50)}...`);
        
        try {
            await mongoose.connect(uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                serverSelectionTimeoutMS: 5000
            });
            
            console.log(`✅ Test ${i + 1}: SUCCESS`);
            console.log(`📊 Database: ${mongoose.connection.name}`);
            console.log(`🌐 Host: ${mongoose.connection.host}\n`);
            
            await mongoose.connection.close();
            
        } catch (error) {
            console.log(`❌ Test ${i + 1}: FAILED`);
            console.log(`   Error: ${error.message}\n`);
        }
    }
}

testConnections(); 