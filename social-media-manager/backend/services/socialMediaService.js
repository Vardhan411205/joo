const axios = require('axios');
require('dotenv').config();

class SocialMediaService {
  constructor() {
    this.platforms = {
      facebook: {
        baseUrl: 'https://graph.facebook.com/v18.0',
        accessToken: process.env.FACEBOOK_ACCESS_TOKEN
      },
      twitter: {
        apiKey: process.env.TWITTER_API_KEY,
        apiSecret: process.env.TWITTER_API_SECRET,
        accessToken: process.env.TWITTER_ACCESS_TOKEN,
        accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET
      },
      instagram: {
        accessToken: process.env.INSTAGRAM_ACCESS_TOKEN
      },
      linkedin: {
        accessToken: process.env.LINKEDIN_ACCESS_TOKEN
      }
    };
  }

  async schedulePost(postData) {
    try {
      const { platform, content, scheduledTime, mediaUrls } = postData;

      // Store post in database first
      const post = await this.createPostInDB(postData);

      // Schedule the post on the platform
      const scheduledPost = await this.scheduleOnPlatform(platform, {
        content,
        scheduledTime,
        mediaUrls,
        postId: post._id
      });

      // Update post with platform-specific data
      await this.updatePostWithPlatformData(post._id, scheduledPost);

      return {
        success: true,
        postId: post._id,
        scheduledTime,
        platform
      };
    } catch (error) {
      console.error('Error scheduling post:', error);
      return {
        success: false,
        error: 'Failed to schedule post'
      };
    }
  }

  async createPostInDB(postData) {
    // Implementation depends on your database model
    // This is a placeholder
    return { _id: 'post_id' };
  }

  async scheduleOnPlatform(platform, postData) {
    switch (platform) {
      case 'facebook':
        return this.scheduleFacebookPost(postData);
      case 'twitter':
        return this.scheduleTwitterPost(postData);
      case 'instagram':
        return this.scheduleInstagramPost(postData);
      case 'linkedin':
        return this.scheduleLinkedInPost(postData);
      default:
        throw new Error('Unsupported platform');
    }
  }

  async scheduleFacebookPost({ content, scheduledTime, mediaUrls }) {
    try {
      const response = await axios.post(
        `${this.platforms.facebook.baseUrl}/me/feed`,
        {
          message: content,
          scheduled_publish_time: Math.floor(new Date(scheduledTime).getTime() / 1000),
          published: false,
          ...(mediaUrls && mediaUrls.length && { attached_media: mediaUrls })
        },
        {
          params: {
            access_token: this.platforms.facebook.accessToken
          }
        }
      );

      return {
        platformPostId: response.data.id,
        status: 'scheduled'
      };
    } catch (error) {
      console.error('Facebook scheduling error:', error);
      throw new Error('Failed to schedule Facebook post');
    }
  }

  async scheduleTwitterPost({ content, scheduledTime, mediaUrls }) {
    // Implementation for Twitter scheduling
    // Note: Twitter API v2 required
    return {
      platformPostId: 'twitter_post_id',
      status: 'scheduled'
    };
  }

  async scheduleInstagramPost({ content, scheduledTime, mediaUrls }) {
    // Implementation for Instagram scheduling
    // Note: Requires Facebook Graph API for Instagram
    return {
      platformPostId: 'instagram_post_id',
      status: 'scheduled'
    };
  }

  async scheduleLinkedInPost({ content, scheduledTime, mediaUrls }) {
    // Implementation for LinkedIn scheduling
    return {
      platformPostId: 'linkedin_post_id',
      status: 'scheduled'
    };
  }

  async updatePostWithPlatformData(postId, platformData) {
    // Implementation depends on your database model
    // This is a placeholder
    return true;
  }

  async getPostAnalytics(platform, postId) {
    try {
      switch (platform) {
        case 'facebook':
          return this.getFacebookAnalytics(postId);
        case 'twitter':
          return this.getTwitterAnalytics(postId);
        case 'instagram':
          return this.getInstagramAnalytics(postId);
        case 'linkedin':
          return this.getLinkedInAnalytics(postId);
        default:
          throw new Error('Unsupported platform');
      }
    } catch (error) {
      console.error(`Error fetching ${platform} analytics:`, error);
      return {
        success: false,
        error: `Failed to fetch ${platform} analytics`
      };
    }
  }

  async getFacebookAnalytics(postId) {
    try {
      const response = await axios.get(
        `${this.platforms.facebook.baseUrl}/${postId}/insights`,
        {
          params: {
            access_token: this.platforms.facebook.accessToken,
            metric: 'post_impressions,post_engagements,post_reactions_by_type'
          }
        }
      );

      return {
        success: true,
        metrics: response.data.data
      };
    } catch (error) {
      console.error('Facebook analytics error:', error);
      throw new Error('Failed to fetch Facebook analytics');
    }
  }

  // Implement other platform-specific analytics methods similarly
}

module.exports = new SocialMediaService();