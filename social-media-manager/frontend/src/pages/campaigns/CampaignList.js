import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Chip,
  Menu,
  MenuItem,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import BarChartIcon from '@mui/icons-material/BarChart';
import campaignService from '../../services/campaignService';
import CampaignForm from './CampaignForm';
import CampaignMetrics from './CampaignMetrics';

const CampaignList = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [openMetrics, setOpenMetrics] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      const response = await campaignService.getCampaigns();
      setCampaigns(response.data);
    } catch (error) {
      setError('Failed to load campaigns');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      if (selectedCampaign) {
        await campaignService.updateCampaign(selectedCampaign._id, formData);
        setSuccess('Campaign updated successfully');
      } else {
        await campaignService.createCampaign(formData);
        setSuccess('Campaign created successfully');
      }
      setOpenForm(false);
      loadCampaigns();
    } catch (error) {
      setError(error.response?.data?.message || 'Error saving campaign');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await campaignService.deleteCampaign(id);
      setSuccess('Campaign deleted successfully');
      loadCampaigns();
    } catch (error) {
      setError('Failed to delete campaign');
    }
  };

  if (loading && campaigns.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Campaigns</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setSelectedCampaign(null);
            setOpenForm(true);
          }}
        >
          New Campaign
        </Button>
      </Box>

      <Grid container spacing={3}>
        {campaigns.map((campaign) => (
          <Grid item xs={12} md={6} lg={4} key={campaign._id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">{campaign.name}</Typography>
                  <IconButton
                    onClick={(e) => {
                      setAnchorEl(e.currentTarget);
                      setSelectedCampaign(campaign);
                    }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Box>

                <Typography color="textSecondary" gutterBottom>
                  {campaign.description}
                </Typography>

                <Box sx={{ mt: 2 }}>
                  {campaign.platforms.map((platform) => (
                    <Chip
                      key={platform}
                      label={platform}
                      size="small"
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Button
                    startIcon={<BarChartIcon />}
                    onClick={() => {
                      setSelectedCampaign(campaign);
                      setOpenMetrics(true);
                    }}
                  >
                    View Metrics
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => {
          setAnchorEl(null);
          setOpenForm(true);
        }}>
          Edit
        </MenuItem>
        <MenuItem onClick={() => {
          handleDelete(selectedCampaign._id);
          setAnchorEl(null);
        }}>
          Delete
        </MenuItem>
      </Menu>

      <CampaignForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSubmit={handleSubmit}
        initialData={selectedCampaign}
        loading={loading}
      />

      {selectedCampaign && (
        <CampaignMetrics
          open={openMetrics}
          onClose={() => setOpenMetrics(false)}
          campaignId={selectedCampaign._id}
        />
      )}

      <Snackbar
        open={Boolean(success)}
        autoHideDuration={6000}
        onClose={() => setSuccess('')}
      >
        <Alert severity="success" onClose={() => setSuccess('')}>
          {success}
        </Alert>
      </Snackbar>

      <Snackbar
        open={Boolean(error)}
        autoHideDuration={6000}
        onClose={() => setError('')}
      >
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CampaignList; 