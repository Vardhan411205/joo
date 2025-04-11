import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import NewCampaign from './NewCampaign';
import SocialMediaConnections from './SocialMediaConnections';

const Dashboard = () => {
  return (
    <Box>
      <Typography 
        variant="h4" 
        gutterBottom
        sx={{ 
          fontWeight: 600,
          color: '#1a1a1a',
          mb: 3 
        }}
      >
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <NewCampaign />
        </Grid>
        <Grid item xs={12} md={8}>
          <SocialMediaConnections />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 