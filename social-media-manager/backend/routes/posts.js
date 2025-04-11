const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const MediaUploader = require('../services/mediaUploader');
const {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  generateContent
} = require('../controllers/postController');
const auth = require('../middleware/auth');
const Post = require('../models/Post');
const { generateSocialMediaContent } = require('../services/openaiService');

// Base route: /api/posts
router.route('/')
  .get(protect, getPosts)
  .post(protect, createPost);

router.route('/generate')
  .post(protect, generateContent);

// @route   DELETE /api/posts/clear-all
// @desc    Delete all posts for a user
// @access  Private
router.delete('/clear-all', auth, async (req, res) => {
  try {
    await Post.deleteMany({ user: req.user.id });
    res.json({ message: 'All posts removed' });
  } catch (err) {
    console.error('Error deleting all posts:', err);
    res.status(500).json({ message: 'Failed to delete all posts' });
  }
});

router.route('/:id')
  .get(protect, getPost)
  .put(protect, updatePost)
  .delete(protect, deletePost);

// Get posts by campaign
router.get('/campaign/:campaignId', getPostsByCampaign);

// Upload media for post
router.post('/upload', MediaUploader.uploadMiddleware, uploadMedia);

// Publish post
router.post('/:id/publish', publishPost);

// Reschedule post
router.put('/:id/reschedule', reschedulePost);

// @route   POST /api/posts/generate
// @desc    Generate post content using ChatGPT
// @access  Private
router.post('/generate', auth, async (req, res) => {
  try {
    const { topic, platform, tone } = req.body;

    if (!topic || !platform || !tone) {
      return res.status(400).json({ message: 'Please provide topic, platform, and tone' });
    }

    const content = await generateSocialMediaContent(topic, platform, tone);
    res.json({ content });
  } catch (err) {
    console.error('Error generating content:', err);
    res.status(500).json({ message: 'Failed to generate content' });
  }
});

// @route   POST /api/posts
// @desc    Create a new post
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { content, platform, scheduleTime } = req.body;

    if (!content || !platform || !scheduleTime) {
      return res.status(400).json({ message: 'Please provide content, platform, and schedule time' });
    }

    const newPost = new Post({
      user: req.user.id,
      content,
      platform,
      scheduleTime: new Date(scheduleTime),
      status: 'scheduled'
    });

    const post = await newPost.save();
    res.json(post);
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(500).json({ message: 'Failed to create post' });
  }
});

// @route   GET /api/posts
// @desc    Get all posts for a user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user.id })
      .sort({ scheduleTime: -1 });
    res.json(posts);
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).json({ message: 'Failed to fetch posts' });
  }
});

// @route   GET /api/posts/:id
// @desc    Get a specific post
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    res.json(post);
  } catch (err) {
    console.error('Error fetching post:', err);
    res.status(500).json({ message: 'Failed to fetch post' });
  }
});

// @route   PUT /api/posts/:id
// @desc    Update a post
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { content, platform, scheduleTime, status } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    post.content = content || post.content;
    post.platform = platform || post.platform;
    post.scheduleTime = scheduleTime ? new Date(scheduleTime) : post.scheduleTime;
    post.status = status || post.status;

    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (err) {
    console.error('Error updating post:', err);
    res.status(500).json({ message: 'Failed to update post' });
  }
});

// @route   DELETE /api/posts/:id
// @desc    Delete a post
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    await post.deleteOne();
    res.json({ message: 'Post removed' });
  } catch (err) {
    console.error('Error deleting post:', err);
    res.status(500).json({ message: 'Failed to delete post' });
  }
});

// Add your post routes here
router.get('/', (req, res) => {
  res.json({ message: 'Posts route working' });
});

module.exports = router; 