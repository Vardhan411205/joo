const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const initDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Create indexes
    await mongoose.model('Post').createIndexes();
    await mongoose.model('Campaign').createIndexes();
    await mongoose.model('User').createIndexes();

    console.log('Database initialized successfully');
    process.exit(0);
  } catch (error) {
    console.error('Database initialization error:', error);
    process.exit(1);
  }
};

initDatabase(); 