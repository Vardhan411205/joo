import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Grid,
  CircularProgress,
  Box
} from '@mui/material';
import AnalyticsService from '../services/analyticsService';

const PostAnalytics = ({ postId }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await AnalyticsService.getPostAnalytics(postId);
        setAnalytics(data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 300000); // Update every 5 minutes

    return () => clearInterval(interval);
  }, [postId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={2}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Post Performance
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Typography variant="subtitle2">Reach</Typography>
          <Typography variant="h6">{analytics?.reach || 0}</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="subtitle2">Engagement Rate</Typography>
          <Typography variant="h6">
            {AnalyticsService.calculateEngagementRate(analytics)}%
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="subtitle2">Clicks</Typography>
          <Typography variant="h6">{analytics?.clicks || 0}</Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default PostAnalytics; 