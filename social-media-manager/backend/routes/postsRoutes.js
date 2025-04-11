const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  schedulePost
} = require('../controllers/postController');

router.route('/')
  .get(protect, getPosts)
  .post(protect, createPost);

router.route('/:id')
  .get(protect, getPostById)
  .put(protect, updatePost)
  .delete(protect, deletePost);

router.post('/:id/schedule', protect, schedulePost);

module.exports = router; 