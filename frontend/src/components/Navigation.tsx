import { useState } from 'react';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Chip,
  useTheme,
  useMediaQuery,
  Badge,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Business as BusinessIcon,
  AccountBalance as EntityIcon,
  People as ClientIcon,
  Assignment as EngagementIcon,
  CloudUpload as UploadIcon,
  Description as PaperIcon,
  FolderOpen as DocumentIcon,
  ManageAccounts as UserIcon,
  History as LogIcon,
  AccountCircle as AccountIcon,
  Logout as LogoutIcon,
  FolderShared as PortalIcon,
  AccountBalance as TrialBalanceIcon,
  CheckCircleOutline as AcceptanceIcon,
  Email as LetterIcon,
  Block as ConflictIcon,
  Dashboard as PlanningIcon,
  KeyboardArrowDown as ArrowDownIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import LanguageSwitcher from './LanguageSwitcher';

const drawerWidth = 280;

const menuItems = [
  { path: '/organizations', icon: BusinessIcon, label: 'nav.organizations', firmOnly: true },
  { path: '/entities', icon: EntityIcon, label: 'nav.entities', firmOnly: true },
  { path: '/clients', icon: ClientIcon, label: 'nav.clients', firmOnly: true },
  { path: '/client-acceptance', icon: AcceptanceIcon, label: 'nav.clientAcceptance', firmOnly: true },
  { path: '/conflict-check', icon: ConflictIcon, label: 'nav.conflictCheck', firmOnly: true },
  { path: '/engagement-letters', icon: LetterIcon, label: 'nav.engagementLetters', firmOnly: true },
  { path: '/engagements', icon: EngagementIcon, label: 'nav.engagements', firmOnly: true },
  { path: '/engagement-planning', icon: PlanningIcon, label: 'nav.engagementPlanning', firmOnly: true },
  { path: '/data-import', icon: UploadIcon, label: 'nav.dataImport', firmOnly: true },
  { path: '/trial-balance', icon: TrialBalanceIcon, label: 'nav.trialBalance', firmOnly: true },
  { path: '/financial-statements', icon: TrialBalanceIcon, label: 'nav.financialStatements', firmOnly: true },
  { path: '/working-papers', icon: PaperIcon, label: 'nav.workingPapers', firmOnly: true },
  { path: '/documents', icon: DocumentIcon, label: 'nav.documents', firmOnly: true },
  { path: '/document-requests', icon: DocumentIcon, label: 'nav.documentRequests', firmOnly: true },
  { path: '/client-portal', icon: PortalIcon, label: 'nav.clientPortal', clientOnly: true },
  { path: '/users', icon: UserIcon, label: 'nav.users', adminOnly: true },
  { path: '/activity-log', icon: LogIcon, label: 'nav.activityLog', firmOnly: true },
  { path: '/mock-data', icon: LogIcon, label: 'nav.mockData', firmOnly: true },
];

