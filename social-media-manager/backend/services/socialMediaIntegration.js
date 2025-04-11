const axios = require('axios');
const User = require('../models/User');
const Post = require('../models/Post');

class SocialMediaIntegration {
  static async connectFacebook(code, userId) {
    try {
      const { data } = await axios.get('https://graph.facebook.com/v12.0/oauth/access_token', {
        params: {
          client_id: process.env.FACEBOOK_APP_ID,
          client_secret: process.env.FACEBOOK_APP_SECRET,
          redirect_uri: process.env.FACEBOOK_REDIRECT_URI,
          code
        }
      });
      
      return {
        accessToken: data.access_token,
        platform: 'facebook'
      };
    } catch (error) {
      console.error('Facebook connection error:', error);
      throw error;
    }
  }

  static async connectTwitter(oauthToken, oauthVerifier) {
    try {
      // Implement Twitter OAuth flow
      const response = await axios.post('https://api.twitter.com/oauth/access_token', {
        oauth_token: oauthToken,
        oauth_verifier: oauthVerifier
      });
      
      return {
        accessToken: response.data.oauth_token,
        platform: 'twitter'
      };
    } catch (error) {
      console.error('Twitter connection error:', error);
      throw error;
    }
  }

  static async connectLinkedIn(code) {
    try {
      const { data } = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', {
        grant_type: 'authorization_code',
        code,
        client_id: process.env.LINKEDIN_CLIENT_ID,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET,
        redirect_uri: process.env.LINKEDIN_REDIRECT_URI
      });

      return {
        accessToken: data.access_token,
        platform: 'linkedin'
      };
    } catch (error) {
      console.error('LinkedIn connection error:', error);
      throw error;
    }
  }

  static async publishToFacebook(post, accessToken) {
    try {
      const response = await axios.post(
        `https://graph.facebook.com/v16.0/me/feed`,
        {
          message: post.content,
          access_token: accessToken
        }
      );
      return response.data;
    } catch (error) {
      console.error('Facebook publish error:', error);
      throw error;
    }
  }

  static async publishToTwitter(post, credentials) {
    try {
      // Implement Twitter API v2 integration
      const response = await axios.post(
        'https://api.twitter.com/2/tweets',
        {
          text: post.content
        },
        {
          headers: {
            'Authorization': `Bearer ${credentials.accessToken}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Twitter publish error:', error);
      throw error;
    }
  }

  static async publishToInstagram(post, accessToken) {
    try {
      // First, create a container
      const containerResponse = await axios.post(
        `https://graph.facebook.com/v16.0/me/media`,
        {
          image_url: post.media[0],
          caption: post.content,
          access_token: accessToken
        }
      );

      // Then publish the container
      const publishResponse = await axios.post(
        `https://graph.facebook.com/v16.0/me/media_publish`,
        {
          creation_id: containerResponse.data.id,
          access_token: accessToken
        }
      );

      return publishResponse.data;
    } catch (error) {
      console.error('Instagram publish error:', error);
      throw error;
    }
  }

  static async publishToLinkedIn(post, accessToken) {
    try {
      const response = await axios.post(
        'https://api.linkedin.com/v2/ugcPosts',
        {
          author: `urn:li:person:${post.userId}`,
          lifecycleState: 'PUBLISHED',
          specificContent: {
            'com.linkedin.ugc.ShareContent': {
              shareCommentary: {
                text: post.content
              },
              shareMediaCategory: 'NONE'
            }
          },
          visibility: {
            'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('LinkedIn publish error:', error);
      throw error;
    }
  }

  static async publishPost(post, platforms) {
    const user = await User.findById(post.user);
    const results = {};

    for (const platform of platforms) {
      try {
        switch (platform) {
          case 'facebook':
            if (user.socialAccounts.facebook.connected) {
              results.facebook = await this.publishToFacebook(
                post,
                user.socialAccounts.facebook.accessToken
              );
            }
            break;

          case 'twitter':
            if (user.socialAccounts.twitter.connected) {
              results.twitter = await this.publishToTwitter(
                post,
                user.socialAccounts.twitter
              );
            }
            break;

          case 'instagram':
            if (user.socialAccounts.instagram.connected) {
              results.instagram = await this.publishToInstagram(
                post,
                user.socialAccounts.instagram.accessToken
              );
            }
            break;

          case 'linkedin':
            if (user.socialAccounts.linkedin.connected) {
              results.linkedin = await this.publishToLinkedIn(
                post,
                user.socialAccounts.linkedin.accessToken
              );
            }
            break;
        }
      } catch (error) {
        console.error(`Error publishing to ${platform}:`, error);
        results[platform] = { error: error.message };
      }
    }

    return results;
  }
}

module.exports = SocialMediaIntegration; 