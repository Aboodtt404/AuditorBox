import { Button, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';

const AuthButton = () => {
  const { t } = useTranslation();
  const { isAuthenticated, login, logout } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await login();
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <CircularProgress size={24} color="inherit" />;
  }

  return (
    <Button
      color="inherit"
      onClick={isAuthenticated ? handleLogout : handleLogin}
      variant="outlined"
      sx={{ borderColor: 'white', color: 'white' }}
    >
      {isAuthenticated ? t('nav.logout') : t('nav.login')}
    </Button>
  );
};

export default AuthButton;

