import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useBackend } from '../hooks/useBackend';

interface UserRole {
  Admin?: null;
  Partner?: null;
  Manager?: null;
  Senior?: null;
  Staff?: null;
  ClientUser?: null;
}

const ProfileSetup: React.FC = () => {
  const { t } = useTranslation();
  const backend = useBackend();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [requestedRole, setRequestedRole] = useState<string>('Staff');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Available roles for selection
  const roles = [
    { value: 'Staff', label: t('roles.staff') || 'Staff' },
    { value: 'Senior', label: t('roles.senior') || 'Senior Auditor' },
    { value: 'Manager', label: t('roles.manager') || 'Manager' },
    { value: 'Partner', label: t('roles.partner') || 'Partner' },
    { value: 'ClientUser', label: t('roles.clientUser') || 'Client User' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      // Convert role string to UserRole object (Candid variant)
      const roleVariant: UserRole = { [requestedRole]: null } as UserRole;

      await backend.call('complete_user_profile', [
        {
          name: name.trim(),
          email: email.trim(),
          requested_role: roleVariant,
        },
      ]);

      // Profile completed successfully - redirect based on role
      // Client users go to client portal, firm users go to engagements
      const redirectUrl = requestedRole === 'ClientUser' ? '/client-portal' : '/engagements';
      window.location.href = redirectUrl;
    } catch (err: any) {
      console.error('Failed to complete profile:', err);
      setError(err.message || 'Failed to complete profile');
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Welcome to AuditorBox
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph align="center">
            Let's set up your profile to get started
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <TextField
              fullWidth
              label="Full Name *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              margin="normal"
              autoFocus
              placeholder="John Doe"
            />

            <TextField
              fullWidth
              label="Email Address *"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              margin="normal"
              placeholder="john.doe@example.com"
            />

            <TextField
              fullWidth
              select
              label="Requested Role *"
              value={requestedRole}
              onChange={(e) => setRequestedRole(e.target.value)}
              disabled={loading}
              margin="normal"
              helperText="Your administrator will approve your role"
            >
              {roles.map((role) => (
                <MenuItem key={role.value} value={role.value}>
                  {role.label}
                </MenuItem>
              ))}
            </TextField>

            <Alert severity="info" sx={{ mt: 3, mb: 2 }}>
              <Typography variant="body2">
                <strong>Note:</strong> The role you select is a request. Your administrator will review
                and approve the appropriate access level for your account.
              </Typography>
            </Alert>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Complete Profile'}
            </Button>
          </Box>
        </Paper>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Powered by Internet Computer blockchain
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default ProfileSetup;

