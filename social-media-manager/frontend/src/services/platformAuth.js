import axios from 'axios';

const FACEBOOK_APP_ID = process.env.REACT_APP_FACEBOOK_APP_ID;

export const initiateFacebookLogin = () => {
  const redirectUri = `${window.location.origin}/auth/facebook/callback`;
  const scope = 'pages_manage_posts,pages_read_engagement';
  
  window.location.href = `https://www.facebook.com/v12.0/dialog/oauth?client_id=${FACEBOOK_APP_ID}&redirect_uri=${redirectUri}&scope=${scope}`;
};

export const initiateTwitterLogin = async () => {
  try {
    const response = await axios.post('http://localhost:5000/api/social/twitter/request-token');
    window.location.href = `https://api.twitter.com/oauth/authorize?oauth_token=${response.data.oauth_token}`;
  } catch (error) {
    console.error('Error initiating Twitter login:', error);
    throw error;
  }
}; 