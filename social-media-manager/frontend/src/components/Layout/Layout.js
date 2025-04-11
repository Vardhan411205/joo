import React, { useState } from 'react';
import { Box, CssBaseline, Drawer } from '@mui/material';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const drawerWidth = 240;

const Layout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f7fa' }}>
      <CssBaseline />
      <Navbar onMenuClick={handleDrawerToggle} />
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            border: 'none',
            bgcolor: '#ffffff',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
          },
        }}
      >
        <Sidebar />
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: '64px',
          ml: `${drawerWidth}px`,
          bgcolor: '#f5f7fa'
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout; 