import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
  CircularProgress
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import emailjs from '@emailjs/browser';

const SERVICE_ID = 'service_k2m7w4j';
const TEMPLATE_ID = 'template_2k8yvsp';
const PUBLIC_KEY = 'pHkxBUK0fgWgc5Jxx';

const ContactUs = () => {
  const form = useRef();
  const [formData, setFormData] = useState({
    from_name: '',
    reply_to: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState({
    loading: false,
    error: '',
    success: false
  });

  useEffect(() => {
    emailjs.init(PUBLIC_KEY);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const sendDirectEmail = async (templateParams) => {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        service_id: SERVICE_ID,
        template_id: TEMPLATE_ID,
        user_id: PUBLIC_KEY,
        template_params: templateParams,
      })
    });
    return response;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: '', success: false });

    try {
      const templateParams = {
        to_name: 'Admin',
        from_name: formData.from_name,
        reply_to: formData.reply_to,
        subject: formData.subject,
        message: formData.message,
        to_email: 'yillipillinikitha4804@gmail.com'
      };

      const response = await sendDirectEmail(templateParams);

      if (response.ok) {
        setStatus({
          loading: false,
          error: '',
          success: true
        });
        
        // Clear form after successful submission
        setFormData({
          from_name: '',
          reply_to: '',
          subject: '',
          message: ''
        });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (err) {
      console.error('Email error:', err);
      setStatus({
        loading: false,
        error: 'Failed to send message. Please try again.',
        success: false
      });
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Contact Us
          </Typography>
          <Typography variant="body1" gutterBottom align="center" sx={{ mb: 4 }}>
            Have a question or feedback? We'd love to hear from you.
          </Typography>

          {status.error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {status.error}
            </Alert>
          )}

          {status.success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Your message has been sent successfully!
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Name"
              name="from_name"
              value={formData.from_name}
              onChange={handleChange}
              margin="normal"
              required
              autoFocus
              sx={{ backgroundColor: '#f8f9fa' }}
            />

            <TextField
              fullWidth
              label="Email"
              name="reply_to"
              type="email"
              value={formData.reply_to}
              onChange={handleChange}
              margin="normal"
              required
              sx={{ backgroundColor: '#f8f9fa' }}
            />

            <TextField
              fullWidth
              label="Subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              margin="normal"
              required
              sx={{ backgroundColor: '#f8f9fa' }}
            />

            <TextField
              fullWidth
              label="Message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              margin="normal"
              required
              multiline
              rows={4}
              sx={{ backgroundColor: '#f8f9fa' }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={status.loading}
              startIcon={status.loading ? <CircularProgress size={24} /> : <SendIcon />}
              sx={{ mt: 3 }}
            >
              {status.loading ? 'Sending...' : 'Send Message'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ContactUs; 