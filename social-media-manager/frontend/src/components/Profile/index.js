import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Avatar,
  IconButton,
  Alert,
  Stack
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: ''
  });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Load saved profile data from localStorage
    const savedProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    setFormData(prev => ({
      ...prev,
      fullName: savedProfile.fullName || user?.name || '',
      email: savedProfile.email || user?.email || '',
      phoneNumber: savedProfile.phoneNumber || ''
    }));
    if (savedProfile.photoUrl) {
      setPhotoPreview(savedProfile.photoUrl);
    }
  }, [user]);

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      // Save to localStorage
      const profileData = {
        ...formData,
        photoUrl: photoPreview
      };
      localStorage.setItem('userProfile', JSON.stringify(profileData));
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update profile');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Profile Settings
        </Typography>

        {(success || error) && (
          <Alert 
            severity={success ? "success" : "error"} 
            sx={{ mb: 2 }}
          >
            {success || error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={3} alignItems="center">
            <Box sx={{ position: 'relative' }}>
              <Avatar
                src={photoPreview}
                sx={{
                  width: 100,
                  height: 100,
                  mb: 2
                }}
              />
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="label"
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: -20,
                  backgroundColor: 'white',
                  '&:hover': { backgroundColor: '#f5f5f5' }
                }}
              >
                <input
                  hidden
                  accept="image/*"
                  type="file"
                  onChange={handlePhotoChange}
                />
                <PhotoCamera />
              </IconButton>
            </Box>

            <TextField
              fullWidth
              required
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
            />

            <TextField
              fullWidth
              required
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />

            <TextField
              fullWidth
              required
              label="Phone Number"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="e.g., +1 234 567 8900"
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
            >
              Save Changes
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile; 