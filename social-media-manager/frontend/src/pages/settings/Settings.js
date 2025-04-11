import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Alert,
  List,
  ListItem,
  Snackbar,
  CircularProgress
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import settingsService from '../../services/settingsService';

const Settings = () => {
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [preferences, setPreferences] = useState({
    autoSchedule: false,
    emailNotifications: false,
    postNotifications: false,
    campaignNotifications: false
  });
  
  const { user, updateUser } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();

  useEffect(() => {
    loadPreferences();
    loadNotifications();
  }, []);

  const loadPreferences = async () => {
    try {
      const response = await settingsService.getPreferences();
      setPreferences(response.data);
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const loadNotifications = async () => {
    try {
      const response = await settingsService.getNotifications();
      setPreferences(prev => ({
        ...prev,
        ...response.preferences
      }));
    } catch (error) {
      console.error('Error loading notifications:', error);
      setError('Failed to load notification preferences');
    }
  };

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const handleProfileUpdate = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await settingsService.updateProfile({
        name: user.name,
        email: user.email
      });
      setSuccess('Profile updated successfully');
      updateUser(response.data);
    } catch (error) {
      setError(error.response?.data?.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationToggle = async (type) => {
    try {
      setLoading(true);
      const newValue = !preferences[type];
      
      const notificationKey = {
        'email': 'emailNotifications',
        'post': 'postPublished',
        'campaign': 'campaignUpdates'
      }[type];

      await settingsService.updateNotifications({
        [notificationKey]: newValue
      });

      setPreferences(prev => ({
        ...prev,
        [type]: newValue
      }));
      
      setSuccess('Notifications updated successfully');
    } catch (error) {
      setError(error.response?.data?.message || 'Error updating notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleAutoScheduleToggle = async () => {
    try {
      setLoading(true);
      const newValue = !preferences.autoSchedule;
      await settingsService.updatePreferences({ autoSchedule: newValue });
      setPreferences(prev => ({ ...prev, autoSchedule: newValue }));
      setSuccess('Auto-schedule preference updated');
    } catch (error) {
      setError(error.response?.data?.message || 'Error updating preferences');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {success && (
        <Snackbar
          open={Boolean(success)}
          autoHideDuration={6000}
          onClose={() => setSuccess('')}
        >
          <Alert onClose={() => setSuccess('')} severity="success">
            {success}
          </Alert>
        </Snackbar>
      )}

      {error && (
        <Snackbar
          open={Boolean(error)}
          autoHideDuration={6000}
          onClose={() => setError('')}
        >
          <Alert onClose={() => setError('')} severity="error">
            {error}
          </Alert>
        </Snackbar>
      )}

      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      <Paper sx={{ mt: 3 }}>
        <Tabs value={tab} onChange={handleTabChange}>
          <Tab label="Profile" />
          <Tab label="Notifications" />
          <Tab label="Security" />
        </Tabs>

        {/* Profile Settings */}
        {tab === 0 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Profile Settings
            </Typography>
            <TextField
              fullWidth
              label="Name"
              defaultValue={user?.name}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Email"
              defaultValue={user?.email}
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              onClick={handleProfileUpdate}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Save Changes'}
            </Button>
          </Box>
        )}

        {/* Notifications */}
        {tab === 1 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Notification Preferences
            </Typography>
            <List>
              <ListItem>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={preferences.emailNotifications}
                      onChange={() => handleNotificationToggle('email')}
                      disabled={loading}
                    />
                  }
                  label="Email Notifications"
                />
              </ListItem>
              <ListItem>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={preferences.postPublished}
                      onChange={() => handleNotificationToggle('post')}
                      disabled={loading}
                    />
                  }
                  label="Post Published Notifications"
                />
              </ListItem>
              <ListItem>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={preferences.campaignUpdates}
                      onChange={() => handleNotificationToggle('campaign')}
                      disabled={loading}
                    />
                  }
                  label="Campaign Updates"
                />
              </ListItem>
            </List>
          </Box>
        )}

        {/* Security */}
        {tab === 2 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Security
            </Typography>
            <List>
              <ListItem>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={darkMode}
                      onChange={toggleDarkMode}
                    />
                  }
                  label="Dark Mode"
                />
              </ListItem>
              <ListItem>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={preferences.autoSchedule}
                      onChange={handleAutoScheduleToggle}
                      disabled={loading}
                    />
                  }
                  label="Auto-schedule Posts"
                />
              </ListItem>
            </List>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default Settings; 