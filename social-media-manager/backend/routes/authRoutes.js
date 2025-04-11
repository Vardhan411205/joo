const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRegistration, validateLogin } = require('../middleware/validationMiddleware');
const { auth } = require('../middleware/authMiddleware');
const User = require('../models/User');
const mongoose = require('mongoose');

// Debug middleware
router.use((req, res, next) => {
  console.log('Auth Route:', req.method, req.path);
  console.log('Request Body:', req.body);
  next();
});

// Public routes
router.post('/register', validateRegistration, authController.register);
router.post('/login', validateLogin, authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);

// Protected routes
router.get('/me', auth, authController.getMe);
router.put('/profile', auth, authController.updateProfile);
router.put('/password', auth, authController.updatePassword);
router.post('/verify-email', auth, authController.verifyEmail);

// Add this route for testing
router.post('/test-register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const user = await User.create({
      name,
      email,
      password
    });

    res.status(201).json({
      success: true,
      message: 'Test user created successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Test registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating test user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Add this test route
router.post('/test-user', async (req, res) => {
  try {
    // First, delete any existing test user
    await User.deleteOne({ email: 'test@example.com' });

    // Create a new test user with a known password
    const user = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });

    await user.save();

    res.json({
      message: 'Test user created',
      credentials: {
        email: 'test@example.com',
        password: 'password123'
      }
    });
  } catch (error) {
    console.error('Error creating test user:', error);
    res.status(500).json({ message: 'Error creating test user' });
  }
});

// Add this test route
router.get('/test-db', async (req, res) => {
  try {
    // Try to create a test document
    const Test = mongoose.model('Test', { name: String });
    await Test.create({ name: 'test' });
    
    res.json({ 
      message: 'Database connection successful',
      mongodbUri: process.env.MONGODB_URI 
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({ 
      message: 'Database connection failed',
      error: error.message
    });
  }
});

module.exports = router; 