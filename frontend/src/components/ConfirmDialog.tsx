import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Slide,
} from '@mui/material';
import {
  Close as CloseIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { TransitionProps } from '@mui/material/transitions';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  severity?: 'warning' | 'error' | 'info' | 'success';
  confirmColor?: 'primary' | 'secondary' | 'error' | 'warning' | 'success';
}

const iconMap = {
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
  success: SuccessIcon,
};

const colorMap = {
  warning: '#F59E0B',
  error: '#DC2626',
  info: '#0EA5E9',
  success: '#10B981',
};

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  severity = 'warning',
  confirmColor = 'primary',
}) => {
  const Icon = iconMap[severity];
  const iconColor = colorMap[severity];

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
        },
      }}
    >
      {/* Header with Icon */}
      <Box
        sx={{
          pt: 4,
          px: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'text.secondary',
          }}
        >
          <CloseIcon />
        </IconButton>

        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: '16px',
            bgcolor: `${iconColor}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
          }}
        >
          <Icon sx={{ fontSize: 36, color: iconColor }} />
        </Box>

        <DialogTitle
          sx={{
            p: 0,
            textAlign: 'center',
            fontSize: '1.5rem',
            fontWeight: 700,
            color: 'text.primary',
            mb: 1,
          }}
        >
          {title}
        </DialogTitle>
      </Box>

      <DialogContent sx={{ px: 3, pb: 2 }}>
        <Typography
          variant="body1"
          sx={{
            textAlign: 'center',
            color: 'text.secondary',
            lineHeight: 1.7,
            whiteSpace: 'pre-line',
          }}
        >
          {message}
        </Typography>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          pb: 3,
          gap: 1.5,
          justifyContent: 'center',
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          size="large"
          sx={{
            minWidth: 120,
            borderWidth: '1.5px',
            fontWeight: 600,
            '&:hover': {
              borderWidth: '1.5px',
            },
          }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color={confirmColor}
          size="large"
          sx={{
            minWidth: 120,
            fontWeight: 600,
            boxShadow: 2,
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;

