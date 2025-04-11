import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Tab,
  Tabs,
  CircularProgress
} from '@mui/material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import analyticsService from '../../services/analyticsService';

const Analytics = () => {
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    overview: {},
    campaigns: [],
    posts: [],
    engagement: []
  });

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const response = await analyticsService.getDashboardStats();
      setData(response.data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, subtitle }) => (
    <Card>
      <CardContent>
        <Typography color="textSecondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" component="div">
          {value}
        </Typography>
        <Typography color="textSecondary">
          {subtitle}
        </Typography>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Analytics
      </Typography>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Analytics Dashboard
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Reach"
              value={data.overview.totalReach}
              subtitle="Across all platforms"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Engagement Rate"
              value={`${data.overview.engagementRate}%`}
              subtitle="Average across campaigns"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Active Campaigns"
              value={data.overview.activeCampaigns}
              subtitle="Currently running"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Scheduled Posts"
              value={data.overview.scheduledPosts}
              subtitle="Next 7 days"
            />
          </Grid>
        </Grid>

        <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)} sx={{ mb: 3 }}>
          <Tab label="Engagement Overview" />
          <Tab label="Platform Performance" />
          <Tab label="Campaign Results" />
        </Tabs>

        {tab === 0 && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Engagement Trends
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.engagement}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="likes" stroke="#8884d8" />
                  <Line type="monotone" dataKey="shares" stroke="#82ca9d" />
                  <Line type="monotone" dataKey="comments" stroke="#ffc658" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {tab === 1 && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Platform Performance
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.platforms}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="platform" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="reach" fill="#8884d8" />
                  <Bar dataKey="engagement" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {tab === 2 && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Campaign Results
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.campaigns}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="impressions" fill="#8884d8" />
                  <Bar dataKey="conversions" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  );
};

export default Analytics; 