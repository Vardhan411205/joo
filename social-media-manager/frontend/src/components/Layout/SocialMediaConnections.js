import React from 'react';
import {
  Paper,
  Typography,
  Grid,
  Button,
  Box
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon
} from '@mui/icons-material';

const SocialMediaConnections = () => {
  const platforms = [
    { id: 'facebook', name: 'Facebook', icon: <FacebookIcon /> },
    { id: 'twitter', name: 'Twitter', icon: <TwitterIcon /> },
    { id: 'instagram', name: 'Instagram', icon: <InstagramIcon /> },
    { id: 'linkedin', name: 'LinkedIn', icon: <LinkedInIcon /> }
  ];

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Connected Platforms
      </Typography>
      <Grid container spacing={3}>
        {platforms.map(platform => (
          <Grid item xs={12} sm={6} md={3} key={platform.id}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Box sx={{ mb: 2 }}>
                {platform.icon}
              </Box>
              <Typography variant="h6" gutterBottom>
                {platform.name}
              </Typography>
              <Button variant="contained" color="primary">
                Connect
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default SocialMediaConnections; 