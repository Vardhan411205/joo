import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Toolbar,
  Divider
} from '@mui/material';
import {
  DashboardMenuIcon,
  CampaignMenuIcon,
  PostsMenuIcon,
  AnalyticsMenuIcon,
  SettingsMenuIcon
} from '../icons/MenuIcons';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const menuItems = [
  { text: 'Dashboard', icon: <DashboardMenuIcon />, path: '/' },
  { text: 'Campaigns', icon: <CampaignMenuIcon />, path: '/campaigns' },
  { text: 'Posts', icon: <PostsMenuIcon />, path: '/posts' },
  { text: 'Analytics', icon: <AnalyticsMenuIcon />, path: '/analytics' },
  { text: 'Settings', icon: <SettingsMenuIcon />, path: '/settings' }
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => navigate(item.path)}
              selected={location.pathname === item.path}
              sx={{
                py: 1.5,
                '&.Mui-selected': {
                  backgroundColor: '#e8f3ff',
                  '& .MuiListItemIcon-root': {
                    color: '#1976d2',
                  },
                  '& .MuiListItemText-primary': {
                    color: '#1976d2',
                    fontWeight: 500,
                  }
                },
                '&:hover': {
                  backgroundColor: location.pathname === item.path ? '#e8f3ff' : '#f5f5f5',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 45,
                  ml: 1,
                  color: location.pathname === item.path ? '#1976d2' : '#637381',
                  '& svg': {
                    fontSize: '1.5rem'
                  }
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                sx={{
                  '& .MuiListItemText-primary': {
                    fontSize: '0.875rem',
                    fontWeight: location.pathname === item.path ? 500 : 400,
                    color: location.pathname === item.path ? '#1976d2' : '#212B36',
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              py: 1.5,
              '&:hover': {
                backgroundColor: '#f5f5f5',
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 45,
                ml: 1,
                color: '#637381',
                '& svg': {
                  fontSize: '1.5rem'
                }
              }}
            >
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Logout"
              sx={{
                '& .MuiListItemText-primary': {
                  fontSize: '0.875rem',
                  color: '#212B36',
                },
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
};

export default Sidebar; 