const Campaign = require('../models/Campaign');
const Post = require('../models/Post');
const schedule = require('node-schedule');
const socialMediaService = require('./socialMediaService');

class CampaignService {
  static async scheduleCampaign(campaign) {
    try {
      const posts = await Post.find({ campaign: campaign._id });
      
      posts.forEach(post => {
        schedule.scheduleJob(post.scheduledDate, async () => {
          await this.publishPost(post);
        });
      });

      await Campaign.findByIdAndUpdate(campaign._id, {
        status: 'scheduled'
      });

      return true;
    } catch (error) {
      console.error('Campaign scheduling error:', error);
      throw error;
    }
  }

  static async publishPost(post) {
    try {
      const results = await Promise.all(post.platforms.map(platform => 
        socialMediaService[platform].publishPost(post)
      ));

      await Post.findByIdAndUpdate(post._id, {
        status: 'published',
        publishedDate: new Date(),
        platformPostIds: results.map(r => r.id)
      });

      return results;
    } catch (error) {
      console.error('Post publishing error:', error);
      throw error;
    }
  }

  static async getAnalytics(campaignId) {
    try {
      const campaign = await Campaign.findById(campaignId);
      const posts = await Post.find({ campaign: campaignId });

      const analytics = await Promise.all(posts.map(post =>
        Promise.all(post.platforms.map(platform =>
          socialMediaService[platform].getAnalytics(post.platformPostIds[platform])
        ))
      ));

      return this.aggregateAnalytics(analytics);
    } catch (error) {
      console.error('Analytics fetch error:', error);
      throw error;
    }
  }

  static aggregateAnalytics(analytics) {
    // Implement analytics aggregation logic
    return {
      engagement: [],
      platforms: [],
      posts: []
    };
  }
}

module.exports = CampaignService; 