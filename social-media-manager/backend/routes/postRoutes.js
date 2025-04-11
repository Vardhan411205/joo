const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/authMiddleware');
const postController = require('../controllers/postController');
const upload = require('../middleware/uploadMiddleware');

// Get all posts
router.get('/', auth, postController.getPosts);

// Get single post
router.get('/:id', auth, postController.getPostById);

// Create post
router.post('/', auth, upload.array('media', 5), postController.createPost);

// Update post
router.put('/:id', auth, upload.array('media', 5), postController.updatePost);

// Delete post
router.delete('/:id', auth, postController.deletePost);

// Schedule post
router.post('/:id/schedule', auth, postController.schedulePost);

// Cancel scheduled post
router.post('/:id/cancel', auth, postController.cancelScheduledPost);

// Get post analytics
router.get('/:id/analytics', auth, postController.getPostMetrics);

// Generate content using AI
router.post('/generate', auth, postController.generateContent);

// Add these routes
router.post('/:id/schedule', auth, postController.schedulePost);
router.post('/:id/cancel-schedule', auth, postController.cancelScheduledPost);

module.exports = router; 