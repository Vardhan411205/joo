import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Container,
  Chip,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon
} from '@mui/icons-material';
import EditUserDialog from './EditUserDialog';
import { useAuth } from '../../contexts/AuthContext';

const AdminPanel = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Nikitha',
      email: 'yillipillinikitha4804@gmail.com',
      role: 'admin',
      lastLogin: new Date().toISOString()
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Load users from localStorage on component mount
  useEffect(() => {
    const storedUsers = localStorage.getItem('registeredUsers');
    if (storedUsers) {
      setUsers(prev => [...prev, ...JSON.parse(storedUsers)]);
    }
  }, []);

  const handleEdit = (userId) => {
    const user = users.find(u => u.id === userId);
    setSelectedUser(user);
    setEditDialogOpen(true);
  };

  const handleDelete = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const updatedUsers = users.filter(user => user.id !== userId);
      setUsers(updatedUsers);
      localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers.filter(user => user.role !== 'admin')));
    }
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setEditDialogOpen(true);
  };

  const handleSaveUser = (userData) => {
    let updatedUsers;
    if (userData.id) {
      // Update existing user
      updatedUsers = users.map(user => 
        user.id === userData.id ? { ...userData, lastLogin: user.lastLogin } : user
      );
    } else {
      // Add new user
      updatedUsers = [...users, { ...userData, id: Date.now(), lastLogin: new Date().toISOString() }];
    }
    setUsers(updatedUsers);
    // Store only non-admin users in localStorage
    localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers.filter(user => user.role !== 'admin')));
    setEditDialogOpen(false);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Manage Users
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddUser}
          >
            Add User
          </Button>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="users table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Last Login</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.role}
                      color={user.role === 'admin' ? 'primary' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(user.lastLogin).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleEdit(user.id)}
                      color="primary"
                      size="small"
                      sx={{ mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(user.id)}
                      color="error"
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <EditUserDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          user={selectedUser}
          onSave={handleSaveUser}
        />
      </Box>
    </Container>
  );
};

export default AdminPanel; 