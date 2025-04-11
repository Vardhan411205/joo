const Post = require('../models/Post');
const PostScheduler = require('../services/postScheduler');
const PostPublisher = require('../services/postPublisher');
const Scheduler = require('../services/scheduler');
const MediaUploader = require('../services/mediaUploader');
const AIService = require('../services/aiService');
const SocialMediaService = require('../services/socialMediaService');
const schedule = require('node-schedule');
const SchedulerService = require('../services/schedulerService');
const AppError = require('../utils/AppError');

// Get all posts
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user.id })
      .sort({ scheduleTime: 'asc' });

    res.json({
      success: true,
      data: posts
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch posts'
    });
  }
};

// Get single post
const getPostById = async (req, res) => {
  try {
    const post = await Post.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate('media');
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    res.json(post);
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ message: 'Error fetching post' });
  }
};

// Create post
const createPost = async (req, res) => {
  try {
    const { content, platform, scheduleTime, tone } = req.body;

    const post = new Post({
      content,
      platform,
      scheduleTime,
      tone,
      user: req.user.id
    });

    await post.save();

    // Schedule the post
    await PostScheduler.schedulePost(post);

    res.status(201).json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create post'
    });
  }
};

// Update post
const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this post'
      });
    }

    // Cancel existing schedule
    await PostScheduler.cancelScheduledPost(post._id);

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    );

    // Reschedule the post
    await PostScheduler.schedulePost(updatedPost);

    res.json({
      success: true,
      data: updatedPost
    });
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update post'
    });
  }
};

// Delete post
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this post'
      });
    }

    // Cancel schedule before deleting
    await PostScheduler.cancelScheduledPost(post._id);
    await post.remove();

    res.json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete post'
    });
  }
};

// Get posts by campaign with analytics
const getPostsByCampaign = async (req, res) => {
  try {
    const posts = await Post.find({ campaign: req.params.campaignId });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts' });
  }
};

// Publish a post
const publishPost = async (req, res) => {
  try {
    const post = await Post.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Implement publish logic here
    post.status = 'published';
    post.publishedDate = new Date();
    await post.save();

    res.json({ message: 'Post published successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error publishing post' });
  }
};

// Reschedule a post
const reschedulePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { scheduledDate: req.body.scheduledDate },
      { new: true }
    );
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error rescheduling post' });
  }
};

// Add this function
const uploadMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    res.json({ 
      message: 'File uploaded successfully',
      filePath: req.file.path 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading media' });
  }
};

// Schedule post
const schedulePost = async (req, res) => {
  try {
    const { scheduledDate } = req.body;
    const post = await Post.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.scheduledDate = scheduledDate;
    post.status = 'scheduled';
    await post.save();

    await PostScheduler.schedulePost(post);

    res.json({
      success: true,
      message: 'Post scheduled successfully',
      scheduledDate
    });
  } catch (error) {
    console.error('Schedule post error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to schedule post'
    });
  }
};

// Cancel scheduled post
const cancelScheduledPost = async (req, res) => {
  try {
    const post = await Post.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    PostScheduler.cancelScheduledPost(post._id);
    
    post.status = 'draft';
    post.scheduledDate = null;
    await post.save();

    res.json({
      success: true,
      message: 'Post schedule cancelled'
    });
  } catch (error) {
    console.error('Cancel schedule error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel schedule'
    });
  }
};

// Generate post content using AI
const generateContent = async (req, res) => {
  try {
    const { prompt, tone, platform } = req.body;
    
    if (!prompt || !tone || !platform) {
      return res.status(400).json({
        success: false,
        message: 'Please provide prompt, tone, and platform'
      });
    }

    const result = await AIService.generatePost(prompt, tone, platform);
    
    res.json({
      success: true,
      content: result.content
    });
  } catch (error) {
    console.error('Generate content error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating content'
    });
  }
};

// Get post metrics
const getPostMetrics = async (req, res) => {
  try {
    const post = await Post.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post.metrics);
  } catch (error) {
    console.error('Get metrics error:', error);
    res.status(500).json({ message: 'Error fetching metrics' });
  }
};

const postController = {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getPostsByCampaign,
  publishPost,
  reschedulePost,
  uploadMedia,
  schedulePost,
  cancelScheduledPost,
  generateContent,
  getPostMetrics
};

module.exports = postController; 