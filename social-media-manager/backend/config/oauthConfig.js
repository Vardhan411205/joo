const oauthConfig = {
  facebook: {
    authUrl: 'https://www.facebook.com/v12.0/dialog/oauth',
    tokenUrl: 'https://graph.facebook.com/v12.0/oauth/access_token',
    clientId: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackUrl: `${process.env.BACKEND_URL}/api/social/auth/facebook/callback`,
    scope: ['email', 'pages_show_list', 'pages_manage_posts']
  },
  twitter: {
    authUrl: 'https://twitter.com/i/oauth2/authorize',
    tokenUrl: 'https://api.twitter.com/2/oauth2/token',
    clientId: process.env.TWITTER_API_KEY,
    clientSecret: process.env.TWITTER_API_SECRET,
    callbackUrl: `${process.env.BACKEND_URL}/api/social/auth/twitter/callback`,
    scope: ['tweet.read', 'tweet.write', 'users.read']
  },
  instagram: {
    authUrl: 'https://api.instagram.com/oauth/authorize',
    tokenUrl: 'https://api.instagram.com/oauth/access_token',
    clientId: process.env.INSTAGRAM_CLIENT_ID,
    clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
    callbackUrl: `${process.env.BACKEND_URL}/api/social/auth/instagram/callback`,
    scope: ['basic']
  }
};

module.exports = oauthConfig; 