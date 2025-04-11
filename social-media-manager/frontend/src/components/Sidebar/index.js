import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  Toolbar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Campaign as CampaignIcon,
  Analytics as AnalyticsIcon,
  Schedule as ScheduleIcon,
  Create as CreateIcon,
  Person as PersonIcon,
  ContactSupport as ContactSupportIcon
} from '@mui/icons-material';

const drawerWidth = 240;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/'
    },
    {
      text: 'Create Post',
      icon: <CreateIcon />,
      path: '/create-post'
    },
    {
      text: 'Schedule',
      icon: <ScheduleIcon />,
      path: '/schedule'
    },
    {
      text: 'Campaigns',
      icon: <CampaignIcon />,
      path: '/campaigns'
    },
    {
      text: 'Analytics',
      icon: <AnalyticsIcon />,
      path: '/analytics'
    },
    {
      text: 'Profile',
      icon: <PersonIcon />,
      path: '/profile'
    },
    {
      text: 'Contact Us',
      icon: <ContactSupportIcon />,
      path: '/contact'
    }
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => navigate(item.path)}
              sx={{
                backgroundColor: location.pathname === item.path ? 'rgba(0, 0, 0, 0.04)' : 'transparent'
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar; 