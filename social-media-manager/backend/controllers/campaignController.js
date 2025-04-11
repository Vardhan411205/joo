const Campaign = require('../models/Campaign');
const Post = require('../models/Post');
const AppError = require('../utils/AppError');
const SchedulerService = require('../services/schedulerService');

const campaignController = {
  // Get all campaigns
  getCampaigns: async (req, res) => {
    try {
      const campaigns = await Campaign.find({ user: req.user._id });
      res.json({
        success: true,
        data: campaigns
      });
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching campaigns'
      });
    }
  },

  // Get single campaign
  getCampaign: async (req, res) => {
    try {
      const campaign = await Campaign.findOne({
        _id: req.params.id,
        user: req.user._id
      });
      
      if (!campaign) {
        return res.status(404).json({
          success: false,
          message: 'Campaign not found'
        });
      }
      
      res.json({
        success: true,
        data: campaign
      });
    } catch (error) {
      console.error('Error fetching campaign:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching campaign'
      });
    }
  },

  // Create campaign
  createCampaign: async (req, res) => {
    try {
      const { name, description, startDate, endDate, budget, goals, platforms } = req.body;

      // Validate required fields
      if (!name || !description || !startDate || !endDate || !budget || !goals) {
        return res.status(400).json({
          success: false,
          message: 'Please provide all required fields'
        });
      }

      // Create campaign
      const campaign = await Campaign.create({
        name,
        description,
        startDate,
        endDate,
        budget: Number(budget),
        goals,
        platforms: platforms || [],
        user: req.user._id
      });
      
      res.status(201).json({
        success: true,
        message: 'Campaign created successfully',
        data: campaign
      });
    } catch (error) {
      console.error('Error creating campaign:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error creating campaign'
      });
    }
  },

  // Update campaign
  updateCampaign: async (req, res) => {
    try {
      const { name, description, startDate, endDate, budget, goals, platforms } = req.body;

      const campaign = await Campaign.findOne({
        _id: req.params.id,
        user: req.user._id
      });

      if (!campaign) {
        return res.status(404).json({
          success: false,
          message: 'Campaign not found'
        });
      }

      // Update fields
      campaign.name = name || campaign.name;
      campaign.description = description || campaign.description;
      campaign.startDate = startDate || campaign.startDate;
      campaign.endDate = endDate || campaign.endDate;
      campaign.budget = budget || campaign.budget;
      campaign.goals = goals || campaign.goals;
      campaign.platforms = platforms || campaign.platforms;

      await campaign.save();

      res.json({
        success: true,
        message: 'Campaign updated successfully',
        data: campaign
      });
    } catch (error) {
      console.error('Error updating campaign:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error updating campaign'
      });
    }
  },

  // Delete campaign
  deleteCampaign: async (req, res) => {
    try {
      const campaign = await Campaign.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id
      });

      if (!campaign) {
        return res.status(404).json({
          success: false,
          message: 'Campaign not found'
        });
      }

      res.json({
        success: true,
        message: 'Campaign deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting campaign:', error);
      res.status(500).json({
        success: false,
        message: 'Error deleting campaign'
      });
    }
  },

  // Get campaign metrics
  getCampaignMetrics: async (req, res) => {
    try {
      const campaign = await Campaign.findOne({
        _id: req.params.id,
        user: req.user._id
      });

      if (!campaign) {
        return res.status(404).json({
          success: false,
          message: 'Campaign not found'
        });
      }

      // Calculate metrics
      const metrics = await campaign.calculateAnalytics();

      res.json({
        success: true,
        data: metrics
      });
    } catch (error) {
      console.error('Error fetching campaign metrics:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching campaign metrics'
      });
    }
  },

  // Schedule campaign
  scheduleCampaign: async (req, res) => {
    try {
      const campaign = await Campaign.findOne({
        _id: req.params.id,
        user: req.user._id
      });

      if (!campaign) {
        return res.status(404).json({
          success: false,
          message: 'Campaign not found'
        });
      }

      const { posts } = req.body;
      campaign.scheduledPosts = posts;
      await campaign.save();

      res.json({
        success: true,
        message: 'Campaign scheduled successfully',
        data: campaign
      });
    } catch (error) {
      console.error('Error scheduling campaign:', error);
      res.status(500).json({
        success: false,
        message: 'Error scheduling campaign'
      });
    }
  },

  // Pause campaign
  pauseCampaign: async (req, res) => {
    try {
      const campaign = await Campaign.findOne({
        _id: req.params.id,
        user: req.user._id
      });

      if (!campaign) {
        return res.status(404).json({
          success: false,
          message: 'Campaign not found'
        });
      }

      campaign.status = 'paused';
      await campaign.save();

      res.json({
        success: true,
        message: 'Campaign paused successfully',
        data: campaign
      });
    } catch (error) {
      console.error('Error pausing campaign:', error);
      res.status(500).json({
        success: false,
        message: 'Error pausing campaign'
      });
    }
  },

  // Resume campaign
  resumeCampaign: async (req, res) => {
    try {
      const campaign = await Campaign.findOne({
        _id: req.params.id,
        user: req.user._id
      });

      if (!campaign) {
        return res.status(404).json({
          success: false,
          message: 'Campaign not found'
        });
      }

      campaign.status = 'active';
      await campaign.save();

      res.json({
        success: true,
        message: 'Campaign resumed successfully',
        data: campaign
      });
    } catch (error) {
      console.error('Error resuming campaign:', error);
      res.status(500).json({
        success: false,
        message: 'Error resuming campaign'
      });
    }
  },

  // Get campaign stats
  getCampaignStats: async (req, res) => {
    try {
      const campaign = await Campaign.findOne({
        _id: req.params.id,
        user: req.user._id
      });

      if (!campaign) {
        return res.status(404).json({
          success: false,
          message: 'Campaign not found'
        });
      }

      // Calculate campaign statistics
      const stats = {
        totalPosts: campaign.scheduledPosts.length,
        publishedPosts: campaign.scheduledPosts.filter(post => post.status === 'published').length,
        pendingPosts: campaign.scheduledPosts.filter(post => post.status === 'scheduled').length,
        failedPosts: campaign.scheduledPosts.filter(post => post.status === 'failed').length,
        engagement: campaign.analytics?.totalEngagements || 0,
        impressions: campaign.analytics?.totalImpressions || 0,
        clicks: campaign.analytics?.totalClicks || 0,
        shares: campaign.analytics?.totalShares || 0
      };

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error fetching campaign stats:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching campaign stats'
      });
    }
  },

  // Get campaign posts
  getCampaignPosts: async (req, res) => {
    try {
      const campaign = await Campaign.findOne({
        _id: req.params.id,
        user: req.user._id
      }).populate('scheduledPosts');

      if (!campaign) {
        return res.status(404).json({
          success: false,
          message: 'Campaign not found'
        });
      }

      res.json({
        success: true,
        data: campaign.scheduledPosts
      });
    } catch (error) {
      console.error('Error fetching campaign posts:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching campaign posts'
      });
    }
  },

  // Add post to campaign
  addPostToCampaign: async (req, res) => {
    try {
      const { content, platform, scheduledTime } = req.body;

      if (!content || !platform || !scheduledTime) {
        return res.status(400).json({
          success: false,
          message: 'Please provide content, platform, and scheduled time'
        });
      }

      const campaign = await Campaign.findOne({
        _id: req.params.id,
        user: req.user._id
      });

      if (!campaign) {
        return res.status(404).json({
          success: false,
          message: 'Campaign not found'
        });
      }

      const newPost = {
        content,
        platform,
        scheduledTime: new Date(scheduledTime),
        status: 'scheduled'
      };

      campaign.scheduledPosts.push(newPost);
      await campaign.save();

      res.status(201).json({
        success: true,
        message: 'Post added to campaign',
        data: newPost
      });
    } catch (error) {
      console.error('Error adding post to campaign:', error);
      res.status(500).json({
        success: false,
        message: 'Error adding post to campaign'
      });
    }
  },

  // Update campaign post
  updateCampaignPost: async (req, res) => {
    try {
      const { content, platform, scheduledTime } = req.body;
      
      const campaign = await Campaign.findOne({
        _id: req.params.id,
        user: req.user._id
      });

      if (!campaign) {
        return res.status(404).json({
          success: false,
          message: 'Campaign not found'
        });
      }

      const post = campaign.scheduledPosts.id(req.params.postId);
      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }

      post.content = content || post.content;
      post.platform = platform || post.platform;
      post.scheduledTime = scheduledTime ? new Date(scheduledTime) : post.scheduledTime;
      post.updatedAt = new Date();

      await campaign.save();

      res.json({
        success: true,
        message: 'Post updated successfully',
        data: post
      });
    } catch (error) {
      console.error('Error updating campaign post:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating campaign post'
      });
    }
  },

  // Delete campaign post
  deleteCampaignPost: async (req, res) => {
    try {
      const campaign = await Campaign.findOne({
        _id: req.params.id,
        user: req.user._id
      });

      if (!campaign) {
        return res.status(404).json({
          success: false,
          message: 'Campaign not found'
        });
      }

      const post = campaign.scheduledPosts.id(req.params.postId);
      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post not found'
        });
      }

      post.remove();
      await campaign.save();

      res.json({
        success: true,
        message: 'Post deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting campaign post:', error);
      res.status(500).json({
        success: false,
        message: 'Error deleting campaign post'
      });
    }
  }
};

