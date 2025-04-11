import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analytics, setAnalytics] = useState({
    totalPosts: 0,
    totalEngagement: 0,
    totalReach: 0,
    engagementTrend: [],
    reachTrend: [],
    followersTrend: []
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/analytics', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }

      const data = await response.json();
      setAnalytics(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleCreatePost = () => {
    navigate('/create-post');
  };

  const handleViewCampaigns = () => {
    navigate('/campaigns');
  };

  const handleViewSchedule = () => {
    navigate('/schedule');
  };

  const engagementChartData = {
    labels: analytics.engagementTrend.map(point => point.date),
    datasets: [
      {
        label: 'Engagement',
        data: analytics.engagementTrend.map(point => point.value),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const reachChartData = {
    labels: analytics.reachTrend.map(point => point.date),
    datasets: [
      {
        label: 'Reach',
        data: analytics.reachTrend.map(point => point.value),
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1
      }
    ]
  };

  const followersChartData = {
    labels: analytics.followersTrend.map(point => point.date),
    datasets: [
      {
        label: 'Followers',
        data: analytics.followersTrend.map(point => point.value),
        borderColor: 'rgb(53, 162, 235)',
        tension: 0.1
      }
    ]
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', padding: '20px', backgroundColor: '#f5f5f5' }}>
      <Box sx={{ maxWidth: 1200, margin: '0 auto', padding: '20px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <Typography variant="h4" component="h1">
            Welcome, {user?.name || 'User'}!
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ marginBottom: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Action Buttons */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2, display: 'flex', gap: 2 }}>
              <Button variant="contained" color="primary" onClick={handleCreatePost}>
                Create New Post
              </Button>
              <Button variant="contained" color="secondary" onClick={handleViewCampaigns}>
                View Campaigns
              </Button>
              <Button variant="contained" color="info" onClick={handleViewSchedule}>
                View Schedule
              </Button>
            </Paper>
          </Grid>

          {/* Analytics Overview */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">Total Posts</Typography>
              <Typography variant="h4">{analytics.totalPosts}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">Total Engagement</Typography>
              <Typography variant="h4">{analytics.totalEngagement}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">Total Reach</Typography>
              <Typography variant="h4">{analytics.totalReach}</Typography>
            </Paper>
          </Grid>

          {/* Charts */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">Engagement Trend</Typography>
              <Line data={engagementChartData} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">Reach Trend</Typography>
              <Line data={reachChartData} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">Followers Growth</Typography>
              <Line data={followersChartData} />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;