import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button
} from '@mui/material';

const SocialMediaConnections = () => {
  const platforms = [
    { name: 'Facebook', connected: false },
    { name: 'Twitter', connected: false },
    { name: 'Instagram', connected: false },
    { name: 'LinkedIn', connected: false }
  ];

  const handleConnect = (platform) => {
    // Implement social media connection logic
    console.log(`Connecting to ${platform}`);
  };

  return (
    <Card sx={{ height: '100%', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Platform Connections
        </Typography>
        <List>
          {platforms.map((platform) => (
            <ListItem
              key={platform.name}
              sx={{
                py: 2,
                borderBottom: '1px solid',
                borderColor: 'divider',
                '&:last-child': {
                  borderBottom: 'none'
                }
              }}
            >
              <ListItemText 
                primary={platform.name}
                sx={{
                  '& .MuiTypography-root': {
                    fontWeight: 500
                  }
                }}
              />
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleConnect(platform.name)}
                sx={{
                  borderRadius: 1,
                  textTransform: 'none',
                  minWidth: 100
                }}
              >
                Connect
              </Button>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default SocialMediaConnections; 