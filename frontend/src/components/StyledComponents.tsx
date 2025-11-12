import { Box, Paper, Card, styled, alpha } from '@mui/material';

/**
 * Professional Styled Components
 * Reusable UI elements following audit software design patterns
 */

// Page Header Component
export const PageHeader = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  paddingBottom: theme.spacing(3),
  borderBottom: `2px solid ${theme.palette.grey[200]}`,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: theme.spacing(2),
}));

// Professional Card with subtle elevation
export const ProfessionalCard = styled(Card)(({ theme }) => ({
  borderRadius: '10px',
  border: `1px solid ${theme.palette.grey[200]}`,
  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px 0 rgba(0, 0, 0, 0.04)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.1), 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    transform: 'translateY(-2px)',
  },
}));

// Stats/Metric Card
export const MetricCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: '12px',
  border: `1px solid ${theme.palette.grey[200]}`,
  padding: theme.spacing(3),
  background: 'linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '4px',
    height: '100%',
    background: `linear-gradient(180deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  },
  '&:hover': {
    boxShadow: '0 8px 16px 0 rgba(0, 0, 0, 0.1)',
    transform: 'translateY(-4px)',
  },
}));

// Section Container with consistent spacing
export const SectionContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(5),
  '& + &': {
    marginTop: theme.spacing(5),
  },
}));

// Enhanced Paper for tables and forms
export const DataPaper = styled(Paper)(({ theme }) => ({
  borderRadius: '10px',
  border: `1px solid ${theme.palette.grey[200]}`,
  overflow: 'hidden',
  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px 0 rgba(0, 0, 0, 0.04)',
}));

// Status Badge Container
export const StatusBadge = styled(Box)<{ status?: 'success' | 'warning' | 'error' | 'info' | 'default' }>(
  ({ theme, status = 'default' }) => {
    const colors = {
      success: {
        bg: alpha(theme.palette.success.main, 0.1),
        text: theme.palette.success.dark,
      },
      warning: {
        bg: alpha(theme.palette.warning.main, 0.1),
        text: theme.palette.warning.dark,
      },
      error: {
        bg: alpha(theme.palette.error.main, 0.1),
        text: theme.palette.error.dark,
      },
      info: {
        bg: alpha(theme.palette.info.main, 0.1),
        text: theme.palette.info.dark,
      },
      default: {
        bg: alpha(theme.palette.grey[500], 0.1),
        text: theme.palette.grey[700],
      },
    };

    return {
      display: 'inline-flex',
      alignItems: 'center',
      padding: theme.spacing(0.5, 1.5),
      borderRadius: '6px',
      backgroundColor: colors[status].bg,
      color: colors[status].text,
      fontWeight: 700,
      fontSize: '0.75rem',
      letterSpacing: '0.03em',
      textTransform: 'uppercase',
    };
  }
);

// Action Button Container
export const ActionButtonGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  flexWrap: 'wrap',
  '& .MuiIconButton-root': {
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      transform: 'scale(1.1)',
    },
  },
}));

// Gradient Background Container
export const GradientBackground = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  borderRadius: '12px',
  padding: theme.spacing(4),
  color: 'white',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    width: '50%',
    height: '100%',
    background: 'radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
  },
}));

// Info Panel
export const InfoPanel = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2.5),
  borderRadius: '8px',
  backgroundColor: alpha(theme.palette.info.main, 0.05),
  border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
  display: 'flex',
  gap: theme.spacing(2),
  alignItems: 'flex-start',
}));

// Empty State Container
export const EmptyStateContainer = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(8, 3),
  color: theme.palette.text.secondary,
  '& .MuiSvgIcon-root': {
    fontSize: '4rem',
    marginBottom: theme.spacing(2),
    opacity: 0.3,
  },
}));

// Professional Table Header
export const TableHeaderCell = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[50],
  color: theme.palette.grey[700],
  fontSize: '0.8125rem',
  fontWeight: 700,
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  padding: theme.spacing(2),
  borderBottom: `2px solid ${theme.palette.grey[200]}`,
}));

// Loading Overlay
export const LoadingOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(4px)',
  zIndex: 1000,
}));

// Sidebar Panel
export const SidebarPanel = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '10px',
  border: `1px solid ${theme.palette.grey[200]}`,
  backgroundColor: theme.palette.grey[50],
  height: 'fit-content',
  position: 'sticky',
  top: theme.spacing(10),
}));

// Feature Highlight Box
export const FeatureBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '10px',
  border: `1px solid ${theme.palette.grey[200]}`,
  backgroundColor: 'white',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.1)',
    transform: 'translateY(-2px)',
    '& .feature-icon': {
      transform: 'scale(1.1)',
      color: theme.palette.primary.main,
    },
  },
}));

// Icon Container
export const IconContainer = styled(Box)(({ theme }) => ({
  width: 48,
  height: 48,
  borderRadius: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: alpha(theme.palette.primary.main, 0.08),
  color: theme.palette.primary.main,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
}));

// Divider with Label
export const LabeledDivider = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  margin: theme.spacing(3, 0),
  '&::before, &::after': {
    content: '""',
    flex: 1,
    borderBottom: `1px solid ${theme.palette.grey[300]}`,
  },
  '& > span': {
    padding: theme.spacing(0, 2),
    fontSize: '0.8125rem',
    fontWeight: 700,
    color: theme.palette.text.secondary,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
  },
}));

// Professional Alert Box
export const AlertBox = styled(Box)<{ severity?: 'error' | 'warning' | 'info' | 'success' }>(
  ({ theme, severity = 'info' }) => {
    const colors = {
      error: {
        bg: alpha(theme.palette.error.main, 0.08),
        border: alpha(theme.palette.error.main, 0.3),
        text: theme.palette.error.dark,
      },
      warning: {
        bg: alpha(theme.palette.warning.main, 0.08),
        border: alpha(theme.palette.warning.main, 0.3),
        text: theme.palette.warning.dark,
      },
      info: {
        bg: alpha(theme.palette.info.main, 0.08),
        border: alpha(theme.palette.info.main, 0.3),
        text: theme.palette.info.dark,
      },
      success: {
        bg: alpha(theme.palette.success.main, 0.08),
        border: alpha(theme.palette.success.main, 0.3),
        text: theme.palette.success.dark,
      },
    };

    return {
      padding: theme.spacing(2),
      borderRadius: '8px',
      backgroundColor: colors[severity].bg,
      border: `1px solid ${colors[severity].border}`,
      color: colors[severity].text,
      display: 'flex',
      alignItems: 'flex-start',
      gap: theme.spacing(1.5),
    };
  }
);

// Grid Container for consistent layouts
export const GridContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: theme.spacing(3),
  [theme.breakpoints.up('md')]: {
    gap: theme.spacing(4),
  },
}));

// Floating Action Button Container
export const FloatingActionContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(4),
  right: theme.spacing(4),
  zIndex: 1000,
  '& .MuiFab-root': {
    boxShadow: '0 8px 24px rgba(10, 36, 99, 0.25)',
    '&:hover': {
      transform: 'scale(1.1)',
      boxShadow: '0 12px 32px rgba(10, 36, 99, 0.35)',
    },
  },
}));

