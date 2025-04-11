import React, { useState, useEffect } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Container,
  Grid,
  Paper,
  Button,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Create as CreateIcon,
  Campaign as CampaignIcon,
  Schedule as ScheduleIcon,
  Analytics as AnalyticsIcon,
  Add as AddIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  ContactSupport as ContactSupportIcon
} from '@mui/icons-material';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/Dashboard.css';

const drawerWidth = 320;

const DashboardContent = () => {
  const navigate = useNavigate();
  const [recentPosts, setRecentPosts] = useState([]);
  const [upcomingPosts, setUpcomingPosts] = useState([]);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = () => {
    try {
      const savedPosts = JSON.parse(localStorage.getItem('posts') || '[]');
      const now = new Date();

      // Split posts into recent and upcoming
      const recent = [];
      const upcoming = [];

      savedPosts.forEach(post => {
        const postDate = new Date(post.scheduleTime);
        if (postDate <= now) {
          recent.push(post);
        } else {
          upcoming.push(post);
        }
      });

      // Sort posts by date
      recent.sort((a, b) => new Date(b.scheduleTime) - new Date(a.scheduleTime));
      upcoming.sort((a, b) => new Date(a.scheduleTime) - new Date(b.scheduleTime));

      setRecentPosts(recent.slice(0, 5)); // Show only last 5 recent posts
      setUpcomingPosts(upcoming);
    } catch (err) {
      console.error('Error loading posts:', err);
    }
  };

  const renderPostCard = (post) => (
    <Card key={post.id} sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Chip
            label={post.platform}
            color="primary"
            size="small"
          />
          <Chip
            label={post.status}
            color={post.status === 'Scheduled' ? 'warning' : 'success'}
            size="small"
          />
        </Box>
        <Typography variant="body2" sx={{ mb: 1 }}>
          {post.content}
        </Typography>
        <Typography variant="caption" color="textSecondary" display="block">
          Scheduled for: {new Date(post.scheduleTime).toLocaleString()}
        </Typography>
        {post.campaignName && (
          <Typography variant="caption" color="textSecondary" display="block">
            Campaign: {post.campaignName}
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth={false} sx={{ mt: 4, mb: 4, mx: 4 }}>
      <Grid container spacing={3}>
        {/* Recent Posts */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%', minWidth: { sm: '400px' } }}>
            <Typography variant="h6" gutterBottom>
              Recent Posts
            </Typography>
            {recentPosts.length === 0 ? (
              <Typography color="textSecondary">
                Your recent social media posts will appear here
              </Typography>
            ) : (
              recentPosts.map(post => renderPostCard(post))
            )}
          </Paper>
        </Grid>

        {/* Analytics Overview */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%', minWidth: { sm: '400px' } }}>
            <Typography variant="h6" gutterBottom>
              Analytics Overview
            </Typography>
            <Typography color="textSecondary">
              Your social media analytics will appear here
            </Typography>
            {/* Add placeholder analytics data */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" gutterBottom>
                Total Posts: {recentPosts.length + upcomingPosts.length}
              </Typography>
              <Typography variant="body2" gutterBottom>
                Scheduled Posts: {upcomingPosts.length}
              </Typography>
              <Typography variant="body2" gutterBottom>
                Published Posts: {recentPosts.length}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Upcoming Posts */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, minWidth: { sm: '800px' } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Upcoming Posts
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/create-post')}
                sx={{
                  backgroundColor: '#1976d2',
                  '&:hover': {
                    backgroundColor: '#1565c0'
                  }
                }}
              >
                Schedule New Post
              </Button>
            </Box>
            {upcomingPosts.length === 0 ? (
              <Typography color="textSecondary">
                No scheduled posts found. Create a new post to get started!
              </Typography>
            ) : (
              upcomingPosts.map(post => renderPostCard(post))
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('userProfile');
    logout();
    navigate('/login');
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Create Post', icon: <CreateIcon />, path: '/create-post' },
    { text: 'Schedule', icon: <ScheduleIcon />, path: '/schedule' },
    { text: 'Campaigns', icon: <CampaignIcon />, path: '/campaigns' },
    { text: 'Analytics', icon: <AnalyticsIcon />, path: '/analytics' }
  ];

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap>
          Social Manager
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.path}
            onClick={() => navigate(item.path)}
            selected={location.pathname === item.path}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Divider />
    </div>
  );

  return (
    <Box className="dashboard-container">
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar className="dashboard-toolbar">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {menuItems.find(item => item.path === location.pathname)?.text || 'Dashboard'}
          </Typography>
          <Button
            color="inherit"
            startIcon={<PersonIcon />}
            onClick={() => navigate('/profile')}
            sx={{ mr: 2 }}
          >
            Profile
          </Button>
          <Button
            color="inherit"
            startIcon={<ContactSupportIcon />}
            onClick={() => navigate('/contact')}
            sx={{ mr: 2 }}
          >
            Contact Us
          </Button>
          <Button
            color="inherit"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        className="dashboard-drawer"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
          }}
          className="dashboard-drawer"
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
          }}
          open
          className="dashboard-drawer"
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        className="dashboard-content"
      >
        {location.pathname === '/' ? <DashboardContent /> : <Outlet />}
      </Box>
    </Box>
  );
};

export default Dashboard;