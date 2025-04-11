const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Successfully connected to MongoDB');
    
    // Try to create a test document
    const Test = mongoose.model('Test', { name: String });
    await Test.create({ name: 'test' });
    console.log('Successfully created test document');
    
    // Clean up
    await mongoose.connection.dropDatabase();
    console.log('Successfully cleaned up test database');
    
    process.exit(0);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

testConnection(); 