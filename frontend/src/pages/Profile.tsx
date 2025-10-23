import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Avatar,
  Chip,
  Grid,
  Divider,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Save as SaveIcon,
  AccountCircle as AccountIcon,
  Email as EmailIcon,
  Language as LanguageIcon,
  Badge as BadgeIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { useBackend } from '../hooks/useBackend';

export default function Profile() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { call } = useBackend();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [language, setLanguage] = useState('en');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setLanguage(user.language_preference);
    }
  }, [user]);

  const handleSave = async () => {
    try {
      setError('');
      setSuccess(false);

      // Update name if changed
      if (name !== user?.name) {
        await call('update_user_name', [name]);
      }

      // Update email if changed
      if (email !== user?.email) {
        await call('update_user_email', [email]);
      }

      // Update language if changed
      if (language !== user?.language_preference) {
        await call('update_user_language', [language]);
        i18n.changeLanguage(language);
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);

      // Reload the page to fetch updated user data
      setTimeout(() => window.location.reload(), 1000);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    }
  };

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="info">Please log in to view your profile</Alert>
      </Container>
    );
  }

  const principalStr = typeof user.principal === 'string' 
    ? user.principal 
    : user.principal.toString();

  const getRoleName = (role: any): string => {
    if (!role) return 'Staff';
    return Object.keys(role)[0];
  };

  const getRoleColor = (role: any) => {
    const roleKey = getRoleName(role);
    switch (roleKey) {
      case 'Admin':
        return 'error';
      case 'Partner':
        return 'secondary';
      case 'Manager':
        return 'primary';
      case 'Senior':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
          {t('nav.profile')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your account settings and preferences
        </Typography>
      </Box>

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Profile updated successfully!
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Profile Overview Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: 'primary.main',
                fontSize: '2rem',
                mr: 3,
              }}
            >
              {user.name.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
                {user.name}
              </Typography>
              <Chip
                label={getRoleName(user.role)}
                color={getRoleColor(user.role) as any}
                size="small"
                sx={{ mb: 1 }}
              />
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}
              >
                Principal: {principalStr}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Edit Profile Card */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Profile Information
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Display Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                InputProps={{
                  startAdornment: <AccountIcon sx={{ mr: 1, color: 'action.active' }} />,
                }}
                helperText="This name will be displayed across the platform"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: <EmailIcon sx={{ mr: 1, color: 'action.active' }} />,
                }}
                helperText="Used for notifications and account recovery"
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Preferred Language</InputLabel>
                <Select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  label="Preferred Language"
                  startAdornment={<LanguageIcon sx={{ mr: 1, color: 'action.active' }} />}
                >
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="ar">العربية (Arabic)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Account Details
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <BadgeIcon sx={{ mr: 1, color: 'text.secondary', fontSize: '1.2rem' }} />
                <Typography variant="body2" color="text.secondary">
                  Role
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ ml: 4 }}>
                {getRoleName(user.role)}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <AccountIcon sx={{ mr: 1, color: 'text.secondary', fontSize: '1.2rem' }} />
                <Typography variant="body2" color="text.secondary">
                  Member Since
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ ml: 4 }}>
                {new Date(Number(user.created_at) / 1000000).toLocaleDateString()}
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => {
                setName(user.name);
                setEmail(user.email);
                setLanguage(user.language_preference);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Alert severity="info" sx={{ mt: 3 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
          Identity Security
        </Typography>
        <Typography variant="body2">
          Your account is secured by Internet Computer's Internet Identity. Your principal ID is unique
          and cryptographically secure. Contact an administrator to change your role or permissions.
        </Typography>
      </Alert>
    </Container>
  );
}

