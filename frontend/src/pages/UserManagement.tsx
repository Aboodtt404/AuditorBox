import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
} from '@mui/material';
import { Edit } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useBackend } from '../hooks/useBackend';
import { User, UserRole } from '../types';
import { Principal } from '@dfinity/principal';

const UserManagement = () => {
  const { t } = useTranslation();
  const { call } = useBackend();
  const [users, setUsers] = useState<User[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState<string>('Staff');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await call<User[]>('list_users');
      setUsers(data);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const getRoleName = (role: UserRole): string => {
    return Object.keys(role)[0];
  };

  const createRoleVariant = (roleName: string): UserRole => {
    return { [roleName]: null } as UserRole;
  };

  const handleEditRole = (user: User) => {
    setSelectedUser(user);
    setNewRole(getRoleName(user.role));
    setDialogOpen(true);
  };

  const handleSaveRole = async () => {
    if (!selectedUser) return;

    try {
      const principalStr = typeof selectedUser.principal === 'string' 
        ? selectedUser.principal 
        : selectedUser.principal.toString();
      
      // Convert string to Principal object
      const principal = Principal.fromText(principalStr);
      
      await call('update_user_role', [principal, createRoleVariant(newRole)]);
      setDialogOpen(false);
      loadUsers();
      alert('User role updated successfully!');
    } catch (error) {
      console.error('Failed to update user role:', error);
      alert('Failed to update user role');
    }
  };

  const getRoleColor = (role: UserRole) => {
    const roleName = getRoleName(role);
    switch (roleName) {
      case 'Admin':
        return 'error';
      case 'Partner':
        return 'warning';
      case 'Manager':
        return 'info';
      case 'Senior':
        return 'primary';
      case 'Staff':
        return 'default';
      case 'ClientUser':
        return 'secondary';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        {t('users.title')}
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Principal</TableCell>
              <TableCell>{t('users.role')}</TableCell>
              <TableCell>{t('users.email')}</TableCell>
              <TableCell>{t('users.language')}</TableCell>
              <TableCell>{t('users.createdAt')}</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => {
              const principalStr = typeof user.principal === 'string' 
                ? user.principal 
                : user.principal.toString();
              return (
                <TableRow key={principalStr}>
                  <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                    {principalStr.slice(0, 20)}...
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={t(`users.roles.${getRoleName(user.role)}`)}
                      color={getRoleColor(user.role)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{user.email || '-'}</TableCell>
                  <TableCell>{user.language_preference.toUpperCase()}</TableCell>
                  <TableCell>
                    {new Date(Number(user.created_at) / 1000000).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => handleEditRole(user)}
                      color="primary"
                    >
                      <Edit />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>{t('users.changeRole')}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" gutterBottom>
              User: {selectedUser ? (typeof selectedUser.principal === 'string' 
                ? selectedUser.principal.slice(0, 20) 
                : selectedUser.principal.toString().slice(0, 20)) : ''}...
            </Typography>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>{t('users.role')}</InputLabel>
              <Select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as string)}
              >
                <MenuItem value="Admin">
                  {t('users.roles.Admin')}
                </MenuItem>
                <MenuItem value="Partner">
                  {t('users.roles.Partner')}
                </MenuItem>
                <MenuItem value="Manager">
                  {t('users.roles.Manager')}
                </MenuItem>
                <MenuItem value="Senior">
                  {t('users.roles.Senior')}
                </MenuItem>
                <MenuItem value="Staff">
                  {t('users.roles.Staff')}
                </MenuItem>
                <MenuItem value="ClientUser">
                  {t('users.roles.ClientUser')}
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>{t('common.cancel')}</Button>
          <Button onClick={handleSaveRole} variant="contained">
            {t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserManagement;

