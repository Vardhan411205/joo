import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import NewCampaignModal from '../components/NewCampaignModal';
import CampaignCard from '../components/CampaignCard';
import { useAuth } from '../contexts/AuthContext';
import campaignService from '../services/campaignService';

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openNewCampaign, setOpenNewCampaign] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const data = await campaignService.getCampaigns();
      setCampaigns(data);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCampaign = async (campaignData) => {
    try {
      const newCampaign = await campaignService.createCampaign(campaignData);
      setCampaigns([...campaigns, newCampaign]);
      setOpenNewCampaign(false);
    } catch (error) {
      console.error('Error creating campaign:', error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Campaigns
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setOpenNewCampaign(true)}
        >
          Create Campaign
        </Button>
      </Box>

      <Grid container spacing={3}>
        {campaigns.map((campaign) => (
          <Grid item xs={12} sm={6} md={4} key={campaign.id}>
            <CampaignCard campaign={campaign} onUpdate={fetchCampaigns} />
          </Grid>
        ))}
      </Grid>

      <NewCampaignModal
        open={openNewCampaign}
        onClose={() => setOpenNewCampaign(false)}
        onSubmit={handleCreateCampaign}
      />
    </Box>
  );
};

export default Campaigns; 