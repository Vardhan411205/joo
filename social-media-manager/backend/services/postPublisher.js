const Post = require('../models/Post');
const User = require('../models/User');
const socialMediaService = require('./socialMediaService');

class PostPublisher {
  static async publishPost(post) {
    try {
      // Get user's social media tokens
      const user = await User.findById(post.user).select('socialConnections');
      
      // Publish to appropriate platform
      let platformResponse;
      switch (post.platform) {
        case 'facebook':
          platformResponse = await this.publishToFacebook(post, user.socialConnections.facebook);
          break;
        case 'twitter':
          platformResponse = await this.publishToTwitter(post, user.socialConnections.twitter);
          break;
        case 'instagram':
          platformResponse = await this.publishToInstagram(post, user.socialConnections.instagram);
          break;
        case 'linkedin':
          platformResponse = await this.publishToLinkedIn(post, user.socialConnections.linkedin);
          break;
      }

      // Update post with platform response
      await Post.findByIdAndUpdate(post._id, {
        status: 'published',
        publishedDate: new Date(),
        'metadata.platformPostId': platformResponse.id
      });

      return platformResponse;
    } catch (error) {
      console.error('Error publishing post:', error);
      await Post.findByIdAndUpdate(post._id, { status: 'failed' });
      throw error;
    }
  }

  static async publishToFacebook(post, connection) {
    const response = await socialMediaService.facebook.publishPost({
      message: post.content,
      media: post.mediaUrls,
      pageId: connection.pageId,
      accessToken: connection.pageAccessToken
    });
    return response;
  }

  static async publishToTwitter(post, connection) {
    const response = await socialMediaService.twitter.tweet({
      text: post.content,
      media: post.mediaUrls,
      accessToken: connection.accessToken
    });
    return response;
  }

  static async publishToInstagram(post, connection) {
    const response = await socialMediaService.instagram.publish({
      caption: post.content,
      media: post.mediaUrls[0], // Instagram requires media
      accessToken: connection.accessToken
    });
    return response;
  }

  static async publishToLinkedIn(post, connection) {
    const response = await socialMediaService.linkedin.share({
      content: post.content,
      media: post.mediaUrls,
      accessToken: connection.accessToken
    });
    return response;
  }
}

module.exports = PostPublisher; 