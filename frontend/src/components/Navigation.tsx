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
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import LanguageSwitcher from './LanguageSwitcher';

const drawerWidth = 260;

const menuItems = [
  { path: '/organizations', icon: BusinessIcon, label: 'nav.organizations' },
  { path: '/entities', icon: EntityIcon, label: 'nav.entities' },
  { path: '/clients', icon: ClientIcon, label: 'nav.clients' },
  { path: '/engagements', icon: EngagementIcon, label: 'nav.engagements' },
  { path: '/data-import', icon: UploadIcon, label: 'nav.dataImport' },
  { path: '/working-papers', icon: PaperIcon, label: 'nav.workingPapers' },
  { path: '/documents', icon: DocumentIcon, label: 'nav.documents' },
  { path: '/users', icon: UserIcon, label: 'nav.users', adminOnly: true },
  { path: '/activity-log', icon: LogIcon, label: 'nav.activityLog' },
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
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar
        sx={{
          px: 3,
          py: 2.5,
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: theme.palette.primary.main,
          color: 'white',
        }}
      >
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700 }}>
          AuditorBox
        </Typography>
      </Toolbar>

      <Box sx={{ overflow: 'auto', flex: 1, py: 2 }}>
        <List sx={{ px: 2 }}>
          {menuItems
            .filter((item) => !item.adminOnly || (user?.role && 'Admin' in user.role))
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
                    mb: 0.5,
                    borderRadius: 1.5,
                    bgcolor: isActive ? 'primary.main' : 'transparent',
                    color: isActive ? 'primary.contrastText' : 'text.primary',
                    '&:hover': {
                      bgcolor: isActive ? 'primary.dark' : 'action.hover',
                    },
                    transition: 'all 0.2s',
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: 'inherit',
                      minWidth: 40,
                    }}
                  >
                    <Icon />
                  </ListItemIcon>
                  <ListItemText
                    primary={t(item.label)}
                    primaryTypographyProps={{
                      fontSize: '0.9375rem',
                      fontWeight: isActive ? 600 : 500,
                    }}
                  />
                </ListItemButton>
              );
            })}
        </List>
      </Box>

      {user && (
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              p: 1.5,
              borderRadius: 1.5,
              bgcolor: 'grey.50',
            }}
          >
            <Avatar
              sx={{
                bgcolor: 'primary.main',
                width: 40,
                height: 40,
                fontSize: '1rem',
              }}
            >
              {user.name.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="subtitle2" noWrap>
                {user.name}
              </Typography>
              <Chip
                label={getRoleName(user.role)}
                size="small"
                color={getRoleColor(user.role) as any}
                sx={{ height: 20, fontSize: '0.75rem', mt: 0.5 }}
              />
            </Box>
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
        sx={{ bgcolor: 'background.paper', color: 'text.primary', borderBottom: 1, borderColor: 'divider' }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
            AuditorBox
          </Typography>
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
          bgcolor: 'background.paper',
          color: 'text.primary',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
            {t(menuItems.find((item) => item.path === location.pathname)?.label || 'AuditorBox')}
          </Typography>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <LanguageSwitcher />
            <IconButton onClick={handleProfileMenuOpen} size="large">
              <AccountIcon />
            </IconButton>
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
