import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CircularProgress, Box, Typography } from '@mui/material';
import axios from 'axios';

const FacebookCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = new URLSearchParams(location.search).get('code');
        if (!code) throw new Error('No code received');

        await axios.post('http://localhost:5000/api/social/connect', {
          platform: 'facebook',
          code
        });

        navigate('/dashboard', { 
          state: { message: 'Successfully connected to Facebook' }
        });
      } catch (error) {
        console.error('Facebook connection error:', error);
        navigate('/dashboard', { 
          state: { error: 'Failed to connect to Facebook' }
        });
      }
    };

    handleCallback();
  }, [location, navigate]);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
      <CircularProgress />
      <Typography sx={{ mt: 2 }}>Connecting to Facebook...</Typography>
    </Box>
  );
};

export default FacebookCallback; 