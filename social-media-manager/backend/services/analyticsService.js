const mongoose = require('mongoose');
const Post = require('../models/Post');
const Campaign = require('../models/Campaign');

class AnalyticsService {
  async getCampaignAnalytics(campaignId) {
    try {
      const campaign = await Campaign.findById(campaignId);
      const posts = await Post.find({ campaignId });

      const metrics = {
        totalPosts: posts.length,
        postsPerPlatform: {},
        engagementRate: 0,
        reachByPlatform: {},
        topPerformingPosts: [],
        performanceByTime: {}
      };

      // Calculate metrics per platform
      posts.forEach(post => {
        // Count posts per platform
        metrics.postsPerPlatform[post.platform] = (metrics.postsPerPlatform[post.platform] || 0) + 1;

        // Calculate engagement rate
        const engagement = (post.likes + post.comments + post.shares) || 0;
        metrics.engagementRate += engagement;

        // Track reach by platform
        metrics.reachByPlatform[post.platform] = (metrics.reachByPlatform[post.platform] || 0) + (post.reach || 0);

        // Track performance by time
        const hour = new Date(post.scheduledTime).getHours();
        if (!metrics.performanceByTime[hour]) {
          metrics.performanceByTime[hour] = {
            posts: 0,
            totalEngagement: 0
          };
        }
        metrics.performanceByTime[hour].posts++;
        metrics.performanceByTime[hour].totalEngagement += engagement;
      });

      // Calculate average engagement rate
      metrics.engagementRate = posts.length ? metrics.engagementRate / posts.length : 0;

      // Get top performing posts
      metrics.topPerformingPosts = await Post.find({ campaignId })
        .sort({ 'engagement.total': -1 })
        .limit(5)
        .select('content platform scheduledTime engagement');

      return {
        success: true,
        metrics,
        campaign: {
          name: campaign.name,
          startDate: campaign.startDate,
          endDate: campaign.endDate,
          status: campaign.status
        }
      };
    } catch (error) {
      console.error('Error fetching campaign analytics:', error);
      return {
        success: false,
        error: 'Failed to fetch campaign analytics'
      };
    }
  }

  async getOverallAnalytics(userId) {
    try {
      const campaigns = await Campaign.find({ userId });
      const posts = await Post.find({ 
        campaignId: { $in: campaigns.map(c => c._id) }
      });

      const metrics = {
        totalCampaigns: campaigns.length,
        activeCampaigns: campaigns.filter(c => c.status === 'active').length,
        totalPosts: posts.length,
        platformBreakdown: {},
        overallEngagement: 0,
        postsByDay: {},
        reachByPlatform: {}
      };

      posts.forEach(post => {
        // Platform breakdown
        metrics.platformBreakdown[post.platform] = (metrics.platformBreakdown[post.platform] || 0) + 1;

        // Overall engagement
        const engagement = (post.likes + post.comments + post.shares) || 0;
        metrics.overallEngagement += engagement;

        // Posts by day
        const date = new Date(post.scheduledTime).toISOString().split('T')[0];
        metrics.postsByDay[date] = (metrics.postsByDay[date] || 0) + 1;

        // Reach by platform
        metrics.reachByPlatform[post.platform] = (metrics.reachByPlatform[post.platform] || 0) + (post.reach || 0);
      });

      return {
        success: true,
        metrics
      };
    } catch (error) {
      console.error('Error fetching overall analytics:', error);
      return {
        success: false,
        error: 'Failed to fetch overall analytics'
      };
    }
  }

  async getPostAnalytics(postId) {
    try {
      const post = await Post.findById(postId)
        .populate('campaignId', 'name');

      if (!post) {
        return {
          success: false,
          error: 'Post not found'
        };
      }

      const metrics = {
        content: post.content,
        platform: post.platform,
        scheduledTime: post.scheduledTime,
        campaign: post.campaignId.name,
        engagement: {
          likes: post.likes || 0,
          comments: post.comments || 0,
          shares: post.shares || 0,
          total: (post.likes + post.comments + post.shares) || 0
        },
        reach: post.reach || 0,
        impressions: post.impressions || 0,
        status: post.status
      };

      return {
        success: true,
        metrics
      };
    } catch (error) {
      console.error('Error fetching post analytics:', error);
      return {
        success: false,
        error: 'Failed to fetch post analytics'
      };
    }
  }
}

module.exports = new AnalyticsService();