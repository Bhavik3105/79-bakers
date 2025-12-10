// scripts/testConnection.js
// Quick script to test MongoDB connection

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Manual env loading
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      process.env[key] = value;
    }
  });
}

const testConnection = async () => {
  console.log('🔍 Testing MongoDB Connection...\n');
  console.log('📍 MongoDB URI:', process.env.MONGODB_URI?.replace(/\/\/(.+):(.+)@/, '//****:****@') || 'NOT SET');
  console.log('');

  try {
    console.log('⏳ Attempting to connect...');
    
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000 // 5 second timeout
    });

    console.log('✅ MongoDB Connected Successfully!');
    console.log('📊 Connection Details:');
    console.log('   - Host:', mongoose.connection.host);
    console.log('   - Database:', mongoose.connection.name);
    console.log('   - Port:', mongoose.connection.port);
    console.log('   - Status:', mongoose.connection.readyState === 1 ? 'Connected' : 'Not Connected');
    console.log('');

    // List collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📦 Collections in database:', collections.length);
    if (collections.length > 0) {
      collections.forEach(col => {
        console.log('   -', col.name);
      });
    } else {
      console.log('   (No collections yet - database is empty)');
    }

    console.log('\n✨ Connection test completed successfully!');
    process.exit(0);

  } catch (error) {
    console.log('\n❌ MongoDB Connection Failed!');
    console.log('');
    console.log('Error Details:');
    console.log('   - Message:', error.message);
    console.log('   - Code:', error.code || 'N/A');
    console.log('');
    
    console.log('💡 Troubleshooting Tips:');
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('   1. MongoDB is not running. Start it with:');
      console.log('      - Windows: Open "Services" and start "MongoDB Server"');
      console.log('      - Or run: mongod');
      console.log('');
      console.log('   2. Install MongoDB from: https://www.mongodb.com/try/download/community');
    } else if (error.message.includes('authentication failed')) {
      console.log('   1. Check your username and password in MONGODB_URI');
      console.log('   2. Make sure the database user has proper permissions');
    } else if (error.message.includes('getaddrinfo ENOTFOUND')) {
      console.log('   1. Check your internet connection (if using MongoDB Atlas)');
      console.log('   2. Verify the cluster URL in MONGODB_URI');
    } else {
      console.log('   1. Check MONGODB_URI in .env.local file');
      console.log('   2. Make sure MongoDB is running');
      console.log('   3. Check firewall settings');
    }
    
    console.log('');
    console.log('📝 Current MongoDB URI format:');
    console.log('   Local: mongodb://localhost:27017/79bakers');
    console.log('   Atlas: mongodb+srv://username:password@cluster.mongodb.net/79bakers');
    
    process.exit(1);
  }
};

// Run the test
testConnection();
