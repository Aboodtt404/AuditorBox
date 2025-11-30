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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useBackend } from '../hooks/useBackend';
import { Entity, Organization } from '../types';
import { useNotification } from '../components/NotificationSystem';
import ConfirmDialog from '../components/ConfirmDialog';

const Entities = () => {
  const { t } = useTranslation();
  const { call } = useBackend();
  const { showSuccess, showError } = useNotification();
  const [entities, setEntities] = useState<Entity[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [entityToDelete, setEntityToDelete] = useState<{ id: bigint; name: string } | null>(null);
  const [formData, setFormData] = useState({
    organization_id: '',
    name: '',
    description: '',
    taxonomy: '',
    taxonomy_config: '{}',
  });

  const getTaxonomyDisplay = (taxonomy: any) => {
    if (!taxonomy || !Array.isArray(taxonomy) || taxonomy.length === 0) {
      return t('entities.noTaxonomy');
    }
    
    const taxonomyKey = Object.keys(taxonomy[0])[0];
    const taxonomyNames: Record<string, string> = {
      'EAS': 'EAS (Egyptian Accounting Standards)',
      'GCC': 'GCC Standards',
      'IFRS': 'IFRS',
      'Custom': 'Custom'
    };
    
    return taxonomyNames[taxonomyKey] || taxonomyKey;
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [ents, orgs] = await Promise.all([
        call<Entity[]>('list_entities'),
        call<Organization[]>('list_organizations'),
      ]);
      setEntities(ents);
      setOrganizations(orgs);
    } catch (error: any) {
      console.error('Failed to load data:', error);
      showError(error.message || 'Failed to load entities', 'Load Error');
    }
  };

  const handleSave = async () => {
    if (!formData.organization_id) {
      showError('Organization is required', 'Validation Error');
      return;
    }
    if (!formData.name.trim()) {
      showError('Entity name is required', 'Validation Error');
      return;
    }

    try {
      // Properly handle optional taxonomy field - Candid expects [] for None or [value] for Some
      let taxonomy: any[] = [];
      if (formData.taxonomy && formData.taxonomy !== '') {
        taxonomy = [{ [formData.taxonomy]: null }];
      }

      await call('create_entity', [{
        organization_id: BigInt(formData.organization_id),
        name: formData.name,
        description: formData.description,
        taxonomy: taxonomy,
        taxonomy_config: formData.taxonomy_config,
      }]);
      
      showSuccess('Entity created successfully', 'Success');
      setDialogOpen(false);
      setFormData({
        organization_id: '',
        name: '',
        description: '',
        taxonomy: '',
        taxonomy_config: '{}',
      });
      loadData();
    } catch (error: any) {
      console.error('Failed to save entity:', error);
      showError(error.message || 'Failed to save entity', 'Save Error');
    }
  };

  const handleDeleteClick = (id: bigint, name: string) => {
    setEntityToDelete({ id, name });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!entityToDelete) return;

    try {
      await call('delete_entity', [entityToDelete.id]);
      showSuccess(`Entity "${entityToDelete.name}" deleted successfully`, 'Delete Success');
      setDeleteDialogOpen(false);
      setEntityToDelete(null);
      loadData();
    } catch (error: any) {
      console.error('Failed to delete entity:', error);
      showError(error.message || 'Failed to delete entity', 'Delete Error');
      setDeleteDialogOpen(false);
      setEntityToDelete(null);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">{t('entities.title')}</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => setDialogOpen(true)}>
          {t('entities.create')}
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('entities.name')}</TableCell>
              <TableCell>{t('entities.organization')}</TableCell>
              <TableCell>{t('entities.taxonomy')}</TableCell>
              <TableCell align="right">{t('common.edit')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {entities.map((entity) => (
              <TableRow key={entity.id.toString()}>
                <TableCell>{entity.name}</TableCell>
                <TableCell>
                  {organizations.find((o) => o.id === entity.organization_id)?.name}
                </TableCell>
                <TableCell>
                  {getTaxonomyDisplay(entity.taxonomy)}
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" color="primary"><Edit /></IconButton>
                  <IconButton 
                    size="small" 
                    color="error"
                    onClick={() => handleDeleteClick(entity.id, entity.name)}
                    title={t('entities.delete') || 'Delete Entity'}
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
        <DialogTitle>{t('entities.create')}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>{t('entities.organization')}</InputLabel>
            <Select
              value={formData.organization_id}
              onChange={(e) => setFormData({ ...formData, organization_id: e.target.value })}
            >
              {organizations.map((org) => (
                <MenuItem key={org.id.toString()} value={org.id.toString()}>
                  {org.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label={t('entities.name')}
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
          />
          <TextField
            label={t('entities.description')}
            fullWidth
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>{t('entities.taxonomy')}</InputLabel>
            <Select
              value={formData.taxonomy}
              onChange={(e) => setFormData({ ...formData, taxonomy: e.target.value })}
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="EAS">EAS (Egyptian Accounting Standards)</MenuItem>
              <MenuItem value="GCC">GCC Standards</MenuItem>
              <MenuItem value="IFRS">IFRS</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>{t('common.cancel')}</Button>
          <Button onClick={handleSave} variant="contained">{t('common.save')}</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setEntityToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title={t('entities.deleteTitle') || 'Delete Entity'}
        message={entityToDelete 
          ? t('entities.deleteConfirm', { name: entityToDelete.name }) || `Are you sure you want to delete "${entityToDelete.name}"? This action cannot be undone.`
          : ''}
        confirmText={t('entities.delete') || 'Delete'}
        cancelText={t('common.cancel') || 'Cancel'}
        severity="error"
        confirmColor="error"
      />
    </Container>
  );
};

export default Entities;

