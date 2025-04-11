const Campaign = require('../models/Campaign');
const Post = require('../models/Post');
const AppError = require('../utils/AppError');
const { calculateDateRange } = require('../utils/dateUtils');

const analyticsController = {
  // Get overall analytics dashboard data
  getDashboardStats: async (req, res) => {
    try {
      // Implement dashboard stats logic
      res.json({ message: 'Dashboard stats' });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching stats' });
    }
  },

  // Get campaign performance metrics
  getCampaignMetrics: async (req, res) => {
    try {
      // Implement campaign metrics logic
      res.json({ message: 'Campaign metrics' });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching metrics' });
    }
  },

  // Get post performance analytics
  getPostAnalytics: async (req, res) => {
    try {
      // Implement post analytics logic
      res.json({ message: 'Post analytics' });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching analytics' });
    }
  },

  getAnalytics: async (req, res) => {
    try {
      const { platform = 'all', timeRange = '7d' } = req.query;
      const userId = req.user.id;
      const { startDate, endDate } = calculateDateRange(timeRange);

      // Base query for posts
      let query = {
        user: userId,
        createdAt: { $gte: startDate, $lte: endDate }
      };

      // Add platform filter if specified
      if (platform !== 'all') {
        query.platform = platform.toLowerCase();
      }

      // Fetch all posts within the time range
      const posts = await Post.find(query)
        .sort({ createdAt: 1 })
        .lean();

      // Initialize analytics data structure
      const analytics = {
        overview: {
          totalPosts: 0,
          totalEngagement: 0,
          totalReach: 0,
          totalFollowers: 0
        },
        platforms: {
          facebook: { posts: 0, likes: 0, comments: 0, shares: 0, followers: 0 },
          twitter: { posts: 0, likes: 0, comments: 0, retweets: 0, followers: 0 },
          instagram: { posts: 0, likes: 0, comments: 0, saves: 0, followers: 0 },
          linkedin: { posts: 0, likes: 0, comments: 0, shares: 0, followers: 0 }
        },
        trends: {
          engagement: [],
          reach: [],
          followers: [],
          posts: []
        },
        engagement: {
          likes: [],
          comments: [],
          shares: []
        }
      };

      // Process posts to calculate metrics
      const dateMap = new Map();
      const platformMetrics = new Map();

      posts.forEach(post => {
        const date = post.createdAt.toISOString().split('T')[0];
        const platform = post.platform.toLowerCase();

        // Update platform-specific metrics
        if (!platformMetrics.has(platform)) {
          platformMetrics.set(platform, {
            posts: 0,
            likes: 0,
            comments: 0,
            shares: 0,
            retweets: 0,
            saves: 0
          });
        }

        const metrics = platformMetrics.get(platform);
        metrics.posts++;
        metrics.likes += post.metrics?.likes || 0;
        metrics.comments += post.metrics?.comments || 0;
        metrics.shares += post.metrics?.shares || 0;
        metrics.retweets += post.metrics?.retweets || 0;
        metrics.saves += post.metrics?.saves || 0;

        // Update date-based metrics
        if (!dateMap.has(date)) {
          dateMap.set(date, {
            likes: 0,
            comments: 0,
            shares: 0,
            reach: 0,
            followers: 0,
            posts: 0
          });
        }

        const dateMetrics = dateMap.get(date);
        dateMetrics.posts++;
        dateMetrics.likes += post.metrics?.likes || 0;
        dateMetrics.comments += post.metrics?.comments || 0;
        dateMetrics.shares += post.metrics?.shares || 0;
        dateMetrics.reach += post.metrics?.reach || 0;
        dateMetrics.followers += post.metrics?.followers || 0;

        // Update overview totals
        analytics.overview.totalPosts++;
        analytics.overview.totalEngagement += (post.metrics?.likes || 0) +
          (post.metrics?.comments || 0) +
          (post.metrics?.shares || 0);
        analytics.overview.totalReach += post.metrics?.reach || 0;
        analytics.overview.totalFollowers += post.metrics?.followers || 0;
      });

      // Convert date map to sorted arrays for trends
      const sortedDates = Array.from(dateMap.keys()).sort();
      sortedDates.forEach(date => {
        const metrics = dateMap.get(date);
        
        analytics.trends.engagement.push({
          date,
          value: metrics.likes + metrics.comments + metrics.shares
        });
        
        analytics.trends.reach.push({
          date,
          value: metrics.reach
        });
        
        analytics.trends.followers.push({
          date,
          value: metrics.followers
        });
        
        analytics.trends.posts.push({
          date,
          value: metrics.posts
        });

        analytics.engagement.likes.push({
          date,
          value: metrics.likes
        });
        
        analytics.engagement.comments.push({
          date,
          value: metrics.comments
        });
        
        analytics.engagement.shares.push({
          date,
          value: metrics.shares
        });
      });

      // Update platform-specific metrics
      platformMetrics.forEach((metrics, platform) => {
        if (analytics.platforms[platform]) {
          analytics.platforms[platform] = {
            posts: metrics.posts,
            likes: metrics.likes,
            comments: metrics.comments,
            shares: platform === 'twitter' ? metrics.retweets : metrics.shares,
            followers: 0 // This would be updated from a separate followers tracking system
          };
        }
      });

      res.json(analytics);
    } catch (error) {
      console.error('Analytics Error:', error);
      res.status(500).json({ message: 'Error fetching analytics data' });
    }
  }
};

