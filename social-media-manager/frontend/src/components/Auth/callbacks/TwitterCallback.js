import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CircularProgress, Box, Typography } from '@mui/material';
import axios from 'axios';

const TwitterCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const oauthToken = params.get('oauth_token');
        const oauthVerifier = params.get('oauth_verifier');

        if (!oauthToken || !oauthVerifier) {
          throw new Error('Missing OAuth parameters');
        }

        await axios.post('http://localhost:5000/api/social/connect', {
          platform: 'twitter',
          oauthToken,
          oauthVerifier
        });

        navigate('/dashboard', {
          state: { message: 'Successfully connected to Twitter' }
        });
      } catch (error) {
        console.error('Twitter connection error:', error);
        navigate('/dashboard', {
          state: { error: 'Failed to connect to Twitter' }
        });
      }
    };

    handleCallback();
  }, [location, navigate]);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
      <CircularProgress />
      <Typography sx={{ mt: 2 }}>Connecting to Twitter...</Typography>
    </Box>
  );
};

export default TwitterCallback; 