export default function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { user, isAuthenticated, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleProfileMenuClose();
    logout();
    navigate('/');
  };

  const getRoleColor = (role: any) => {
    const roleKey = Object.keys(role || {})[0];
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

  const getRoleName = (role: any) => {
    if (!role) return 'Staff';
    return Object.keys(role)[0];
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#FFFFFF' }}>
      {/* Enhanced Header */}
      <Box
        sx={{
          px: 3,
          py: 3,
          borderBottom: '1px solid #E5E7EB',
          background: 'linear-gradient(135deg, #0A2463 0%, #1E3A8A 100%)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '10px',
              bgcolor: 'rgba(255, 255, 255, 0.15)',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)',
            }}
          >
            <PaperIcon sx={{ color: 'white', fontSize: 24 }} />
          </Box>
          <Box>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 800, 
                color: 'white',
                fontSize: '1.25rem',
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
              }}
            >
              AuditorBox
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.75)',
                fontSize: '0.6875rem',
                fontWeight: 600,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              Professional Suite
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Navigation Menu */}
      <Box sx={{ overflow: 'auto', flex: 1, py: 3 }}>
        <List sx={{ px: 2.5 }}>
          {menuItems
            .filter((item) => {
              const isClient = user?.role && 'ClientUser' in user.role;
              const isAdmin = user?.role && 'Admin' in user.role;
              
              if (item.adminOnly && !isAdmin) return false;
              if (item.firmOnly && isClient) return false;
              if (item.clientOnly && !isClient) return false;
              return true;
            })
            .map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <ListItemButton
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    if (isMobile) setMobileOpen(false);
                  }}
                  sx={{
                    mb: 0.75,
                    borderRadius: '8px',
                    px: 2,
                    py: 1.25,
                    bgcolor: isActive ? 'rgba(10, 36, 99, 0.08)' : 'transparent',
                    border: isActive ? '1px solid rgba(10, 36, 99, 0.12)' : '1px solid transparent',
                    color: isActive ? 'primary.main' : 'text.secondary',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': isActive ? {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '4px',
                      height: '60%',
                      bgcolor: 'primary.main',
                      borderRadius: '0 2px 2px 0',
                    } : {},
                    '&:hover': {
                      bgcolor: isActive ? 'rgba(10, 36, 99, 0.12)' : 'rgba(0, 0, 0, 0.04)',
                      border: '1px solid rgba(10, 36, 99, 0.08)',
                    },
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: 'inherit',
                      minWidth: 36,
                    }}
                  >
                    <Icon sx={{ fontSize: 20 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={t(item.label)}
                    primaryTypographyProps={{
                      fontSize: '0.875rem',
                      fontWeight: isActive ? 700 : 500,
                      letterSpacing: '0.01em',
                    }}
                  />
                </ListItemButton>
              );
            })}
        </List>
      </Box>

      {/* Enhanced User Profile Section */}
      {user && (
        <Box 
          sx={{ 
            p: 2.5, 
            borderTop: '1px solid #E5E7EB',
            bgcolor: '#F9FAFB',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              p: 1.75,
              borderRadius: '10px',
              bgcolor: 'white',
              border: '1px solid #E5E7EB',
              cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                transform: 'translateY(-1px)',
              },
            }}
            onClick={handleProfileMenuOpen}
          >
            <Avatar
              sx={{
                bgcolor: 'primary.main',
                width: 42,
                height: 42,
                fontSize: '1rem',
                fontWeight: 700,
                boxShadow: '0 2px 8px rgba(10, 36, 99, 0.25)',
              }}
            >
              {user.name.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography 
                variant="subtitle2" 
                noWrap
                sx={{ 
                  fontWeight: 700, 
                  fontSize: '0.875rem',
                  color: 'text.primary',
                  mb: 0.25,
                }}
              >
                {user.name}
              </Typography>
              <Chip
                label={getRoleName(user.role)}
                size="small"
                color={getRoleColor(user.role) as any}
                sx={{ 
                  height: 22, 
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  letterSpacing: '0.02em',
                }}
              />
            </Box>
            <ArrowDownIcon 
              sx={{ 
                fontSize: 18, 
                color: 'text.secondary',
                transition: 'transform 0.2s',
              }} 
            />
          </Box>
        </Box>
      )}
    </Box>
  );

  if (!isAuthenticated) {
    return (
      <AppBar
        position="static"
        elevation={0}
        sx={{ 
          bgcolor: 'white', 
          color: 'text.primary', 
          borderBottom: '1px solid #E5E7EB',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', py: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #0A2463 0%, #1E3A8A 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <PaperIcon sx={{ color: 'white', fontSize: 20 }} />
            </Box>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 800, 
                color: 'primary.main',
                fontSize: '1.25rem',
                letterSpacing: '-0.02em',
              }}
            >
              AuditorBox
            </Typography>
          </Box>
          <LanguageSwitcher />
        </Toolbar>
      </AppBar>
    );
  }

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          bgcolor: 'white',
          color: 'text.primary',
          borderBottom: '1px solid #E5E7EB',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
        }}
      >
        <Toolbar sx={{ py: 1.5, minHeight: { xs: 64, md: 72 } }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ 
              mr: 2, 
              display: { md: 'none' },
              '&:hover': {
                bgcolor: 'rgba(10, 36, 99, 0.08)',
              }
            }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ flexGrow: 1 }}>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 700,
                fontSize: '1.25rem',
                color: 'text.primary',
                letterSpacing: '-0.015em',
              }}
            >
              {t(menuItems.find((item) => item.path === location.pathname)?.label || 'AuditorBox')}
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'text.secondary',
                fontSize: '0.75rem',
                display: { xs: 'none', sm: 'block' }
              }}
            >
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <LanguageSwitcher />
            
            <IconButton 
              size="medium"
              sx={{
                '&:hover': {
                  bgcolor: 'rgba(10, 36, 99, 0.08)',
                }
              }}
            >
              <Badge badgeContent={0} color="error">
                <NotificationsIcon sx={{ fontSize: 22 }} />
              </Badge>
            </IconButton>

            <Box
              onClick={handleProfileMenuOpen}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                cursor: 'pointer',
                px: 1.5,
                py: 0.75,
                borderRadius: '8px',
                border: '1px solid #E5E7EB',
                bgcolor: 'white',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  bgcolor: '#F9FAFB',
                  borderColor: '#D1D5DB',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                },
              }}
            >
              <Avatar
                sx={{
                  bgcolor: 'primary.main',
                  width: 34,
                  height: 34,
                  fontSize: '0.875rem',
                  fontWeight: 700,
                }}
              >
                {user?.name.charAt(0).toUpperCase()}
              </Avatar>
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    lineHeight: 1.2,
                  }}
                >
                  {user?.name}
                </Typography>
              </Box>
              <ArrowDownIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: 1,
              borderColor: 'divider',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => { navigate('/profile'); handleProfileMenuClose(); }}>
          <ListItemIcon>
            <AccountIcon fontSize="small" />
          </ListItemIcon>
          {t('nav.profile')}
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          {t('nav.logout')}
        </MenuItem>
      </Menu>
    </>
  );
}