// Helper functions
const calculateEngagement = (posts) => {
  return posts.reduce((total, post) => {
    return total + (
      (post.metrics?.likes || 0) +
      (post.metrics?.shares || 0) +
      (post.metrics?.comments || 0)
    );
  }, 0);
};

const getPlatformBreakdown = (posts) => {
  return posts.reduce((acc, post) => {
    post.platforms.forEach(platform => {
      acc[platform] = (acc[platform] || 0) + 1;
    });
    return acc;
  }, {});
};

const calculatePlatformPerformance = (posts) => {
  const performance = {};
  posts.forEach(post => {
    post.platforms.forEach(platform => {
      if (!performance[platform]) {
        performance[platform] = {
          posts: 0,
          engagement: 0,
          reach: 0
        };
      }
      performance[platform].posts++;
      performance[platform].engagement += post.metrics.engagement || 0;
      performance[platform].reach += post.metrics.reach || 0;
    });
  });
  return performance;
};

const generateTimelineData = (posts) => {
  return posts
    .filter(post => post.publishedDate)
    .map(post => ({
      date: post.publishedDate,
      engagement: post.metrics.engagement || 0,
      reach: post.metrics.reach || 0
    }))
    .sort((a, b) => a.date - b.date);
};

module.exports = campaignController; 