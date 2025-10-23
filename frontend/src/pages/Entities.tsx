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

const Entities = () => {
  const { t } = useTranslation();
  const { call } = useBackend();
  const [entities, setEntities] = useState<Entity[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    organization_id: '',
    name: '',
    description: '',
    taxonomy: '',
    taxonomy_config: '{}',
  });

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
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const handleSave = async () => {
    try {
      await call('create_entity', [{
        organization_id: BigInt(formData.organization_id),
        name: formData.name,
        description: formData.description,
        taxonomy: formData.taxonomy ? [{ [formData.taxonomy]: null }] : [],
        taxonomy_config: formData.taxonomy_config,
      }]);
      setDialogOpen(false);
      loadData();
    } catch (error) {
      console.error('Failed to save entity:', error);
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
                  {entity.taxonomy ? JSON.stringify(entity.taxonomy) : 'None'}
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" color="primary"><Edit /></IconButton>
                  <IconButton size="small" color="error"><Delete /></IconButton>
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
              <MenuItem value="USGAAP">US GAAP</MenuItem>
              <MenuItem value="IFRS">IFRS</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>{t('common.cancel')}</Button>
          <Button onClick={handleSave} variant="contained">{t('common.save')}</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Entities;

