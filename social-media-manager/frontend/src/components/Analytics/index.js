import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Card,
  CardContent
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  ThumbUp as ThumbUpIcon,
  Comment as CommentIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area
} from 'recharts';

const Analytics = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [timeRange, setTimeRange] = useState('7d');
  const [analyticsData, setAnalyticsData] = useState({
    overview: {
      totalFollowers: 15234,
      totalEngagement: 7478,
      totalReach: 45892,
      totalPosts: 153
    },
    platforms: {
      facebook: { followers: 5200, engagement: 2100, reach: 15000, posts: 45 },
      twitter: { followers: 4800, engagement: 1800, reach: 12000, posts: 38 },
      instagram: { followers: 5234, engagement: 3578, reach: 18892, posts: 70 }
    },
    engagementTrend: [
      { name: 'Jan', facebook: 400, twitter: 240, instagram: 320, linkedin: 180 },
      { name: 'Feb', facebook: 300, twitter: 398, instagram: 280, linkedin: 210 },
      { name: 'Mar', facebook: 520, twitter: 280, instagram: 420, linkedin: 250 },
      { name: 'Apr', facebook: 450, twitter: 350, instagram: 380, linkedin: 220 },
      { name: 'May', facebook: 600, twitter: 420, instagram: 450, linkedin: 280 }
    ],
    reachTrend: [
      { date: '2025-04-04', value: 12000 },
      { date: '2025-04-05', value: 14000 },
      { date: '2025-04-06', value: 11000 },
      { date: '2025-04-07', value: 16000 },
      { date: '2025-04-08', value: 18000 },
      { date: '2025-04-09', value: 15000 },
      { date: '2025-04-10', value: 17000 }
    ],
    followersGrowth: [
      { date: '2025-04-04', facebook: 5000, twitter: 4200, instagram: 4800, linkedin: 3200 },
      { date: '2025-04-05', facebook: 5100, twitter: 4300, instagram: 4900, linkedin: 3300 },
      { date: '2025-04-06', facebook: 5200, twitter: 4400, instagram: 5000, linkedin: 3400 },
      { date: '2025-04-07', facebook: 5300, twitter: 4500, instagram: 5100, linkedin: 3500 },
      { date: '2025-04-08', facebook: 5400, twitter: 4600, instagram: 5200, linkedin: 3600 },
      { date: '2025-04-09', facebook: 5500, twitter: 4700, instagram: 5300, linkedin: 3700 },
      { date: '2025-04-10', facebook: 5600, twitter: 4800, instagram: 5400, linkedin: 3800 }
    ]
  });

  const platformOptions = [
    { value: 'all', label: 'All Platforms', icon: <TrendingUpIcon /> },
    { value: 'facebook', label: 'Facebook', icon: <FacebookIcon /> },
    { value: 'twitter', label: 'Twitter', icon: <TwitterIcon /> },
    { value: 'instagram', label: 'Instagram', icon: <InstagramIcon /> }
  ];

  const timeRangeOptions = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' }
  ];

  const StatCard = ({ title, value, icon, color }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ 
            backgroundColor: `${color}20`,
            borderRadius: '50%',
            p: 1,
            mr: 2
          }}>
            {React.cloneElement(icon, { sx: { color } })}
          </Box>
          <Typography variant="h6" component="div">
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" component="div">
          {value.toLocaleString()}
        </Typography>
      </CardContent>
    </Card>
  );

  const renderTrendChart = (data, dataKey, color, title) => (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Box sx={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );

  const renderPlatformStats = (platform) => {
    const data = analyticsData.platforms[platform];
    if (!data) return null;

    const platformColors = {
      facebook: '#1877F2',
      twitter: '#1DA1F2',
      instagram: '#E4405F'
    };

    return (
      <Paper sx={{ p: 3, height: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {platformOptions.find(opt => opt.value === platform)?.icon}
          <Typography variant="h6" sx={{ ml: 1 }}>
            {platform.charAt(0).toUpperCase() + platform.slice(1)} Stats
          </Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body2" color="textSecondary">
              Followers
            </Typography>
            <Typography variant="h6">
              {data.followers.toLocaleString()}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="textSecondary">
              Engagement Rate
            </Typography>
            <Typography variant="h6">
              {((data.engagement / data.followers) * 100).toFixed(2)}%
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="textSecondary">
              Total Reach
            </Typography>
            <Typography variant="h6">
              {data.reach.toLocaleString()}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="textSecondary">
              Posts
            </Typography>
            <Typography variant="h6">
              {data.posts.toLocaleString()}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    );
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Analytics Dashboard</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Platform</InputLabel>
            <Select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              label="Platform"
            >
              {platformOptions.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {option.icon}
                    <Typography sx={{ ml: 1 }}>{option.label}</Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              label="Time Range"
            >
              {timeRangeOptions.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Followers"
            value={analyticsData.overview.totalFollowers}
            icon={<PeopleIcon />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Engagement"
            value={analyticsData.overview.totalEngagement}
            icon={<ThumbUpIcon />}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Reach"
            value={analyticsData.overview.totalReach}
            icon={<TrendingUpIcon />}
            color="#ed6c02"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Posts"
            value={analyticsData.overview.totalPosts}
            icon={<CommentIcon />}
            color="#9c27b0"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          {renderPlatformStats('facebook')}
        </Grid>
        <Grid item xs={12} md={4}>
          {renderPlatformStats('twitter')}
        </Grid>
        <Grid item xs={12} md={4}>
          {renderPlatformStats('instagram')}
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, background: 'linear-gradient(to bottom, #ffffff, #f8f9fa)' }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#1a237e' }}>
              Engagement Trend
            </Typography>
            <Box sx={{ height: 400, width: '100%' }}>
              <ResponsiveContainer>
                <BarChart data={analyticsData.engagementTrend}>
                  <defs>
                    <linearGradient id="colorFacebook" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1877F2" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#1877F2" stopOpacity={0.2}/>
                    </linearGradient>
                    <linearGradient id="colorTwitter" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1DA1F2" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#1DA1F2" stopOpacity={0.2}/>
                    </linearGradient>
                    <linearGradient id="colorInstagram" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#E4405F" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#E4405F" stopOpacity={0.2}/>
                    </linearGradient>
                    <linearGradient id="colorLinkedin" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0A66C2" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#0A66C2" stopOpacity={0.2}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                  <XAxis dataKey="name" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      borderRadius: 8,
                      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                      border: 'none'
                    }}
                    cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
                  />
                  <Legend 
                    wrapperStyle={{
                      paddingTop: '20px'
                    }}
                  />
                  <Bar 
                    dataKey="facebook" 
                    fill="url(#colorFacebook)" 
                    name="Facebook" 
                    animationDuration={1500}
                    animationBegin={0}
                    radius={[8, 8, 0, 0]}
                    maxBarSize={50}
                  />
                  <Bar 
                    dataKey="twitter" 
                    fill="url(#colorTwitter)" 
                    name="Twitter" 
                    animationDuration={1500}
                    animationBegin={300}
                    radius={[8, 8, 0, 0]}
                    maxBarSize={50}
                  />
                  <Bar 
                    dataKey="instagram" 
                    fill="url(#colorInstagram)" 
                    name="Instagram" 
                    animationDuration={1500}
                    animationBegin={600}
                    radius={[8, 8, 0, 0]}
                    maxBarSize={50}
                  />
                  <Bar 
                    dataKey="linkedin" 
                    fill="url(#colorLinkedin)" 
                    name="LinkedIn" 
                    animationDuration={1500}
                    animationBegin={900}
                    radius={[8, 8, 0, 0]}
                    maxBarSize={50}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, background: 'linear-gradient(to bottom, #ffffff, #f8f9fa)' }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#1a237e' }}>
              Reach Trend
            </Typography>
            <Box sx={{ height: 400, width: '100%' }}>
              <ResponsiveContainer>
                <BarChart data={analyticsData.reachTrend}>
                  <defs>
                    <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0.2}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    stroke="#666"
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="#666"
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      borderRadius: 8,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                      border: 'none',
                      padding: '10px'
                    }}
                    cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
                  />
                  <Legend 
                    wrapperStyle={{
                      paddingTop: '20px'
                    }}
                  />
                  <Bar
                    dataKey="value"
                    fill="url(#colorReach)"
                    name="Reach"
                    animationDuration={1500}
                    radius={[8, 8, 0, 0]}
                    maxBarSize={50}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, background: 'linear-gradient(to bottom, #ffffff, #f8f9fa)' }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#1a237e' }}>
              Followers Growth
            </Typography>
            <Box sx={{ height: 400, width: '100%' }}>
              <ResponsiveContainer>
                <BarChart data={analyticsData.followersGrowth}>
                  <defs>
                    <linearGradient id="colorFacebookBar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1877F2" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#1877F2" stopOpacity={0.2}/>
                    </linearGradient>
                    <linearGradient id="colorTwitterBar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1DA1F2" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#1DA1F2" stopOpacity={0.2}/>
                    </linearGradient>
                    <linearGradient id="colorInstagramBar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#E4405F" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#E4405F" stopOpacity={0.2}/>
                    </linearGradient>
                    <linearGradient id="colorLinkedinBar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0A66C2" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#0A66C2" stopOpacity={0.2}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    stroke="#666"
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="#666"
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      borderRadius: 8,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                      border: 'none',
                      padding: '10px'
                    }}
                    cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
                  />
                  <Legend 
                    wrapperStyle={{
                      paddingTop: '20px'
                    }}
                  />
                  <Bar 
                    dataKey="facebook" 
                    fill="url(#colorFacebookBar)" 
                    name="Facebook" 
                    animationDuration={1500}
                    animationBegin={0}
                    radius={[8, 8, 0, 0]}
                    maxBarSize={50}
                  />
                  <Bar 
                    dataKey="twitter" 
                    fill="url(#colorTwitterBar)" 
                    name="Twitter" 
                    animationDuration={1500}
                    animationBegin={300}
                    radius={[8, 8, 0, 0]}
                    maxBarSize={50}
                  />
                  <Bar 
                    dataKey="instagram" 
                    fill="url(#colorInstagramBar)" 
                    name="Instagram" 
                    animationDuration={1500}
                    animationBegin={600}
                    radius={[8, 8, 0, 0]}
                    maxBarSize={50}
                  />
                  <Bar 
                    dataKey="linkedin" 
                    fill="url(#colorLinkedinBar)" 
                    name="LinkedIn" 
                    animationDuration={1500}
                    animationBegin={900}
                    radius={[8, 8, 0, 0]}
                    maxBarSize={50}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics;