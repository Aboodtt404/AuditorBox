import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  Snackbar,
  Alert,
  AlertTitle,
  Slide,
  Box,
  IconButton,
  Typography,
  Paper,
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { TransitionProps } from '@mui/material/transitions';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
}

interface NotificationContextType {
  showNotification: (notification: Omit<Notification, 'id'>) => void;
  showSuccess: (message: string, title?: string) => void;
  showError: (message: string, title?: string) => void;
  showWarning: (message: string, title?: string) => void;
  showInfo: (message: string, title?: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

function SlideTransition(props: TransitionProps) {
  return <Slide {...props} direction="down" />;
}

const iconMap = {
  success: SuccessIcon,
  error: ErrorIcon,
  warning: WarningIcon,
  info: InfoIcon,
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = `notification-${Date.now()}-${Math.random()}`;
    const newNotification: Notification = {
      id,
      duration: 6000,
      ...notification,
    };
    
    setNotifications((prev) => [...prev, newNotification]);

    // Auto-remove after duration
    if (newNotification.duration) {
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, newNotification.duration);
    }
  }, []);

  const showSuccess = useCallback((message: string, title?: string) => {
    showNotification({ type: 'success', message, title });
  }, [showNotification]);

  const showError = useCallback((message: string, title?: string) => {
    showNotification({ type: 'error', message, title, duration: 8000 });
  }, [showNotification]);

  const showWarning = useCallback((message: string, title?: string) => {
    showNotification({ type: 'warning', message, title });
  }, [showNotification]);

  const showInfo = useCallback((message: string, title?: string) => {
    showNotification({ type: 'info', message, title });
  }, [showNotification]);

  const handleClose = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider
      value={{
        showNotification,
        showSuccess,
        showError,
        showWarning,
        showInfo,
      }}
    >
      {children}
      
      {/* Render all notifications */}
      <Box
        sx={{
          position: 'fixed',
          top: 88,
          right: 24,
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          maxWidth: 420,
        }}
      >
        {notifications.map((notification, index) => {
          const Icon = iconMap[notification.type];
          
          return (
            <Slide
              key={notification.id}
              direction="left"
              in={true}
              timeout={300}
              style={{
                transformOrigin: 'top right',
              }}
            >
              <Paper
                elevation={8}
                sx={{
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '1px solid',
                  borderColor: notification.type === 'success' ? 'success.light' :
                               notification.type === 'error' ? 'error.light' :
                               notification.type === 'warning' ? 'warning.light' :
                               'info.light',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                  minWidth: 360,
                  animation: 'slideIn 0.3s ease-out',
                  '@keyframes slideIn': {
                    '0%': {
                      transform: 'translateX(100%)',
                      opacity: 0,
                    },
                    '100%': {
                      transform: 'translateX(0)',
                      opacity: 1,
                    },
                  },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    p: 2,
                    gap: 1.5,
                    bgcolor: 'white',
                  }}
                >
                  {/* Icon */}
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: notification.type === 'success' ? 'success.main' :
                               notification.type === 'error' ? 'error.main' :
                               notification.type === 'warning' ? 'warning.main' :
                               'info.main',
                      color: 'white',
                      flexShrink: 0,
                    }}
                  >
                    <Icon sx={{ fontSize: 22 }} />
                  </Box>

                  {/* Content */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    {notification.title && (
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 700,
                          mb: 0.5,
                          color: 'text.primary',
                          fontSize: '0.9375rem',
                        }}
                      >
                        {notification.title}
                      </Typography>
                    )}
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        fontSize: '0.875rem',
                        lineHeight: 1.6,
                        whiteSpace: 'pre-line',
                      }}
                    >
                      {notification.message}
                    </Typography>
                  </Box>

                  {/* Close Button */}
                  <IconButton
                    size="small"
                    onClick={() => handleClose(notification.id)}
                    sx={{
                      flexShrink: 0,
                      '&:hover': {
                        bgcolor: 'rgba(0, 0, 0, 0.04)',
                      },
                    }}
                  >
                    <CloseIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Box>

                {/* Progress Bar */}
                {notification.duration && (
                  <Box
                    sx={{
                      height: 4,
                      bgcolor: notification.type === 'success' ? 'success.main' :
                               notification.type === 'error' ? 'error.main' :
                               notification.type === 'warning' ? 'warning.main' :
                               'info.main',
                      animation: `shrink ${notification.duration}ms linear`,
                      '@keyframes shrink': {
                        '0%': { width: '100%' },
                        '100%': { width: '0%' },
                      },
                    }}
                  />
                )}
              </Paper>
            </Slide>
          );
        })}
      </Box>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

