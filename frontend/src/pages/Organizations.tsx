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

const Organizations = () => {
  const { t } = useTranslation();
  const { call, loading } = useBackend();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    loadOrganizations();
  }, []);

  const loadOrganizations = async () => {
    try {
      const orgs = await call<Organization[]>('list_organizations');
      setOrganizations(orgs);
    } catch (error) {
      console.error('Failed to load organizations:', error);
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
    try {
      if (editingOrg) {
        await call('update_organization', [
          {
            id: editingOrg.id,
            name: formData.name,
            description: formData.description,
          },
        ]);
      } else {
        await call('create_organization', [formData]);
      }
      setDialogOpen(false);
      loadOrganizations();
    } catch (error) {
      console.error('Failed to save organization:', error);
    }
  };

  const handleDelete = async (id: bigint) => {
    if (window.confirm('Are you sure you want to delete this organization?')) {
      try {
        await call('delete_organization', [id]);
        loadOrganizations();
      } catch (error) {
        console.error('Failed to delete organization:', error);
      }
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
                    onClick={() => handleDelete(org.id)}
                    color="error"
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
    </Container>
  );
};

export default Organizations;