// Helper functions
const getPlatformBreakdown = (posts) => {
  return posts.reduce((acc, post) => {
    post.platforms.forEach(platform => {
      acc[platform] = (acc[platform] || 0) + 1;
    });
    return acc;
  }, {});
};

const calculateEngagementMetrics = (posts) => {
  return posts.reduce((acc, post) => ({
    likes: acc.likes + (post.metrics?.likes || 0),
    shares: acc.shares + (post.metrics?.shares || 0),
    comments: acc.comments + (post.metrics?.comments || 0),
    reach: acc.reach + (post.metrics?.reach || 0)
  }), { likes: 0, shares: 0, comments: 0, reach: 0 });
};

const calculateTotalEngagement = (posts) => {
  return posts.reduce((total, post) => {
    return total + (
      (post.metrics?.likes || 0) +
      (post.metrics?.shares || 0) +
      (post.metrics?.comments || 0)
    );
  }, 0);
};

const calculateEngagementByPlatform = (posts) => {
  return posts.reduce((acc, post) => {
    post.platforms.forEach(platform => {
      if (!acc[platform]) {
        acc[platform] = {
          likes: 0,
          shares: 0,
          comments: 0
        };
      }
      acc[platform].likes += post.metrics?.likes || 0;
      acc[platform].shares += post.metrics?.shares || 0;
      acc[platform].comments += post.metrics?.comments || 0;
    });
    return acc;
  }, {});
};

const calculateEngagementRate = (campaign) => {
  const totalEngagement = campaign.metrics.engagement;
  const totalImpressions = campaign.metrics.impressions;
  return totalImpressions > 0 ? (totalEngagement / totalImpressions) * 100 : 0;
};

const calculatePostPerformance = (post) => {
  const totalEngagement = 
    (post.metrics?.likes || 0) +
    (post.metrics?.shares || 0) +
    (post.metrics?.comments || 0);
  const reach = post.metrics?.reach || 0;
  
  return {
    engagementRate: reach > 0 ? (totalEngagement / reach) * 100 : 0,
    totalEngagement,
    reach
  };
};

const generateTimelineData = (posts) => {
  return posts
    .filter(post => post.publishedDate)
    .map(post => ({
      date: post.publishedDate,
      engagement: 
        (post.metrics?.likes || 0) +
        (post.metrics?.shares || 0) +
        (post.metrics?.comments || 0),
      reach: post.metrics?.reach || 0
    }))
    .sort((a, b) => a.date - b.date);
};

module.exports = analyticsController; 