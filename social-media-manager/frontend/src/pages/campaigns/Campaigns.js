import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Dialog,
  TextField,
  MenuItem,
  Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DateTimePicker } from '@mui/x-date-pickers';
import campaignService from '../../services/campaignService';

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: null,
    endDate: null,
    platforms: [],
    goals: []
  });

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      const response = await campaignService.getCampaigns();
      setCampaigns(response.data);
    } catch (error) {
      console.error('Error loading campaigns:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedCampaign) {
        await campaignService.updateCampaign(selectedCampaign._id, formData);
      } else {
        await campaignService.createCampaign(formData);
      }
      setOpenDialog(false);
      loadCampaigns();
    } catch (error) {
      console.error('Error saving campaign:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await campaignService.deleteCampaign(id);
      loadCampaigns();
    } catch (error) {
      console.error('Error deleting campaign:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Campaigns</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setSelectedCampaign(null);
            setFormData({
              name: '',
              description: '',
              startDate: null,
              endDate: null,
              platforms: [],
              goals: []
            });
            setOpenDialog(true);
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
                <Typography variant="h6">{campaign.name}</Typography>
                <Typography color="textSecondary" gutterBottom>
                  {campaign.description}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  {campaign.platforms.map((platform) => (
                    <Chip
                      key={platform}
                      label={platform}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                  ))}
                </Box>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <IconButton
                    onClick={() => {
                      setSelectedCampaign(campaign);
                      setFormData(campaign);
                      setOpenDialog(true);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(campaign._id)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            {selectedCampaign ? 'Edit Campaign' : 'New Campaign'}
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Campaign Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              margin="normal"
              multiline
              rows={3}
            />
            <DateTimePicker
              label="Start Date"
              value={formData.startDate}
              onChange={(date) => setFormData({ ...formData, startDate: date })}
              renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
            />
            <DateTimePicker
              label="End Date"
              value={formData.endDate}
              onChange={(date) => setFormData({ ...formData, endDate: date })}
              renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
            />
            <TextField
              select
              fullWidth
              label="Platforms"
              value={formData.platforms}
              onChange={(e) => setFormData({ ...formData, platforms: e.target.value })}
              margin="normal"
              SelectProps={{
                multiple: true,
                renderValue: (selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                ),
              }}
            >
              <MenuItem value="facebook">Facebook</MenuItem>
              <MenuItem value="twitter">Twitter</MenuItem>
              <MenuItem value="instagram">Instagram</MenuItem>
              <MenuItem value="linkedin">LinkedIn</MenuItem>
            </TextField>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
              <Button type="submit" variant="contained">Save</Button>
            </Box>
          </form>
        </Box>
      </Dialog>
    </Box>
  );
};

export default Campaigns; 