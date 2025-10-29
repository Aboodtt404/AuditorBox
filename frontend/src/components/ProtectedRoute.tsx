import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Box, CircularProgress } from '@mui/material';

interface ProtectedRouteProps {
  children: ReactNode;
  requireFirmUser?: boolean;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ 
  children, 
  requireFirmUser = false,
  requireAdmin = false 
}: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/');
      return;
    }

    // Check if admin access required
    if (requireAdmin && user.role && !('Admin' in user.role)) {
      navigate('/client-portal');
      return;
    }

    // Check if firm user required (not a client)
    if (requireFirmUser && user.role && 'ClientUser' in user.role) {
      navigate('/client-portal');
      return;
    }
  }, [isAuthenticated, user, requireFirmUser, requireAdmin, navigate]);

  if (!isAuthenticated || !user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  // Block access if requirements not met
  if (requireAdmin && user.role && !('Admin' in user.role)) {
    return null;
  }

  if (requireFirmUser && user.role && 'ClientUser' in user.role) {
    return null;
  }

  return <>{children}</>;
}

