import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Grid,
  Typography,
  TextField,
  Button,
  Avatar,
  Box,
  Snackbar,
  Alert
} from '@mui/material';

const EditProfile = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [bio, setBio] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Load user data from backend (optional)
  useEffect(() => {
    fetch('/api/user/profile') // adjust your route
      .then(res => res.json())
      .then(data => {
        setFullName(data.fullName);
        setEmail(data.email);
        setPhoneNumber(data.phoneNumber);
        setBio(data.bio);
      })
      .catch(() => {
        setSnackbar({ open: true, message: 'Failed to load profile.', severity: 'error' });
      });
  }, []);

  const handleSaveChanges = async () => {
    try {
      const formData = new FormData();
      formData.append('fullName', fullName);
      formData.append('email', email);
      formData.append('phoneNumber', phoneNumber);
      formData.append('bio', bio);
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      if (!formData.fullName?.trim()) {
        setError('Full Name is required');
        setLoading(false);
        return;
      }

      const result = await updateProfile({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phoneNumber: formData.phoneNumber?.trim() || '',
        bio: formData.bio?.trim() || ''
      });

      setFormData({
        fullName: result.user.fullName || '',
        email: result.user.email || '',
        phoneNumber: result.user.phoneNumber || '',
        bio: result.user.bio || ''
      });

      setSnackbar({ open: true, message: 'Profile updated successfully!', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to update profile.', severity: 'error' });
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" gutterBottom>Profile Settings</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={3}>
            <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
              <Avatar
                src={avatarFile ? URL.createObjectURL(avatarFile) : ''}
                sx={{ width: 80, height: 80, mb: 2 }}
              />
              <Button variant="contained" component="label">
                Upload
                <input
                  hidden
                  accept="image/*"
                  type="file"
                  onChange={(e) => setAvatarFile(e.target.files[0])}
                />
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} sm={9}>
            <TextField
              fullWidth
              label="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Bio"
              multiline
              minRows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Box mt={2} display="flex" justifyContent="flex-end">
              <Button variant="contained" onClick={handleSaveChanges}>
                Save Changes
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default EditProfile;
