import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
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
  TextField,
  CircularProgress,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useBackend } from '../hooks/useBackend';
import { Organization } from '../types';
import { useNotification } from '../components/NotificationSystem';
import ConfirmDialog from '../components/ConfirmDialog';

const Organizations = () => {
  const { t } = useTranslation();
  const { call, loading } = useBackend();
  const { showSuccess, showError } = useNotification();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [organizationToDelete, setOrganizationToDelete] = useState<{ id: bigint; name: string } | null>(null);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    loadOrganizations();
  }, []);

  const loadOrganizations = async () => {
    try {
      const orgs = await call<Organization[]>('list_organizations');
      setOrganizations(orgs);
    } catch (error: any) {
      console.error('Failed to load organizations:', error);
      showError(error.message || 'Failed to load organizations', 'Load Error');
    }
  };

  const handleCreate = () => {
    setEditingOrg(null);
    setFormData({ name: '', description: '' });
    setDialogOpen(true);
  };

  const handleEdit = (org: Organization) => {
    setEditingOrg(org);
    setFormData({ name: org.name, description: org.description });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      showError('Organization name is required', 'Validation Error');
      return;
    }

    try {
      if (editingOrg) {
        await call('update_organization', [
          {
            id: editingOrg.id,
            name: formData.name,
            description: formData.description,
          },
        ]);
        showSuccess('Organization updated successfully', 'Success');
      } else {
        await call('create_organization', [formData]);
        showSuccess('Organization created successfully', 'Success');
      }
      setDialogOpen(false);
      loadOrganizations();
    } catch (error: any) {
      console.error('Failed to save organization:', error);
      showError(error.message || 'Failed to save organization', 'Save Error');
    }
  };

  const handleDeleteClick = (id: bigint, name: string) => {
    setOrganizationToDelete({ id, name });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!organizationToDelete) return;

    try {
      await call('delete_organization', [organizationToDelete.id]);
      showSuccess(`Organization "${organizationToDelete.name}" deleted successfully`, 'Delete Success');
      setDeleteDialogOpen(false);
      setOrganizationToDelete(null);
      loadOrganizations();
    } catch (error: any) {
      console.error('Failed to delete organization:', error);
      showError(error.message || 'Failed to delete organization', 'Delete Error');
      setDeleteDialogOpen(false);
      setOrganizationToDelete(null);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          {t('organizations.title')}
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreate}
        >
          {t('organizations.create')}
        </Button>
      </Box>

      {loading && <CircularProgress />}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('organizations.name')}</TableCell>
              <TableCell>{t('organizations.description')}</TableCell>
              <TableCell>{t('organizations.createdAt')}</TableCell>
              <TableCell align="right">{t('organizations.actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {organizations.map((org) => (
              <TableRow key={org.id.toString()}>
                <TableCell>{org.name}</TableCell>
                <TableCell>{org.description}</TableCell>
                <TableCell>
                  {new Date(Number(org.created_at) / 1000000).toLocaleDateString()}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => handleEdit(org)}
                    color="primary"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteClick(org.id, org.name)}
                    color="error"
                    title={t('organizations.delete') || 'Delete Organization'}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingOrg ? t('organizations.edit') : t('organizations.create')}
        </DialogTitle>
        <DialogContent>
          <TextField
            label={t('organizations.name')}
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
          />
          <TextField
            label={t('organizations.description')}
            fullWidth
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>{t('common.cancel')}</Button>
          <Button onClick={handleSave} variant="contained">
            {t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setOrganizationToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title={t('organizations.deleteTitle') || 'Delete Organization'}
        message={organizationToDelete 
          ? t('organizations.deleteConfirm', { name: organizationToDelete.name }) || `Are you sure you want to delete "${organizationToDelete.name}"? This action cannot be undone and may affect associated entities and clients.`
          : ''}
        confirmText={t('organizations.delete') || 'Delete'}
        cancelText={t('common.cancel') || 'Cancel'}
        severity="error"
        confirmColor="error"
      />
    </Container>
  );
};

export default Organizations;

