import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';

const NewCampaign = () => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/campaigns')}
            fullWidth
          >
            Create New Campaign
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default NewCampaign; 