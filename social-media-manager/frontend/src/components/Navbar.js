import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, Button, IconButton } from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Campaign as CampaignIcon,
  Analytics as AnalyticsIcon,
  Person as PersonIcon,
  Home as HomeIcon
} from '@mui/icons-material';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user || location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <HomeIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Home
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            color="inherit"
            startIcon={<DashboardIcon />}
            onClick={() => navigate('/dashboard')}
          >
            Dashboard
          </Button>

          <Button
            color="inherit"
            startIcon={<CampaignIcon />}
            onClick={() => navigate('/campaigns')}
          >
            Campaigns
          </Button>

          <Button
            color="inherit"
            startIcon={<AnalyticsIcon />}
            onClick={() => navigate('/analytics')}
          >
            Analytics
          </Button>

          <Button
            color="inherit"
            startIcon={<PersonIcon />}
            onClick={() => navigate('/profile')}
          >
            Profile
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 